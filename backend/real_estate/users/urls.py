from django.urls import path
from . import views 

urlpatterns = [
    path('csrf/init',views.csrf_init,name='csrf'),
    path('register',views.register,name='register'),
    path('login',views.login,name='login'),
    path('logout',views.logout,name='logout'),
    path('edit/profile',views.edit_profile,name='edit_profile'),
    path('change/password',views.change_password,name='change_password'),
    path('refresh/accessToken',views.refresh_access_token,name='refresh_access_token'),
    path('forgot/password',views.forgot_password,name='forgot_password'),
    path('reset/password',views.reset_password,name='reset_password'),
]
