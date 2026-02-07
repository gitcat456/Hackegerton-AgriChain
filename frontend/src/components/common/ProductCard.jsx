import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Verified,
    AddShoppingCart,
    Visibility,
    LocationOn,
    FavoriteBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Product Card component for marketplace listings
 */
const ProductCard = ({
    listing,
    onAddToCart,
    showActions = true,
    compact = false
}) => {
    const navigate = useNavigate();

    const handleViewDetail = () => {
        navigate(`/marketplace/product/${listing.id}`);
    };

    const isPremium = listing.healthBadge && listing.healthBadge >= 0.80;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                '&:hover .product-image': {
                    transform: 'scale(1.05)',
                },
                '&:hover .quick-actions': {
                    opacity: 1,
                },
            }}
            onClick={handleViewDetail}
        >
            {/* Premium Badge */}
            {isPremium && (
                <Chip
                    icon={<Verified sx={{ fontSize: 14 }} />}
                    label={`${Math.round(listing.healthBadge * 100)}% Quality`}
                    color="success"
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        fontWeight: 600,
                        bgcolor: 'rgba(46, 125, 50, 0.95)',
                        color: 'white',
                        '& .MuiChip-icon': { color: 'white' },
                    }}
                />
            )}

            {/* Quick Actions Overlay */}
            <Box
                className="quick-actions"
                sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    zIndex: 2,
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                }}
            >
                <Tooltip title="Save for later">
                    <IconButton
                        size="small"
                        sx={{
                            bgcolor: 'white',
                            boxShadow: 2,
                            '&:hover': { bgcolor: 'grey.100' },
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle save action
                        }}
                    >
                        <FavoriteBorder fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Product Image */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height={compact ? 140 : 180}
                    image={listing.images?.[0] || 'https://via.placeholder.com/400x300?text=Product'}
                    alt={listing.productName}
                    className="product-image"
                    sx={{
                        transition: 'transform 0.3s ease-in-out',
                        objectFit: 'cover',
                    }}
                />
            </Box>

            {/* Content */}
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    noWrap
                    sx={{ mb: 0.5 }}
                >
                    {listing.productName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                        {listing.location}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                        KES {listing.pricePerUnit?.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        /{listing.unit}
                    </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                    {listing.quantity?.toLocaleString()} {listing.unit} available
                </Typography>

                {listing.viewCount > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <Visibility sx={{ fontSize: 12, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                            {listing.viewCount} views
                        </Typography>
                    </Box>
                )}
            </CardContent>

            {/* Actions */}
            {showActions && (
                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<AddShoppingCart />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.(listing);
                        }}
                        size={compact ? 'small' : 'medium'}
                    >
                        Add to Cart
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

export default ProductCard;
