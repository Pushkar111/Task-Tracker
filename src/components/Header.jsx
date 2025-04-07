import React, { useEffect, useState, useMemo } from "react";
import { 
    Box, TextField, InputAdornment, IconButton, Typography, 
    useTheme, alpha, Tooltip, Badge, Avatar, Menu, MenuItem, 
    Divider, ListItemIcon, Button, useMediaQuery,
    Dialog, DialogTitle, DialogContent, DialogActions, 
    List, ListItem, ListItemText, Stack,
    SwipeableDrawer, Paper, AppBar, Slide, Chip
} from "@mui/material";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Notifications as NotificationsIcon,
    Help as HelpIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    AccountCircle as AccountCircleIcon,
    ChevronLeft,
    AccessTime as TimeIcon,
    CheckCircleOutlined as CheckIcon,
    Person as PersonIcon,
    NightsStay as NightIcon,
    LightMode as DayIcon,
    FilterList as FilterIcon,
    Assignment as TaskIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = ({ title, onAdd, showAdd, onSearchChange, searchValue, onLogout, onToggleSidebar }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallScreen = useMediaQuery('(max-width:480px)');
    const isLargeScreen = useMediaQuery('(min-width:1200px)');
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    // State for menus and UI
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsAnchor, setNotificationsAnchor] = useState(null);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(!isSmallScreen);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const open = Boolean(anchorEl);
    const notificationsOpen = Boolean(notificationsAnchor);

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Update search visibility when screen size changes
    useEffect(() => {
        setShowSearch(!isSmallScreen);
    }, [isSmallScreen]);

    // Get time of day for greeting with icon
    const getTimeInfo = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return { greeting: "Good morning", icon: <DayIcon fontSize="small" color="warning" /> };
        if (hour < 17) return { greeting: "Good afternoon", icon: <DayIcon fontSize="small" color="warning" /> };
        return { greeting: "Good evening", icon: <NightIcon fontSize="small" color="primary" /> };
    }, []);

    // Get user name for display
    const getUserName = () => {
        if (!currentUser || !currentUser.email) return "User";

        // If there's a display name, use it
        if (currentUser.displayName) return currentUser.displayName;

        // Otherwise, generate a name from the email
        const nameParts = currentUser.email.split("@")[0].split(".");
        if (nameParts.length >= 2) {
            return `${nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)} ${nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)}`;
        } else {
            return currentUser.email.split("@")[0];
        }
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsOpen = (event) => {
        setNotificationsAnchor(event.currentTarget);
    };

    const handleNotificationsClose = () => {
        setNotificationsAnchor(null);
    };

    const handleHelpOpen = () => {
        setHelpDialogOpen(true);
    };

    const handleHelpClose = () => {
        setHelpDialogOpen(false);
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleProfileMenuClose();
    };

    // Toggle search field on mobile
    const toggleSearchField = () => {
        setShowSearch(!showSearch);
        if (!showSearch) {
            // Focus the search input when it appears
            setTimeout(() => {
                const searchInput = document.querySelector('input[placeholder="Search tasks..."]');
                if (searchInput) searchInput.focus();
            }, 300);
        }
    };

    // Sample notifications
    const notifications = [
        { id: 1, title: "Task due today", message: "Meeting with team at 3:00 PM", time: "1 hour ago", type: "reminder" },
        { id: 2, title: "New feature", message: "Dark mode is now available", time: "3 hours ago", type: "update" },
        { id: 3, title: "Task completed", message: "Project proposal was completed", time: "Yesterday", type: "success" },
    ];

    // Mark notification as read
    const markAsRead = (id) => {
        console.log(`Marking notification ${id} as read`);
        handleNotificationsClose();
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        console.log("Marking all notifications as read");
        handleNotificationsClose();
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'reminder':
                return <TimeIcon fontSize="small" color="warning" />;
            case 'success':
                return <CheckIcon fontSize="small" color="success" />;
            case 'update':
                return <TaskIcon fontSize="small" color="info" />;
            default:
                return <NotificationsIcon fontSize="small" color="action" />;
        }
    };

    // Button animation variants
    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95, transition: { duration: 0.1 } }
    };

    return (
        <AppBar 
            position="sticky" 
            color="inherit" 
            elevation={0}
            sx={{
                top: 0,
                zIndex: 1100, // keep it above other elements
                backdropFilter: scrolled ? "blur(10px)" : "blur(8px)",
                backgroundColor: alpha(
                    theme.palette.background.default, 
                    scrolled ? 0.85 : 0.8
                ),
                borderBottom: `1px solid ${alpha(theme.palette.divider, scrolled ? 0.12 : 0.1)}`,
                transition: 'all 0.3s ease',
                boxShadow: scrolled 
                    ? `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`
                    : 'none', 

                //  ensure the header doesn't cover the sidebar button
                '& + .MuiBox-root': {
                    paddingTop: { xs: '64px', sm: 0 }
                }
            }}
        >
            <Box
                sx={{
                    px: { xs: 1.5, sm: 2, md: 3 },
                    py: { xs: scrolled ? 0.75 : 1, sm: scrolled ? 1 : 1.5, md: scrolled ? 1.25 : 2 },
                    transition: 'padding 0.3s ease'
                }}
            >
                {/* Main header content */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            sm: "row",
                        },
                        justifyContent: "space-between",
                        alignItems: {
                            xs: "flex-start",
                            sm: "center",
                        },
                        gap: { xs: 1, sm: 2 },
                    }}
                >
                    {/* Left side - Greeting & User name */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        <Box 
                            sx={{ 
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                mr: 1.5, 
                                borderRadius: '8px',
                                px: 1.5,
                                py: 0.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            }}
                        >
                            {getTimeInfo.icon}
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontWeight: 500,
                                    ml: 0.5,
                                }}
                            >
                                {getTimeInfo.greeting}
                            </Typography>
                        </Box>
                        
                        <Typography
                            variant={isMobile ? "h6" : "h5"}
                            component="h1"
                            noWrap
                            sx={{
                                fontWeight: 700,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                textFillColor: "transparent",
                                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                                maxWidth: { sm: '200px', md: '300px', lg: 'none' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                flex: { xs: '1', sm: '0 0 auto' },
                                textShadow: theme.palette.mode === 'dark' 
                                    ? '0 0 25px rgba(80, 120, 255, 0.4)'
                                    : 'none',
                            }}
                        >
                            {getUserName()}
                        </Typography>
                    </Box>

                    {/* Right side - Search & Actions */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: { xs: 1, sm: 2 },
                            alignItems: "center",
                            justifyContent: { xs: 'space-between', sm: 'flex-end' },
                            width: { xs: '100%', sm: 'auto' },
                            mt: { xs: 1, sm: 0 },
                            transition: 'all 0.3s ease'
                        }}
                    >
                 
                        {/* Search field that can be toggled on small screens */}
                        <AnimatePresence mode="wait">
                            {showSearch && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ 
                                        display: 'flex', 
                                        flexGrow: 1, 
                                        width: isSmallScreen ? '100%' : 'auto'
                                    }}
                                >
                                    <TextField
                                        size="small"
                                        placeholder="Search tasks..."
                                        value={searchValue || ""}
                                        onChange={onSearchChange}
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        sx={{
                                            flexGrow: 1,
                                            width: { 
                                                xs: isSmallScreen ? '100%' : 'auto', 
                                                sm: '180px', 
                                                md: '220px' 
                                            },
                                            minWidth: { xs: '100%', sm: '150px' },
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                                bgcolor: alpha(
                                                    theme.palette.background.paper,
                                                    searchFocused ? 1 : 0.8
                                                ),
                                                "&:hover": {
                                                    bgcolor: theme.palette.background.paper,
                                                },
                                                pr: searchValue ? 0.5 : 1,
                                                transition: 'all 0.2s ease',
                                                boxShadow: searchFocused 
                                                    ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                                                    : theme.shadows[1],
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon 
                                                        fontSize="small" 
                                                        color={searchFocused ? "primary" : "action"} 
                                                    />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchValue ? (
                                                <InputAdornment position="end">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => onSearchChange({ target: { value: "" } })}
                                                        sx={{ p: 0.5 }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : isSmallScreen ? (
                                                <InputAdornment position="end">
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={toggleSearchField}
                                                        sx={{ p: 0.5 }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isSmallScreen && !showSearch && (
                            <motion.div
                                variants={buttonVariants}
                                initial="idle"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <IconButton
                                    onClick={toggleSearchField}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        backdropFilter: 'blur(5px)',
                                        "&:hover": {
                                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                                        },
                                        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                                    }}
                                >
                                    <SearchIcon fontSize="small" color="primary" />
                                </IconButton>
                            </motion.div>
                        )}

                        {/* Quick access buttons */}
                        <Box
                            sx={{
                                display: "flex",
                                gap: { xs: 1, sm: 1.5 },
                                justifyContent: "flex-end",
                                flexShrink: 0,
                                ml: { xs: 0, sm: 'auto' },
                            }}
                        >
                            <Tooltip title="Help" arrow placement="bottom">
                                <motion.div
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <IconButton
                                        size="small"
                                        onClick={handleHelpOpen}
                                        sx={{
                                            bgcolor: alpha(theme.palette.info.main, 0.12),
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.info.main, 0.2),
                                            },
                                            width: { xs: 36, sm: 40 },
                                            height: { xs: 36, sm: 40 },
                                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                            boxShadow: `0 2px 6px ${alpha(theme.palette.info.main, 0.15)}`,
                                        }}
                                    >
                                        <HelpIcon fontSize="small" color="info" />
                                    </IconButton>
                                </motion.div>
                            </Tooltip>

                            <Tooltip title="Notifications" arrow placement="bottom">
                                <motion.div
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <IconButton
                                        size="small"
                                        onClick={handleNotificationsOpen}
                                        sx={{
                                            bgcolor: alpha(theme.palette.warning.main, 0.12),
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.warning.main, 0.2),
                                            },
                                            width: { xs: 36, sm: 40 },
                                            height: { xs: 36, sm: 40 },
                                            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                            boxShadow: `0 2px 6px ${alpha(theme.palette.warning.main, 0.15)}`,
                                        }}
                                    >
                                        <Badge
                                            badgeContent={notifications.length}
                                            color="warning"
                                            sx={{
                                                "& .MuiBadge-badge": {
                                                    fontSize: "0.6rem",
                                                    height: "16px",
                                                    minWidth: "16px",
                                                    boxShadow: theme.shadows[2],
                                                    background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                                                },
                                            }}
                                        >
                                            <NotificationsIcon fontSize="small" color="warning" />
                                        </Badge>
                                    </IconButton>
                                </motion.div>
                            </Tooltip>

                            <Tooltip title="Account" arrow placement="bottom">
                                <motion.div
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <IconButton
                                        size="small"
                                        onClick={handleProfileMenuOpen}
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                            },
                                            width: { xs: 36, sm: 40 },
                                            height: { xs: 36, sm: 40 },
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.15)}`,
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: { xs: 24, sm: 28 },
                                                height: { xs: 24, sm: 28 },
                                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                                fontWeight: 'bold',
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                                boxShadow: theme.shadows[2],
                                            }}
                                        >
                                            {currentUser && currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : "U"}
                                        </Avatar>
                                    </IconButton>
                                </motion.div>
                            </Tooltip>

                            <motion.div
                                variants={buttonVariants}
                                initial="idle"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Tooltip title={showAdd ? "Close Form" : "Add Task"} arrow placement="bottom">
                                    <IconButton
                                        size="small"
                                        onClick={onAdd}
                                        sx={{
                                            bgcolor: showAdd 
                                                ? alpha(theme.palette.error.main, 0.12) 
                                                : alpha(theme.palette.success.main, 0.12),
                                            color: showAdd 
                                                ? theme.palette.error.main 
                                                : theme.palette.success.main,
                                            "&:hover": {
                                                bgcolor: showAdd 
                                                    ? alpha(theme.palette.error.main, 0.2) 
                                                    : alpha(theme.palette.success.main, 0.2),
                                            },
                                            transition: "all 0.2s",
                                            width: { xs: 36, sm: 40 },
                                            height: { xs: 36, sm: 40 },
                                            border: `1px solid ${showAdd 
                                                ? alpha(theme.palette.error.main, 0.2) 
                                                : alpha(theme.palette.success.main, 0.2)}`,
                                            boxShadow: `0 2px 6px ${showAdd 
                                                ? alpha(theme.palette.error.main, 0.15) 
                                                : alpha(theme.palette.success.main, 0.15)}`,
                                        }}
                                    >
                                        {showAdd ? <CloseIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Profile Menu */}
            {isMobile ? (
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onClose={handleProfileMenuClose}
                    onOpen={() => {}}
                    swipeAreaWidth={0}
                    disableSwipeToOpen
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            px: 1.5,
                            pb: 3,
                            pt: 1,
                            backgroundImage: theme.palette.mode === 'dark'
                                ? `linear-gradient(rgba(22, 28, 36, 0.95), rgba(22, 28, 36, 0.98))`
                                : `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))`,
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            boxShadow: `0 -5px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                        }
                    }}
                >
                    <Box sx={{ 
                        width: '40px', 
                        height: '5px', 
                        bgcolor: alpha(theme.palette.text.disabled, 0.3),
                        borderRadius: '4px',
                        mx: 'auto',
                        mb: 2
                    }} />
                    
                    <Box sx={{ 
                        px: 2, 
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Avatar 
                            sx={{
                                width: 45,
                                height: 45,
                                fontSize: "1rem",
                                fontWeight: 'bold',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                boxShadow: theme.shadows[3],
                            }}
                        >
                            {currentUser && currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : "U"}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {getUserName()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {currentUser?.email}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                    
                    <MenuItem 
                        onClick={() => handleNavigate("/profile")} 
                        sx={{ 
                            borderRadius: 2, 
                            my: 0.5,
                            py: 1.25,
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            }
                        }}
                    >
                        <ListItemIcon>
                            <PersonIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="My Profile" 
                            secondary="View and edit your profile" 
                            primaryTypographyProps={{ fontWeight: 500 }}
                        />
                    </MenuItem>
                    
                    <MenuItem 
                        onClick={() => handleNavigate("/settings")} 
                        sx={{ 
                            borderRadius: 2, 
                            my: 0.5,
                            py: 1.25,
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            }
                        }}
                    >
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Settings" 
                            secondary="App preferences and categories" 
                            primaryTypographyProps={{ fontWeight: 500 }}
                        />
                    </MenuItem>
                    
                    <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                    
                    <MenuItem 
                        onClick={onLogout} 
                        sx={{ 
                            color: theme.palette.error.main, 
                            borderRadius: 2, 
                            my: 0.5,
                            py: 1.25,
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.08),
                            }
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText 
                            primary="Logout" 
                            secondary="Sign out of your account" 
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ color: alpha(theme.palette.error.main, 0.7) }}
                        />
                    </MenuItem>
                </SwipeableDrawer>
            ) : (
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                        sx: {
                            mt: 1.5,
                            minWidth: 250,
                            maxWidth: "90vw",
                            boxShadow: theme.shadows[4],
                            borderRadius: "14px",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            backgroundImage: theme.palette.mode === 'dark'
                                ? `linear-gradient(rgba(22, 28, 36, 0.95), rgba(22, 28, 36, 0.98))`
                                : `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))`,
                            backdropFilter: 'blur(10px)',
                            "& .MuiMenuItem-root": {
                                px: 2,
                                py: 1,
                                my: 0.5,
                                borderRadius: "10px",
                                mx: 1,
                                width: "calc(100% - 16px)",
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <Box sx={{ 
                        px: 2, 
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Avatar 
                            sx={{
                                width: 45,
                                height: 45,
                                fontSize: "1rem",
                                fontWeight: 'bold',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                boxShadow: theme.shadows[3],
                            }}
                        >
                            {currentUser && currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : "U"}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {getUserName()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {currentUser?.email}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                    
                    <MenuItem 
                        onClick={() => handleNavigate("/profile")}
                        sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            }
                        }}
                    >
                        <ListItemIcon>
                            <PersonIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        My Profile
                    </MenuItem>
                    <MenuItem 
                        onClick={() => handleNavigate("/settings")}
                        sx={{ 
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                            }
                        }}
                    >
                        <ListItemIcon>
                            <SettingsIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                    <MenuItem 
                        onClick={onLogout} 
                        sx={{ 
                            color: theme.palette.error.main,
                            transition: 'all 0.2s',
                            '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.08),
                            }
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            )}

            {/* Notifications Menu/Drawer */}
            {isMobile ? (
                <SwipeableDrawer
                    anchor="bottom"
                    open={notificationsOpen}
                    onClose={handleNotificationsClose}
                    onOpen={() => {}}
                    swipeAreaWidth={0}
                    disableSwipeToOpen
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            maxHeight: '85vh',
                            px: 1.5,
                            pb: 3,
                            pt: 1,
                            backgroundImage: theme.palette.mode === 'dark'
                                ? `linear-gradient(rgba(22, 28, 36, 0.95), rgba(22, 28, 36, 0.98))`
                                : `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))`,
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            boxShadow: `0 -5px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                        }
                    }}
                >
                    <Box sx={{ 
                        width: '40px', 
                        height: '5px', 
                        bgcolor: alpha(theme.palette.text.disabled, 0.3),
                        borderRadius: '4px',
                        mx: 'auto',
                        mb: 2
                    }} />
                    
                    <Box sx={{ 
                        p: 2, 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center" 
                    }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <NotificationsIcon color="warning" />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Notifications
                            </Typography>
                        </Stack>
                        <Badge
                            badgeContent={notifications.length}
                            color="warning"
                            sx={{
                                "& .MuiBadge-badge": {
                                    fontSize: "0.75rem",
                                    background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                                },
                            }}
                        >
                            <Chip 
                                label="New" 
                                size="small" 
                                color="warning" 
                                sx={{ 
                                    height: 24,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    px: 0.5
                                }} 
                            />
                        </Badge>
                    </Box>
                    <Divider />
                    <List sx={{ maxHeight: '40vh', overflow: 'auto', py: 0 }}>
                        {notifications.length === 0 ? (
                            <Box 
                                sx={{ 
                                    py: 6, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center'
                                }}
                            >
                                <Box sx={{ 
                                    p: 2, 
                                    bgcolor: alpha(theme.palette.background.default, 0.8),
                                    borderRadius: '50%',
                                    mb: 2
                                }}>
                                    <NotificationsIcon color="disabled" fontSize="large" />
                                </Box>
                                <Typography color="text.secondary" align="center">
                                    No notifications yet
                                </Typography>
                            </Box>
                        ) : (
                            notifications.map((notification) => (
                                <ListItem 
                                    key={notification.id} 
                                    onClick={() => markAsRead(notification.id)}
                                    button
                                    divider
                                    sx={{ 
                                        py: 1.5,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        }
                                    }}
                                >
                                    <Box sx={{ mr: 2 }}>
                                        <Avatar 
                                            sx={{ 
                                                width: 42, 
                                                height: 42,
                                                bgcolor: alpha(
                                                    notification.type === 'reminder' 
                                                        ? theme.palette.warning.main 
                                                        : notification.type === 'success'
                                                            ? theme.palette.success.main
                                                            : theme.palette.info.main,
                                                    0.1
                                                ),
                                                color: notification.type === 'reminder' 
                                                    ? theme.palette.warning.main 
                                                    : notification.type === 'success'
                                                        ? theme.palette.success.main
                                                        : theme.palette.info.main,
                                            }}
                                        >
                                            {getNotificationIcon(notification.type)}
                                        </Avatar>
                                    </Box>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body2" color="text.secondary">
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    {notification.time}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                    <Box sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="warning"
                            onClick={markAllAsRead}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                py: 1.25,
                                boxShadow: `0 4px 10px ${alpha(theme.palette.warning.main, 0.25)}`,
                                background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                                '&:hover': {
                                    background: `linear-gradient(90deg, ${theme.palette.warning.dark}, ${theme.palette.warning.dark})`,
                                    boxShadow: `0 6px 15px ${alpha(theme.palette.warning.main, 0.35)}`,
                                }
                            }}
                        >
                            Mark all as read
                        </Button>
                    </Box>
                </SwipeableDrawer>
            ) : (
                <Menu
                    anchorEl={notificationsAnchor}
                    open={notificationsOpen}
                    onClose={handleNotificationsClose}
                    PaperProps={{
                        sx: {
                            mt: 1.5,
                            width: { xs: "calc(100vw - 32px)", sm: 360 },
                            maxWidth: "100%",
                            maxHeight: { xs: "70vh", sm: 450 },
                            boxShadow: theme.shadows[4],
                            borderRadius: "14px",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            backgroundImage: theme.palette.mode === 'dark'
                                ? `linear-gradient(rgba(22, 28, 36, 0.95), rgba(22, 28, 36, 0.98))`
                                : `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))`,
                            backdropFilter: 'blur(10px)',
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <Box sx={{ 
                        p: 2, 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center" 
                    }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <NotificationsIcon color="warning" />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Notifications
                            </Typography>
                        </Stack>
                        <Badge
                            badgeContent={notifications.length}
                            color="warning"
                            sx={{
                                "& .MuiBadge-badge": {
                                    fontSize: "0.75rem",
                                    background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                                },
                            }}
                        >
                            <Chip 
                                label="New" 
                                size="small" 
                                color="warning" 
                                sx={{ 
                                    height: 24,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    borderRadius: '6px'
                                }} 
                            />
                        </Badge>
                    </Box>
                    <Divider />
                    <Box sx={{ maxHeight: { xs: "50vh", sm: 320 }, overflow: "auto" }}>
                        {notifications.length === 0 ? (
                            <Box 
                                sx={{ 
                                    py: 6, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center'
                                }}
                            >
                                <Box sx={{ 
                                    p: 2, 
                                    bgcolor: alpha(theme.palette.background.default, 0.8),
                                    borderRadius: '50%',
                                    mb: 2
                                }}>
                                    <NotificationsIcon color="disabled" fontSize="large" />
                                </Box>
                                <Typography color="text.secondary" align="center">
                                    No notifications yet
                                </Typography>
                            </Box>
                        ) : (
                            notifications.map((notification) => (
                                <MenuItem 
                                    key={notification.id} 
                                    onClick={() => markAsRead(notification.id)} 
                                    sx={{ 
                                        py: 1.5,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 1.5
                                    }}
                                >
                                    <Avatar 
                                        sx={{ 
                                            width: 40, 
                                            height: 40,
                                            bgcolor: alpha(
                                                notification.type === 'reminder' 
                                                    ? theme.palette.warning.main 
                                                    : notification.type === 'success'
                                                        ? theme.palette.success.main
                                                        : theme.palette.info.main,
                                                0.1
                                            ),
                                            color: notification.type === 'reminder' 
                                                ? theme.palette.warning.main 
                                                : notification.type === 'success'
                                                    ? theme.palette.success.main
                                                    : theme.palette.info.main,
                                        }}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {notification.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {notification.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            {notification.time}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))
                        )}
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="warning"
                            size="medium"
                            onClick={markAllAsRead}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                py: 1,
                                boxShadow: `0 4px 10px ${alpha(theme.palette.warning.main, 0.25)}`,
                                background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                                '&:hover': {
                                    background: `linear-gradient(90deg, ${theme.palette.warning.dark}, ${theme.palette.warning.dark})`,
                                    boxShadow: `0 6px 15px ${alpha(theme.palette.warning.main, 0.35)}`,
                                }
                            }}
                        >
                            Mark all as read
                        </Button>
                    </Box>
                </Menu>
            )}

            {/* Help Dialog */}
            <Dialog 
                open={helpDialogOpen} 
                onClose={handleHelpClose}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
                TransitionComponent={Slide}
                TransitionProps={{ direction: "up" }}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : '16px',
                        margin: isMobile ? 0 : 2,
                        height: isMobile ? '100%' : 'auto',
                        backgroundImage: theme.palette.mode === 'dark'
                            ? `linear-gradient(rgba(22, 28, 36, 0.95), rgba(22, 28, 36, 0.98))`
                            : `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))`,
                        backdropFilter: 'blur(10px)',
                        border: !isMobile ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                        boxShadow: theme.shadows[5],
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`
                }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            sx={{ 
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main
                            }}
                        >
                            <HelpIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                            TaskTracker Help
                        </Typography>
                    </Stack>
                    <IconButton 
                        onClick={handleHelpClose} 
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            '&:hover': {
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" color="error" />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 2, sm: 1 } }}>
                    <List sx={{ '& .MuiListItem-root': { py: 2 } }}>
                        <ListItem
                            sx={{
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                bgcolor: alpha(theme.palette.success.main, 0.05),
                                mb: 2,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '5px',
                                    height: '100%',
                                    bgcolor: theme.palette.success.main
                                }
                            }}
                        >
                            <ListItemText 
                                primary={
                                    <Typography variant="subtitle1" fontWeight={600} color={theme.palette.success.main}>
                                        Adding Tasks
                                    </Typography>
                                }
                                secondary="Click the + button in the top right to add a new task. Fill in the required details and click Save." 
                                secondaryTypographyProps={{ color: 'text.secondary' }}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                mb: 2,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '5px',
                                    height: '100%',
                                    bgcolor: theme.palette.primary.main
                                }
                            }}
                        >
                            <ListItemText 
                                primary={
                                    <Typography variant="subtitle1" fontWeight={600} color={theme.palette.primary.main}>
                                        Editing Tasks
                                    </Typography>
                                }
                                secondary="Click the edit icon on any task to modify its details." 
                                secondaryTypographyProps={{ color: 'text.secondary' }}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                bgcolor: alpha(theme.palette.info.main, 0.05),
                                mb: 2,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '5px',
                                    height: '100%',
                                    bgcolor: theme.palette.info.main
                                }
                            }}
                        >
                            <ListItemText 
                                primary={
                                    <Typography variant="subtitle1" fontWeight={600} color={theme.palette.info.main}>
                                        Dashboard
                                    </Typography>
                                }
                                secondary="View task statistics and upcoming/overdue tasks on the dashboard page." 
                                secondaryTypographyProps={{ color: 'text.secondary' }}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                                bgcolor: alpha(theme.palette.secondary.main, 0.05),
                                mb: 2,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '5px',
                                    height: '100%',
                                    bgcolor: theme.palette.secondary.main
                                }
                            }}
                        >
                            <ListItemText 
                                primary={
                                    <Typography variant="subtitle1" fontWeight={600} color={theme.palette.secondary.main}>
                                        Categories
                                    </Typography>
                                }
                                secondary="Manage task categories in the Settings page." 
                                secondaryTypographyProps={{ color: 'text.secondary' }}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                bgcolor: alpha(theme.palette.warning.main, 0.05),
                                mb: 2,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '5px',
                                    height: '100%',
                                    bgcolor: theme.palette.warning.main
                                }
                            }}
                        >
                            <ListItemText 
                                primary={
                                    <Typography variant="subtitle1" fontWeight={600} color={theme.palette.warning.main}>
                                        Dark Mode
                                    </Typography>
                                }
                                secondary="Toggle between light and dark mode in the sidebar or settings page." 
                                secondaryTypographyProps={{ color: 'text.secondary' }}
                            />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: { xs: 2, sm: 1.5 } }}>
                    <Button 
                        onClick={handleHelpClose} 
                        variant="contained"
                        size="large"
                        startIcon={<CheckIcon />}
                        sx={{ 
                            borderRadius: 2,
                            boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.25)}`,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            fontWeight: 600,
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            '&:hover': {
                                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.dark})`,
                                boxShadow: `0 6px 15px ${alpha(theme.palette.primary.main, 0.35)}`,
                            }
                        }}
                    >
                        Got it!
                    </Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
};