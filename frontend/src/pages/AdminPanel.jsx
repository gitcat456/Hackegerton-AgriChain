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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    alpha,
    useTheme,
    Snackbar,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import {
    AdminPanelSettings,
    CheckCircle,
    Cancel,
    AccountBalance,
    People,
    Storefront,
    TrendingUp,
} from '@mui/icons-material';
import { useUser } from '../context/UserContext';
import { loansAPI, usersAPI, poolsAPI, ordersAPI } from '../services/api';

const AdminPanel = () => {
    const theme = useTheme();
    const { currentUser } = useUser();

    const [tabValue, setTabValue] = useState(0);
    const [pendingLoans, setPendingLoans] = useState([]);
    const [allLoans, setAllLoans] = useState([]);
    const [users, setUsers] = useState([]);
    const [pools, setPools] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [selectedLoan, setSelectedLoan] = useState(null);
    const [approvalNotes, setApprovalNotes] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [pendingRes, usersRes, poolsRes, ordersRes, allLoansRes] = await Promise.all([
                loansAPI.pending(),
                usersAPI.list(),
                poolsAPI.list(),
                ordersAPI.list({}),
                loansAPI.list(),
            ]);

            setPendingLoans(pendingRes.data.results || pendingRes.data);
            setUsers(usersRes.data.results || usersRes.data);
            setPools(poolsRes.data.results || poolsRes.data);
            setOrders(ordersRes.data.results || ordersRes.data);
            setAllLoans(allLoansRes.data.results || allLoansRes.data);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveLoan = async () => {
        if (!selectedLoan) return;

        try {
            await loansAPI.approve(selectedLoan.id, { notes: approvalNotes });
            setSnackbar({ open: true, message: 'Loan approved successfully!', severity: 'success' });
            setSelectedLoan(null);
            setApprovalNotes('');
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.error || 'Approval failed', severity: 'error' });
        }
    };

    const handleRejectLoan = async (loan) => {
        try {
            await loansAPI.reject(loan.id, 'Does not meet criteria');
            setSnackbar({ open: true, message: 'Loan rejected', severity: 'info' });
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: 'Rejection failed', severity: 'error' });
        }
    };

    const handleReleaseMilestone = async (loan) => {
        try {
            const response = await loansAPI.releaseMilestone(loan.id);
            setSnackbar({ open: true, message: `Released: ${response.data.message}`, severity: 'success' });
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.error || 'Release failed', severity: 'error' });
        }
    };

    const handleRefundOrder = async (order) => {
        try {
            await ordersAPI.refund(order.id);
            setSnackbar({ open: true, message: 'Order refunded', severity: 'success' });
            loadData();
        } catch (error) {
            setSnackbar({ open: true, message: 'Refund failed', severity: 'error' });
        }
    };

    // Stats
    const stats = {
        totalUsers: users.length,
        totalFarmers: users.filter(u => u.is_farmer).length,
        totalBuyers: users.filter(u => u.is_buyer).length,
        pendingLoans: pendingLoans.length,
        activeLoans: allLoans.filter(l => l.status === 'active').length,
        totalDisbursed: allLoans.reduce((sum, l) => sum + parseFloat(l.amount_disbursed || 0), 0),
        poolBalance: pools[0]?.available_balance || 0,
        activeOrders: orders.filter(o => !['completed', 'refunded', 'cancelled'].includes(o.status)).length,
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
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AdminPanelSettings sx={{ fontSize: 40, color: theme.palette.info.main }} />
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Admin Panel
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage loans, users, and platform operations
                        </Typography>
                    </Box>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <People color="primary" />
                                    <Typography variant="subtitle2">Users</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>{stats.totalUsers}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {stats.totalFarmers} farmers, {stats.totalBuyers} buyers
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <AccountBalance color="warning" />
                                    <Typography variant="subtitle2">Pending Loans</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>{stats.pendingLoans}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <TrendingUp color="success" />
                                    <Typography variant="subtitle2">Total Disbursed</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>
                                    KES {stats.totalDisbursed.toLocaleString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Storefront color="info" />
                                    <Typography variant="subtitle2">Active Orders</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight={700}>{stats.activeOrders}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                        <Tab label={`Pending Approvals (${pendingLoans.length})`} />
                        <Tab label="Active Loans" />
                        <Tab label="Disputed Orders" />
                        <Tab label="Users" />
                    </Tabs>
                </Box>

                {/* Pending Approvals */}
                {tabValue === 0 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Borrower</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Credit Score</TableCell>
                                    <TableCell>Crop Assessment</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingLoans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography color="text.secondary" py={3}>
                                                No pending loan applications
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingLoans.map((loan) => (
                                        <TableRow key={loan.id}>
                                            <TableCell>
                                                <Typography fontWeight={600}>{loan.borrower_name}</Typography>
                                            </TableCell>
                                            <TableCell>KES {Number(loan.amount_requested).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={loan.credit_score_at_application}
                                                    color={loan.credit_score_at_application >= 70 ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {loan.assessment_used ? 'Available' : 'None'}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<CheckCircle />}
                                                    onClick={() => setSelectedLoan(loan)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Cancel />}
                                                    onClick={() => handleRejectLoan(loan)}
                                                >
                                                    Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Active Loans */}
                {tabValue === 1 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Borrower</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Disbursed</TableCell>
                                    <TableCell>Milestone</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allLoans.filter(l => l.status === 'active' || l.status === 'approved').map((loan) => (
                                    <TableRow key={loan.id}>
                                        <TableCell>{loan.borrower_name}</TableCell>
                                        <TableCell>KES {Number(loan.amount_approved).toLocaleString()}</TableCell>
                                        <TableCell>KES {Number(loan.amount_disbursed).toLocaleString()}</TableCell>
                                        <TableCell>
                                            {loan.milestones?.[loan.current_milestone]?.name || 'Completed'}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleReleaseMilestone(loan)}
                                                disabled={loan.current_milestone >= (loan.milestones?.length || 0)}
                                            >
                                                Release Next Milestone
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Disputed Orders */}
                {tabValue === 2 && (
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
                                {orders.filter(o => o.status === 'disputed').length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography color="text.secondary" py={3}>
                                                No disputed orders
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.filter(o => o.status === 'disputed').map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>{order.listing_title}</TableCell>
                                            <TableCell>{order.buyer_name}</TableCell>
                                            <TableCell>KES {Number(order.total_price).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Chip label={order.status} color="error" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => handleRefundOrder(order)}
                                                >
                                                    Refund Buyer
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Users */}
                {tabValue === 3 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Wallet Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.full_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.is_farmer && <Chip label="Farmer" size="small" color="primary" sx={{ mr: 0.5 }} />}
                                            {user.is_buyer && <Chip label="Buyer" size="small" color="secondary" sx={{ mr: 0.5 }} />}
                                            {user.is_admin && <Chip label="Admin" size="small" color="info" />}
                                        </TableCell>
                                        <TableCell>{user.location || '-'}</TableCell>
                                        <TableCell>KES {user.wallet ? Number(user.wallet.balance).toLocaleString() : '0'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Approval Dialog */}
                <Dialog open={!!selectedLoan} onClose={() => setSelectedLoan(null)}>
                    <DialogTitle>Approve Loan</DialogTitle>
                    <DialogContent>
                        {selectedLoan && (
                            <Box>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Borrower:</strong> {selectedLoan.borrower_name}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Amount:</strong> KES {Number(selectedLoan.amount_requested).toLocaleString()}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>Credit Score:</strong> {selectedLoan.credit_score_at_application}
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Admin Notes (optional)"
                                    value={approvalNotes}
                                    onChange={(e) => setApprovalNotes(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedLoan(null)}>Cancel</Button>
                        <Button variant="contained" color="success" onClick={handleApproveLoan}>
                            Approve Loan
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
};

export default AdminPanel;
