from django.urls import path
from . import views

urlpatterns = [
    path('send/message/<str:user_id>',views.send_message),
    path('get/messages/<str:user_id>',views.get_messages),
    path('delete/message/<str:message_id>',views.delete_message),
    path('delete/conversation/<str:conv_id>',views.delete_conversation),
    path('get/conversations',views.get_conversations)
]
