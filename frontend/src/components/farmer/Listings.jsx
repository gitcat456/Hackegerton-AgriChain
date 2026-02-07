import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Skeleton,
    Paper
} from '@mui/material';
import {
    Add,
    MoreVert,
    Edit,
    Delete,
    Visibility,
    Verified,
    TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const Listings = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedListing, setSelectedListing] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(false);

    useEffect(() => {
        const loadListings = async () => {
            if (user) {
                setLoading(true);
                const data = await mockApi.getFarmerListings(user.id);
                setListings(data);
                setLoading(false);
            }
        };
        loadListings();
    }, [user]);

    const handleMenuOpen = (event, listing) => {
        setMenuAnchor(event.currentTarget);
        setSelectedListing(listing);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedListing(null);
    };

    const handleDelete = async () => {
        if (selectedListing) {
            await mockApi.deleteListing(selectedListing.id);
            setListings(listings.filter(l => l.id !== selectedListing.id));
        }
        setDeleteDialog(false);
        handleMenuClose();
    };

    const activeListings = listings.filter(l => l.status === 'ACTIVE');
    const soldListings = listings.filter(l => l.status === 'SOLD');
    const totalValue = activeListings.reduce((acc, l) => acc + l.totalPrice, 0);
    const totalViews = listings.reduce((acc, l) => acc + (l.viewCount || 0), 0);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        My Listings
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your marketplace listings
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/farmer/listing/create')}
                >
                    Create Listing
                </Button>
            </Box>

            {/* Summary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Active Listings</Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            {activeListings.length}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Total Value</Typography>
                        <Typography variant="h5" fontWeight="bold">
                            KES {totalValue.toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Sold</Typography>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                            {soldListings.length}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Total Views</Typography>
                        <Typography variant="h4" fontWeight="bold" color="secondary.main">
                            {totalViews}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Listings Grid */}
            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Skeleton height={350} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : listings.length > 0 ? (
                <Grid container spacing={3}>
                    {listings.map(listing => (
                        <Grid item xs={12} sm={6} md={4} key={listing.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={listing.images?.[0] || 'https://via.placeholder.com/400x180'}
                                        alt={listing.productName}
                                    />
                                    {/* Status Badge */}
                                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                                        <StatusBadge status={listing.status} />
                                    </Box>
                                    {/* Quality Badge */}
                                    {listing.healthBadge && (
                                        <Chip
                                            icon={<Verified sx={{ fontSize: 14 }} />}
                                            label={`${Math.round(listing.healthBadge * 100)}%`}
                                            color="success"
                                            size="small"
                                            sx={{ position: 'absolute', top: 12, right: 12 }}
                                        />
                                    )}
                                    {/* Menu Button */}
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            bgcolor: 'white',
                                            '&:hover': { bgcolor: 'grey.100' }
                                        }}
                                        onClick={(e) => handleMenuOpen(e, listing)}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </Box>

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" fontWeight="bold" noWrap>
                                        {listing.productName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {listing.location} • {listing.listedDate}
                                    </Typography>

                                    <Box sx={{ my: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">Price</Typography>
                                            <Typography fontWeight={600} color="primary">
                                                KES {listing.pricePerUnit}/{listing.unit}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">Quantity</Typography>
                                            <Typography fontWeight={500}>
                                                {listing.quantity} {listing.unit}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Total Value</Typography>
                                            <Typography fontWeight={600}>
                                                KES {listing.totalPrice?.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Views */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {listing.viewCount || 0} views
                                        </Typography>
                                    </Box>
                                </CardContent>

                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => navigate(`/marketplace/product/${listing.id}`)}
                                    >
                                        View in Marketplace
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyState
                    variant="listings"
                    title="No listings yet"
                    message="Create your first listing to start selling your produce directly to buyers."
                    action={() => navigate('/farmer/listing/create')}
                    actionLabel="Create Listing"
                />
            )}

            {/* Actions Menu */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    navigate(`/marketplace/product/${selectedListing?.id}`);
                    handleMenuClose();
                }}>
                    <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
                    <ListItemText>View</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    // Navigate to edit (would create an edit page)
                    handleMenuClose();
                }}>
                    <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => setDeleteDialog(true)}
                    sx={{ color: 'error.main' }}
                >
                    <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
                <DialogTitle>Delete Listing?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{selectedListing?.productName}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Listings;
