# RöSeNa-App

## TODO

- github actions test and build + deploy pipelines
- create tests
- seed mongo db
- do some kind of data backups in production

## prerequisites

- docker and docker-compose has to be installed
- internet connection

## run it

Each time the containers are started with docker-compose the demo data will be added. To delete the old containers run `docker-compose down`.

**development**: `docker-compose up`

**production**: `docker-compose -f docker-compose.yml up`

## hints

- clone a single branch from repo: `git clone --single-branch --branch <branchname> <remote-repo>`
- connect with ssh and a specific ssh-key: `ssh -i ~/.ssh/id_rsa user@80.240.20.232`
