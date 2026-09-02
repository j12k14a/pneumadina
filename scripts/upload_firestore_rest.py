import json
import urllib.request
import os

json_path = os.path.join(os.path.dirname(__file__), '..', 'client', 'src', 'data', 'jasmine_post.json')
with open(json_path, 'r', encoding='utf-8') as f:
    post = json.load(f)

def to_firestore_value(val):
    if val is None:
        return {'nullValue': None}
    elif isinstance(val, bool):
        return {'booleanValue': val}
    elif isinstance(val, int):
        return {'integerValue': str(val)}
    elif isinstance(val, float):
        return {'doubleValue': val}
    elif isinstance(val, str):
        return {'stringValue': val}
    elif isinstance(val, list):
        return {'arrayValue': {'values': [to_firestore_value(v) for v in val]}}
    elif isinstance(val, dict):
        return {'mapValue': {'fields': {k: to_firestore_value(v) for k, v in val.items()}}}
    return {'stringValue': str(val)}

fields = {k: to_firestore_value(v) for k, v in post.items()}
body = json.dumps({'fields': fields}).encode('utf-8')

post_id = post['id']
url = f'https://firestore.googleapis.com/v1/projects/pneumadina-611a2/databases/(default)/documents/posts/{post_id}'

req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'}, method='PATCH')
try:
    with urllib.request.urlopen(req) as resp:
        print('Firestore REST API response code:', resp.status)
        print('Jasmine article written to Cloud Firestore successfully!')
except Exception as e:
    print('Firestore REST API notice:', e)
