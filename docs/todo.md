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


---

## Test suite — sortir du mode "focus" et écrire de vrais tests

**Statut** : non démarré.
**Contexte** : `ng test` affiche `13 SUCCESS, 48 skipped` parce que deux specs
utilisent `fdescribe` (Jasmine "focused") au lieu de `describe`, ce qui
désactive tous les autres blocs du run.

### Symptômes

- `src/app/pipes/weight.pipe.spec.ts:3` : `fdescribe('WeightPipe', ...)`
- `src/app/pipes/time.pipe.spec.ts:3` : `fdescribe('TimePipe', ...)`

Tant que ces deux `fdescribe` traînent, toute nouvelle spec ajoutée en
`describe` standard ne s'exécutera pas non plus.

### Sous-tâches

1. Remplacer les deux `fdescribe` par `describe` (1 commit trivial,
   `chore(test): un-focus pipe specs`). Vérifier que la suite passe
   toujours et que le compteur monte à 61/61.
2. Auditer les ~29 autres specs : la grande majorité sont des smoke tests
   `expect(component).toBeTruthy()` sans valeur. Décider :
   - soit on les supprime (réduit le bruit, mais rend `ng test` quasi vide),
   - soit on les remplit avec de vrais scénarios métier.
3. Couverture cible à définir avec l'équipe (proposition : 60 % sur les
   services et guards, smoke tests OK sur les composants présentationnels).
4. Ajouter des tests pour les guards `AuthGuard` et `RootRedirectGuard`
   (couvrir : utilisateur logué, anonyme, transition de session).
5. Intégrer `ng test --watch=false --browsers=ChromeHeadless` dans la CI
   GitHub Actions si ce n'est pas déjà le cas (à vérifier).

### Effort

Étape 1 : 5 min. Étapes 2-5 : selon ambition de couverture, 1-3 jours.

### Notes

Cette dette a été acceptée consciemment lors de la PR `fix/anonymous-routing`
(option A : validation manuelle uniquement, pas de tests unitaires sur les
nouveaux guards) pour ne pas bloquer la livraison du fix UX.
