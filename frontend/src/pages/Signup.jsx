import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid
} from '@mui/material';

import { usersAPI } from '../services/api';
import { useUser } from '../context/UserContext';

const Signup = () => {
    const navigate = useNavigate();
    const { loadUsers } = useUser();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        role: 'farmer', // default
        farm_name: '', // only for farmer
        location: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Prepare data for API
            const apiData = {
                ...formData,
                is_farmer: formData.role === 'farmer',
                is_buyer: formData.role === 'buyer',
                password: formData.password
            };

            await usersAPI.create(apiData);
            await loadUsers(); // Refresh user list
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError('Failed to create account. Email may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Join AgriChain
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="full_name"
                                    label="Full Name"
                                    name="full_name"
                                    autoComplete="name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    name="phone"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">I am a:</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="farmer" control={<Radio color="primary" />} label="Farmer" />
                                        <FormControlLabel value="buyer" control={<Radio color="primary" />} label="Buyer" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {formData.role === 'farmer' && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            required={formData.role === 'farmer'}
                                            fullWidth
                                            id="farm_name"
                                            label="Farm Name"
                                            name="farm_name"
                                            value={formData.farm_name}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="location"
                                    label={formData.role === 'farmer' ? "Farm Location" : "Location"}
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: '#2e7d32', textDecoration: 'none', fontWeight: 600 }}>
                                    Log In
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Signup;
