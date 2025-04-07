// import React from 'react'
// import { Task } from './Task'

// export const Tasks = ({tasks, onDelete, toggleReminder, toggleComplete, onTaskUpdate}) => {
//   return (
//     <div>
//         {
//             tasks.map((task) => {
//                 return (
//                     <Task 
//                         key={task.id}
//                         task={task}
//                         handleDelete={onDelete}
//                         toggleReminder={toggleReminder}
//                         toggleComplete={toggleComplete}
//                         onTaskUpdate={onTaskUpdate}
//                     />
//                 )
//             })
//         }
//     </div>
//   )
// }





import React, { useState } from 'react';
import { Task } from './Task';
import { 
    Box, 
    Typography, 
    Paper, 
    Divider, 
    InputBase, 
    IconButton,
    FormControl,
    Select,
    MenuItem,
    Chip,
    Stack,
    useTheme,
    alpha,
    Badge
} from '@mui/material';
import { 
    Search as SearchIcon,
    FilterList as FilterIcon,
    ViewList as ListIcon,
    ViewModule as GridIcon,
    SortByAlpha as SortIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export const Tasks = ({ tasks, onDelete, toggleReminder, toggleComplete, onTaskUpdate }) => {
    const theme = useTheme();
    const [viewMode, setViewMode] = useState('list');
    const [sortBy, setSortBy] = useState('default');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tasks based on status and search query
    const getFilteredTasks = () => {
        let filtered = [...tasks];
        
        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(task => {
                if (filterStatus === 'completed') return task.completed;
                if (filterStatus === 'pending') return !task.completed;
                if (filterStatus === 'reminder') return task.Reminder;
                return true;
            });
        }
        
        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task => 
                task.Task.toLowerCase().includes(query) || 
                (task.description && task.description.toLowerCase().includes(query)) ||
                (task.category && task.category.toLowerCase().includes(query))
            );
        }
        
        // Apply sorting
        if (sortBy === 'name') {
            filtered.sort((a, b) => a.Task.localeCompare(b.Task));
        } else if (sortBy === 'date') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'priority') {
            const priorityOrder = { urgent: 1, high: 2, medium: 3, normal: 4, low: 5 };
            filtered.sort((a, b) => {
                const aValue = priorityOrder[a.priority] || 999;
                const bValue = priorityOrder[b.priority] || 999;
                return aValue - bValue;
            });
        }
        
        return filtered;
    };
    
    const filteredTasks = getFilteredTasks();
    
    // Stats for filter badges
    const completedCount = tasks.filter(task => task.completed).length;
    const pendingCount = tasks.filter(task => !task.completed).length;
    const reminderCount = tasks.filter(task => task.Reminder).length;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    return (
        <Box sx={{mt: 2}}>
            <Paper elevation={0} sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: 3,
                boxShadow: `0 5px 15px ${alpha(theme.palette.text.primary, 0.08)}`
            }}>
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    sx={{ mb: 1 }}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    justifyContent="space-between"
                >
                    {/* Search input */}
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        borderRadius: 2,
                        px: 2,
                        flex: 1
                    }}>
                        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        <InputBase
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ flex: 1 }}
                        />
                    </Box>
                    
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {/* Sort dropdown */}
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                displayEmpty
                                startAdornment={<SortIcon sx={{ mr: 0.5, color: 'text.secondary' }} />}
                                sx={{ 
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(theme.palette.divider, 0.2),
                                    }
                                }}
                            >
                                <MenuItem value="default">Default</MenuItem>
                                <MenuItem value="name">By Name</MenuItem>
                                <MenuItem value="date">By Date</MenuItem>
                                <MenuItem value="priority">By Priority</MenuItem>
                            </Select>
                        </FormControl>
                        
                        {/* Status filter */}
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 130 }}>
                            <Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                displayEmpty
                                startAdornment={<FilterIcon sx={{ mr: 0.5, color: 'text.secondary' }} />}
                                sx={{ 
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: alpha(theme.palette.divider, 0.2),
                                    }
                                }}
                            >
                                <MenuItem value="all">
                                    All Tasks
                                    <Chip size="small" label={tasks.length} sx={{ ml: 1 }} />
                                </MenuItem>
                                <MenuItem value="completed">
                                    Completed
                                    <Badge badgeContent={completedCount} color="success" sx={{ ml: 1 }} />
                                </MenuItem>
                                <MenuItem value="pending">
                                    Pending
                                    <Badge badgeContent={pendingCount} color="warning" sx={{ ml: 1 }} />
                                </MenuItem>
                                <MenuItem value="reminder">
                                    With Reminder
                                    <Badge badgeContent={reminderCount} color="info" sx={{ ml: 1 }} />
                                </MenuItem>
                            </Select>
                        </FormControl>
                        
                        {/* View mode toggle */}
                        <Box sx={{ 
                            display: 'flex',
                            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}>
                            <IconButton 
                                size="small" 
                                onClick={() => setViewMode('list')}
                                sx={{ 
                                    borderRadius: 0,
                                    bgcolor: viewMode === 'list' 
                                        ? alpha(theme.palette.primary.main, 0.1) 
                                        : 'transparent',
                                    color: viewMode === 'list' 
                                        ? theme.palette.primary.main 
                                        : 'text.secondary'
                                }}
                            >
                                <ListIcon />
                            </IconButton>
                            <Divider orientation="vertical" flexItem />
                            <IconButton 
                                size="small" 
                                onClick={() => setViewMode('grid')}
                                sx={{ 
                                    borderRadius: 0,
                                    bgcolor: viewMode === 'grid' 
                                        ? alpha(theme.palette.primary.main, 0.1) 
                                        : 'transparent',
                                    color: viewMode === 'grid' 
                                        ? theme.palette.primary.main 
                                        : 'text.secondary'
                                }}
                            >
                                <GridIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Stack>
                
                {/* Task stats */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    <Chip 
                        color="default" 
                        size="small" 
                        variant="outlined" 
                        label={`Total: ${tasks.length}`} 
                    />
                    <Chip 
                        color="success" 
                        size="small" 
                        variant="outlined" 
                        label={`Completed: ${completedCount}`} 
                    />
                    <Chip 
                        color="warning" 
                        size="small" 
                        variant="outlined" 
                        label={`Pending: ${pendingCount}`} 
                    />
                    {searchQuery && (
                        <Chip 
                            color="info" 
                            size="small" 
                            variant="outlined" 
                            label={`Search results: ${filteredTasks.length}`} 
                            onDelete={() => setSearchQuery('')}
                        />
                    )}
                </Box>
            </Paper>
            
            {filteredTasks.length > 0 ? (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Box sx={{ 
                        display: viewMode === 'grid' ? 'grid' : 'flex',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)'
                        },
                        gap: 2,
                        flexDirection: 'column'
                    }}>
                        <AnimatePresence>
                            {filteredTasks.map((task) => (
                                <Task 
                                    key={task.id}
                                    task={task}
                                    handleDelete={onDelete}
                                    toggleReminder={toggleReminder}
                                    toggleComplete={toggleComplete}
                                    onTaskUpdate={onTaskUpdate}
                                    viewMode={viewMode}
                                />
                            ))}
                        </AnimatePresence>
                    </Box>
                </motion.div>
            ) : (
                <Paper elevation={0} sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    borderRadius: 3,
                    boxShadow: `0 5px 15px ${alpha(theme.palette.text.primary, 0.08)}`
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No tasks found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchQuery ? 'Try a different search term' : 'Add a new task to get started'}
                        </Typography>
                    </motion.div>
                </Paper>
            )}
        </Box>
    );
};