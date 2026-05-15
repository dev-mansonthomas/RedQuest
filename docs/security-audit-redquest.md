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

| Task | Action | Précaution | Statut |
|---|---|---|---|
| 3.1 | Security headers dans `firebase.json` : HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy | — | ✅ |
| 3.2 | CSP en `Content-Security-Policy-Report-Only` d'abord (1 semaine d'observation) avant enforcement | Risque casse Firebase Auth iframes, Google Maps embed | ✅ Report-Only |
| 3.3 | CORS Cloud Functions : note pour `rcq-functions-v2` — n'autoriser que `rq-fr-{env}.web.app` + `localhost:4200` (dev only) | Hors scope ce repo | ⏭ Délégué |

#### Headers déployés (post-Wave 3)

| Header | Valeur |
|---|---|
| `X-Frame-Options` | `DENY` (déjà présent avant Wave 3) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` (1 an, pas de `preload` initialement) |
| `Content-Security-Policy-Report-Only` | voir `firebase.json` |

#### CSP — directives et sources

| Directive | Sources autorisées | Raison |
|---|---|---|
| `default-src` | `'self'` | Baseline restrictive |
| `script-src` | `'self'` + `apis.google.com` + `www.gstatic.com` | Firebase Auth SDK (Google Sign-In) ; pas de `'unsafe-eval'` (Angular AOT prod) |
| `style-src` | `'self'` + `'unsafe-inline'` + `fonts.googleapis.com` + `use.fontawesome.com` | Angular Material injecte des styles inline ; Google Fonts + FontAwesome via `<link>` |
| `font-src` | `'self'` + `fonts.gstatic.com` + `use.fontawesome.com` + `data:` | Fichiers de fonts Google + FontAwesome |
| `img-src` | `'self'` + `data:` + `https:` | Permissif pour les icônes Material et assets externes |
| `connect-src` | `'self'` + 3× `cloudfunctions.net` (dev/test/prod) + 3× `firebaseio.com` + `wss://*.firebaseio.com` + Firestore + Identity Toolkit + Secure Token + `googleapis.com` + `firebaseinstallations.googleapis.com` | XHR/WS Firebase et Cloud Functions |
| `frame-src` | `'self'` + `www.google.com` + `www.youtube.com` + 3× `rq-fr-{env}.firebaseapp.com` | Google Maps embed, tip YouTube, iframe Firebase Auth |
| `object-src` | `'none'` | Bloquer Flash/Java legacy |
| `base-uri` | `'self'` | Anti `<base href>` injection |
| `form-action` | `'self'` | Anti exfiltration POST |
| `frame-ancestors` | `'none'` | Équivalent moderne de `X-Frame-Options: DENY` |

#### Mode Report-Only — observation 1 semaine

Aucun `report-uri` configuré (pas d'endpoint de collecte). Les violations sont observables via la console DevTools du navigateur en prod. Si après une semaine d'usage réel aucun warning bloquant n'apparaît, basculer en enforcement en renommant le header `Content-Security-Policy-Report-Only` → `Content-Security-Policy` dans une PR séparée.

Effets attendus si bug : aucun à ce stade (Report-Only n'enforce rien, génère uniquement des warnings console).

### Wave 4 — Données / accès

**Tout backend → hors scope.** Déléguer à `rcq-functions-v2` (SQL injection, authorization, IDOR, logs).

### Wave 5 — CI/CD (adaptée, ~45 min)

| Task | Action | Statut |
|---|---|---|
| 5.1 | `.github/workflows/security-audit.yml` : run sur PR + cron lundi, ratchet `npm audit` vs baseline, **pinning des actions par SHA 40-char** | ✅ |
| 5.2 | `.nvmrc` (`22`) ; `gcp-deploy.sh` : `npx --yes firebase-tools@15` au lieu d'install global, check `node -v >= 22` au début, `set -euo pipefail` | ✅ |
| 5.3 | Branch protection sur `master` (action manuelle GitHub UI) — voir checklist ci-dessous | ⏳ Manuel |
| 5.4 | `.github/dependabot.yml` : weekly, groupage Angular / TS / Firebase / testing, max 5 PRs npm + 3 PRs github-actions | ✅ |

#### Notes d'implémentation

- **5.1 — ratchet vs baseline** : la commande `npm audit --audit-level=high` du plan initial aurait fait échouer chaque PR (67 high pré-existants liés à Angular 10). Remplacée par une comparaison contre `docs/security-baseline-2026-05-15-post-wave1.json` : **le job échoue uniquement si une PR introduit de NOUVELLES vulnérabilités**. Les pré-existantes ne bloquent rien tant qu'elles ne croissent pas.
- **5.1 — pinning SHA** : `actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd  # v6.0.2` et `actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e  # v6.4.0`. Dependabot (5.4) maintient ces SHAs à jour via l'écosystème `github-actions`.
- **5.2 — firebase-tools pinné `@15`** au lieu de `@13.x` du plan initial : `@13` est obsolète, latest stable est `15.18.0`. Le pin major-only (`@15`) garde les patches automatiques sans surprise de major.

#### 5.3 — Checklist Branch Protection (à appliquer manuellement)

Aller sur https://github.com/dev-mansonthomas/RedQuest/settings/branches → "Add branch protection rule" → branch name pattern : `master`. Cocher :

- [x] Require a pull request before merging
  - [x] Require approvals (1 minimum)
  - [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Add required status check : **`audit`** (le job du workflow `security-audit.yml`, visible après la 1ère exécution)
- [x] Require conversation resolution before merging
- [x] Do not allow bypassing the above settings (incl. admins, ou au moins documenter l'exception)
- [ ] Allow force pushes : **OFF**
- [ ] Allow deletions : **OFF**

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
