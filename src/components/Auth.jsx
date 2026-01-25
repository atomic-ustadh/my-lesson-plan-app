import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();
    const { t, toggleLanguage, language } = useLanguage();

    const handleGoogleLogin = async (response) => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            // Exchange Google token for Supabase session
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            });

            if (error) throw error;

            // User profile will be created automatically in AuthContext
            navigate("/dashboard");
        } catch (error) {
            console.error("Google login error:", error);
            setMessage({ type: "error", text: "Failed to sign in with Google. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setMessage({ type: "error", text: "Google sign-in was cancelled or failed." });
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
                        {t("loginTitle") || "Sign In"}
                    </h2>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md text-sm ${
                            message.type === "error" 
                                ? "bg-red-50 text-red-700 border border-red-200" 
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-gray-600 mb-6">
                                {t("signInWithGoogle") || "Sign in to your account using Google"}
                            </p>
                            
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleLogin}
                                    onError={handleGoogleError}
                                    useOneTap={false}
                                    theme="filled_blue"
                                    size="large"
                                    text="signin_with"
                                    shape="rectangular"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {loading && (
                            <div className="text-center text-sm text-gray-600">
                                {t("processing") || "Signing in..."}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
