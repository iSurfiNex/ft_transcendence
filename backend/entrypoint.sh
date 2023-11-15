#!/bin/sh

systemctl enable postgresql
systemctl restart postgresql
/etc/init.d/postgresql start

echo "CREATE DATABASE transcendance_db; \
CREATE ROLE my_postgres_user LOGIN; \
ALTER ROLE my_postgres_user WITH PASSWORD 'my_postgres_pw';" | sudo -u postgres psql

python3 manage.py createsuperuser
python3 manage.py migrate
python3 manage.py runserver

tail -f
