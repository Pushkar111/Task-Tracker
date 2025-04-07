import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth } from '../firebase/Config';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail 
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // Sign in with email/password
    async function login(email, password) {
        try {
            setAuthError(null);
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setAuthError(formatAuthError(error));
            throw error;
        }
    }

    // Sign in with Google
    async function loginWithGoogle() {
        try {
            setAuthError(null);
            const provider = new GoogleAuthProvider();
            return await signInWithPopup(auth, provider);
        } catch (error) {
            setAuthError(formatAuthError(error));
            throw error;
        }
    }

    // Sign up with email/password
    async function signup(email, password) {
        try {
            setAuthError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            
            // You might want to create a user profile document in Firestore here
            // For example: await createUserProfile(result.user.uid, { email, displayName: email.split('@')[0] });
            
            return result;
        } catch (error) {
            setAuthError(formatAuthError(error));
            throw error;
        }
    }

    // Reset password
    async function resetPassword(email) {
        try {
            setAuthError(null);
            return await sendPasswordResetEmail(auth, email);
        } catch (error) {
            setAuthError(formatAuthError(error));
            throw error;
        }
    }

    // Format auth error messages for better UX
    function formatAuthError(error) {
        const errorCode = error.code;
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/user-not-found':
                return 'No account found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/email-already-in-use':
                return 'Email already in use. Try logging in instead.';
            case 'auth/weak-password':
                return 'Password is too weak. It should be at least 6 characters.';
            case 'auth/too-many-requests':
                return 'Too many unsuccessful login attempts. Please try again later.';
            case 'auth/popup-closed-by-user':
                return 'Login popup was closed before authentication was completed.';
            default:
                return 'An authentication error occurred. Please try again.';
        }
    }

    // Log out
    async function logout() {
        try {
            setAuthError(null);
            return await signOut(auth);
        } catch (error) {
            setAuthError(formatAuthError(error));
            throw error;
        }
    }

    // Set up auth state observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userId: currentUser?.uid,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
        loading,
        authError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}