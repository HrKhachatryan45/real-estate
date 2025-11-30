import os
from django.conf import settings
import jwt
import uuid
from datetime import datetime,timedelta,date

ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
REFRESH_TOKEN_SECRET = os.getenv('REFRESH_TOKEN_SECRET')

ACCESS_TOKEN_EXPIRE = os.getenv('ACCESS_TOKEN_EXPIRE')
REFRESH_TOKEN_EXPIRE = os.getenv('REFRESH_TOKEN_EXPIRE')


def generate_jwt(user_id):
    refresh_exp = datetime.utcnow() + timedelta(days=int(REFRESH_TOKEN_EXPIRE or 7))
    access_exp = datetime.utcnow() + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE or 5))

    refresh_payload = {
        'user_id': user_id,
        'exp': refresh_exp,
        'iat': datetime.utcnow(),
    }

    access_payload = {
        'user_id': user_id,
        'exp':access_exp,
        'iat':datetime.utcnow(),
    }
    refresh_token = jwt.encode(refresh_payload, REFRESH_TOKEN_SECRET, algorithm='HS256')
    access_token = jwt.encode(access_payload, ACCESS_TOKEN_SECRET, algorithm='HS256')
    return {'refresh_token': refresh_token,'access_token': access_token}

def decode_jwt(token,isAccess):
    try:
        payload = jwt.decode(token, ACCESS_TOKEN_SECRET if isAccess else REFRESH_TOKEN_SECRET, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError as e:
        return None
    except jwt.InvalidTokenError as e:
        return None
