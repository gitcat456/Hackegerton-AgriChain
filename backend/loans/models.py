"""
Loans models - Lending Pool, Loans, and Repayments.

PRODUCTION NOTES:
- Escrow logic simulates Stellar smart contracts
- Milestone-based release mimics multi-sig escrow
- In production, use Stellar's SEP-0030 for escrow accounts
"""

from django.db import models
from django.conf import settings
import uuid
from decimal import Decimal


class LendingPool(models.Model):
    """
    Platform-managed lending pool that funds farmer loans.
    In production, this would be backed by actual liquidity providers.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, default="AgriChain Main Pool")
    
    total_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    available_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    reserved_balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Interest rate configuration
    base_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=12.0)  # 12% base
    min_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=8.0)
    max_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=25.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name}: {self.available_balance} available"


class Loan(models.Model):
    """
    Farmer loan with escrow-based milestone release.
    
    PRODUCTION: Replace with Stellar escrow accounts
    - Each loan creates a dedicated escrow account
    - Milestone release requires multi-sig from platform + conditions met
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('active', 'Active (Disbursed)'),
        ('completed', 'Completed'),
        ('defaulted', 'Defaulted'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    borrower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='loans'
    )
    lending_pool = models.ForeignKey(
        LendingPool,
        on_delete=models.PROTECT,
        related_name='loans'
    )
    
    # Loan terms
    amount_requested = models.DecimalField(max_digits=15, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    term_months = models.IntegerField(default=6)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Credit assessment at time of application
    credit_score_at_application = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    assessment_used = models.ForeignKey(
        'crops.CropAssessment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='loans'
    )
    
    # Milestone-based disbursement
    # Default milestones: Approval (30%), Mid-Growth (40%), Pre-Harvest (30%)
    milestones = models.JSONField(default=list)
    current_milestone = models.IntegerField(default=0)
    
    # Escrow tracking
    escrow_wallet_address = models.CharField(max_length=56, blank=True)
    amount_disbursed = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    amount_repaid = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Admin notes
    admin_notes = models.TextField(blank=True)
    
    def save(self, *args, **kwargs):
        # Set default milestones if not specified
        if not self.milestones:
            self.milestones = [
                {"name": "Approval", "percentage": 30, "released": False, "released_at": None},
                {"name": "Mid-Growth Verification", "percentage": 40, "released": False, "released_at": None},
                {"name": "Pre-Harvest", "percentage": 30, "released": False, "released_at": None},
            ]
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Loan {self.id} - {self.borrower.full_name}: {self.amount_requested}"
    
    @property
    def total_due(self):
        """Total amount due including interest."""
        if self.amount_approved:
            interest = self.amount_approved * (self.interest_rate / 100)
            return self.amount_approved + interest
        return Decimal('0')
    
    @property
    def remaining_balance(self):
        """Outstanding balance."""
        return self.total_due - self.amount_repaid
    
    @property
    def next_milestone(self):
        """Get next unreleased milestone."""
        for i, milestone in enumerate(self.milestones):
            if not milestone.get('released'):
                return i, milestone
        return None, None
    
    class Meta:
        ordering = ['-applied_at']


class LoanRepayment(models.Model):
    """
    Individual loan repayment records.
    Can be triggered automatically from marketplace sales.
    """
    REPAYMENT_STATUS = [
        ('on_time', 'On Time'),
        ('late', 'Late'),
        ('partial', 'Partial'),
        ('auto_deducted', 'Auto-Deducted from Sale'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='repayments')
    
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=20, choices=REPAYMENT_STATUS, default='on_time')
    
    # Source of repayment
    source_order = models.ForeignKey(
        'marketplace.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='loan_repayments'
    )
    
    # Transaction reference
    transaction_hash = models.CharField(max_length=64, blank=True)
    
    paid_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Repayment {self.amount} for Loan {self.loan.id}"
    
    class Meta:
        ordering = ['-paid_at']
