"""
Loans views - Lending, Credit Scoring, and Loan Management API.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction

from .models import Loan, LoanRepayment
from .serializers import (
    LoanSerializer, LoanApplicationSerializer,
    LoanRepaymentSerializer, CreditScoreSerializer
)
from .credit_scoring import calculate_credit_score, get_credit_score_breakdown, get_loan_eligibility
from .escrow_service import create_escrow_wallet, release_loan_milestone
from core.models import User


class LoanViewSet(viewsets.ModelViewSet):
    """
    API endpoint for loans.
    Supports application, approval, and milestone release.
    """
    queryset = Loan.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LoanApplicationSerializer
        return LoanSerializer
    
    def get_queryset(self):
        queryset = Loan.objects.all()
        borrower_id = self.request.query_params.get('borrower')
        status_filter = self.request.query_params.get('status')
        
        if borrower_id:
            queryset = queryset.filter(borrower_id=borrower_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Apply for a loan with credit scoring."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        borrower = serializer.validated_data['borrower']
        
        # Get latest assessment for credit scoring
        latest_assessment = borrower.assessments.order_by('-assessed_at').first()
        
        # Calculate credit score
        credit_score = calculate_credit_score(borrower, latest_assessment)
        eligibility = get_loan_eligibility(credit_score)
        
        if not eligibility['eligible']:
            return Response({
                'error': 'Loan application denied',
                'credit_score': credit_score,
                'reason': eligibility['reason']
            }, status=400)
        
        # Check requested amount against max
        requested = serializer.validated_data['amount_requested']
        if requested > eligibility['max_amount']:
            return Response({
                'error': f'Requested amount exceeds maximum eligible amount of {eligibility["max_amount"]}',
                'credit_score': credit_score,
                'max_amount': eligibility['max_amount']
            }, status=400)
        
        # Create loan
        loan = Loan.objects.create(
            borrower=borrower,
            amount_requested=requested,
            interest_rate=eligibility['interest_rate'],
            term_months=serializer.validated_data.get('term_months', 6),
            credit_score_at_application=credit_score,
            assessment_used=serializer.validated_data.get('assessment_used') or latest_assessment,
            status='requested'
        )
        
        return Response({
            'message': 'Loan application submitted successfully',
            'loan': LoanSerializer(loan).data,
            'credit_score': credit_score,
            'eligibility': eligibility
        }, status=201)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """
        Admin approves a loan application.
        Creates escrow wallet and prepares for milestone disbursement.
        """
        loan = self.get_object()
        
        if loan.status != 'requested':
            return Response({'error': f'Cannot approve loan in {loan.status} status'}, status=400)
        
        # Allow optional amount adjustment
        approved_amount = request.data.get('amount', loan.amount_requested)
        admin_notes = request.data.get('notes', '')
        
        with transaction.atomic():
            loan.status = 'approved'
            loan.amount_approved = approved_amount
            loan.approved_at = timezone.now()
            loan.admin_notes = admin_notes
            loan.escrow_wallet_address = create_escrow_wallet()
            
            # Use simplified milestones for MVP
            loan.milestones = [
                {'name': 'Initial Disbursement', 'percentage': 50, 'released': False},
                {'name': 'Mid-Season Check', 'percentage': 30, 'released': False},
                {'name': 'Pre-Harvest', 'percentage': 20, 'released': False}
            ]
            loan.current_milestone = 0
            
            loan.save()
        
        return Response({
            'message': 'Loan approved successfully',
            'loan': LoanSerializer(loan).data
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a loan application."""
        loan = self.get_object()
        
        if loan.status != 'pending':
            return Response({'error': f'Cannot reject loan in {loan.status} status'}, status=400)
        
        loan.status = 'rejected'
        loan.admin_notes = request.data.get('reason', 'Application rejected')
        loan.save()
        
        return Response({'message': 'Loan rejected', 'loan': LoanSerializer(loan).data})
    
    @action(detail=True, methods=['post'])
    def release_milestone(self, request, pk=None):
        """
        Release next milestone funds to farmer.
        
        PRODUCTION: Would require verification conditions to be met.
        """
        loan = self.get_object()
        
        if loan.status not in ['approved', 'active']:
            return Response({'error': f'Cannot release milestone for {loan.status} loan'}, status=400)
        
        milestone_index, next_milestone = loan.next_milestone
        if next_milestone is None:
            return Response({'error': 'All milestones have been released'}, status=400)
        
        success, tx_hash, amount = release_loan_milestone(loan, milestone_index)
        
        if not success:
            return Response({'error': tx_hash}, status=400)
        
        return Response({
            'message': f'Milestone "{next_milestone["name"]}" released',
            'amount': str(amount),
            'transaction_hash': tx_hash,
            'loan': LoanSerializer(loan).data
        })
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending loans for admin review."""
        pending_loans = Loan.objects.filter(status='pending')
        serializer = LoanSerializer(pending_loans, many=True)
        return Response(serializer.data)


class CreditScoreViewSet(viewsets.ViewSet):
    """API endpoint for credit score calculation."""
    
    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def user_score(self, request, user_id=None):
        """Get credit score for a specific user."""
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        if not user.is_farmer:
            return Response({'error': 'Only farmers have credit scores'}, status=400)
        
        # Get latest assessment
        latest_farm = user.farms.first()
        latest_assessment = latest_farm.latest_assessment if latest_farm else None
        
        breakdown = get_credit_score_breakdown(user, latest_assessment)
        
        return Response(breakdown)
