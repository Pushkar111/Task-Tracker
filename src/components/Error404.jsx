import React from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Container, 
    Paper, 
    useTheme, 
    alpha,
    Stack
} from '@mui/material';
import { 
    Home as HomeIcon, 
    ArrowBack as ArrowBackIcon,
    SentimentDissatisfied as SentimentDissatisfiedIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Error404 = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delay: 0.1,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };
    
    const goBack = () => {
        navigate(-1);
    };
    
    const goHome = () => {
        navigate(currentUser ? '/' : '/login');
    };
    
    return (
        <Container component="main" maxWidth="md" sx={{ 
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
        }}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ width: '100%' }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark' 
                            ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha('#111', 0.9)})`
                            : `linear-gradient(145deg, ${alpha('#fff', 0.9)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                        backdropFilter: 'blur(10px)',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                            : '0 8px 32px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {/* Background decorative elements */}
                    <Box sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`,
                        zIndex: 0,
                        opacity: 0.6
                    }} />
                    
                    <Box sx={{
                        position: 'absolute',
                        bottom: -50,
                        left: -50,
                        width: '250px',
                        height: '250px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)}, transparent 70%)`,
                        zIndex: 0,
                        opacity: 0.7
                    }} />
                    
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Stack spacing={4} direction="column" alignItems="center" justifyContent="center">
                            {/* Error code */}
                            <motion.div variants={itemVariants}>
                                <Typography
                                    variant="h1"
                                    component="h1"
                                    sx={{
                                        fontSize: { xs: '5rem', md: '8rem' },
                                        fontWeight: 800,
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textAlign: 'center',
                                        letterSpacing: '-0.05em',
                                        mb: -2
                                    }}
                                >
                                    404
                                </Typography>
                            </motion.div>
                            
                            {/* Error icon */}
                            <motion.div
                                variants={itemVariants}
                                animate={{ 
                                    y: [0, -10, 0],
                                    rotateZ: [-5, 5, -5]
                                }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 5,
                                    repeatType: "reverse" 
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { xs: 100, md: 150 },
                                        height: { xs: 100, md: 150 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                        mb: 2
                                    }}
                                >
                                    <SentimentDissatisfiedIcon
                                        sx={{
                                            fontSize: { xs: 60, md: 90 },
                                            color: theme.palette.error.main
                                        }}
                                    />
                                </Box>
                            </motion.div>
                            
                            {/* Error message */}
                            <motion.div variants={itemVariants}>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    sx={{
                                        fontWeight: 700,
                                        textAlign: 'center',
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    Oops! Page Not Found
                                </Typography>
                            </motion.div>
                            
                            <motion.div variants={itemVariants}>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        textAlign: 'center',
                                        maxWidth: 450,
                                        mx: 'auto',
                                        color: theme.palette.text.secondary,
                                        mb: 2
                                    }}
                                >
                                    The page you're looking for doesn't exist or has been moved.
                                    Let's get you back on track!
                                </Typography>
                            </motion.div>
                            
                            {/* Action buttons */}
                            <motion.div variants={itemVariants}>
                                <Stack 
                                    direction={{ xs: 'column', sm: 'row' }} 
                                    spacing={2} 
                                    sx={{ mt: 2 }}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<ArrowBackIcon />}
                                        onClick={goBack}
                                        sx={{
                                            borderRadius: 2,
                                            py: 1,
                                            px: 3,
                                            fontWeight: 600,
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
                                        Go Back
                                    </Button>
                                    
                                    <Button
                                        variant="contained"
                                        startIcon={<HomeIcon />}
                                        onClick={goHome}
                                        sx={{
                                            borderRadius: 2,
                                            py: 1,
                                            px: 3,
                                            fontWeight: 600,
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                            '&:hover': {
                                                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`,
                                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                                            },
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {currentUser ? 'Go Home' : 'Go to Login'}
                                    </Button>
                                </Stack>
                            </motion.div>
                        </Stack>
                    </Box>
                </Paper>
                
                {/* Footer message */}
                <motion.div variants={itemVariants}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            mt: 4, 
                            textAlign: 'center',
                            opacity: 0.8
                        }}
                    >
                        Need help? Contact support or try refreshing the page.
                    </Typography>
                </motion.div>
            </motion.div>
        </Container>
    );
};

export default Error404;