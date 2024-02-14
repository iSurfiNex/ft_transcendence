#!/bin/sh

systemctl enable postgresql
systemctl restart postgresql
/etc/init.d/postgresql start

echo "CREATE DATABASE $DB_NAME;
CREATE ROLE $DB_USER LOGIN;
ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASSWORD';" | sudo -u postgres psql

redis-server --daemonize yes

echo yes | python3 manage.py collectstatic
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser --noinput
python3 manage.py create_site --domain=$SITE_DOMAIN
python3 manage.py runserver 0.0.0.0:8000
