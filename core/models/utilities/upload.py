
from core import app
from core.models.core.has_routes import HasRoutes

from flask import request

from bson.objectid import ObjectId
from werkzeug import secure_filename

import boto3
import mimetypes




with app.app_context():
	class Upload(HasRoutes):

		endpoint = '/_upload'
		routes = [
			{
				'route': '',
				'view_function': 'upload_view',
				'methods': ['POST']
			}
		]


		@classmethod
		def upload_view(cls):
			uploaded_file = request.files['file']

			filename = secure_filename(uploaded_file.filename)
			_id = str(ObjectId())

			client = boto3.client(
				's3',
				aws_access_key_id=app.config['S3_ACCESS_KEY'],
				aws_secret_access_key=app.config['S3_SECRET_KEY']
			)

			upload = client.upload_fileobj(uploaded_file, app.config['S3_BUCKET'], app.config['S3_FOLDER'] + '/' + _id + '/' + filename)

			return cls._format_response({
				'url': '/' + app.config['S3_FOLDER'] + '/' + _id + '/' + filename,
				'file_name': filename
			})






