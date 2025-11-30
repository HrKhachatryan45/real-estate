from django.urls import path
from . import views 

urlpatterns = [
    path('create',views.create_listing,name='create_listing'),
    path('edit/<str:id>',views.edit_listing,name='edit_listing'),
    path('delete/<str:id>',views.delete_listing,name='delete_listing'),
    path('get/filter',views.get_advanced_listings,name='get_advanced_listings'),
    path('get/listings',views.get_listings,name='get_listings'),
    path('get/featured',views.get_featured_ones,name='get_featured_ones'),
    path('get/fav/recent',views.get_fav_or_recent_listings,name='get_favourite_listings'),
    path('get/mylistings',views.get_my_listings,name='get_my_listings'),
    path('get/<str:id>',views.get_listing,name='get_listing'),
    path('toggle/favourite/<str:listing_id>',views.toggle_favourite_listing,name='toggle_favourite_listing'),
]
