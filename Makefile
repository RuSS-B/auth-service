include .make.env

app.build:
	docker build -f Dockerfile -t ${DOCKER_APP_IMAGE}:${DOCKER_APP_TAG} .

app.migrations.build:
	docker build -f Migrations.Dockerfile -t ${DOCKER_MIGRATIONS_IMAGE}:${DOCKER_APP_TAG} .

app.run:
	docker run ${DOCKER_APP_IMAGE}:${DOCKER_APP_TAG}

app.push:
	docker push ${DOCKER_APP_IMAGE}:${DOCKER_APP_TAG}

app.migrations.push:
	docker push ${DOCKER_MIGRATIONS_IMAGE}:${DOCKER_APP_TAG}

app.minikube.build:
	minikube image build -t ${DOCKER_APP_IMAGE}:${DOCKER_APP_TAG} .