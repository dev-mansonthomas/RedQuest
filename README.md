## Getting started
Install angular-cli : https://cli.angular.io/

Run `npm install`

Enjoy


# RedQuest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.5.

## Start a server
### Prepare environments

Get the environment files from the Google Drive (ask a developer) and put them at `/src/environments/`. Once done you should have : 
```bash
$ ls src/environments/
environment.dev.ts
environment.prod.ts
environment.sample.ts
environment.test.ts
environment.ts
```



### Development server:

* Run `ng build --configuration dev` to prepare the server with *dev* environment settings.
* Then run `ng serve --configuration dev` for a dev server. 


### Test server:

* Run `ng build --configuration test` to prepare the server with *test* environment settings.
* Then run `ng serve --configuration test` for a text server.

### Production server:
```diff
- CAUTION: do not use this environment, unless someone asked you to use it !
```

 * Run `ng build --configuration production` to prepare the server with *production* environment settings.
* Then run `ng serve --configuration production` for a dev server.


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


## To deploy with firebase

install firebase tools:

`npm install -g firebase-tools`

`firebase login`

To test authentication:

`firebase list`

`firebase use --add {project-id}`


To deploy project:

run `ng build --prod` to generate sources to be deployed
run `firebase deploy` and follow instructions
