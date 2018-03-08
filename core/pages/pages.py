
from core import app
from core.helpers.json import to_json, json_formater

from flask import request, abort
from flask import render_template, json

from werkzeug.contrib.cache import SimpleCache

from datetime import datetime, timedelta
from pytz import timezone
import os

from core.models.cms.piece import Piece
from core.models.faces.face import Face


def page(lang=None):
	request.url_rule.lang = lang

	response = {
		'pieces': Piece._values(lang),
		# 'faces': Face.list(lang=lang),
		'categories': app.config['CATEGORIES'],
		'timestamp': app.timestamp if app.config['ENVIRONMENT'] != 'DEVELOPMENT' else datetime.now(timezone(app.config['TIMEZONE'])).isoformat(),
		'current_path': request.path,
		'root': request.host_url,
		'development': app.config['ENVIRONMENT'] == 'DEVELOPMENT'
	}
	response['pieces_json'] = json.dumps(response['pieces'], sort_keys=False, default=json_formater)

	if lang is None:
		response['lang_route'] = '/'
		response['current_path'] = request.path
	else:
		response['lang'] = lang
		response['lang_route'] = '/' + lang + '/'
		response['current_path'] = request.path.replace(response['lang_route'], '/')

	return render_template('pages/' + request.endpoint + '.html', **response)



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

		




