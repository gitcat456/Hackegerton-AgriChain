import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    Avatar,
    Skeleton
} from '@mui/material';
import {
    Add,
    CloudUpload,
    CheckCircle,
    Warning,
    Error,
    TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import EmptyState from '../common/EmptyState';

const Assessments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAssessments = async () => {
            if (user) {
                setLoading(true);
                const data = await mockApi.getCropAssessments(user.id);
                setAssessments(data);
                setLoading(false);
            }
        };
        loadAssessments();
    }, [user]);

    const getScoreColor = (score) => {
        if (score >= 0.8) return 'success';
        if (score >= 0.6) return 'warning';
        return 'error';
    };

    const getScoreIcon = (score) => {
        if (score >= 0.8) return <CheckCircle />;
        if (score >= 0.6) return <Warning />;
        return <Error />;
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Crop Assessments
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        AI-powered health analysis of your crops
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => navigate('/farmer/upload-assessment')}
                >
                    New Assessment
                </Button>
            </Box>

            {/* Summary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'success.light' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="success.dark">
                                {assessments.filter(a => a.healthScore >= 0.8).length}
                            </Typography>
                            <Typography variant="body2" color="success.dark">Excellent Health</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'warning.light' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="warning.dark">
                                {assessments.filter(a => a.healthScore >= 0.6 && a.healthScore < 0.8).length}
                            </Typography>
                            <Typography variant="body2" color="warning.dark">Good Health</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'error.light' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Error sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="error.dark">
                                {assessments.filter(a => a.healthScore < 0.6).length}
                            </Typography>
                            <Typography variant="body2" color="error.dark">Needs Attention</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Assessments Grid */}
            {loading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map(i => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Skeleton height={300} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : assessments.length > 0 ? (
                <Grid container spacing={3}>
                    {assessments.map(assessment => (
                        <Grid item xs={12} sm={6} md={4} key={assessment.id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    height: '100%',
                                    transition: 'all 0.3s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                }}
                                onClick={() => navigate(`/farmer/assessment/${assessment.id}`)}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={assessment.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop'}
                                    alt={assessment.cropType}
                                />
                                <CardContent>
                                    {/* Score Badge */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                                                {assessment.cropType}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {assessment.areaCovered} • {assessment.assessmentDate}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            icon={getScoreIcon(assessment.healthScore)}
                                            label={`${Math.round(assessment.healthScore * 100)}%`}
                                            color={getScoreColor(assessment.healthScore)}
                                            size="small"
                                        />
                                    </Box>

                                    {/* Metrics */}
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Yield</Typography>
                                            <Typography variant="body2" fontWeight={500}>{assessment.yieldEstimate}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">Risk</Typography>
                                            <Typography variant="body2" fontWeight={500}>{assessment.riskLevel}</Typography>
                                        </Grid>
                                    </Grid>

                                    {/* Credit Impact */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <TrendingUp color="success" sx={{ fontSize: 18 }} />
                                        <Typography variant="body2" color="success.main" fontWeight={500}>
                                            +{assessment.creditScoreImpact || Math.round(assessment.healthScore * 60)} credit points
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <EmptyState
                    title="No assessments yet"
                    message="Upload photos of your crops to get AI-powered health assessments and boost your credit score."
                    action={() => navigate('/farmer/upload-assessment')}
                    actionLabel="Upload Crops"
                />
            )}
        </Box>
    );
};

export default Assessments;
