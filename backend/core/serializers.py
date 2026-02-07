"""
Core serializers - Users and Wallets.
"""

from rest_framework import serializers
from .models import User, Wallet, Transaction


class WalletSerializer(serializers.ModelSerializer):
    available_balance = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    
    class Meta:
        model = Wallet
        fields = ['id', 'public_key', 'balance', 'escrow_balance', 'available_balance', 'created_at']
        read_only_fields = ['id', 'public_key', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'amount', 'reference_type', 'reference_id', 
                  'stellar_tx_hash', 'description', 'created_at']
        read_only_fields = ['id', 'stellar_tx_hash', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    wallet = WalletSerializer(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'full_name', 'is_farmer', 'is_buyer', 'is_admin',
                  'location', 'farm_size_acres', 'wallet', 'role_display', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating users with auto wallet creation."""
    
    class Meta:
        model = User
        fields = ['email', 'phone', 'full_name', 'is_farmer', 'is_buyer', 'is_admin',
                  'location', 'farm_size_acres']
    
    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        # Create wallet for user
        Wallet.objects.create(user=user, balance=1000)  # Demo: start with 1000 tokens
        return user
