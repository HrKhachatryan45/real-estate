from django.http import JsonResponse
import json
from users.serializers.user_serializer import UserSerializer
from .serializers.message_serializer import MessageSerializer,ConversationSerializer
from .models import Conversation,Message
from users.models import User
from django.core.exceptions import ValidationError
import uuid

def send_message(request,user_id):
    if request.method != 'POST':
        return JsonResponse({'error':'Invalid method'})
    
    print(user_id,45)

    if str(user_id) == str(request.user.id):
        return JsonResponse({'error':'You can\'t message yourself'})
    
    body = json.loads(request.body)

    user = User.objects.get(id=request.user.id)

    try:
        receiver = User.objects.filter(id=uuid.UUID(user_id)).first()
    except ValidationError as e:
        return JsonResponse({'error':str(e)})
    
    if not receiver:
        return JsonResponse({'error':'Recevier not found'})

    conversation = Conversation.objects.filter(
        participants=request.user
    ).filter(
        participants=receiver
    ).first()

    if not conversation:
        conversation = Conversation.objects.create()
        conversation.participants.add(receiver,request.user)
        user.conversations.append(str(conversation.id))
        receiver.conversations.append(str(conversation.id))
        user.save()
        receiver.save()

    message = Message.objects.create(
        sender=request.user,
        conv_id=conversation,
        receiver=receiver,
        message=body['message']
    )
    
    clean_data = MessageSerializer(message).data

    return JsonResponse({'message':clean_data})

def get_messages(request,user_id):
    if request.method != 'GET':
        return JsonResponse({'error':'Invalid method'})
    
    receiver = User.objects.filter(id=user_id).first()

    if not receiver:
        return JsonResponse({'error':'Recevier not found'})

    conversation = Conversation.objects.filter(participants=request.user).filter(participants=receiver).first()
    

    messages = Message.objects.filter(conv_id=conversation)

    clean_data = [MessageSerializer(msg).data for msg in messages]

    return JsonResponse({'messages':clean_data,'receiver':UserSerializer(receiver).data,'convId':str(conversation.id) if conversation else  None})


def delete_message(request,message_id):
    if request.method != 'DELETE':
        return JsonResponse({'error':'Invalid method'})

    message = Message.objects.filter(id=message_id).first()

    if not message:
        return JsonResponse({'error':'Incorrect message id'})

    if request.user not in message.conv_id.participants.all():
        return JsonResponse({'error':'No access to delete'})



    message.delete()
    

    return JsonResponse({'message':'Message deleted successfully'})


def delete_conversation(request,conv_id):
    if request.method != 'DELETE':
        return JsonResponse({'error':'Invalid method'})
    
    conversation = Conversation.objects.filter(id=conv_id).first()

    if not conversation:
        return JsonResponse({'error':'Conversation not found'})

    if request.user not in conversation.participants.all():
        return JsonResponse({'error':'No access to delete'})


    messages = Message.objects.filter(conv_id=conversation)

    if len(messages) > 0:
        messages.delete()

    conversation.delete()    
    

    return JsonResponse({'message':'Conversation deleted successfully'})



def get_conversations(request):
    if request.method != 'GET':
        return JsonResponse({'error':'Invalid method'})
    
    conversations = Conversation.objects.filter(id__in=request.user.conversations)
    
    clean_data = [ {
        'conversation':ConversationSerializer(c).data,
        'last_message':MessageSerializer(Message.objects.filter(conv_id=c).order_by('created_at').first()).data['message']
    } for c in conversations]

    return JsonResponse({'conversations':clean_data})

