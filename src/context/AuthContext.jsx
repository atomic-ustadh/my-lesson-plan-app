import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id);
            else setLoading(false);
        });

        // 2. Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id);
            } else {
                setUserRole(null);
                setUserName("");
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function fetchProfile(userId) {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("role, full_name")
                .eq("id", userId)
                .single();

            if (error) {
                // If profile doesn't exist yet (e.g. just signed up), we might want to create one or wait
                // For now, default to teacher
                console.warn("Profile fetch warning:", error.message);
                setUserRole("teacher");
                setUserName("Teacher");
            } else {
                setUserRole(data?.role || "teacher");
                setUserName(data?.full_name || "Teacher");
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    }

    const value = {
        session,
        userRole,
        userName,
        loading,
        isAdmin: userRole === "admin",
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
