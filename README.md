# RöSeNa App

This project is built using [Angular](https://angular.io/) and [Firebase](https://firebase.google.com/).

## Development

### Angular App

Run `ng serve` to start the Angular dev server. It will serve the app on [localhost](http://localhost:4200/).

### Cloud Functions / Firestore

Can be run locally using the [firebase emulator suite](https://firebase.google.com/docs/emulator-suite) with `firebase emulators:start`. To make the Angular dev server use the emulator instead of the production database set the `useEmulator` property to `true` in the [dev environment file](hosting/src/environments/environment.ts).

Restarting the emulators will clear all the data from the firestore emulator. The current contents of the emulators can be exported with `firebase emulators:export <export directory>` and imported with `firebase emulators:start --import <import directory>`.

To enable functions in the emulator to access the production auth API admin credentials are needed. Follow setup in the [official docs](https://firebase.google.com/docs/functions/local-emulator#set_up_admin_credentials_optional). Be very careful with the key here, this is a private key!

## Build

Running `firebase deploy` in the root directory of the repo will automatically build and deploy the entire project. For this firebase-tools need to be installed globally and you have to be logged into your google account.

### Angular App

By running `npm build:prod` in the hosting directory the Angular app will be built. This step also automatically puts the current version number into the environment file of the app. Because this step is not repeatable the environment file with the inserted version number should never be comitted. The build can also be done by running `ng build` with the optional `--prod` flag.

### Cloud Functions

The functions are a standard TypeScript project built with `tsc` or just with `npm run build` in the `functions` directory.

## Running unit tests (currently broken)

Unit tests of the Angular app can be run in two ways:

- with live reloading and the HTML report by running `ng test`
- headless with `npm run test:ci` for running tests in ci

## Running end-to-end tests

End to end test are not yet implemented but would be run with `ng e2e`.

## NgRx

- generate new feature store: `ng generate feature state/articles/article -m pages/articles/articles.module.ts --group`

## Used Tools and Libraries

- Angular
- Angular Material
- Firebase
- NgRx
- [Hammer.js](https://hammerjs.github.io/)
- [Tag bump tool](https://github.com/marketplace/actions/github-tag-bump)
