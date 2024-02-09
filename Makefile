VOLUME_PATH = /sgoinfre/goinfre/Perso/jtoulous/data

all: volumes up

volumes:
	@echo "Creating folder for volumes ..."
	@mkdir -p ${VOLUME_PATH}/backend
	@mkdir -p ${VOLUME_PATH}/prometheus
	@mkdir -p ${VOLUME_PATH}/grafana
	@mkdir -p ${VOLUME_PATH}/alertmanager

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
	-@rm -rf ${VOLUME_PATH}

re: fclean all

.PHONY: all volumes up stop down clean fclean re
