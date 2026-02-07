"""
Crops URL configuration.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmViewSet, CropImageViewSet, CropAssessmentViewSet

router = DefaultRouter()
router.register(r'farms', FarmViewSet)
router.register(r'images', CropImageViewSet)
router.register(r'assessments', CropAssessmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
