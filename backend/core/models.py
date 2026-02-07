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
    Authentication is disabled for demo, but structure supports it.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    full_name = models.CharField(max_length=150)
    
    # Role flags - users can have multiple roles
    is_farmer = models.BooleanField(default=False)
    is_buyer = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    
    # Farmer-specific fields
    location = models.CharField(max_length=200, blank=True)
    farm_size_acres = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Django auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    def get_role_display(self):
        roles = []
        if self.is_farmer:
            roles.append('Farmer')
        if self.is_buyer:
            roles.append('Buyer')
        if self.is_admin:
            roles.append('Admin')
        return ', '.join(roles) if roles else 'No Role'


class Wallet(models.Model):
    """
    Simulated Stellar wallet for each user.
    
    PRODUCTION: Replace with Stellar SDK integration
    - public_key would be generated using stellar_sdk.Keypair.random()
    - Transactions would be submitted to Stellar network
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    
    # Simulated Stellar public key (in production: real Stellar address)
    public_key = models.CharField(max_length=56, unique=True, blank=True)
    
    # Balance in platform currency (simulating Stellar lumens or stablecoin)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Funds currently held in escrow
    escrow_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.public_key:
            # PRODUCTION: Use stellar_sdk.Keypair.random().public_key
            self.public_key = f"G{secrets.token_hex(27).upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Wallet of {self.user.full_name}: {self.balance}"
    
    @property
    def available_balance(self):
        """Balance minus escrowed funds."""
        return self.balance - self.escrow_balance


class Transaction(models.Model):
    """
    Transaction history for wallet operations.
    
    PRODUCTION: Would reference actual Stellar transaction hashes.
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
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    
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
            # PRODUCTION: This would be real Stellar tx hash
            self.stellar_tx_hash = secrets.token_hex(32)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.transaction_type}: {self.amount}"
    
    class Meta:
        ordering = ['-created_at']
