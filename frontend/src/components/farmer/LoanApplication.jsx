import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Button,
    Grid,
    TextField,
    MenuItem,
    Slider,
    Alert,
    FormControl,
    FormControlLabel,
    Checkbox,
    Divider,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    MonetizationOn,
    Assessment,
    CheckCircle,
    CalendarToday,
    AccountBalanceWallet
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../data/mockApi';
import { loanPurposes, loanDurations } from '../../data/mockLoans';
import PageBackground from '../layout/PageBackground';

const steps = ['Loan Details', 'Link Assessment', 'Review & Submit'];

const LoanApplication = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successDialog, setSuccessDialog] = useState(false);
    const [loanResult, setLoanResult] = useState(null);

    const { control, watch, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            amount: 2000,
            duration: 6,
            purpose: 'Seeds',
            termsAccepted: false
        }
    });

    const watchAmount = watch('amount');
    const watchDuration = watch('duration');
    const watchTerms = watch('termsAccepted');

    // Calculate loan details
    const calculateInterestRate = (amount, months) => {
        let baseRate = 10;
        if (amount < 1000) baseRate -= 1;
        if (amount > 3000) baseRate += 0.5;
        if (months <= 3) baseRate -= 1.5;
        if (months >= 12) baseRate += 1;
        return Math.round(baseRate * 10) / 10;
    };

    const interestRate = calculateInterestRate(watchAmount, watchDuration);
    const totalWithInterest = watchAmount * (1 + interestRate / 100);
    const monthlyPayment = totalWithInterest / watchDuration;

    // Determine max loan amount based on credit score
    const maxLoanAmount = user?.creditScore >= 800 ? 5000 :
        user?.creditScore >= 700 ? 3500 :
            user?.creditScore >= 600 ? 2000 : 1000;

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

    const handleNext = () => {
        if (activeStep === 1 && !selectedAssessment) {
            return; // Require assessment selection
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const result = await mockApi.applyForLoan({
                farmerId: user.id,
                amount: data.amount,
                durationMonths: data.duration,
                purpose: data.purpose,
                assessmentId: selectedAssessment?.id
            });
            setLoanResult(result);
            setSuccessDialog(true);
        } catch (error) {
            console.error('Loan application error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            How much do you need?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Based on your credit score of <strong>{user?.creditScore}</strong>, you can borrow up to <strong>KES {maxLoanAmount.toLocaleString()}</strong>
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Typography gutterBottom fontWeight={500}>
                                    Loan Amount: <strong>KES {watchAmount.toLocaleString()}</strong>
                                </Typography>
                                <Controller
                                    name="amount"
                                    control={control}
                                    rules={{ required: true, min: 500, max: maxLoanAmount }}
                                    render={({ field }) => (
                                        <Slider
                                            {...field}
                                            min={500}
                                            max={maxLoanAmount}
                                            step={100}
                                            marks={[
                                                { value: 500, label: 'KES 500' },
                                                { value: maxLoanAmount, label: `KES ${maxLoanAmount.toLocaleString()}` }
                                            ]}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(v) => `KES ${v.toLocaleString()}`}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="duration"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Loan Duration"
                                            fullWidth
                                        >
                                            {loanDurations.map(d => (
                                                <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="purpose"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Loan Purpose"
                                            fullWidth
                                        >
                                            {loanPurposes.map(p => (
                                                <MenuItem key={p} value={p}>{p}</MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        {/* Live Calculation */}
                        <Paper
                            sx={{
                                mt: 4,
                                p: 3,
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                borderRadius: 3
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Interest Rate</Typography>
                                    <Typography variant="h5" fontWeight="bold">{interestRate}%</Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Monthly Payment</Typography>
                                    <Typography variant="h5" fontWeight="bold">KES {Math.round(monthlyPayment).toLocaleString()}</Typography>
                                </Grid>
                                <Grid item xs={4} textAlign="center">
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Repayment</Typography>
                                    <Typography variant="h5" fontWeight="bold">KES {Math.round(totalWithInterest).toLocaleString()}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                );

            case 1:
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Link a Crop Assessment
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Select a recent assessment to strengthen your loan application. Higher health scores may improve approval chances.
                        </Typography>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : assessments.length > 0 ? (
                            <Grid container spacing={2}>
                                {assessments.map((assessment) => (
                                    <Grid item xs={12} md={6} key={assessment.id}>
                                        <Card
                                            variant={selectedAssessment?.id === assessment.id ? 'elevation' : 'outlined'}
                                            sx={{
                                                cursor: 'pointer',
                                                border: selectedAssessment?.id === assessment.id ? 2 : 1,
                                                borderColor: selectedAssessment?.id === assessment.id ? 'primary.main' : 'divider',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                            onClick={() => setSelectedAssessment(assessment)}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                                                            {assessment.cropType}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {assessment.areaCovered} • {assessment.assessmentDate}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={`${Math.round(assessment.healthScore * 100)}% Health`}
                                                        color={assessment.healthScore >= 0.8 ? 'success' : 'warning'}
                                                        size="small"
                                                    />
                                                </Box>
                                                {selectedAssessment?.id === assessment.id && (
                                                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                                        <CheckCircle fontSize="small" />
                                                        <Typography variant="body2" fontWeight={500}>Selected</Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                No assessments found. <Button size="small" onClick={() => navigate('/farmer/upload-assessment')}>Upload crops first</Button>
                            </Alert>
                        )}

                        {!selectedAssessment && assessments.length > 0 && (
                            <Alert severity="warning" sx={{ mt: 3 }}>
                                Please select an assessment to continue
                            </Alert>
                        )}
                    </Box>
                );

            case 2:
                return (
                    <Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Review Your Application
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Please review all details before submitting your loan application.
                        </Typography>

                        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Loan Amount</Typography>
                                    <Typography variant="h6" fontWeight="bold">KES {watchAmount.toLocaleString()}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Duration</Typography>
                                    <Typography variant="h6" fontWeight="bold">{watchDuration} months</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Interest Rate</Typography>
                                    <Typography variant="h6" fontWeight="bold">{interestRate}%</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Purpose</Typography>
                                    <Typography variant="h6" fontWeight="bold">{watch('purpose')}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Monthly Payment</Typography>
                                    <Typography variant="h5" fontWeight="bold" color="primary">
                                        KES {Math.round(monthlyPayment).toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Total Repayment</Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        KES {Math.round(totalWithInterest).toLocaleString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {selectedAssessment && (
                            <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'action.hover' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Assessment color="primary" />
                                    <Box>
                                        <Typography fontWeight={600}>Linked Assessment</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedAssessment.cropType} • {selectedAssessment.areaCovered} • {Math.round(selectedAssessment.healthScore * 100)}% health
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        )}

                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                By submitting this application, you agree to repay the loan amount plus interest according to the schedule.
                                Estimated approval time: <strong>24-48 hours</strong>.
                            </Typography>
                        </Alert>

                        <Controller
                            name="termsAccepted"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value} />}
                                    label="I agree to the loan terms and conditions"
                                />
                            )}
                        />
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <PageBackground type="farmer">
            <Box maxWidth="md" mx="auto">
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Apply for a Loan
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Get funds based on your crop assessment and credit score
                </Typography>

                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Step Content */}
                <Paper sx={{ p: 4, mb: 4 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {renderStepContent(activeStep)}

                        {/* Navigation */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Back
                            </Button>

                            {activeStep === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    type="submit"
                                    disabled={!watchTerms || submitting}
                                    startIcon={submitting ? <CircularProgress size={20} /> : <MonetizationOn />}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={activeStep === 1 && !selectedAssessment}
                                >
                                    Continue
                                </Button>
                            )}
                        </Box>
                    </form>
                </Paper>

                {/* Success Dialog */}
                <Dialog open={successDialog} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                        <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold">
                            Application Submitted!
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ textAlign: 'center' }}>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Your loan application for <strong>KES {watchAmount.toLocaleString()}</strong> has been submitted successfully.
                        </Typography>
                        <Alert severity="info">
                            Estimated approval time: <strong>24-48 hours</strong>
                        </Alert>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                        <Button variant="outlined" onClick={() => navigate('/farmer/loans')}>
                            View Loan Status
                        </Button>
                        <Button variant="contained" onClick={() => navigate('/farmer/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </PageBackground>
    );
};

export default LoanApplication;
