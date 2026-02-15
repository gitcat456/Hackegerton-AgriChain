import { Paper, Box, Typography, Avatar, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

/**
 * Stat Card component for dashboard metrics
 */
const StatCard = ({
    title,
    value,
    icon,
    color = 'primary',
    trend,
    subtitle,
    loading = false,
    onClick,
    action,
    actionLabel
}) => {
    const colorMap = {
        primary: { bg: 'rgba(5, 150, 105, 0.1)', main: '#059669' },
        secondary: { bg: 'rgba(217, 119, 6, 0.1)', main: '#D97706' },
        success: { bg: 'rgba(16, 185, 129, 0.1)', main: '#10B981' },
        warning: { bg: 'rgba(245, 158, 11, 0.1)', main: '#F59E0B' },
        error: { bg: 'rgba(239, 68, 68, 0.1)', main: '#EF4444' },
        info: { bg: 'rgba(59, 130, 246, 0.1)', main: '#3B82F6' },
    };

    const colors = colorMap[color] || colorMap.primary;
    const isTrendPositive = trend?.startsWith('+');

    if (loading) {
        return (
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%', bgcolor: 'rgba(255,255,255,0.6)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                        <Skeleton width={100} height={20} />
                        <Skeleton width={80} height={40} sx={{ mt: 1 }} />
                    </Box>
                    <Skeleton variant="circular" width={48} height={48} />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper
            className="glass-card"
            sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                height: '100%',
                cursor: (onClick || action) ? 'pointer' : 'default',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.5)',
                '&:hover': (onClick || action) ? {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.1)',
                    borderColor: 'primary.light'
                } : {},
            }}
            onClick={action || onClick}
        >
            {/* Background Blob */}
            <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: colors.bg,
                opacity: 0.5,
                zIndex: 0
            }} />

            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={600}
                        sx={{ mb: 1, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                            color: 'text.primary',
                            lineHeight: 1.2,
                            letterSpacing: '-1px',
                            mb: 0.5
                        }}
                    >
                        {value}
                    </Typography>

                    {/* Trend or Subtitle */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        {trend && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: isTrendPositive ? 'success.main' : 'error.main',
                                    bgcolor: isTrendPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                }}
                            >
                                {isTrendPositive ? (
                                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                                ) : (
                                    <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                                )}
                                <Typography variant="caption" fontWeight={700}>
                                    {trend}
                                </Typography>
                            </Box>
                        )}
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                {subtitle}
                            </Typography>
                        )}
                        {actionLabel && (
                            <Typography variant="caption" color="primary.main" fontWeight={700}>
                                {actionLabel} &rarr;
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Icon */}
                <Avatar
                    variant="rounded"
                    sx={{
                        bgcolor: colors.bg,
                        color: colors.main,
                        width: 56,
                        height: 56,
                        borderRadius: 3
                    }}
                >
                    {icon}
                </Avatar>
            </Box>
        </Paper>
    );
};

export default StatCard;
