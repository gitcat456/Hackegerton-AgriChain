import { Box, Paper, alpha } from '@mui/material';

// Background Image Mapping
const backgrounds = {
    farmer: 'url("/image1.jpg")', // User provided local image
    assessment: 'url("https://images.unsplash.com/photo-1625246333195-bf791df7a9a0?auto=format&fit=crop&q=80&w=1920")', // Green crop field
    marketplace: 'url("https://images.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg")', // Harvest time
    loans: 'url("https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=1920")', // Farmer hands soil
    default: 'url("https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1920")' // General agriculture
};

const PageBackground = ({ type = 'default', children }) => {
    return (
        <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 70px)' }}> {/* Subtract navbar height */}
            {/* Background Image Fixed Layer */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: backgrounds[type] || backgrounds.default,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1,
                }}
            />
            {/* Overlay Gradient for readability */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    // Gradient Overlay Logic
                    background: type === 'farmer'
                        ? 'linear-gradient(135deg, rgba(27, 94, 32, 0.55) 0%, rgba(255, 215, 0, 0.1) 100%)' // Green to Gold gradient
                        : 'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.95) 100%)',
                    // Adjust opacity/mix blend mode if needed, but linear-gradient with alpha is best.

                    bgcolor: type === 'farmer' ? 'transparent' : alpha('#f0f2f5', 0.85),
                    zIndex: -1,
                }}
            />

            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 1, pb: 4 }}>
                {children}
            </Box>
        </Box>
    );
};

export default PageBackground;
