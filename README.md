# RöSeNa-App

## HINTS

- when changing schema in the middleware server has to be completely restarted, **hot reload does not update the schema**

## prerequisites

- docker and docker-compose has to be installed
- internet connection

## run it

- run `docker-compose up --build` in root directory of the repository for development build
- update a container service with `docker-compose up -d --no-deps --build 'service_name'`
