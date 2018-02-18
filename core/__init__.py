
from flask import Flask
from pymongo import MongoClient
from celery import Celery
from algoliasearch import algoliasearch

import os
import pathlib
import sys
from datetime import datetime, timedelta
from pytz import timezone
from kombu.serialization import register

from core.helpers.json import dumps, loads


if getattr(sys, 'frozen', False):
  app_path = str(pathlib.Path(sys.executable))
  app_path = app_path.replace('/server.app/Contents/MacOS', '')
  app_path = app_path.replace('/server', '')
else:
  app_path = str(pathlib.Path(__file__))
  app_path = app_path.replace('/core/__init__.py', '')

app = Flask(__name__, static_folder=app_path+'/files', template_folder=app_path+'/layouts')

app.path = app_path
app.config.from_pyfile(app.path+'/config/default.py')
app.config.from_pyfile(app.path+'/config/categories.py')
try:
  app.config.from_pyfile(app.path+'/config/secret.py')
except FileNotFoundError:
  pass


app.jinja_env.add_extension('jinja2.ext.do')
app.jinja_env.add_extension('jinja2.ext.loopcontrols')

app.timestamp = datetime.now(timezone(app.config['TIMEZONE'])).isoformat()

app.mongo = MongoClient(app.config['MONGO_URI'], connect=False)
app.db = app.mongo[app.config['MONGO_DB']]
app.search = algoliasearch.Client(app.config['ALGOLIA_ID'], app.config['ALGOLIA_KEY'])
app.caches = {}

register('super-json', dumps, loads, content_type='application/x-super-json', content_encoding='utf-8') 

celery = Celery(app.import_name, broker=app.config['RABBITMQ_URL'])
celery.config_from_object(app.config)


from core.tasks.search import batch_faces

from core.pages.pages import *
from core.pages.errors import *

from core.helpers.verify_headers import *
from core.helpers.access_control_origin import *
from core.helpers.filters import *


# from core.models.utilities.upload import Upload
# from core.models.utilities.search import Search

# Upload.define_routes()
# Search.define_routes()


# from core.models.auth.token import Token
# from core.models.auth.session import Session
# from core.models.auth.user import User

# Token.define_routes()
# Session.define_routes()
# User.define_routes()


# from core.models.cms.page import Page
# from core.models.cms.piece import Piece
# from core.models.cms.author import Author
from core.models.cms.post import Post
# from core.models.cms.error import Error
# from core.models.cms.survey import Survey
# from core.models.cms.survey_answer import SurveyAnswer

# Page.define_routes()
# Piece.define_routes()
# Author.define_routes()
Post.define_routes()
# Error.define_routes()
# Survey.define_routes()
# SurveyAnswer.define_routes()

from core.models.faces.face import Face

Face.define_routes()


