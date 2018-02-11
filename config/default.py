
import os

ENVIRONMENT = os.getenv('ENVIRONMENT', 'DEVELOPMENT').upper()
DEBUG = ENVIRONMENT == 'DEVELOPMENT'
TIMEZONE = 'US/Eastern'

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