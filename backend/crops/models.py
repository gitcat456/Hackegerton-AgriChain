"""
Crops models - Crop Images and AI Assessments.

PRODUCTION NOTES:
- AI assessment is mocked but designed for GPT-4 Vision or custom CV model integration
- Image storage could be migrated to cloud storage (S3, GCS)
"""

from django.db import models
from django.conf import settings
import uuid


class CropImage(models.Model):
    """
    Images uploaded by farmer for AI assessment.
    Multiple images can be uploaded per assessment cycle.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='crop_images')
    
    image = models.ImageField(upload_to='crop_images/%Y/%m/')
    description = models.CharField(max_length=200, blank=True)
    
    # Image metadata
    image_type = models.CharField(
        max_length=20,
        choices=[
            ('farm_overview', 'Farm Overview'),
            ('crop_closeup', 'Crop Close-up'),
            ('soil', 'Soil Condition'),
            ('irrigation', 'Irrigation System'),
            ('pest_issue', 'Pest/Disease Issue'),
            ('other', 'Other'),
        ],
        default='crop_closeup'
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image by {self.farmer.full_name} - {self.image_type}"
    
    class Meta:
        ordering = ['-uploaded_at']


class CropAssessment(models.Model):
    """
    AI-generated assessment of crop health and yield potential.
    
    PRODUCTION: Replace mock AI with:
    - GPT-4 Vision API for image analysis
    - Custom trained CV models for crop-specific assessment
    """
    YIELD_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    RISK_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessments')
    
    # AI-inferred data
    crop_type = models.CharField(max_length=100)
    health_score = models.DecimalField(max_digits=3, decimal_places=2)  # 0.00 to 1.00
    estimated_yield = models.CharField(max_length=10, choices=YIELD_CHOICES)
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES)
    
    # Detailed AI response
    recommendations = models.JSONField(default=list)
    raw_ai_response = models.JSONField(default=dict)
    
    # Confidence metrics
    confidence_score = models.DecimalField(max_digits=3, decimal_places=2, default=0.8)
    
    assessed_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Assessment: {self.crop_type} - {self.health_score} health"
    
    @property
    def health_percentage(self):
        return int(float(self.health_score) * 100)
    
    class Meta:
        ordering = ['-assessed_at']
