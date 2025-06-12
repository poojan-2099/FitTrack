import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeAuth;
        let unsubscribeUser;

        const setupAuth = async () => {
            unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
                if (authUser) {
                    setUser(authUser);
                    // Set up Firestore listener
                    const userRef = doc(db, "users", authUser.uid);
                    unsubscribeUser = onSnapshot(userRef, (doc) => {
                        if (doc.exists()) {
                            setUserData(doc.data());
                        } else {
                            setUserData(null);
                        }
                        setLoading(false);
                    }, (error) => {
                        console.error("Error fetching user data:", error);
                        setUserData(null);
                        setLoading(false);
                    });
                } else {
                    setUser(null);
                    setUserData(null);
                    setLoading(false);
                }
            }, (error) => {
                console.error("Auth state change error:", error);
                setUser(null);
                setUserData(null);
                setLoading(false);
            });
        };

        setupAuth();

        // Cleanup function
        return () => {
            if (unsubscribeAuth) unsubscribeAuth();
            if (unsubscribeUser) unsubscribeUser();
        };
    }, []);

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    const value = {
        user,
        userData,
        loading,
        signOut
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
} 