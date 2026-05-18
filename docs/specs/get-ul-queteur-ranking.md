# Spécification — Cloud Function `get-ul-queteur-ranking`

**Statut** : à implémenter dans `rcq-functions-v2`.
**Repo client** : RedQuest (Angular) — consommée par `RankingComponent` / `RankingDatasource`.
**Objectif** : remplacer l'accès Firestore SDK direct (collection `ul_queteur_stats_per_year`) par un appel HTTP REST aligné sur le pattern des autres fonctions v2.

Contrat d'interface entre backend Python et frontend Angular. Référence transverse : `docs/cloud-functions-endpoints.md` (§1 inventaire des fonctions, §6 décision HTTP/Bearer, §8 points d'attention).

---

## 1. Endpoint & méthode

| | |
|---|---|
| Méthode HTTP | `GET` |
| URL | `https://europe-west1-rq-fr-<env>.cloudfunctions.net/get-ul-queteur-ranking` |
| Clé Angular | `cloudFunctionsNames.getULQueteurRanking` |
| Région GCP | `europe-west1` |
| Runtime | Python (Cloud Functions Gen2, `@https_fn.on_request`) |
| Préflight CORS | `OPTIONS` → `204` avec reflet de l'`Origin` (même pattern que les 9 autres fonctions v2) |

## 2. Authentification

- Header `Authorization: Bearer <Firebase ID Token>` **obligatoire**.
- Vérification via `rcq_common.auth_firebase.verify_request` (mêmes garanties que `get-ul-prefs` / `get-ul-stats` : signature, expiration, `aud == FIREBASE_PROJECT_ID`).
- Côté client : injection automatique par `AuthTokenInterceptor` (déjà en place dans RedQuest).

## 3. Paramètres de requête (query string)

| Nom | Type | Obligatoire | Validation | Description |
|---|---|---|---|---|
| `year` | `int` | ✅ | Entier positif, `2000 ≤ year ≤ (current_year + 1)` | Année calendaire de la quête. L'année courante est attendue dans 99 % des cas ; les valeurs antérieures sont autorisées pour consultation historique. |

> **Pas de tri configurable côté serveur.** Le tri est imposé (`amount DESC` — cf. §5) ; le frontend retrie en mémoire selon le clic colonne. Ce choix élimine la combinatoire d'index Firestore composites (cf. §10).

## 4. Logique métier

1. **Auth** — appeler `verify_request(request)` ; en cas d'échec → `401`.
2. **Résolution UL** — lire le document `queteurs/{uid}` dans Firestore (projet `rq-fr-<env>`, base `(default)`) :
   - si le doc n'existe pas → `403 not_registered`,
   - si `registration_approved != True` → `403 not_approved`,
   - sinon extraire `ul_id` (typé `int`). Si absent → `500 inconsistent_queteur_record`.
3. **Validation `year`** — parser le query param, valider la borne (§3). Manquant ou invalide → `400 missing_year` / `400 invalid_year`.
4. **Query Firestore** (Admin SDK, bypass des security rules) :
   ```python
   db.collection('ul_queteur_stats_per_year') \
     .where('ul_id', '==', ul_id) \
     .where('year',  '==', year) \
     .order_by('amount', direction=firestore.Query.DESCENDING) \
     .stream()
   ```
   Pas de `.limit()` côté serveur : le volume par UL × année est borné (typiquement < 500 docs ; cas extrême < 2 000). Le payload reste sous 200 KB compressé.
5. **Projection** — mapper chaque document vers le contrat de sortie (§5). Les champs absents du document Firestore sont renvoyés à `0` (numériques) ou `""` (chaînes) pour éviter `null` côté client.
6. **Réponse** — `200 OK` + JSON tableau + headers de cache (§6).

## 5. Format de réponse

**Content-Type** : `application/json; charset=utf-8`
**Body** : tableau JSON (jamais `null` ; tableau vide `[]` si aucune stat pour l'UL/année).

```json
[
  {
    "queteur_id": 2558,
    "first_name": "Thomas",
    "last_name": "Manson",
    "amount": 1234.56,
    "weight": 4321,
    "time_spent_in_minutes": 540,
    "number_of_tronc_queteur": 7,
    "number_of_point_quete": 5,
    "total_number_of_point_quete": 12,
    "year": 2026
  }
]
```

| Champ | Type JSON | Source Firestore | Notes |
|---|---|---|---|
| `queteur_id` | `int` | `queteur_id` | Identifiant MySQL du quêteur (utilisé côté UI pour mettre en gras la ligne de l'utilisateur courant). |
| `first_name` | `string` | `first_name` | Affiché via `\| titlecase`. |
| `last_name` | `string` | `last_name` | Affiché via `\| titlecase`. |
| `amount` | `number` (float) | `amount` | Montant en euros, 2 décimales possibles. Tri par défaut DESC. |
| `weight` | `number` (int, grammes) | `weight` | Affiché via le pipe `\| weight`. |
| `time_spent_in_minutes` | `number` (int) | `time_spent_in_minutes` | Affiché via le pipe `\| time`. |
| `number_of_tronc_queteur` | `number` (int) | `number_of_tronc_queteur` | Nombre de troncs quêtés par ce quêteur. |
| `number_of_point_quete` | `number` (int) | `number_of_point_quete` | Points de quête distincts utilisés par ce quêteur. |
| `total_number_of_point_quete` | `number` (int) | `total_number_of_point_quete` | Total des points de quête de l'UL (référentiel) — identique sur tous les docs d'une même UL/année. Renvoyé sur chaque ligne pour simplifier le rendu UI (`{{n}}/{{total}}`). |
| `year` | `number` (int) | `year` | Recopié pour traçabilité (le frontend l'affiche en colonne et l'utilise comme clé de cache). |

**Tri serveur** : `amount DESC` strict. Pas de tie-breaker garanti (l'ordre Firestore sur égalité d'`amount` est non spécifié) ; côté client, le retri in-memory est stable.

**Champs explicitement non renvoyés** :
- `ul_id` (déduit du token, jamais utile au rendu).
- `tronc_count` / `unique_point_quete_count` (anciens noms de l'ancien modèle `UlRankingByAmount`) — on retient les noms `number_of_tronc_queteur` et `number_of_point_quete` qui correspondent au schéma écrit par `compute_ul_queteur_stats_per_year`.

## 6. Stratégie de cache HTTP

Headers de réponse à émettre par le handler sur `200 OK` :

```
Cache-Control: private, max-age=900, stale-while-revalidate=60
Vary: Authorization
```

| Directive | Valeur | Justification |
|---|---|---|
| `private` | — | Réponse spécifique à l'UL de l'utilisateur authentifié. Interdit le cache par les proxies / CDN intermédiaires ; autorise seulement le cache **navigateur** de l'utilisateur. |
| `max-age` | `900` (15 min) | Aligné sur la fréquence de recalcul backend (`compute_ul_queteur_stats_per_year` scheduler, toutes les 15 min). Au-delà, les données peuvent être stale ; en deçà, on évite tout aller-retour réseau. |
| `stale-while-revalidate` | `60` (60 s) | Permet au navigateur de servir la réponse expirée pendant qu'il revalide en arrière-plan → UX instantanée sur revisite juste après expiration. |
| `Vary` | `Authorization` | Cloisonne le cache navigateur par token Firebase. Sans ce header, deux utilisateurs partageant un même navigateur (rare mais possible — formation, kiosque) pourraient voir le ranking de l'autre. |

**Côté frontend** : aucun cache applicatif supplémentaire requis. Le `HttpClient` Angular respecte les headers de cache HTTP standards ; un bouton "Rafraîchir" éventuel peut forcer une revalidation via `headers: { 'Cache-Control': 'no-cache' }` sur la requête sortante.

**Réponses non-200** : ne PAS émettre de `Cache-Control: max-age` sur les erreurs (utiliser `Cache-Control: no-store` ou ne rien émettre — le défaut navigateur ne cache pas les 4xx/5xx).


## 7. Codes d'erreur

| Code | Cas | Body |
|---|---|---|
| `200 OK` | Succès, y compris liste vide | `[]` ou tableau de lignes |
| `400 Bad Request` | `year` manquant | `{ "error": "missing_year" }` |
| `400 Bad Request` | `year` non parsable / hors bornes | `{ "error": "invalid_year" }` |
| `401 Unauthorized` | Header `Authorization` absent / token invalide / expiré | `{ "error": "unauthorized" }` |
| `403 Forbidden` | Token valide mais doc `queteurs/{uid}` absent | `{ "error": "not_registered" }` |
| `403 Forbidden` | Token valide, doc présent, `registration_approved != true` | `{ "error": "not_approved" }` |
| `500 Internal Server Error` | Erreur Firestore (lecture, timeout) | `{ "error": "firestore_error" }` |
| `500 Internal Server Error` | Doc quêteur sans `ul_id` exploitable | `{ "error": "inconsistent_queteur_record" }` |

Tous les bodies d'erreur sont au format `{ "error": "<snake_case_message>" }`, cohérent avec les 9 fonctions v2 existantes.

## 8. Contrat de log (observabilité)

Logs structurés JSON (stdout, capturé par Cloud Logging) :

- Entrée : `event=get_ul_queteur_ranking.start`, `uid=<sub>`, `year=<int>`.
- Sortie succès : `event=get_ul_queteur_ranking.ok`, `ul_id=<int>`, `year=<int>`, `rows=<int>`, `duration_ms=<int>`.
- Sortie erreur : `event=get_ul_queteur_ranking.error`, `code=<http_status>`, `reason=<snake_case>`, `duration_ms=<int>`.

Pas de log du contenu des documents (PII : prénom, nom).

## 9. Tests d'acceptation backend

À porter dans la suite de tests de `rcq-functions-v2` :

1. `GET ?year=2026` sans header `Authorization` → `401 unauthorized`.
2. Avec un token valide d'un quêteur non-approuvé → `403 not_approved`.
3. Avec un token valide, sans `?year` → `400 missing_year`.
4. Avec `?year=abc` → `400 invalid_year`.
5. Avec `?year=2026` et un quêteur approuvé d'une UL sans stats → `200 []`, headers cache présents.
6. Avec `?year=2026` et un quêteur approuvé d'une UL avec stats → `200 <array>` trié par `amount` DESC, headers cache présents, `Vary: Authorization` présent.
7. Préflight `OPTIONS` avec `Origin: https://dev.redquest.croix-rouge.fr` → `204`, `Access-Control-Allow-Origin` reflète l'origine.
8. Temps de réponse < 300 ms sur UL de 200 quêteurs (warm), < 1 s (cold start).

## 10. Conséquences sur la configuration Firestore (côté RedQuest)

Une fois la fonction déployée et le frontend migré (PR séparée), les éléments suivants deviennent **obsolètes** et seront supprimés dans une seconde passe :

- **`firestore.indexes.json`** : tous les index composites sur `ul_queteur_stats_per_year` qui ne sont utilisés que par des queries client (tri par `amount`, `weight`, `time_spent_in_minutes`, `unique_point_quete_count`). L'unique index conservé sera celui requis par la query serveur (`ul_id ASC` + `year ASC` + `amount DESC`).
- **`firestore.rules`** : restreindre la lecture client de `ul_queteur_stats_per_year` (lecture serveur via Admin SDK qui bypass les rules). Bonus sécurité : la collection n'est plus exposée au SDK Firebase JS.
- **`FirestoreService.getUlStatsOrderedBy`** : à supprimer une fois `RankingDatasource` migré sur le nouvel endpoint.

Ces nettoyages sont **hors scope** de la spec backend mais à tracer dans la même issue côté frontend.

## 11. Checklist d'intégration frontend (RedQuest)

Pour mémoire, à exécuter dans le repo RedQuest après déploiement de la fonction :

- [ ] Ajouter `getULQueteurRanking: 'get-ul-queteur-ranking'` dans `cloudFunctionsNames` des 4 fichiers `src/environments/environment.{dev,test,prod,sample}.ts`.
- [ ] Étendre `CloudFunctionService` avec `getULQueteurRanking$(year: number): Observable<UlQueteurRanking[]>`.
- [ ] Créer/remplacer le modèle `src/app/model/UlQueteurRanking.ts` avec les 10 champs §5.
- [ ] Refactorer `RankingDatasource` : un seul fetch HTTP au montage, `sort()` et `selectPage()` purement in-memory.
- [ ] Supprimer la 2ᵉ requête dans `RankingComponent.ngAfterViewInit()`.
- [ ] Supprimer `FirestoreService.getUlStatsOrderedBy` (plus aucun appelant).
- [ ] Tests : `cloud-function-service.service.spec.ts` (mock `HttpTestingController`) + `ranking-datasource.spec.ts` (tri / pagination in-memory).
- [ ] Mise à jour du tableau §1 de `docs/cloud-functions-endpoints.md` avec la nouvelle ligne `getULQueteurRanking` / `get-ul-queteur-ranking`.
