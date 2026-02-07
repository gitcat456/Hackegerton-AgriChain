import { Box, Typography, Button, Paper } from '@mui/material';
import {
    ShoppingCart,
    Assignment,
    Inventory,
    SearchOff,
    SentimentDissatisfied
} from '@mui/icons-material';

/**
 * Empty State component for when there's no data to display
 */
const EmptyState = ({
    title = 'No items found',
    message,
    icon,
    action,
    actionLabel,
    variant = 'default' // 'default', 'cart', 'search', 'listings', 'orders'
}) => {
    const variants = {
        default: {
            icon: <SentimentDissatisfied sx={{ fontSize: 80, color: 'text.disabled' }} />,
            defaultMessage: 'There\'s nothing here yet.',
        },
        cart: {
            icon: <ShoppingCart sx={{ fontSize: 80, color: 'text.disabled' }} />,
            defaultMessage: 'Your cart is empty. Browse the marketplace to find fresh produce.',
        },
        search: {
            icon: <SearchOff sx={{ fontSize: 80, color: 'text.disabled' }} />,
            defaultMessage: 'No results found. Try adjusting your search or filters.',
        },
        listings: {
            icon: <Inventory sx={{ fontSize: 80, color: 'text.disabled' }} />,
            defaultMessage: 'You haven\'t created any listings yet.',
        },
        orders: {
            icon: <Assignment sx={{ fontSize: 80, color: 'text.disabled' }} />,
            defaultMessage: 'No orders to display.',
        },
    };

    const config = variants[variant] || variants.default;
    const displayIcon = icon || config.icon;
    const displayMessage = message || config.defaultMessage;

    return (
        <Paper
            elevation={0}
            sx={{
                py: 8,
                px: 4,
                textAlign: 'center',
                bgcolor: 'transparent',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    {displayIcon}
                </Box>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="text.primary"
                >
                    {title}
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 400 }}
                >
                    {displayMessage}
                </Typography>

                {action && actionLabel && (
                    <Button
                        variant="contained"
                        onClick={action}
                        sx={{ mt: 2 }}
                    >
                        {actionLabel}
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default EmptyState;
