from core import app
from flask import request, abort

from core.helpers.json import to_json
from core.models.core.model import Model
from core.models.core.has_routes import HasRoutes
from core.models.core.with_templates import WithTemplates

from core.helpers.validation_rules import validation_rules

from core.models.cms.author import Author

from bson.objectid import ObjectId
from datetime import datetime
import markdown

from pytz import timezone


with app.app_context():
	class Post(WithTemplates, HasRoutes, Model):

		collection_name = 'posts'
		collection_sort = [('published_at', -1)]

		schema = {
			'title': validation_rules['text'],
			'route': validation_rules['text'],
			'thumbnail': validation_rules['image'],
			'banner': validation_rules['image'],
			'excerpt': validation_rules['text'],
			'body': validation_rules['text'],
			'tags': validation_rules['text_list'],
			'authors': {
				'type': 'list',
				'schema': validation_rules['object_id']
			},
			'published_at': validation_rules['datetime'],
			'is_online': validation_rules['bool'],
			'metadata': validation_rules['metadata']
		}

		endpoint = '/posts'
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
			},
			{
        'route': '/tagged/<tags>',
        'view_function': 'tagged_view',
        'methods': ['GET']
      }
		]


		templates = [
			{
				'view_function': 'list_view',
				'template': 'posts/posts.html',
				'response_key': 'posts'
			},
			{
				'view_function': 'get_view',
				'template': 'posts/post.html',
				'response_key': 'post'
			},
      {
        'view_function': 'tagged_view',
        'template': 'posts/tagged.html',
        'response_key': 'response'
      }
		]



		@classmethod
		def preprocess(cls, document, lang=None):

			try:
				document['authors'] = list(map(ObjectId, document['authors']))
			except KeyError:
				pass

			return super().preprocess(document)



		@classmethod
		def update(cls, _id, document, other_operators={}, projection={}, lang=None):

			return super().update(_id, document, other_operators, projection, lang)





