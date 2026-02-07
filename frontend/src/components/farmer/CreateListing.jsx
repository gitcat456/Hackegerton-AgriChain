import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    Card,
    CardContent,
    IconButton,
    Chip,
    Alert,
    Divider,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    CheckCircle,
    Verified,
    Add,
    Storefront
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import { cropTypes } from '../../data/mockListings';

const CreateListing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [images, setImages] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState(location.state?.assessment || null);
    const [submitting, setSubmitting] = useState(false);
    const [successDialog, setSuccessDialog] = useState(false);
    const [listingResult, setListingResult] = useState(null);

    const { control, watch, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            productName: '',
            cropType: selectedAssessment?.cropType || 'Maize',
            quantity: 100,
            unit: 'kg',
            pricePerUnit: 50,
            description: '',
            location: user?.location || '',
            deliveryPickup: true,
            deliveryLocal: false,
            deliveryNational: false
        }
    });

    const watchQuantity = watch('quantity');
    const watchPrice = watch('pricePerUnit');
    const totalPrice = watchQuantity * watchPrice;

    useEffect(() => {
        const loadAssessments = async () => {
            if (user) {
                const data = await mockApi.getCropAssessments(user.id);
                setAssessments(data);
            }
        };
        loadAssessments();
    }, [user]);

    // Pre-fill from assessment if provided
    useEffect(() => {
        if (selectedAssessment) {
            setValue('cropType', selectedAssessment.cropType);
            setValue('productName', `Premium ${selectedAssessment.cropType.charAt(0).toUpperCase() + selectedAssessment.cropType.slice(1)}`);
        }
    }, [selectedAssessment, setValue]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages([...images, ...newImages]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const deliveryOptions = [];
            if (data.deliveryPickup) deliveryOptions.push('Pickup');
            if (data.deliveryLocal) deliveryOptions.push('Local Delivery');
            if (data.deliveryNational) deliveryOptions.push('Nationwide Shipping');

            const result = await mockApi.createListing({
                farmerId: user.id,
                productName: data.productName,
                cropType: data.cropType,
                quantity: data.quantity,
                unit: data.unit,
                pricePerUnit: data.pricePerUnit,
                description: data.description,
                location: data.location,
                assessmentId: selectedAssessment?.id,
                healthBadge: selectedAssessment?.healthScore,
                images: images.length > 0 ? images.map(i => i.preview) : undefined,
                deliveryOptions
            });

            setListingResult(result);
            setSuccessDialog(true);
        } catch (error) {
            console.error('Create listing error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box maxWidth="lg" mx="auto">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Create Marketplace Listing
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                List your produce on the marketplace and connect with buyers directly
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    {/* Left Column - Form */}
                    <Grid item xs={12} md={8}>
                        {/* Product Information */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Product Information
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="productName"
                                        control={control}
                                        rules={{ required: 'Product name is required' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Product Name"
                                                fullWidth
                                                error={!!errors.productName}
                                                helperText={errors.productName?.message}
                                                placeholder="e.g., Premium White Maize"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="cropType"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Crop Type"
                                                fullWidth
                                            >
                                                {cropTypes.map(type => (
                                                    <MenuItem key={type} value={type}>{type}</MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6} md={3}>
                                    <Controller
                                        name="quantity"
                                        control={control}
                                        rules={{ required: true, min: 1 }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                label="Quantity"
                                                fullWidth
                                                InputProps={{ inputProps: { min: 1 } }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6} md={3}>
                                    <Controller
                                        name="unit"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Unit"
                                                fullWidth
                                            >
                                                <MenuItem value="kg">Kilograms (kg)</MenuItem>
                                                <MenuItem value="tons">Tons</MenuItem>
                                                <MenuItem value="bags">Bags (90kg)</MenuItem>
                                            </TextField>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="pricePerUnit"
                                        control={control}
                                        rules={{ required: true, min: 1 }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                label="Price per Unit (KES)"
                                                fullWidth
                                                InputProps={{ inputProps: { min: 1 } }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Controller
                                        name="location"
                                        control={control}
                                        rules={{ required: 'Location is required' }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Location"
                                                fullWidth
                                                error={!!errors.location}
                                                helperText={errors.location?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Description"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                placeholder="Describe your product quality, growing conditions, etc."
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Quality Verification */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Quality Verification (Optional)
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Link an AI assessment to display a quality badge on your listing
                            </Typography>

                            {assessments.length > 0 ? (
                                <Grid container spacing={2}>
                                    {assessments.slice(0, 4).map((assessment) => (
                                        <Grid item xs={12} sm={6} key={assessment.id}>
                                            <Card
                                                variant={selectedAssessment?.id === assessment.id ? 'elevation' : 'outlined'}
                                                sx={{
                                                    cursor: 'pointer',
                                                    border: selectedAssessment?.id === assessment.id ? 2 : 1,
                                                    borderColor: selectedAssessment?.id === assessment.id ? 'primary.main' : 'divider',
                                                    transition: 'all 0.2s'
                                                }}
                                                onClick={() => setSelectedAssessment(
                                                    selectedAssessment?.id === assessment.id ? null : assessment
                                                )}
                                            >
                                                <CardContent sx={{ py: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box>
                                                            <Typography fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                                                                {assessment.cropType}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {assessment.assessmentDate}
                                                            </Typography>
                                                        </Box>
                                                        <Chip
                                                            icon={<Verified sx={{ fontSize: 14 }} />}
                                                            label={`${Math.round(assessment.healthScore * 100)}%`}
                                                            color="success"
                                                            size="small"
                                                        />
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Alert severity="info">
                                    No assessments available. <Button size="small" onClick={() => navigate('/farmer/upload-assessment')}>Upload crops first</Button>
                                </Alert>
                            )}
                        </Paper>

                        {/* Product Images */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Product Images
                            </Typography>

                            <Box
                                sx={{
                                    border: '2px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    bgcolor: 'action.hover',
                                    mb: 2
                                }}
                            >
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                    multiple
                                    type="file"
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="image-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        startIcon={<CloudUpload />}
                                    >
                                        Upload Images
                                    </Button>
                                </label>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }} color="text.secondary">
                                    JPG, PNG up to 5MB. You can upload multiple images.
                                </Typography>
                            </Box>

                            {images.length > 0 && (
                                <Grid container spacing={2}>
                                    {images.map((img, index) => (
                                        <Grid item xs={4} md={3} key={index}>
                                            <Box position="relative">
                                                <img
                                                    src={img.preview}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: 100,
                                                        objectFit: 'cover',
                                                        borderRadius: 8
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeImage(index)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        bgcolor: 'rgba(255,255,255,0.9)'
                                                    }}
                                                >
                                                    <Delete fontSize="small" color="error" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Paper>

                        {/* Delivery Options */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Delivery Options
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Controller
                                    name="deliveryPickup"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox {...field} checked={field.value} />}
                                            label="Pickup Available"
                                        />
                                    )}
                                />
                                <Controller
                                    name="deliveryLocal"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox {...field} checked={field.value} />}
                                            label="Local Delivery"
                                        />
                                    )}
                                />
                                <Controller
                                    name="deliveryNational"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Checkbox {...field} checked={field.value} />}
                                            label="Nationwide Shipping"
                                        />
                                    )}
                                />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column - Preview */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Listing Preview
                            </Typography>

                            <Card variant="outlined" sx={{ mb: 3 }}>
                                <Box
                                    sx={{
                                        height: 150,
                                        bgcolor: 'grey.200',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative'
                                    }}
                                >
                                    {images.length > 0 ? (
                                        <img
                                            src={images[0].preview}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Storefront sx={{ fontSize: 48, color: 'grey.400' }} />
                                    )}
                                    {selectedAssessment && (
                                        <Chip
                                            icon={<Verified sx={{ fontSize: 14 }} />}
                                            label={`${Math.round(selectedAssessment.healthScore * 100)}% Quality`}
                                            color="success"
                                            size="small"
                                            sx={{ position: 'absolute', top: 8, right: 8 }}
                                        />
                                    )}
                                </Box>
                                <CardContent>
                                    <Typography fontWeight={600}>
                                        {watch('productName') || 'Product Name'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {watch('location') || 'Location'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 1 }}>
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            KES {watchPrice.toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            /{watch('unit')}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">Quantity</Typography>
                                    <Typography fontWeight={500}>{watchQuantity} {watch('unit')}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography color="text.secondary">Price per unit</Typography>
                                    <Typography fontWeight={500}>KES {watchPrice}</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography fontWeight={600}>Total Value</Typography>
                                    <Typography variant="h6" color="primary" fontWeight="bold">
                                        KES {totalPrice.toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={submitting}
                                startIcon={submitting ? <CircularProgress size={20} /> : <Add />}
                            >
                                {submitting ? 'Publishing...' : 'Publish Listing'}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </form>

            {/* Success Dialog */}
            <Dialog open={successDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                    <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold">
                        Listing Published!
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Your product is now live on the marketplace and visible to buyers.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                    <Button variant="outlined" onClick={() => navigate('/marketplace')}>
                        View in Marketplace
                    </Button>
                    <Button variant="contained" onClick={() => navigate('/farmer/listings')}>
                        Manage Listings
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreateListing;
