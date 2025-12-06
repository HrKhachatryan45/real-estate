from real_estate.models import BaseModel
from datetime import datetime
from django.utils import timezone
from django.db import models
import uuid
from django.contrib.auth.hashers import make_password, check_password

class User(BaseModel):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    email = models.CharField(max_length=100,unique=True)
    fullname = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    profile_picture = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    cloudinary_id = models.CharField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    favourite_listings = models.JSONField(default=list, blank=True)
    recent_listings = models.JSONField(default=list, blank=True)
    conversations = models.JSONField(default=list,blank=True)
    expo_token = models.CharField(max_length=200,default='',null=True)

    class Meta:
        db_table = 'real_estate_users'

    def set_password(self, raw_password):
        """
            We added custom function to our User model
        """
        self.password = make_password(raw_password)
        self.save(update_fields=['password'])

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)    


class PasswordReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'password_resets'
        
    def is_valid(self):
        """Check if code is still valid"""
        return not self.used and self.expires_at > timezone.now()        