#!/bin/sh

set -e

python3 manage.py wait_for_db
python3 manage.py collectstatic --noinput
python3 manage.py migrate

gunicorn app.wsgi:application --bind 0.0.0.0:9000 --workers 2