# RöSeNa-App

## prerequisites

- docker and docker-compose has to be installed
- internet connection

## run it

Each time the containers are started with docker-compose the demo data will be added. To delete the old containers run `docker-compose down`. When some things still are not updating use the `up --build` option to force re-building of the image.

### development

`docker-compose up`

Starts the database, the temporary container that imports the JSON seeds into the database and the app. A dev server is started with all ports configured, so that live reloading is enabled.

### production

`docker-compose -f docker-compose.yml up`

Spins up the database like in development, the app is built without the dev-dependencies and without the volumes.

### test

`docker-compose -f docker-compose.yml -f docker-compose.test.yml up --exit-code-from cypress --abort-on-container-exit cypress`

Builds the production version of the app and runs the cypress tests.

In addition to the test container the normal production compose file is used to be sure to test in the exact same environment like in production. The only difference is, that all the containers are stopped when the tests are done.

## tools

For easy deployment to the remote host with ssh [appleboy/ssh-action](https://github.com/appleboy/ssh-action) is used in the deployment action.
