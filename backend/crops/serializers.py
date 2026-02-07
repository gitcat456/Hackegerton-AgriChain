"""
Crops serializers - Farms, Images, and Assessments.
"""

from rest_framework import serializers
from .models import CropImage, CropAssessment


class CropImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    
    class Meta:
        model = CropImage
        fields = ['id', 'farmer', 'farmer_name', 'image', 'description', 'image_type', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at', 'farmer']


class CropAssessmentSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    health_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = CropAssessment
        fields = [
            'id', 'farmer', 'farmer_name', 'crop_type', 'health_score', 
            'health_percentage', 'estimated_yield', 'risk_level', 
            'recommendations', 'confidence_score', 'assessed_at'
        ]
        read_only_fields = ['id', 'assessed_at', 'farmer']


class ImageUploadSerializer(serializers.Serializer):
    """Serializer for bulk image upload."""
    images = serializers.ListField(
        child=serializers.ImageField(),
        min_length=1,
        max_length=10
    )
    image_type = serializers.ChoiceField(
        choices=CropImage._meta.get_field('image_type').choices,
        default='crop_closeup'
    )
