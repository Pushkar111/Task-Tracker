import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { AddTaskForm } from "./components/AddTaskForm";
import "./styles.css";
import { Tasks } from "./components/Tasks";
import { ThemeProvider, CssBaseline, CircularProgress, Box } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { Analytics } from "./components/Analytics";
import { Dashboard } from "./components/Dashboard";
import { Settings } from "./components/Settings";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./components/Authentication/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { createAppTheme } from "./components/createAppTheme";
import { Toaster, toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import Register from "./components/Authentication/Register";
import ForgetPassword from "./components/Authentication/ForgetPassword";
import { TaskService } from "./services/TaskService";
import { Profile } from "./components/Profile";
import Error404 from "./components/Error404";

// localStorage logic
const getLocalStorage = () => {
    let tasks = localStorage.getItem("allTasks");
    if (tasks) {
        return JSON.parse(tasks);
    } else {
        return [];
    }
};

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}>
                <CircularProgress />
            </Box>
        );
    }

    return currentUser ? children : <Navigate to="/login" />;
};

function AppContent() {
    // Theme mode
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem("themeMode");
        return savedMode || "light";
    });

    // Create custom theme with enhanced aesthetics
    const theme = createAppTheme(mode);

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        return window.innerWidth >= 768;
    });

    // Categories State
    const [categories, setCategories] = useState(() => {
        const savedCategories = localStorage.getItem("categories");
        return savedCategories
            ? JSON.parse(savedCategories)
            : [
                  { id: "1", name: "Work" },
                  { id: "2", name: "Personal" },
                  { id: "3", name: "Study" },
              ];
    });

    // Auth state
    const { currentUser, logout } = useAuth();

    // Header Title
    const title = "Task Tracker";

    const [showAddedTasks, setShowAddedTasks] = useState(false);
    const [tasks, setTasks] = useState(getLocalStorage());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user tasks from Firestore on component mount and when user changes
    useEffect(() => {
        if (!currentUser) {
            setTasks([]);
            setLoading(false);
            return;
        }

        let isMounted = true;
        let retryCount = 0;
        const maxRetries = 2;

        // Add this timeout to ensure auth is fully established
        const timeoutId = setTimeout(async () => {
            if (!isMounted) return;

            try {
                console.log("Starting to fetch tasks for user:", currentUser.uid);
                setLoading(true);
                setError(null);

                const userTasks = await TaskService.getUserTasks(currentUser.uid);
                console.log(`Successfully fetched ${userTasks.length} tasks`);

                if (isMounted) {
                    setTasks(userTasks);
                }
            } catch (error) {
                console.error("Detailed fetch error:", error);
                // Rest of your error handling
            } finally {
                if (isMounted) setLoading(false);
            }
        }, 1000); // Increased delay to ensure auth is ready

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [currentUser]);

    // Show and Hide Task Form
    const showTaskForm = () => {
        setShowAddedTasks(!showAddedTasks);
    };

    // Sidebar toggle handler
    const handleSidebarToggle = (open) => {
        setSidebarOpen(open);
    };

    // Add Task with toast notification
    const addTask = async (task) => {
        if (!currentUser) return;

        try {
            const newTask = await TaskService.addTask(currentUser.uid, task);
            setTasks([newTask, ...tasks]);

            toast.success("Task added successfully!", {
                icon: "✅",
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        } catch (err) {
            console.error("Error adding task:", err);
            toast.error("Failed to add task", {
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        }
    };

    // Delete Task with confirmation toast
    const deleteTask = async (id) => {
        if (!currentUser) return;

        const taskToDelete = tasks.find((task) => task.id === id);

        try {
            await TaskService.deleteTask(currentUser.uid, id);
            setTasks(tasks.filter((task) => task.id !== id));

            toast.success(`"${taskToDelete.Task}" was deleted`, {
                icon: "🗑️",
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        } catch (err) {
            console.error("Error deleting task:", err);
            toast.error("Failed to delete task", {
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        }
    };

    // Toggle Reminder with toast
    const toggleReminder = async (id) => {
        if (!currentUser) return;

        const task = tasks.find((t) => t.id === id);
        const newReminderStatus = !task.Reminder;

        try {
            await TaskService.toggleReminder(currentUser.uid, id, newReminderStatus);

            setTasks(tasks.map((task) => (task.id === id ? { ...task, Reminder: newReminderStatus } : task)));

            toast(newReminderStatus ? "Reminder set" : "Reminder removed", {
                icon: newReminderStatus ? "🔔" : "🔕",
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        } catch (err) {
            console.error("Error toggling reminder:", err);
            toast.error("Failed to update reminder", {
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        }
    };

    // // Save Tasks to Local Storage
    // const saveTasksToLocalStorage = () => {
    //     localStorage.setItem("allTasks", JSON.stringify(tasks));
    // };
    // useEffect(saveTasksToLocalStorage, [tasks]);

    // Toggle Theme with toast notification
    const toggleTheme = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("themeMode", newMode);

        toast(`${newMode.charAt(0).toUpperCase() + newMode.slice(1)} mode activated`, {
            icon: newMode === "dark" ? "🌙" : "☀️",
            style: {
                borderRadius: "10px",
                background: newMode === "dark" ? "#1e293b" : "#fff",
                color: newMode === "dark" ? "#fff" : "#333",
            },
        });
    };

    // Toggle task completion status with toast
    const toggleComplete = async (id) => {
        if (!currentUser) return;

        const task = tasks.find((t) => t.id === id);
        const newCompletionStatus = !task.completed;

        try {
            await TaskService.toggleComplete(currentUser.uid, id, newCompletionStatus);

            setTasks(
                tasks.map((task) => {
                    if (task.id === id) {
                        return {
                            ...task,
                            completed: newCompletionStatus,
                            completedAt: newCompletionStatus ? new Date().toISOString() : null,
                        };
                    }
                    return task;
                })
            );

            if (newCompletionStatus) {
                toast.success(`Task completed: ${task.Task}`, {
                    icon: "🎉",
                    style: {
                        borderRadius: "10px",
                        background: mode === "dark" ? "#1e293b" : "#fff",
                        color: mode === "dark" ? "#fff" : "#333",
                    },
                });
            }
        } catch (err) {
            console.error("Error toggling completion status:", err);
            toast.error("Failed to update task status", {
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        }
    };

    // Update task
    const updateTask = async (id, updatedTask) => {
        if (!currentUser) return;

        try {
            await TaskService.updateTask(currentUser.uid, id, updatedTask);

            setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)));

            toast.success("Task updated successfully!", {
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        } catch (err) {
            console.error("Error updating task:", err);
            toast.error("Failed to update task", {
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        }
    };

    // Add Category
    const addCategory = (category) => {
        // TODO: Update to use Firestore
        const updatedCategories = [...categories, category];
        setCategories(updatedCategories);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));

        toast.success(`Category "${category.name}" added`, {
            style: {
                borderRadius: "10px",
                background: mode === "dark" ? "#1e293b" : "#fff",
                color: mode === "dark" ? "#fff" : "#333",
            },
        });
    };

    // Delete Category
    const deleteCategory = (categoryId) => {
        // TODO: Update to use Firestore
        const categoryToDelete = categories.find((cat) => cat.id === categoryId);
        const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
        setCategories(updatedCategories);
        localStorage.setItem("categories", JSON.stringify(updatedCategories));

        // Update tasks that had this category
        const updatedTasks = tasks.map((task) => {
            if (task.category === categoryToDelete?.name) {
                return { ...task, category: "Uncategorized" };
            }
            return task;
        });
        setTasks(updatedTasks);

        toast(`Category "${categoryToDelete?.name}" deleted`, {
            icon: "🗑️",
            style: {
                borderRadius: "10px",
                background: mode === "dark" ? "#1e293b" : "#fff",
                color: mode === "dark" ? "#fff" : "#333",
            },
        });
    };

    // Filter tasks (for search functionality)
    const [searchTerm, setSearchTerm] = useState("");
    const filteredTasks = tasks.filter((task) => task.Task.toLowerCase().includes(searchTerm.toLowerCase()) || (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())));

    // Logout handler
    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully", {
                icon: "👋",
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        } catch (error) {
            console.error("Failed to log out", error);
            toast.error("Failed to log out", {
                style: {
                    borderRadius: "10px",
                    background: mode === "dark" ? "#1e293b" : "#fff",
                    color: mode === "dark" ? "#fff" : "#333",
                },
            });
        }
    };

    if (!currentUser) {
        return <Login />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app-container">
                <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} onLogout={handleLogout} toggleTheme={toggleTheme} currentTheme={mode} />
                <div className={`content-container ${sidebarOpen ? "sidebar-expanded" : ""}`}>
                    <Header title={title} onAdd={showTaskForm} showAdd={showAddedTasks} onSearchChange={(e) => setSearchTerm(e.target.value)} searchValue={searchTerm} onLogout={handleLogout} />
                    <AnimatePresence mode="wait">
                        <Routes>
                            {/* Universal Route */}
                            <Route
                                path="/"
                                element={
                                    <>
                                        <AnimatePresence>{showAddedTasks && <AddTaskForm addTask={addTask} onClose={() => setShowAddedTasks(false)} />}</AnimatePresence>

                                        {loading ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    minHeight: "200px",
                                                }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <Tasks tasks={filteredTasks} onDelete={deleteTask} toggleReminder={toggleReminder} toggleComplete={toggleComplete} onTaskUpdate={updateTask} />
                                        )}
                                    </>
                                }
                            />
                            {/* Dashboard Route */}
                            <Route
                                path="/dashboard"
                                element={
                                    loading ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                minHeight: "200px",
                                            }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <Dashboard tasks={tasks} />
                                    )
                                }
                            />
                            {/* Analytics Route */}
                            <Route
                                path="/analytics"
                                element={
                                    loading ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                minHeight: "200px",
                                            }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <Analytics tasks={tasks} />
                                    )
                                }
                            />
                            {/* Settings Route */}
                            <Route
                                path="/settings"
                                element={<Settings toggleTheme={toggleTheme} currentTheme={mode} categories={categories} addCategory={addCategory} deleteCategory={deleteCategory} />}
                            />
                            {/* Profile Route */}
                            <Route path="/profile" element={<Profile />} />

                            {/* 404 Route - This catches all unmatched routes when user is authenticated */}
                            <Route path="*" element={<Error404 />} />
                        </Routes>
                    </AnimatePresence>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </ThemeProvider>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ForgetPassword />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <AppContent />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Error404 />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
