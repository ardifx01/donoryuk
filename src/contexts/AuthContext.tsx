"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase-client";
import type { AuthContextType, Donor, Admin, SupabaseUser } from "@/types/database";
import type { User } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [donor, setDonor] = useState<Donor | null>(null);
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    const handleUserSession = useCallback(
        async (authUser: User) => {
            try {
                // Convert Supabase User to our SupabaseUser type
                const userData: SupabaseUser = {
                    id: authUser.id,
                    email: authUser.email,
                    phone: authUser.phone,
                    created_at: authUser.created_at,
                    updated_at: authUser.updated_at || authUser.created_at,
                    email_confirmed_at: authUser.email_confirmed_at,
                    phone_confirmed_at: authUser.phone_confirmed_at,
                    last_sign_in_at: authUser.last_sign_in_at,
                };

                setUser(userData);

                // Reset donor and admin state first
                setDonor(null);
                setAdmin(null);

                // Check if user is a donor
                const { data: donorData, error: donorError } = await supabase.from("donors").select("*").eq("user_id", authUser.id).single();

                if (donorData && !donorError) {
                    setDonor(donorData);
                }

                // Check if user is an admin
                const { data: adminData, error: adminError } = await supabase.from("admins").select("*").eq("user_id", authUser.id).single();

                if (adminData && !adminError) {
                    setAdmin(adminData);
                }
            } catch (error) {
                console.error("Error handling user session:", error);
            } finally {
                setLoading(false);
            }
        },
        [supabase]
    );

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session?.user) {
                await handleUserSession(session.user);
            } else {
                setLoading(false);
            }
        };

        getInitialSession();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state change:", event, session?.user?.id);

            if (session?.user) {
                await handleUserSession(session.user);
            } else {
                // Only clear state if this is an actual sign out
                if (event === "SIGNED_OUT") {
                    setUser(null);
                    setDonor(null);
                    setAdmin(null);
                }
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth, handleUserSession]);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // Provide more user-friendly error messages
            if (error.message.includes("Email not confirmed")) {
                throw new Error("Email belum dikonfirmasi. Silakan cek email Anda dan klik link konfirmasi.");
            } else if (error.message.includes("Invalid login credentials")) {
                throw new Error("Email atau password salah. Silakan coba lagi.");
            } else {
                throw error;
            }
        }
    };

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            throw error;
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }
    };

    const resendConfirmation = async (email: string) => {
        const { error } = await supabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            throw error;
        }
    };

    const updateProfile = async (data: Partial<Donor>) => {
        if (!user || !donor) {
            throw new Error("User not authenticated or not a donor");
        }

        const { error } = await supabase.from("donors").update(data).eq("id", donor.id);

        if (error) {
            throw error;
        }

        // Refresh donor data
        const { data: updatedDonor } = await supabase.from("donors").select("*").eq("id", donor.id).single();

        if (updatedDonor) {
            setDonor(updatedDonor);
        }
    };

    const value: AuthContextType = {
        user,
        donor,
        admin,
        loading,
        signIn,
        signUp,
        signOut,
        resendConfirmation,
        updateProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
