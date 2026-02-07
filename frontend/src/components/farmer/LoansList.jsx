
import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, LinearProgress
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const LoansList = () => {
    const { user } = useAuth();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoans = async () => {
            if (user) {
                const data = await mockApi.getLoans(user.id);
                setLoans(data);
                setLoading(false);
            }
        };
        fetchLoans();
    }, [user]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">My Loans</Typography>
                <Button variant="contained" startIcon={<Add />}>Apply for Loan</Button>
            </Box>

            {loading ? (
                <LinearProgress />
            ) : loans.length === 0 ? (
                <EmptyState title="No Loans Found" message="You haven't applied for any loans yet." />
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Interest</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Next Payment</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loans.map((loan) => (
                                <TableRow key={loan.id}>
                                    <TableCell>{loan.id}</TableCell>
                                    <TableCell fontWeight="bold">KES {loan.amount.toLocaleString()}</TableCell>
                                    <TableCell>{loan.interestRate}%</TableCell>
                                    <TableCell>{loan.duration}</TableCell>
                                    <TableCell><StatusBadge status={loan.status} /></TableCell>
                                    <TableCell>{loan.dueDate || '-'}</TableCell>
                                    <TableCell>
                                        <Button size="small" variant="outlined" disabled={loan.status !== 'ACTIVE'}>
                                            Repay
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default LoansList;
