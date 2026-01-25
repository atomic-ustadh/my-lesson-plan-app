import { createContext, useContext, useEffect, useState } from "react";
import { supabase, auth } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    

useEffect(() => {
        // 1. Check active session
        auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) fetchProfile(session.user.id, session.user);
            else setLoading(false);
        });

        // 2. Listen for auth changes
        const {
            data: { subscription },
        } = auth.onAuthStateChange((event, session) => {
            setSession(session);

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
    }, []);

async function fetchProfile(userId, sessionUser) {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("role, full_name")
                .eq("id", userId)
                .single();

            if (error) {
                // For Google Auth, create profile if it doesn't exist
                if (error.code === 'PGRST116') {
                    await createProfile(userId, sessionUser);
                    // Try fetching again
                    return fetchProfile(userId, sessionUser);
                }
                // Fallback: Use Google user data if DB fetch fails
                console.warn("Profile fetch warning:", error.message);
                const googleName = sessionUser?.user_metadata?.full_name || sessionUser?.user_metadata?.name;

                setUserRole("teacher");
                setUserName(googleName || "Teacher");
            } else {
                const dbName = data?.full_name;
                const googleName = sessionUser?.user_metadata?.full_name || sessionUser?.user_metadata?.name;

                setUserRole(data?.role || "teacher");
                // Prefer DB name, fallback to Google name, then default
                setUserName(dbName || googleName || "Teacher");
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
            // Final fallback in crash
            const googleName = sessionUser?.user_metadata?.full_name || sessionUser?.user_metadata?.name;
            setUserName(googleName || "Teacher");
        } finally {
            setLoading(false);
        }
    }

    async function createProfile(userId, sessionUser) {
        const googleName = sessionUser?.user_metadata?.full_name || sessionUser?.user_metadata?.name || "Teacher";
        const googleEmail = sessionUser?.email || "";

        await supabase.from("profiles").insert({
            id: userId,
            email: googleEmail,
            full_name: googleName,
            role: "teacher"
        });
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
