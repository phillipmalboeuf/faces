
from core import app
from core.helpers.json import to_json, json_formater

from flask import request, abort
from flask import render_template, json

from werkzeug.contrib.cache import SimpleCache

from datetime import datetime, timedelta
from pytz import timezone
import os

# from core.models.cms.piece import Piece
# from core.models.cms.author import Author
from core.models.faces.face import Face


def page(lang=None):
	request.url_rule.lang = lang

	# cached_template = app.caches['/pages'].get(request.path)
	# if cached_template is None or request.current_session_is_admin or app.config['DEBUG']:
	response = {
		# 'pieces': Piece._values(lang),
		# 'authors': Author.list(lang=lang),
		'faces': Face.list(lang=lang),
		'timestamp': app.timestamp if app.config['ENVIRONMENT'] != 'DEVELOPMENT' else datetime.now(timezone(app.config['TIMEZONE'])).isoformat(),
		'current_path': request.path,
		'root': request.host_url,
		'development': app.config['ENVIRONMENT'] == 'DEVELOPMENT'
	}
	# response['pieces_json'] = json.dumps(response['pieces'], sort_keys=False, default=json_formater)

	if lang is None:
		response['lang_route'] = '/'
		response['current_path'] = request.path
	else:
		response['lang'] = lang
		response['lang_route'] = '/' + lang + '/'
		response['current_path'] = request.path.replace(response['lang_route'], '/')

	render = render_template('pages/' + request.endpoint + '.html', **response)
	# if not request.current_session_is_admin:
	# 	app.caches['/pages'].set(request.path, render, timeout=0)
	return render

	# else:
	# 	return cached_template


app.caches['/pages'] = SimpleCache()
for file in os.listdir(app.template_folder+'/pages'):

	if file == 'index.html':
		app.add_url_rule('/', 'index', methods=['GET'])
		app.view_functions['index'] = page

		for lang in app.config['LANGS']:
			app.add_url_rule('/' + lang + '/', 'index', methods=['GET'], defaults={'lang': lang})

	else:
		route = file.replace('.html', '')
		app.add_url_rule('/' + route, route, methods=['GET'])
		app.view_functions[route] = page

		for lang in app.config['LANGS']:
			app.add_url_rule('/' + lang + '/' + route, route, methods=['GET'], defaults={'lang': lang})

		




