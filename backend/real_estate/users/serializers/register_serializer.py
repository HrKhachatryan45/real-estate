from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
import re
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    fullname = serializers.CharField()
    city = serializers.CharField(required=False, allow_blank=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    def validate_phone_number(self,value):
        reg = r'^\+?\d{3,4}[\s\-]?\d{6,10}$'
        if not re.match(reg, value):
            raise serializers.ValidationError('Phone format invalid')
        return value

    def validate_fullname(self,value):
        if len(value) < 3:
            raise serializers.ValidationError('Full name must be at least 3 characters')
        return value

    def validate_email(self, value):
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a strong password.")
        return value

    def create(self, validated_data):
        from users.models import User
        user = User.objects.create(
            email=validated_data['email'],
            fullname=validated_data['fullname'],
            city=validated_data.get('city', ''),
            phone_number=validated_data.get('phone_number', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user    