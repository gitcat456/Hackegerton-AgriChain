"""
Seed data for AgriChain demo.
Run with: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import random

from django.contrib.auth import get_user_model
from core.models import Transaction, User
from crops.models import CropImage, CropAssessment
from loans.models import Loan, LoanRepayment
from marketplace.models import Listing, Order


class Command(BaseCommand):
    help = 'Seeds the database with demo data for AgriChain'

    def handle(self, *args, **options):
        self.stdout.write('🌱 Seeding AgriChain database (Hackathon MVP)...\n')
        
        # Create Demo Users
        farmers_data = [
            {
                'email': 'john.farmer@demo.com',
                'full_name': 'John Mwangi',
                'phone': '+254712345678',
                'is_farmer': True,
                'farm_name': 'Mwangi Family Farm',
                'farm_location': 'Nakuru County, Kenya',
                'farm_size_acres': Decimal('5.5'),
                'main_crops': 'Maize, Beans',
                'wallet_balance': Decimal('5000')
            },
            {
                'email': 'mary.farmer@demo.com',
                'full_name': 'Mary Wanjiku',
                'phone': '+254723456789',
                'is_farmer': True,
                'farm_name': 'Wanjiku Organic Farm',
                'farm_location': 'Kiambu County, Kenya',
                'farm_size_acres': Decimal('12.0'),
                'main_crops': 'Beans, Peas',
                'wallet_balance': Decimal('5000')
            },
            {
                'email': 'peter.farmer@demo.com',
                'full_name': 'Peter Ochieng',
                'phone': '+254734567890',
                'is_farmer': True,
                'farm_name': 'Ochieng Rice Paddies',
                'farm_location': 'Kisumu County, Kenya',
                'farm_size_acres': Decimal('8.0'),
                'main_crops': 'Rice',
                'wallet_balance': Decimal('5000')
            }
        ]
        
        farmers = []
        for data in farmers_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults=data
            )
            farmers.append(user)
            self.stdout.write(f'✅ Farmer: {user.full_name} ({user.farm_name})')
        
        # Create Buyers
        buyers_data = [
            {
                'email': 'buyer1@demo.com',
                'full_name': 'Sarah Kimani',
                'phone': '+254745678901',
                'is_buyer': True,
                'wallet_balance': Decimal('50000')
            },
            {
                'email': 'buyer2@demo.com',
                'full_name': 'David Mutua',
                'phone': '+254756789012',
                'is_buyer': True,
                'wallet_balance': Decimal('50000')
            }
        ]
        
        buyers = []
        for data in buyers_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults=data
            )
            buyers.append(user)
            self.stdout.write(f'✅ Buyer: {user.full_name}')
        
        # Create Admin
        admin, created = User.objects.get_or_create(
            email='admin@agrichain.com',
            defaults={
                'full_name': 'AgriChain Admin',
                'is_admin': True,
                'is_staff': True
            }
        )
        self.stdout.write(f'✅ Admin: {admin.full_name}')
        
        # Create Assessments (Simulating AI)
        assessments_data = [
            {
                'farmer': farmers[0],
                'crop_type': 'Maize',
                'health_score': 0.85,
                'estimated_yield': 'high',
                'risk_level': 'low',
                'recommendations': ['Maintain irrigation', 'Apply top dressing']
            },
            {
                'farmer': farmers[1],
                'crop_type': 'Beans',
                'health_score': 0.72,
                'estimated_yield': 'medium',
                'risk_level': 'medium',
                'recommendations': ['Check for aphids', 'Consider drip irrigation']
            }
        ]

        created_assessments = []
        for data in assessments_data:
            assessment = CropAssessment.objects.create(
                farmer=data['farmer'],
                crop_type=data['crop_type'],
                health_score=data['health_score'],
                estimated_yield=data['estimated_yield'],
                risk_level=data['risk_level'],
                recommendations=data['recommendations'],
                confidence_score=Decimal('0.88'),
                raw_ai_response={"simulated": True}
            )
            created_assessments.append(assessment)
            self.stdout.write(f'✅ Assessment: {data["crop_type"]} for {data["farmer"].full_name}')

        # Create Listings (Based on assessments)
        listings_data = [
            {
                'farmer': farmers[0],
                'title': 'Fresh Organic Maize',
                'description': 'High-quality maize from Nakuru.',
                'crop_type': 'Maize',
                'quantity_kg': Decimal('500'),
                'price_per_kg': Decimal('45'),
                'assessment': created_assessments[0]
            },
            {
                'farmer': farmers[1],
                'title': 'Premium Organic Beans',
                'description': 'Certified organic beans.',
                'crop_type': 'Beans',
                'quantity_kg': Decimal('300'),
                'price_per_kg': Decimal('120'),
                'assessment': created_assessments[1]
            }
        ]
        
        for data in listings_data:
            listing = Listing.objects.create(
                farmer=data['farmer'],
                title=data['title'],
                description=data['description'],
                crop_type=data['crop_type'],
                quantity_kg=data['quantity_kg'],
                quantity_available=data['quantity_kg'],
                price_per_kg=data['price_per_kg'],
                expected_harvest_date=timezone.now().date() + timedelta(days=30),
                assessment=data['assessment'],
                status='active'
            )
            self.stdout.write(f'✅ Listing: {listing.title}')
        
        # Create Demo Loan
        loan = Loan.objects.create(
            borrower=farmers[0],
            amount_requested=Decimal('15000'),
            amount_approved=Decimal('15000'),
            interest_rate=Decimal('12.0'),
            term_months=6,
            credit_score_at_application=78,
            assessment_used=created_assessments[0],
            status='released',
            escrow_wallet_address=f"G{'A' * 55}",
            amount_disbursed=Decimal('15000'),
            amount_repaid=Decimal('0'),
            approved_at=timezone.now() - timedelta(days=10)
        )
        self.stdout.write(f'✅ Loan: {loan.borrower.full_name} - {loan.amount_approved}')
        
        self.stdout.write(self.style.SUCCESS('\n🎉 Database seeded successfully!'))
