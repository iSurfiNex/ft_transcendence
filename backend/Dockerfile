FROM debian:bullseye-slim

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install sudo
RUN apt -y install curl
RUN apt -y install python3 python3-pip graphviz graphviz-dev
RUN apt -y install postgresql postgresql-contrib

RUN rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH=$PATH:/root/.local/bin

RUN mkdir -p /backend
COPY ./ /backend
WORKDIR /backend
# Pour installer les dependences de maniere globale
RUN poetry config virtualenvs.create false
RUN poetry install

RUN systemctl enable postgresql
RUN systemctl status postgresql

RUN "CREATE DATABASE transcendance_db; \
CREATE ROLE my_postgres_user LOGIN; \
ALTER ROLE my_postgres_user WITH PASSWORD 'my_postgres_pw';""" | sudo -u postgres psql

RUN python manage.py createsuperuser
RUN python manage.py migrate
RUN python manage.py runserver

CMD /entrypoint.sh
