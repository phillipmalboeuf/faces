
validation_rules = {
	'text': { 'type': 'string', 'maxlength': 1000000 },
	'password': { 'type': 'string', 'minlength': 8 },
	'bool':{ 'type':'boolean' },
	'object_id': { 'type': 'object_id' },
	'int': { 'type': 'integer', 'min': 0 },
	'number':{ 'type': 'number', 'min': 0.0 },

	'email': { 'type': 'string', 'regex': '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$' },
	'image': { 'type': 'string' },
	'frequency': { 'type': 'string', 'allowed': ['day', 'week', 'month', 'year']},
	'day': { 'type': 'integer', 'min': 0, 'max': 6 },
	'hour': { 'type': 'integer', 'min': 0, 'max': 23 },
	'minute': { 'type': 'integer', 'min': 0, 'max': 59 },
	'date': { 'type': 'date' },
	'datetime': { 'type': 'datetime' },
	'currency': { 'type': 'string', 'allowed': ['cad', 'usd']},
	'method': { 'type': 'string', 'allowed': ['POST', 'GET', 'PUT', 'PATCH', 'DELETE']},

	'metadata': {
		'type': 'dict',
		'maxlength': 20,
		'valueschema': {
			'type': 'string',
			'maxlength': 100000,
			'nullable': True
		}
	},

	'content':{
		'type': 'dict',
		'maxlength': 40,
		'valueschema': {
			'type': 'string',
			'maxlength': 100000,
			'nullable': True
		}
	}
}

validation_rules['text_list'] = {
		'type':'list',
		'schema': validation_rules['text']
	}

validation_rules['image_list'] = {
		'type':'list',
		'schema': validation_rules['image']
	}

validation_rules['items_list'] = {
		'type': 'list',
		'schema': {
			'type': 'dict',
			'schema': {
				'icon': validation_rules['text'],
				'body': validation_rules['text']
			}
		}
	}

validation_rules['links_list'] = {
		'type': 'list',
		'schema': {
			'type': 'dict',
			'schema': {
				'name': validation_rules['text'],
				'description': validation_rules['text'],
				'link': validation_rules['text']
			}
		}
	}

validation_rules['address'] = {
		'type': 'dict',
		'schema': {
			'first_name': validation_rules['text'],
			'last_name': validation_rules['text'],
			'phone': validation_rules['text'],
			'company': validation_rules['text'],
			'street': validation_rules['text'],
			'street_continued': validation_rules['text'],
			'city': validation_rules['text'],
			'region': { 'type': 'string', 'minlength': 2, 'maxlength': 2 },
			'zip': validation_rules['text'],
			'country': { 'type': 'string', 'minlength': 2, 'maxlength': 2 },
			'instructions': validation_rules['text'],
			'metadata': validation_rules['metadata']
		}
	}

validation_rules['credit_card'] = {
		'type': 'dict',
		'schema': {
			'card_token': validation_rules['text'],
			'billing_street': validation_rules['text'],
			'billing_zip': validation_rules['text']
		}
	}

validation_rules['credit_update'] = {
		'type': 'dict',
		'schema': {
			'value': validation_rules['number'],
			'description': validation_rules['text']
		}
	}


validation_rules['values_list'] = {
		'type': 'list',
		'schema': {
			'type': 'dict',
			'schema': {
				'name': validation_rules['text'],
				'value': validation_rules['number']
			}
		}
	}

