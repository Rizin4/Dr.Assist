from datetime import datetime
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken

def generate_custom_jwt_payload(access_token: AccessToken, user, login_access_token_created_at):
    issued_at = datetime.utcnow()
    payload = {
        'user_id': user.id,
        'username': user.username,
        'access_token_issued_at': access_token.current_time.timestamp(),
        'login_access_token_created_at': login_access_token_created_at,  # Include login access token creation time
        # 'custom_payload_key': 'custom_payload_value',
        'iat': issued_at.timestamp(),
        'idDoctor': user.isDoctor,
    }
    return payload

