"""
Marketplace serializers - Listings, Orders, and Cart.
"""

from rest_framework import serializers
from .models import Listing, Order, CartItem
from crops.serializers import CropAssessmentSerializer


class ListingSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    farmer_location = serializers.CharField(source='farmer.location', read_only=True)
    health_badge = serializers.DictField(read_only=True)
    total_value = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    assessment = CropAssessmentSerializer(read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Listing
        fields = ['id', 'farmer', 'farmer_name', 'farmer_location', 'farm', 
                  'title', 'description', 'crop_type', 'quantity_kg', 'quantity_available',
                  'price_per_kg', 'total_value', 'expected_harvest_date', 
                  'delivery_available', 'delivery_radius_km', 'assessment', 'health_badge',
                  'status', 'featured', 'cover_image', 'cover_image_url',
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        # Fallback to first farm image
        if obj.farm and obj.farm.images.exists():
            first_image = obj.farm.images.first()
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None


class ListingCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating listings."""
    
    class Meta:
        model = Listing
        fields = ['farmer', 'farm', 'title', 'description', 'crop_type',
                  'quantity_kg', 'price_per_kg', 'expected_harvest_date',
                  'delivery_available', 'delivery_radius_km', 'cover_image']
    
    def create(self, validated_data):
        # Set quantity_available same as quantity_kg initially
        validated_data['quantity_available'] = validated_data['quantity_kg']
        
        # Link latest assessment from farm
        farm = validated_data.get('farm')
        if farm and farm.latest_assessment:
            validated_data['assessment'] = farm.latest_assessment
        
        return super().create(validated_data)


class OrderSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    buyer_name = serializers.CharField(source='buyer.full_name', read_only=True)
    farmer_name = serializers.CharField(source='farmer.full_name', read_only=True)
    farmer_receives = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'listing', 'listing_title', 'buyer', 'buyer_name', 
                  'farmer_name', 'quantity_kg', 'price_per_kg', 'total_price',
                  'status', 'escrow_wallet_address', 'escrow_transaction_hash',
                  'delivery_address', 'delivery_notes', 'loan_deduction_amount',
                  'farmer_receives', 'created_at', 'payment_at', 'dispatched_at',
                  'received_at', 'completed_at']
        read_only_fields = ['id', 'total_price', 'status', 'escrow_wallet_address',
                           'escrow_transaction_hash', 'loan_deduction_amount',
                           'created_at', 'payment_at', 'dispatched_at', 
                           'received_at', 'completed_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders."""
    
    class Meta:
        model = Order
        fields = ['listing', 'buyer', 'quantity_kg', 'delivery_address', 'delivery_notes']
    
    def validate(self, attrs):
        listing = attrs['listing']
        quantity = attrs['quantity_kg']
        
        if listing.status != 'active':
            raise serializers.ValidationError("This listing is not available")
        
        if quantity > listing.quantity_available:
            raise serializers.ValidationError(
                f"Requested quantity exceeds available ({listing.quantity_available} kg)"
            )
        
        return attrs
    
    def create(self, validated_data):
        listing = validated_data['listing']
        quantity = validated_data['quantity_kg']
        
        # Calculate total price
        validated_data['price_per_kg'] = listing.price_per_kg
        validated_data['total_price'] = quantity * listing.price_per_kg
        
        return super().create(validated_data)


class CartItemSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_price = serializers.DecimalField(source='listing.price_per_kg', 
                                             max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'buyer', 'listing', 'listing_title', 'listing_price',
                  'quantity_kg', 'subtotal', 'added_at']
        read_only_fields = ['id', 'added_at']
