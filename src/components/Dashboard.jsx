import React from 'react';
import { 
    Box, 
    Grid, 
    Paper, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Divider,
    Card, 
    CardContent,
    LinearProgress,
    Chip,
    Stack,
    Avatar,
    useTheme,
    alpha,
    useMediaQuery,
    Container
} from '@mui/material';
import { 
    AccessTime as TimeIcon,
    CheckCircle as CheckIcon,
    PendingActions as PendingIcon,
    Notifications as ReminderIcon,
    CalendarToday as CalendarIcon,
    ArrowUpward as TrendUpIcon,
    Flag as FlagIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export const Dashboard = ({ tasks }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
    
    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const tasksWithReminders = tasks.filter(task => task.Reminder).length;
    
    // Helper functions for date comparison
    const isAfterDate = (date1, date2) => new Date(date1) > new Date(date2);
    const isBeforeDate = (date1, date2) => new Date(date1) < new Date(date2);
    const subtractDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    };
    
    // Format date in a readable way
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: isMobile ? undefined : 'numeric'
        });
    };
    
    // Get upcoming tasks (not completed and have upcoming due dates)
    const upcomingTasks = tasks
        .filter(task => !task.completed && task.dueDate && isAfterDate(task.dueDate, new Date()))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
    
    // Get overdue tasks
    const overdueTasks = tasks
        .filter(task => !task.completed && task.dueDate && isBeforeDate(task.dueDate, new Date()))
        .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
        .slice(0, 5);
    
    // Get recent tasks (added in the past 7 days)
    const recentTasks = tasks
        .filter(task => task.createdAt && isAfterDate(task.createdAt, subtractDays(new Date(), 7)))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    // Group tasks by category
    const tasksByCategory = tasks.reduce((acc, task) => {
        const category = task.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(task);
        return acc;
    }, {});
    
    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.success.main;
            case 'urgent': return theme.palette.error.dark;
            default: return theme.palette.info.main;
        }
    };

    const containerAnimation = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnimation = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    // Responsive styles based on screen size
    const dashboardStyles = {
        container: {
            p: { xs: 1.5, sm: 2, md: 3 }, 
            backgroundColor: alpha(theme.palette.background.default, 0.6), 
            backgroundImage: theme.palette.mode === 'dark' 
                ? `radial-gradient(at 50% 70%, ${alpha(theme.palette.primary.dark, 0.12)} 0px, transparent 50%),
                   radial-gradient(at 80% 20%, ${alpha(theme.palette.secondary.dark, 0.12)} 0px, transparent 50%)`
                : `radial-gradient(at 50% 70%, ${alpha(theme.palette.primary.light, 0.08)} 0px, transparent 50%),
                   radial-gradient(at 80% 20%, ${alpha(theme.palette.secondary.light, 0.08)} 0px, transparent 50%)`,
            minHeight: isLargeScreen ? '85vh' : 'auto',
            overflowX: 'hidden'
        },
        heading: {
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.2rem', lg: '2.5rem' },
            mb: { xs: 2, md: 3 },
            textAlign: { xs: 'center', md: 'left' },
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent'
        },
       statusCard: {
        p: { xs: 2, md: 2.5 },
        height: '100%',
        borderRadius: { xs: 2, md: 3 },
        '&:hover': {
            transform: isTablet ? 'none' : 'translateY(-5px)',
        }
    },
        progressSection: {
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: 2, md: 3 },
            boxShadow: `0 5px 15px ${alpha(theme.palette.text.primary, 0.1)}`
        },
        taskList: {
            maxHeight: { xs: '300px', md: '400px' },
            overflow: 'auto',
            py: 1,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
                width: '6px',
            },
            '&::-webkit-scrollbar-track': {
                background: alpha(theme.palette.background.paper, 0.1),
            },
            '&::-webkit-scrollbar-thumb': {
                background: alpha(theme.palette.primary.main, 0.2),
                borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: alpha(theme.palette.primary.main, 0.3),
            }
        },
        categorySection: {
            p: { xs: 2, sm: 2.5, md: 3 },
            mt: 2,
            borderRadius: { xs: 2, md: 3 },
            boxShadow: `0 5px 15px ${alpha(theme.palette.text.primary, 0.1)}`
        },
        categoryCard: {
            borderRadius: { xs: 1.5, md: 2 },
            overflow: 'hidden',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            height: '100%',
            '&:hover': {
                transform: isTablet ? 'none' : 'translateY(-4px)',
                boxShadow: `0 10px 20px ${alpha(theme.palette.text.primary, 0.08)}`
            }
        }
    };

    return (
        <Box sx={dashboardStyles.container}>
            <Container maxWidth="xl" disableGutters>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h4" gutterBottom component="h1" sx={dashboardStyles.heading}>
                        Task Dashboard
                    </Typography>
                </motion.div>
                
                <motion.div
                    variants={containerAnimation}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Summary Cards */}
                    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: { xs: 3, md: 4 } }}>
                        <Grid item xs={6} sm={6} md={3}>
                            <motion.div variants={itemAnimation}>
                                <Paper elevation={0} sx={{
                                    ...dashboardStyles.statusCard,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.dark, 0.7)})`,
                                    color: 'white',   
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: 'white', 
                                                color: theme.palette.primary.main, 
                                                mr: { xs: 1, md: 1.5 },
                                                width: { xs: 32, md: 40 },
                                                height: { xs: 32, md: 40 }
                                            }}
                                        >
                                            <TimeIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
                                        </Avatar>
                                        <Typography 
                                            variant={isMobile ? "body1" : "h6"} 
                                            sx={{ 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                                            }}
                                        >
                                            Total Tasks
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        variant={isMobile ? "h4" : "h3"} 
                                        sx={{ 
                                            fontWeight: '700', 
                                            mb: 1,
                                            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                                        }}
                                    >
                                        {totalTasks}
                                    </Typography>
                                    <Chip 
                                        size="small" 
                                        label={`${recentTasks.length} new this week`} 
                                        sx={{ 
                                            backgroundColor: alpha(theme.palette.common.white, 0.2),
                                            color: 'white',
                                            '& .MuiChip-label': { 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.65rem', md: '0.75rem' }
                                            },
                                            height: { xs: '20px', md: '24px' }
                                        }} 
                                    />
                                </Paper>
                            </motion.div>
                        </Grid>
                        
                        <Grid item xs={6} sm={6} md={3}>
                            <motion.div variants={itemAnimation}>
                                <Paper elevation={0} sx={{
                                    ...dashboardStyles.statusCard,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.dark, 0.7)})`,
                                    color: 'white'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: 'white', 
                                                color: theme.palette.success.main, 
                                                mr: { xs: 1, md: 1.5 },
                                                width: { xs: 32, md: 40 },
                                                height: { xs: 32, md: 40 }
                                            }}
                                        >
                                            <CheckIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
                                        </Avatar>
                                        <Typography 
                                            variant={isMobile ? "body1" : "h6"} 
                                            sx={{ 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                                            }}
                                        >
                                            Completed
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        variant={isMobile ? "h4" : "h3"} 
                                        sx={{ 
                                            fontWeight: '700', 
                                            mb: 1,
                                            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                                        }}
                                    >
                                        {completedTasks}
                                    </Typography>
                                    <Chip 
                                        size="small" 
                                        icon={<TrendUpIcon style={{ fontSize: isMobile ? 12 : 14, color: 'white' }} />}
                                        label={`${completionPercentage}% completion rate`} 
                                        sx={{ 
                                            backgroundColor: alpha(theme.palette.common.white, 0.2),
                                            color: 'white',
                                            '& .MuiChip-label': { 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.65rem', md: '0.75rem' }
                                            },
                                            height: { xs: '20px', md: '24px' }
                                        }} 
                                    />
                                </Paper>
                            </motion.div>
                        </Grid>
                        
                        <Grid item xs={6} sm={6} md={3}>
                            <motion.div variants={itemAnimation}>
                                <Paper elevation={0} sx={{
                                    ...dashboardStyles.statusCard,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.dark, 0.7)})`,
                                    color: 'white'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: 'white', 
                                                color: theme.palette.warning.main, 
                                                mr: { xs: 1, md: 1.5 },
                                                width: { xs: 32, md: 40 },
                                                height: { xs: 32, md: 40 }
                                            }}
                                        >
                                            <PendingIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
                                        </Avatar>
                                        <Typography 
                                            variant={isMobile ? "body1" : "h6"} 
                                            sx={{ 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                                            }}
                                        >
                                            Pending
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        variant={isMobile ? "h4" : "h3"} 
                                        sx={{ 
                                            fontWeight: '700', 
                                            mb: 1,
                                            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                                        }}
                                    >
                                        {pendingTasks}
                                    </Typography>
                                    <Chip 
                                        size="small" 
                                        label={`${overdueTasks.length} overdue`} 
                                        sx={{ 
                                            backgroundColor: alpha(theme.palette.common.white, 0.2),
                                            color: 'white',
                                            '& .MuiChip-label': { 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.65rem', md: '0.75rem' }
                                            },
                                            height: { xs: '20px', md: '24px' }
                                        }} 
                                    />
                                </Paper>
                            </motion.div>
                        </Grid>
                        
                        <Grid item xs={6} sm={6} md={3}>
                            <motion.div variants={itemAnimation}>
                                <Paper elevation={0} sx={{
                                    ...dashboardStyles.statusCard,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.9)}, ${alpha(theme.palette.info.dark, 0.7)})`,
                                    color: 'white'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: 'white', 
                                                color: theme.palette.info.main, 
                                                mr: { xs: 1, md: 1.5 },
                                                width: { xs: 32, md: 40 },
                                                height: { xs: 32, md: 40 }
                                            }}
                                        >
                                            <ReminderIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
                                        </Avatar>
                                        <Typography 
                                            variant={isMobile ? "body1" : "h6"} 
                                            sx={{ 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
                                            }}
                                        >
                                            Reminders
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        variant={isMobile ? "h4" : "h3"} 
                                        sx={{ 
                                            fontWeight: '700', 
                                            mb: 1,
                                            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
                                        }}
                                    >
                                        {tasksWithReminders}
                                    </Typography>
                                    <Chip 
                                        size="small" 
                                        label={`${Math.round((tasksWithReminders / totalTasks || 0) * 100)}% of tasks`} 
                                        sx={{ 
                                            backgroundColor: alpha(theme.palette.common.white, 0.2),
                                            color: 'white',
                                            '& .MuiChip-label': { 
                                                fontWeight: 500,
                                                fontSize: { xs: '0.65rem', md: '0.75rem' }
                                            },
                                            height: { xs: '20px', md: '24px' }
                                        }} 
                                    />
                                </Paper>
                            </motion.div>
                        </Grid>
                    </Grid>
                </motion.div>
                
                {/* Progress Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Paper elevation={0} sx={dashboardStyles.progressSection}>
                        <Typography 
                            variant={isMobile ? "subtitle1" : "h6"} 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } 
                            }}
                        >
                            Task Completion Progress
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={completionPercentage} 
                                    sx={{ 
                                        height: { xs: 8, md: 10 }, 
                                        borderRadius: 5,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                        }
                                    }}
                                />
                            </Box>
                            <Box minWidth={50} textAlign="right">
                                <Typography 
                                    variant="body2" 
                                    fontWeight="bold" 
                                    color="primary"
                                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                                >
                                    {`${completionPercentage}%`}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? 1 : 0
                        }}>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                            >
                                {`${completedTasks} of ${totalTasks} tasks completed`}
                            </Typography>
                            {totalTasks > 0 && completionPercentage > 50 ? (
                                <Chip 
                                    size="small" 
                                    icon={<CheckIcon style={{ fontSize: isMobile ? 12 : 14 }} />}
                                    label="Great progress!" 
                                    color="success" 
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiChip-label': { 
                                            fontWeight: 500,
                                            fontSize: { xs: '0.7rem', md: '0.75rem' }
                                        },
                                        height: { xs: '24px', md: '24px' }
                                    }} 
                                />
                            ) : totalTasks > 0 ? (
                                <Chip 
                                    size="small" 
                                    label="Keep going!" 
                                    color="primary" 
                                    variant="outlined"
                                    sx={{ 
                                        '& .MuiChip-label': { 
                                            fontWeight: 500,
                                            fontSize: { xs: '0.7rem', md: '0.75rem' }
                                        },
                                        height: { xs: '24px', md: '24px' }
                                    }}
                                />
                            ) : null}
                        </Box>
                    </Paper>
                </motion.div>
                
                {/* Task Lists */}
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 0, md: 1 } }}>
                    {/* Upcoming Tasks */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Paper elevation={0} sx={{ 
                                p: 0, 
                                borderRadius: { xs: 2, md: 3 },
                                overflow: 'hidden',
                                boxShadow: `0 5px 15px ${alpha(theme.palette.text.primary, 0.1)}`
                            }}>
                                <Box sx={{ 
                                    py: { xs: 1.5, md: 2 }, 
                                    px: { xs: 2, md: 3 }, 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    background: theme.palette.mode === 'dark' 
                                        ? `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.9)}, ${alpha(theme.palette.primary.main, 0.7)})`
                                        : `linear-gradient(90deg, ${alpha(theme.palette.primary.light, 0.9)}, ${alpha(theme.palette.primary.main, 0.7)})`,
                                    color: theme.palette.mode === 'dark' ? 'white' : 'white'
                                }}>
                                    <CalendarIcon sx={{ mr: 1.5, fontSize: { xs: 18, md: 24 } }} />
                                    <Typography 
                                        variant={isMobile ? "subtitle1" : "h6"} 
                                        sx={{ 
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', md: '1.25rem' }
                                        }}
                                    >
                                        Upcoming Tasks
                                    </Typography>
                                </Box>
                                <Box sx={dashboardStyles.taskList}>
                                    {upcomingTasks.length > 0 ? (
                                        <List disablePadding>
                                            {upcomingTasks.map((task, index) => (
                                                <React.Fragment key={task.id}>
                                                    <ListItem 
                                                        sx={{ 
                                                            px: { xs: 2, md: 3 }, 
                                                            py: { xs: 1.25, md: 1.5 },
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                                            }
                                                        }}
                                                    >
                                                        <ListItemText 
                                                            primary={
                                                                <Typography 
                                                                    variant="subtitle1" 
                                                                    fontWeight={500} 
                                                                    noWrap 
                                                                    sx={{ 
                                                                        pr: 2,
                                                                        fontSize: { xs: '0.9rem', md: '1rem' }
                                                                    }}
                                                                >
                                                                    {task.Task}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Stack 
                                                                    direction="row" 
                                                                    spacing={{ xs: 0.5, md: 1 }} 
                                                                    mt={0.5} 
                                                                    sx={{ 
                                                                        flexWrap: 'wrap',
                                                                        gap: { xs: 0.5, md: 0 }
                                                                    }}
                                                                >
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        color="text.secondary" 
                                                                        component="span"
                                                                        sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                                                                    >
                                                                        {task.DayTime}
                                                                    </Typography>
                                                                    {task.dueDate && (
                                                                        <Chip 
                                                                            size="small" 
                                                                            label={formatDate(task.dueDate)}
                                                                            sx={{ 
                                                                                height: { xs: 18, md: 20 }, 
                                                                                '& .MuiChip-label': { 
                                                                                    px: { xs: 0.75, md: 1 }, 
                                                                                    py: 0, 
                                                                                    fontSize: { xs: '0.65rem', md: '0.7rem' }, 
                                                                                    fontWeight: 500 
                                                                                }
                                                                            }}
                                                                            color="primary"
                                                                            variant="outlined"
                                                                        />
                                                                    )}
                                                                </Stack>
                                                            }
                                                        />
                                                        {task.priority && (
                                                            <Chip 
                                                                size="small" 
                                                                icon={isMobile ? null : <FlagIcon style={{ fontSize: 14 }} />}
                                                                label={task.priority}
                                                                sx={{ 
                                                                    backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                                                    color: getPriorityColor(task.priority),
                                                                    borderColor: getPriorityColor(task.priority),
                                                                    fontWeight: 500,
                                                                    border: '1px solid',
                                                                    height: { xs: 20, md: 24 },
                                                                    '& .MuiChip-label': {
                                                                        fontSize: { xs: '0.65rem', md: '0.75rem' },
                                                                        px: { xs: 0.75, md: 1 }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </ListItem>
                                                    {index < upcomingTasks.length - 1 && 
                                                        <Divider variant="inset" component="li" sx={{ ml: { xs: 2, md: 3 } }} />}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    ) : (
                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography 
                                                variant="body1" 
                                                color="text.secondary"
                                                sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                                            >
                                                No upcoming tasks
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                    
                    {/* Overdue Tasks */}
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Paper elevation={0} sx={{ 
                                p: 0, 
                                borderRadius: { xs: 2, md: 3 },
                                overflow: 'hidden',
                                boxShadow: `0 5px 15px ${alpha(theme.palette.text.primary, 0.1)}`
                            }}>
                                <Box sx={{ 
                                    py: { xs: 1.5, md: 2 }, 
                                    px: { xs: 2, md: 3 }, 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    background: theme.palette.mode === 'dark' 
                                        ? `linear-gradient(90deg, ${alpha(theme.palette.error.dark, 0.9)}, ${alpha(theme.palette.error.main, 0.7)})`
                                        : `linear-gradient(90deg, ${alpha(theme.palette.error.light, 0.9)}, ${alpha(theme.palette.error.main, 0.7)})`,
                                    color: 'white'
                                }}>
                                    <CalendarIcon sx={{ mr: 1.5, fontSize: { xs: 18, md: 24 } }} />
                                    <Typography 
                                        variant={isMobile ? "subtitle1" : "h6"} 
                                        sx={{ 
                                            fontWeight: 600,
                                            fontSize: { xs: '1rem', md: '1.25rem' }
                                        }}
                                    >
                                        Overdue Tasks
                                    </Typography>
                                </Box>
                                <Box sx={dashboardStyles.taskList}>
                                    {overdueTasks.length > 0 ? (
                                        <List disablePadding>
                                            {overdueTasks.map((task, index) => (
                                                <React.Fragment key={task.id}>
                                                    <ListItem 
                                                        sx={{ 
                                                            px: { xs: 2, md: 3 }, 
                                                            py: { xs: 1.25, md: 1.5 },
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.error.main, 0.05)
                                                            }
                                                        }}
                                                    >
                                                        <ListItemText 
                                                            primary={
                                                                <Typography 
                                                                    variant="subtitle1" 
                                                                    fontWeight={500} 
                                                                    noWrap 
                                                                    sx={{ 
                                                                        pr: 2,
                                                                        fontSize: { xs: '0.9rem', md: '1rem' }
                                                                    }}
                                                                >
                                                                    {task.Task}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Stack 
                                                                    direction="row" 
                                                                    spacing={{ xs: 0.5, md: 1 }} 
                                                                    mt={0.5} 
                                                                    sx={{ 
                                                                        flexWrap: 'wrap',
                                                                        gap: { xs: 0.5, md: 0 }
                                                                    }}
                                                                >
                                                                    <Typography 
                                                                        variant="body2" 
                                                                        color="text.secondary" 
                                                                        component="span"
                                                                        sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                                                                    >
                                                                        {task.DayTime}
                                                                    </Typography>
                                                                    {task.dueDate && (
                                                                        <Chip 
                                                                            size="small" 
                                                                            label={formatDate(task.dueDate)}
                                                                            sx={{ 
                                                                                height: { xs: 18, md: 20 }, 
                                                                                '& .MuiChip-label': { 
                                                                                    px: { xs: 0.75, md: 1 }, 
                                                                                    py: 0, 
                                                                                    fontSize: { xs: '0.65rem', md: '0.7rem' }, 
                                                                                    fontWeight: 500 
                                                                                }
                                                                            }}
                                                                            color="error"
                                                                            variant="outlined"
                                                                        />
                                                                    )}
                                                                </Stack>
                                                            }
                                                        />
                                                        {task.priority && (
                                                            <Chip 
                                                                size="small" 
                                                                icon={isMobile ? null : <FlagIcon style={{ fontSize: 14 }} />}
                                                                label={task.priority}
                                                                sx={{ 
                                                                    backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                                                    color: getPriorityColor(task.priority),
                                                                    borderColor: getPriorityColor(task.priority),
                                                                    fontWeight: 500,
                                                                    border: '1px solid',
                                                                    height: { xs: 20, md: 24 },
                                                                    '& .MuiChip-label': {
                                                                        fontSize: { xs: '0.65rem', md: '0.75rem' },
                                                                        px: { xs: 0.75, md: 1 }
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </ListItem>
                                                    {index < overdueTasks.length - 1 && 
                                                        <Divider variant="inset" component="li" sx={{ ml: { xs: 2, md: 3 } }} />}
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    ) : (
                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography 
                                                variant="body1" 
                                                color="text.secondary"
                                                sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                                            >
                                                No overdue tasks
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </motion.div>
                    </Grid>
                    
                    {/* Categories */}
                    <Grid item xs={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Paper elevation={0} sx={dashboardStyles.categorySection}>
                                <Typography 
                                    variant={isMobile ? "subtitle1" : "h6"} 
                                    gutterBottom 
                                    sx={{ 
                                        fontWeight: 600, 
                                        mb: { xs: 2, md: 3 },
                                        fontSize: { xs: '1rem', md: '1.25rem' }
                                    }}
                                >
                                    Tasks by Category
                                </Typography>
                                <Grid container spacing={{ xs: 1.5, md: 2 }}>
                                    {Object.entries(tasksByCategory).map(([category, categoryTasks]) => {
                                        const completionRate = categoryTasks.filter(t => t.completed).length / categoryTasks.length * 100;
                                        
                                        return (
                                            <Grid item xs={6} sm={4} md={3} lg={3} key={category}>
                                                <Card elevation={0} sx={dashboardStyles.categoryCard}>
                                                    <Box sx={{ 
                                                        height: { xs: 3, md: 4 }, 
                                                        backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                                        width: `${completionRate}%` 
                                                    }} />
                                                    <CardContent sx={{ 
                                                        p: { xs: 1.5, md: 2 },
                                                        '&:last-child': { pb: { xs: 1.5, md: 2 } }
                                                    }}>
                                                        <Typography 
                                                            variant={isMobile ? "subtitle2" : "h6"} 
                                                            color="primary" 
                                                            gutterBottom 
                                                            noWrap
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                                                                mb: { xs: 0.5, md: 1 }
                                                            }}
                                                        >
                                                            {category}
                                                        </Typography>
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'space-between', 
                                                            alignItems: { xs: 'flex-start', md: 'center' }, 
                                                            mb: { xs: 1, md: 2 },
                                                            flexDirection: { xs: 'column', sm: 'row' },
                                                            gap: { xs: 0.5, sm: 0 }
                                                        }}>
                                                            <Typography 
                                                                variant="body2" 
                                                                color="text.secondary"
                                                                sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                                                            >
                                                                {categoryTasks.length} tasks
                                                            </Typography>
                                                            <Chip 
                                                                size="small" 
                                                                label={`${Math.round(completionRate)}% complete`}
                                                                color={completionRate >= 70 ? "success" : completionRate >= 30 ? "primary" : "default"}
                                                                sx={{ 
                                                                    height: { xs: 18, md: 20 }, 
                                                                    '& .MuiChip-label': { 
                                                                        px: { xs: 0.75, md: 1 }, 
                                                                        py: 0, 
                                                                        fontSize: { xs: '0.65rem', md: '0.7rem' }, 
                                                                        fontWeight: 500 
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={completionRate} 
                                                            sx={{ 
                                                                height: { xs: 4, md: 6 }, 
                                                                borderRadius: 3, 
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                '& .MuiLinearProgress-bar': {
                                                                    background: completionRate >= 70 
                                                                        ? `linear-gradient(to right, ${theme.palette.success.light}, ${theme.palette.success.main})`
                                                                        : `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
                                                                }
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};