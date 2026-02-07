"""
Marketplace views - Listings, Orders, Cart, and Escrow Actions API.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db import transaction
from decimal import Decimal

from .models import Listing, Order, CartItem
from .serializers import (
    ListingSerializer, ListingCreateSerializer,
    OrderSerializer, OrderCreateSerializer,
    CartItemSerializer
)
from loans.escrow_service import process_order_payment, release_order_payment, refund_order


class ListingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for marketplace listings.
    Farmers create listings, buyers browse them.
    """
    queryset = Listing.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ListingCreateSerializer
        return ListingSerializer
    
    def get_queryset(self):
        queryset = Listing.objects.all()
        
        # Filter options
        farmer_id = self.request.query_params.get('farmer')
        status_filter = self.request.query_params.get('status')
        crop_type = self.request.query_params.get('crop_type')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if farmer_id:
            queryset = queryset.filter(farmer_id=farmer_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        else:
            # Default to active listings for marketplace
            queryset = queryset.filter(status='active')
        if crop_type:
            queryset = queryset.filter(crop_type__icontains=crop_type)
        if min_price:
            queryset = queryset.filter(price_per_kg__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_kg__lte=max_price)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured listings."""
        featured = Listing.objects.filter(status='active', featured=True)[:10]
        serializer = ListingSerializer(featured, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def crop_types(self, request):
        """Get list of available crop types."""
        crop_types = Listing.objects.filter(status='active').values_list(
            'crop_type', flat=True
        ).distinct()
        return Response(list(crop_types))


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for orders.
    Handles the complete order lifecycle with escrow.
    """
    queryset = Order.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def get_queryset(self):
        queryset = Order.objects.all()
        
        buyer_id = self.request.query_params.get('buyer')
        farmer_id = self.request.query_params.get('farmer')
        status_filter = self.request.query_params.get('status')
        
        if buyer_id:
            queryset = queryset.filter(buyer_id=buyer_id)
        if farmer_id:
            queryset = queryset.filter(listing__farmer_id=farmer_id)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create order and optionally process payment immediately."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Update listing quantity
        listing = order.listing
        listing.quantity_available -= order.quantity_kg
        if listing.quantity_available <= 0:
            listing.status = 'sold'
        listing.save()
        
        return Response({
            'message': 'Order created successfully',
            'order': OrderSerializer(order).data
        }, status=201)
    
    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        """
        Process payment for order - locks funds in escrow.
        """
        order = self.get_object()
        
        if order.status != 'pending_payment':
            return Response({
                'error': f'Cannot pay for order in {order.status} status'
            }, status=400)
        
        # Pass user (who is the wallet)
        success, tx_hash = process_order_payment(order, order.buyer)
        
        if not success:
            return Response({'error': tx_hash}, status=400)
        
        return Response({
            'message': 'Payment successful - funds held in escrow',
            'transaction_hash': tx_hash,
            'order': OrderSerializer(order).data
        })
    
    @action(detail=True, methods=['post'])
    def dispatch(self, request, pk=None):
        """
        Farmer marks order as dispatched/shipped.
        """
        order = self.get_object()
        
        if order.status != 'escrow_held':
            return Response({
                'error': f'Cannot dispatch order in {order.status} status'
            }, status=400)
        
        # Verify caller is the farmer (in production, check auth)
        # For demo, trust the request
        
        order.status = 'dispatched'
        order.dispatched_at = timezone.now()
        order.save()
        
        return Response({
            'message': 'Order marked as dispatched',
            'order': OrderSerializer(order).data
        })
    
    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        """
        Buyer confirms receipt - releases funds from escrow.
        If farmer has active loan, auto-deducts repayment.
        """
        order = self.get_object()
        
        if order.status != 'dispatched':
            return Response({
                'error': f'Cannot confirm receipt for order in {order.status} status'
            }, status=400)
        
        order.status = 'received'
        order.received_at = timezone.now()
        order.save()
        
        # Release payment from escrow
        success, tx_hash, farmer_amount, loan_deduction = release_order_payment(order)
        
        if not success:
            return Response({'error': tx_hash}, status=400)
        
        response_data = {
            'message': 'Receipt confirmed - payment released to farmer',
            'farmer_received': str(farmer_amount),
            'transaction_hash': tx_hash,
            'order': OrderSerializer(order).data
        }
        
        if loan_deduction > 0:
            response_data['loan_deduction'] = str(loan_deduction)
            response_data['note'] = f'{loan_deduction} auto-deducted for loan repayment'
        
        return Response(response_data)
    
    @action(detail=True, methods=['post'])
    def dispute(self, request, pk=None):
        """Raise a dispute for the order."""
        order = self.get_object()
        
        if order.status not in ['escrow_held', 'dispatched']:
            return Response({
                'error': f'Cannot dispute order in {order.status} status'
            }, status=400)
        
        order.status = 'disputed'
        order.save()
        
        return Response({
            'message': 'Dispute raised - admin will review',
            'order': OrderSerializer(order).data
        })
    
    @action(detail=True, methods=['post'])
    def refund(self, request, pk=None):
        """
        Refund order (admin action for disputes).
        """
        order = self.get_object()
        
        success, tx_hash = refund_order(order)
        
        if not success:
            return Response({'error': tx_hash}, status=400)
        
        return Response({
            'message': 'Order refunded',
            'transaction_hash': tx_hash,
            'order': OrderSerializer(order).data
        })
    
    @action(detail=False, methods=['get'])
    def my_sales(self, request):
        """Get orders for farmer's listings (farmer view)."""
        farmer_id = request.query_params.get('farmer_id')
        if not farmer_id:
            return Response({'error': 'farmer_id required'}, status=400)
        
        orders = Order.objects.filter(listing__farmer_id=farmer_id)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CartViewSet(viewsets.ModelViewSet):
    """API endpoint for shopping cart."""
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    
    def get_queryset(self):
        queryset = CartItem.objects.all()
        buyer_id = self.request.query_params.get('buyer')
        if buyer_id:
            queryset = queryset.filter(buyer_id=buyer_id)
        return queryset
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get cart summary for a buyer."""
        buyer_id = request.query_params.get('buyer_id')
        if not buyer_id:
            return Response({'error': 'buyer_id required'}, status=400)
        
        cart_items = CartItem.objects.filter(buyer_id=buyer_id)
        total = sum(item.subtotal for item in cart_items)
        
        return Response({
            'items': CartItemSerializer(cart_items, many=True).data,
            'total_items': cart_items.count(),
            'total_amount': str(total)
        })
    
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """
        Convert cart to orders.
        Creates one order per listing (different farmers).
        """
        buyer_id = request.data.get('buyer_id')
        delivery_address = request.data.get('delivery_address', '')
        
        if not buyer_id:
            return Response({'error': 'buyer_id required'}, status=400)
        
        cart_items = CartItem.objects.filter(buyer_id=buyer_id)
        
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=400)
        
        created_orders = []
        
        with transaction.atomic():
            for item in cart_items:
                order = Order.objects.create(
                    listing=item.listing,
                    buyer_id=buyer_id,
                    quantity_kg=item.quantity_kg,
                    price_per_kg=item.listing.price_per_kg,
                    total_price=item.subtotal,
                    delivery_address=delivery_address
                )
                
                # Update listing quantity
                item.listing.quantity_available -= item.quantity_kg
                if item.listing.quantity_available <= 0:
                    item.listing.status = 'sold'
                item.listing.save()
                
                created_orders.append(order)
            
            # Clear cart
            cart_items.delete()
        
        return Response({
            'message': f'Created {len(created_orders)} orders',
            'orders': OrderSerializer(created_orders, many=True).data
        })
