"""
Loans URL configuration.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LendingPoolViewSet, LoanViewSet, CreditScoreViewSet

router = DefaultRouter()
router.register(r'pools', LendingPoolViewSet)
router.register(r'loans', LoanViewSet)
router.register(r'credit-score', CreditScoreViewSet, basename='credit-score')

urlpatterns = [
    path('', include(router.urls)),
]
