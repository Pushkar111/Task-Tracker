import { memo } from "react";
import React, { useEffect, useState } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    ListItemButton,
    Tooltip,
    Typography,
    Avatar,
    Badge,
    alpha,
    SwipeableDrawer,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    CheckCircle as TaskIcon,
    BarChart as AnalyticsIcon,
    Settings as SettingsIcon,
    ChevronLeft,
    Logout as LogoutIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { TaskService } from "../services/TaskService";

const Sidebar = ({ open, onToggle, onLogout, toggleTheme, currentTheme }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const location = useLocation();
    const { currentUser } = useAuth();

    // State for task counts
    const [pendingTasksCount, setPendingTasksCount] = useState(0);
    const [overdueTasksCount, setOverdueTasksCount] = useState(0);

    // Function to check if a date is before today
    const isBeforeDate = (dateStr, compareDate) => {
        if (!dateStr) return false;
        const taskDate = new Date(dateStr);
        return taskDate < compareDate;
    };

    // Fetch tasks from Firestore when component mounts or user changes
    useEffect(() => {
        const fetchTaskCounts = async () => {
            if (!currentUser) {
                setPendingTasksCount(0);
                setOverdueTasksCount(0);
                return;
            }

            try {
                const userTasks = await TaskService.getUserTasks(currentUser.uid);

                // Calculate pending tasks
                const pending = userTasks.filter((task) => !task.completed).length;
                setPendingTasksCount(pending);

                // Calculate overdue tasks
                const overdue = userTasks.filter((task) => !task.completed && task.dueDate && isBeforeDate(task.dueDate, new Date())).length;
                setOverdueTasksCount(overdue);
            } catch (error) {
                console.error("Error fetching task counts:", error);
            }
        };

        fetchTaskCounts();
    }, [currentUser]);

    // Dynamic menu items with badges from Firestore data
    const menuItems = [
        {
            text: "Tasks",
            icon: <TaskIcon />,
            path: "/",
            badge: pendingTasksCount,
        },
        {
            text: "Dashboard",
            icon: <DashboardIcon />,
            path: "/dashboard",
            badge: overdueTasksCount,
        },
        {
            text: "Analytics",
            icon: <AnalyticsIcon />,
            path: "/analytics",
            badge: 0,
        },
        {
            text: "Settings",
            icon: <SettingsIcon />,
            path: "/settings",
            badge: 0,
        },
    ];

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
            },
        }),
    };

    const toggleDrawer = () => {
        onToggle(!open);
    };

    const openDrawer = () => {
        onToggle(true);
    };

    // Profile card that appears at the top of the sidebar
    const ProfileCard = () => {
        if (!currentUser) return null;

        const userInitials = currentUser.email ? currentUser.email.substring(0, 2).toUpperCase() : "U";

        const userName = currentUser.displayName || currentUser.email?.split("@")[0] || "User";

        if (!open) {
            // Compact version for closed sidebar
            return (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Tooltip title={userName} placement="right">
                            <Avatar
                                sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: theme.palette.primary.main,
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    boxShadow: theme.shadows[3],
                                    cursor: "pointer",
                                }}>
                                {userInitials}
                            </Avatar>
                        </Tooltip>
                    </motion.div>
                </Box>
            );
        }

        return (
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        sx={{
                            width: 45,
                            height: 45,
                            bgcolor: theme.palette.primary.main,
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                        }}>
                        {userInitials}
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            {userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {currentUser.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        );
    };

    // Use SwipeableDrawer for mobile devices for better UX
    const drawerContent = (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 2,
                    px: 2,
                }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                        <Avatar
                            sx={{
                                bgcolor: `${alpha(theme.palette.primary.main, 0.1)}`,
                                color: theme.palette.primary.main,
                                transition: "all 0.3s ease",
                                boxShadow: theme.shadows[3],
                            }}>
                            <TaskIcon fontSize="small" />
                        </Avatar>
                    </motion.div>
                    {open && (
                        <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "1.2rem",
                                    ml: 2,
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    letterSpacing: "0.5px",
                                    textShadow: theme.palette.mode === "dark" ? "0 0 15px rgba(100, 100, 255, 0.2)" : "none",
                                }}>
                                TaskTracker
                            </Typography>
                        </motion.div>
                    )}
                </Box>
                {open && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <IconButton
                            onClick={toggleDrawer}
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                backdropFilter: "blur(5px)",
                                "&:hover": {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                },
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            }}>
                            <ChevronLeft fontSize="small" />
                        </IconButton>
                    </motion.div>
                )}
            </Box>

            <ProfileCard />

            <Divider
                sx={{
                    my: 2,
                    opacity: 0.5,
                    mx: 2,
                    borderColor: alpha(theme.palette.primary.main, 0.1),
                }}
            />

            <List sx={{ px: 1, pt: 1, flexGrow: 1 }}>
                <AnimatePresence>
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item.text}
                            custom={index}
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}>
                            <ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    selected={location.pathname === item.path}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2.5,
                                        py: 1.25,
                                        borderRadius: "12px",
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "all 0.3s",
                                        "&.Mui-selected": {
                                            bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1),
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                left: 0,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: 4,
                                                height: "60%",
                                                borderRadius: "0 4px 4px 0",
                                                backgroundColor: theme.palette.primary.main,
                                                boxShadow: `0 0 8px ${theme.palette.primary.main}`,
                                            },
                                        },
                                        "&:hover": {
                                            bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.08),
                                            transform: "translateX(4px)",
                                            transition: "transform 0.2s ease-out, background-color 0.2s ease",
                                        },
                                    }}>
                                    <Tooltip title={!open ? item.text : ""} placement="right">
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : "auto",
                                                justifyContent: "center",
                                                color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                                                transition: "all 0.2s",
                                            }}>
                                            {item.badge > 0 ? (
                                                <Badge
                                                    badgeContent={item.badge}
                                                    color="error"
                                                    sx={{
                                                        "& .MuiBadge-badge": {
                                                            fontSize: "0.6rem",
                                                            height: "16px",
                                                            minWidth: "16px",
                                                            background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                                                            boxShadow: theme.shadows[2],
                                                        },
                                                    }}>
                                                    {item.icon}
                                                </Badge>
                                            ) : (
                                                item.icon
                                            )}
                                        </ListItemIcon>
                                    </Tooltip>

                                    {open && (
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: location.pathname === item.path ? 600 : 500,
                                                        color: location.pathname === item.path ? theme.palette.text.primary : theme.palette.text.secondary,
                                                        fontSize: "0.9rem",
                                                    }}>
                                                    {item.text}
                                                </Typography>
                                            }
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </List>

            <Box sx={{ p: 2 }}>
                {/* Theme toggle section - visible in both open and closed states */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: open ? "space-between" : "center",
                        mb: 2,
                        mx: 0.5,
                    }}>
                    {open && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                            Theme Mode
                        </Typography>
                    )}

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Tooltip title={!open ? "Toggle Theme" : ""} placement="right">
                            <IconButton
                                size="small"
                                onClick={toggleTheme}
                                sx={{
                                    bgcolor: alpha(currentTheme === "dark" ? theme.palette.warning.main : theme.palette.primary.main, 0.1),
                                    border: `1px solid ${alpha(currentTheme === "dark" ? theme.palette.warning.main : theme.palette.primary.main, 0.2)}`,
                                    "&:hover": {
                                        bgcolor: alpha(currentTheme === "dark" ? theme.palette.warning.main : theme.palette.primary.main, 0.2),
                                    },
                                }}>
                                {currentTheme === "dark" ? (
                                    <LightModeIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                                ) : (
                                    <DarkModeIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                )}
                            </IconButton>
                        </Tooltip>
                    </motion.div>
                </Box>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <ListItemButton
                        onClick={onLogout}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                            borderRadius: "12px",
                            backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.2)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                            "&:hover": {
                                backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.light, 0.2)} 0%, ${alpha(theme.palette.error.main, 0.3)} 100%)`,
                            },
                        }}>
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : "auto",
                                justifyContent: "center",
                                color: theme.palette.error.main,
                            }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        {open && (
                            <ListItemText
                                primary={
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            color: theme.palette.error.main,
                                        }}>
                                        Logout
                                    </Typography>
                                }
                            />
                        )}
                    </ListItemButton>
                </motion.div>
            </Box>
        </>
    );

    // Handle the floating menu button that appears when sidebar is closed
    return (
        <>
            {!open && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                    <IconButton
                        color="inherit"
                        aria-label="open navigation menu"
                        aria-expanded={open}
                        onClick={openDrawer}
                        edge="start"
                        sx={{
                            position: "fixed",
                            // Modified positioning for better mobile placement
                            top: { xs: 70, sm: 16 }, // Move below header on mobile
                            left: 16,
                            zIndex: 1200, // Increased z-index to be above header
                            bgcolor: theme.palette.background.paper,
                            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                            borderRadius: "12px",
                            width: 40,
                            height: 40,
                            "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                            },
                        }}>
                        <MenuIcon />
                    </IconButton>
                </motion.div>
            )}

            {/* Use SwipeableDrawer for mobile and Drawer for desktop */}
            {isMobile ? (
                <SwipeableDrawer
                    variant="temporary"
                    open={open}
                    onOpen={openDrawer}
                    onClose={() => onToggle(false)}
                    ModalProps={{
                        keepMounted: true,
                        BackdropProps: {
                            sx: {
                                backgroundColor: alpha(theme.palette.common.black, 0.5),
                                backdropFilter: "blur(3px)",
                            },
                        },
                    }}
                    sx={{
                        zIndex: 1300, // Higher than header to ensure it appears on top
                        "& .MuiDrawer-paper": {
                            width: 280,
                            boxSizing: "border-box",
                            backgroundColor: theme.palette.background.default,
                            backgroundImage: theme.palette.mode === "dark" ? `linear-gradient(rgba(26, 32, 46, 0.8), rgba(26, 32, 46, 0.8))` : "none",
                            border: "none",
                            boxShadow: theme.shadows[5],
                            // Add top margin to account for the header
                            marginTop: "0px",
                            height: "100%",
                        },
                    }}>
                    {drawerContent}
                </SwipeableDrawer>
            ) : (
                <Drawer
                    variant={isTablet ? "temporary" : "permanent"}
                    open={open}
                    onClose={() => onToggle(false)}
                    sx={{
                        width: open ? 280 : 73,
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                        boxSizing: "border-box",
                        zIndex: 1050, // Ensure proper z-index
                        "& .MuiDrawer-paper": {
                            width: open ? 280 : 73,
                            transition: theme.transitions.create("width", {
                                easing: theme.transitions.easing.sharp,
                                duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
                            }),
                            overflowX: "hidden",
                            backgroundColor: theme.palette.mode === "dark" ? "#111827" : "#ffffff",
                            backgroundImage: theme.palette.mode === "dark" ? `linear-gradient(rgba(26, 32, 46, 0.8), rgba(26, 32, 46, 0.8))` : "none",
                            boxShadow: theme.palette.mode === "dark" ? "4px 0px 16px rgba(0, 0, 0, 0.4)" : "4px 0px 16px rgba(0, 0, 0, 0.05)",
                            border: "none",
                        },
                    }}>
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
};

// export default Sidebar;

export default memo(Sidebar);
