import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    TextField,
    Alert,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent
} from '@mui/material';
import {
    Delete,
    Add,
    Remove,
    ShoppingCart,
    Lock,
    CheckCircle,
    ArrowBack
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import EmptyState from '../common/EmptyState';
import { mockApi } from '../../data/mockApi';

const steps = ['Review Cart', 'Delivery Address', 'Confirm & Pay'];

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
    const { balance, deductFunds } = useWallet();

    const [activeStep, setActiveStep] = useState(0);
    const [deliveryAddress, setDeliveryAddress] = useState({
        fullName: user?.name || user?.businessName || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        notes: ''
    });
    const [processing, setProcessing] = useState(false);
    const [successDialog, setSuccessDialog] = useState(false);
    const [orderResult, setOrderResult] = useState(null);

    const total = getTotal();
    const serviceFee = Math.round(total * 0.02); // 2% service fee
    const grandTotal = total + serviceFee;
    const hasSufficientBalance = balance >= grandTotal;

    const handleQuantityChange = (itemId, delta) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
            const newQty = item.quantity + delta;
            if (newQty >= 1 && newQty <= item.maxQuantity) {
                updateQuantity(itemId, newQty);
            }
        }
    };

    const handleNext = () => {
        setActiveStep(prev => prev + 1);
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleAddressChange = (field) => (e) => {
        setDeliveryAddress(prev => ({ ...prev, [field]: e.target.value }));
    };

    const isAddressValid = () => {
        return deliveryAddress.fullName && deliveryAddress.phone &&
            deliveryAddress.address && deliveryAddress.city;
    };

    const handleCheckout = async () => {
        if (!hasSufficientBalance) return;

        setProcessing(true);
        try {
            // Create orders for each item
            const orders = [];
            for (const item of items) {
                const result = await mockApi.createOrder({
                    buyerId: user.id,
                    listingId: item.id,
                    quantity: item.quantity,
                    deliveryAddress: `${deliveryAddress.address}, ${deliveryAddress.city}`
                });
                orders.push(result);
            }

            // Deduct funds
            deductFunds(grandTotal);

            // Clear cart
            clearCart();

            setOrderResult(orders);
            setSuccessDialog(true);
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setProcessing(false);
        }
    };

    if (items.length === 0 && !successDialog) {
        return (
            <Box maxWidth="md" mx="auto" py={4}>
                <EmptyState
                    variant="cart"
                    title="Your cart is empty"
                    message="Browse the marketplace to find fresh, quality produce from verified farmers."
                    action={() => navigate('/marketplace')}
                    actionLabel="Browse Marketplace"
                />
            </Box>
        );
    }

    return (
        <Box maxWidth="lg" mx="auto">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {activeStep === 0 ? 'Shopping Cart' : activeStep === 1 ? 'Delivery Address' : 'Confirm & Pay'}
            </Typography>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Grid container spacing={4}>
                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    {activeStep === 0 && (
                        // Cart Items
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Cart Items ({items.length})
                            </Typography>
                            <List>
                                {items.map((item, index) => (
                                    <Box key={item.id}>
                                        <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={item.image}
                                                    variant="rounded"
                                                    sx={{ width: 80, height: 80, mr: 2 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography fontWeight={600}>{item.productName}</Typography>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.location} • KES {item.pricePerUnit}/{item.unit}
                                                        </Typography>

                                                        {/* Quantity Controls */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Remove fontSize="small" />
                                                            </IconButton>
                                                            <Typography fontWeight={500}>
                                                                {item.quantity} {item.unit}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                                disabled={item.quantity >= item.maxQuantity}
                                                            >
                                                                <Add fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h6" fontWeight="bold" color="primary">
                                                    KES {(item.pricePerUnit * item.quantity).toLocaleString()}
                                                </Typography>
                                                <IconButton
                                                    onClick={() => removeFromCart(item.id)}
                                                    color="error"
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </ListItem>
                                        {index < items.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        </Paper>
                    )}

                    {activeStep === 1 && (
                        // Delivery Address
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Delivery Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={deliveryAddress.fullName}
                                        onChange={handleAddressChange('fullName')}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        value={deliveryAddress.phone}
                                        onChange={handleAddressChange('phone')}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Street Address"
                                        value={deliveryAddress.address}
                                        onChange={handleAddressChange('address')}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        value={deliveryAddress.city}
                                        onChange={handleAddressChange('city')}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Delivery Notes (Optional)"
                                        value={deliveryAddress.notes}
                                        onChange={handleAddressChange('notes')}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    )}

                    {activeStep === 2 && (
                        // Confirmation
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Order Summary
                            </Typography>

                            <List>
                                {items.map((item) => (
                                    <ListItem key={item.id} sx={{ py: 1 }}>
                                        <ListItemText
                                            primary={item.productName}
                                            secondary={`${item.quantity} ${item.unit}`}
                                        />
                                        <Typography fontWeight={600}>
                                            KES {(item.pricePerUnit * item.quantity).toLocaleString()}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Delivery Address
                            </Typography>
                            <Typography color="text.secondary">
                                {deliveryAddress.fullName}<br />
                                {deliveryAddress.phone}<br />
                                {deliveryAddress.address}, {deliveryAddress.city}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {/* Escrow Notice */}
                            <Card variant="outlined" sx={{ bgcolor: 'info.light', border: 'none' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Lock color="info" />
                                        <Typography fontWeight={600} color="info.dark">
                                            Escrow Protection
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="info.dark">
                                        Your payment will be held securely in escrow and only released to the farmer
                                        once you confirm receipt of your order.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Paper>
                    )}
                </Grid>

                {/* Order Summary Sidebar */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 80 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Order Summary
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography fontWeight={500}>KES {total.toLocaleString()}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="text.secondary">Service Fee (2%)</Typography>
                            <Typography fontWeight={500}>KES {serviceFee.toLocaleString()}</Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Total</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                KES {grandTotal.toLocaleString()}
                            </Typography>
                        </Box>

                        {/* Wallet Balance */}
                        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Wallet Balance
                                </Typography>
                                <Typography fontWeight={600} color={hasSufficientBalance ? 'success.main' : 'error.main'}>
                                    KES {balance.toLocaleString()}
                                </Typography>
                            </Box>
                        </Paper>

                        {!hasSufficientBalance && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                Insufficient balance. Please add funds to your wallet.
                            </Alert>
                        )}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {activeStep > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    startIcon={<ArrowBack />}
                                >
                                    Back
                                </Button>
                            )}

                            {activeStep < 2 ? (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleNext}
                                    disabled={activeStep === 1 && !isAddressValid()}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleCheckout}
                                    disabled={!hasSufficientBalance || processing}
                                    startIcon={processing ? <CircularProgress size={20} /> : <Lock />}
                                >
                                    {processing ? 'Processing...' : `Pay KES ${grandTotal.toLocaleString()}`}
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Success Dialog */}
            <Dialog open={successDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                    <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Order Placed Successfully!
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Your payment of <strong>KES {grandTotal.toLocaleString()}</strong> is now held in escrow.
                    </Typography>
                    <Alert severity="info">
                        The farmer will be notified and your order will be dispatched soon.
                        You'll release the payment once you confirm delivery.
                    </Alert>
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                    <Button variant="outlined" onClick={() => navigate('/marketplace')}>
                        Continue Shopping
                    </Button>
                    <Button variant="contained" onClick={() => navigate('/buyer/orders')}>
                        Track My Orders
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Cart;
