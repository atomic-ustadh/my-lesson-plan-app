import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const [recoveryMode, setRecoveryMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id, session.user);
            else setLoading(false);
        });

        // Manual hash check as fallback for event detection
        if (window.location.hash && window.location.hash.includes("type=recovery")) {
            setRecoveryMode(true);
        }

        // 2. Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event);
            console.log('Auth session:', session);
            setSession(session);

            if (event === 'PASSWORD_RECOVERY') {
                setRecoveryMode(true);
            } else if (event === 'SIGNED_OUT') {
                navigate('/');
            }

            if (session) {
                fetchProfile(session.user.id, session.user);
            } else {
                setUserRole(null);
                setUserName("");
                setLoading(false);
                setRecoveryMode(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

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
        recoveryMode,
        setRecoveryMode,
        isAdmin: userRole === "admin",
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

