
import os
from celery.schedules import crontab

ENVIRONMENT = os.getenv('ENVIRONMENT', 'DEVELOPMENT').upper()
DEBUG = ENVIRONMENT == 'DEVELOPMENT'
TIMEZONE = 'US/Eastern'
MAX_CONTENT_LENGTH = 20 * 1024 * 1024

LANGS = os.getenv('LANGS', 'fr,es,kr,ch,ja')
LANGS = LANGS.split(',')

# MONGODB
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://127.0.0.1:27017')
MONGO_DB = os.getenv('MONGO_DB', 'database')

# S3
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY', '')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY', '')
S3_BUCKET = os.getenv('S3_BUCKET', 'montrealuploads')
S3_FOLDER = os.getenv('S3_FOLDER', 'faces')

# CELERY
CELERY_TIMEZONE = TIMEZONE
CELERYBEAT_SCHEDULE = {
  'batch_faces': {
    'task': 'batch_faces',
    'schedule': crontab(minute='*/15')
  }
}
CELERY_ACCEPT_CONTENT = ['super-json']
CELERY_TASK_SERIALIZER = 'super-json'
CELERY_RESULT_SERIALIZER = 'super-json'
CELERY_EVENT_QUEUE_PREFIX = 'faces'

# RABBITMQ
RABBITMQ_URL = os.getenv('RABBITMQ_URL', '')

# ALGOLIA
ALGOLIA_ID = os.getenv('ALGOLIA_ID', '')
ALGOLIA_KEY = os.getenv('ALGOLIA_KEY', '')



