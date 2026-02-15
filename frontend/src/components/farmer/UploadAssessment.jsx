import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    TextField,
    MenuItem,
    LinearProgress,
    Alert,
    Card,
    CardContent,
    IconButton
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    CameraAlt,
    Assessment
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import { cropTypes } from '../../data/mockListings';
import PageBackground from '../layout/PageBackground';

const UploadAssessment = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [images, setImages] = useState([]);
    const [cropType, setCropType] = useState('Maize');
    const [areaCovered, setAreaCovered] = useState('1.0');
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages([...images, ...newImages].slice(0, 6)); // Max 6 images
    };

    const removeImage = (index) => {
        const newImages = [...images];
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async () => {
        if (images.length === 0) return;

        setAnalyzing(true);
        setProgress(0);

        // Simulate AI analysis progress
        const progressSteps = [
            { progress: 20, message: 'Uploading images...' },
            { progress: 40, message: 'Analyzing crop health...' },
            { progress: 60, message: 'Detecting diseases...' },
            { progress: 80, message: 'Estimating yield...' },
            { progress: 95, message: 'Generating assessment...' },
        ];

        for (const step of progressSteps) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setProgress(step.progress);
            setProgressMessage(step.message);
        }

        try {
            const result = await mockApi.uploadCropImages(images, {
                farmerId: user.id,
                cropType,
                areaCovered: `${areaCovered} acres`
            });

            setProgress(100);
            setProgressMessage('Assessment complete!');

            // Navigate to results
            await new Promise(resolve => setTimeout(resolve, 500));
            navigate(`/farmer/assessment/${result.id}`, { state: { result } });
        } catch (error) {
            console.error('Assessment error:', error);
            setAnalyzing(false);
        }
    };

    return (
        <PageBackground type="farmer">
            <Box maxWidth="md" mx="auto">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    AI Crop Assessment
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Upload photos of your crops for AI-powered health analysis and credit scoring
                </Typography>

                {/* How it works */}
                <Paper sx={{ p: 3, mb: 4, bgcolor: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 70%, #fbc02d 100%)' }}>
                    <Typography variant="h6" fontWeight="bold" color="primary.dark" gutterBottom>
                        How it works
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4} textAlign="center">
                            <CameraAlt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="body2" color="primary.dark">
                                1. Upload clear photos of your crops
                            </Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                            <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="body2" color="primary.dark">
                                2. AI analyzes crop health & yield
                            </Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                            <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                            <Typography variant="body2" color="primary.dark">
                                3. Get credit score boost & list on marketplace
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {!analyzing ? (
                    <Paper sx={{ p: 4 }}>
                        {/* Crop Details */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Crop Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Crop Type"
                                    value={cropType}
                                    onChange={(e) => setCropType(e.target.value)}
                                >
                                    {cropTypes.map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Area Covered (acres)"
                                    type="number"
                                    value={areaCovered}
                                    onChange={(e) => setAreaCovered(e.target.value)}
                                    inputProps={{ step: 0.5, min: 0.5 }}
                                />
                            </Grid>
                        </Grid>

                        {/* Image Upload */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Upload Crop Photos
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Take clear photos showing leaves, stems, and any problem areas. Upload 2-6 photos for best results.
                        </Typography>

                        <Box
                            sx={{
                                border: '2px dashed',
                                borderColor: images.length > 0 ? 'primary.main' : 'divider',
                                borderRadius: 3,
                                p: 4,
                                textAlign: 'center',
                                bgcolor: 'action.hover',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'yellow'
                                }
                            }}
                            onClick={() => document.getElementById('image-input').click()}
                        >
                            <input
                                id="image-input"
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handleImageUpload}
                            />
                            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="body1" fontWeight={500}>
                                Click to upload or drag and drop
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                PNG, JPG up to 10MB each (max 6 images)
                            </Typography>
                        </Box>

                        {/* Image Preview */}
                        {images.length > 0 && (
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {images.map((img, index) => (
                                    <Grid item xs={4} sm={3} key={index}>
                                        <Card sx={{ position: 'relative' }}>
                                            <img
                                                src={img.preview}
                                                alt={`Crop ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: 100,
                                                    objectFit: 'cover'
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
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {/* Submit Button */}
                        <Box sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={<Assessment />}
                                onClick={handleSubmit}
                                disabled={images.length === 0}
                            >
                                Start AI Assessment
                            </Button>
                            {images.length === 0 && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Please upload at least one image to start the assessment
                                </Alert>
                            )}
                        </Box>
                    </Paper>
                ) : (
                    // Analysis Progress
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Assessment sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Analyzing Your Crops
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            {progressMessage}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 12,
                                borderRadius: 6,
                                mb: 2,
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 6
                                }
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {progress}% complete
                        </Typography>
                    </Paper>
                )}
            </Box>
        </PageBackground>
    );
};

export default UploadAssessment;
