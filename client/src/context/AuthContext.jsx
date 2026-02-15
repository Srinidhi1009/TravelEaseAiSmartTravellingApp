import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // You can fetch additional user data from Firestore here if needed
                setUser({
                    id: currentUser.uid,
                    email: currentUser.email,
                    name: currentUser.displayName,
                    photoURL: currentUser.photoURL
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            // Optional: Check if we need to clear any other local storage
            // localStorage.clear(); 
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const value = {
        user,
        loading,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
