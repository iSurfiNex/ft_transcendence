VOLUME_PATH = /sgoinfre/goinfre/Perso/rsterin/data

all: volumes up

volumes:
	@echo "Creating folder for volumes ..."
	@mkdir -p ${VOLUME_PATH}/backend
	@mkdir -p ${VOLUME_PATH}/frontend

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
	-@rm -rf ${VOLUME_PATH}

fclean: clean
	@docker system prune -af --volumes

re: fclean all

.PHONY: all volumes up stop down clean fclean re
