from core import app
from core import celery
from flask import request, abort, json

import requests


@celery.task(name='airtable')
def airtable(table, data):

  if not app.app_context():
    ctx = app.test_request_context()
    ctx.push()

  response = requests.post(f'https://api.airtable.com/v0/apps4zma9HfDnpDrJ/{table}',
    headers={'Authorization': 'Bearer {}'.format(app.config['AIRTABLE_KEY']), 'Content-type': 'application/json'},
    data=json.dumps({'fields': data}))

  return response.json()


