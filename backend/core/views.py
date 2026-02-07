"""
Core views - Users and Wallets API.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Transaction
from .serializers import UserSerializer, UserCreateSerializer, TransactionSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for users.
    No authentication required for demo.
    """
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def farmers(self, request):
        """List all farmers."""
        farmers = User.objects.filter(is_farmer=True)
        serializer = UserSerializer(farmers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def buyers(self, request):
        """List all buyers."""
        buyers = User.objects.filter(is_buyer=True)
        serializer = UserSerializer(buyers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def admins(self, request):
        """List all admins."""
        admins = User.objects.filter(is_admin=True)
        serializer = UserSerializer(admins, many=True)
        return Response(serializer.data)
