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
    Divider,
    useTheme,
    alpha,
    Avatar,
    Stack
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    EmailOutlined,
    LockOutlined,
    Google as GoogleIcon,
    Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, loginWithGoogle, currentUser } = useAuth();
    const theme = useTheme();

    // If user is already logged in, redirect to home
    if (currentUser) {
        navigate('/');
        return null;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Simple validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (error) {
            setError(error.message);
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
                        alignItems: 'center' 
                    }}>
                        <Avatar
                            sx={{
                                m: 1,
                                bgcolor: theme.palette.primary.main,
                                width: 60,
                                height: 60,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.5)}`
                            }}
                        >
                            <LoginIcon fontSize="large" />
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
                            Welcome Back
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
                            onSubmit={handleLogin} 
                            sx={{ 
                                width: '100%',
                                mt: 1
                            }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined color="primary" />
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
                            
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="primary" />
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
                            
                            <motion.div
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                style={{ width: '100%', marginTop: 16 }}
                            >
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading || !email || !password}
                                    sx={{ 
                                        mt: 1, 
                                        mb: 2,
                                        borderRadius: 2,
                                        py: 1.2,
                                        background: email && password ? 
                                            `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})` : 
                                            undefined,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: email && password ? 
                                            `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` :
                                            'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: email && password ? 
                                                `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}` :
                                                'none',
                                            background: email && password ? 
                                                `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})` : 
                                                undefined,
                                        },
                                        '&::after': email && password ? {
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
                                        "Sign In"
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
                                    onClick={handleGoogleLogin}
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
                                    Sign in with Google
                                </Button>
                            </motion.div>
                            
                            <Stack 
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 1, sm: 2 }}
                                justifyContent="space-between"
                                alignItems={{ xs: 'stretch', sm: 'center' }}
                                sx={{ 
                                    mt: 3,
                                    textAlign: { xs: 'center', sm: 'left' }
                                }}
                            >
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link 
                                        href="#" 
                                        variant="body2" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/reset-password');
                                        }}
                                        sx={{
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                            color: theme.palette.secondary.main,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Forgot password?
                                    </Link>
                                </motion.div>
                                
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Link 
                                        href="#" 
                                        variant="body2" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/register');
                                        }}
                                        sx={{
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                            color: theme.palette.primary.main,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </motion.div>
                            </Stack>
                        </Box>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default Login;