# Audit sécurité supply chain — RedQuest

> Plan d'implémentation établi le 2026-05-15 à partir du cadre méthodologique `docs/security-audit-framework.md` (Coordinator/waves), adapté au contexte RedQuest mono-agent + backend hors scope.

## Contexte projet

- **Repo** : `/Users/tom/Projects/RedQuest`
- **Stack** : Angular 10.0.14 (legacy, EOL) + Firebase 8.10.1 + AngularFire 6.1.5
- **Backend** : hors scope (Cloud Functions Python sur `rcq-functions-v2`)
- **Environnements** : `dev` / `test` / `prod` (Firebase Hosting `rq-fr-{env}.web.app`)
- **CI/CD** : ❌ Aucune GitHub Action ; deploy via `gcp-deploy.sh` local + Firebase CLI
- **Node runtime** : v22.22.0 (CLI), Angular 10 attend Node 14 → contournement `NODE_OPTIONS=--openssl-legacy-provider`

## Phase 1 — Recon (état au 2026-05-15)

### Lockfile

| Élément | Valeur |
|---|---|
| Format | `package-lock.json` v3 |
| Entrées avec `integrity` SHA512 | 1938 / 1938 (100%) |
| Registry unique | ✅ `registry.npmjs.org` exclusivement |
| Dernière modification | 2026-01-29 (stable, pas de drift suspect) |
| Postinstall racine | `ngcc` (légitime Angular Ivy) |
| Postinstall transitifs suspects | ❌ Aucun à depth ≤ 3 |

### `npm audit` baseline

| Sévérité | Count | Nature dominante |
|---|---|---|
| Critical | 6 | Build-time only (loader-utils, form-data, pbkdf2, protobufjs, request, sha.js) |
| High | 83 | ~30 Angular XSS/XSRF runtime + Firebase Admin + grpc + babel |
| Moderate | 71 | Mixte |
| Low | 21 | Mixte |
| **Total** | **181** | |

Snapshot brut : `/tmp/redquest-audit.json` (à committer dans `docs/security-baseline-2026-05-15.json` lors de la Wave 1).

## Phase 1.5 — Scan IoC packages compromis connus

| Attaque | Date | Présence RedQuest | Verdict |
|---|---|---|---|
| **Shai-Hulud worm** (`@ctrl/*`, `@nativescript-community/*`) | sept 2025 | ❌ Absent | SAFE |
| **s1ngularity / nx** (`nx`, `@nx/*`, `@nrwl/*`) | août 2025 | ❌ Absent | SAFE |
| **Qix / chalk-debug-ansi** | sept 2024 | ⚠️ Familles présentes, versions SAFE (chalk@4.1.2 max, debug@4.4.0 max — compromis: chalk@5.6.1, debug@4.4.2) | SAFE |
| **lottie-player** (`@lottiefiles/lottie-player`) | oct 2024 | ❌ Absent | SAFE |
| **ua-parser-js** (versions 0.7.29/0.8.0/1.0.0) | oct 2021 | ✅ `0.7.21` (devDep transitive via karma, antérieure à l'attaque, hash integrity verrouillé) | SAFE |
| **node-ipc** | mars 2022 | ❌ Absent | SAFE |
| **event-stream** | 2018 | ❌ Absent | SAFE |
| **tj-actions/changed-files** | mars 2025 | N/A (pas de GH Actions) | SAFE |

**Conclusion Phase 1.5** : aucune action de rotation de tokens nécessaire. Aucune trace de compromission active ou historique.

## Risques identifiés non-IoC

1. **`firebase-admin@9.0.0` en `dependencies`** (pas devDep) — SDK backend qui ne devrait pas être bundlé côté Angular. À investiguer : si jamais importé dans `src/`, à retirer (`npm uninstall firebase-admin`). Allège l'arbre de `@google-cloud/firestore`, `@grpc/proto-loader`, `protobufjs` qui portent plusieurs critical/high.
2. **Angular 10 EOL depuis ~déc 2021** — les CVEs Angular XSS/XSRF runtime ne seront pas patchées sans upgrade majeur. Décision à acter : accepter le risque ou planifier upgrade.
3. **Node 22 vs target Node 14 d'Angular 10** — `--openssl-legacy-provider` masque le décalage. Documenter via `.nvmrc`.
4. **Pas de CI** — aucun audit automatique, aucune détection de drift sur PRs.
5. **Outils dev EOL** : `protractor`, `tslint`, `codelyzer` — surface morte mais inerte.

## Waves de remédiation

### Wave 1 — Supply chain (CRITIQUE, ~1h30) — ✅ TERMINÉE le 2026-05-15

| Task | Action | Statut |
|---|---|---|
| 1.1 | Snapshot baseline `npm audit --json` → `docs/security-baseline-2026-05-15.json` | ✅ |
| 1.2 | `npm audit fix` (sans `--force`) + `ng build` + `ng test` ; revue diff `package-lock.json` | ✅ -20 vulns |
| 1.3 | Investigation `firebase-admin` : aucun import dans `src/`, `npm uninstall` | ✅ -14 vulns |
| 1.4 | Pin exact versions deps runtime sensibles : `firebase` (`^8.10.1`→`8.10.1`), `@angular/fire` (`^6.1.5`→`6.1.5`) | ✅ |
| 1.5 | Documenter dans README : « toujours `npm ci`, jamais `npm install` en CI » | ✅ |
| 1.6 | Snapshot baseline final → `docs/security-baseline-2026-05-15-post-wave1.json` | ✅ |

#### Delta vulnérabilités Wave 1

| Sévérité | Avant | Après | Δ | Référence |
|---|---:|---:|---:|---|
| Critical | 6 | 4 | **-2 (-33 %)** | `docs/security-baseline-2026-05-15{,-post-wave1}.json` |
| High | 83 | 67 | **-16 (-19 %)** | idem |
| Moderate | 71 | 62 | **-9 (-13 %)** | idem |
| Low | 21 | 14 | **-7 (-33 %)** | idem |
| **Total** | **181** | **147** | **-34 (-19 %)** | |

Build green, Karma 13/13. Restes structurellement non-fixables sans upgrade Angular 10 → 21 (out of scope Wave 1).

#### Constats latéraux non couverts par le plan initial

- `dot-prop: ">=5.1.1"` et `elliptic: ">=6.5.3"` dans `package.json` utilisent l'opérateur `>=` qui autorise **n'importe quelle version future** (y compris des majeures). Plus permissif que `^` ; à pinner dans une étape ultérieure (proposée en Wave 1bis ou intégrée dans Wave 5).

### Wave 2 — Secrets / auth client (réduite, ~15 min)

| Task | Action |
|---|---|
| 2.1 | `grep -rE "(api[_-]?key\|secret\|password\|token\|bearer)" src/` — counts only, pas de log de valeurs |
| 2.2 | Vérifier `.gitignore` couvre `environment.{dev,test,prod}.ts` (déjà OK) ; `environment.sample.ts` n'a que des placeholders |
| 2.3 | Confirmer que les API keys Firebase visibles dans envs sont des clés **publiques web** (limitées par Firestore Security Rules), pas des admin keys |
| 2.4 | Vérifier `AuthTokenInterceptor` (Phase B migration) : token jamais loggé via `console.*` |

Backend (JWT, OAuth, password storage) : hors scope, déléguer à `rcq-functions-v2`.

### Wave 3 — Surface HTTP (ciblée Firebase Hosting, ~30 min + obs 1 sem)

| Task | Action | Précaution |
|---|---|---|
| 3.1 | Security headers dans `firebase.json` : HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy | — |
| 3.2 | CSP en `Content-Security-Policy-Report-Only` d'abord (1 semaine d'observation) avant enforcement | Risque casse Firebase Auth iframes, Google Maps embed |
| 3.3 | CORS Cloud Functions : note pour `rcq-functions-v2` — n'autoriser que `rq-fr-{env}.web.app` + `localhost:4200` (dev only) | Hors scope ce repo |

### Wave 4 — Données / accès

**Tout backend → hors scope.** Déléguer à `rcq-functions-v2` (SQL injection, authorization, IDOR, logs).

### Wave 5 — CI/CD (adaptée, ~45 min)

| Task | Action |
|---|---|
| 5.1 | Créer `.github/workflows/security-audit.yml` : run sur PR + cron lundi, `npm audit --audit-level=high`, **pinning des actions par SHA 40-char** (pas par tag — protection tj-actions) |
| 5.2 | Ajouter `.nvmrc` (`22`) ; dans `gcp-deploy.sh` pinner `firebase-tools` via `npx firebase-tools@13.x` au lieu d'install global ; ajouter check `node -v` au début |
| 5.3 | Branch protection sur `main` (action manuelle GitHub UI) : require PR review, no force push, status check `security-audit` requis |
| 5.4 | `.github/dependabot.yml` : weekly, groupage Angular + TS, max 5 PRs ouvertes |

## Ordonnancement recommandé

1. **Wave 1 d'abord** (impact max, risque faible).
2. Wave 2 (5.1) en parallèle car indépendantes.
3. Wave 3 (CSP) ensuite, en mode Report-Only puis enforcement.
4. Wave 5.3 (branch protection) à la fin une fois le workflow audit en place.

## Règles d'engagement

- **Une PR par wave** (pragmatique pour un projet de cette taille — pas une par fix).
- **Branches** : `security/wave-<n>-<short-desc>` (ex: `security/wave-1-supply-chain`).
- **Tests** : Karma vert obligatoire avant chaque commit ; `ng build --configuration dev` OK.
- **Aucun secret en clair** dans commits, PR body, logs (même temporaires).
- **Rollback** : `git revert` simple sur toutes les PRs ; CSP enforcement = phase Report-Only obligatoire.
- **Rotation tokens** : **non requise** (aucune compromission détectée).

## Décisions en attente

| Question | Options |
|---|---|
| Démarrer Wave 1 maintenant ou après migration Cloud Functions ? | Recommandation : finir D2/D3/D4 migration, puis Wave 1 dans PR séparée |
| CVEs Angular runtime XSS non-fixables sans upgrade | (a) Accepter risque résiduel + documenter (b) Planifier upgrade Angular 10 → latest |
| CSP enforcement | (a) Inclus Wave 3 en Report-Only (recommandé) (b) Out of scope |
| `firebase-admin` investigation | Lecture seule (`grep`), donc OK quand tu veux |

## Livrables attendus

- `docs/security-baseline-2026-05-15.json` (audit snapshot avant fixes)
- `docs/security-baseline-<date-post-wave1>.json` (audit snapshot après)
- Une PR par wave avec section "Rollback plan" dans la description
- Rapport final mis à jour à la fin de chaque wave : tableau `Catégorie | Avant | Après | Référence (CVE/PR)`

## Références

- Cadre méthodologique : `docs/security-audit-framework.md`
- Migration Cloud Functions v1→v2 : `docs/cloud-functions-endpoints.md`
- GitHub Security Advisories (npm) : https://github.com/advisories?query=type%3Areviewed+ecosystem%3Anpm
- OSV database : https://osv.dev/list
