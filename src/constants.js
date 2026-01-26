// Bilingual constants for subjects, grades, and weeks
// These functions return the appropriate array based on the current language

// We need to store a canonical (English) value in the database
// but display localized values in the UI

export const getSubjects = (language = 'en') => {
    const subjects = [
        { value: "Quran", label_en: "Quran", label_ar: "القرآن الكريم" },
        { value: "Fiqh", label_en: "Fiqh", label_ar: "الفقه" },
        { value: "Tawheed", label_en: "Tawheed", label_ar: "التوحيد" },
        { value: "Hadith", label_en: "Hadith", label_ar: "الحديث" },
        { value: "Arabic", label_en: "Arabic", label_ar: "اللغة العربية" },
        { value: "Seerah", label_en: "Seerah", label_ar: "السيرة " },
        { value: "Huroof", label_en: "Huroof", label_ar: "الحروف" },
        { value: "Arqaam", label_en: "Arqaam", label_ar: "الأرقام" },
        { value: "Adhkar", label_en: "Adhkar", label_ar: "الأذكار" },
        { value: "`Ulumul-Quran", label_en: "`Ulumul-Quran", label_ar: "علوم القرآن" },
        { value: "`Ulumul-Hadith", label_en: "`Ulumul-Hadith", label_ar: "علوم الحديث" },
        { value: "Adaab", label_en: "Adaab", label_ar: "الآداب" },
    ];

    return subjects.map(s => ({
        value: s.value,
        label: language === 'ar' ? s.label_ar : s.label_en
    }));
};

export const getGrades = (language = 'en') => {
    const grades = [
        { value: "Hadanah", label_en: "Hadanah", label_ar: "الحضانة" },
        { value: "Raudah 1", label_en: "Raudah 1", label_ar: "الروضة الأولى" },
        { value: "Raudah 2", label_en: "Raudah 2", label_ar: "الروضة الثانية" },
        { value: "Raudah 3", label_en: "Raudah 3", label_ar: "الروضة الثالثة" },
        { value: "Primary 1", label_en: "Primary 1", label_ar: "الأول الابتدائي" },
        { value: "Primary 2", label_en: "Primary 2", label_ar: "الثاني الابتدائي" },
        { value: "Primary 3", label_en: "Primary 3", label_ar: "الثالث الابتدائي" },
        { value: "Primary 4", label_en: "Primary 4", label_ar: "الرابع الابتدائي" },
        { value: "Primary 5", label_en: "Primary 5", label_ar: "الخامس الابتدائي" },
        { value: "Primary 6", label_en: "Primary 6", label_ar: "السادس الابتدائي" },
        { value: "Tahfeez 1", label_en: "Tahfeez 1", label_ar: "التحفيظ الأول" },
        { value: "Tahfeez 2", label_en: "Tahfeez 2", label_ar: "التحفيظ الثاني" },
        { value: "Tahfeez 3", label_en: "Tahfeez 3", label_ar: "التحفيظ الثالث" },
    ];

    return grades.map(g => ({
        value: g.value,
        label: language === 'ar' ? g.label_ar : g.label_en
    }));
};

export const getWeeks = (language = 'en') => {
    const weeks = [
        { value: "Week 1", label_en: "Week 1", label_ar: "الأسبوع ١" },
        { value: "Week 2", label_en: "Week 2", label_ar: "الأسبوع ٢" },
        { value: "Week 3", label_en: "Week 3", label_ar: "الأسبوع ٣" },
        { value: "Week 4", label_en: "Week 4", label_ar: "الأسبوع ٤" },
        { value: "Week 5", label_en: "Week 5", label_ar: "الأسبوع ٥" },
        { value: "Week 6", label_en: "Week 6", label_ar: "الأسبوع ٦" },
        { value: "Week 7", label_en: "Week 7", label_ar: "الأسبوع ٧" },
        { value: "Week 8", label_en: "Week 8", label_ar: "الأسبوع ٨" },
        { value: "Week 9", label_en: "Week 9", label_ar: "الأسبوع ٩" },
        { value: "Week 10", label_en: "Week 10", label_ar: "الأسبوع ١٠" },
        { value: "Week 11", label_en: "Week 11", label_ar: "الأسبوع ١١" },
        { value: "Week 12", label_en: "Week 12", label_ar: "الأسبوع ١٢" },
        { value: "Week 13", label_en: "Week 13", label_ar: "الأسبوع ١٣" },
        { value: "Week 14", label_en: "Week 14", label_ar: "الأسبوع ١٤" },
        { value: "Week 15", label_en: "Week 15", label_ar: "الأسبوع ١٥" },
        { value: "Week 16", label_en: "Week 16", label_ar: "الأسبوع ١٦" },
        { value: "Week 17", label_en: "Week 17", label_ar: "الأسبوع ١٧" },
        { value: "Week 18", label_en: "Week 18", label_ar: "الأسبوع ١٨" },
        { value: "Week 19", label_en: "Week 19", label_ar: "الأسبوع ١٩" },
        { value: "Week 20", label_en: "Week 20", label_ar: "الأسبوع ٢٠" },
    ];

    return weeks.map(w => ({
        value: w.value,
        label: language === 'ar' ? w.label_ar : w.label_en
    }));
};

// Legacy exports for backward compatibility (default to English)
// These return simple string arrays for components that don't need value/label separation
export const SUBJECTS = getSubjects('en').map(s => s.value);
export const GRADES = getGrades('en').map(g => g.value);
export const WEEKS = getWeeks('en').map(w => w.value);