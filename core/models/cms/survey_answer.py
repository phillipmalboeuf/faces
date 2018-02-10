from core import app
from flask import request, abort

from core.models.core.child_model import ChildModel
from core.models.core.has_child_routes import HasChildRoutes

from core.models.cms.survey import Survey

from core.helpers.validation_rules import validation_rules



with app.app_context():
	class SurveyAnswer(HasChildRoutes, ChildModel):

		parent = Survey
		list_name = 'answers'

		schema = {
			'answers': {
				'type': 'list',
				'schema': {
					'type': 'dict',
					'schema': {
						'question_key': validation_rules['text'],
						'value': validation_rules['text'],
						'metadata': validation_rules['metadata']
					}
				},
			},
			'metadata': validation_rules['metadata']
		}


		endpoint = '/answers'
		routes = [
			{
				'route': '',
				'view_function': 'list_view',
				'methods': ['GET']
			},
			{
				'route': '',
				'view_function': 'create_view',
				'methods': ['POST']
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





