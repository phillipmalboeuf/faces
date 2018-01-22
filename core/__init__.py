
from flask import Flask
import os
import sys


if getattr(sys, 'frozen', False):
    app_path = os.path.abspath(os.path.dirname(sys.executable))
    app_path = app_path.replace('/server.app/Contents/MacOS', '')
elif __file__:
    app_path = os.path.abspath(os.path.dirname(__file__))+'/..'


app = Flask(__name__, static_folder=app_path+'/files', template_folder=app_path+'/layouts')

app.path = app_path
app.config.from_pyfile(app.path+'/config/development.py')


from core.pages import *