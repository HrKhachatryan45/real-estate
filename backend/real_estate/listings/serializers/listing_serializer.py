# users/serializers/listing_serializer.py
from rest_framework import serializers
from listings.models import Listing
from users.serializers.user_serializer import UserSerializer

class ListingSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'price', 'price_onsale', 
            'currency', 'listing_type', 'property_type', 'country', 
            'city', 'address', 'square_meters', 'land_area',
            'bedrooms', 'bathrooms', 'floor', 'total_floors', 'furnished',
            'new_construction', 'parking', 'balcony', 'elevator', 'heating_type',
            'images', 'is_active', 'is_featured', 'views', 'owner'
        ]
        read_only_fields = ['id', 'views']