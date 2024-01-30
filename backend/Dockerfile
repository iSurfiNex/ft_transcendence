FROM debian:bullseye-slim

#ENV DB_NAME=transcendance_db
#ENV DB_USER=my_postgres_user
#ENV DB_PASSWORD=my_postgres_pw
#ENV DB_HOST=localhost
#ENV DB_PORT=5432
#ENV VOLUME_PATH = /sgoinfre/goinfre/Perso/jtoulous/data
#ENV LOCAL_IP=localhost
#ENV SITE_DOMAIN=localhost


RUN mkdir -p /var/run/postgresql/

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install curl
RUN apt -y install sudo
RUN apt -y install systemctl
RUN apt -y install python3 python3-pip graphviz graphviz-dev
RUN apt -y install postgresql postgresql-contrib

RUN rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH=$PATH:/root/.local/bin

RUN mkdir -p /backend
COPY ./ /backend
WORKDIR /backend
RUN poetry export -f requirements.txt --output requirements.txt
RUN pip3 install -r requirements.txt

RUN mkdir -p /var/lib/postgresql/data

RUN  echo "listen_addresses = '*'" >> /etc/postgresql/13/main/postgresql.conf
RUN echo "host    all             all             0.0.0.0/0            md5" >> /etc/postgresql/13/main/pg_hba.conf

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

CMD /entrypoint.sh