#!/bin/sh

exec prometheus-alertmanager --config.file=/etc/alertmanager/alertmanager.yml
