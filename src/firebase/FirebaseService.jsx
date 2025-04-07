import { db } from './Config';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    deleteDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from 'firebase/firestore';


// Collection reference
const tasksCollectionRef = collection(db, 'tasks');

// Get all tasks for a user
export const getTasks = async (userId) => {
    const q = query(
        tasksCollectionRef, 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// Add a task
export const addTask = async (taskData, userId) => {
    try {
        const docRef = await addDoc(tasksCollectionRef, {
            ...taskData,
            userId,
            completed: false,
            createdAt: serverTimestamp()
        });
        
        return {
            id: docRef.id,
            ...taskData,
            userId,
            completed: false
        };
    } catch (error) {
        console.error("Error adding task: ", error);
        throw error;
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        const taskDocRef = doc(db, 'tasks', taskId);
        await deleteDoc(taskDocRef);
        return taskId;
    } catch (error) {
        console.error("Error deleting task: ", error);
        throw error;
    }
};

// Update a task
export const updateTask = async (taskId, updatedFields) => {
    try {
        const taskDocRef = doc(db, 'tasks', taskId);
        
        // If we're marking as complete, add the completedAt timestamp
        if (updatedFields.completed === true) {
            updatedFields.completedAt = serverTimestamp();
        } else if (updatedFields.completed === false) {
            // Remove completedAt if unmarking as complete
            updatedFields.completedAt = null;
        }
        
        await updateDoc(taskDocRef, updatedFields);
        
        return {
            id: taskId,
            ...updatedFields
        };
    } catch (error) {
        console.error("Error updating task: ", error);
        throw error;
    }
};

// Toggle reminder
export const toggleTaskReminder = async (taskId, currentReminder) => {
    return updateTask(taskId, { Reminder: !currentReminder });
};

// Toggle complete
export const toggleTaskComplete = async (taskId, currentComplete) => {
    return updateTask(taskId, { completed: !currentComplete });
};