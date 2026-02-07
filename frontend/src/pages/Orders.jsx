import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress
} from '@mui/material';
import { ordersAPI } from '../services/api';
import { useUser } from '../context/UserContext';

const Orders = () => {
    const { currentUser } = useUser();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            loadOrders();
        }
    }, [currentUser]);

    const loadOrders = async () => {
        try {
            // Mock API call or real one
            // const response = await ordersAPI.list();
            // setOrders(response.data);

            // MOCK DATA for Interface Demo
            setOrders([
                { id: '1', item: 'Maize - 50kg', total: 15000, status: 'pending_payment', date: '2024-02-10' },
                { id: '2', item: 'Beans - 20kg', total: 8000, status: 'escrow_held', date: '2024-02-08' },
                { id: '3', item: 'Potatoes - 100kg', total: 45000, status: 'completed', date: '2024-01-25' }
            ]);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (orderId) => {
        // TODO: Integrate with backend payment endpoint
        alert(`Initiating Escrow Payment for Order #${orderId}`);
        // await ordersAPI.pay(orderId);
        // loadOrders();
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                My Orders
            </Typography>
            <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Item</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total (KES)</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center"><CircularProgress /></TableCell>
                                </TableRow>
                            ) : orders.map((order) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={order.id}>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{order.item}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.total.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.status.replace('_', ' ')}
                                            color={
                                                order.status === 'completed' ? 'success' :
                                                    order.status === 'pending_payment' ? 'warning' : 'info'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {order.status === 'pending_payment' && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handlePay(order.id)}
                                            >
                                                Pay Now
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default Orders;
