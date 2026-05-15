## RedQuest

Angular 10 front-end + Firebase (Firestore + Cloud Functions).

## Prerequisites

### Tooling

- Node.js + npm (deployment script expects Node 14 available at `/usr/local/opt/node@14/bin`).
- Angular CLI: `npm install -g @angular/cli`
- Firebase CLI: `npm install -g firebase-tools`
- Google Cloud SDK (gcloud): https://cloud.google.com/sdk/docs/install

### Google Cloud / Firebase access

- Your account must be granted access to the target project (IAM owner/editor).
- Login to gcloud and firebase:
  - `gcloud init`
  - `firebase login`

## Install

For local development:

```bash
npm install
```

For reproducible installs (CI, deploys, or after pulling on a clean
clone), always prefer `npm ci`. It honors `package-lock.json` strictly
and refuses to mutate it, which is what we want for supply-chain
hygiene:

```bash
npm ci
```

Never run `npm install <new-package>` directly when preparing a build
or a deploy; use `npm ci` instead. New dependencies are added in their
own commit (with the lockfile diff) and reviewed in PR.

## Environments

Environment files are not in git. Get them from Google Drive (ask a dev) and place them in `src/environments/`.
You should have:
```bash
$ ls src/environments/
environment.dev.ts
environment.prod.ts
environment.sample.ts
environment.test.ts
environment.ts
```

## Start a server
### Development server

* Run `ng build --configuration dev` to prepare the server with *dev* environment settings.
* Then run `ng serve --configuration dev` for a dev server. 


### Test server

* Run `ng build --configuration test` to prepare the server with *test* environment settings.
* Then run `ng serve --configuration test` for a test server.

### Production server
```diff
- CAUTION: do not use this environment, unless someone asked you to use it !
```

 * Run `ng build --configuration production` to prepare the server with *production* environment settings.
* Then run `ng serve --configuration production` for a production server.


> Notes:
>
> Once started you can navigate to `http://localhost:4200/`.
>
> In all three cases above, after the `ng serve` call, the app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Deploy

### One-command deploy

The repo ships a helper script:
```bash
./gcp-deploy.sh fr dev
./gcp-deploy.sh fr test
./gcp-deploy.sh fr prod
```

This script:
- Sets the target GCP project (`rq-fr-{env}`)
- Runs `firebase use --add`
- Builds Angular (`ng build`)
- Runs `firebase deploy`

Requirements: `gcloud`, `firebase` and `ng` must be in your PATH.

### Manual deploy

```bash
ng build --configuration dev   # or test/prod
firebase deploy
```

### Troubleshooting

- If you see `firebase: command not found` or `ng: command not found`, install:
  - `npm install -g firebase-tools @angular/cli`
- `gcp-deploy.sh` prepends `/usr/local/opt/node@14/bin` to PATH. If you don’t have Node 14 installed there, either install it or edit the script to match your local setup.
