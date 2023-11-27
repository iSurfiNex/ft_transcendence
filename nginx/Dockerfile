FROM debian:bullseye-slim

RUN apt -y update
RUN apt -y upgrade
RUN apt -y install nginx
RUN apt -y install openssl
RUN rm -rf /var/lib/apt/lists/*

RUN openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
	-out /etc/ssl/transcendence.42.fr.pem \
	-keyout /etc/ssl/transcendence.42.fr.key \
	-subj "/C=FR/ST=Charente/L=Angouleme/O=42/OU=42/CN=transcendence.42.fr"

COPY nginx.conf /etc/nginx/conf.d
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

CMD /entrypoint.sh
