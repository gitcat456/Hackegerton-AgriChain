"""
Escrow Service - Simulates Stellar Blockchain Smart Contracts.

PRODUCTION REPLACEMENT:
This module simulates escrow functionality that would be implemented using:
1. Stellar SDK for actual blockchain transactions
2. Stellar's SEP-0030 for escrow accounts
3. Multi-signature accounts for release conditions

Each function is annotated with the equivalent Stellar SDK code.
"""

import secrets
from decimal import Decimal
from django.utils import timezone
from typing import Optional, Tuple


def create_escrow_wallet() -> str:
    """
    Create a simulated escrow wallet address.
    
    PRODUCTION - Stellar SDK:
    ```python
    from stellar_sdk import Keypair, Server, TransactionBuilder, Network
    
    def create_escrow_account_stellar():
        # Generate new keypair for escrow
        escrow_keypair = Keypair.random()
        
        # Fund account from platform wallet
        server = Server("https://horizon.stellar.org")
        platform_keypair = Keypair.from_secret(PLATFORM_SECRET_KEY)
        
        account = server.load_account(platform_keypair.public_key)
        
        transaction = (
            TransactionBuilder(
                source_account=account,
                network_passphrase=Network.PUBLIC_NETWORK_PASSPHRASE,
                base_fee=100,
            )
            .append_create_account_op(
                destination=escrow_keypair.public_key,
                starting_balance="5"  # Minimum balance
            )
            .build()
        )
        
        transaction.sign(platform_keypair)
        server.submit_transaction(transaction)
        
        return escrow_keypair.public_key
    ```
    """
    # Simulated Stellar public key format
    return f"G{secrets.token_hex(27).upper()}"


def fund_escrow(escrow_address: str, amount: Decimal, user) -> Tuple[bool, str]:
    """
    Move funds from user wallet to escrow.
    """
    from core.models import Transaction
    
    # Simulate transaction
    if user.available_balance < amount:
        return False, "Insufficient funds"
    
    user.wallet_balance -= amount
    user.save()
    
    tx_hash = secrets.token_hex(32)
    
    Transaction.objects.create(
        user=user,
        transaction_type='escrow_lock',
        amount=-amount,
        stellar_tx_hash=tx_hash,
        description=f'Funded escrow {escrow_address}'
    )
    
    return True, tx_hash


def release_loan_milestone(loan, milestone_index: int) -> Tuple[bool, str, Decimal]:
    """
    Release a loan milestone to the borrower.
    """
    from core.models import Transaction
    
    if milestone_index >= len(loan.milestones):
        return False, "Invalid milestone index", Decimal('0')
    
    milestone = loan.milestones[milestone_index]
    
    if milestone.get('released'):
        return False, "Milestone already released", Decimal('0')
    
    # Calculate amount to release
    approved_amount = loan.amount_approved or loan.amount_requested
    release_amount = approved_amount * Decimal(milestone['percentage']) / 100
    
    # Update loan
    milestone['released'] = True
    milestone['released_at'] = timezone.now().isoformat()
    loan.milestones[milestone_index] = milestone
    loan.current_milestone = milestone_index + 1
    loan.amount_disbursed += release_amount
    
    if loan.status == 'approved':
        loan.status = 'released'
    
    loan.save()
    
    # Credit borrower's wallet
    borrower = loan.borrower
    borrower.wallet_balance += release_amount
    borrower.save()
    
    tx_hash = secrets.token_hex(32)
    
    Transaction.objects.create(
        user=borrower,
        transaction_type='loan_disbursement',
        amount=release_amount,
        reference_type='loan',
        reference_id=loan.id,
        stellar_tx_hash=tx_hash,
        description=f'Loan milestone "{milestone["name"]}" released: {release_amount}'
    )
    
    return True, tx_hash, release_amount


def process_order_payment(order, buyer) -> Tuple[bool, str]:
    """
    Lock buyer payment in escrow for an order.
    """
    from core.models import Transaction
    
    if buyer.available_balance < order.total_price:
        return False, "Insufficient funds"
    
    # Lock funds in escrow
    buyer.wallet_balance -= order.total_price
    buyer.escrow_balance += order.total_price
    buyer.save()
    
    # Create escrow address for order
    order.escrow_wallet_address = create_escrow_wallet()
    order.status = 'escrow_held'
    order.payment_at = timezone.now()
    
    tx_hash = secrets.token_hex(32)
    order.escrow_transaction_hash = tx_hash
    order.save()
    
    Transaction.objects.create(
        user=buyer,
        transaction_type='escrow_lock',
        amount=-order.total_price,
        reference_type='order',
        reference_id=order.id,
        stellar_tx_hash=tx_hash,
        description=f'Payment locked in escrow for order {order.id}'
    )
    
    return True, tx_hash


def release_order_payment(order) -> Tuple[bool, str, Decimal, Decimal]:
    """
    Release payment from escrow to farmer after buyer confirms receipt.
    Auto-deducts loan repayment if farmer has active loan.
    """
    from core.models import Transaction
    from loans.models import Loan, LoanRepayment
    
    farmer = order.listing.farmer
    
    # Check for active loan requiring repayment
    active_loan = Loan.objects.filter(
        borrower=farmer,
        status='released',
        amount_repaid__lt=models.F('amount_approved')  # Simplified check
    ).first()
    
    # Better check: compare repayment to total due
    if active_loan and active_loan.amount_repaid >= active_loan.total_due:
        active_loan = None
    
    loan_deduction = Decimal('0')
    
    if active_loan:
        # Auto-deduct portion for loan repayment (e.g., 30% of sale)
        deduction_rate = Decimal('0.30')
        potential_deduction = order.total_price * deduction_rate
        
        # Don't deduct more than remaining loan balance
        remaining_balance = active_loan.remaining_balance
        loan_deduction = min(potential_deduction, remaining_balance)
        
        # Record repayment
        if loan_deduction > 0:
            active_loan.amount_repaid += loan_deduction
            if active_loan.amount_repaid >= active_loan.total_due:
                active_loan.status = 'repaid'
                active_loan.completed_at = timezone.now()
            active_loan.save()
            
            LoanRepayment.objects.create(
                loan=active_loan,
                amount=loan_deduction,
                status='auto_deducted',
                source_order=order,
                notes=f'Auto-deducted from sale of {order.listing.title}'
            )
            
            # Create Transaction for repayment
            Transaction.objects.create(
                user=farmer,
                transaction_type='loan_repayment',
                amount=-loan_deduction,
                reference_type='loan',
                reference_id=active_loan.id,
                description=f'Auto-repayment from order {order.id}'
            )
    
    # Calculate farmer's net payment
    farmer_receives = order.total_price - loan_deduction
    order.loan_deduction_amount = loan_deduction
    
    # Release funds to farmer
    farmer.wallet_balance += farmer_receives
    farmer.save()
    
    # Update order status
    order.status = 'completed'
    order.completed_at = timezone.now()
    order.save()
    
    tx_hash = secrets.token_hex(32)
    
    # Record transaction for payment
    Transaction.objects.create(
        user=farmer,
        transaction_type='sale_payment',
        amount=farmer_receives,
        reference_type='order',
        reference_id=order.id,
        stellar_tx_hash=tx_hash,
        description=f'Payment received for {order.listing.title}. Loan deduction: {loan_deduction}'
    )
    
    # Release escrow from buyer's account (buyer funds were already moved to escrow_balance)
    buyer = order.buyer
    buyer.escrow_balance -= order.total_price
    buyer.save()
    
    return True, tx_hash, farmer_receives, loan_deduction


def refund_order(order) -> Tuple[bool, str]:
    """
    Refund order - return escrowed funds to buyer.
    """
    from core.models import Transaction
    
    if order.status not in ['escrow_held', 'dispatched', 'disputed']:
        return False, "Order cannot be refunded in current state"
    
    buyer = order.buyer
    
    # Return escrowed funds
    buyer.escrow_balance -= order.total_price
    buyer.wallet_balance += order.total_price
    buyer.save()
    
    order.status = 'refunded'
    order.save()
    
    tx_hash = secrets.token_hex(32)
    
    Transaction.objects.create(
        user=buyer,
        transaction_type='escrow_release',
        amount=order.total_price,
        reference_type='order',
        reference_id=order.id,
        stellar_tx_hash=tx_hash,
        description=f'Refund for order {order.id}'
    )
    
    return True, tx_hash
