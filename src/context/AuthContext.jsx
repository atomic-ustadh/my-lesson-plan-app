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
            if (session) fetchProfile(session.user.id, session.user);
            else setLoading(false);
        });

        // 2. Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id, session.user);
            } else {
                setUserRole(null);
                setUserName("");
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function fetchProfile(userId, sessionUser) {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("role, full_name")
                .eq("id", userId)
                .single();

            if (error) {
                // Fallback: Use metadata from the session user object if DB fetch fails
                console.warn("Profile fetch warning:", error.message);
                const metaName = sessionUser?.user_metadata?.full_name;

                setUserRole("teacher"); // Default incase of error
                setUserName(metaName || "Teacher");
            } else {
                const dbName = data?.full_name;
                const metaName = sessionUser?.user_metadata?.full_name;

                setUserRole(data?.role || "teacher");
                // Prefer DB name, fallback to Auth metadata, then default string
                setUserName(dbName || metaName || "Teacher");
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
            // Final fallback in crash
            setUserName(sessionUser?.user_metadata?.full_name || "Teacher");
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
