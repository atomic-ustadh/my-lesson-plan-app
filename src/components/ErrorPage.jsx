import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function ErrorPage({ code = "404" }) {
    const { t, toggleLanguage, language } = useLanguage();
    const navigate = useNavigate();

    const is404 = code === "404";

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background Pattern (Subtle) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#065f46 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* Language Toggle */}
            <button
                onClick={toggleLanguage}
                className="absolute top-6 end-6 px-4 py-2 rounded-full border border-emerald-200 bg-white/80 backdrop-blur-md text-emerald-800 text-sm font-medium hover:bg-emerald-50 transition-all shadow-sm"
            >
                {language === 'en' ? '🇮🇶 العربية' : '🇺🇸 English'}
            </button>

            <div className="text-center relative z-10 max-w-lg">
                {/* Visual Element */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-emerald-300 select-none">
                        {code}
                    </h1>
                </div>

                <h2 className="text-3xl md:text-4xl text-emerald-900 mb-4">
                    {is404 ? t("err404Title") : t("err500Title")}
                </h2>

                <p className="text-emerald-700 mb-10 text-lg">
                    {is404 ? t("err404Desc") : t("err500Desc")}
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-4 bg-emerald-700 text-white rounded-full font-medium shadow-lg hover:bg-emerald-800 transition-all hover:scale-105 active:scale-95"
                >
                    {t("btnBackHome")}
                </button>
            </div>

            {/* Subtle Islamic Motif at corner */}
            <div className="absolute -bottom-24 -start-24 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-24 -end-24 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl"></div>
        </div>
    );
}
