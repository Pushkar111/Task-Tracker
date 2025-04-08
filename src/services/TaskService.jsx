import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase/Config";

const TASKS_COLLECTION = "tasks";

export const TaskService = {
    // Add this to TaskService
    createWelcomeTask: async (userId) => {
        if (!userId) return null;

        try {
            const tasksRef = collection(db, TASKS_COLLECTION);
            const newTask = {
                Task: "Welcome to Task Tracker!",
                description: "This is your first task. Click the checkbox to mark it as complete, or delete it with the trash icon.",
                DayTime: "Today",
                priority: "normal",
                category: "Getting Started",
                Reminder: false,
                userId,
                createdAt: serverTimestamp(),
                completed: false,
                completedAt: null,
            };

            const docRef = await addDoc(tasksRef, newTask);
            return {
                id: docRef.id,
                ...newTask,
                createdAt: new Date().toISOString(),
            };
        } catch (error) {
            console.error("Error creating welcome task:", error);
            // Fail silently - this is not critical
            return null;
        }
    },

    // Get all tasks for the current user with improved error handling
    getUserTasks: async (userId) => {
        if (!userId) {
            console.warn("getUserTasks called without a userId");
            return [];
        }
    
        try {
            console.log(`Fetching tasks for user: ${userId}`);
            console.log("User ID type:", typeof userId, "Value:", userId);
            
            const tasksRef = collection(db, TASKS_COLLECTION);
    
            // Try to use the simple query first if we don't have an index yet
            try {
                // Simple query without ordering (doesn't require composite index)
                const simpleQuery = query(tasksRef, where("userId", "==", userId));
                const querySnapshot = await getDocs(simpleQuery);
                console.log(`Tasks fetched successfully: ${querySnapshot.size} tasks`);
    
                const tasks = [];
                querySnapshot.forEach((doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        tasks.push({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                            completedAt: data.completedAt?.toDate?.() ? data.completedAt.toDate().toISOString() : null,
                        });
                    }
                });
    
                // Sort tasks locally until we have the index
                return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
            } catch (innerError) {
                console.error("Error with simple query:", innerError);
                throw innerError;
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
            const customError = new Error(error.message || "Unknown error fetching tasks");
            customError.code = error.code || "unknown";
            customError.originalError = error;
            throw customError;
        }
    }, 

    // Add a new task
    addTask: async (userId, taskData) => {
        if (!userId) throw new Error("User ID is required");

        try {
            const tasksRef = collection(db, TASKS_COLLECTION);
            const newTask = {
                ...taskData,
                userId,
                createdAt: serverTimestamp(),
                completed: false,
                completedAt: null,
            };

            const docRef = await addDoc(tasksRef, newTask);
            return {
                id: docRef.id,
                ...newTask,
                createdAt: new Date().toISOString(), // Use local date for immediate UI update
            };
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    },

    // Delete a task
    deleteTask: async (userId, taskId) => {
        if (!userId || !taskId) throw new Error("User ID and task ID are required");

        try {
            const taskRef = doc(db, TASKS_COLLECTION, taskId);
            await deleteDoc(taskRef);
            return taskId;
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    },

    // Update a task
    updateTask: async (userId, taskId, updatedData) => {
        if (!userId || !taskId) throw new Error("User ID and task ID are required");

        try {
            const taskRef = doc(db, TASKS_COLLECTION, taskId);
            await updateDoc(taskRef, updatedData);
            return { id: taskId, ...updatedData };
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    },

    // Toggle task completion status
    toggleComplete: async (userId, taskId, isCompleted) => {
        if (!userId || !taskId) throw new Error("User ID and task ID are required");

        try {
            const taskRef = doc(db, TASKS_COLLECTION, taskId);
            const updateData = {
                completed: isCompleted,
                completedAt: isCompleted ? serverTimestamp() : null,
            };

            await updateDoc(taskRef, updateData);
            return {
                id: taskId,
                completed: isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : null,
            };
        } catch (error) {
            console.error("Error toggling task completion:", error);
            throw error;
        }
    },

    // Toggle task reminder
    toggleReminder: async (userId, taskId, reminder) => {
        if (!userId || !taskId) throw new Error("User ID and task ID are required");

        try {
            const taskRef = doc(db, TASKS_COLLECTION, taskId);
            await updateDoc(taskRef, { Reminder: reminder });
            return { id: taskId, Reminder: reminder };
        } catch (error) {
            console.error("Error toggling reminder:", error);
            throw error;
        }
    },

    // delete all tasks for a user
deleteAllUserTasks: async (userId) => {
    if (!userId) return;
    
    try {
      // Get a reference to the tasks collection
      const tasksRef = collection(db, TASKS_COLLECTION);
      
      // Query tasks that belong to the user
      const userTasksQuery = query(tasksRef, where("userId", "==", userId));
      const tasksSnapshot = await getDocs(userTasksQuery);
      
      // Delete each task in a batch
      const batch = writeBatch(db);
      tasksSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Commit the batch delete
      await batch.commit();
      
      return true;
    } catch (error) {
      console.error("Error deleting all tasks:", error);
      throw error;
    }
  }


  
};
