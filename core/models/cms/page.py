
from core import app
from flask import request, abort
from core.models.core.model import Model
from core.models.core.has_routes import HasRoutes
from core.models.core.with_templates import WithTemplates

from core.helpers.validation_rules import validation_rules
# from core.tasks.trigger import trigger_tasks

from bson.objectid import ObjectId

import urllib
import markdown



with app.app_context():
	class Page(WithTemplates, HasRoutes, Model):

		collection_name = 'pages'
		collection_sort = [('order', 1)]

		schema = {
			'name': validation_rules['text'],
			'route': validation_rules['text'],
			'body': validation_rules['text'],
			'hide_from_navigation': validation_rules['bool'],
			'metadata': validation_rules['metadata']
		}


		endpoint = '/pages'
		routes = [
			{
				'route': '',
				'view_function': 'list_view',
				'methods': ['GET']
			},
			{
				'route': '',
				'view_function': 'create_view',
				'methods': ['POST'],
				'requires_admin': True
			},
			{
				'route': '/<string:_id>',
				'view_function': 'get_view',
				'methods': ['GET']
			},
			{
				'route': '/<_id>',
				'view_function': 'update_view',
				'methods': ['PATCH', 'PUT'],
				'requires_admin': True
			},
			{
				'route': '/<_id>',
				'view_function': 'delete_view',
				'methods': ['DELETE'],
				'requires_admin': True
			}
		]

		templates = [
			{
				'view_function': 'get_view',
				'template': 'pages/page.html',
				'response_key': 'page'
			}
		]



		@classmethod
		def define_routes(cls):

			return super().define_routes()




		@classmethod
		def preprocess(cls, document, lang=None):
			for cache in app.caches:
				app.caches[cache].clear()

			try:
				document['route'] = urllib.parse.quote_plus(document['route'].lower())
			except KeyError:
				pass

			return super().preprocess(document, lang)




