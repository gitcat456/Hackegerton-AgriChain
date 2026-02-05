from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('buyer', 'Buyer'),
    )
    
    phone_number = models.CharField(max_length=15, unique=True, blank=False, null=False)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='vendor')
    profile_pic = models.ImageField(upload_to='vendor_profiles/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=20)
    
    def __str__(self):
        return self.username
    
    def is_farmer(self):
        return self.role=='Farmer'
    
    def is_buyer(self):
        return self.role=='Buyer'
    
    