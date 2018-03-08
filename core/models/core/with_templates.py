from core import app
from core.helpers.json import to_json, json_formater

from flask import request, abort
from flask import render_template, json
from datetime import datetime, timedelta
from pytz import timezone
from werkzeug.routing import Rule
from werkzeug.contrib.cache import SimpleCache

from bson.objectid import ObjectId
import hashlib


with app.app_context():
	class WithTemplates():

		templates = [
			{
				'view_function': 'list_view',
				'template': '_layout.html',
				'response_key': 'documents'
			},
			{
				'view_function': 'get_view',
				'template': '_layout.html',
				'response_key': 'document'
			}
		]


		@classmethod
		def _format_response(cls, response):
			try:
				if 'application/json' in request.headers['Accept']:
					return to_json(response)
					
				else:
					for template in cls.templates:
						if template['view_function'] == request.url_rule.route['view_function']:

							try:
								response = getattr(cls, template['prerender_process'])(response)
							except KeyError:
								pass


							from core.models.cms.piece import Piece

							response = {
								template['response_key']: response.copy(),
								'pieces': Piece._values(request.url_rule.lang),
								'categories': app.config['CATEGORIES'],
								'timestamp': app.timestamp if app.config['ENVIRONMENT'] != 'DEVELOPMENT' else datetime.now(timezone(app.config['TIMEZONE'])).isoformat(),
								'current_path': request.path,
								'root': request.host_url,
								'development': app.config['ENVIRONMENT'] == 'DEVELOPMENT'
							}
							response['pieces_json'] = json.dumps(response['pieces'], sort_keys=False, default=json_formater)

							if request.url_rule.lang is None:
								response['lang_route'] = '/'
								response['current_path'] = request.path
							else:
								response['lang'] = request.url_rule.lang
								response['lang_route'] = '/' + request.url_rule.lang + '/'
								response['current_path'] = request.path.replace(response['lang_route'], '/')


							return render_template(template['template'], **response)

			except KeyError:
				return to_json(response)
	







