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
    CircularProgress,
    IconButton,
    InputAdornment,
    useTheme,
    alpha,
    Avatar
} from '@mui/material';
import { 
    ArrowBackIosNew, 
    EmailOutlined,
    LockReset as LockResetIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Form validation schema
const resetSchema = yup.object().shape({
    email: yup.string()
        .required('Email is required')
        .email('Must be a valid email address'),
});

const ForgetPassword = () => {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const theme = useTheme();

    // React Hook Form setup
    const { 
        control, 
        handleSubmit,
        formState: { errors, isValid } 
    } = useForm({
        resolver: yupResolver(resetSchema),
        mode: 'onChange'
    });

    const onSubmit = async (data) => {
        try {
            setMessage('');
            setError('');
            setLoading(true);
            
            await resetPassword(data.email);
            setMessage('Check your email for password reset instructions');
        } catch (err) {
            console.error("Password reset error:", err);
            setError(
                err.code === 'auth/user-not-found'
                    ? 'No account found with this email address'
                    : 'Failed to send password reset email. Please try again.'
            );
        } finally {
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
                            <LockResetIcon fontSize="large" />
                        </Avatar>
                        
                        <Typography 
                            component="h1" 
                            variant="h4" 
                            sx={{ 
                                mb: 1,
                                fontWeight: 700,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center',
                                letterSpacing: -0.5
                            }}
                        >
                            Reset Password
                        </Typography>
                        
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                                mb: 3, 
                                textAlign: 'center',
                                maxWidth: '80%'
                            }}
                        >
                            Enter your email address and we'll send you a link to reset your password.
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
                        
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ width: '100%' }}
                            >
                                <Alert 
                                    severity="success" 
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
                                    {message}
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
                                        autoFocus
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
                            
                            <motion.div
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                style={{ width: '100%', marginTop: 16 }}
                            >
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading || !isValid}
                                    sx={{ 
                                        mt: 3, 
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
                                    startIcon={!loading && <SendIcon />}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </motion.div>
                            
                            <Box sx={{ 
                                mt: 3,
                                textAlign: 'center'
                            }}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link 
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
                                        Back to login
                                    </Link>
                                </motion.div>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default ForgetPassword;