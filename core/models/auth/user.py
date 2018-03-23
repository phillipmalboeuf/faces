
from core import app
from flask import request, abort

from core.helpers.json import to_json
from core.models.core.model import Model
from core.models.core.has_routes import HasRoutes
from core.models.core.with_templates import WithTemplates


from core.helpers.validation_rules import validation_rules
# from core.tasks.trigger import trigger_tasks

from bson.objectid import ObjectId

# import stripe

import string
import random
import hashlib
import uuid



with app.app_context():
	class User(WithTemplates, HasRoutes, Model):

		collection_name = 'users'
		collection_sort = [('updated_at', -1), ('created_at', -1)]

		schema = {
			'email': validation_rules['email'],
			'password': validation_rules['password'],
			'first_name': validation_rules['text'],
			'last_name': validation_rules['text'],
			# 'referral_id': validation_rules['text'],
			'notes': validation_rules['text'],
			'is_admin': validation_rules['bool'],
			'metadata': validation_rules['metadata']
		}

		private_fields = ['password', 'password_salt', 'email']

		endpoint = '/users'
		routes = [
			{
				'route': '',
				'view_function': 'list_view',
				'methods': ['GET'],
				'requires_admin': True
			},
			{
				'route': '',
				'view_function': 'create_view',
				'methods': ['POST']
			},
			{
				'route': '/<_id>',
				'view_function': 'get_view',
				'methods': ['GET'],
				'requires_user': True
			},
			{
				'route': '/<_id>',
				'view_function': 'update_view',
				'methods': ['PATCH', 'PUT'],
				'requires_user': True
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
				'view_function': 'profile_view',
				'template': 'users/user.html',
				'response_key': 'user'
			}
		]



		@classmethod
		def create(cls, document):


			# document['order_count'] = 0
			# document['subscription_order_count'] = 0

			# document['referral_id'] = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(7))
			# document['referral_count'] = 0

			# document['referral_order_count'] = 0
			# document['referral_subscription_count'] = 0
			# document['referral_subscription_order_count'] = 0
			
			# document['store_credit'] = 0
			
			document['_id'] = ObjectId()
			document['user_id'] = document['_id']


			# stripe.api_key = app.config['STRIPE_API_KEY']
			# document['provider_id'] = stripe.Customer.create(
			# 	email=document['email'],
			# 	metadata={'_id': document['_id']}
			# )['id']



			if 'password' not in document:
				document['password'] = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(9))
				document['password'] = '-'.join([document['password'][:3], document['password'][3:6], document['password'][6:]])
				has_generated_password = True

			else:
				has_generated_password = False


			if 'is_admin' not in document:
				document['is_admin'] = False


			# trigger_tasks.apply_async(('user_created', {
			# 	'user': document,
			# 	'has_generated_password': has_generated_password
			# }))


			return super().create(document)



		@classmethod
		def update(cls, _id, document, other_operators={}, projection={}, lang=None):


			document = super().update(_id, document, other_operators, projection, lang)


			# trigger_tasks.apply_async(('user_updated', {
			# 	'user': document
			# }))


			return document




		@classmethod
		def preprocess(cls, document, lang=None):

			if not request.from_admin:
				try:
					del document['is_admin']
				except KeyError:
					pass

			try:
				document['password_salt'] = uuid.uuid4().hex
				document['password'] = hashlib.sha256(document['password'].encode('utf-8') + document['password_salt'].encode('utf-8')).hexdigest()
			except KeyError:
				del document['password_salt']

			return super().preprocess(document, lang)



		@classmethod
		def postprocess(cls, document, lang=None):

			return super().postprocess(document, lang)




