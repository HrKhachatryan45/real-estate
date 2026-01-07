from real_estate.models import BaseModel
from django.db import models
from users.models import User
import uuid
from .utils import send_expiration_email

class Listing(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()

    price = models.DecimalField(max_digits=12, decimal_places=2)
    price_onsale = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    currency = models.CharField(
        max_length=3,
        default="USD",
        choices=(
            ("USD", "US Dollar"),
            ("EUR", "Euro"),
            ("AMD", "Armenian Dram"),
        )
    )

    class ListingType(models.TextChoices):
        RENT = "rent", "For Rent"
        SALE = "sale", "For Sale"

    listing_type = models.CharField(
        max_length=10,
        choices=ListingType.choices
    )

    class PropertyType(models.TextChoices):
        APARTMENT = "apartment", "Apartment"
        HOUSE = "house", "House"
        COMMERCIAL = "commercial", "Commercial"
        LAND = "land", "Land"
        VILLA = "villa", "Villa"
        OFFICE = "office", "Office Space"

    property_type = models.CharField(
        max_length=20,
        choices=PropertyType.choices
    )

    country = models.CharField(max_length=100, default="Armenia")
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=255)

    square_meters = models.PositiveIntegerField()
    land_area = models.PositiveIntegerField(null=True, blank=True)

    bedrooms = models.PositiveIntegerField(default=0)
    bathrooms = models.PositiveIntegerField(default=0)
    floor = models.PositiveIntegerField(null=True, blank=True)
    total_floors = models.PositiveIntegerField(null=True, blank=True)

    furnished = models.BooleanField(default=False)
    new_construction = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    balcony = models.BooleanField(default=False)
    elevator = models.BooleanField(default=False)
    heating_type = models.CharField(
        max_length=50,
        blank=True,
        choices=(
            ("gas", "Gas Heating"),
            ("electric", "Electric Heating"),
            ("central", "Central Heating"),
            ("none", "No Heating"),
        )
    )
    images = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")

    def __str__(self):
        return f"{self.title} — {self.city}, {self.price} {self.currency}"

    def check_and_expire(self):
        from django.utils import timezone
        if self.updated_at + timezone.timedelta(days=7) < timezone.now():
            self.is_active = False
            self.save()
            send_expiration_email(self.owner.email, self.title,self.owner)
            return True
        return False
    

    class Meta:
        db_table = 'real_estate_listings'    