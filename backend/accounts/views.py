from rest_framework import generics
from .serializers import UserSignupSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class BuyerSignupView(generics.CreateAPIView):
    serializer_class = UserSignupSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['role'] = 'buyer'
        return context

class FarmerSignupView(generics.CreateAPIView):
    serializer_class = UserSignupSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['role'] = 'farmer'
        return context

class LogoutRedirectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Just return where to redirect after logout based on user role.
        The frontend should delete tokens locally.
        """
        user = request.user
        if user.role == 'farmer':
            redirect_url = '/login/'  
        else:  # buyer
            redirect_url = '/'  # or marketplace/home page

        return Response({'redirect_url': redirect_url})
