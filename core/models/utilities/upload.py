
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
				'methods': ['POST'],
				'requires_admin': True
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
			print(upload)

			# connection = boto.connect_s3(app.config['S3_ACCESS_KEY'], app.config['S3_SECRET_KEY'], is_secure=True)
			# print(connection)
			# print(app.config['S3_BUCKET'])
			# bucket = connection.get_bucket(app.config['S3_BUCKET'], validate=False)
			# print(bucket)

			# key = bucket.new_key(app.config['S3_FOLDER'] + '/' + _id + '/' + filename)
			# key.set_contents_from_file(uploaded_file, headers={'Content-Type': mimetypes.guess_type(filename)[0]})


			return cls._format_response({
				'url': '/' + app.config['S3_FOLDER'] + '/' + _id + '/' + filename,
				'file_name': filename
			})






