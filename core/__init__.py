
from flask import Flask
import os
import pathlib
import sys
from datetime import datetime, timedelta
from pytz import timezone


if getattr(sys, 'frozen', False):
  app_path = str(pathlib.Path(sys.executable))
  app_path = app_path.replace('/server.app/Contents/MacOS', '')
  app_path = app_path.replace('/server', '')
else:
  app_path = str(pathlib.Path(__file__))
  app_path = app_path.replace('/core/__init__.py', '')

app = Flask(__name__, static_folder=app_path+'/files', template_folder=app_path+'/layouts')

app.path = app_path
app.config.from_pyfile(app.path+'/config/development.py')

app.timestamp = datetime.now(timezone(app.config['TIMEZONE'])).isoformat()


from core.pages import *