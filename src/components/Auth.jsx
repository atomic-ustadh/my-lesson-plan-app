import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState(""); // For signup
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // LOGIN
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Navigation handled by App/AuthContext state change or explicit navigate
                navigate("/");
            } else {
                // SIGNUP
                // 1. Pass metadata to Auth immediately
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            role: 'teacher'
                        }
                    }
                });
                if (error) throw error;

                // 2. Ensuring Profile Exists (Upsert)
                // If a trigger created it, we update. If not, we insert.
                if (data.user) {
                    const { error: profileError } = await supabase.from("profiles").upsert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            role: "teacher",
                        },
                    ]);

                    if (profileError) {
                        console.error("Profile creation/update failed:", profileError);
                        // If it failed because of RLS (e.g. user not logged in yet because email not confirmed),
                        // we can't do much here. The metadata in step 1 is the fallback.
                    }
                }

                alert("Signup successful! You can now log in.");
                setIsLogin(true);
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>

                    <form onSubmit={handleAuth} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-500"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
