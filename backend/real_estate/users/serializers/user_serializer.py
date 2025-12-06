# users/serializers/user_serializer.py
from rest_framework import serializers
from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = ['id', 'email', 'fullname', 'city', 'phone_number', 'cloudinary_id','profile_picture', 'updated_at', 'created_at','favourite_listings','recent_listings','listings','conversations']

        extra_kwargs = {
            'password': {'write_only': True}
        }
