from django.http import JsonResponse
from users.serializers.user_serializer import UserSerializer
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
from .serializers.listing_serializer import ListingSerializer
import json
from .models import Listing
from users.models import User
from cloudinary.uploader import upload_large
import cloudinary.uploader

@csrf_exempt
def create_listing(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    user = request.user

    data = {}

    required = ['title','description','price','listing_type','property_type','city','address','square_meters','bedrooms','bathrooms']
    for field in required:
        if not request.POST.get(field):
            return JsonResponse({'error': f'Missing field: {field}'}, status=400)
        data[field] = request.POST.get(field)

    try:
        data['price'] = Decimal(request.POST['price'])
        if data['price'] <= 0:
            return JsonResponse({'error': 'Price must be > 0'}, status=400)
    except Exception:
        return JsonResponse({'error': 'Invalid price'}, status=400)

    if request.POST.get('price_onsale'):
        try:
            data['price_onsale'] = Decimal(request.POST['price_onsale'])
            if data['price_onsale'] >= data['price']:
                return JsonResponse({'error': 'Sale price must be lower'}, status=400)
        except Exception:
            return JsonResponse({'error': 'Invalid sale price'}, status=400)

    for field in ['square_meters', 'bedrooms', 'bathrooms']:
        try:
            data[field] = int(data[field])
        except ValueError:
            return JsonResponse({'error': f'Invalid {field}'}, status=400)

    if data['listing_type'] not in ['rent', 'sale']:
        return JsonResponse({'error': 'Invalid listing_type'}, status=400)
    if data['property_type'] not in ['apartment','house','commercial','land','villa','office']:
        return JsonResponse({'error': 'Invalid property_type'}, status=400)

    files = request.FILES.getlist('images')
    if not files:
        return JsonResponse({'error': 'At least one image is required'}, status=400)

    uploaded = []
    for f in files:
        res = upload_large(f, resource_type='auto')
        uploaded.append({'id': res['public_id'], 'url': res['secure_url']})

    data['images'] = uploaded

    listing = Listing.objects.create(owner=user, **data)

    return JsonResponse({'message': 'Listing successfully created', 'id': str(listing.id)}, status=201)

def edit_listing(request,id):
    user = request.user
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    listing_id = id

    data = request.POST
    
    if not Listing.objects.filter(id=listing_id).exists():
        return JsonResponse({'error':'Listing not found'})

    listing = Listing.objects.filter(id=listing_id).first()

    if listing.owner != user:
        return JsonResponse({'error': 'Not authorized'}, status=403)

    allowed_fields = [
        "title", "description", "price", "price_onsale", "listing_type",
        "property_type", "city", "address", "square_meters", "land_area",
        "bedrooms", "bathrooms", "floor", "total_floors", "furnished",
        "new_construction", "parking", "balcony", "elevator", "heating_type",
        "main_image", "images", "is_active", "is_featured"
    ]
    
    clean_data = {k: v for k, v in data.items() if k in allowed_fields}

    files = request.FILES.getlist('images')
    rest_images = listing.images

    
    images_to_keep = data.get('images_to_keep', [])


    for img in listing.images:
        if img["id"] not in images_to_keep:
            cloudinary.uploader.destroy(img["id"])

    new_arr = [img for img in rest_images if img['id']  in images_to_keep]
    rest_images = new_arr

    if len(files) > 0:
        for f in files:
            uploaded = upload_large(f, resource_type='auto')
            rest_images.append({'id':uploaded['public_id'],'url':uploaded['secure_url']})
    
    clean_data['images'] = rest_images


    if "price" in clean_data:
        clean_data['price'] = Decimal(clean_data['price'])
    if "price_onsale" in clean_data:
        clean_data['price_onsale'] = Decimal(clean_data['price_onsale'])    
    if "price" in clean_data and float(clean_data["price"]) <= 0:
        return JsonResponse({'error': 'Price must be > 0'}, status=400)
    if "price_onsale" in clean_data and float(clean_data["price_onsale"]) >= float(clean_data.get("price", listing.price)):
        return JsonResponse({'error': 'Sale price must be lower than price'}, status=400)

    Listing.objects.filter(id=id, owner=user).update(**clean_data)


    return JsonResponse({'message':'Listing updated'})

def delete_listing(request,id):
    user = request.user
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    listing_id = id


    if not Listing.objects.filter(id=listing_id).exists():
        return JsonResponse({'error':'Listing not found'})

    listing = Listing.objects.filter(id=listing_id).first()

    if listing.owner != user:
        return JsonResponse({'error': 'Not authorized'}, status=403)

    if len(listing.images) > 0 :
        for f in listing.images:
            cloudinary.uploader.destroy(f['id'])   
    
    listing.delete()

    return JsonResponse({'message':'Listing deleted'})

def get_listing(request,id):
    if request.method != 'GET':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    listing_id = id

    user = request.user

    if not Listing.objects.filter(id=listing_id).exists():
        return JsonResponse({'error':'Listing not found'})


    listing = Listing.objects.filter(id=listing_id).select_related('owner').first()

    viewed_key = f'viewed_listing_{id}'    

    if not request.session.get(viewed_key):
        listing.views += 1
        listing.save(update_fields=['views'])
        new_recent = user.recent_listings or []
        if listing_id in new_recent:
            new_recent.remove(listing_id)
        new_recent.append(listing_id)
        user.recent_listings = new_recent
        user.save(update_fields=['recent_listings'])
        request.session[viewed_key] = True

    safe_listing = ListingSerializer(listing).data

    return JsonResponse({'listing':safe_listing})




def get_listings(request):
    if request.method == "GET":
        page = int(request.GET.get('page',1))
        limit = int(request.GET.get('limit',10))
        property_type = str(request.GET.get('type','all')).lower()
        start = (page - 1) * limit
        end = start + limit
        
        listings = Listing.objects.all()

        if property_type != 'all':
            listings = Listing.objects.filter(property_type=property_type).all()
    
        

        sliced_listings = listings[start:end]

        safe_listings = [ListingSerializer(obj).data for obj in sliced_listings]

        return JsonResponse({'listings':safe_listings})

    else:   
        return JsonResponse({'error':'Invalid method'})    


def get_featured_ones(request):
    if request.method == "GET":
        page = int(request.GET.get('page',1))
        limit = int(request.GET.get('limit',10))

        start = (page - 1) * limit
        end = start + limit
    
        listings = Listing.objects.filter(is_featured=True).all()

        sliced_listings = listings[start:end]

        safe_listings = [ListingSerializer(obj).data for obj in sliced_listings]

        return JsonResponse({'listings':safe_listings})

    else:   
        return JsonResponse({'error':'Invalid method'})    



def get_advanced_listings(request):
    if request.method == "POST":
        try:
            filters = json.loads(request.body)
        except:
            filters = {}

        page = int(request.GET.get('page',1)) 
        limit = int(request.GET.get('limit',10)) 
        search_query = str(request.GET.get('searchQuery','')) 
        listings = Listing.objects.all() 

        if search_query: 
            listings = listings.filter(title__icontains=search_query)


        if 'city' in filters:
            listings = listings.filter(city__icontains=filters['city'])
        if 'country' in filters:
            listings = listings.filter(country__iexact=filters['country'])

        if 'min_price' in filters:
            listings = listings.filter(price__gte=filters['min_price'])
        if 'max_price' in filters:
            listings = listings.filter(price__lte=filters['max_price'])

        if 'min_square_meters' in filters:
            listings = listings.filter(square_meters__gte=filters['min_square_meters'])
        if 'max_square_meters' in filters:
            listings = listings.filter(square_meters__lte=filters['max_square_meters'])

        if 'max_total_rooms' in filters:
            listings = listings.annotate(
                total_rooms=ExpressionWrapper(F('bedrooms') + F('bathrooms'), output_field=IntegerField())
            ).filter(total_rooms__lte=filters['max_total_rooms'])
        
        boolean_fields = ['furnished', 'new_construction', 'parking', 'balcony', 'elevator', 'is_featured', 'is_active']
        for field in boolean_fields:
            if field in filters:
                listings = listings.filter(**{field: filters[field]})

        choice_fields = ['listing_type', 'property_type', 'heating_type', 'currency']
        for field in choice_fields:
            if field in filters:
                listings = listings.filter(**{field: filters[field]})

        start = (page - 1) * limit
        end = start + limit  
        sliced_listings = listings[start:end]

        serialized_listings = [ListingSerializer(obj).data for obj in sliced_listings]

        return JsonResponse({
            'listings': serialized_listings,
            'total': listings.count(),
            'page': page,
            'limit': limit
        })
    else:
        return JsonResponse({'error': 'Invalid method, use POST'})

def toggle_favourite_listing(request, listing_id):
    user = request.user
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    if not Listing.objects.filter(id=listing_id).exists():
        return JsonResponse({'error':'Listing not found'}, status=404)

    favourite_listings = user.favourite_listings

    if listing_id in favourite_listings:
        favourite_listings.remove(listing_id)
        action = 'removed'
    else:
        favourite_listings.append(listing_id)
        action = 'added'

    user.favourite_listings = favourite_listings
    user.save(update_fields=['favourite_listings'])


    return JsonResponse({'user':UserSerializer(user).data})


def get_my_listings(request):
    if request.method == "GET":
        user = request.user
        page = int(request.GET.get('page',1))
        limit = int(request.GET.get('limit',10))
        start = (page - 1) * limit
        end = start + limit
        
        listings = user.listings.all().order_by('-created_at')

        sliced_listings = listings[start:end]

        safe_listings = [ListingSerializer(obj).data for obj in sliced_listings]

        return JsonResponse({'listings':safe_listings})
    else:   
        return JsonResponse({'error':'Invalid method'})    


def get_fav_or_recent_listings(request):
    if request.method == "GET":
        page = int(request.GET.get('page',1)) 
        limit = int(request.GET.get('limit',10)) 
        type = request.GET.get('type','favourite')

        if type == 'recent':
            listings = Listing.objects.filter(id__in=request.user.recent_listings).all()
        else:
            listings = Listing.objects.filter(id__in=request.user.favourite_listings).all()

        start = (page - 1) * limit
        end = start + limit  
        sliced_listings = listings[start:end]

        serialized_listings = [ListingSerializer(obj).data for obj in sliced_listings]

        return JsonResponse({'listings':serialized_listings})
    else:   
        return JsonResponse({'error':'Invalid method'})    

