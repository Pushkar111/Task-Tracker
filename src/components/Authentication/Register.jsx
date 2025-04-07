import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    Paper, 
    Typography, 
    Box, 
    Container, 
    Link, 
    Alert,
    IconButton,
    InputAdornment,
    CircularProgress,
    LinearProgress,
    Divider,
    useTheme,
    alpha,
    Avatar
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    PersonOutlineRounded,
    EmailOutlined,
    LockOutlined,
    ArrowBackIosNew,
    Google as GoogleIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Password strength requirements
const passwordRequirements = [
    { id: 'length', label: 'At least 8 characters', regex: /.{8,}/ },
    { id: 'lowercase', label: 'One lowercase letter', regex: /[a-z]/ },
    { id: 'uppercase', label: 'One uppercase letter', regex: /[A-Z]/ },
    { id: 'number', label: 'One number', regex: /[0-9]/ },
    { id: 'special', label: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
];

// Form validation schema
const registerSchema = yup.object().shape({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: yup.string().required('Email is required').email('Must be a valid email'),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must include a lowercase letter')
        .matches(/[A-Z]/, 'Password must include an uppercase letter')
        .matches(/[0-9]/, 'Password must include a number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must include a special character'),
    confirmPassword: yup.string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match')
});

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup, loginWithGoogle, currentUser } = useAuth();
    const theme = useTheme();

    // React Hook Form setup
    const { 
        control, 
        handleSubmit, 
        watch,
        formState: { errors, isValid } 
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: 'onChange'
    });

    // Get current password value for strength calculation
    const watchPassword = watch("password", "");
    
    // Password strength calculation
    const getPasswordStrength = (password) => {
        if (!password) return 0;
        
        let strength = 0;
        passwordRequirements.forEach(req => {
            if (req.regex.test(password)) strength += 20;
        });
        
        return strength;
    };
    
    const passwordStrength = getPasswordStrength(watchPassword);
    
    // Get strength color based on score
    const getStrengthColor = (strength) => {
        if (strength <= 20) return theme.palette.error.main;
        if (strength <= 40) return theme.palette.warning.main;
        if (strength <= 60) return theme.palette.warning.light;
        if (strength <= 80) return theme.palette.success.light;
        return theme.palette.success.main;
    };

    // Get strength label
    const getStrengthLabel = (strength) => {
        if (strength <= 20) return 'Very weak';
        if (strength <= 40) return 'Weak';
        if (strength <= 60) return 'Medium';
        if (strength <= 80) return 'Strong';
        return 'Very strong';
    };

    // If user is already logged in, redirect to home
    if (currentUser) {
        navigate('/');
        return null;
    }

    const onSubmit = async (data) => {
        try {
            setError('');
            setLoading(true);
            
            // Create user with provided email and password
            await signup(data.email, data.password);
            
            // Navigate to login page after successful registration
            navigate('/login');
        } catch (err) {
            console.error("Registration error:", err);
            setError(
                err.code === 'auth/email-already-in-use' 
                    ? 'This email is already registered. Please use a different email.' 
                    : 'Failed to create an account. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            console.error("Google signup error:", err);
            setError('Failed to sign up with Google. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: { xs: 3, sm: 4 }, 
                        mt: 8, 
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark' 
                            ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha('#111', 0.9)})`
                            : `linear-gradient(145deg, ${alpha('#fff', 0.9)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                        backdropFilter: 'blur(10px)',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                            : '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IconButton 
                                sx={{ 
                                    position: 'absolute', 
                                    left: -16, 
                                    top: -16,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    }
                                }}
                                onClick={() => navigate('/login')}
                                aria-label="Back to login"
                            >
                                <ArrowBackIosNew />
                            </IconButton>
                        </motion.div>
                        
                        <Avatar
                            sx={{
                                m: 1,
                                bgcolor: theme.palette.primary.main,
                                width: 60,
                                height: 60,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.5)}`
                            }}
                        >
                            <PersonOutlineRounded fontSize="large" />
                        </Avatar>
                        
                        <Typography 
                            component="h1" 
                            variant="h4" 
                            sx={{ 
                                mb: 3, 
                                fontWeight: 700,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center',
                                letterSpacing: -0.5
                            }}
                        >
                            Create Account
                        </Typography>
                        
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%' }}
                            >
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        width: '100%', 
                                        mb: 2,
                                        borderRadius: 2,
                                        '& .MuiAlert-icon': {
                                            display: 'flex',
                                            alignItems: 'center'
                                        }
                                    }}
                                >
                                    {error}
                                </Alert>
                            </motion.div>
                        )}
                        
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit(onSubmit)} 
                            sx={{ 
                                width: '100%', 
                                mt: 1 
                            }}
                        >
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Full Name"
                                        autoComplete="name"
                                        autoFocus
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonOutlineRounded color={errors.name ? "error" : "primary"} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&.Mui-focused': {
                                                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                            
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        autoComplete="email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlined color={errors.email ? "error" : "primary"} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&.Mui-focused': {
                                                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                            
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlined color={errors.password ? "error" : "primary"} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&.Mui-focused': {
                                                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                            
                            {watchPassword && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Box sx={{ mt: 1, mb: 2 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            mb: 0.5
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                Password strength:
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    fontWeight: 'bold',
                                                    color: getStrengthColor(passwordStrength)
                                                }}
                                            >
                                                {getStrengthLabel(passwordStrength)}
                                            </Typography>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={passwordStrength} 
                                            sx={{ 
                                                height: 8, 
                                                borderRadius: 5,
                                                mb: 1.5,
                                                bgcolor: alpha(theme.palette.divider, 0.2),
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: getStrengthColor(passwordStrength),
                                                    borderRadius: 5,
                                                    transition: 'all 0.6s ease'
                                                }
                                            }}
                                        />
                                        
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            gap: 0.5,
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.background.default, 0.5),
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                        }}>
                                            {passwordRequirements.map((req) => (
                                                <Box 
                                                    key={req.id} 
                                                    sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {req.regex.test(watchPassword) ? (
                                                        <CheckCircleIcon 
                                                            fontSize="small" 
                                                            color="success" 
                                                            sx={{ 
                                                                mr: 1,
                                                                animation: req.regex.test(watchPassword) ? 
                                                                    'pulse 0.5s ease-in-out' : 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <CancelIcon 
                                                            fontSize="small" 
                                                            color="error" 
                                                            sx={{ mr: 1 }}
                                                        />
                                                    )}
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{
                                                            fontWeight: req.regex.test(watchPassword) ? 500 : 400,
                                                            color: req.regex.test(watchPassword) ? 
                                                                theme.palette.text.primary : 
                                                                theme.palette.text.secondary
                                                        }}
                                                    >
                                                        {req.label}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </motion.div>
                            )}
                            
                            <Controller
                                name="confirmPassword"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        disabled={loading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlined color={errors.confirmPassword ? "error" : "primary"} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                transition: 'all 0.3s ease',
                                                '&.Mui-focused': {
                                                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                            
                            <motion.div
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                style={{ width: '100%', marginTop: 16 }}
                            >
                                <Button
                                    type="submit"
                                    fullWidth
                                    disabled={loading || !isValid}
                                    variant="contained"
                                    sx={{ 
                                        mt: 1, 
                                        mb: 2,
                                        borderRadius: 2,
                                        py: 1.2,
                                        background: isValid ? 
                                            `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` : 
                                            undefined,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: isValid ? 
                                            `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` :
                                            'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: isValid ? 
                                                `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}` :
                                                'none',
                                            background: isValid ? 
                                                `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})` : 
                                                undefined,
                                        },
                                        '&::after': isValid ? {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: `linear-gradient(to right, ${alpha('#fff', 0)}, ${alpha('#fff', 0.3)}, ${alpha('#fff', 0)})`,
                                            animation: 'shimmer 2s infinite',
                                            '@keyframes shimmer': {
                                                '100%': {
                                                    left: '100%',
                                                },
                                            },
                                        } : {}
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </motion.div>
                            
                            <Box sx={{ 
                                position: 'relative', 
                                textAlign: 'center', 
                                my: 2 
                            }}>
                                <Divider sx={{ 
                                    my: 2,
                                    '&::before, &::after': {
                                        borderColor: alpha(theme.palette.divider, 0.2),
                                    }
                                }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            px: 1, 
                                            color: theme.palette.text.secondary 
                                        }}
                                    >
                                        or
                                    </Typography>
                                </Divider>
                            </Box>
                            
                            <motion.div
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                style={{ width: '100%' }}
                            >
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    onClick={handleGoogleSignup}
                                    disabled={loading}
                                    sx={{ 
                                        mb: 2, 
                                        borderRadius: 2, 
                                        py: 1.2,
                                        borderWidth: 1.5,
                                        borderColor: alpha(theme.palette.divider, 0.3),
                                        color: theme.palette.text.primary,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Sign up with Google
                                </Button>
                            </motion.div>
                            
                            <Box sx={{ 
                                mt: 2,
                                textAlign: 'center'
                            }}>
                                <Link 
                                    component={motion.a}
                                    whileHover={{ 
                                        scale: 1.05,
                                        color: theme.palette.primary.main 
                                    }}
                                    href="#" 
                                    variant="body2" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/login');
                                    }}
                                    sx={{
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        color: theme.palette.primary.main,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Already have an account? Log in
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default Register;