import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
    const navigate = useNavigate();
    const { t, toggleLanguage, language } = useLanguage();
    const { session } = useAuth();

    const features = [
        { title: t("feature1Title"), desc: t("feature1Desc"), icon: "🧠" },
        { title: t("feature2Title"), desc: t("feature2Desc"), icon: "🌍" },
        { title: t("feature3Title"), desc: t("feature3Desc"), icon: "⚡" },
        { title: t("feature4Title"), desc: t("feature4Desc"), icon: "🖨️" },
    ];

    const testimonials = [
        { quote: t("quote1"), author: t("author1") },
        { quote: t("quote2"), author: t("author2") },
    ];

    const isRtl = language === 'ar';
    const headerFont = isRtl ? "font-header" : "font-bold";

    return (
        <div className={`min-h-screen flex flex-col bg-[#FDFBF7] text-gray-800 transition-colors duration-300 ${language === 'ar' ? 'font-rtl' : 'font-ltr'}`}>
            {/* Navigation / Header */}
            <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto z-20">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">📝</span>
                    <h1 className={`text-2xl text-emerald-800 tracking-wide ${headerFont}`}>{t("appTitle")}</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800 px-3 py-1 border border-emerald-200 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-emerald-50 transition-colors hidden sm:block"
                    >
                        {language === "en" ? "🇮🇶 العربية" : "🇺🇸 English"}
                    </button>

                    {session ? (
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="px-5 py-2 rounded-full bg-emerald-700 text-white font-medium shadow-lg hover:bg-emerald-800 transition-all"
                        >
                            {t("dashboard")}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate("/login")}
                                className="px-5 py-2 rounded-full text-emerald-800 font-medium border border-emerald-200 hover:bg-emerald-50 transition-colors"
                            >
                                {t("signIn")}
                            </button>
                            <button
                                onClick={() => navigate("/login", { state: { mode: 'signup' } })}
                                className="px-5 py-2 rounded-full bg-emerald-700 text-white font-medium shadow-lg hover:bg-emerald-800 transition-transform transform hover:-translate-y-0.5"
                            >
                                {t("signUp")}
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 md:px-8 relative overflow-hidden">
                {/* Background Decoration (Islamic Pattern Hint) */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="islamic-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                                <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#islamic-pattern)" className="text-emerald-900" />
                    </svg>
                </div>

                <div className="z-10 max-w-4xl space-y-8 animate-fade-in">
                    <h1 className={`text-5xl md:text-8xl text-emerald-900 leading-tight ${headerFont}`}>
                        {t("heroTitle")}
                    </h1>
                    <p className="text-xl md:text-2xl text-emerald-700/80 leading-relaxed font-light max-w-2xl mx-auto">
                        {t("heroSubtitle")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        {session ? (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="px-10 py-5 rounded-full bg-emerald-700 text-white text-xl font-semibold shadow-xl hover:bg-emerald-800 transition-all hover:scale-105"
                            >
                                {t("dashboard")}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login", { state: { mode: 'signup' } })}
                                    className="px-10 py-5 rounded-full bg-emerald-700 text-white text-xl font-semibold shadow-xl hover:bg-emerald-800 transition-all hover:scale-105"
                                >
                                    {t("startFree")}
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-10 py-5 rounded-full bg-white text-emerald-800 text-xl font-semibold shadow-md border border-emerald-100 hover:bg-emerald-50 transition-all hover:scale-105"
                                >
                                    {t("signIn")}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className={`text-3xl md:text-5xl text-center text-emerald-900 mb-16 underline decoration-emerald-200 decoration-4 underline-offset-8 ${headerFont}`}>
                        {t("featuresTitle")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-[#FDFBF7] border border-emerald-50 hover:shadow-xl transition-shadow duration-300 group">
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                                <h3 className="text-xl font-semibold text-emerald-800 mb-4">{f.title}</h3>
                                <p className="text-emerald-700/70 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-emerald-900 text-white px-4 md:px-8 relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <h2 className={`text-3xl md:text-5xl mb-16 ${headerFont}`}>
                        {t("testimonialsTitle")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-start">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-emerald-800/50 p-8 rounded-2xl border border-emerald-700">
                                <p className="text-xl italic mb-6 leading-relaxed">"{t.quote}"</p>
                                <p className="font-medium text-emerald-300">— {t.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Subtle pattern for testimonial section */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-20 -ml-32 -mb-32"></div>
            </section>

            {/* Final CTA */}
            {!session && (
                <section className="py-20 text-center px-4">
                    <h2 className={`text-3xl text-emerald-900 mb-8 ${headerFont}`}>{t("startFree")}</h2>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-12 py-5 rounded-full bg-emerald-700 text-white text-xl font-semibold shadow-2xl hover:bg-emerald-800 transition-all hover:scale-110"
                    >
                        {t("signUp")}
                    </button>
                </section>
            )}

            {/* Footer */}
            <footer className="w-full py-12 text-center text-emerald-600/60 text-sm border-t border-emerald-50 bg-white">
                <div className="flex justify-center gap-6 mb-4 text-emerald-800/80 font-medium">
                    <span className="cursor-pointer hover:text-emerald-600 transition-colors uppercase tracking-wider">About</span>
                    <span className="cursor-pointer hover:text-emerald-600 transition-colors uppercase tracking-wider">Privacy</span>
                    <span className="cursor-pointer hover:text-emerald-600 transition-colors uppercase tracking-wider">Contact</span>
                </div>
                &copy; {new Date().getFullYear()} {t("appTitle")}. {t("allRights")}
            </footer>
        </div>
    );
}
