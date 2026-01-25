import { Outlet, Link, useNavigate } from "react-router-dom";
import { auth } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Layout() {
    const { session, userName, userRole } = useAuth();
    const { t, toggleLanguage, language } = useLanguage();
    const navigate = useNavigate();

const handleLogout = async () => {
        try {
            await auth.signOut();
            // Force navigation after successful sign out
            window.location.href = "/login";
        } catch (err) {
            console.error("Sign out exception:", err);
            alert("An error occurred during sign out.");
        }
    };

    if (!session) return <Outlet />;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 transition-all duration-300">
            {/* NAVIGATION BAR */}
            <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                                📝 {t("appTitle")}
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className="text-sm font-medium text-gray-600 hover:text-blue-600 px-3 py-1 border rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {language === "en" ? "🇮🇶 العربية" : "🇺🇸 English"}
                            </button>

                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900">{userName}</p>
                                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                            >
                                {t("signOut")}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* PAGE CONTENT */}
            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
