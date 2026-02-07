import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Slider,
    Chip,
    Button,
    Paper,
    Drawer,
    IconButton,
    useMediaQuery,
    useTheme,
    Skeleton,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Search,
    FilterList,
    Close,
    Verified,
    SortRounded
} from '@mui/icons-material';
import ProductCard from '../common/ProductCard';
import EmptyState from '../common/EmptyState';
import { useCart } from '../../contexts/CartContext';
import { mockApi } from '../../data/mockApi';
import { cropTypes } from '../../data/mockListings';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'health_score', label: 'Quality Score' }
];

const Marketplace = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { addToCart } = useCart();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    // Filters
    const [search, setSearch] = useState('');
    const [cropType, setCropType] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [sortBy, setSortBy] = useState('newest');
    const [qualityVerified, setQualityVerified] = useState(false);

    useEffect(() => {
        fetchListings();
    }, [cropType, sortBy, qualityVerified]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            const data = await mockApi.getMarketplaceListings({
                cropType: cropType !== 'All' ? cropType : undefined,
                sortBy,
                minHealthScore: qualityVerified ? 0.75 : undefined
            });
            setListings(data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Apply client-side filters
    const filteredListings = listings.filter(listing => {
        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            if (!listing.productName.toLowerCase().includes(searchLower) &&
                !listing.cropType.toLowerCase().includes(searchLower) &&
                !listing.location.toLowerCase().includes(searchLower)) {
                return false;
            }
        }

        // Price filter
        if (listing.pricePerUnit < priceRange[0] || listing.pricePerUnit > priceRange[1]) {
            return false;
        }

        return true;
    });

    const handleAddToCart = (listing) => {
        addToCart({
            id: listing.id,
            productName: listing.productName,
            pricePerUnit: listing.pricePerUnit,
            unit: listing.unit,
            quantity: 1,
            maxQuantity: listing.quantity,
            image: listing.images?.[0],
            farmerId: listing.farmerId,
            location: listing.location
        });
        setSnackbar({ open: true, message: `${listing.productName} added to cart!` });
    };

    const FilterPanel = () => (
        <Box sx={{ p: isMobile ? 3 : 0 }}>
            {isMobile && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Filters</Typography>
                    <IconButton onClick={() => setFilterDrawerOpen(false)}>
                        <Close />
                    </IconButton>
                </Box>
            )}

            {/* Crop Type */}
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Crop Type</InputLabel>
                <Select
                    value={cropType}
                    label="Crop Type"
                    onChange={(e) => setCropType(e.target.value)}
                >
                    <MenuItem value="All">All Types</MenuItem>
                    {cropTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                    Price Range (KES/unit)
                </Typography>
                <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={200}
                    marks={[
                        { value: 0, label: '0' },
                        { value: 100, label: '100' },
                        { value: 200, label: '200' }
                    ]}
                />
            </Box>

            {/* Quality Verified */}
            <Box sx={{ mb: 3 }}>
                <Chip
                    icon={<Verified />}
                    label="Quality Verified Only"
                    color={qualityVerified ? 'success' : 'default'}
                    variant={qualityVerified ? 'filled' : 'outlined'}
                    onClick={() => setQualityVerified(!qualityVerified)}
                    sx={{ cursor: 'pointer' }}
                />
            </Box>

            {isMobile && (
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setFilterDrawerOpen(false)}
                >
                    Apply Filters
                </Button>
            )}
        </Box>
    );

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Marketplace
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Browse verified produce directly from farmers
                </Typography>
            </Box>

            {/* Search and Sort Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Search products, crops, or locations..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => setSortBy(e.target.value)}
                                startAdornment={<SortRounded sx={{ mr: 1, color: 'text.secondary' }} />}
                            >
                                {SORT_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        {isMobile ? (
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<FilterList />}
                                onClick={() => setFilterDrawerOpen(true)}
                            >
                                Filters
                            </Button>
                        ) : (
                            <FormControl fullWidth size="small">
                                <InputLabel>Crop Type</InputLabel>
                                <Select
                                    value={cropType}
                                    label="Crop Type"
                                    onChange={(e) => setCropType(e.target.value)}
                                >
                                    <MenuItem value="All">All Types</MenuItem>
                                    {cropTypes.map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Active Filters */}
            {(cropType !== 'All' || qualityVerified || search) && (
                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    {cropType !== 'All' && (
                        <Chip
                            label={cropType}
                            onDelete={() => setCropType('All')}
                            color="primary"
                            variant="outlined"
                        />
                    )}
                    {qualityVerified && (
                        <Chip
                            icon={<Verified />}
                            label="Quality Verified"
                            onDelete={() => setQualityVerified(false)}
                            color="success"
                            variant="outlined"
                        />
                    )}
                    {search && (
                        <Chip
                            label={`"${search}"`}
                            onDelete={() => setSearch('')}
                            variant="outlined"
                        />
                    )}
                </Box>
            )}

            {/* Main Content */}
            <Grid container spacing={3}>
                {/* Desktop Filter Sidebar */}
                {!isMobile && (
                    <Grid item md={3}>
                        <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Filters
                            </Typography>
                            <FilterPanel />
                        </Paper>
                    </Grid>
                )}

                {/* Products Grid */}
                <Grid item xs={12} md={isMobile ? 12 : 9}>
                    {loading ? (
                        <Grid container spacing={3}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <Grid item xs={12} sm={6} lg={4} key={i}>
                                    <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : filteredListings.length > 0 ? (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Showing {filteredListings.length} product{filteredListings.length !== 1 ? 's' : ''}
                            </Typography>
                            <Grid container spacing={3}>
                                {filteredListings.map(listing => (
                                    <Grid item xs={12} sm={6} lg={4} key={listing.id}>
                                        <ProductCard
                                            listing={listing}
                                            onAddToCart={handleAddToCart}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    ) : (
                        <EmptyState
                            variant="search"
                            title="No products found"
                            message="Try adjusting your filters or search terms to find what you're looking for."
                            action={() => {
                                setSearch('');
                                setCropType('All');
                                setQualityVerified(false);
                                setPriceRange([0, 200]);
                            }}
                            actionLabel="Clear Filters"
                        />
                    )}
                </Grid>
            </Grid>

            {/* Mobile Filter Drawer */}
            <Drawer
                anchor="right"
                open={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                PaperProps={{ sx: { width: 300 } }}
            >
                <FilterPanel />
            </Drawer>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity="success"
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Marketplace;
