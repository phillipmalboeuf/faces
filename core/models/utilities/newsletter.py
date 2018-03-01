
from core import app
from core.models.core.has_routes import HasRoutes

from flask import request, json
import requests


with app.app_context():
	class NewsletterEmail(HasRoutes):

		endpoint = '/_newsletter_email'
		routes = [
			{
				'route': '',
				'view_function': 'signup_view',
				'methods': ['POST']
			}
		]


		@classmethod
		def signup_view(cls):
			data = cls._get_json_from_request()
			if 'instagram_handle' not in data:
				data['instagram_handle'] = None

			response = requests.post('https://api.airtable.com/v0/apps4zma9HfDnpDrJ/Emails',
				headers={'Authorization': 'Bearer {}'.format(app.config['AIRTABLE_KEY']), 'Content-type': 'application/json'},
				data=json.dumps({'fields': {'Email': data['email'], 'Instagram handle': data['instagram_handle'], 'Notify': {'email': 'phil@boeuf.coffee'}}}))

			return cls._format_response(response.json())






