"""
AgriChain URL Configuration.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    """API root with navigation links."""
    return Response({
        'message': 'Welcome to AgriChain API',
        'version': '1.0.0',
        'description': 'Agriculture + AI + Blockchain Marketplace',
        'endpoints': {
            'users': '/api/users/',
            'wallets': '/api/wallets/',
            'farms': '/api/crops/farms/',
            'assessments': '/api/crops/assessments/',
            'loans': '/api/loans/loans/',
            'lending_pools': '/api/loans/pools/',
            'credit_score': '/api/loans/credit-score/',
            'listings': '/api/marketplace/listings/',
            'orders': '/api/marketplace/orders/',
            'cart': '/api/marketplace/cart/',
        },
        'documentation': 'Use browsable API by visiting endpoints in browser'
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include('core.urls')),
    path('api/crops/', include('crops.urls')),
    path('api/loans/', include('loans.urls')),
    path('api/marketplace/', include('marketplace.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
