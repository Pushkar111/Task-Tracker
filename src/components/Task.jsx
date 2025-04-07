import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Chip, 
    IconButton, 
    Card, 
    CardContent, 
    Typography, 
    Box, 
    Tooltip, 
    alpha, 
    useTheme,
    Divider,
    Stack,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    CircularProgress
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { 
    Delete as DeleteIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as AccessTimeIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CalendarMonth as CalendarIcon,
    Description as DescriptionIcon,
    Category as CategoryIcon,
    PriorityHigh as PriorityIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from "../context/AuthContext";
import { CategoryService } from "../services/CategoryService";

export const Task = ({ task, handleDelete, toggleReminder, toggleComplete, onTaskUpdate }) => {
    const [expanded, setExpanded] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editFormData, setEditFormData] = useState(task);
    const [categories, setCategories] = useState([]);
    const { currentUser } = useAuth();
    const [loadingCategories, setLoadingCategories] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.success.main;
            default: return theme.palette.info.main;
        }
    };

    // Fetch categories when edit dialog opens
    useEffect(() => {
        if (editDialogOpen && currentUser) {
            const fetchCategories = async () => {
                setLoadingCategories(true);
                try {
                    const userCategories = await CategoryService.getUserCategories(currentUser.uid);
                    setCategories(userCategories);
                } catch (error) {
                    console.error("Error fetching categories:", error);
                } finally {
                    setLoadingCategories(false);
                }
            };
            
            fetchCategories();
        }
    }, [editDialogOpen, currentUser]);
    
    // Format relative time
    const formatRelativeTime = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.round(diffMs / 1000);
        const diffMin = Math.round(diffSec / 60);
        const diffHour = Math.round(diffMin / 60);
        const diffDay = Math.round(diffHour / 24);
        
        if (diffSec < 60) return 'just now';
        if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
        if (diffDay < 30) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    const taskVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -100 }
    };
    
    const expandVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto' }
    };

    // Generate avatar based on task name
    const getTaskAvatar = () => {
        if (!task.Task) return null;
        
        // Use the first two letters of the task name
        const initials = task.Task.substring(0, 2).toUpperCase();
        
        // Create a deterministic color based on the task name
        const stringToColor = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = '#';
            for (let i = 0; i < 3; i++) {
                const value = (hash >> (i * 8)) & 0xFF;
                color += ('00' + value.toString(16)).substr(-2);
            }
            return color;
        };
        
        return (
            <Avatar 
                sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: task.priority ? getPriorityColor(task.priority) : stringToColor(task.Task),
                    fontSize: '1rem',
                    boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.15)}`
                }}
            >
                {initials}
            </Avatar>
        );
    };

    // Handle edit dialog submission
    const handleEditSubmit = () => {
        onTaskUpdate(task.id, editFormData);
        setEditDialogOpen(false);
    };

    // Handle edit form field changes
    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <motion.div
            layout
            variants={taskVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
        >
            <Card 
                className={`task-card ${task.Reminder ? "reminder" : ""} ${task.completed ? "completed" : ""}`}
                onClick={() => setExpanded(!expanded)}
                sx={{ 
                    mb: 2.5, 
                    borderLeft: task.Reminder ? `4px solid ${getPriorityColor(task.priority || 'normal')}` : 'none',
                    borderRadius: '12px',
                    opacity: task.completed ? 0.8 : 1,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: task.completed 
                        ? alpha(theme.palette.background.paper, 0.7)
                        : theme.palette.background.paper,
                    '&:hover': {
                        transform: task.completed ? 'none' : 'translateY(-3px)',
                        boxShadow: task.completed 
                            ? theme.shadows[1]
                            : theme.shadows[3],
                    },
                    '&::before': task.Reminder ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        backgroundColor: getPriorityColor(task.priority || 'normal'),
                        borderTopLeftRadius: '12px',
                        borderBottomLeftRadius: '12px',
                    } : {},
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        background: task.completed 
                            ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                            : task.Reminder 
                                ? `linear-gradient(90deg, ${getPriorityColor(task.priority || 'normal')}, ${alpha(getPriorityColor(task.priority || 'normal'), 0.7)})`
                                : 'transparent',
                        opacity: 0.8,
                    }
                }}
                elevation={task.completed ? 1 : 2}
            >
                <CardContent sx={{ p: theme.spacing(2, 2.5) }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: isMobile ? 'flex-start' : 'center',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? 1.5 : 0
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2,
                            width: isMobile ? '100%' : 'auto'
                        }}>
                            {getTaskAvatar()}
                            <Box>
                                <Typography 
                                    variant="h6" 
                                    component="div" 
                                    sx={{ 
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed 
                                            ? theme.palette.text.secondary 
                                            : theme.palette.text.primary,
                                        mb: 0.5
                                    }}
                                >
                                    {task.Task}
                                </Typography>
                                <Stack 
                                    direction="row" 
                                    spacing={1} 
                                    alignItems="center"
                                    sx={{ 
                                        color: theme.palette.text.secondary,
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 0.5,
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: '4px',
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        color: theme.palette.text.secondary
                                    }}>
                                        <CalendarIcon fontSize="small" sx={{ width: 12, height: 12 }} />
                                        <Typography variant="caption">{task.DayTime}</Typography>
                                    </Box>
                                    {task.priority && (
                                        <Chip 
                                            size="small" 
                                            label={task.priority}
                                            sx={{ 
                                                height: '22px',
                                                fontSize: '0.7rem',
                                                fontWeight: 500,
                                                backgroundColor: alpha(getPriorityColor(task.priority), 0.15),
                                                color: getPriorityColor(task.priority),
                                                borderRadius: '4px',
                                                '.MuiChip-label': {
                                                    px: 1
                                                }
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ml: 'auto',
                            mt: isMobile ? 0 : 0,
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'flex-end' : 'flex-end'
                        }}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Tooltip title="Toggle Complete">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleComplete(task.id);
                                        }}
                                        sx={{ 
                                            bgcolor: task.completed ? alpha(theme.palette.success.main, 0.1) : 'transparent',
                                            mr: 0.5
                                        }}
                                    >
                                        <CheckCircleIcon 
                                            fontSize="small" 
                                            color={task.completed 
                                                ? "success" 
                                                : "disabled"} 
                                        />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Tooltip title="Toggle Reminder">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleReminder(task.id);
                                        }}
                                        sx={{ 
                                            bgcolor: task.Reminder ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                            mr: 0.5
                                        }}
                                    >
                                        <AccessTimeIcon 
                                            fontSize="small"
                                            color={task.Reminder 
                                                ? "primary" 
                                                : "disabled"} 
                                        />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Tooltip title="Edit Task">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditFormData(task);
                                            setEditDialogOpen(true);
                                        }}
                                        sx={{ 
                                            mr: 0.5,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                            },
                                        }}
                                    >
                                        <EditIcon fontSize="small" color="info" />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Tooltip title="Delete Task">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteConfirmOpen(true);
                                        }}
                                        sx={{ 
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                            },
                                        }}
                                    >
                                        <DeleteIcon 
                                            fontSize="small" 
                                            color="error" 
                                        />
                                    </IconButton>
                                </Tooltip>
                            </motion.div>
                        </Box>
                    </Box>
                    
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                variants={expandVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{ duration: 0.3 }}
                            >
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ mt: 1 }}>
                                    {task.description && (
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                mb: 2, 
                                                whiteSpace: 'pre-wrap',
                                                color: theme.palette.text.secondary,
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {task.description}
                                        </Typography>
                                    )}
                                    
                                    <Stack 
                                        direction="row" 
                                        spacing={1} 
                                        flexWrap="wrap" 
                                        sx={{ mt: 1.5, gap: 1 }}
                                    >
                                        <Chip 
                                            size="small" 
                                            icon={<CategoryIcon fontSize="small" />} 
                                            label={task.category || "Uncategorized"} 
                                            color="primary" 
                                            variant="outlined"
                                            sx={{ 
                                                height: '24px',
                                                borderRadius: '4px',
                                                '& .MuiChip-icon': {
                                                    ml: '6px',
                                                }
                                            }}
                                        />
                                        {task.dueDate && (
                                            <Chip 
                                                size="small" 
                                                icon={<CalendarIcon fontSize="small" />}
                                                label={`Due: ${formatRelativeTime(task.dueDate)}`} 
                                                color={new Date(task.dueDate) < new Date() ? "error" : "info"}
                                                variant="filled"
                                                sx={{ 
                                                    height: '24px',
                                                    borderRadius: '4px',
                                                    fontWeight: new Date(task.dueDate) < new Date() ? 600 : 500,
                                                }}
                                            />
                                        )}
                                        {task.completedAt && (
                                            <Chip 
                                                size="small"
                                                icon={<CheckCircleIcon fontSize="small" />}
                                                label={`Completed: ${formatRelativeTime(task.completedAt)}`} 
                                                color="success"
                                                variant="filled"
                                                sx={{ 
                                                    height: '24px',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <Box 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 1,
                            opacity: 0.7
                        }}
                    >
                        <IconButton 
                            size="small" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(!expanded);
                            }}
                        >
                            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        padding: '8px',
                    },
                }}
            >
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{task.Task}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteConfirmOpen(false)} 
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => {
                            handleDelete(task.id);
                            setDeleteConfirmOpen(false);
                        }} 
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Task Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        padding: '8px',
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Edit Task</Typography>
                    <IconButton size="small" onClick={() => setEditDialogOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Task Name"
                            name="Task"
                            value={editFormData.Task || ''}
                            onChange={handleEditInputChange}
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, color: 'action.active' }}>
                                        <DescriptionIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Day & Time"
                            name="DayTime"
                            value={editFormData.DayTime || ''}
                            onChange={handleEditInputChange}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, color: 'action.active' }}>
                                        <CalendarIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Description"
                            name="description"
                            value={editFormData.description || ''}
                            onChange={handleEditInputChange}
                            multiline
                            rows={3}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, mt: 1.5, color: 'action.active', alignSelf: 'flex-start' }}>
                                        <DescriptionIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            label="Priority"
                            name="priority"
                            value={editFormData.priority || 'normal'}
                            onChange={handleEditInputChange}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, color: 'action.active' }}>
                                        <PriorityIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="normal">Normal</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="urgent">Urgent</MenuItem>
                        </TextField>
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            label="Category"
                            name="category"
                            value={editFormData.category || ''}
                            onChange={handleEditInputChange}
                            disabled={loadingCategories}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, color: 'action.active' }}>
                                        <CategoryIcon fontSize="small" />
                                    </Box>
                                ),
                                endAdornment: loadingCategories ? (
                                    <CircularProgress size={20} />
                                ) : null,
                            }}
                        >
        {/* <MenuItem value=""></MenuItem> */}
        {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
                {category.name}
            </MenuItem>
        ))}
    </TextField>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Due Date"
                            name="dueDate"
                            type="datetime-local"
                            value={editFormData.dueDate ? new Date(editFormData.dueDate).toISOString().slice(0, 16) : ''}
                            onChange={handleEditInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <Box sx={{ mr: 1, color: 'action.active' }}>
                                        <CalendarIcon fontSize="small" />
                                    </Box>
                                ),
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={editFormData.Reminder || false}
                                    onChange={handleEditInputChange}
                                    name="Reminder"
                                    color="primary"
                                />
                            }
                            label="Set Reminder"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary" variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
};