import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
    alpha,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Search,
    FilterList,
    ShoppingCart,
    Verified,
    LocalShipping,
    TrendingUp,
    Warning,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';
import { listingsAPI, cartAPI, ordersAPI } from '../services/api';

const Marketplace = () => {
    const theme = useTheme();
    const { currentUser, currentRole } = useUser();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cropFilter, setCropFilter] = useState('');
    const [cropTypes, setCropTypes] = useState([]);
    const [selectedListing, setSelectedListing] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadListings();
        loadCropTypes();
    }, [cropFilter]);

    const loadListings = async () => {
        try {
            setLoading(true);
            const params = { status: 'active' };
            if (cropFilter) params.crop_type = cropFilter;
            const response = await listingsAPI.list(params);
            setListings(response.data.results || response.data);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCropTypes = async () => {
        try {
            const response = await listingsAPI.cropTypes();
            setCropTypes(response.data);
        } catch (error) {
            console.error('Error loading crop types:', error);
        }
    };

    const handleAddToCart = async (listing) => {
        if (!currentUser) {
            setSnackbar({ open: true, message: 'Please select a user first', severity: 'error' });
            return;
        }

        try {
            await cartAPI.add({
                buyer: currentUser.id,
                listing: listing.id,
                quantity_kg: 10, // Default quantity
            });
            setSnackbar({ open: true, message: 'Added to cart!', severity: 'success' });
        } catch (error) {
            console.error('Error adding to cart:', error);
            setSnackbar({ open: true, message: 'Failed to add to cart', severity: 'error' });
        }
    };

    const handleQuickOrder = async () => {
        if (!selectedListing || !orderQuantity || !currentUser) return;

        try {
            await ordersAPI.create({
                listing: selectedListing.id,
                buyer: currentUser.id,
                quantity_kg: parseFloat(orderQuantity),
                delivery_address: currentUser.location || 'To be confirmed',
            });
            setSnackbar({ open: true, message: 'Order placed! Proceed to payment.', severity: 'success' });
            setSelectedListing(null);
            setOrderQuantity('');
            loadListings();
        } catch (error) {
            console.error('Error creating order:', error);
            setSnackbar({ open: true, message: error.response?.data?.error || 'Order failed', severity: 'error' });
        }
    };

    const getHealthColor = (badge) => {
        if (!badge) return 'default';
        const colors = {
            success: theme.palette.success.main,
            info: theme.palette.info.main,
            warning: theme.palette.warning.main,
            error: theme.palette.error.main,
        };
        return colors[badge.color] || theme.palette.grey[500];
    };

    const filteredListings = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.crop_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '80vh' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Marketplace
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Browse verified produce from trusted farmers with AI-assessed quality
                    </Typography>
                </Box>

                {/* Filters */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search produce..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ flexGrow: 1, minWidth: 200 }}
                    />
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Crop Type</InputLabel>
                        <Select
                            value={cropFilter}
                            label="Crop Type"
                            onChange={(e) => setCropFilter(e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            {cropTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Listings Grid */}
                <Grid container spacing={3}>
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card>
                                    <Skeleton variant="rectangular" height={180} />
                                    <CardContent>
                                        <Skeleton />
                                        <Skeleton width="60%" />
                                        <Skeleton width="40%" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : filteredListings.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No listings found
                                </Typography>
                            </Box>
                        </Grid>
                    ) : (
                        filteredListings.map((listing) => (
                            <Grid item xs={12} sm={6} md={4} key={listing.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Health Badge */}
                                    {listing.health_badge && (
                                        <Chip
                                            icon={<Verified sx={{ fontSize: 16 }} />}
                                            label={listing.health_badge.label}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                zIndex: 1,
                                                bgcolor: getHealthColor(listing.health_badge),
                                                color: 'white',
                                                fontWeight: 600,
                                            }}
                                        />
                                    )}

                                    <CardMedia
                                        component="div"
                                        sx={{
                                            height: 180,
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {listing.cover_image_url ? (
                                            <Box
                                                component="img"
                                                src={listing.cover_image_url}
                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Typography variant="h2" sx={{ opacity: 0.3 }}>
                                                🌾
                                            </Typography>
                                        )}
                                    </CardMedia>

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                                            {listing.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={listing.crop_type}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                            {listing.delivery_available && (
                                                <Chip
                                                    icon={<LocalShipping sx={{ fontSize: 14 }} />}
                                                    label="Delivery"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            by {listing.farmer_name} • {listing.farmer_location}
                                        </Typography>

                                        {listing.assessment && (
                                            <Box sx={{ mb: 2, p: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    AI Assessment
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />
                                                    <Typography variant="body2" fontWeight={500}>
                                                        Health: {Math.round(listing.assessment.health_score * 100)}%
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        | Risk: {listing.assessment.risk_level}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="h5" fontWeight={700} color="primary">
                                                    KES {Number(listing.price_per_kg).toLocaleString()}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    per kg • {Number(listing.quantity_available).toLocaleString()} kg available
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>

                                    <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => {
                                                setSelectedListing(listing);
                                                setOrderQuantity('10');
                                            }}
                                        >
                                            Order Now
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleAddToCart(listing)}
                                        >
                                            <ShoppingCart />
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Order Dialog */}
                <Dialog open={!!selectedListing} onClose={() => setSelectedListing(null)} maxWidth="sm" fullWidth>
                    <DialogTitle>Quick Order</DialogTitle>
                    <DialogContent>
                        {selectedListing && (
                            <Box sx={{ pt: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {selectedListing.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Price: KES {Number(selectedListing.price_per_kg).toLocaleString()} per kg
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Available: {Number(selectedListing.quantity_available).toLocaleString()} kg
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Quantity (kg)"
                                    type="number"
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(e.target.value)}
                                    sx={{ mt: 2 }}
                                    inputProps={{ min: 1, max: selectedListing.quantity_available }}
                                />

                                {orderQuantity && (
                                    <Typography variant="h6" sx={{ mt: 2, color: theme.palette.primary.main }}>
                                        Total: KES {(parseFloat(orderQuantity) * selectedListing.price_per_kg).toLocaleString()}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedListing(null)}>Cancel</Button>
                        <Button variant="contained" onClick={handleQuickOrder}>
                            Place Order
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default Marketplace;
