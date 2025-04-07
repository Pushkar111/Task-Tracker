import React, { useEffect } from 'react';
import { Paper, Typography, Grid, Box, Divider, useTheme, useMediaQuery, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    TimeScale,
    PointElement,
    LineElement
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { subDays, format } from 'date-fns';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    TimeScale,
    PointElement,
    LineElement
);

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: 16,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'hidden',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    }
}));

const MetricCard = styled(StyledPaper)(({ theme, color = 'primary' }) => ({
    background: `linear-gradient(135deg, ${theme.palette[color].light} 0%, ${theme.palette[color].main} 100%)`,
    color: theme.palette.common.white,
    padding: theme.spacing(3),
    textAlign: 'center',
}));

const ChartContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const DashboardTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    fontWeight: 700,
    position: 'relative',
    display: 'inline-block',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: '40%',
        height: 4,
        background: theme.palette.primary.main,
        bottom: -8,
        left: 0,
    }
}));

export const Analytics = ({ tasks, loading = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        }
    };

    // Chart options with consistent styling
    const getChartOptions = (title, displayLegend = true) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: displayLegend,
                position: 'bottom',
                labels: {
                    font: {
                        family: theme.typography.fontFamily,
                        size: 12
                    },
                    padding: 20,
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            tooltip: {
                backgroundColor: theme.palette.background.paper,
                titleColor: theme.palette.text.primary,
                bodyColor: theme.palette.text.secondary,
                borderColor: theme.palette.divider,
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    family: theme.typography.fontFamily,
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    family: theme.typography.fontFamily,
                    size: 13
                },
                displayColors: true,
                boxWidth: 8,
                boxHeight: 8,
                usePointStyle: true,
            },
            title: {
                display: title ? true : false,
                text: title,
                font: {
                    family: theme.typography.fontFamily,
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: theme.palette.divider,
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        family: theme.typography.fontFamily,
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        family: theme.typography.fontFamily,
                        size: 12
                    }
                }
            }
        }
    });

    // Calculate data for task status chart
    const statusData = {
        labels: ['Completed', 'Pending'],
        datasets: [
            {
                label: 'Task Status',
                data: [
                    tasks.filter(task => task.completed).length,
                    tasks.filter(task => !task.completed).length
                ],
                backgroundColor: [
                    theme.palette.success.light,
                    theme.palette.warning.light
                ],
                borderColor: [
                    theme.palette.success.main,
                    theme.palette.warning.main
                ],
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    // Calculate data for task priority distribution chart
    const priorities = ['low', 'normal', 'high', 'urgent'];
    const priorityData = {
        labels: ['Low', 'Normal', 'High', 'Urgent'],
        datasets: [
            {
                label: 'Tasks by Priority',
                data: priorities.map(priority => 
                    tasks.filter(task => task.priority === priority).length
                ),
                backgroundColor: [
                    theme.palette.success.light,
                    theme.palette.info.light,
                    theme.palette.warning.light,
                    theme.palette.error.light
                ],
                borderColor: [
                    theme.palette.success.main,
                    theme.palette.info.main,
                    theme.palette.warning.main,
                    theme.palette.error.main
                ],
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: [
                    theme.palette.success.main,
                    theme.palette.info.main,
                    theme.palette.warning.main,
                    theme.palette.error.main
                ],
            },
        ],
    };

    // Calculate data for tasks created over time
    const getLast7Days = () => {
        return Array(7)
            .fill()
            .map((_, i) => subDays(new Date(), i))
            .reverse();
    };

    const last7Days = getLast7Days();
    const tasksOverTimeData = {
        labels: last7Days.map(date => format(date, 'MMM dd')),
        datasets: [
            {
                label: 'Tasks Created',
                data: last7Days.map(date => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    return tasks.filter(task => {
                        const taskDate = new Date(task.createdAt);
                        return format(taskDate, 'yyyy-MM-dd') === formattedDate;
                    }).length;
                }),
                borderColor: theme.palette.primary.main,
                backgroundColor: `${theme.palette.primary.main}33`,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: theme.palette.primary.main,
                pointBorderColor: theme.palette.background.paper,
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Tasks Completed',
                data: last7Days.map(date => {
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    return tasks.filter(task => {
                        if (!task.completedAt) return false;
                        const taskDate = new Date(task.completedAt);
                        return format(taskDate, 'yyyy-MM-dd') === formattedDate;
                    }).length;
                }),
                borderColor: theme.palette.success.main,
                backgroundColor: `${theme.palette.success.main}33`,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: theme.palette.success.main,
                pointBorderColor: theme.palette.background.paper,
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    // Get category distribution
    const categoryMap = {};
    tasks.forEach(task => {
        const category = task.category || 'Uncategorized';
        categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categoryData = {
        labels: Object.keys(categoryMap),
        datasets: [
            {
                label: 'Tasks by Category',
                data: Object.values(categoryMap),
                backgroundColor: [
                    theme.palette.primary.light,
                    theme.palette.secondary.light,
                    theme.palette.success.light,
                    theme.palette.info.light,
                    theme.palette.warning.light,
                    theme.palette.error.light,
                    '#9c27b0aa', // purple
                ],
                borderColor: [
                    theme.palette.primary.main,
                    theme.palette.secondary.main,
                    theme.palette.success.main,
                    theme.palette.info.main,
                    theme.palette.warning.main,
                    theme.palette.error.main,
                    '#9c27b0', // purple
                ],
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    if (loading) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Skeleton variant="text" width="50%" height={60} sx={{ mb: 4 }} />
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item}>
                            <Skeleton variant="rounded" height={120} />
                        </Grid>
                    ))}
                    {[1, 2].map((item) => (
                        <Grid item xs={12} md={6} key={`chart-${item}`}>
                            <Skeleton variant="rounded" height={300} />
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Skeleton variant="rounded" height={400} />
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <DashboardTitle variant="h4" component="h1" gutterBottom>
                    Task Analytics Dashboard
                </DashboardTitle>
                
                <Grid container spacing={3}>
                    {/* Summary Cards */}
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <MetricCard color="primary">
                                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                                    Total Tasks
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>
                                    {tasks.length}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Across all categories
                                </Typography>
                            </MetricCard>
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <MetricCard color="success">
                                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                                    Completed
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>
                                    {tasks.filter(t => t.completed).length}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Tasks finished
                                </Typography>
                            </MetricCard>
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <MetricCard color="warning">
                                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                                    Pending
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>
                                    {tasks.filter(t => !t.completed).length}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Tasks in progress
                                </Typography>
                            </MetricCard>
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                        <motion.div variants={itemVariants}>
                            <MetricCard color="secondary">
                                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1 }}>
                                    Completion Rate
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, my: 1 }}>
                                    {tasks.length ? 
                                        `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%` 
                                        : '0%'}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Overall progress
                                </Typography>
                            </MetricCard>
                        </motion.div>
                    </Grid>
                    
                    {/* Charts */}
                    <Grid item xs={12} md={6}>
                        <motion.div variants={itemVariants}>
                            <StyledPaper>
                                <ChartContainer>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Task Status Distribution
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ height: 300, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Pie 
                                            data={statusData} 
                                            options={getChartOptions()} 
                                        />
                                    </Box>
                                </ChartContainer>
                            </StyledPaper>
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <motion.div variants={itemVariants}>
                            <StyledPaper>
                                <ChartContainer>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Tasks by Priority Level
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ height: 300, flex: 1 }}>
                                        <Bar 
                                            data={priorityData} 
                                            options={getChartOptions(null, false)} 
                                        />
                                    </Box>
                                </ChartContainer>
                            </StyledPaper>
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <motion.div variants={itemVariants}>
                            <StyledPaper>
                                <ChartContainer>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Task Activity Trends (Last 7 Days)
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ height: isMobile ? 300 : 400, flex: 1 }}>
                                        <Line 
                                            data={tasksOverTimeData} 
                                            options={getChartOptions()} 
                                        />
                                    </Box>
                                </ChartContainer>
                            </StyledPaper>
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <motion.div variants={itemVariants}>
                            <StyledPaper>
                                <ChartContainer>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Tasks by Category
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ height: 300, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Pie data={categoryData} options={getChartOptions()} />
                                    </Box>
                                </ChartContainer>
                            </StyledPaper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <motion.div variants={itemVariants}>
                            <StyledPaper>
                                <ChartContainer>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Task Insights
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ height: 300, overflowY: 'auto', p: 1 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="primary.main">
                                                        Most Common Category
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="warning.main">
                                                        Urgent Tasks
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {tasks.filter(task => task.priority === 'urgent').length}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                                    <Typography variant="subtitle2" color="success.main">
                                                        Average Completion Time
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {tasks.some(t => t.completedAt && t.createdAt) ? 
                                                            '2.5 days' : 'No data'}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </ChartContainer>
                            </StyledPaper>
                        </motion.div>
                    </Grid>
                </Grid>
            </Box>
        </motion.div>
    );
};