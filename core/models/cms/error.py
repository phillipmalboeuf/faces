

from core import app
from flask import request, abort

from core.models.core.model import Model
from core.models.core.has_routes import HasRoutes

from core.helpers.validation_rules import validation_rules
from core.helpers.json import to_json



with app.app_context():
	class Error(HasRoutes, Model):

		collection_name = 'errors'

		schema = {
			'category': validation_rules['text'],
			'is_online': validation_rules['bool'],
			'errors': validation_rules['content'],
			'metadata': validation_rules['metadata']
		}

		endpoint = '/errors'
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
		def preprocess(cls, document):

			return super().preprocess(document)


		@classmethod
		def update(cls, _id, document, other_operators={}, projection={}):

			try:
				for key in document['errors'].copy().keys():
					document['errors.'+key] = document['errors'].pop(key)

				del document['errors']

			except KeyError:
				pass

			return super().update(_id, document, other_operators, projection)



		@classmethod
		def _values(cls, lang=None):
			values = {}
			for document in cls.list():
				category = document['category'].lower().replace(' ', '').replace('&', '_').replace('#', '_')
				values[category] = document

				try:
					for (key, value) in document['errors'].items():
						if lang is not None:
							try:
								value['value'] = value['translations'][lang]
							except KeyError:
								pass

						values[category][key] = value['value']
						

					del values[category]['errors']
				except KeyError:
					pass

				del values[category]['is_online']

			return values






