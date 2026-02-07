"""
Crops views - Farms, Images, and AI Assessment API.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Farm, CropImage, CropAssessment
from .serializers import (
    FarmSerializer, FarmCreateSerializer, CropImageSerializer,
    CropAssessmentSerializer, ImageUploadSerializer
)
from .ai_service import assess_crops


class FarmViewSet(viewsets.ModelViewSet):
    """
    API endpoint for farms.
    Supports image upload and AI assessment.
    """
    queryset = Farm.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return FarmCreateSerializer
        return FarmSerializer
    
    def get_queryset(self):
        queryset = Farm.objects.all()
        owner_id = self.request.query_params.get('owner')
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
        return queryset
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_images(self, request, pk=None):
        """
        Upload multiple images for a farm.
        Images are used for AI assessment.
        """
        farm = self.get_object()
        
        images = request.FILES.getlist('images')
        image_type = request.data.get('image_type', 'crop_closeup')
        
        if not images:
            return Response({'error': 'No images provided'}, status=400)
        
        created_images = []
        for image in images:
            crop_image = CropImage.objects.create(
                farm=farm,
                image=image,
                image_type=image_type
            )
            created_images.append(crop_image)
        
        serializer = CropImageSerializer(created_images, many=True, context={'request': request})
        return Response({
            'message': f'Uploaded {len(created_images)} images',
            'images': serializer.data
        }, status=201)
    
    @action(detail=True, methods=['post'])
    def assess(self, request, pk=None):
        """
        Trigger AI assessment for farm based on uploaded images.
        
        PRODUCTION: This would call actual AI service (GPT-4 Vision, custom model).
        """
        farm = self.get_object()
        
        # Get image paths for AI analysis
        images = farm.images.all()
        if not images.exists():
            return Response({
                'error': 'No images available for assessment. Upload images first.'
            }, status=400)
        
        image_paths = [img.image.path for img in images]
        
        # Call mock AI service
        ai_result = assess_crops(image_paths, float(farm.size_acres))
        
        # Create assessment record
        assessment = CropAssessment.objects.create(
            farm=farm,
            crop_type=ai_result['crop_type'],
            health_score=ai_result['health_score'],
            estimated_yield=ai_result['estimated_yield'],
            risk_level=ai_result['risk_level'],
            recommendations=ai_result['recommendations'],
            confidence_score=ai_result['confidence_score'],
            raw_ai_response=ai_result
        )
        
        # Update farm's current crop
        farm.current_crop = ai_result['crop_type']
        farm.save()
        
        serializer = CropAssessmentSerializer(assessment)
        return Response({
            'message': 'AI assessment completed',
            'assessment': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def assessments(self, request, pk=None):
        """Get all assessments for a farm."""
        farm = self.get_object()
        assessments = farm.assessments.all()
        serializer = CropAssessmentSerializer(assessments, many=True)
        return Response(serializer.data)


class CropImageViewSet(viewsets.ModelViewSet):
    """API endpoint for crop images."""
    queryset = CropImage.objects.all()
    serializer_class = CropImageSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        queryset = CropImage.objects.all()
        farm_id = self.request.query_params.get('farm')
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset


class CropAssessmentViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for crop assessments (read-only)."""
    queryset = CropAssessment.objects.all()
    serializer_class = CropAssessmentSerializer
    
    def get_queryset(self):
        queryset = CropAssessment.objects.all()
        farm_id = self.request.query_params.get('farm')
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)
        return queryset
