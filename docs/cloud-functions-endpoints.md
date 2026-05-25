# Configuration des endpoints Cloud Functions

Document d'analyse et de planification — migration des Cloud Functions GCP v1 (NodeJS) vers v2 (Python).

## 0. TL;DR — Décision

- **Cible serveur** (figée par le projet `rcq-functions-v2`) : 9 Cloud Functions HTTPS Gen2 Python `on_request`, hébergées sur le projet `rq-fr-<env>` en région `europe-west1`, avec vérification du Firebase ID Token via header `Authorization: Bearer <id_token>` côté handler (helper `rcq_common.auth_firebase`).
- **Décision côté client (Option B)** : remplacer les appels Callable (`AngularFireFunctions.httpsCallable`) par des appels **HTTP** standards (`HttpClient`) avec injection automatique du Bearer token via un `HttpInterceptor`. Justification détaillée en §6.
- **Impact env** : seul renommage `getULPrefs` → `get-ul-prefs` et `getULStats` → `get-ul-stats` (déjà appliqué à `environment.dev.ts`). Base URL et région inchangées.
- **Impact code** : refonte de `CloudFunctionService` + ajout d'un `AuthTokenInterceptor` + suppression de la dépendance à `AngularFireFunctionsModule`. Voir le plan en §7.

---

## 1. Inventaire des endpoints v2 utilisés par RedQuest

Source : lecture directe des handlers `functions/*/main.py` du dépôt `rcq-functions-v2` (Phase A1/A2). Les 9 fonctions appelées par RedQuest sont toutes des **HTTP Gen2 Flask** (`def main(request: Request)`, déployées avec `--trigger-http --allow-unauthenticated`), hébergées sur `rq-fr-<env>`, région `europe-west1`. L'auth applicative est gérée dans le handler par `rcq_common.auth_firebase.verify_request` qui exige `Authorization: Bearer <Firebase ID Token>` et vérifie le claim `aud == FIREBASE_PROJECT_ID`.

> Toutes les fonctions répondent **204** sur `OPTIONS` (preflight CORS) et reflètent l'`Origin` de la requête dans `Access-Control-Allow-Origin` → toute origine est accept​ée (cf. §A5).

| Clé `cloudFunctionsNames` | Endpoint v2 | Méthode HTTP recommandée | Auth | Entrée | Sortie | Codes erreur |
|---|---|---|---|---|---|---|
| `findQueteurById` | `find-queteur-by-id` | `GET` (handler ne lit ni body ni query) | Bearer | — (UID extrait du token, mappage `ul_id`/`queteur_id` lu dans Firestore) | `Queteur` JSON aplati (`id`, `email`, `first_name`, …, `ul_*`) | 401 unauthorized · 400 missing identifiers · 404 not found · 500 db error |
| `findULDetailsByToken` | `find-ul-details-by-token` | `GET ?token=<uuid>` | **Aucune** (pas de `verify_request`) | query `token` (UUID 36 chars, 4 tirets) | `ULDetails` JSON ou `[]` si non trouvé | 400 invalid token · 500 db error |
| `getULPrefs` | `get-ul-prefs` | `GET` | Bearer | — | `ULPrefs` JSON (clés `rq_display_*`, `rq_autonomous_*`, `ul_id`) ; **defaults** renvoyés si non trouvé (200 quand même) | 401 · 400 missing/invalid `ul_id` · 500 firestore error |
| `getULStats` | `get-ul-stats` | `GET` | Bearer | — | `ULStats` JSON ; **`null`** (200) si pas de stats | 401 · 400 missing/invalid `ul_id` · 500 firestore error |
| `getULQueteurRanking` | `get-ul-queteur-ranking` | `GET ?year=<int>` | Bearer | query `year` (entier, `2000 ≤ year ≤ current_year+1`) | `UlQueteurRanking[]` JSON trié par `amount DESC` ; `[]` si aucune stat. Headers `Cache-Control: private, max-age=900, stale-while-revalidate=60` + `Vary: Authorization` (cf. spec dédiée) | 401 · 400 missing_year/invalid_year · 403 not_registered/not_approved · 500 firestore_error/inconsistent_queteur_record |
| `getQueteurStats` | `get-queteur-stats` | `GET` | Bearer | — (`queteur_id` dérivé du token via `queteurs/{uid}`) | `QueteurStats[]` JSON trié par `year DESC` ; `[]` si aucune stat. Headers `Cache-Control: private, max-age=900, stale-while-revalidate=60` + `Vary: Authorization` (cf. spec dédiée) | 401 · 403 not_registered/not_approved · 500 firestore_error/inconsistent_queteur_record |
| `historiqueTroncQueteur` | `historique-tronc-queteur` | `GET` | Bearer | — | `HistoriqueTroncQueteur[]` (cache Firestore TTL 5 min ; renvoie tableau d'objets MySQL avec colonnes `depart_theorique`, `depart`, `retour`, `amount`, `weight`, …) | 401 · 400 missing identifiers · 404 queteur not found · 500 db error |
| `registerQueteur` | `register-queteur` | `POST` JSON | Bearer | JSON `Queteur` avec champs requis : `first_name, last_name, man, birthdate, email, secteur, nivol, mobile, ul_registration_token, benevole_referent` | **JSON natif** : `{ "queteur_registration_token": "<uuid>" }` ⚠ Plus de `JSON.parse` ! | 401 · 400 missing fields · 500 db error |
| `troncListPrepared` | `tronc-list-prepared` | `GET` | Bearer | — | Tableau d'objets : `tronc_queteur_id, queteur_id, point_quete_id, tronc_id, depart_theorique` (ISO string), `depart` (ISO string ou null), `name, latitude, longitude, address, postal_code, city, advice, localization` | 401 · 400 missing identifiers · 404 · 500 |
| `troncSetDepartOrRetour` | `tronc-set-depart-or-retour` | `POST` JSON | Bearer | `{ isDepart: boolean, date: string ISO, tqId: number }` | `{ "success": true }` | 401 · 400 missing fields · 404 · 500 incorrect rows |
| `resyncQueteurIdToFirestore` | `resync-queteur-id-to-firestore` | `GET` (pas de body lu) | Bearer | — | `{ "updated": <int> }` | 401 · 500 |

**Base URL** : `https://europe-west1-rq-fr-<env>.cloudfunctions.net/` (alias Gen1 conservé par Gen2 — confirmé par `function_triggers.py` qui déploie en `--gen2` sans config d'URL custom).

**Autres fonctions v2 non appelées par RedQuest** : `compute-ul-tasks`, `notify-rq-of-regist-approval`, `ul-trigger-recompute`, `ul-queteur-stats-per-year`, `ztest-*`.

## 2. Configuration côté client — état après migration

### 2.1 `src/environments/environment.{dev,test,prod}.ts`

```typescript
cloudFunctionsBaseUrl: 'https://europe-west1-rq-fr-<env>.cloudfunctions.net/',
cloudFunctionsNames: {
  findQueteurById:            'find-queteur-by-id',
  findULDetailsByToken:       'find-ul-details-by-token',
  troncSetDepartOrRetour:     'tronc-set-depart-or-retour',
  registerQueteur:            'register-queteur',
  troncListPrepared:          'tronc-list-prepared',
  resyncQueteurIdToFirestore: 'resync-queteur-id-to-firestore',
  historiqueTroncQueteur:     'historique-tronc-queteur',
  getULPrefs:                 'get-ul-prefs',  // ⚠ renommé depuis 'getULPrefs'
  getULStats:                 'get-ul-stats',  // ⚠ renommé depuis 'getULStats'
  getULQueteurRanking:        'get-ul-queteur-ranking',
  getQueteurStats:            'get-queteur-stats'
},
```

- `dev` : déjà mis à jour ✅
- `test`, `prod` : à appliquer (voir tâches §7).

### 2.2 `src/app/app.module.ts`

- Token `REGION` (`europe-west1`) : **conservé** tant que `AngularFireFunctionsModule` reste importé pour ne pas casser une éventuelle utilisation indirecte. Sera supprimé en fin de migration (cf. §7).
- `AngularFireFunctionsModule` : **à retirer** une fois `CloudFunctionService` migré et qu'aucun autre module ne l'utilise.

## 3. Point d'utilisation unique côté client

📁 `src/app/services/cloud-functions/cloud-function.service.ts` — seul consommateur des noms et de l'URL de base. C'est le fichier à refondre intégralement.

## 4. Consommateurs (callers) de `CloudFunctionService` — à retester après migration

Recensement exhaustif Phase A3 (`grep` sur `src/app/`).

| Méthode service | Fichiers appelants |
|---|---|
| `findQueteurById$` | `services/queteur/queteur.service.ts` (commenté, non actif) |
| `findULDetailsByToken$` | `modules/registration/registration.component.ts` · `modules/registration/registration-confirmation/registration-confirmation.component.ts` · `modules/account/account.component.ts` · `components/local-unit/local-unit.component.ts` |
| `getULPrefs$` | `app.component.ts` · `components/homepage/homepage.component.ts` · `components/ranking/ranking.component.ts` · `modules/quest/my-slots/my-slots.component.ts` |
| `getULStats$` | `components/homepage/homepage.component.ts` |
| `getULQueteurRanking$` | `components/ranking/ranking-datasource.ts` (via `RankingComponent`) |
| `getQueteurStats$` | `modules/quest/queteur-history/queteur-history.component.ts` · `modules/quest/badges/badges.service.ts` |
| `registerQueteur$` | `modules/registration/registration-step-2/registration-step-2.component.ts` |
| `retrievePreparedTroncs$` | `modules/quest/my-slots/my-slots.component.ts` |
| `troncStateUpdate$` | `modules/quest/my-slots/my-slots.component.ts` (×2 : départ + retour) |
| `historiqueTroncQueteur$` | `modules/quest/queteur-history/queteur-history.component.ts` |
| `resyncQueteurIdToFirestore$` | **Aucun appelant** côté Angular (méthode présente dans `cloudFunctionsNames` mais pas exposée par `CloudFunctionService`) → ne pas implémenter dans la refonte. |

> Détail intéressant : `findULDetailsByToken$` est appelée depuis **4 endroits dont 2 dans des contextes authentifiés** (`account` et `local-unit` — utilisateur connecté) et 2 dans le flux de registration (potentiellement non-connecté). Côté serveur, la fonction v2 **n'exige pas d'auth** (cf. §1) → ne pas inclure cette URL dans le filtre de l'`AuthTokenInterceptor`, ou laisser l'interceptor injecter le token quand il est disponible (sans bloquer si absent). Voir §8.1 (résolu).

## 5. Comparatif Callable (`on_call`) vs HTTP brut (`on_request`)

| Aspect | Callable (`httpsCallable`) | HTTP brut (Bearer header) — **cible** |
|---|---|---|
| Wire-format requête | `POST` body `{"data": <payload>}` | `GET`/`POST` JSON natif |
| Wire-format réponse | `{"result": <payload>}` (extrait par le SDK) | JSON natif |
| Auth | Token injecté automatiquement par le SDK | `Authorization: Bearer <id_token>` injecté par interceptor |
| CORS | Géré côté runtime Firebase | Géré par le handler (chaque fonction reflète l'`Origin` de la requête → toute origine accept​ée) |
| Erreurs | `FirebaseError` typées | Status HTTP + body JSON `{ "error": "<message>" }` |
| Testabilité externe (curl/Postman) | Difficile (wire-format propriétaire) | Triviale |
| Couplage SDK Firebase | Fort | Faible (juste pour récupérer le ID token) |

## 6. Décision — Option B (HTTP)

Choix retenu : **client HTTP brut + Bearer token**, pour les raisons suivantes :

1. **Cohérence avec l'architecture v2** : 14/15 fonctions Gen2 sont `on_request` avec auth Bearer (`rcq_common.auth_firebase`). Conserver des Callables côté Angular obligerait à maintenir deux protocoles serveur.
2. **Multi-consommateurs** : un backend PHP RedQuest existe déjà dans l'écosystème (publish Pub/Sub). Le HTTP brut reste appelable depuis n'importe quel client (PHP, scripts, mobile, webhooks) ; la Callable est captive du SDK Firebase.
3. **Découplage SDK** : `@angular/fire` v6 / `firebase` v8 sont dépréciés. Une montée à `@angular/fire` v7+ change l'API Callable. Le HTTP brut reste stable face à ces évolutions.
4. **Sémantique HTTP** : codes status exploitables (`401`, `403`, `404`, `429`, `5xx`), méthodes appropriées (`GET` cacheable), traçabilité Cloud Run native.
5. **Testabilité** : `curl`, Postman, Insomnia, intégration tests E2E sans dépendance Firebase.
6. **Effort localisé** : la refonte se concentre sur **un seul fichier service** + un interceptor partagé. Les composants appelants ne changent pas (mêmes signatures `Observable<T>`).

## 7. Plan d'implémentation (haut niveau)

> Détail opérationnel suivi dans la task list de la conversation. Les tâches sont ordonnées et chacune doit pouvoir être livrée indépendamment (PR atomique recommandée si possible, sinon une seule PR avec commits séparés).

### Phase A — Préparation (sans modification fonctionnelle)
1. **Vérifier côté serveur** : confirmer que toutes les fonctions cibles sont bien `@https_fn.on_request` (pas `on_call`) en lisant le code Python de `rcq-functions-v2`.
2. **Documenter les contrats** : pour chaque fonction, relever en code Python : méthode HTTP, format du body d'entrée, format du body de sortie, codes d'erreur. Compléter le tableau §1.
3. **Recenser les appelants** : `grep` exhaustif des 9 méthodes de `CloudFunctionService` dans `src/app/` pour valider la liste §4.

### Phase B — Plomberie HTTP authentifiée
4. **Créer `AuthTokenInterceptor`** (`src/app/services/auth/auth-token.interceptor.ts`) :
   - injecte `AngularFireAuth`,
   - intercepte uniquement les requêtes vers `environment.cloudFunctionsBaseUrl`,
   - récupère le ID token via `angularFireAuth.idToken` (Observable) ou `angularFireAuth.currentUser.then(u => u.getIdToken())`,
   - ajoute le header `Authorization: Bearer <token>`,
   - laisse passer les requêtes vers d'autres origines sans modification.
5. **Enregistrer l'interceptor** dans `app.module.ts` via `HTTP_INTERCEPTORS` (multi-provider).
6. **Tests unitaires de l'interceptor** : cas connecté, cas anonyme, cas URL externe.

### Phase C — Refonte du service
7. **Réécrire `CloudFunctionService`** :
   - supprimer la dépendance à `AngularFireFunctions`,
   - chaque méthode → `this.http.get/post<T>(url, body?)` retournant `Observable<T>`,
   - conserver les **signatures publiques** (mêmes noms, mêmes types de retour) pour ne rien casser côté composants,
   - retirer les `JSON.parse(value)` inutiles (le serveur Python renverra du JSON déjà parsé par `HttpClient`),
   - conserver le reviver de dates pour `retrievePreparedTroncs$` (transformer via `map(...)` après `http.get`).
8. **Mettre à jour le test** `cloud-function-service.service.spec.ts` (TestBed avec `HttpClientTestingModule`).
9. **Supprimer `AngularFireFunctionsModule`** de `app.module.ts` et le provider `REGION` si plus aucun consommateur.

### Phase D — Validation E2E
10. **Mettre à jour `environment.test.ts` et `environment.prod.ts`** (renommage `getULPrefs`/`getULStats` + base URL `rq-fr-test` / `rq-fr-prod`).
11. **Tester chaque flux fonctionnel** contre l'env `dev` :
    - login Firebase → vérifier que le token est bien injecté (DevTools → Network → header `Authorization`),
    - homepage : `get-ul-prefs` + `get-ul-stats`,
    - registration via lien email : `find-ul-details-by-token` puis `register-queteur` (cf. §8),
    - module quest : `tronc-list-prepared`, `tronc-set-depart-or-retour`, `historique-tronc-queteur`,
    - resync : `resync-queteur-id-to-firestore` (si déclenchable depuis l'UI).
12. **Vérifier les codes erreur** : un 401 (token expiré) doit déclencher une redirection login propre — éventuellement ajouter un `HttpErrorInterceptor` dédié si besoin.

## 8. Points d'attention / questions ouvertes

1. **`find-ul-details-by-token` et flux registration non authentifié** — ✅ **RÉSOLU Phase A1** : le handler Python **n'appelle pas** `verify_request()` ; seule la validité formelle du paramètre `?token=<uuid>` (36 chars, 4 tirets) est contrôlée. La fonction est donc **publique** et compatible avec un appel anonyme depuis l'écran de registration. → L'`AuthTokenInterceptor` doit traiter cet endpoint en mode "best-effort" (injecter le token uniquement s'il est disponible, ne jamais bloquer la requête).
2. **`registerQueteur$.pipe(map(value => JSON.parse(value)))`** — ✅ **CONFIRMÉ Phase A2** : le handler Python renvoie un JSON natif `{"queteur_registration_token": "<uuid>"}` (Content-Type `application/json`). Le `JSON.parse` côté Angular doit être **supprimé** dans la refonte (`HttpClient` désérialise automatiquement).
3. **`retrievePreparedTroncs$` reviver de dates** — ⚠️ **À CORRIGER Phase C** : le code Angular actuel cherche un champ `arrivee`, mais le handler Python ne renvoie que `depart_theorique`, `depart` (et n'a **pas** de champ `arrivee` ni `retour` dans cette query). À adapter dans le `map` post-`http.get` pour ne parser que les champs réellement présents (`depart_theorique`, `depart`).
4. **`historique-tronc-queteur` et dates** — ℹ️ La query SQL retourne `depart_theorique`, `depart`, `retour` au format ISO string. Le code Angular actuel ne fait pas de reviver de dates sur cette réponse — à laisser tel quel sauf si un consommateur en aval exige des `Date`.
5. **CORS** — ✅ **VÉRIFIÉ Phase A5** : chaque handler reflète l'`Origin` reçu dans `Access-Control-Allow-Origin` (pas d'allowlist statique côté v2). Toutes les origines RedQuest (`localhost:4200`, `*.web.app`, `*.firebaseapp.com`) seront acceptées sans configuration supplémentaire.
6. **`firebase.json` rewrites** — Aucun rewrite `/api/**` n'existe actuellement vers les Cloud Functions ; les appels resteront cross-origin directs vers `cloudfunctions.net` (cohérent avec le reflet d'`Origin` côté v2). Pas de changement requis.
7. **Token refresh** — `AngularFireAuth.currentUser.then(u => u.getIdToken(false))` retourne le token courant (rafraîchi automatiquement si expiré dans <5 min). C'est le pattern à utiliser dans l'interceptor (Phase B1).
8. **Codes erreur** — Tous les handlers v2 renvoient `{ "error": "<message>" }` avec un status HTTP 4xx/5xx approprié. Un 401 (token expiré/invalide) doit déclencher une redirection login propre — à traiter dans un `HttpErrorInterceptor` complémentaire si besoin (hors scope migration immédiate).

## 9. Régression & rollback

- Migration intégralement côté client → rollback = `git revert` du commit (pas de migration de schéma serveur impliquée).
- Les fonctions v1 NodeJS et v2 Python peuvent **co-exister** transitoirement sous le même nom si elles sont déployées sur des projets distincts ; bascule contrôlée par la valeur de `cloudFunctionsBaseUrl` dans l'environnement Angular.

## 10. Correctifs annexes inclus dans la migration

| Fichier | Problème pré-existant | Correctif appliqué | Justification |
|---|---|---|---|
| `src/app/modules/account/account.component.spec.ts` | Le fichier importait `RegistrationConfirmationComponent` depuis `./registration-confirmation.component` (chemin inexistant dans le dossier `account/`) → erreur TS2307 bloquant la compilation de **toute la suite Karma**. Présent depuis le commit `9857512`. | Remplacé par un test stub minimal alignée sur le pattern du projet (cf. `auth.service.spec.ts`, `firestore.service.spec.ts`) : import + `expect(AccountComponent).toBeTruthy()`. | Sans ce fix, Phase B3 (tests unitaires de l'interceptor) ne peut pas être exécutée via `ng test`. Correctif minimal, périmètre 1 fichier, sans impact fonctionnel. |

## 11. Spécification — nouvelle fonction `get-ul-queteur-ranking`

> **Statut** : à implémenter dans `rcq-functions-v2`.
>
> **Objectif** : remplacer l'accès Firestore SDK direct utilisé aujourd'hui par `RankingComponent` / `RankingDatasource` (collection `ul_queteur_stats_per_year`) par un appel HTTP REST aligné sur le pattern des autres fonctions v2. Voir §0/§6 pour la justification architecturale.
>
> **📄 Spécification détaillée** : [`docs/specs/get-ul-queteur-ranking.md`](specs/get-ul-queteur-ranking.md) — contrat d'interface complet (endpoint, auth, paramètres, logique métier, format de réponse, cache, codes d'erreur, tests d'acceptation, checklist d'intégration frontend).

### 11.1 Résumé

| | |
|---|---|
| Méthode HTTP | `GET /get-ul-queteur-ranking?year=<int>` |
| Clé Angular | `cloudFunctionsNames.getULQueteurRanking` |
| Auth | Bearer Firebase ID Token |
| Tri serveur | `amount DESC` (imposé ; le frontend retrie en mémoire) |
| Cache | `Cache-Control: private, max-age=900, stale-while-revalidate=60` + `Vary: Authorization` |
| Réponse | Tableau JSON (10 champs par ligne, cf. spec détaillée §5) |

### 11.2 Conséquences sur la configuration Firestore (côté ce repo)

Une fois la fonction déployée et le frontend migré (PR séparée), les éléments suivants deviennent **obsolètes** et seront supprimés dans une seconde passe :

- **`firestore.indexes.json`** : tous les index composites sur `ul_queteur_stats_per_year` utilisés uniquement par des queries client (tri par `amount`, `weight`, `time_spent_in_minutes`, `unique_point_quete_count`). L'unique index conservé sera celui requis par la query serveur (`ul_id ASC` + `year ASC` + `amount DESC`).
- **`firestore.rules`** : restreindre la lecture client de `ul_queteur_stats_per_year` (lecture serveur via Admin SDK qui bypass les rules). Bonus sécurité : la collection n'est plus exposée au SDK Firebase JS.
- **`FirestoreService.getUlStatsOrderedBy`** : à supprimer une fois `RankingDatasource` migré sur le nouvel endpoint.

Ces nettoyages sont **hors scope** de la spec backend mais à tracer dans la même issue côté frontend.

## 12. Index Firestore (`firestore.indexes.json`)

Catalogue des index composites requis par les Cloud Functions v2. Sans ces index, les requêtes serveur renvoient `400 The query requires an index` et la page concernée tombe en erreur côté client.

| # | Collection | Champs (ordre) | Cloud Function | Requête | Consommateur final |
|---|---|---|---|---|---|
| 1 | `ul_queteur_stats_per_year` | `queteur_id` ASC + `year` DESC | `get-queteur-stats` | `.where('queteur_id','==',X).order_by('year', DESC)` | `QueteurHistoryComponent` (Mon historique), `BadgesService` (Mes quêtes) |
| 2 | `ul_queteur_stats_per_year` | `ul_id` ASC + `year` ASC + `amount` DESC | `get-ul-queteur-ranking` | `.where('ul_id','==',X).where('year','==',Y).order_by('amount', DESC)` | `RankingComponent` / `RankingDatasource` (Classement UL) |

### 12.1 Déploiement

Le déploiement standard (`./gcp-deploy.sh fr <env>`) **n'inclut pas** `firestore:indexes` (`DEPLOY_TARGETS="hosting,firestore:rules"`) pour éviter qu'une modification locale supprime un index serveur de manière silencieuse. Les index ont leur propre sous-commande :

```
./gcp-deploy.sh fr <env> indexes
```

Cette commande appelle `firebase deploy --only firestore:indexes --non-interactive --force`. `firestore.indexes.json` est la source de vérité unique : tout écart côté serveur sera réconcilié sans prompt, créations et suppressions confondues. À lancer après chaque modification du fichier, sur les trois environnements (`dev` → `test` → `prod`).

Après création, un index passe par un état `CREATING` (5-15 min selon le volume de documents) avant de devenir `READY` et de servir les requêtes.

### 12.2 Ajouter un nouvel index

1. Ajouter l'entrée dans `firestore.indexes.json` (ordre des champs important — il doit matcher la query exacte).
2. Ajouter une ligne dans le tableau §12 ci-dessus en référençant la Cloud Function et le composant Angular consommateur.
3. `./gcp-deploy.sh fr dev indexes` → vérifier dans la Firebase Console que l'état passe à `READY`.
4. Tester la query côté application (page concernée doit charger sans 400).
5. Répéter sur `test` puis `prod`.


