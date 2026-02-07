
import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Grid, Card, CardMedia, CardContent, CardActions
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const ListingsManagement = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            if (user) {
                const data = await mockApi.getFarmerListings(user.id);
                setListings(data);
                setLoading(false);
            }
        };
        fetchListings();
    }, [user]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">My Listings</Typography>
                <Button variant="contained" startIcon={<Add />}>Create New Listing</Button>
            </Box>

            {listings.length === 0 && !loading ? (
                <EmptyState title="No Active Listings" message="Start selling your produce directly to buyers." />
            ) : (
                <Grid container spacing={3}>
                    {listings.map((listing) => (
                        <Grid item xs={12} sm={6} md={4} key={listing.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={listing.images[0]}
                                    alt={listing.productName}
                                />
                                <CardContent>
                                    <Typography variant="h6" noWrap>{listing.productName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {listing.quantity} {listing.unit} • KES {listing.pricePerUnit}/{listing.unit}
                                    </Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <StatusBadge status={listing.status} />
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" startIcon={<Edit />}>Edit</Button>
                                    <Button size="small" color="error" startIcon={<Delete />}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ListingsManagement;
