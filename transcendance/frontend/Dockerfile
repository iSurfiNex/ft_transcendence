FROM debian:bullseye-slim

COPY src home/frontend 
COPY init.sh home/frontend/init.sh

RUN chmod 777 home/init.sh
RUN chmod 777 -R home/frontend


WORKDIR home/frontend

RUN apt-get update
RUN apt-get install -y nodejs npm

#EXPOSE 3000

CMD ./init.sh