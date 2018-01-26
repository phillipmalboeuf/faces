from core import app
from flask import request, render_template, json

import os


def page():

  data = {
    'timestamp': app.timestamp,
    'current_path': request.path,
    'root': request.host_url
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