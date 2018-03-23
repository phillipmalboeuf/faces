from core import app
from flask import request, abort, json
from flask import Markup

from core.helpers.json import json_formater

from dateutil import parser
from markdown import markdown

import urllib

@app.template_filter('date')
def date_filter(date, format='%b %d, %Y'):
	if isinstance(date, str):
		date = parser.parse(date)
	
	return date.strftime(format) 


@app.template_filter('percentage')
def percentage_filter(number):
	return '%d%%' % (number * 100)

@app.template_filter('url')
def url_filter(url):
	if not url.startswith('http'):
		return 'http://'+url
	else:
		return url

@app.template_filter('money')
def money_filter(money, currency='CAD'):
	return '{:,.2f}'.format(money)+' '+currency.upper()

@app.template_filter('markdown')
def markdown_filter(content):
	return markdown(content)


@app.template_filter('category')
def category_filter(category):

	for c in app.config['CATEGORIES']:
		if category == c['key']:
			return c['title']

	return None

@app.template_filter('tag')
def category_filter(tag, category):

	for c in app.config['CATEGORIES']:
		if category == c['key']:
			for t in c['tags']:
				if tag == t['key']:
					return t['title']

	return None

@app.template_filter('category_action')
def category_action_filter(category):

	for c in app.config['CATEGORIES']:
		if category == c['key']:
			return c['action']

	return None


@app.template_filter('editable')
def editable(editable, key, data, contenteditable=True):
	if contenteditable:
		markup = '<span{} data-key="{}" contenteditable>{}</span>'
	else:
		markup = '<span{} data-key="{}">{}</span>'

	data_tags = ''
	for (data_key, data_value) in data.items():
		data_tags += ' data-{}="{}"'.format(data_key, data_value)

	if request.from_admin:
		return Markup(markup.format(data_tags, key, editable))
	else:
		return Markup(editable)


@app.template_filter('editable_image')
def editable_image(editable, format, key, data):
	markup = '<img{} data-key="{}" src="https://montrealuploads.imgix.net{}?{}" class="{}">'

	data_tags = ''
	for (data_key, data_value) in data.items():
		data_tags += ' data-{}="{}"'.format(data_key, data_value)


	if request.from_admin:
		return Markup(markup.format(data_tags, key, editable, format, "img--clickable"))
	else:
		return Markup(markup.format("", key, editable, format, ""))


# @app.template_filter('editable_gallery')
# def editable_gallery(editable_gallery, format, key, data):

# 	data_tags = ''
# 	for (data_key, data_value) in data.items():
# 		data_tags += f' data-{data_key}="{data_value}"'


# 	markup = ''

# 	if request.from_admin:
# 		for image in editable_gallery:
# 			markup += f'<img src="https://montrealuploads.imgix.net{image}?{format}">'

# 	# else:
	
# 	return Markup(markup)
	

@app.template_filter('json')
def json_filter(document):
	return Markup(json.dumps(document, sort_keys=True, default=json_formater))



