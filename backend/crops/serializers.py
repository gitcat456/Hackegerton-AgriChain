"""
Crops serializers - Farms, Images, and Assessments.
"""

from rest_framework import serializers
from .models import Farm, CropImage, CropAssessment


class CropImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CropImage
        fields = ['id', 'image', 'image_url', 'description', 'image_type', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CropAssessmentSerializer(serializers.ModelSerializer):
    health_percentage = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = CropAssessment
        fields = ['id', 'farm', 'crop_type', 'health_score', 'health_percentage',
                  'estimated_yield', 'risk_level', 'recommendations', 
                  'confidence_score', 'assessed_at']
        read_only_fields = ['id', 'assessed_at']


class FarmSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.full_name', read_only=True)
    latest_assessment = CropAssessmentSerializer(read_only=True)
    images = CropImageSerializer(many=True, read_only=True)
    image_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Farm
        fields = ['id', 'owner', 'owner_name', 'name', 'location', 'size_acres',
                  'description', 'current_crop', 'planting_date', 'expected_harvest_date',
                  'latest_assessment', 'images', 'image_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_image_count(self, obj):
        return obj.images.count()


class FarmCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating farms."""
    
    class Meta:
        model = Farm
        fields = ['owner', 'name', 'location', 'size_acres', 'description',
                  'current_crop', 'planting_date', 'expected_harvest_date']


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
