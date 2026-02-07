"""
Core URL configuration.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, WalletViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'wallets', WalletViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
