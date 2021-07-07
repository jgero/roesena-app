CONTAINER_RUNTIME?=docker

start-dev-frontend: build-dev-frontend run-dev-frontend

.PHONY: build-dev-frontend
build-dev-frontend:
	$(CONTAINER_RUNTIME) build \
		-t roesena-app-frontend:latest \
		-f ./docker/dev.Dockerfile \
		./hosting

# mount code and config files into container
# keep node_modules in anonymous volume
# attach shell to container on startup
.PHONY: run-dev-frontend
run-dev-frontend: build-dev-frontend
	$(CONTAINER_RUNTIME) run \
		-v $(PWD)/hosting/:/app/:z \
		-v node_modules:/app/node_modules \
		-p 4200:4200 \
		-it \
		roesena-app-frontend:latest \
		/bin/bash
