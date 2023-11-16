FROM debian:bullseye

COPY src home/backend
COPY init.sh home/

RUN chmod 777 home/init.sh
RUN chmod 777 -R home/backend

WORKDIR home/backend

RUN apt-get update -y \
    && apt-get install gcc -y \
    && apt-get install curl -y \
    && apt-get install python3 -y \
    && apt-get install python3-distutils -y \
    && apt-get install python3-dev -y \
    && apt-get install graphviz libgraphviz-dev -y \
    && curl -sSL https://install.python-poetry.org | python3 - 

CMD ../init.sh