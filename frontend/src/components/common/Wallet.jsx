import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Chip,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import {
    AccountBalanceWallet,
    Add,
    ArrowUpward,
    ArrowDownward,
    TrendingUp,
    LocalShipping,
    Agriculture,
    MonetizationOn
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { mockApi } from '../../data/mockApi';
import PageBackground from '../layout/PageBackground';

const Wallet = ({ userType = 'buyer' }) => {
    const { user } = useAuth();
    const { balance, addFunds, deductFunds, transactions, refreshBalance } = useWallet();
    const [addFundsDialog, setAddFundsDialog] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddFunds = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        setLoading(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        addFunds(numAmount);
        setLoading(false);
        setAmount('');
        setAddFundsDialog(false);
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit':
                return <ArrowDownward sx={{ color: 'success.main' }} />;
            case 'withdrawal':
                return <ArrowUpward sx={{ color: 'error.main' }} />;
            case 'purchase':
                return <LocalShipping sx={{ color: 'secondary.main' }} />;
            case 'sale':
                return <Agriculture sx={{ color: 'success.main' }} />;
            case 'loan':
                return <MonetizationOn sx={{ color: 'primary.main' }} />;
            default:
                return <AccountBalanceWallet />;
        }
    };

    const getTransactionColor = (type) => {
        switch (type) {
            case 'deposit':
            case 'sale':
                return 'success.main';
            case 'withdrawal':
            case 'purchase':
            case 'loan':
                return 'error.main';
            default:
                return 'text.primary';
        }
    };

    // Mock transaction history
    const mockTransactions = [
        { id: 1, type: 'deposit', description: 'Added funds via M-Pesa', amount: 50000, date: '2024-02-08', balance: balance },
        { id: 2, type: 'purchase', description: 'Order #O001 - Premium White Maize', amount: -22500, date: '2024-02-07', balance: balance - 22500 },
        { id: 3, type: 'deposit', description: 'Added funds via Card', amount: 30000, date: '2024-02-05', balance: balance - 52500 },
        { id: 4, type: 'sale', description: 'Sale of 100kg Wheat', amount: 5500, date: '2024-02-03', balance: balance - 47000 },
        { id: 5, type: 'loan', description: 'Loan repayment - L001', amount: -358.33, date: '2024-02-01', balance: balance - 47358.33 },
    ];

    return (
        <PageBackground type={userType === 'farmer' ? 'farmer' : 'default'}>
            <Box maxWidth="lg" mx="auto">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Wallet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Manage your funds and view transaction history
                </Typography>

                <Grid container spacing={4}>
                    {/* Balance Card */}
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                background: 'green',
                                color: 'white',
                                height: '100%'
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <AccountBalanceWallet sx={{ fontSize: 32 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>Available Balance</Typography>
                                        <Typography variant="h3" fontWeight="bold" sx={{ color: 'white' }}>
                                            KES {balance.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<Add />}
                                    onClick={() => setAddFundsDialog(true)}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        '&:hover': { bgcolor: 'grey.100' }
                                    }}
                                >
                                    Add Funds
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Quick Stats */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={6} md={4}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <ArrowDownward sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="success.main">
                                        KES 80,000
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Total Deposited</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <ArrowUpward sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="secondary.main">
                                        KES 22,858
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <TrendingUp sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                                        5
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Transactions</Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Payment Methods */}
                        <Paper sx={{ p: 3, mt: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Payment Methods
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Chip
                                    avatar={<Avatar sx={{ bgcolor: 'success.main' }}>M</Avatar>}
                                    label="M-Pesa Connected"
                                    variant="outlined"
                                />
                                <Chip
                                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>V</Avatar>}
                                    label="Add Card"
                                    variant="outlined"
                                    sx={{ cursor: 'pointer' }}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Transaction History */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Recent Transactions
                            </Typography>
                            <List>
                                {mockTransactions.map((tx, index) => (
                                    <ListItem
                                        key={tx.id}
                                        divider={index < mockTransactions.length - 1}
                                        sx={{ px: 0 }}
                                    >
                                        <ListItemIcon>
                                            <Avatar sx={{ bgcolor: 'action.hover' }}>
                                                {getTransactionIcon(tx.type)}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={tx.description}
                                            secondary={tx.date}
                                        />
                                        <Box textAlign="right">
                                            <Typography
                                                fontWeight={600}
                                                color={getTransactionColor(tx.type)}
                                            >
                                                {tx.amount > 0 ? '+' : ''}KES {tx.amount.toLocaleString()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Balance: KES {tx.balance.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Add Funds Dialog */}
                <Dialog open={addFundsDialog} onClose={() => setAddFundsDialog(false)} maxWidth="xs" fullWidth>
                    <DialogTitle>Add Funds to Wallet</DialogTitle>
                    <DialogContent>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Enter the amount you want to add to your wallet.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Amount (KES)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>KES</Typography>
                            }}
                            inputProps={{ min: 100 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                            {[1000, 5000, 10000, 25000].map(preset => (
                                <Chip
                                    key={preset}
                                    label={`KES ${preset.toLocaleString()}`}
                                    onClick={() => setAmount(preset.toString())}
                                    variant={amount === preset.toString() ? 'filled' : 'outlined'}
                                    color="primary"
                                />
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setAddFundsDialog(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleAddFunds}
                            disabled={!amount || parseFloat(amount) <= 0 || loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                        >
                            {loading ? 'Processing...' : 'Add Funds'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </PageBackground>
    );
};

export default Wallet;
