"""
Loans models - Loans and Repayments.

PRODUCTION NOTES:
- Escrow logic simulates Stellar smart contracts
- Single-escrow flow for hackathon simplicity
"""

from django.db import models
from django.conf import settings
import uuid
from decimal import Decimal


class Loan(models.Model):
    """
    Simulated Farmer Loan.
    
    State Machine:
    REQUESTED -> APPROVED -> RELEASED -> REPAID
    """
    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('approved', 'Approved'),
        ('released', 'Released (Active)'),
        ('repaid', 'Repaid'),
        ('defaulted', 'Defaulted'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    borrower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='loans'
    )
    
    # Loan terms
    amount_requested = models.DecimalField(max_digits=15, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=12.0)
    term_months = models.IntegerField(default=6)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    
    # Credit assessment at time of application
    credit_score_at_application = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    assessment_used = models.ForeignKey(
        'crops.CropAssessment',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='loans'
    )
    
    # Escrow tracking
    escrow_wallet_address = models.CharField(max_length=56, blank=True)
    amount_disbursed = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    amount_repaid = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    
    # Milestone Tracking
    milestones = models.JSONField(default=list)
    current_milestone = models.IntegerField(default=0)
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Admin notes
    admin_notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Loan {self.id} - {self.borrower.full_name}: {self.amount_requested}"
    
    @property
    def total_due(self):
        """Total amount due including interest."""
        if self.amount_approved:
            interest = self.amount_approved * (self.interest_rate / Decimal('100.0'))
            return self.amount_approved + interest
        return Decimal('0')
    
    @property
    def remaining_balance(self):
        """Outstanding balance."""
        return self.total_due - self.amount_repaid
    
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
