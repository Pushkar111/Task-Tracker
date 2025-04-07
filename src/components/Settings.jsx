import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Switch,
    Divider,
    TextField,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    Chip,
    Snackbar,
    Alert,
    alpha,
    useTheme,
    Tooltip,
    Avatar,
    Stack,
    InputAdornment,
    Zoom,
    Fade,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import {
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Category as CategoryIcon,
    CloudDownload as CloudDownloadIcon,
    DeleteSweep as DeleteSweepIcon,
    Login as LoginIcon,
    Info as InfoIcon,
    Close as CloseIcon,
    Label as LabelIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { CategoryService } from "../services/CategoryService";
import { saveAs } from "file-saver";
import { TaskService } from "../services/TaskService";
import { format } from "date-fns";

export const Settings = ({ toggleTheme, currentTheme }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [newCategory, setNewCategory] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Add states for Firestore data management
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // Fetch categories from Firestore on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const userCategories = await CategoryService.getUserCategories(currentUser.uid);
                setCategories(userCategories);
                setError(null);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load your categories");
                setSnackbar({
                    open: true,
                    message: "Failed to load your categories",
                    severity: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [currentUser]);

    const handleThemeToggle = () => {
        toggleTheme();
    };

    const handleAddCategory = async () => {
        if (newCategory.trim() === "") {
            setSnackbar({
                open: true,
                message: "Category name cannot be empty",
                severity: "error",
            });
            return;
        }

        // Check if category already exists
        if (categories.some((category) => category.name.toLowerCase() === newCategory.toLowerCase())) {
            setSnackbar({
                open: true,
                message: "Category already exists",
                severity: "error",
            });
            return;
        }

        try {
            setLoading(true);
            const categoryToAdd = {
                name: newCategory.trim(),
            };

            const addedCategory = await CategoryService.addCategory(currentUser.uid, categoryToAdd);

            setCategories([...categories, addedCategory]);
            setNewCategory("");
            setError(null);

            setSnackbar({
                open: true,
                message: `Category "${addedCategory.name}" added successfully`,
                severity: "success",
            });
        } catch (err) {
            console.error("Error adding category:", err);
            setError("Failed to add category");
            setSnackbar({
                open: true,
                message: "Failed to add category",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // handleExportData
    const handleExportData = async () => {
        if (!currentUser) {
            setSnackbar({
                open: true,
                message: "You must be logged in to export data",
                severity: "error",
            });
            return;
        }

        try {
            setLoading(true);

            // Fetch all user data
            const userTasks = await TaskService.getUserTasks(currentUser.uid);
            const userCategories = await CategoryService.getUserCategories(currentUser.uid);

            // Create a downloadable JSON object
            const exportData = {
                tasks: userTasks,
                categories: userCategories,
                exportDate: new Date().toISOString(),
                user: {
                    uid: currentUser.uid,
                    email: currentUser.email,
                },
            };

            // Convert to a downloadable file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
            saveAs(blob, `task-tracker-data-${format(new Date(), "yyyy-MM-dd")}.json`);

            setSnackbar({
                open: true,
                message: "Data exported successfully",
                severity: "success",
            });
        } catch (err) {
            console.error("Error exporting data:", err);
            setSnackbar({
                open: true,
                message: "Failed to export data",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // handleClearData
    const handleClearAllData = async () => {
        if (!currentUser) {
            setClearDataDialogOpen(false);
            return;
        }

        try {
            setLoading(true);

            // Delete all user tasks
            await TaskService.deleteAllUserTasks(currentUser.uid);

            // Delete all user categories
            await CategoryService.deleteAllUserCategories(currentUser.uid);

            setCategories([]);

            setSnackbar({
                open: true,
                message: "All data has been cleared successfully",
                severity: "success",
            });
        } catch (err) {
            console.error("Error clearing data:", err);
            setSnackbar({
                open: true,
                message: "Failed to clear data",
                severity: "error",
            });
        } finally {
            setLoading(false);
            setClearDataDialogOpen(false);
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete || !currentUser) {
            setDeleteDialogOpen(false);
            return;
        }

        try {
            setLoading(true);

            await CategoryService.deleteCategory(currentUser.uid, categoryToDelete.id);

            setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
            setError(null);

            setSnackbar({
                open: true,
                message: `Category "${categoryToDelete.name}" deleted successfully`,
                severity: "success",
            });
        } catch (err) {
            console.error("Error deleting category:", err);
            setError("Failed to delete category");
            setSnackbar({
                open: true,
                message: "Failed to delete category",
                severity: "error",
            });
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleClearDataClick = () => {
        setClearDataDialogOpen(true);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
            },
        }),
        hover: {
            y: -5,
            boxShadow: `0 10px 30px -5px ${alpha(theme.palette.common.black, 0.2)}`,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box
                sx={{
                    mb: 4,
                    pb: 2,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        mb: { xs: 1, sm: 0 },
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main} 80%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "-0.5px",
                    }}>
                    Settings
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LightModeIcon
                        sx={{
                            color: currentTheme === "light" ? "warning.main" : "text.disabled",
                            mr: 1,
                            transition: "color 0.3s ease",
                        }}
                    />
                    <Switch
                        checked={currentTheme === "dark"}
                        onChange={handleThemeToggle}
                        color="primary"
                        sx={{
                            "& .MuiSwitch-thumb": {
                                bgcolor: currentTheme === "dark" ? "primary.main" : "warning.main",
                                boxShadow: theme.shadows[1],
                            },
                            "& .MuiSwitch-track": {
                                bgcolor: currentTheme === "dark" ? alpha(theme.palette.primary.main, 0.5) : alpha(theme.palette.warning.main, 0.5),
                                opacity: 0.8,
                            },
                        }}
                    />
                    <DarkModeIcon
                        sx={{
                            color: currentTheme === "dark" ? "primary.main" : "text.disabled",
                            ml: 1,
                            transition: "color 0.3s ease",
                        }}
                    />
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Category Management */}
                <Grid item xs={12} md={6}>
                    <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                height: "100%",
                                overflow: "hidden",
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                backgroundImage:
                                    theme.palette.mode === "dark"
                                        ? `linear-gradient(135deg, ${alpha("#1A202E", 0.7)} 0%, ${alpha("#1A202E", 0.9)} 100%)`
                                        : `linear-gradient(135deg, ${alpha(theme.palette.primary.lighter || "#f5f8ff", 0.2)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                                backdropFilter: "blur(8px)",
                            }}>
                            <Box
                                sx={{
                                    p: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundImage: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)} 70%, transparent)`,
                                }}>
                                <Avatar
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        mr: 2,
                                        width: 48,
                                        height: 48,
                                    }}>
                                    <CategoryIcon />
                                </Avatar>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.primary.main,
                                    }}>
                                    Category Management
                                </Typography>
                            </Box>

                            <Divider />

                            <Box sx={{ p: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Create and manage categories to organize your tasks effectively.
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                                    <TextField
                                        label="New Category"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        sx={{ mr: 1 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LabelIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Enter category name"
                                        disabled={loading}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={loading ? <CircularProgress size={18} /> : <AddIcon />}
                                        onClick={handleAddCategory}
                                        sx={{
                                            height: 40,
                                            boxShadow: theme.shadows[2],
                                            borderRadius: 2,
                                        }}
                                        disabled={loading || !newCategory.trim()}>
                                        Add
                                    </Button>
                                </Box>

                                {/* Show error message if exists */}
                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                                        {error}
                                    </Alert>
                                )}

                                <Paper
                                    variant="outlined"
                                    sx={{
                                        maxHeight: "300px",
                                        overflow: "auto",
                                        borderRadius: 2,
                                        borderColor: alpha(theme.palette.divider, 0.2),
                                        "&::-webkit-scrollbar": {
                                            width: "8px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                            borderRadius: "4px",
                                        },
                                        "&::-webkit-scrollbar-track": {
                                            backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                        },
                                    }}>
                                    {loading && categories.length === 0 ? (
                                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                                            <CircularProgress size={32} />
                                        </Box>
                                    ) : (
                                        <List>
                                            <AnimatePresence>
                                                {categories.length > 0 ? (
                                                    categories.map((category, index) => (
                                                        <motion.div
                                                            key={category.id}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            transition={{ duration: 0.2 }}>
                                                            <ListItem
                                                                sx={{
                                                                    "&:hover": {
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                                    },
                                                                    transition: "background-color 0.2s ease",
                                                                    borderLeft: index === 0 ? "none" : `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                                                                    borderRight: index === categories.length - 1 ? "none" : `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
                                                                }}
                                                                secondaryAction={
                                                                    <Tooltip title="Delete category">
                                                                        <IconButton
                                                                            edge="end"
                                                                            aria-label="delete"
                                                                            onClick={() => handleDeleteClick(category)}
                                                                            size="small"
                                                                            sx={{
                                                                                color: theme.palette.error.main,
                                                                                "&:hover": {
                                                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                                },
                                                                            }}
                                                                            disabled={loading}>
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                }>
                                                                <ListItemText
                                                                    primary={
                                                                        <Typography variant="body2" fontWeight={500}>
                                                                            {category.name}
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </ListItem>
                                                            <Divider sx={{ opacity: 0.5 }} />
                                                        </motion.div>
                                                    ))
                                                ) : (
                                                    <ListItem>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2" color="text.secondary" align="center">
                                                                    No categories found
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography variant="caption" color="text.secondary" align="center" display="block">
                                                                    Add a category to get started
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                )}
                                            </AnimatePresence>
                                        </List>
                                    )}
                                </Paper>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Application Information & Data Management */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                        {/* App Info Card */}
                        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                            <Paper
                                elevation={3}
                                sx={{
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    backgroundImage:
                                        theme.palette.mode === "dark"
                                            ? `linear-gradient(135deg, ${alpha("#1A202E", 0.7)} 0%, ${alpha("#1A202E", 0.9)} 100%)`
                                            : `linear-gradient(135deg, ${alpha(theme.palette.primary.lighter || "#f5f8ff", 0.2)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                                    backdropFilter: "blur(8px)",
                                    position: "relative",
                                }}>
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundImage: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.main, 0.1)}, transparent 70%)`,
                                    }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <InfoIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                                            }}>
                                            Application Information
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <Typography component="span" fontWeight={600} color="primary.main">
                                            TaskTracker Pro
                                        </Typography>{" "}
                                        is a feature-rich task management application designed to help you organize your daily activities efficiently.
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            my: 2,
                                            p: 1,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                                            border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                                        }}>
                                        <Typography variant="caption" sx={{ fontWeight: 600, mr: 1 }}>
                                            Version:
                                        </Typography>
                                        <Chip
                                            label="v2.0.0"
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{
                                                height: 24,
                                                fontWeight: 700,
                                                fontSize: "0.7rem",
                                            }}
                                        />
                                    </Box>

                                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                                        Technologies Used:
                                    </Typography>

                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                        {["React", "Material UI", "Firebase", "Chart.js", "Framer Motion"].map((tech, index) => (
                                            <motion.div
                                                key={tech}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                whileHover={{ scale: 1.1, rotate: 2 }}>
                                                <Chip
                                                    label={tech}
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 500,
                                                        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                                        "& .MuiChip-label": {
                                                            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                                                        },
                                                    }}
                                                />
                                            </motion.div>
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>

                        {/* Cloud Firestore Data Information */}
                        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                            <Paper
                                elevation={3}
                                sx={{
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                                    backgroundImage:
                                        theme.palette.mode === "dark"
                                            ? `linear-gradient(135deg, ${alpha("#1A202E", 0.7)} 0%, ${alpha("#1A202E", 0.9)} 100%)`
                                            : `linear-gradient(135deg, ${alpha(theme.palette.warning.lighter || "#fff9c4", 0.2)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                                    backdropFilter: "blur(8px)",
                                }}>
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundImage: `radial-gradient(circle at bottom left, ${alpha(theme.palette.warning.main, 0.1)}, transparent 70%)`,
                                    }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                color: theme.palette.warning.main,
                                                width: 32,
                                                height: 32,
                                                mr: 1,
                                            }}>
                                            <CloudDownloadIcon fontSize="small" />
                                        </Avatar>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.mode === "dark" ? theme.palette.warning.light : theme.palette.warning.dark,
                                            }}>
                                            Cloud Data
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
                                        Your task data is now stored securely in the cloud with Firebase. Your data is private and only visible to you when you're logged in.
                                    </Typography>

                                    <Box
                                        sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                                            borderRadius: 2,
                                            border: `1px dashed ${alpha(theme.palette.warning.main, 0.3)}`,
                                            mb: 2,
                                        }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            User ID: {currentUser?.uid ? `${currentUser.uid.substring(0, 6)}...${currentUser.uid.substring(currentUser.uid.length - 4)}` : "Not signed in"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            All your data is securely linked to this ID
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            fullWidth
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudDownloadIcon />}
                                            onClick={handleExportData}
                                            disabled={loading || !currentUser}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1,
                                            }}>
                                            Export Data
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            fullWidth
                                            startIcon={<DeleteSweepIcon />}
                                            onClick={handleClearAllData}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1,
                                            }}>
                                            Clear All Data
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </motion.div>

                        {/* User Authentication Status */}
                        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                            <Paper
                                elevation={3}
                                sx={{
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                    backgroundImage:
                                        theme.palette.mode === "dark"
                                            ? `linear-gradient(135deg, ${alpha("#1A202E", 0.7)} 0%, ${alpha("#1A202E", 0.9)} 100%)`
                                            : `linear-gradient(135deg, ${alpha(theme.palette.secondary.lighter || "#e8eaf6", 0.2)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                                    backdropFilter: "blur(8px)",
                                }}>
                                <Box
                                    sx={{
                                        p: 3,
                                        backgroundImage: `radial-gradient(circle at top left, ${alpha(theme.palette.secondary.main, 0.1)}, transparent 70%)`,
                                    }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                color: theme.palette.secondary.main,
                                                width: 32,
                                                height: 32,
                                                mr: 1,
                                            }}>
                                            <LoginIcon fontSize="small" />
                                        </Avatar>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.mode === "dark" ? theme.palette.secondary.light : theme.palette.secondary.dark,
                                            }}>
                                            Authentication Status
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            p: 2,
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            borderRadius: 2,
                                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                            mb: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600} color="success.main">
                                                Signed In
                                            </Typography>
                                            <Typography variant="caption">{currentUser?.email || "User"}</Typography>
                                        </Box>
                                        <Chip label="Active" color="success" size="small" sx={{ fontWeight: 500 }} />
                                    </Box>

                                    <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary }}>
                                        Your data is synchronized across all your devices. All changes are automatically saved to your account.
                                    </Typography>
                                </Box>
                            </Paper>
                        </motion.div>
                    </Stack>
                </Grid>
            </Grid>

            {/* Delete Category Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
                        backgroundImage:
                            theme.palette.mode === "dark"
                                ? `linear-gradient(135deg, ${alpha("#1A202E", 0.8)} 0%, ${alpha("#1A202E", 0.95)} 100%)`
                                : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    },
                }}>
                <DialogTitle
                    sx={{
                        pb: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DeleteIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                        <Typography variant="h6" color="error.main">
                            Confirm Delete
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => setDeleteDialogOpen(false)}
                        size="small"
                        sx={{
                            ml: 2,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                            },
                        }}
                        disabled={loading}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Are you sure you want to delete the category
                        <Typography component="span" color="error" sx={{ mx: 0.5, fontWeight: 600 }}>
                            "{categoryToDelete?.name}"
                        </Typography>
                        ? Tasks with this category will be moved to "Uncategorized".
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                        }}
                        disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            boxShadow: theme.shadows[2],
                        }}
                        disabled={loading}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Clear Data Dialog */}
            <Dialog
                open={clearDataDialogOpen}
                onClose={() => setClearDataDialogOpen(false)}
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
                        backgroundImage:
                            theme.palette.mode === "dark"
                                ? `linear-gradient(135deg, ${alpha("#1A202E", 0.8)} 0%, ${alpha("#1A202E", 0.95)} 100%)`
                                : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    },
                }}>
                <DialogTitle
                    sx={{
                        pb: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DeleteSweepIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                        <Typography variant="h6" color="error.main">
                            Confirm Clear All Data
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => setClearDataDialogOpen(false)}
                        size="small"
                        sx={{
                            ml: 2,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.2),
                            },
                        }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        This action will permanently delete <strong>all your tasks</strong>, <strong>categories</strong>, and <strong>settings</strong>
                        from the cloud. This cannot be undone. Are you sure you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setClearDataDialogOpen(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                        }}
                        disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteSweepIcon />}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            boxShadow: theme.shadows[2],
                        }}
                        onClick={handleClearAllData} // Changed from setClearDataDialogOpen(false) to the actual function
                        disabled={loading}>
                        Clear All Data
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} TransitionComponent={Fade}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: "100%",
                        borderRadius: 2,
                        boxShadow: theme.shadows[3],
                        "& .MuiAlert-icon": {
                            alignItems: "center",
                        },
                    }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
