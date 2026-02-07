import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Chip,
    Divider,
    Avatar,
    Card,
    CardContent,
    Dialog,
    DialogContent,
    IconButton,
    Breadcrumbs,
    Link,
    TextField,
    Skeleton,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Verified,
    LocationOn,
    Visibility,
    CalendarToday,
    LocalShipping,
    ShoppingCart,
    Add,
    Remove,
    ArrowBack,
    Close,
    Star,
    Assessment
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { mockApi } from '../../data/mockApi';
import ProductCard from '../common/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, items } = useCart();

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const data = await mockApi.getProductDetail(id);
                setProduct(data);
                if (data) {
                    const similar = await mockApi.getSimilarProducts(id, data.cropType);
                    setSimilarProducts(similar);
                }
            } catch (error) {
                console.error('Error loading product:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const handleQuantityChange = (delta) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= (product?.quantity || 100)) {
            setQuantity(newQty);
        }
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            productName: product.productName,
            pricePerUnit: product.pricePerUnit,
            unit: product.unit,
            quantity: quantity,
            maxQuantity: product.quantity,
            image: product.images?.[0],
            farmerId: product.farmerId,
            location: product.location
        });
        setSnackbar({ open: true, message: `${quantity} ${product.unit} of ${product.productName} added to cart!` });
    };

    const isInCart = items.some(item => item.id === id);
    const totalPrice = (product?.pricePerUnit || 0) * quantity;

    if (loading) {
        return (
            <Box>
                <Skeleton width={300} height={40} sx={{ mb: 2 }} />
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton height={60} />
                        <Skeleton height={40} width="60%" />
                        <Skeleton height={200} sx={{ mt: 2 }} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box textAlign="center" py={8}>
                <Typography variant="h5">Product not found</Typography>
                <Button onClick={() => navigate('/marketplace')} sx={{ mt: 2 }}>
                    Back to Marketplace
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/marketplace')}
                >
                    Marketplace
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/marketplace?cropType=${product.cropType}`)}
                >
                    {product.cropType}
                </Link>
                <Typography color="text.primary">{product.productName}</Typography>
            </Breadcrumbs>

            <Grid container spacing={4}>
                {/* Images */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {product.healthBadge && (
                            <Chip
                                icon={<Verified sx={{ fontSize: 16 }} />}
                                label={`${Math.round(product.healthBadge * 100)}% Quality Verified`}
                                color="success"
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    zIndex: 1,
                                    fontWeight: 600
                                }}
                            />
                        )}
                        <Box
                            component="img"
                            src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x400'}
                            alt={product.productName}
                            onClick={() => setImageDialogOpen(true)}
                            sx={{
                                width: '100%',
                                height: 400,
                                objectFit: 'cover',
                                borderRadius: 2,
                                cursor: 'zoom-in'
                            }}
                        />

                        {/* Thumbnails */}
                        {product.images?.length > 1 && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
                                {product.images.map((img, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        sx={{
                                            width: 80,
                                            height: 60,
                                            borderRadius: 1,
                                            overflow: 'hidden',
                                            border: selectedImage === index ? 2 : 0,
                                            borderColor: 'primary.main',
                                            cursor: 'pointer',
                                            opacity: selectedImage === index ? 1 : 0.6,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Details */}
                <Grid item xs={12} md={6}>
                    <Typography variant="overline" color="primary" fontWeight={600}>
                        {product.cropType}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {product.productName}
                    </Typography>

                    {/* Meta */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {product.location}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                {product.viewCount} views
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                Listed {product.listedDate}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Price */}
                    <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.light' }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="h3" fontWeight="bold" color="primary.dark">
                                KES {product.pricePerUnit?.toLocaleString()}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                /{product.unit}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {product.quantity?.toLocaleString()} {product.unit} available
                        </Typography>
                    </Paper>

                    {/* Quantity Selector */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                        <Typography fontWeight={500}>Quantity:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                sx={{ border: 1, borderColor: 'divider' }}
                            >
                                <Remove />
                            </IconButton>
                            <TextField
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
                                type="number"
                                size="small"
                                sx={{ width: 80 }}
                                inputProps={{ min: 1, max: product.quantity, style: { textAlign: 'center' } }}
                            />
                            <IconButton
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= product.quantity}
                                sx={{ border: 1, borderColor: 'divider' }}
                            >
                                <Add />
                            </IconButton>
                            <Typography variant="body2" color="text.secondary">
                                {product.unit}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Subtotal */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography fontWeight={500}>Subtotal:</Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                            KES {totalPrice.toLocaleString()}
                        </Typography>
                    </Box>

                    {/* Add to Cart */}
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<ShoppingCart />}
                        onClick={handleAddToCart}
                        sx={{ mb: 2 }}
                    >
                        {isInCart ? 'Add More to Cart' : 'Add to Cart'}
                    </Button>

                    {isInCart && (
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            onClick={() => navigate('/buyer/cart')}
                        >
                            View Cart & Checkout
                        </Button>
                    )}

                    <Divider sx={{ my: 3 }} />

                    {/* Description */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Description
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                        {product.description}
                    </Typography>

                    {/* Delivery Options */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Delivery Options
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {product.deliveryOptions?.map(option => (
                            <Chip
                                key={option}
                                icon={<LocalShipping />}
                                label={option}
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Grid>
            </Grid>

            {/* Assessment Info */}
            {product.assessment && (
                <Paper sx={{ p: 3, mt: 4, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                            <Assessment />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                AI Quality Assessment
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This product has been verified by our AI crop assessment system
                            </Typography>
                        </Box>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">Health Score</Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                {Math.round(product.assessment.healthScore * 100)}%
                            </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">Yield Estimate</Typography>
                            <Typography variant="h6" fontWeight="bold">{product.assessment.yieldEstimate}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">Risk Level</Typography>
                            <Typography variant="h6" fontWeight="bold">{product.assessment.riskLevel}</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">Assessed On</Typography>
                            <Typography variant="h6" fontWeight="bold">{product.assessment.assessmentDate}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Farmer Info */}
            {product.farmer && (
                <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        About the Farmer
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                            src={product.farmer.profileImage}
                            sx={{ width: 64, height: 64 }}
                        />
                        <Box>
                            <Typography fontWeight={600}>{product.farmer.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {product.farmer.location} • Member since {product.farmer.joinDate}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                                <Typography variant="body2" fontWeight={500}>
                                    {product.farmer.creditScore >= 750 ? '4.8' : '4.5'} Rating
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            )}

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Similar Products
                    </Typography>
                    <Grid container spacing={3}>
                        {similarProducts.map(listing => (
                            <Grid item xs={12} sm={6} md={3} key={listing.id}>
                                <ProductCard listing={listing} onAddToCart={() => { }} compact />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Image Dialog */}
            <Dialog
                open={imageDialogOpen}
                onClose={() => setImageDialogOpen(false)}
                maxWidth="lg"
            >
                <IconButton
                    onClick={() => setImageDialogOpen(false)}
                    sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
                >
                    <Close />
                </IconButton>
                <DialogContent sx={{ p: 0 }}>
                    <img
                        src={product.images?.[selectedImage]}
                        alt={product.productName}
                        style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                    />
                </DialogContent>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductDetail;
