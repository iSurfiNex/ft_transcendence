VOLUME_PATH = /sgoinfre/goinfre/Perso/rsterin/data

all: volumes up

volumes:
	@echo "Creating folder for volumes ..."
	@sudo mkdir -p ${VOLUME_PATH}/backend
	@sudo mkdir -p ${VOLUME_PATH}/prometheus
	@sudo mkdir -p ${VOLUME_PATH}/grafana
	@sudo mkdir -p ${VOLUME_PATH}/alertmanager

up:
	@echo "Building containers ..."
	@docker compose up --build

stop:
	@echo "Stopping containers ..."
	@docker compose stop

down:
	@echo "Downing containers ..."
	@docker compose down -v

clean: down
	@echo "Deleting folder for volumes ..."

fclean: clean
	@docker system prune -af --volumes
	-@sudo rm -rf ${VOLUME_PATH}

re: fclean all

.PHONY: all volumes up stop down clean fclean re
