from django.shortcuts import render
from django.utils import timezone
import random
from datetime import datetime, timedelta
from .utils import sendEmail
from .email_templates.email_templates import ForgotPasswordCodeTemplate
from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.password_validation import validate_password
from .utils import generate_jwt,decode_jwt
import cloudinary.uploader
from cloudinary.uploader import upload_large
from .models import User, PasswordReset
import json
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from .serializers.register_serializer import RegisterSerializer
from .serializers.user_serializer import UserSerializer
from django.views.decorators.csrf import csrf_exempt

@ensure_csrf_cookie
def csrf_init(request):
    return JsonResponse({'message': 'CSRF cookie set'})

def register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    body = json.loads(request.body)

    print(body,5)

    email = body.get('email')
    fullname = body.get('fullName')
    password = body.get('password')
    city = body.get('city', '')
    phone = body.get('phone', '')

    if any(field is None for field in [email, fullname, password, city, phone]):
        return JsonResponse({'error': 'Missing required fields'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already registered'}, status=400)

    serializer = RegisterSerializer(data={
        'email': email,
        'password': password,
        'fullname': fullname,
        'city': city,
        'phone_number': phone
    })    

    if serializer.is_valid():
        user = serializer.save()
        tokens = generate_jwt(str(user.id))
        response = JsonResponse({
            'user':RegisterSerializer(user).data,
            'access_token':tokens['access_token']
        }, status=200)

        response.set_cookie(
            key='jwt',
            value=tokens['refresh_token'],
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age= 7 * 24 * 60 * 60
        )

        return response;
    else:
        errors = serializer.errors
        if 'fullname' in errors:
            return JsonResponse({'error': errors['fullname'][0]},status=400)
        if 'email' in errors:
            return JsonResponse({'error':errors['email'][0]},status=400)
        if 'password' in errors:
            return JsonResponse({'error':errors['password'][0]},status=400)
        if 'phone_number' in errors:
            return JsonResponse({'error':errors['phone_number'][0]},status=400)
        else:
            return JsonResponse({'errors': serializer.errors}, status=400)

def login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    body = json.loads(request.body)

    email = body.get('email')
    password = body.get('password')
    
    if email is None or email == '' or password is None or password == '':
        return JsonResponse({'error': 'Missing required fields'}, status=400)

    if not User.objects.filter(email=email).exists() or not User.objects.get(email=email).check_password(password):
        return JsonResponse({'error': 'Inalid username or password'}, status=400)

    user = User.objects.get(email=email)

    tokens = generate_jwt(str(user.id))



    response = JsonResponse({
        'user':UserSerializer(user).data,
        'access_token':tokens['access_token']
    }, status=200)

    response.set_cookie(
        key='jwt',
        value=tokens['refresh_token'],
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age= 7 * 24 * 60 * 60
    )

    return response

def logout(request):
    if(request.method == 'POST'):
        response = JsonResponse({'message':'Logged out'})
        response.delete_cookie('jwt')
        return response
    else:
        return JsonResponse({'message':'Invalid method'})

def edit_profile(request):
    if request.method != 'POST':
        return JsonResponse({'error':'Invalid method'})

    user = request.user  

    file = request.FILES.get('profile_picture', None)    
    if file:
        old_id = user.cloudinary_id

        uploaded = upload_large(file,resource_type='auto')
        if old_id:
            cloudinary.uploader.destroy(old_id)
        user.cloudinary_id = uploaded['public_id']
        user.profile_picture = uploaded['secure_url']

    allowed_fields = ['fullname', 'city', 'phone_number']
    data = request.POST


    for field in allowed_fields:
        if field in data:
            setattr(user, field, data[field])

    user.save() 

    return JsonResponse({
        'user': UserSerializer(user).data
    }, status=200)

def change_password(request):
    if request.method != 'POST':
        return JsonResponse({'error':'Invalid method'})

    body = json.loads(request.body)    
    user = request.user

    if not user.check_password(body['current_password']):
        return JsonResponse({'error':'Current password is incorrect'})
    
    if not body['new_password'] == body['new_password_confirm']:
        return JsonResponse({'error':'New passwords dont match'})

    try:
        validate_password(body['new_password'])
    except DjangoValidationError:
        return JsonResponse({"error":"Enter a strong password."})

    user.set_password(body['new_password'])

    user.save()

    return JsonResponse({
        'user': UserSerializer(user).data
    }, status=200)


def refresh_access_token(request):
    if(request.method == 'GET'):
        refresh_token = request.COOKIES.get('jwt')
        if not refresh_token:
            return JsonResponse({'error': 'Refresh token missing'}, status=401)
        user = decode_jwt(refresh_token,False)
        if not user:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        tokens = generate_jwt(str(user['user_id']))
        return JsonResponse({'access_token': tokens['access_token']},status=200)
    else:
        return JsonResponse({'message':'Invalid method'})


def forgot_password(request):
    if request.method != 'POST':
        return JsonResponse({'error':'Invalid method'})

    body = json.loads(request.body)    
    email = body.get('email')

    if not User.objects.filter(email=email).exists():
        return JsonResponse({'error':'Email not registered'},status=400)

    user = User.objects.get(email=email)

    otp_code = str(random.randint(100000, 999999))
    
    expiry_time = timezone.now() + timedelta(minutes=15)

    if PasswordReset.objects.filter(user=user, used=False).exists():
        PasswordReset.objects.filter(user=user, used=False).delete()

    password_reset = PasswordReset.objects.create(
        user=user,
        code=otp_code,
        expires_at=expiry_time
    )

    sendEmail(email, ForgotPasswordCodeTemplate, {'fullname': user.fullname,'otp_code': otp_code}, token="some_reset_token", reset_link="some_reset_link")

    return JsonResponse({'message':'Password reset instructions sent to email'},status=200)


def reset_password(request):
    if request.method != 'POST':
        return JsonResponse({'error':'Invalid method'})

    body = json.loads(request.body)    
    email = body.get('email')
    otp_code = body.get('otp_code')
    new_password = body.get('new_password')
    new_password_confirm = body.get('new_password_confirm')

    if not User.objects.filter(email=email).exists():
        return JsonResponse({'error':'Email not registered'},status=400)

    reset = PasswordReset.objects.filter(user__email=email,code=otp_code).first()

    if not reset or not reset.is_valid():
        return JsonResponse({'error':'Invalid or used OTP code'},status=400)


    user = User.objects.get(email=email)

    if not new_password == new_password_confirm:
        return JsonResponse({'error':'New passwords dont match'})

    try:
        validate_password(new_password)
    except DjangoValidationError:
        return JsonResponse({"error":"Enter a strong password."})

    user.set_password(new_password)

    user.save()

    return JsonResponse({
        'message':'Password resetted successfully'
    }, status=200)


