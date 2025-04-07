import { collection, query, where, getDocs, addDoc, doc, deleteDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase/Config";

const CATEGORIES_COLLECTION = "categories";

export const CategoryService = {
    // Get all categories for current user
    getUserCategories: async (userId) => {
        if (!userId) throw new Error("User ID is required");

        try {
            const categoriesRef = collection(db, CATEGORIES_COLLECTION);
            const q = query(categoriesRef, where("userId", "==", userId));

            const querySnapshot = await getDocs(q);
            const categories = [];

            querySnapshot.forEach((doc) => {
                categories.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            return categories;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    },

    // Add a new category
    addCategory: async (userId, category) => {
        if (!userId) throw new Error("User ID is required");

        try {
            const categoriesRef = collection(db, CATEGORIES_COLLECTION);
            const newCategory = {
                name: category.name,
                userId,
                createdAt: serverTimestamp(),
            };

            const docRef = await addDoc(categoriesRef, newCategory);
            return {
                id: docRef.id,
                ...newCategory,
                createdAt: new Date(), // Use local date for immediate UI update
            };
        } catch (error) {
            console.error("Error adding category:", error);
            throw error;
        }
    },

    // Delete a category
    deleteCategory: async (userId, categoryId) => {
        if (!userId || !categoryId) throw new Error("User ID and category ID are required");

        try {
            const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
            await deleteDoc(categoryRef);
            return categoryId;
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    },

    // Add this function to your CategoryService object
    deleteAllUserCategories: async (userId) => {
        if (!userId) return;

        try {
            // Get a reference to the categories collection
            const categoriesRef = collection(db, CATEGORIES_COLLECTION);

            // Query categories that belong to the user
            const userCategoriesQuery = query(categoriesRef, where("userId", "==", userId));
            const categoriesSnapshot = await getDocs(userCategoriesQuery);

            // Delete each category in a batch
            const batch = writeBatch(db);
            categoriesSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            // Commit the batch delete
            await batch.commit();

            return true;
        } catch (error) {
            console.error("Error deleting all categories:", error);
            throw error;
        }
    },

    
};
