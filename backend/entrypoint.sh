#!/bin/sh

systemctl enable postgresql
systemctl restart postgresql
/etc/init.d/postgresql start

echo "CREATE DATABASE $DB_NAME;
CREATE ROLE $DB_USER LOGIN;
ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASSWORD';" | sudo -u postgres psql

python3 manage.py migrate
python3 manage.py createsuperuser --noinput
python3 manage.py runserver 0.0.0.0:8000
