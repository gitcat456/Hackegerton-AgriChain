import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Avatar,
    Stepper,
    Step,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton
} from '@mui/material';
import {
    LocalShipping,
    CheckCircle,
    HourglassEmpty,
    Lock,
    Receipt
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import PageBackground from '../layout/PageBackground';

const FarmerOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [dispatchDialog, setDispatchDialog] = useState({ open: false, order: null });

    useEffect(() => {
        const loadOrders = async () => {
            if (user) {
                setLoading(true);
                const data = await mockApi.getFarmerOrders(user.id);
                setOrders(data);
                setLoading(false);
            }
        };
        loadOrders();
    }, [user]);

    const pendingOrders = orders.filter(o => o.status === 'PAID');
    const dispatchedOrders = orders.filter(o => o.status === 'DISPATCHED');
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');

    const tabs = [
        { label: 'New Orders', icon: <HourglassEmpty />, data: pendingOrders },
        { label: 'Dispatched', icon: <LocalShipping />, data: dispatchedOrders },
        { label: 'Completed', icon: <CheckCircle />, data: completedOrders }
    ];

    const displayedOrders = tabs[tabValue].data;

    const handleMarkDispatched = async (order) => {
        // Simulate marking as dispatched
        const orderIndex = orders.findIndex(o => o.id === order.id);
        if (orderIndex !== -1) {
            const updatedOrders = [...orders];
            updatedOrders[orderIndex] = {
                ...updatedOrders[orderIndex],
                status: 'DISPATCHED',
                timeline: updatedOrders[orderIndex].timeline?.map((t, i) =>
                    i <= 2 ? { ...t, completed: true, date: t.date || new Date().toISOString().split('T')[0] } : t
                )
            };
            setOrders(updatedOrders);
        }
        setDispatchDialog({ open: false, order: null });
    };

    // Calculate earnings summary
    const totalEarnings = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const pendingEarnings = [...pendingOrders, ...dispatchedOrders].reduce((acc, o) => acc + o.totalAmount, 0);

    const OrderCard = ({ order }) => {
        const timelineSteps = ['Ordered', 'Paid', 'Dispatched', 'Received', 'Released'];
        const activeStep = order.timeline?.filter(t => t.completed).length || 0;

        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {order.productName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Order #{order.id} • {order.orderDate}
                            </Typography>
                        </Box>
                        <Box textAlign="right">
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                KES {order.totalAmount?.toLocaleString()}
                            </Typography>
                            <StatusBadge status={order.status} />
                        </Box>
                    </Box>

                    {/* Details */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Quantity</Typography>
                            <Typography fontWeight={500}>{order.quantity} {order.unit}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Buyer</Typography>
                            <Typography fontWeight={500}>{order.buyerName}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Delivery To</Typography>
                            <Typography fontWeight={500}>{order.deliveryAddress}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="caption" color="text.secondary">Payment</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Lock sx={{ fontSize: 16, color: 'warning.main' }} />
                                <StatusBadge status={order.escrowStatus} />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Timeline */}
                    {order.timeline && order.status !== 'COMPLETED' && (
                        <Box sx={{ mb: 2 }}>
                            <Stepper activeStep={activeStep - 1} alternativeLabel>
                                {timelineSteps.map((step, index) => (
                                    <Step key={step} completed={order.timeline[index]?.completed}>
                                        <StepLabel>
                                            <Typography variant="caption">{step}</Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    )}

                    {/* Completed Info */}
                    {order.status === 'COMPLETED' && (
                        <Box sx={{ bgcolor: 'success.light', p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircle color="success" />
                                    <Typography fontWeight={600} color="success.dark">
                                        Payment Released • KES {order.totalAmount?.toLocaleString()}
                                    </Typography>
                                </Box>
                                {order.buyerRating && (
                                    <Chip
                                        label={`★ ${order.buyerRating} Rating`}
                                        color="success"
                                        size="small"
                                    />
                                )}
                            </Box>
                            {order.buyerReview && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                                    "{order.buyerReview}"
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Actions */}
                    {order.status === 'PAID' && (
                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<LocalShipping />}
                                onClick={() => setDispatchDialog({ open: true, order })}
                            >
                                Mark as Dispatched
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <PageBackground type="farmer">
            <Box>
                {/* Header */}
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Orders Received
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage orders from buyers and track payments
                </Typography>

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Total Orders</Typography>
                            <Typography variant="h4" fontWeight="bold">{orders.length}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">New Orders</Typography>
                            <Typography variant="h4" fontWeight="bold" color="warning.main">
                                {pendingOrders.length}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Pending Earnings</Typography>
                            <Typography variant="h5" fontWeight="bold" color="secondary.main">
                                KES {pendingEarnings.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Total Earned</Typography>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                                KES {totalEarnings.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable">
                        {tabs.map((tab, index) => (
                            <Tab
                                key={tab.label}
                                label={`${tab.label} (${tab.data.length})`}
                                icon={tab.icon}
                                iconPosition="start"
                            />
                        ))}
                    </Tabs>
                </Paper>

                {/* Content */}
                {loading ? (
                    <Box>
                        {[1, 2].map(i => (
                            <Skeleton key={i} height={220} sx={{ mb: 2, borderRadius: 3 }} />
                        ))}
                    </Box>
                ) : displayedOrders.length > 0 ? (
                    displayedOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <EmptyState
                        variant="orders"
                        title={`No ${tabs[tabValue].label.toLowerCase()}`}
                        message={tabValue === 0
                            ? "New orders from buyers will appear here."
                            : `No ${tabs[tabValue].label.toLowerCase()} to display.`
                        }
                        action={tabValue === 0 ? () => navigate('/farmer/listings') : undefined}
                        actionLabel={tabValue === 0 ? "Manage Listings" : undefined}
                    />
                )}

                {/* Dispatch Confirmation Dialog */}
                <Dialog open={dispatchDialog.open} onClose={() => setDispatchDialog({ open: false, order: null })}>
                    <DialogTitle>Confirm Dispatch</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Confirm that you have dispatched <strong>{dispatchDialog.order?.productName}</strong> ({dispatchDialog.order?.quantity} {dispatchDialog.order?.unit}) to the buyer.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Delivery address: {dispatchDialog.order?.deliveryAddress}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDispatchDialog({ open: false, order: null })}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={() => handleMarkDispatched(dispatchDialog.order)}
                            startIcon={<LocalShipping />}
                        >
                            Mark as Dispatched
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </PageBackground>
    );
};

export default FarmerOrders;
