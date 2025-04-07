import { useState, useEffect } from 'react';
import { db } from '../firebase/Config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  serverTimestamp, 
  getDocs
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Get real-time updates of user's documents
  useEffect(() => {
    if (!currentUser) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Create query for user-specific documents
    const q = query(
      collection(db, collectionName),
      where("userId", "==", currentUser.uid)
    );
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = [];
        snapshot.docs.forEach(doc => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setDocuments(results);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching documents:", err);
        setError("Failed to load your data");
        setLoading(false);
      }
    );
    
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [collectionName, currentUser]);

  // Add a document
  const addDocument = async (data) => {
    if (!currentUser) {
      throw new Error("You must be logged in");
    }
    
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (err) {
      console.error("Error adding document:", err);
      throw new Error("Failed to add task");
    }
  };

  // Delete a document
  const deleteDocument = async (id) => {
    if (!currentUser) {
      throw new Error("You must be logged in");
    }
    
    try {
      // First verify the document belongs to the user
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDocs(
        query(
          collection(db, collectionName),
          where("userId", "==", currentUser.uid),
          where("__name__", "==", id)
        )
      );
      
      if (docSnap.empty) {
        throw new Error("You don't have permission to delete this task");
      }
      
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Error deleting document:", err);
      throw new Error(err.message || "Failed to delete task");
    }
  };

  // Update a document
  const updateDocument = async (id, updates) => {
    if (!currentUser) {
      throw new Error("You must be logged in");
    }
    
    try {
      // First verify the document belongs to the user
      const docSnap = await getDocs(
        query(
          collection(db, collectionName),
          where("userId", "==", currentUser.uid),
          where("__name__", "==", id)
        )
      );
      
      if (docSnap.empty) {
        throw new Error("You don't have permission to update this task");
      }
      
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, { 
        ...updates, 
        updatedAt: serverTimestamp() 
      });
    } catch (err) {
      console.error("Error updating document:", err);
      throw new Error(err.message || "Failed to update task");
    }
  };

  return { 
    documents, 
    loading, 
    error, 
    addDocument, 
    deleteDocument, 
    updateDocument 
  };
};