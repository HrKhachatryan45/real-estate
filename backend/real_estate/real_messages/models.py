from django.db import models
from real_estate.models import BaseModel
import uuid
from users.models import User

class Conversation(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participants = models.ManyToManyField(User,blank=True,related_name='participants')
    is_pinned = models.JSONField(default=list)

    class Meta:
        db_table = 'real_estate_conversations'


class Message(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conv_id = models.ForeignKey(Conversation, on_delete=models.CASCADE, null=True, blank=True)
    sender = models.ForeignKey(User,null=True,blank=True, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User,null=True,blank=True, on_delete=models.CASCADE, related_name='receiver')
    message = models.TextField(max_length=1000,blank=False,null=False)

    class Meta:
        db_table = 'real_estate_messages'
