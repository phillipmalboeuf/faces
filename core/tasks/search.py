from core import app
from core import celery
from flask import request, abort, json

from core.models.faces.face import Face


@celery.task(name='batch_faces')
def batch_faces():

  ctx = app.test_request_context()
  ctx.push()

  app.search.batch([{
    'action': 'updateObject',
    'indexName': 'faces',
    'body': {**face, 'objectID': face['_id']}
  } for face in Face.list()])


