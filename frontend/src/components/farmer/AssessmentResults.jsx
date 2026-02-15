import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    ImageList,
    ImageListItem,
    Dialog,
    Skeleton,
    Button
} from '@mui/material';
import {
    CheckCircle,
    Warning,
    Error,
    TrendingUp,
    Grass,
    Speed,
    MonetizationOn,
    Storefront,
    Download,
    Lightbulb,
    ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import PageBackground from '../layout/PageBackground';

const AssessmentResults = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [assessment, setAssessment] = useState(location.state?.result || null);
    const [loading, setLoading] = useState(!assessment);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const loadAssessment = async () => {
            if (!assessment && id) {
                setLoading(true);
                const data = await mockApi.getAssessmentById(id);
                setAssessment(data);
                setLoading(false);
            }
        };
        loadAssessment();
    }, [id, assessment]);

    if (loading) {
        return (
            <PageBackground type="farmer">
                <Box maxWidth="lg" mx="auto">
                    <Skeleton height={60} width={300} />
                    <Skeleton height={200} sx={{ mt: 2 }} />
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        {[1, 2, 3, 4].map(i => (
                            <Grid item xs={6} md={3} key={i}>
                                <Skeleton height={120} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </PageBackground>
        );
    }

    if (!assessment) {
        return (
            <PageBackground type="farmer">
                <Box textAlign="center" py={8}>
                    <Typography variant="h5">Assessment not found</Typography>
                    <Button onClick={() => navigate('/farmer/assessments')} sx={{ mt: 2 }}>
                        View All Assessments
                    </Button>
                </Box>
            </PageBackground>
        );
    }

    const healthScore = assessment.healthScore * 100;
    const scoreColor = healthScore >= 80 ? 'success' : healthScore >= 60 ? 'warning' : 'error';
    const scoreLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention';
    const ScoreIcon = healthScore >= 80 ? CheckCircle : healthScore >= 60 ? Warning : Error;

    return (
        <PageBackground type="farmer">
            <Box maxWidth="lg" mx="auto">
                {/* Back Button */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/farmer/assessments')}
                    sx={{ mb: 2, bgcolor: 'white' }}
                >
                    Back to Assessments
                </Button>

                {/* Header */}
                <Paper
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 4,
                        background: `linear-gradient(135deg, ${scoreColor === 'success' ? '#1B5E20, #43A047' :
                            scoreColor === 'warning' ? '#813309ff, #925c0bff' :
                                '#B71C1C, #E53935'
                            })`,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                AI Crop Assessment Results
                            </Typography>
                            <Typography variant="h3" fontWeight="800" sx={{ textTransform: 'capitalize' }}>
                                {assessment.cropType}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
                                {assessment.areaCovered} • Assessed on {assessment.assessmentDate}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    border: '4px solid rgba(255,255,255,0.4)'
                                }}
                            >
                                <Typography variant="h2" fontWeight="800">
                                    {Math.round(healthScore)}%
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Health Score
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Metrics Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar sx={{ bgcolor: `${scoreColor}.light`, color: `${scoreColor}.main`, mx: 'auto', mb: 1 }}>
                                    <ScoreIcon />
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">Overall Status</Typography>
                                <Typography variant="h6" fontWeight="bold">{scoreLabel}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main', mx: 'auto', mb: 1 }}>
                                    <TrendingUp />
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">Yield Estimate</Typography>
                                <Typography variant="h6" fontWeight="bold">{assessment.yieldEstimate}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar sx={{ bgcolor: assessment.riskLevel === 'Low' ? 'success.light' : 'warning.light', color: assessment.riskLevel === 'Low' ? 'success.main' : 'warning.main', mx: 'auto', mb: 1 }}>
                                    <Speed />
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">Risk Level</Typography>
                                <Typography variant="h6" fontWeight="bold">{assessment.riskLevel}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mx: 'auto', mb: 1 }}>
                                    <Grass />
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">Area Covered</Typography>
                                <Typography variant="h6" fontWeight="bold">{assessment.areaCovered}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={4}>
                    {/* Left Column */}
                    <Grid item xs={12} md={8}>
                        {/* Recommendations */}
                        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Lightbulb color="secondary" />
                                <Typography variant="h6" fontWeight="bold">AI Recommendations</Typography>
                            </Box>
                            <List>
                                {assessment.recommendations?.map((rec, index) => (
                                    <ListItem key={index} sx={{ px: 0 }}>
                                        <ListItemIcon>
                                            <CheckCircle color="success" />
                                        </ListItemIcon>
                                        <ListItemText primary={rec} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>

                        {/* Images */}
                        {assessment.images && assessment.images.length > 0 && (
                            <Paper sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Analyzed Images
                                </Typography>
                                <ImageList cols={3} gap={12}>
                                    {assessment.images.map((img, index) => (
                                        <ImageListItem
                                            key={index}
                                            sx={{
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                '&:hover': { opacity: 0.8 }
                                            }}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Crop ${index + 1}`}
                                                loading="lazy"
                                                style={{ borderRadius: 8, height: 150, objectFit: 'cover' }}
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Paper>
                        )}
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={4}>
                        {/* Credit Impact */}
                        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'white' }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Credit Score Impact
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="h3" fontWeight="800" color="success.dark">
                                    +{assessment.creditScoreImpact || Math.round(healthScore * 0.6)}
                                </Typography>
                                <Box>
                                    <Typography variant="body2" color="success.dark">points</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Added to your credit score
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Actions */}
                        <Paper sx={{ p: 3, borderRadius: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Next Steps
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                startIcon={<MonetizationOn />}
                                onClick={() => navigate('/farmer/loan/apply')}
                                sx={{ mb: 2 }}
                            >
                                Apply for Loan
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                size="large"
                                startIcon={<Storefront />}
                                onClick={() => navigate('/farmer/listing/create', {
                                    state: { assessment }
                                })}
                                sx={{ mb: 2 }}
                            >
                                Create Listing
                            </Button>
                            <Button
                                variant="text"
                                fullWidth
                                startIcon={<Download />}
                            >
                                Download Report
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Image Dialog */}
                <Dialog
                    open={Boolean(selectedImage)}
                    onClose={() => setSelectedImage(null)}
                    maxWidth="md"
                >
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Crop"
                            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                        />
                    )}
                </Dialog>
            </Box>
        </PageBackground>
    );
};

export default AssessmentResults;
