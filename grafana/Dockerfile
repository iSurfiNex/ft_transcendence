FROM debian:bullseye-slim

RUN apt -y update
RUN apt -y upgrade

RUN apt-get install -y apt-transport-https software-properties-common wget gnupg systemctl openssl
RUN mkdir -p /etc/apt/keyrings/
RUN wget -q -O - https://packages.grafana.com/gpg.key | apt-key add -
RUN add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
RUN apt -y update
RUN apt -y install grafana

RUN rm -rf /var/lib/apt/lists/*

RUN openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
	-out /etc/ssl/transcendence.42.fr.pem \
	-keyout /etc/ssl/transcendence.42.fr.key \
	-subj "/C=FR/ST=Charente/L=Angouleme/O=42/OU=42/CN=transcendence.42.fr"

RUN mkdir -p /usr/share/grafana/conf/provisioning/datasources/
RUN mkdir -p /usr/share/grafana/conf/provisioning/dashboards/
RUN mkdir -p /usr/share/grafana/dashboards/

COPY defaults.ini /usr/share/grafana/conf/
COPY datasources.yml /usr/share/grafana/conf/provisioning/datasources/
COPY dashboard.yml /usr/share/grafana/conf/provisioning/dashboards/
COPY default.json /usr/share/grafana/dashboards/

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
