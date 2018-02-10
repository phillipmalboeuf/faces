from flask import json
from flask import Response


from bson.objectid import ObjectId
from bson import json_util

from datetime import datetime, date, timedelta




def to_json(document=None, code=200):

	return Response(
		json.dumps(document, sort_keys=True, default=json_formater),
		status=code,
		mimetype='application/json'
	)



def dumps(document):
	return json.dumps(document, default=json_formater)

def loads(document):
	return json.loads(document)




def json_formater(obj):

	if isinstance(obj, ObjectId):
		return str(obj)

	if isinstance(obj, datetime):
		return obj.isoformat()

	if isinstance(obj, date):
		return obj.isoformat()

	if isinstance(obj, timedelta):
		return str(obj)
		

	return json_util.default(obj)


