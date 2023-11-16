#!/bin/bash

export PATH=$PATH:$HOME/.local/bin
poetry install
poetry run python3 manage.py createsuperuser
poetry run python3 manage.py makemigrations
poetry run python3 manage.py migrate 
poetry run python3 manage.py runserverdocker