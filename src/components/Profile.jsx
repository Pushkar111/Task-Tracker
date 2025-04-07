import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Button,
    TextField,
    Grid,
    Divider,
    alpha,
    useTheme,
    CircularProgress,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    AccountCircle as AccountCircleIcon,
    Email as EmailIcon,
    CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
    const theme = useTheme();
    const { currentUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [profile, setProfile] = useState({
        displayName: currentUser?.displayName || currentUser?.email?.split('@')[0] || '',
        email: currentUser?.email || '',
        photoURL: currentUser?.photoURL || '',
        createdAt: currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'Unknown'
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            // Here you would update the user profile in Firebase
            // For example: await updateProfile(currentUser, { displayName: profile.displayName, photoURL: profile.photoURL });
            
            // For now, we'll just simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSnackbar({
                open: true,
                message: 'Profile updated successfully',
                severity: 'success'
            });
            setEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update profile',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const containerAnimation = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <Box sx={{ 
            p: { xs: 2, md: 3 }, 
            backgroundColor: alpha(theme.palette.background.default, 0.6),
            minHeight: '100vh'
        }}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerAnimation}
            >
                <Typography variant="h4" gutterBottom component="h1" sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.75rem', md: '2.2rem' },
                    mb: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                }}>
                    My Profile
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 3, 
                                borderRadius: 3,
                                backgroundImage: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Account Information
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    color={editing ? "error" : "primary"}
                                    startIcon={editing ? <CloseIcon /> : <EditIcon />}
                                    onClick={() => setEditing(!editing)}
                                    sx={{ borderRadius: 2 }}
                                    disabled={loading}
                                >
                                    {editing ? "Cancel" : "Edit Profile"}
                                </Button>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                                <Avatar
                                    src={profile.photoURL}
                                    alt={profile.displayName}
                                    sx={{ 
                                        width: 100, 
                                        height: 100,
                                        mb: 2,
                                        boxShadow: theme.shadows[4]
                                    }}
                                >
                                    {profile.displayName.substring(0, 2).toUpperCase()}
                                </Avatar>
                                
                                {editing ? (
                                    <TextField
                                        name="photoURL"
                                        label="Avatar URL"
                                        value={profile.photoURL}
                                        onChange={handleProfileChange}
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        size="small"
                                        placeholder="https://example.com/avatar.png"
                                    />
                                ) : null}
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                            <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                                            Display Name
                                        </Typography>
                                        {editing ? (
                                            <TextField
                                                name="displayName"
                                                value={profile.displayName}
                                                onChange={handleProfileChange}
                                                fullWidth
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Typography variant="body1" fontWeight={500}>
                                                {profile.displayName}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                            <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                                            Email Address
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {profile.email}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                                            Account Created
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {profile.createdAt}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            {editing && (
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        onClick={handleSaveProfile}
                                        sx={{ borderRadius: 2 }}
                                        disabled={loading}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                </Grid>
            </motion.div>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        borderRadius: 2
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};