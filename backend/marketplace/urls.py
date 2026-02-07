"""
Marketplace URL configuration.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ListingViewSet, OrderViewSet, CartViewSet

router = DefaultRouter()
router.register(r'listings', ListingViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'cart', CartViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
