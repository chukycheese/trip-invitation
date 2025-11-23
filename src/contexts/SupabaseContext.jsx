import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseContext = createContext();

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error('useSupabase must be used within SupabaseProvider');
    }
    return context;
};

export const SupabaseProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            }
        });
        if (error) throw error;
        return data;
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        supabase,
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};
