from core import app
from flask import abort, request

# from core.tasks.search import search_index, search_delete

from bson.objectid import ObjectId

from datetime import datetime
from pytz import timezone


with app.app_context():
	class Model():

		collection_name = 'models'
		collection_projection = {}
		collection_filter = {}
		collection_sort = []

		private_fields = []

		alternate_index = 'route'


		@classmethod
		def preprocess(cls, document, lang=None):

			if lang is not None:
				for (key, value) in list(document.items()):
					document['translations.'+lang+'.'+key] = value
					del document[key]
					
			return document


		@classmethod
		def postprocess(cls, document, lang=None):

			if lang is not None:
				try:
					for (key, value) in document['translations'][lang].items():
						document[key] = value
				except KeyError:
					pass

			if not hasattr(request, 'current_session') or (not request.from_admin and ('user_id' not in document or request.current_session['user_id'] != document['user_id'])):
				document = cls._remove_private_fields(document)

			return document



		@classmethod
		def list(cls, document_filter={}, projection={}, limit=0, skip=0, sort=None, lang=None):
			if sort is None:
				sort = cls.collection_sort

			return [cls.postprocess(document, lang) for document in app.db[cls.collection_name].find(cls._merge_filters(document_filter), cls._merge_projections(projection), limit=limit, skip=skip, sort=sort)]



		@classmethod
		def count(cls, document_filter={}):

			return app.db[cls.collection_name].count(cls._merge_filters(document_filter))




		@classmethod
		def get(cls, _id, projection={}, lang=None, postprocess=True):
			if ObjectId.is_valid(_id):
				return cls.get_where({'_id': ObjectId(_id)}, projection, lang, postprocess)

			else:
				return cls.get_where({cls.alternate_index: _id}, projection, lang, postprocess)



		@classmethod
		def get_where(cls, document_filter, projection={}, lang=None, postprocess=True):

			document = app.db[cls.collection_name].find_one(cls._merge_filters(document_filter), cls._merge_projections(projection))
			if document is None:
				abort(404)

			return cls.postprocess(document, lang) if postprocess else document



		@classmethod
		def create(cls, document):
			
			document['created_at'] = datetime.now(timezone(app.config['TIMEZONE']))
			document = cls.preprocess(document)
			request.document = document
			
			try:
				result = app.db[cls.collection_name].insert_one(document)
			except DuplicateKeyError:
				from core.helpers.raise_error import raise_error
				raise_error('validation', 'fields_not_unique', code=400)


			document['_id'] = result.inserted_id


			return {'_id': document['_id']}





		@classmethod
		def update(cls, _id, document, other_operators={}, projection={}, lang=None):

			return cls.update_where({'_id': ObjectId(_id)}, document, projection=projection, other_operators=other_operators, lang=lang)
			



		@classmethod
		def update_where(cls, document_filter, document, projection={}, multiple=False, other_operators={}, lang=None):

			document = cls.preprocess(document, lang)
			document['updated_at'] = datetime.now(timezone(app.config['TIMEZONE']))

			document_set = other_operators
			document_set['$set'] = document

			try:
				if not multiple:
					document = app.db[cls.collection_name].find_one_and_update(cls._merge_filters(document_filter), update=document_set, projection=cls._merge_projections(projection), new=True)
					if document is None:
						abort(404)

					return cls.postprocess(document)

				else:
					return [cls.postprocess(document) for document in app.db[cls.collection_name].update(cls._merge_filters(document_filter), document_set, multi=True)]
					
			except DuplicateKeyError:
				from core.helpers.raise_error import raise_error
				raise_error('validation', 'fields_not_unique', code=400)






		@classmethod
		def delete(cls, _id):

			app.db[cls.collection_name].delete_one({'_id': ObjectId(_id)})


			return {'_id': _id}



		@classmethod
		def search(cls, query):
			index = app.search.init_index(cls.collection_name)
			return index.search(query)



		# HELPERS
		@classmethod
		def _merge_filters(cls, document_filter):

			merged_filters = cls.collection_filter.copy()
			merged_filters.update(document_filter)

			return merged_filters



		@classmethod
		def _merge_projections(cls, projection):

			merged_projections = cls.collection_projection.copy()
			merged_projections.update(projection)

			if merged_projections == {}:
				merged_projections = None


			return merged_projections


		@classmethod
		def _remove_private_fields(cls, document):
			for key in list(document.keys()):
				if key in cls.private_fields:
					del document[key]
			
			return document

