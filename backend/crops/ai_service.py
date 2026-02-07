"""
Mock AI Service for Crop Assessment.

PRODUCTION REPLACEMENT OPTIONS:
1. GPT-4 Vision API:
   - Send images to OpenAI's vision model
   - Parse structured JSON from response
   
2. Custom CV Model:
   - Train crop-specific models using TensorFlow/PyTorch
   - Deploy as separate microservice
   
3. Third-party Agriculture AI:
   - Plantix, Agrosmart, or similar APIs
   - Satellite imagery integration (Planet, Sentinel)

This mock simulates realistic responses for demo purposes.
"""

import random
from typing import Dict, List, Any


CROP_TYPES = ['maize', 'beans', 'wheat', 'rice', 'tomatoes', 'potatoes', 'coffee', 'tea']

RECOMMENDATIONS = {
    'maize': [
        'Ensure adequate spacing between plants',
        'Monitor for stem borers',
        'Apply nitrogen fertilizer at knee-high stage',
    ],
    'beans': [
        'Avoid overhead irrigation to prevent leaf diseases',
        'Inoculate seeds with rhizobium for nitrogen fixation',
        'Harvest when pods are dry',
    ],
    'wheat': [
        'Control weeds early in growing season',
        'Watch for rust diseases',
        'Apply potassium for grain fill',
    ],
    'rice': [
        'Maintain water level at 5-10cm during tillering',
        'Apply basal fertilizer before transplanting',
        'Monitor for rice blast disease',
    ],
    'tomatoes': [
        'Stake or cage plants for support',
        'Water consistently to prevent blossom end rot',
        'Remove suckers for larger fruits',
    ],
    'potatoes': [
        'Hill soil around plants as they grow',
        'Monitor for late blight',
        'Cure tubers before storage',
    ],
    'coffee': [
        'Prune to maintain optimal canopy',
        'Monitor for coffee berry borer',
        'Mulch to retain moisture',
    ],
    'tea': [
        'Maintain pruning cycle for quality',
        'Ensure proper shade management',
        'Monitor for red spider mites',
    ],
}


def assess_crops(image_paths: List[str], farm_size: float = 1.0) -> Dict[str, Any]:
    """
    Mock AI assessment of crop images.
    
    PRODUCTION: Replace this function with actual AI API call:
    
    ```python
    import openai
    
    def assess_crops_production(image_paths):
        # Encode images to base64
        images = [encode_image(path) for path in image_paths]
        
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": ASSESSMENT_PROMPT},
                    *[{"type": "image_url", "image_url": img} for img in images]
                ]
            }],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    ```
    
    Args:
        image_paths: List of paths to uploaded crop images
        farm_size: Size of farm in acres (affects yield estimate)
    
    Returns:
        Structured assessment JSON
    """
    # Simulate analysis based on image count and randomness
    num_images = len(image_paths) if image_paths else 1
    
    # More images = higher confidence
    base_confidence = min(0.6 + (num_images * 0.1), 0.95)
    
    # Simulate crop type detection
    crop_type = random.choice(CROP_TYPES)
    
    # Generate health score with some randomness
    # Higher farm size slightly increases health (better resources)
    base_health = random.uniform(0.5, 0.95)
    farm_bonus = min(farm_size * 0.02, 0.1)
    health_score = min(base_health + farm_bonus, 1.0)
    
    # Determine yield estimate based on health
    if health_score >= 0.8:
        estimated_yield = 'high'
    elif health_score >= 0.5:
        estimated_yield = 'medium'
    else:
        estimated_yield = 'low'
    
    # Determine risk level (inverse of health)
    if health_score >= 0.7:
        risk_level = 'low'
    elif health_score >= 0.4:
        risk_level = 'medium'
    else:
        risk_level = 'high'
    
    # Get crop-specific recommendations
    recommendations = RECOMMENDATIONS.get(crop_type, [
        'Maintain regular irrigation schedule',
        'Monitor for pests and diseases',
        'Apply appropriate fertilizers',
    ])
    
    # Select 2-3 recommendations based on health
    num_recommendations = 2 if health_score > 0.7 else 3
    selected_recommendations = random.sample(recommendations, min(num_recommendations, len(recommendations)))
    
    # Add health-based recommendations
    if health_score < 0.6:
        selected_recommendations.append('Consider soil testing for nutrient deficiencies')
    if risk_level == 'high':
        selected_recommendations.append('Implement immediate pest/disease management')
    
    return {
        'crop_type': crop_type,
        'health_score': round(health_score, 2),
        'estimated_yield': estimated_yield,
        'risk_level': risk_level,
        'confidence_score': round(base_confidence, 2),
        'recommendations': selected_recommendations,
        'analysis_details': {
            'images_analyzed': num_images,
            'farm_size_factor': round(farm_bonus, 2),
            'assessment_method': 'mock_ai_v1',
            # PRODUCTION: Include actual AI model version and metadata
            'production_note': 'Replace with GPT-4 Vision or custom CV model',
        }
    }


def validate_assessment_response(response: Dict) -> bool:
    """
    Validate that AI response has required fields.
    """
    required_fields = ['crop_type', 'health_score', 'estimated_yield', 'risk_level']
    return all(field in response for field in required_fields)
