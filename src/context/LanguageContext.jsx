import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    // Default to English, as Arabic support is removed
    const [language, setLanguage] = useState("en");

    const direction = "ltr";

    // When language changes, update localStorage and the HTML dir attribute
    useEffect(() => {
        localStorage.setItem("app_language", language);
        document.documentElement.dir = direction;
        document.documentElement.lang = language;
        document.body.className = "font-ltr";
    }, [language, direction]);

    // Helper to get translation
    const t = (key) => {
        return translations.en[key] || key;
    };

    const value = {
        language,
        direction,
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
