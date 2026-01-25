import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // Read from localStorage or default to english
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("app_language") || "en";
    });

    const direction = language === "ar" ? "rtl" : "ltr";

    // When language changes, update localStorage and the HTML dir attribute
    useEffect(() => {
        localStorage.setItem("app_language", language);
        document.documentElement.dir = direction;
        document.documentElement.lang = language;
        document.body.className = direction === "rtl" ? "font-rtl" : "font-ltr";
    }, [language, direction]);

    // Helper to get translation
    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "ar" : "en"));
    };

    const value = {
        language,
        direction,
        toggleLanguage,
        t,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
