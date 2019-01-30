from core import app
from flask import request, abort

from core.models.core.model import Model
from core.models.core.has_routes import HasRoutes
from core.models.core.with_templates import WithTemplates
from core.tasks.airtable import airtable

from core.helpers.validation_rules import validation_rules

from core.models.faces.face import Face


with app.app_context():
  class Message(WithTemplates, HasRoutes, Model):

    collection_name = 'messages'

    schema = {
      'face_id': validation_rules['object_id'],
      'brand': validation_rules['text'],
      'brand_url': validation_rules['text'],
      'name': validation_rules['text'],
      'email': validation_rules['email'],
      'description': validation_rules['text'],
      'requirements': validation_rules['text'],
      'location': validation_rules['text'],
      'dates': validation_rules['text'],
      'offer': validation_rules['text'],
      'metadata': validation_rules['metadata']
    }

    private_fields = ['face_email']

    endpoint = '/messages'
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
        'methods': ['GET']
      },
      # {
      #   'route': '/<_id>',
      #   'view_function': 'update_view',
      #   'methods': ['PATCH', 'PUT'],
      #   'requires_user': True
      # },
      {
        'route': '/<_id>',
        'view_function': 'delete_view',
        'methods': ['DELETE'],
        'requires_user': True
      }
    ]

    templates = [
      {
        'view_function': 'get_view',
        'template': 'faces/message.html',
        'response_key': 'message'
      }
    ]


    @classmethod
    def create(cls, document):

      face = Face.get(document['face_id'], postprocess=False)
      document['face_name'] = face['first_name']
      document['face_email'] = face['email']

      new_document = super().create(document)
      
      airtable.apply_async(('Contact Requests', {
        'Face Name': document['face_name'],
        'Face Email': document['face_email'],
        'Contact Name': document['name'],
        'Contact Email': document['email'],
        'Brand Name': document['brand'],
        'Brand URL': document['brand_url'],
        'Shoot description': document['description'],
        'Shoot requirements': document['requirements'],
        'Shoot location': document['location'],
        'Shoot dates': document['dates'],
        'Shoot offer': document['offer'],
        'Notify': {'email': 'hello@goodfaces.club'}
      }))

      return new_document

