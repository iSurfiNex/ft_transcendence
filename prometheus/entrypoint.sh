#!/bin/sh

export SITE_DOMAIN="${SITE_DOMAIN:-localhost}"
sed -i "s/\${SITE_DOMAIN:localhost}/$SITE_DOMAIN/g" /etc/prometheus/prometheus.yml

sleep 5

exec prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus
