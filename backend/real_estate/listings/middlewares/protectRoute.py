from django.http import JsonResponse
from ..utils import decode_jwt
from ..models import User

class JWTAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        # request.user = None
        path = request.path
        if path.startswith('/api/auth/register') or \
                path.startswith('/api/auth/login') or \
                path.startswith('/api/auth/csrf') or \
                path.startswith('/api/auth/logout') or \
                path.startswith('/api/auth/refresh/accessToken') or \
                path.startswith('/api/auth/forgot/password') or \
                path.startswith('/api/auth/reset/password') or \
                path.startswith('/api/admin'):

            return self.get_response(request)

        auth_header = request.headers.get('Authorization')
        print("Auth Header:",auth_header)
        if not auth_header or not auth_header.startswith('Bearer'):
            return JsonResponse({'error': 'No Token Provided'}, status=401)
        token = auth_header.split(' ')[1]
        if not token:
            return JsonResponse({'error': 'No Token Provided'}, status=401)
        payload = decode_jwt(token,True)
        if not payload:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)
        try:
            user = User.objects.get(id=payload['user_id'])
            request.user = user
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=401)

        response = self.get_response(request)
        return response

