"""
Core views - Users and Wallets API.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Wallet, Transaction
from .serializers import UserSerializer, UserCreateSerializer, WalletSerializer, TransactionSerializer


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


class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for wallets (read-only).
    Balance modifications happen through other actions.
    """
    queryset = Wallet.objects.all()
    serializer_class = WalletSerializer
    
    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        """Get transaction history for wallet."""
        wallet = self.get_object()
        transactions = wallet.transactions.all()[:50]
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def deposit(self, request, pk=None):
        """
        Deposit funds into wallet (for demo).
        PRODUCTION: Would handle actual fiat-to-crypto conversion.
        """
        wallet = self.get_object()
        amount = request.data.get('amount', 0)
        
        try:
            amount = float(amount)
            if amount <= 0:
                return Response({'error': 'Amount must be positive'}, status=400)
        except (ValueError, TypeError):
            return Response({'error': 'Invalid amount'}, status=400)
        
        wallet.balance += amount
        wallet.save()
        
        # Record transaction
        Transaction.objects.create(
            wallet=wallet,
            transaction_type='deposit',
            amount=amount,
            description=f'Demo deposit of {amount}'
        )
        
        return Response({'balance': wallet.balance, 'message': f'Deposited {amount}'})
