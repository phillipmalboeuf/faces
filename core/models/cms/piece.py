from core import app
from flask import request, abort

from core.models.core.model import Model
from core.models.core.has_routes import HasRoutes

from core.helpers.validation_rules import validation_rules
from core.helpers.json import to_json


with app.app_context():
	class Piece(HasRoutes, Model):

		collection_name = 'pieces'

		schema = {
			'title': validation_rules['text'],
			'is_online': validation_rules['bool'],
			'content': validation_rules['content'],
			'metadata': validation_rules['metadata']
		}


		endpoint = '/pieces'
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


		@classmethod
		def preprocess(cls, document, lang=None):
			# for cache in app.caches:
			# 	app.caches[cache].clear()

			return super().preprocess(document, lang)


		@classmethod
		def update(cls, _id, document, other_operators={}, projection={}, lang=None):

			try:
				for key in document['content'].copy().keys():
					value = document['content'].pop(key)
					document['content.'+key] = value

				del document['content']

			except KeyError:
				pass

			return super().update(_id, document, other_operators, projection, lang)



		@classmethod
		def _values(cls, lang=None):
			values = {}
			for document in cls.list():
				title = document['title'].lower().replace(' ', '').replace('&', '_').replace('#', '_')
				values[title] = document

				try:
					for (key, value) in document['content'].items():
						values[title][key] = value
					del values[title]['content']
				except KeyError:
					pass


				if lang is not None:
					try:
						for (key, value) in document['translations'][lang]['content'].items():
							values[title][key] = value
						del values[title]['translations']
					except KeyError:
						pass


				del values[title]['is_online']

			return values








