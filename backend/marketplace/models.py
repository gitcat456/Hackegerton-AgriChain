"""
Marketplace models - Listings and Orders with Escrow.

PRODUCTION NOTES:
- Order escrow simulates Stellar payment channels
- State machine ensures fair trade between farmer and buyer
- Auto-deduction from sales supports loan repayment
"""

from django.db import models
from django.conf import settings
import uuid


class Listing(models.Model):
    """
    Farmer produce listing for marketplace.
    Includes AI assessment summary for buyer transparency.
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('sold', 'Sold Out'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )
    
    # Product details
    title = models.CharField(max_length=200)
    description = models.TextField()
    crop_type = models.CharField(max_length=100)
    
    # Quantity and pricing
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Harvest timeline
    expected_harvest_date = models.DateField()
    delivery_available = models.BooleanField(default=True)
    delivery_radius_km = models.IntegerField(default=50)
    
    # AI assessment summary (linked from latest assessment)
    assessment = models.ForeignKey(
        'crops.CropAssessment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='listings'
    )
    
    # Listing metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    featured = models.BooleanField(default=False)
    
    # Cover image (first crop image or dedicated listing image)
    cover_image = models.ImageField(upload_to='listing_covers/%Y/%m/', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} by {self.farmer.full_name}"
    
    @property
    def total_value(self):
        return self.quantity_available * self.price_per_kg
    
    @property
    def health_badge(self):
        """Return health assessment for display."""
        if self.assessment:
            score = float(self.assessment.health_score)
            if score >= 0.8:
                return {'label': 'Excellent', 'color': 'success'}
            elif score >= 0.6:
                return {'label': 'Good', 'color': 'info'}
            elif score >= 0.4:
                return {'label': 'Fair', 'color': 'warning'}
            else:
                return {'label': 'Poor', 'color': 'error'}
        return None
    
    class Meta:
        ordering = ['-created_at']


class Order(models.Model):
    """
    Buyer order with escrow payment flow.
    
    State Machine:
    1. pending_payment - Order created, awaiting payment
    2. escrow_held - Payment received, held in escrow
    3. dispatched - Farmer marked as shipped
    4. received - Buyer confirmed receipt
    5. completed - Funds released to farmer
    6. disputed - Issue raised, needs resolution
    7. refunded - Order cancelled, funds returned
    
    PRODUCTION: Replace with Stellar escrow transactions
    - Payment creates escrow account
    - Release requires buyer confirmation or timeout
    - Disputes handled via multi-sig arbitration
    """
    STATUS_CHOICES = [
        ('pending_payment', 'Pending Payment'),
        ('escrow_held', 'Payment in Escrow'),
        ('dispatched', 'Dispatched'),
        ('received', 'Received'),
        ('completed', 'Completed'),
        ('disputed', 'Disputed'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey(Listing, on_delete=models.PROTECT, related_name='orders')
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    
    # Order details
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_payment')
    
    # Escrow details
    escrow_wallet_address = models.CharField(max_length=56, blank=True)
    escrow_transaction_hash = models.CharField(max_length=64, blank=True)
    
    # Delivery info
    delivery_address = models.TextField(blank=True)
    delivery_notes = models.TextField(blank=True)
    
    # Timestamps for state transitions
    created_at = models.DateTimeField(auto_now_add=True)
    payment_at = models.DateTimeField(null=True, blank=True)
    dispatched_at = models.DateTimeField(null=True, blank=True)
    received_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Loan repayment tracking
    loan_deduction_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    def __str__(self):
        return f"Order {self.id} - {self.listing.title}"
    
    @property
    def farmer(self):
        return self.listing.farmer
    
    @property
    def farmer_receives(self):
        """Amount farmer will receive after loan deduction."""
        return self.total_price - self.loan_deduction_amount
    
    class Meta:
        ordering = ['-created_at']


class CartItem(models.Model):
    """
    Shopping cart item for buyers.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='cart_items')
    
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    
    added_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Cart: {self.quantity_kg}kg of {self.listing.title}"
    
    @property
    def subtotal(self):
        return self.quantity_kg * self.listing.price_per_kg
    
    class Meta:
        unique_together = ['buyer', 'listing']
