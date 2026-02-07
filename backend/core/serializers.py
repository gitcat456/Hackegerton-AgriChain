"""
Core serializers - Users and Wallets.
"""

from rest_framework import serializers
from .models import User, Transaction

from django.contrib.auth import get_user_model
from .models import User, Transaction

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    Includes wallet and farm details.
    """
    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'phone', 
            'is_farmer', 'is_buyer', 'is_admin',
            'farm_name', 'farm_location', 'farm_size_acres', 'main_crops',
            'wallet_address', 'wallet_balance', 'escrow_balance', 'available_balance',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'wallet_address', 'wallet_balance', 'escrow_balance']


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'phone', 'is_farmer', 'is_buyer', 'farm_name', 'farm_location', 'farm_size_acres', 'main_crops']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        
        # Initialize wallet with mock funds for demo
        if user.is_buyer:
            user.wallet_balance = 5000.00
            
        user.save()
        return user


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['stellar_tx_hash']
