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

Tests can be run with `make test`, which just cleans up any remaining containers and starts `docker-compose -f docker-compose.yml -f docker-compose.test.yml up --exit-code-from cypress --abort-on-container-exit cypress`.

Builds the production version with the production compose files of the app and runs the cypress tests. This ensures, that the actual production verion of the app works and there will be no differences between testing and production environments. All the test are written in a way, that the order and amout of executions does not matter, for example if deleting elements is tested, they get inserted with the same values again afterwards. A drawback of this is, that ID's are not predictable, so when ID's are checked a regex is used, which could lead to very specific undetected errors.

## tools

For easy deployment to the remote host with ssh [appleboy/ssh-action](https://github.com/appleboy/ssh-action) is used in the deployment action.

## database

### Export data

#### to JSON

To export a single collection in the databse in JSON format run `mongoexport --collection=<collection-name> --db=<db-name>` in the shell of the container, not the mongo shell of the database.
