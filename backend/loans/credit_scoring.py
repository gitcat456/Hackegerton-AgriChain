"""
Credit Scoring Service for Loan Eligibility.

The credit score determines:
- Loan eligibility (minimum score required)
- Interest rate (lower score = higher rate)
- Maximum loan amount

Formula:
credit_score = (crop_health * 40) + (past_repayment * 40) + (farm_size * 20)
"""

from decimal import Decimal
from typing import Tuple, Dict, Any


def get_repayment_score(user) -> float:
    """
    Calculate repayment score based on loan history.
    Score is 0-1 where 1 = perfect repayment history.
    
    For new users, returns 0.5 (neutral).
    """
    from loans.models import LoanRepayment, Loan
    
    # Get user's completed loans
    completed_loans = Loan.objects.filter(
        borrower=user,
        status__in=['completed', 'active']
    )
    
    if not completed_loans.exists():
        return 0.5  # Neutral score for new borrowers
    
    # Get all repayments
    repayments = LoanRepayment.objects.filter(loan__borrower=user)
    
    if not repayments.exists():
        return 0.5
    
    # Calculate score based on repayment status
    total_repayments = repayments.count()
    on_time = repayments.filter(status__in=['on_time', 'auto_deducted']).count()
    late = repayments.filter(status='late').count()
    
    # Weight: on_time = 1.0, late = 0.5, missed = 0
    score = (on_time * 1.0 + late * 0.5) / total_repayments
    
    return round(score, 2)


def normalize_farm_size(size_acres: float) -> float:
    """
    Normalize farm size to a 0-1 score.
    Larger farms get slightly higher scores (more collateral/stability).
    
    Scale:
    - < 1 acre: 0.3
    - 1-5 acres: 0.5
    - 5-20 acres: 0.7
    - > 20 acres: 1.0
    """
    if size_acres < 1:
        return 0.3
    elif size_acres < 5:
        return 0.5
    elif size_acres < 20:
        return 0.7
    else:
        return 1.0


def calculate_credit_score(user, latest_assessment=None) -> int:
    """
    Calculate credit score (0-100) for a user.
    
    Components:
    - Crop Health (40%): From latest AI assessment
    - Past Repayment (40%): Based on loan repayment history
    - Farm Size (20%): Normalized farm size score
    
    Returns:
        Integer credit score from 0-100
    """
    # Get crop health score
    crop_health = 0.5  # Default if no assessment
    if latest_assessment:
        crop_health = float(latest_assessment.health_score)
    
    # Get repayment history score
    repayment_score = get_repayment_score(user)
    
    # Get farm size score
    farm_size = float(user.farm_size_acres) if user.farm_size_acres else 0
    farm_score = normalize_farm_size(farm_size)
    
    # Calculate weighted score
    credit_score = (
        (crop_health * 40) +
        (repayment_score * 40) +
        (farm_score * 20)
    )
    
    return int(round(credit_score))


def get_loan_eligibility(credit_score: int) -> Dict[str, Any]:
    """
    Determine loan eligibility based on credit score.
    
    Returns eligibility details including:
    - eligible: True/False
    - max_amount: Maximum loan amount
    - interest_rate: Applicable interest rate
    - reason: Explanation
    """
    if credit_score < 30:
        return {
            'eligible': False,
            'max_amount': 0,
            'interest_rate': 0,
            'tier': 'ineligible',
            'reason': 'Credit score too low. Improve crop health or build repayment history.'
        }
    elif credit_score < 50:
        return {
            'eligible': True,
            'max_amount': 5000,
            'interest_rate': 20.0,
            'tier': 'basic',
            'reason': 'Eligible for basic loans with higher interest rate.'
        }
    elif credit_score < 70:
        return {
            'eligible': True,
            'max_amount': 20000,
            'interest_rate': 15.0,
            'tier': 'standard',
            'reason': 'Eligible for standard loans with competitive rates.'
        }
    elif credit_score < 85:
        return {
            'eligible': True,
            'max_amount': 50000,
            'interest_rate': 12.0,
            'tier': 'premium',
            'reason': 'Excellent credit! Eligible for premium loan terms.'
        }
    else:
        return {
            'eligible': True,
            'max_amount': 100000,
            'interest_rate': 10.0,
            'tier': 'elite',
            'reason': 'Top-tier borrower. Best rates and highest limits available.'
        }


def get_credit_score_breakdown(user, latest_assessment=None) -> Dict[str, Any]:
    """
    Get detailed breakdown of credit score calculation.
    Useful for transparency and user education.
    """
    crop_health = 0.5
    if latest_assessment:
        crop_health = float(latest_assessment.health_score)
    
    repayment_score = get_repayment_score(user)
    farm_size = float(user.farm_size_acres) if user.farm_size_acres else 0
    farm_score = normalize_farm_size(farm_size)
    
    return {
        'components': {
            'crop_health': {
                'score': crop_health,
                'weight': 40,
                'contribution': int(crop_health * 40),
                'description': 'Based on latest AI crop assessment'
            },
            'repayment_history': {
                'score': repayment_score,
                'weight': 40,
                'contribution': int(repayment_score * 40),
                'description': 'Based on past loan repayment performance'
            },
            'farm_size': {
                'score': farm_score,
                'weight': 20,
                'contribution': int(farm_score * 20),
                'description': f'Farm size: {farm_size} acres'
            }
        },
        'total_score': calculate_credit_score(user, latest_assessment),
        'eligibility': get_loan_eligibility(calculate_credit_score(user, latest_assessment))
    }
