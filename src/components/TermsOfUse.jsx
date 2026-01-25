import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function TermsOfUse() {
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const isRtl = language === 'ar';

    return (
        <div className={`min-h-screen bg-gray-100 py-10 px-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <svg className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}></path>
                    </svg>
                    {t("btnBackHome")}
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-6">{t("termsOfUseTitle")}</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t("termsSection1Title")}</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">{t("termsSection1ContentP1")}</p>
                    <p className="text-gray-600 leading-relaxed">{t("termsSection1ContentP2")}</p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t("termsSection2Title")}</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">{t("termsSection2ContentP1")}</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>{t("termsSection2ListItem1")}</li>
                        <li>{t("termsSection2ListItem2")}</li>
                        <li>{t("termsSection2ListItem3")}</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">{t("termsSection3Title")}</h2>
                    <p className="text-gray-600 leading-relaxed">{t("termsSection3ContentP1")}</p>
                </section>
            </div>
        </div>
    );
}