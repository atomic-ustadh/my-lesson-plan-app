import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
    const location = useLocation();
    const [view, setView] = useState("login"); // 'login' | 'signup' | 'forgot' | 'update'
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();
    const { t, toggleLanguage, language } = useLanguage();
    const { recoveryMode, setRecoveryMode } = useAuth();

    useEffect(() => {
        // Handle explicit mode from location state
        if (location.state?.mode === 'signup') {
            setView("signup");
        }
    }, [location.state]);

    useEffect(() => {
        // If context says we are in recovery mode, show update view
        if (recoveryMode) {
            setView("update");
        }
    }, [recoveryMode]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            if (view === "login") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate("/dashboard");
            } else if (view === "signup") {
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

                if (data.user) {
                    await supabase.from("profiles").upsert([
                        {
                            id: data.user.id,
                            full_name: fullName,
                            role: "teacher",
                        },
                    ]);
                }
                setMessage({ type: "success", text: t("signupSuccess") });
                setView("login");
            } else if (view === "forgot") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/login`,
                });
                if (error) throw error;
                setMessage({ type: "success", text: t("resetSentDesc") });
            } else if (view === "update") {
                if (password !== confirmPassword) {
                    throw new Error(t("passwordMismatch"));
                }
                const { error } = await supabase.auth.updateUser({
                    password: password,
                });
                if (error) throw error;
                setMessage({ type: "success", text: t("passwordUpdateSuccess") });
                setRecoveryMode(false);
                setView("login");
            }
        } catch (error) {
            setMessage({ type: "error", text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
            {/* Language Toggle */}
            <button
                onClick={toggleLanguage}
                className="absolute top-4 end-4 text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1 border rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors"
            >
                {language === "en" ? "🇮🇶 العربية" : "🇺🇸 English"}
            </button>

            <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                        {view === "login" && t("loginTitle")}
                        {view === "signup" && t("signupTitle")}
                        {view === "forgot" && t("forgotPassword")}
                        {view === "update" && t("updatePasswordBtn")}
                    </h2>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md text-sm ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-6">
                        {view === "signup" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("fullName")}
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

                        {view !== "update" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("email")}
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        )}

                        {view !== "forgot" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {view === "update" ? t("newPassword") : t("password")}
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
                        )}

                        {view === "update" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("confirmPassword")}
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        )}

                        {view === "login" && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-500"
                                    onClick={() => setView("forgot")}
                                >
                                    {t("forgotPassword")}
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? t("processing") : (
                                view === "login" ? t("signIn") :
                                    view === "signup" ? t("signUp") :
                                        view === "forgot" ? t("resetBtn") :
                                            t("updatePasswordBtn")
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        {view === "forgot" ? (
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-500"
                                onClick={() => setView("login")}
                            >
                                {t("backToLogin")}
                            </button>
                        ) : view !== "update" && (
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-500"
                                onClick={() => setView(view === "login" ? "signup" : "login")}
                            >
                                {view === "login" ? t("noAccount") : t("hasAccount")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
