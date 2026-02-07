import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

/**
 * Loading Spinner component with optional overlay mode
 */
const LoadingSpinner = ({
    message = 'Loading...',
    overlay = false,
    size = 40,
    fullScreen = false
}) => {
    const content = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                p: 4,
                minHeight: fullScreen ? '100vh' : 'auto',
            }}
        >
            <CircularProgress
                size={size}
                thickness={4}
                sx={{
                    color: 'primary.main',
                    '& .MuiCircularProgress-circle': {
                        strokeLinecap: 'round',
                    },
                }}
            />
            {message && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );

    if (overlay) {
        return (
            <Backdrop
                open={true}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
            >
                {content}
            </Backdrop>
        );
    }

    return content;
};

export default LoadingSpinner;
