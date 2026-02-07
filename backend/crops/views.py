"""
Crops views - Images and AI Assessment API.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import CropImage, CropAssessment
from .serializers import CropImageSerializer, CropAssessmentSerializer
import random

class CropImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Crop Images.
    """
    queryset = CropImage.objects.all()
    serializer_class = CropImageSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return CropImage.objects.all()
        return CropImage.objects.filter(farmer=user)


class CropAssessmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for AI Assessments.
    """
    queryset = CropAssessment.objects.all()
    serializer_class = CropAssessmentSerializer
    
    def perform_create(self, serializer):
        serializer.save(farmer=self.request.user)
        
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return CropAssessment.objects.all()
        return CropAssessment.objects.filter(farmer=user)

    @action(detail=False, methods=['post'])
    def sim_assess(self, request):
        """
        Simulate AI assessment for the current farmer.
        """
        user = request.user
        # Mock logic: standard high score for demo
        assessment = CropAssessment.objects.create(
            farmer=user,
            crop_type="Maize",
            health_score=0.95,
            estimated_yield="High",
            risk_level="Low",
            recommendations=["Apply nitrogen fertilizer", "Monitor moisture"],
            confidence_score=0.98,
            raw_ai_response={"simulated": True}
        )
        return Response(CropAssessmentSerializer(assessment).data)
