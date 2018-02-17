
from core import app
from core.helpers.json import to_json, json_formater
from core.helpers.raise_error import raise_error

from flask import request, abort, redirect
from flask import render_template, json
from datetime import datetime, timedelta
from pytz import timezone

from werkzeug.contrib.cache import SimpleCache


# from core.models.cms.piece import Piece


# app.caches['/errors'] = SimpleCache()

@app.errorhandler(404)
def not_found(error):


	if 'application/json' in request.headers['Accept']:
		return raise_error('server', 'not_found', 404, no_abort=True)

	else:
		# cached_template = app.caches['/errors'].get(request.path)
		# if cached_template is None or app.config['DEBUG']:
		response = {
			# 'pieces': Piece._values(),
			'categories': app.config['CATEGORIES'],
			'timestamp': app.timestamp if app.config['ENVIRONMENT'] != 'DEVELOPMENT' else datetime.now(timezone(app.config['TIMEZONE'])).isoformat(),
			'current_path': request.path,
			'root': request.host_url,
			'development': app.config['ENVIRONMENT'] == 'DEVELOPMENT'
		}
		# response['pieces_json'] = json.dumps(response['pieces'], sort_keys=False, default=json_formater)
		response['lang_route'] = '/'

		render = render_template('errors/' + str(error.code) + '.html', **response)
		# app.caches['/errors'].set(request.path, render, timeout=0)
		return render

		# else:
		# 	return cached_template

