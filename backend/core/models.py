"""
Core models - Users and Wallets for AgriChain.

PRODUCTION NOTES:
- Wallet model simulates Stellar blockchain wallets
- In production, public_key would be a real Stellar address
- Balance operations would use Stellar SDK
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import uuid
import secrets


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model with role flags for Farmer, Buyer, and Admin.
    Also includes Wallet and Farm details for simplified hackathon schema.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    full_name = models.CharField(max_length=150)
    
    # Role flags
    is_farmer = models.BooleanField(default=False)
    is_buyer = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    
    # Farmer Profile Fields (Merged from Farm model)
    farm_name = models.CharField(max_length=200, blank=True)
    farm_location = models.CharField(max_length=200, blank=True)
    farm_size_acres = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    main_crops = models.CharField(max_length=200, blank=True, help_text="Comma-separated list of main crops")
    
    # Wallet Fields (Merged from Wallet model)
    wallet_address = models.CharField(max_length=56, blank=True, help_text="Stellar Public Key")
    wallet_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    escrow_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Generic Location
    location = models.CharField(max_length=200, blank=True, null=True, default='')
    
    # Django auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    def save(self, *args, **kwargs):
        if not self.wallet_address:
            # PRODUCTION: Use stellar_sdk.Keypair.random().public_key
            self.wallet_address = f"G{secrets.token_hex(27).upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        role = "User"
        if self.is_farmer: role = "Farmer"
        elif self.is_buyer: role = "Buyer"
        return f"{self.full_name} ({role}) - {self.email}"
    
    @property
    def available_balance(self):
        """Balance minus escrowed funds."""
        return self.wallet_balance - self.escrow_balance


class Transaction(models.Model):
    """
    Transaction history for user wallet operations.
    """
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('escrow_lock', 'Escrow Lock'),
        ('escrow_release', 'Escrow Release'),
        ('loan_disbursement', 'Loan Disbursement'),
        ('loan_repayment', 'Loan Repayment'),
        ('sale_payment', 'Sale Payment'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Reference to related entity (order, loan, etc.)
    reference_type = models.CharField(max_length=50, blank=True)
    reference_id = models.UUIDField(null=True, blank=True)
    
    # Simulated Stellar transaction hash
    stellar_tx_hash = models.CharField(max_length=64, blank=True)
    
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.stellar_tx_hash:
            self.stellar_tx_hash = secrets.token_hex(32)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.transaction_type}: {self.amount} ({self.user.full_name})"
    
    class Meta:
        ordering = ['-created_at']
