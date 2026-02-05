from django.urls import path
from .views import BuyerSignupView, FarmerSignupView, LogoutRedirectView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Signup endpoints
    path('buyer/', BuyerSignupView.as_view(), name='buyer-signup'),
    path('farmer/', FarmerSignupView.as_view(), name='farmer-signup'),

    # JWT Authentication
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('logout/', LogoutRedirectView.as_view(), name='logout-redirect'),
]
