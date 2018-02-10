
import os

ENVIRONMENT = os.getenv('ENVIRONMENT', 'DEVELOPMENT').upper()
DEBUG = ENVIRONMENT == 'DEVELOPMENT'
TIMEZONE = 'US/Eastern'

LANGS = os.getenv('LANGS', 'fr,es,kr,ja')
LANGS = LANGS.split(',')