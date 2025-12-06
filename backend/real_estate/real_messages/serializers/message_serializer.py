from rest_framework import serializers
from ..models import Message, Conversation
from users.serializers.user_serializer import UserSerializer


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'is_pinned', 'created_at', 'updated_at']


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    conv_id = ConversationSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'conv_id', 'receiver', 'message', 'created_at', 'updated_at']