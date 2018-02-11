from core import app
from flask import request, abort

from core.models.core.model import Model
from core.models.core.has_routes import HasRoutes
from core.models.core.with_templates import WithTemplates

from core.helpers.validation_rules import validation_rules

import urllib
import re
import string


with app.app_context():
  class Face(WithTemplates, HasRoutes, Model):

    collection_name = 'faces'
    alternate_index = 'handle'

    schema = {
      'first_name': validation_rules['text'],
      'last_name': validation_rules['text'],
      'handle': validation_rules['text'],
      'photos': validation_rules['image_list'],
      'bio': validation_rules['text'],
      'tags': validation_rules['text_list'],
      'portfolio_url': validation_rules['text'],
      'instagram_handle': validation_rules['text'],
      'brands': validation_rules['links_list'],
      'metadata': validation_rules['metadata']
    }

    endpoint = '/faces'
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
        'requires_user': True
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
      },
      {
        'route': '/<_id>/contact',
        'view_function': 'contact_view',
        'methods': ['GET']
      }
    ]

    templates = [
      {
        'view_function': 'list_view',
        'template': 'faces/faces.html',
        'response_key': 'faces'
      },
      {
        'view_function': 'get_view',
        'template': 'faces/face.html',
        'response_key': 'face'
      },
      {
        'view_function': 'tagged_view',
        'template': 'faces/tagged.html',
        'response_key': 'response'
      },
      {
        'view_function': 'contact_view',
        'template': 'faces/contact.html',
        'response_key': 'face'
      }
    ]


    @classmethod
    def preprocess(cls, document, lang=None):
      # for cache in app.caches:
      #   app.caches[cache].clear()

      try:
        document['route'] = re.sub('[^%s]' % (string.ascii_letters + string.digits), '', urllib.parse.quote_plus(document['route'].lower()))
      except KeyError:
        pass

      return super().preprocess(document, lang)


    @classmethod
    def postprocess(cls, document, lang=None):

      try:
        document['profile_photo'] = document['photos'][document['profile_photo']]
      except KeyError:
        document['profile_photo'] = document['photos'][0]

  
      return super().postprocess(document, lang)



    # VIEWS

    @classmethod
    def tagged_view(cls, tags):

      limit = int(request.args.get('limit', 0))
      skip = int(request.args.get('skip', 0))
      tags = tags.split(',')

      return cls._format_response({
        'tags': tags,
        'faces': cls.list({'tags': {'$all': tags}}, limit=limit, skip=skip)
      })


    @classmethod
    def contact_view(cls, _id):
      document = cls.get(_id)
      return cls._format_response(document)



