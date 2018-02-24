from core import app
from flask import request, abort

from core.models.auth.user import User

from core.helpers.validation_rules import validation_rules

import urllib
import re
import string


with app.app_context():
  class Face(User):

    collection_name = 'faces'
    alternate_index = 'handle'

    schema = {
      'email': validation_rules['email'],
      'password': validation_rules['password'],
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
        'route': '/new',
        'view_function': 'new_view',
        'methods': ['GET']
      },
      {
        'route': '/tagged/<tags>',
        'view_function': 'tagged_view',
        'methods': ['GET']
      },
      {
        'route': '/cities/<city>',
        'view_function': 'city_view',
        'methods': ['GET']
      },
      {
        'route': '/<_id>/contact',
        'view_function': 'contact_view',
        'methods': ['GET']
      },
      {
        'route': '/_search',
        'view_function': 'search_view',
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
        'view_function': 'new_view',
        'template': 'faces/new_face.html',
        'response_key': 'face'
      },
      {
        'view_function': 'tagged_view',
        'template': 'faces/tagged.html',
        'response_key': 'response'
      },
      {
        'view_function': 'city_view',
        'template': 'faces/city.html',
        'response_key': 'response'
      },
      {
        'view_function': 'contact_view',
        'template': 'faces/contact.html',
        'response_key': 'face'
      },
      {
        'view_function': 'search_view',
        'template': 'faces/search.html',
        'response_key': 'results'
      }
    ]


    @classmethod
    def preprocess(cls, document, lang=None):
      # for cache in app.caches:
      #   app.caches[cache].clear()

      try:
        document['handle'] = re.sub('[^%s]' % (string.ascii_letters + string.digits), '', urllib.parse.quote_plus(document['handle'].lower()))
      except KeyError:
        pass

      return super().preprocess(document, lang)


    @classmethod
    def list(cls, document_filter={}, projection={}, limit=0, skip=0, sort=None, lang=None):

      return super().list({**document_filter, 'is_approved': True}, projection, limit, skip, sort, lang)


    @classmethod
    def postprocess(cls, document, lang=None):

      if 'photos' not in document or len(document['photos']) == 0:
        document['photos'] = ['/faces/empty.png']

      try:
        document['profile_photo'] = document['photos'][document['profile_photo']]
      except KeyError:
        document['profile_photo'] = document['photos'][0]

  
      return super().postprocess(document, lang)



    # VIEWS

    @classmethod
    def contact_view(cls, _id):
      document = cls.get(_id)
      return cls._format_response(document)


    @classmethod
    def city_view(cls, city):
      limit = int(request.args.get('limit', 0))
      skip = int(request.args.get('skip', 0))

      return cls._format_response({
        'city': city,
        'faces': cls.list({'city': city}, limit=limit, skip=skip)
      })


    @classmethod
    def new_view(cls):
      return cls._format_response({})


