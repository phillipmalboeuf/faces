from core import app
from flask import request, abort

from core.models.core.model import Model
from core.models.core.has_routes import HasRoutes
from core.models.core.with_templates import WithTemplates

from core.helpers.validation_rules import validation_rules

import urllib
import re
import string


with app.app_context():
	class Author(WithTemplates, HasRoutes, Model):

		collection_name = 'authors'
		alternate_index = 'handle'

		schema = {
			'name': validation_rules['text'],
			'handle': validation_rules['text'],
			'photo': validation_rules['image'],
			'description': validation_rules['text'],
			'description_en': validation_rules['text'],
			'intro': validation_rules['text'],
			'intro_en': validation_rules['text'],
			'body': validation_rules['text'],
			'contact_facebook': validation_rules['text'],
			'contact_instagram': validation_rules['text'],
			'contact_twitter': validation_rules['text'],
			'contact_vimeo': validation_rules['text'],
			'contact_email': validation_rules['text'],
			'contact_linkedin': validation_rules['text'],
			'metadata': validation_rules['metadata']
		}

		endpoint = '/authors'
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
				'route': '/<_id>',
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
				'view_function': 'list_view',
				'template': 'authors/authors.html',
				'response_key': 'authors'
			},
			{
				'view_function': 'get_view',
				'template': 'authors/author.html',
				'response_key': 'author'
			}
		]


		@classmethod
		def preprocess(cls, document, lang=None):
			for cache in app.caches:
				app.caches[cache].clear()

			try:
				document['route'] = re.sub('[^%s]' % (string.ascii_letters + string.digits), '', urllib.parse.quote_plus(document['route'].lower()))
			except KeyError:
				pass

			return super().preprocess(document, lang)




