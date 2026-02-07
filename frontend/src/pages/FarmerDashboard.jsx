import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    LinearProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    alpha,
    useTheme,
    Snackbar,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    Agriculture,
    CloudUpload,
    Assessment,
    AccountBalance,
    TrendingUp,
    CheckCircle,
    Schedule,
    Warning,
    Add,
    Storefront,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';
import { farmsAPI, loansAPI, creditScoreAPI, listingsAPI, ordersAPI } from '../services/api';

const FarmerDashboard = () => {
    const theme = useTheme();
    const { currentUser } = useUser();

    const [tabValue, setTabValue] = useState(0);
    const [farms, setFarms] = useState([]);
    const [loans, setLoans] = useState([]);
    const [creditScore, setCreditScore] = useState(null);
    const [listings, setListings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Dialogs
    const [imageUploadOpen, setImageUploadOpen] = useState(false);
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [loanDialogOpen, setLoanDialogOpen] = useState(false);
    const [listingDialogOpen, setListingDialogOpen] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [loanAmount, setLoanAmount] = useState('');
    const [newListing, setNewListing] = useState({
        title: '',
        description: '',
        quantity_kg: '',
        price_per_kg: '',
        expected_harvest_date: '',
    });

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]);

    const loadData = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const [farmsRes, loansRes, listingsRes, ordersRes] = await Promise.all([
                farmsAPI.list(currentUser.id),
                loansAPI.list(currentUser.id),
                listingsAPI.myListings(currentUser.id),
                ordersAPI.mySales(currentUser.id),
            ]);

            setFarms(farmsRes.data.results || farmsRes.data);
            setLoans(loansRes.data.results || loansRes.data);
            setListings(listingsRes.data.results || listingsRes.data);
            setOrders(ordersRes.data.results || ordersRes.data);

            // Load credit score
            try {
                const creditRes = await creditScoreAPI.get(currentUser.id);
                setCreditScore(creditRes.data);
            } catch (e) {
                console.log('No credit score available');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedFarm || uploadFiles.length === 0) return;

        try {
            const formData = new FormData();
            uploadFiles.forEach(file => formData.append('images', file));

            await farmsAPI.uploadImages(selectedFarm.id, formData);
            setSnackbar({ open: true, message: 'Images uploaded successfully!', severity: 'success' });
            setImageUploadOpen(false);
            setUploadFiles([]);
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: 'Upload failed', severity: 'error' });
        }
    };

    const handleAssess = async (farm) => {
        try {
            const response = await farmsAPI.assess(farm.id);
            setSnackbar({ open: true, message: 'AI assessment complete!', severity: 'success' });
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.error || 'Assessment failed', severity: 'error' });
        }
    };

    const handleApplyLoan = async () => {
        if (!loanAmount || !selectedFarm) return;

        try {
            const response = await loansAPI.apply({
                borrower: currentUser.id,
                amount_requested: parseFloat(loanAmount),
                term_months: 6,
                assessment_used: selectedFarm.latest_assessment?.id,
            });
            setSnackbar({ open: true, message: 'Loan application submitted!', severity: 'success' });
            setLoanDialogOpen(false);
            setLoanAmount('');
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.error || 'Application failed', severity: 'error' });
        }
    };

    const handleCreateListing = async () => {
        if (!selectedFarm) return;

        try {
            const formData = new FormData();
            formData.append('farmer', currentUser.id);
            formData.append('farm', selectedFarm.id);
            formData.append('title', newListing.title);
            formData.append('description', newListing.description);
            formData.append('crop_type', selectedFarm.current_crop || 'produce');
            formData.append('quantity_kg', newListing.quantity_kg);
            formData.append('price_per_kg', newListing.price_per_kg);
            formData.append('expected_harvest_date', newListing.expected_harvest_date);

            await listingsAPI.create(formData);
            setSnackbar({ open: true, message: 'Listing created!', severity: 'success' });
            setListingDialogOpen(false);
            setNewListing({ title: '', description: '', quantity_kg: '', price_per_kg: '', expected_harvest_date: '' });
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to create listing', severity: 'error' });
        }
    };

    const handleDispatch = async (order) => {
        try {
            await ordersAPI.dispatch(order.id);
            setSnackbar({ open: true, message: 'Order marked as dispatched!', severity: 'success' });
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update order', severity: 'error' });
        }
    };

    const getCreditTierColor = (tier) => {
        const colors = {
            elite: theme.palette.success.main,
            premium: theme.palette.primary.main,
            standard: theme.palette.info.main,
            basic: theme.palette.warning.main,
            ineligible: theme.palette.error.main,
        };
        return colors[tier] || theme.palette.grey[500];
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '80vh' }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Welcome, {currentUser?.full_name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your farms, loans, and marketplace listings
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Agriculture color="primary" />
                                    <Typography variant="subtitle2" color="text.secondary">Farms</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>{farms.length}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <AccountBalance color="secondary" />
                                    <Typography variant="subtitle2" color="text.secondary">Active Loans</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>
                                    {loans.filter(l => l.status === 'active').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Storefront color="info" />
                                    <Typography variant="subtitle2" color="text.secondary">Listings</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>{listings.length}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TrendingUp color="success" />
                                    <Typography variant="subtitle2" color="text.secondary">Credit Score</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>
                                    {creditScore?.total_score || '--'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                        <Tab label="My Farms" icon={<Agriculture />} iconPosition="start" />
                        <Tab label="Loans" icon={<AccountBalance />} iconPosition="start" />
                        <Tab label="Listings" icon={<Storefront />} iconPosition="start" />
                        <Tab label="Orders" icon={<TrendingUp />} iconPosition="start" />
                    </Tabs>
                </Box>

                {/* Farms Tab */}
                {tabValue === 0 && (
                    <Grid container spacing={3}>
                        {farms.map((farm) => (
                            <Grid item xs={12} md={6} key={farm.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" fontWeight={600}>{farm.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {farm.location} • {farm.size_acres} acres
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={farm.current_crop || 'No crop'}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>

                                        {farm.latest_assessment ? (
                                            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2, mb: 2 }}>
                                                <Typography variant="subtitle2" color="success.main" gutterBottom>
                                                    AI Assessment Results
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={4}>
                                                        <Typography variant="caption" color="text.secondary">Health</Typography>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            {Math.round(farm.latest_assessment.health_score * 100)}%
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="caption" color="text.secondary">Yield</Typography>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            {farm.latest_assessment.estimated_yield}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="caption" color="text.secondary">Risk</Typography>
                                                        <Typography variant="h6" fontWeight={600}>
                                                            {farm.latest_assessment.risk_level}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ) : (
                                            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), borderRadius: 2, mb: 2 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    No AI assessment yet. Upload images to get started.
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Button
                                                size="small"
                                                startIcon={<CloudUpload />}
                                                variant="outlined"
                                                onClick={() => {
                                                    setSelectedFarm(farm);
                                                    setImageUploadOpen(true);
                                                }}
                                            >
                                                Upload Images
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<Assessment />}
                                                variant="outlined"
                                                color="success"
                                                onClick={() => handleAssess(farm)}
                                                disabled={farm.image_count === 0}
                                            >
                                                AI Assess
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<AccountBalance />}
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => {
                                                    setSelectedFarm(farm);
                                                    setLoanDialogOpen(true);
                                                }}
                                            >
                                                Apply for Loan
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<Add />}
                                                variant="contained"
                                                onClick={() => {
                                                    setSelectedFarm(farm);
                                                    setListingDialogOpen(true);
                                                }}
                                            >
                                                Create Listing
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Loans Tab */}
                {tabValue === 1 && (
                    <Box>
                        {/* Credit Score Card */}
                        {creditScore && (
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Your Credit Score</Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Typography
                                                    variant="h2"
                                                    fontWeight={800}
                                                    sx={{ color: getCreditTierColor(creditScore.eligibility?.tier) }}
                                                >
                                                    {creditScore.total_score}
                                                </Typography>
                                                <Chip
                                                    label={creditScore.eligibility?.tier?.toUpperCase() || 'N/A'}
                                                    sx={{ bgcolor: getCreditTierColor(creditScore.eligibility?.tier), color: 'white' }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            {creditScore.components && Object.entries(creditScore.components).map(([key, comp]) => (
                                                <Box key={key} sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                        <Typography variant="body2">{comp.description}</Typography>
                                                        <Typography variant="body2" fontWeight={600}>{comp.contribution} pts</Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(comp.score || 0) * 100}
                                                        sx={{ height: 8, borderRadius: 4 }}
                                                    />
                                                </Box>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}

                        {/* Loans List */}
                        {loans.map((loan) => (
                            <Card key={loan.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6">
                                                Loan: KES {Number(loan.amount_approved || loan.amount_requested).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {loan.interest_rate}% interest • {loan.term_months} months
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={loan.status}
                                            color={loan.status === 'active' ? 'success' : loan.status === 'pending' ? 'warning' : 'default'}
                                        />
                                    </Box>

                                    {loan.milestones && (
                                        <Stepper activeStep={loan.current_milestone} alternativeLabel sx={{ mt: 2 }}>
                                            {loan.milestones.map((milestone, index) => (
                                                <Step key={index} completed={milestone.released}>
                                                    <StepLabel>
                                                        <Typography variant="caption">{milestone.name}</Typography>
                                                        <Typography variant="caption" display="block" color="text.secondary">
                                                            {milestone.percentage}%
                                                        </Typography>
                                                    </StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    )}

                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Disbursed</Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                KES {Number(loan.amount_disbursed).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Repaid</Typography>
                                            <Typography variant="body1" fontWeight={600}>
                                                KES {Number(loan.amount_repaid).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Outstanding</Typography>
                                            <Typography variant="body1" fontWeight={600} color="error">
                                                KES {Number(loan.remaining_balance).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                {/* Listings Tab */}
                {tabValue === 2 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Crop</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price/kg</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listings.map((listing) => (
                                    <TableRow key={listing.id}>
                                        <TableCell>{listing.title}</TableCell>
                                        <TableCell>{listing.crop_type}</TableCell>
                                        <TableCell>{listing.quantity_available} kg</TableCell>
                                        <TableCell>KES {listing.price_per_kg}</TableCell>
                                        <TableCell>
                                            <Chip label={listing.status} size="small" color={listing.status === 'active' ? 'success' : 'default'} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Orders Tab */}
                {tabValue === 3 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order</TableCell>
                                    <TableCell>Buyer</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.listing_title}</TableCell>
                                        <TableCell>{order.buyer_name}</TableCell>
                                        <TableCell>KES {Number(order.total_price).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Chip label={order.status} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            {order.status === 'escrow_held' && (
                                                <Button size="small" variant="contained" onClick={() => handleDispatch(order)}>
                                                    Mark Dispatched
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Image Upload Dialog */}
                <Dialog open={imageUploadOpen} onClose={() => setImageUploadOpen(false)}>
                    <DialogTitle>Upload Farm Images</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Upload images of your farm and crops for AI assessment
                        </Typography>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setUploadFiles(Array.from(e.target.files))}
                        />
                        {uploadFiles.length > 0 && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {uploadFiles.length} file(s) selected
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setImageUploadOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleImageUpload}>Upload</Button>
                    </DialogActions>
                </Dialog>

                {/* Loan Dialog */}
                <Dialog open={loanDialogOpen} onClose={() => setLoanDialogOpen(false)}>
                    <DialogTitle>Apply for Loan</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Based on your credit score, you may be eligible for loans up to{' '}
                            <strong>KES {creditScore?.eligibility?.max_amount?.toLocaleString() || 'N/A'}</strong>
                        </Typography>
                        <TextField
                            fullWidth
                            label="Loan Amount (KES)"
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setLoanDialogOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleApplyLoan}>Apply</Button>
                    </DialogActions>
                </Dialog>

                {/* Create Listing Dialog */}
                <Dialog open={listingDialogOpen} onClose={() => setListingDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Create Marketplace Listing</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={newListing.title}
                                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    value={newListing.description}
                                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Quantity (kg)"
                                    type="number"
                                    value={newListing.quantity_kg}
                                    onChange={(e) => setNewListing({ ...newListing, quantity_kg: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Price per kg (KES)"
                                    type="number"
                                    value={newListing.price_per_kg}
                                    onChange={(e) => setNewListing({ ...newListing, price_per_kg: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Expected Harvest Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={newListing.expected_harvest_date}
                                    onChange={(e) => setNewListing({ ...newListing, expected_harvest_date: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setListingDialogOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleCreateListing}>Create Listing</Button>
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

export default FarmerDashboard;
