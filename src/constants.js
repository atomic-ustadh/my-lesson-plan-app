// Bilingual constants for subjects, grades, and weeks
// These functions return the appropriate array based on the current language

// We need to store a canonical (English) value in the database
// but display localized values in the UI

export const getSubjects = (language = 'en') => {
    const subjects = [
        { value: "Quran", label_en: "Quran", label_ar: "القرآن الكريم" },
        { value: "Islamic Studies", label_en: "Islamic Studies", label_ar: "الدراسات الإسلامية" },
        { value: "Arabic", label_en: "Arabic", label_ar: "اللغة العربية" },
        { value: "English", label_en: "English", label_ar: "اللغة الإنجليزية" },
        { value: "Mathematics", label_en: "Mathematics", label_ar: "الرياضيات" },
        { value: "Science", label_en: "Science", label_ar: "العلوم" },
        { value: "Social Studies", label_en: "Social Studies", label_ar: "الدراسات الاجتماعية" },
        { value: "Computer Science", label_en: "Computer Science", label_ar: "علوم الحاسوب" },
        { value: "Art", label_en: "Art", label_ar: "الفنون" },
        { value: "PE", label_en: "PE", label_ar: "التربية البدنية" },
    ];

    return subjects.map(s => ({
        value: s.value,
        label: language === 'ar' ? s.label_ar : s.label_en
    }));
};

export const getGrades = (language = 'en') => {
    const grades = [
        { value: "Grade 1", label_en: "Grade 1", label_ar: "الصف الأول" },
        { value: "Grade 2", label_en: "Grade 2", label_ar: "الصف الثاني" },
        { value: "Grade 3", label_en: "Grade 3", label_ar: "الصف الثالث" },
        { value: "Grade 4", label_en: "Grade 4", label_ar: "الصف الرابع" },
        { value: "Grade 5", label_en: "Grade 5", label_ar: "الصف الخامس" },
        { value: "Grade 6", label_en: "Grade 6", label_ar: "الصف السادس" },
        { value: "Grade 7", label_en: "Grade 7", label_ar: "الصف السابع" },
        { value: "Grade 8", label_en: "Grade 8", label_ar: "الصف الثامن" },
        { value: "Grade 9", label_en: "Grade 9", label_ar: "الصف التاسع" },
        { value: "Grade 10", label_en: "Grade 10", label_ar: "الصف العاشر" },
        { value: "Grade 11", label_en: "Grade 11", label_ar: "الصف الحادي عشر" },
        { value: "Grade 12", label_en: "Grade 12", label_ar: "الصف الثاني عشر" }
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