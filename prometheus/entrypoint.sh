#!/bin/sh

export LOCAL_IP="${LOCAL_IP:-localhost}"
sed -i "s/\${LOCAL_IP:localhost}/$LOCAL_IP/g" /etc/prometheus/prometheus.yml

exec prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus
