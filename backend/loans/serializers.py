"""
Loans serializers - Lending Pool, Loans, and Repayments.
"""

from rest_framework import serializers
from .models import LendingPool, Loan, LoanRepayment
from crops.serializers import CropAssessmentSerializer


class LendingPoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = LendingPool
        fields = ['id', 'name', 'total_balance', 'available_balance', 
                  'reserved_balance', 'base_interest_rate', 'created_at']
        read_only_fields = ['id', 'created_at']


class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = ['id', 'loan', 'amount', 'status', 'source_order',
                  'transaction_hash', 'paid_at', 'notes']
        read_only_fields = ['id', 'paid_at', 'transaction_hash']


class LoanSerializer(serializers.ModelSerializer):
    borrower_name = serializers.CharField(source='borrower.full_name', read_only=True)
    total_due = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    remaining_balance = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    repayments = LoanRepaymentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Loan
        fields = ['id', 'borrower', 'borrower_name', 'lending_pool',
                  'amount_requested', 'amount_approved', 'interest_rate', 'term_months',
                  'status', 'credit_score_at_application', 'assessment_used',
                  'milestones', 'current_milestone', 'escrow_wallet_address',
                  'amount_disbursed', 'amount_repaid', 'total_due', 'remaining_balance',
                  'applied_at', 'approved_at', 'completed_at', 'admin_notes', 'repayments']
        read_only_fields = ['id', 'status', 'credit_score_at_application', 
                           'escrow_wallet_address', 'amount_disbursed', 'amount_repaid',
                           'applied_at', 'approved_at', 'completed_at']


class LoanApplicationSerializer(serializers.ModelSerializer):
    """Serializer for loan application."""
    
    class Meta:
        model = Loan
        fields = ['borrower', 'amount_requested', 'term_months', 'assessment_used']
    
    def validate(self, attrs):
        borrower = attrs.get('borrower')
        
        # Check if farmer has any farms
        if not borrower.is_farmer:
            raise serializers.ValidationError("Only farmers can apply for loans")
        
        if not borrower.farms.exists():
            raise serializers.ValidationError("Register a farm before applying for loans")
        
        return attrs


class CreditScoreSerializer(serializers.Serializer):
    """Serializer for credit score response."""
    total_score = serializers.IntegerField()
    components = serializers.DictField()
    eligibility = serializers.DictField()
