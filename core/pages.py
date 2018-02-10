from core import app
from flask import request, render_template, json

from datetime import datetime, timedelta
from pytz import timezone
import os


def page():

  data = {
    'timestamp': app.timestamp if app.config['ENVIRONMENT'] != 'DEVELOPMENT' else datetime.now(timezone(app.config['TIMEZONE'])).isoformat(),
    'current_path': request.path,
    'root': request.host_url,
    'development': app.config['ENVIRONMENT'] == 'DEVELOPMENT',
    'faces': [
      {
        'first_name': 'Samia',
        'last_name': 'Liamani',
        'is_available': True,
        'categories': ['Model', 'Photographer'],
        'tags': ['Woman', 'Asian'],
        'city': 'Montréal',
        'bio': 'Hello! I\'m a fashion blogger and shop owner. Originally from Montreal, but currently living in Seoul, South Korea.'
      },
      {
        'first_name': 'Charles',
        'last_name': 'Deluvio',
        'is_available': True,
        'categories': ['Model', 'Photographer'],
        'tags': ['Man', 'Asian'],
        'city': 'Montréal',
        'bio': 'Hello! I\'m a fashion blogger and shop owner. Originally from Montreal, but currently living in Seoul, South Korea.'
      },
      {
        'first_name': 'Celia',
        'last_name': 'Spenard-Ko',
        'is_available': True,
        'categories': ['Model', 'Photographer'],
        'tags': ['Woman', 'Asian'],
        'city': 'Montréal',
        'bio': 'Hello! I\'m a fashion blogger and shop owner. Originally from Montreal, but currently living in Seoul, South Korea.'
      },
      {
        'first_name': 'Phillip',
        'last_name': 'Malboeuf',
        'is_available': True,
        'categories': ['Model', 'Photographer'],
        'tags': ['Man', 'Caucasian'],
        'city': 'Montréal',
        'bio': 'Hello! I\'m a fashion blogger and shop owner. Originally from Montreal, but currently living in Seoul, South Korea.'
      }
    ]
  }

  return render_template('pages/' + request.endpoint + '.html', **data)




for file in os.listdir(app.template_folder+'/pages'):
  if file == 'index.html':
    app.add_url_rule('/', 'index', methods=['GET'])
    app.view_functions['index'] = page

  else:
    route = file.replace('.html', '')
    app.add_url_rule('/' + route, route, methods=['GET'])
    app.view_functions[route] = page