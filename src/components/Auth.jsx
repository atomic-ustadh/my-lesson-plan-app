import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();
    const { t, toggleLanguage, language } = useLanguage();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin, // Redirects back to your app's origin after successful sign-in
                },
            });
            if (error) throw error;
            // Supabase handles the redirect to Google and then back to your app
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
                        {t("signInTitle")}
                    </h2>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md text-sm ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="mt-6 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" className="mr-2" />
                        {t("signInWithGoogle")}
                    </button>
                </div>
            </div>
        </div>
    );
}
