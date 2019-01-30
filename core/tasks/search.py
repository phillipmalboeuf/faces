from core import app
from core import celery
from flask import request, abort, json


@celery.task(name='index_face')
def index_face(face):

  if not app.app_context():
    ctx = app.test_request_context()
    ctx.push()

  try:
    del face['password']
    del face['password_salt']
  except KeyError:
    pass

  index = app.search.init_index('faces')
  response = index.save_object({**face, 'objectID': face['_id']})

  return response


@celery.task(name='batch_faces')
def batch_faces():
  from core.models.faces.face import Face

  ctx = app.test_request_context()
  ctx.push()

  app.search.batch([{
    'action': 'updateObject',
    'indexName': 'faces',
    'body': {**face, 'objectID': face['_id']}
  } for face in Face.list()])


