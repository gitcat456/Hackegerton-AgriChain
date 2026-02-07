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
    onClick
}) => {
    const colorMap = {
        primary: { bg: 'rgba(46, 125, 50, 0.12)', main: '#2E7D32' },
        secondary: { bg: 'rgba(255, 152, 0, 0.12)', main: '#FF9800' },
        success: { bg: 'rgba(67, 160, 71, 0.12)', main: '#43A047' },
        warning: { bg: 'rgba(255, 167, 38, 0.12)', main: '#FFA726' },
        error: { bg: 'rgba(229, 57, 53, 0.12)', main: '#E53935' },
        info: { bg: 'rgba(25, 118, 210, 0.12)', main: '#1976D2' },
    };

    const colors = colorMap[color] || colorMap.primary;
    const isTrendPositive = trend?.startsWith('+');

    if (loading) {
        return (
            <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
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
            sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease-in-out',
                '&:hover': onClick ? {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                } : {},
            }}
            onClick={onClick}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                        sx={{ mb: 1 }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            color: 'text.primary',
                            lineHeight: 1.2,
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
                                    bgcolor: isTrendPositive ? 'success.light' : 'error.light',
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    opacity: 0.9,
                                }}
                            >
                                {isTrendPositive ? (
                                    <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                                ) : (
                                    <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                                )}
                                <Typography variant="caption" fontWeight={600}>
                                    {trend}
                                </Typography>
                            </Box>
                        )}
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Icon */}
                <Avatar
                    sx={{
                        bgcolor: colors.bg,
                        color: colors.main,
                        width: 52,
                        height: 52,
                    }}
                >
                    {icon}
                </Avatar>
            </Box>
        </Paper>
    );
};

export default StatCard;
