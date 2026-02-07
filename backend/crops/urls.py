"""
Crops URL configuration.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropImageViewSet, CropAssessmentViewSet

router = DefaultRouter()
router.register(r'images', CropImageViewSet)
router.register(r'assessments', CropAssessmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
