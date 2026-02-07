"""
Seed data for AgriChain demo.
Run with: python manage.py seed_data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import random

from core.models import User, Wallet
from crops.models import Farm, CropAssessment
from loans.models import LendingPool, Loan
from marketplace.models import Listing


class Command(BaseCommand):
    help = 'Seeds the database with demo data for AgriChain'

    def handle(self, *args, **options):
        self.stdout.write('🌱 Seeding AgriChain database...\n')
        
        # Create Lending Pool
        pool, _ = LendingPool.objects.get_or_create(
            name="AgriChain Main Pool",
            defaults={
                'total_balance': Decimal('1000000'),
                'available_balance': Decimal('950000'),
                'reserved_balance': Decimal('50000'),
                'base_interest_rate': Decimal('12.0')
            }
        )
        self.stdout.write(f'✅ Lending Pool: {pool.name}')
        
        # Create Demo Users
        farmers_data = [
            {
                'email': 'john.farmer@demo.com',
                'full_name': 'John Mwangi',
                'phone': '+254712345678',
                'is_farmer': True,
                'location': 'Nakuru County, Kenya',
                'farm_size_acres': Decimal('5.5')
            },
            {
                'email': 'mary.farmer@demo.com',
                'full_name': 'Mary Wanjiku',
                'phone': '+254723456789',
                'is_farmer': True,
                'location': 'Kiambu County, Kenya',
                'farm_size_acres': Decimal('12.0')
            },
            {
                'email': 'peter.farmer@demo.com',
                'full_name': 'Peter Ochieng',
                'phone': '+254734567890',
                'is_farmer': True,
                'location': 'Kisumu County, Kenya',
                'farm_size_acres': Decimal('8.0')
            }
        ]
        
        farmers = []
        for data in farmers_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults=data
            )
            if created:
                Wallet.objects.create(user=user, balance=Decimal('5000'))
            farmers.append(user)
            self.stdout.write(f'✅ Farmer: {user.full_name}')
        
        # Create Buyers
        buyers_data = [
            {
                'email': 'buyer1@demo.com',
                'full_name': 'Sarah Kimani',
                'phone': '+254745678901',
                'is_buyer': True,
                'location': 'Nairobi, Kenya'
            },
            {
                'email': 'buyer2@demo.com',
                'full_name': 'David Mutua',
                'phone': '+254756789012',
                'is_buyer': True,
                'location': 'Mombasa, Kenya'
            }
        ]
        
        buyers = []
        for data in buyers_data:
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults=data
            )
            if created:
                Wallet.objects.create(user=user, balance=Decimal('50000'))
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
        if created:
            Wallet.objects.create(user=admin, balance=Decimal('0'))
        self.stdout.write(f'✅ Admin: {admin.full_name}')
        
        # Create Farms with Assessments
        farms_data = [
            {
                'owner': farmers[0],
                'name': 'Mwangi Family Farm',
                'location': 'Nakuru County',
                'size_acres': Decimal('5.5'),
                'current_crop': 'maize',
                'assessment': {
                    'crop_type': 'maize',
                    'health_score': 0.85,
                    'estimated_yield': 'high',
                    'risk_level': 'low',
                    'recommendations': ['Maintain current irrigation', 'Apply top dressing fertilizer']
                }
            },
            {
                'owner': farmers[1],
                'name': 'Wanjiku Organic Farm',
                'location': 'Kiambu County',
                'size_acres': Decimal('12.0'),
                'current_crop': 'beans',
                'assessment': {
                    'crop_type': 'beans',
                    'health_score': 0.72,
                    'estimated_yield': 'medium',
                    'risk_level': 'medium',
                    'recommendations': ['Monitor for aphids', 'Consider drip irrigation']
                }
            },
            {
                'owner': farmers[2],
                'name': 'Ochieng Rice Paddies',
                'location': 'Kisumu County',
                'size_acres': Decimal('8.0'),
                'current_crop': 'rice',
                'assessment': {
                    'crop_type': 'rice',
                    'health_score': 0.91,
                    'estimated_yield': 'high',
                    'risk_level': 'low',
                    'recommendations': ['Maintain water levels', 'Excellent growing conditions']
                }
            }
        ]
        
        farms = []
        for data in farms_data:
            assessment_data = data.pop('assessment')
            farm, created = Farm.objects.get_or_create(
                owner=data['owner'],
                name=data['name'],
                defaults={
                    'location': data['location'],
                    'size_acres': data['size_acres'],
                    'current_crop': data['current_crop'],
                    'planting_date': timezone.now().date() - timedelta(days=60),
                    'expected_harvest_date': timezone.now().date() + timedelta(days=30)
                }
            )
            
            # Create assessment
            if created or not farm.assessments.exists():
                CropAssessment.objects.create(
                    farm=farm,
                    **assessment_data,
                    confidence_score=Decimal('0.88'),
                    raw_ai_response=assessment_data
                )
            
            farms.append(farm)
            self.stdout.write(f'✅ Farm: {farm.name} ({farm.current_crop})')
        
        # Create Listings
        listings_data = [
            {
                'farmer': farmers[0],
                'farm': farms[0],
                'title': 'Fresh Organic Maize - Ready Soon',
                'description': 'High-quality maize from our family farm. Grown using sustainable practices.',
                'crop_type': 'maize',
                'quantity_kg': Decimal('500'),
                'price_per_kg': Decimal('45'),
                'expected_harvest_date': timezone.now().date() + timedelta(days=30)
            },
            {
                'farmer': farmers[1],
                'farm': farms[1],
                'title': 'Premium Organic Beans',
                'description': 'Certified organic beans. Great for local markets and export.',
                'crop_type': 'beans',
                'quantity_kg': Decimal('300'),
                'price_per_kg': Decimal('120'),
                'expected_harvest_date': timezone.now().date() + timedelta(days=45)
            },
            {
                'farmer': farmers[2],
                'farm': farms[2],
                'title': 'Aromatic Basmati Rice',
                'description': 'Premium basmati rice from the shores of Lake Victoria.',
                'crop_type': 'rice',
                'quantity_kg': Decimal('1000'),
                'price_per_kg': Decimal('180'),
                'expected_harvest_date': timezone.now().date() + timedelta(days=20)
            }
        ]
        
        for data in listings_data:
            farm = data['farm']
            listing, created = Listing.objects.get_or_create(
                farmer=data['farmer'],
                title=data['title'],
                defaults={
                    'farm': farm,
                    'description': data['description'],
                    'crop_type': data['crop_type'],
                    'quantity_kg': data['quantity_kg'],
                    'quantity_available': data['quantity_kg'],
                    'price_per_kg': data['price_per_kg'],
                    'expected_harvest_date': data['expected_harvest_date'],
                    'assessment': farm.latest_assessment,
                    'status': 'active'
                }
            )
            self.stdout.write(f'✅ Listing: {listing.title}')
        
        # Create sample loan for demo
        if not Loan.objects.filter(borrower=farmers[0]).exists():
            loan = Loan.objects.create(
                borrower=farmers[0],
                lending_pool=pool,
                amount_requested=Decimal('15000'),
                amount_approved=Decimal('15000'),
                interest_rate=Decimal('12.0'),
                term_months=6,
                credit_score_at_application=78,
                assessment_used=farms[0].latest_assessment,
                status='active',
                escrow_wallet_address=f"G{'A' * 55}",
                amount_disbursed=Decimal('4500'),  # First milestone released
                milestones=[
                    {"name": "Approval", "percentage": 30, "released": True, "released_at": timezone.now().isoformat()},
                    {"name": "Mid-Growth Verification", "percentage": 40, "released": False, "released_at": None},
                    {"name": "Pre-Harvest", "percentage": 30, "released": False, "released_at": None},
                ],
                current_milestone=1,
                approved_at=timezone.now() - timedelta(days=30)
            )
            self.stdout.write(f'✅ Loan: {loan.borrower.full_name} - {loan.amount_approved}')
        
        self.stdout.write(self.style.SUCCESS('\n🎉 Database seeded successfully!'))
        self.stdout.write('\nDemo accounts:')
        self.stdout.write('  Farmers: john.farmer@demo.com, mary.farmer@demo.com, peter.farmer@demo.com')
        self.stdout.write('  Buyers: buyer1@demo.com, buyer2@demo.com')
        self.stdout.write('  Admin: admin@agrichain.com')
