# Spécification — Cloud Function `get-queteur-stats`

**Statut** : à implémenter dans `rcq-functions-v2`.
**Repo client** : RedQuest (Angular) — consommée par `QueteurHistoryComponent` (page « Mon historique ») et `BadgesService` (calcul des badges sur la page « Mes quêtes »).
**Objectif** : remplacer l'accès Firestore SDK direct (collection `ul_queteur_stats_per_year` filtrée par `queteur_id`) par un appel HTTP REST, afin de permettre le durcissement final de `firestore.rules` (lecture client interdite sur cette collection).

Contrat d'interface entre backend Python et frontend Angular. Référence transverse : `docs/cloud-functions-endpoints.md` (§1 inventaire des fonctions, §6 décision HTTP/Bearer, §8 points d'attention). Voir aussi `docs/specs/get-ul-queteur-ranking.md` (même collection Firestore, projection différente).

---

## 1. Endpoint & méthode

| | |
|---|---|
| Méthode HTTP | `GET` |
| URL | `https://europe-west1-rq-fr-<env>.cloudfunctions.net/get-queteur-stats` |
| Clé Angular | `cloudFunctionsNames.getQueteurStats` |
| Région GCP | `europe-west1` |
| Runtime | Python (Cloud Functions Gen2, `@https_fn.on_request`) |
| Préflight CORS | `OPTIONS` → `204` avec reflet de l'`Origin` (même pattern que les 10 autres fonctions v2) |

## 2. Authentification

- Header `Authorization: Bearer <Firebase ID Token>` **obligatoire**.
- Vérification via `rcq_common.auth_firebase.verify_request` (mêmes garanties que `get-ul-prefs` / `get-ul-stats` / `get-ul-queteur-ranking`).
- Côté client : injection automatique par `AuthTokenInterceptor` (déjà en place dans RedQuest).
- **Le `queteur_id` retourné est toujours celui de l'utilisateur authentifié** — il n'est jamais passé en paramètre, ce qui empêche tout détournement (un quêteur ne peut pas lire les stats d'un autre).

## 3. Paramètres de requête (query string)

Aucun paramètre.

> Le `queteur_id` est dérivé du token (via `queteurs/{uid}.queteur_id`). L'`ul_id` est lui aussi dérivé du même document — il n'apparaît pas non plus dans la requête.
>
> **Pas de filtrage `year` côté serveur** : le volume retourné est borné (1 doc par année active du quêteur, typiquement 1 à 10 docs). Le frontend filtre en mémoire selon l'usage (badges = année courante ; historique = années passées).

## 4. Logique métier

1. **Auth** — appeler `verify_request(request)` ; en cas d'échec → `401`.
2. **Résolution `queteur_id`** — lire le document `queteurs/{uid}` dans Firestore (projet `rq-fr-<env>`, base `(default)`) :
   - si le doc n'existe pas → `403 not_registered`,
   - si `registration_approved != True` → `403 not_approved`,
   - sinon extraire `queteur_id` (typé `int`). Si absent → `500 inconsistent_queteur_record`.
3. **Query Firestore** (Admin SDK, bypass des security rules) :
   ```python
   db.collection('ul_queteur_stats_per_year') \
     .where('queteur_id', '==', queteur_id) \
     .order_by('year', direction=firestore.Query.DESCENDING) \
     .stream()
   ```
   Pas de `.limit()` : volume borné par l'ancienneté du quêteur dans le système.
4. **Projection** — mapper chaque document vers le contrat de sortie (§5). Les champs absents sont renvoyés à `0` (numériques) ou `""` (chaînes) pour éviter `null` côté client.
5. **Réponse** — `200 OK` + JSON tableau + headers de cache (§6).

## 5. Format de réponse

**Content-Type** : `application/json; charset=utf-8`
**Body** : tableau JSON (jamais `null` ; tableau vide `[]` si aucune stat — cas d'un quêteur fraîchement approuvé).

```json
[
  {
    "queteur_id": 2558,
    "ul_id": 42,
    "year": 2026,
    "first_name": "Thomas",
    "last_name": "Manson",
    "amount": 1234.56,
    "amount_cb": 120.0,
    "amount_year_objective": 1500.0,
    "weight": 4321,
    "time_spent_in_minutes": 540,
    "tronc_count": 7,
    "number_of_tronc_queteur": 7,
    "number_of_days_quete": 3,
    "number_of_point_quete": 5,
    "total_number_of_point_quete": 12
  }
]
```

| Champ | Type JSON | Source Firestore | Consommateur |
|---|---|---|---|
| `queteur_id` | `int` | `queteur_id` | history + badges |
| `ul_id` | `int` | `ul_id` | (réservé, non rendu) |
| `year` | `int` | `year` | history (filtre `!= currentYear`) · badges (filtre `== currentYear`) |
| `first_name` | `string` | `first_name` | — |
| `last_name` | `string` | `last_name` | — |
| `amount` | `number` (float) | `amount` | history · badges (`badge.update`) |
| `amount_cb` | `number` (float) | `amount_cb` | badges |
| `amount_year_objective` | `number` (float) | `amount_year_objective` | badges (badge `objective_percentage` filtré si `<= 0`) |
| `weight` | `number` (int, g) | `weight` | history · badges |
| `time_spent_in_minutes` | `number` (int) | `time_spent_in_minutes` | history · badges |
| `tronc_count` | `number` (int) | `tronc_count` | history · badges |
| `number_of_tronc_queteur` | `number` (int) | `number_of_tronc_queteur` | history · badges |
| `number_of_days_quete` | `number` (int) | `number_of_days_quete` | badges |
| `number_of_point_quete` | `number` (int) | `number_of_point_quete` | history · badges |
| `total_number_of_point_quete` | `number` (int) | `total_number_of_point_quete` | history · badges |

**Tri serveur** : `year DESC` (l'année courante en tête, alignée sur l'attendu UI). Pas de tie-breaker (1 doc max par année).

## 6. Stratégie de cache HTTP

Headers de réponse à émettre par le handler sur `200 OK` :

```
Cache-Control: private, max-age=900, stale-while-revalidate=60
Vary: Authorization
```

| Directive | Valeur | Justification |
|---|---|---|
| `private` | — | Réponse personnelle (stats du quêteur authentifié). Pas de cache CDN. |
| `max-age` | `900` (15 min) | Aligné sur la fréquence de recalcul backend (`compute_ul_queteur_stats_per_year`, toutes les 15 min). |
| `stale-while-revalidate` | `60` (60 s) | UX instantanée sur revisite juste après expiration (badges rechargés à chaque navigation). |
| `Vary` | `Authorization` | Cloisonne le cache navigateur par token (kiosque / formation). |

**Réponses non-200** : `Cache-Control: no-store` ou rien (défaut navigateur sain).

## 7. Codes d'erreur

| Code | Cas | Body |
|---|---|---|
| `200 OK` | Succès, y compris liste vide | `[]` ou tableau de lignes |
| `401 Unauthorized` | Header `Authorization` absent / token invalide / expiré | `{ "error": "unauthorized" }` |
| `403 Forbidden` | Token valide mais doc `queteurs/{uid}` absent | `{ "error": "not_registered" }` |
| `403 Forbidden` | Token valide, doc présent, `registration_approved != true` | `{ "error": "not_approved" }` |
| `500 Internal Server Error` | Erreur Firestore (lecture, timeout) | `{ "error": "firestore_error" }` |
| `500 Internal Server Error` | Doc quêteur sans `queteur_id` exploitable | `{ "error": "inconsistent_queteur_record" }` |

Format `{ "error": "<snake_case_message>" }`, cohérent avec les 10 fonctions v2 existantes.

## 8. Contrat de log (observabilité)

Logs structurés JSON (stdout, capturé par Cloud Logging) :

- Entrée : `event=get_queteur_stats.start`, `uid=<sub>`.
- Sortie succès : `event=get_queteur_stats.ok`, `queteur_id=<int>`, `rows=<int>`, `duration_ms=<int>`.
- Sortie erreur : `event=get_queteur_stats.error`, `code=<http_status>`, `reason=<snake_case>`, `duration_ms=<int>`.

Pas de log du contenu des documents (prénom, nom, montants).

## 9. Tests d'acceptation backend

À porter dans la suite de tests de `rcq-functions-v2` :

1. `GET` sans header `Authorization` → `401 unauthorized`.
2. Avec un token valide d'un quêteur non-approuvé → `403 not_approved`.
3. Avec un token dont l'`uid` n'a pas de doc `queteurs/{uid}` → `403 not_registered`.
4. Avec un token valide d'un quêteur approuvé sans aucune stat → `200 []`, headers cache présents.
5. Avec un token valide d'un quêteur approuvé avec stats sur 3 ans → `200 <array>` trié par `year` DESC, headers cache présents, `Vary: Authorization` présent.
6. Le `queteur_id` retourné dans chaque ligne **doit** correspondre à celui dérivé du token (vérif anti-mélange).
7. Préflight `OPTIONS` avec `Origin: https://dev.redquest.croix-rouge.fr` → `204`, `Access-Control-Allow-Origin` reflète l'origine.
8. Temps de réponse < 200 ms (warm), < 1 s (cold start).

## 10. Conséquences sur la configuration Firestore (côté RedQuest)

Une fois la fonction déployée et le frontend migré (PR séparée), l'ensemble des accès clients à `ul_queteur_stats_per_year` disparaît. Cela débloque :

- **`firestore.rules`** : ajout d'un bloc `match /ul_queteur_stats_per_year/{doc}` avec `allow read, write: if false;`. La lecture continue à fonctionner côté serveur (Admin SDK bypass les rules).
- **`FirestoreService.getQueteurStats`** : à supprimer (plus aucun appelant après migration).
- **`FirestoreService.selectUlStats`** : déjà du code mort (aucun appelant) — à supprimer dans la même passe.

Ces nettoyages sont **hors scope** de la spec backend ; ils sont tracés dans `scripts/firestore-cleanup.sh` (phase `--rules`) et dans la checklist §11 ci-dessous.

## 11. Checklist d'intégration frontend (RedQuest)

Pour mémoire, à exécuter dans le repo RedQuest après déploiement de la fonction :

- [ ] Ajouter `getQueteurStats: 'get-queteur-stats'` dans `cloudFunctionsNames` des 5 fichiers `src/environments/environment{,.dev,.test,.prod,.sample}.ts`.
- [ ] Étendre `CloudFunctionService` avec `getQueteurStats$(): Observable<QueteurStats[]>` (+ test `HttpTestingController`).
- [ ] `QueteurHistoryComponent.retrieveStats` : remplacer `firestoreService.getQueteurStats(id)` par `cloudFunctions.getQueteurStats$()` (signature sans paramètre, filtre `year !== currentYear` inchangé).
- [ ] `BadgesService.loadQueteurBadgesLevels` : remplacer `firestore.getQueteurStats(id)` par `cloudFunctions.getQueteurStats$()` (filtre `year === currentYear` inchangé).
- [ ] Supprimer `FirestoreService.getQueteurStats` et `FirestoreService.selectUlStats` (plus aucun appelant).
- [ ] Mise à jour du tableau §1 de `docs/cloud-functions-endpoints.md` avec la nouvelle ligne `getQueteurStats` / `get-queteur-stats`.
- [ ] Exécuter `scripts/firestore-cleanup.sh --rules --project rq-fr-dev --deploy` puis `--project rq-fr-test` puis `--project rq-fr-prod` (dans cet ordre, après validation à chaque étape).
