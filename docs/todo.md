# Backlog technique RedQuest

Tâches identifiées mais non encore planifiées. À convertir en issues GitHub
ou à intégrer dans une PR lorsqu'elles deviennent prioritaires.

---

## Firebase SDK — migration vers v9 modular (tree-shakable)

**Statut** : non démarré.
**Contexte** : le projet utilise actuellement `firebase@8.10.1` (API namespace
non tree-shakable) et `@angular/fire@6.1.5` (wrappe la v8). Tout le SDK Firestore
et Auth est embarqué dans le bundle même si seules quelques méthodes sont
appelées.

### Usage actuel

- `@angular/fire/firestore` : 3 méthodes dans `FirestoreService`
  (`registerQueteur`, `getStoredQueteur`, `isQueteurAlreadyRegistered`).
- `@angular/fire/auth` : `AuthService`, `AuthTokenInterceptor`, `app.module.ts`.
- `firebase/app` : `registration.component.ts`, `auth.service.ts`
  (utilise `firebase.auth.GoogleAuthProvider`).
- `@angular/fire/database` (RTDB) : importé dans `app.module.ts` **mais jamais
  utilisé** → traité dans la PR `perf/bundle-size-and-optimizations` (étape 6,
  drop du module non utilisé).

### Trois niveaux d'évolution possibles

**Niveau 2 — Migration partielle Firebase v9 modular** (recommandé en première
étape, sans bumper Angular)

- Bump `firebase` 8.x → 9.x ; conserver `firebase/compat/*` pour la partie
  encore utilisée par `@angular/fire@6`.
- Réécrire les 3 méthodes de `FirestoreService` en API modulaire :
  - `db.collection('queteurs').doc(uid).get()` → `getDoc(doc(db, 'queteurs', uid))`
  - `.where('nivol', '==', X)` → `query(collection(db, 'queteurs'), where('nivol', '==', X))`
- Migrer `AuthService` vers `signInWithPopup` / `signOut` modulaires.
- **Gain attendu** : 100-180 kB minified sur le bundle initial (à mesurer ;
  le compat layer co-existe avec le modulaire et peut absorber une partie du
  gain selon la qualité du tree-shaking webpack 4 d'Angular 10).
- **Risque** : moyen. Cohabitation v9 modular + AngularFire 6 (compat) à
  valider par mesure de bundle avant/après.
- **Effort** : 1-2 jours (refactor + tests Karma + validation `rq-fr-test`).

**Niveau 3 — Modernisation complète de la stack** (projet majeur, à scoper)

- Bump Angular 10 → 12/13/14/15 (chaîne de migrations majeures avec
  breaking changes Material, RxJS 6→7, TypeScript, CLI).
- Bump `@angular/fire` 6 → 7+ (requiert Angular 12+).
- Suppression complète du compat layer, full modular Firebase.
- **Gain attendu** : 250-350 kB sur le bundle final + débloque RxJS 7, TS 4.5+,
  modernes plugins Material, etc. Résout aussi une grande partie des
  vulnérabilités `npm audit` (66 reportées au 2026-05-23, dont 4 critiques).
- **Risque** : élevé.
- **Effort** : 1-2 semaines en équipe expérimentée.

### Prérequis avant d'attaquer

- Mesurer le gain réel du niveau 2 sur une branche de spike avant de
  promettre des chiffres.
- Décider de l'ordonnancement avec niveau 3 (la Wave 5 sécurité de
  `docs/security-audit-redquest.md` pourrait être un trigger).
