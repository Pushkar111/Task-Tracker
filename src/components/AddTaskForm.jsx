import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { 
    TextField, 
    FormControlLabel, 
    Checkbox, 
    Button, 
    MenuItem, 
    Box, 
    Paper, 
    Typography, 
    Grid, 
    Chip,
    InputAdornment,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
    Collapse,
    CircularProgress
} from "@mui/material";
import { 
    Event as EventIcon, 
    PriorityHigh as PriorityIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    Alarm as AlarmIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Expand as ExpandIcon,
    ExpandLess as ExpandLessIcon,
    Error as ErrorIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from "framer-motion";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAuth } from "../context/AuthContext";
import { CategoryService } from "../services/CategoryService";

// Priority color mapping
const priorityColors = {
    low: 'success',
    normal: 'primary',
    high: 'warning',
    urgent: 'error'
};

// Component for the priority selector with visual indicators
const PrioritySelector = ({ field, error }) => {
    const priorities = [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

    return (
        <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ ml: 1 }}>
                Priority
            </Typography>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1,
                    mb: error ? 3 : 1 
                }}
            >
                {priorities.map((priority) => (
                    <Chip
                        key={priority.value}
                        label={priority.label}
                        onClick={() => field.onChange(priority.value)}
                        color={priorityColors[priority.value]}
                        variant={field.value === priority.value ? "filled" : "outlined"}
                        sx={{ 
                            px: 1,
                            fontWeight: field.value === priority.value ? 'bold' : 'normal',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }
                        }}
                    />
                ))}
            </Box>
            {error && (
                <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                    {error.message}
                </Typography>
            )}
        </Box>
    );
};

export const AddTaskForm = ({ addTask, onCancel }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [expanded, setExpanded] = useState(false);
    const [showForm, setShowForm] = useState(true);
    
    // Add state for categories from Firestore
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState(null);
    const { currentUser } = useAuth();

    // Fetch categories from Firestore when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            if (!currentUser) {
                setCategories([]);
                setLoadingCategories(false);
                return;
            }
            
            try {
                setLoadingCategories(true);
                const userCategories = await CategoryService.getUserCategories(currentUser.uid);
                setCategories(userCategories);
                setCategoryError(null);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setCategoryError("Failed to load categories");
                // Set some default categories in case of error
                setCategories([
                    { id: '1', name: 'Work' },
                    { id: '2', name: 'Personal' },
                    { id: '3', name: 'Study' }
                ]);
            } finally {
                setLoadingCategories(false);
            }
        };
        
        fetchCategories();
    }, [currentUser]);

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid, isDirty }
    } = useForm({
        defaultValues: {
            Task: "",
            DayTime: "",
            description: "",
            priority: "normal",
            category: "",
            dueDate: "",
            Reminder: false,
        }
    });

    const onSubmit = async (data) => {
        try {
            // Safe conversion of dueDate to ISO string
            if (data.dueDate) {
                try {
                    if (typeof data.dueDate === 'string') {
                        const date = new Date(data.dueDate);
                        if (!isNaN(date.getTime())) {
                            data.dueDate = date.toISOString();
                        }
                    } else if (data.dueDate instanceof Date) {
                        data.dueDate = data.dueDate.toISOString();
                    }
                } catch (error) {
                    console.error("Error processing due date:", error);
                }
            }
            
            // Add task with current timestamp
            await addTask({
                ...data,
                createdAt: new Date().toISOString()
            });
            
            // Animation before clearing form
            setShowForm(false);
            setTimeout(() => {
                reset();
                setShowForm(true);
                setExpanded(false);
            }, 300);

        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 24, 
                duration: 0.3 
            }
        },
        exit: { 
            opacity: 0, 
            y: -20, 
            transition: { duration: 0.2 } 
        }
    };

    const expandButtonVariants = {
        collapsed: { rotate: 0 },
        expanded: { rotate: 180 }
    };

    // Function to render the category dropdown with loading state
    const renderCategoryField = () => {
        if (loadingCategories) {
            return (
                <TextField
                    label="Category"
                    fullWidth
                    disabled
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CategoryIcon color="primary" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <CircularProgress size={20} />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        }
                    }}
                />
            );
        }

        if (categoryError) {
            return (
                <TextField
                    label="Category"
                    fullWidth
                    error
                    helperText={categoryError}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <ErrorIcon color="error" />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        }
                    }}
                />
            );
        }

        return (
            <Controller
                name="category"
                control={control}
                render={({ field }) => (
                    <TextField 
                        {...field} 
                        select 
                        label="Category" 
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CategoryIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.name}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />
        );
    };

    return (
        <AnimatePresence mode="wait">
            {showForm && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 3, 
                            mb: 3, 
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper,
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography 
                                variant="h6" 
                                component="h2" 
                                sx={{ 
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    '&::before': {
                                        content: '""',
                                        display: 'inline-block',
                                        width: 4,
                                        height: 24,
                                        backgroundColor: theme.palette.primary.main,
                                        marginRight: 1.5,
                                        borderRadius: 1
                                    }
                                }}
                            >
                                Add New Task
                            </Typography>
                            
                            <IconButton 
                                onClick={() => setExpanded(!expanded)}
                                size="small"
                                sx={{ backgroundColor: 'background.default' }}
                            >
                                <motion.div
                                    animate={expanded ? 'expanded' : 'collapsed'}
                                    variants={expandButtonVariants}
                                >
                                    {expanded ? <ExpandLessIcon /> : <ExpandIcon />}
                                </motion.div>
                            </IconButton>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="Task"
                                        control={control}
                                        rules={{ required: "Task name is required" }}
                                        render={({ field }) => (
                                            <TextField 
                                                {...field} 
                                                label="Task Name" 
                                                fullWidth 
                                                error={!!errors.Task} 
                                                helperText={errors.Task?.message}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AddIcon color="primary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Collapse in={expanded} timeout={300} unmountOnExit>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                {renderCategoryField()}
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Controller
                                                    name="priority"
                                                    control={control}
                                                    defaultValue="normal"
                                                    render={({ field }) => (
                                                        <PrioritySelector field={field} error={errors.priority} />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({ field }) => (
                                                        <TextField 
                                                            {...field} 
                                                            label="Description" 
                                                            multiline 
                                                            rows={3} 
                                                            fullWidth 
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                                                        <DescriptionIcon color="primary" />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 2,
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Controller
                                                    name="DayTime"
                                                    control={control}
                                                    rules={{ required: "Day & Time is required" }}
                                                    render={({ field }) => (
                                                        <TextField 
                                                            {...field} 
                                                            label="Day & Time" 
                                                            fullWidth 
                                                            error={!!errors.DayTime} 
                                                            helperText={errors.DayTime?.message}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <EventIcon color="primary" />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 2,
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Controller
                                                        name="dueDate"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <DateTimePicker
                                                                label="Due Date"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                slotProps={{
                                                                    textField: {
                                                                        fullWidth: true,
                                                                        variant: 'outlined',
                                                                        InputProps: {
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <AlarmIcon color="primary" />
                                                                                </InputAdornment>
                                                                            ),
                                                                        },
                                                                        sx: {
                                                                            '& .MuiOutlinedInput-root': {
                                                                                borderRadius: 2,
                                                                            }
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={
                                                        <Controller
                                                            name="Reminder"
                                                            control={control}
                                                            defaultValue={false}
                                                            render={({ field }) => (
                                                                <Checkbox
                                                                    {...field}
                                                                    checked={field.value}
                                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                                    color="primary"
                                                                />
                                                            )}
                                                        />
                                                    }
                                                    label={
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <AlarmIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                                                            <Typography>Set Reminder</Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Collapse>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', gap: 2, mt: 1 }}>
                                        {onCancel && (
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                startIcon={<CloseIcon />}
                                                onClick={onCancel}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting || loadingCategories}
                                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                            sx={{ 
                                                borderRadius: 2,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    boxShadow: '0 6px 10px rgba(0,0,0,0.1)',
                                                },
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0))',
                                                    zIndex: 1,
                                                }
                                            }}
                                        >
                                            Save Task
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </motion.div>
            )}
        </AnimatePresence>
    );
};