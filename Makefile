dev:
	docker-compose down
	docker-compose up --build

prod:
	docker-compose down
	docker-compose -f docker-compose.yml up --build

test:
	docker-compose down
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build --exit-code-from cypress --abort-on-container-exit cypress
