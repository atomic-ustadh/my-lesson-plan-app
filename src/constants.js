// Bilingual constants for subjects, grades, and weeks
// These functions return the appropriate array based on the current language

export const getSubjects = (language = 'en') => {
    if (language === 'ar') {
        return [
            "القرآن الكريم",
            "الدراسات الإسلامية",
            "اللغة العربية",
            "اللغة الإنجليزية",
            "الرياضيات",
            "العلوم",
            "الدراسات الاجتماعية",
            "علوم الحاسوب",
            "الفنون",
            "التربية البدنية",
        ];
    }
    return [
        "Quran",
        "Islamic Studies",
        "Arabic",
        "English",
        "Mathematics",
        "Science",
        "Social Studies",
        "Computer Science",
        "Art",
        "PE",
    ];
};

export const getGrades = (language = 'en') => {
    if (language === 'ar') {
        return [
            "الصف الأول",
            "الصف الثاني",
            "الصف الثالث",
            "الصف الرابع",
            "الصف الخامس",
            "الصف السادس",
            "الصف السابع",
            "الصف الثامن",
            "الصف التاسع",
            "الصف العاشر",
            "الصف الحادي عشر",
            "الصف الثاني عشر"
        ];
    }
    return [
        "Grade 1",
        "Grade 2",
        "Grade 3",
        "Grade 4",
        "Grade 5",
        "Grade 6",
        "Grade 7",
        "Grade 8",
        "Grade 9",
        "Grade 10",
        "Grade 11",
        "Grade 12"
    ];
};

export const getWeeks = (language = 'en') => {
    if (language === 'ar') {
        return [
            "الأسبوع ١",
            "الأسبوع ٢",
            "الأسبوع ٣",
            "الأسبوع ٤",
            "الأسبوع ٥",
            "الأسبوع ٦",
            "الأسبوع ٧",
            "الأسبوع ٨",
            "الأسبوع ٩",
            "الأسبوع ١٠",
            "الأسبوع ١١",
            "الأسبوع ١٢",
            "الأسبوع ١٣",
            "الأسبوع ١٤",
            "الأسبوع ١٥",
            "الأسبوع ١٦",
            "الأسبوع ١٧",
            "الأسبوع ١٨",
            "الأسبوع ١٩",
            "الأسبوع ٢٠",
        ];
    }
    return [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Week 8",
        "Week 9",
        "Week 10",
        "Week 11",
        "Week 12",
        "Week 13",
        "Week 14",
        "Week 15",
        "Week 16",
        "Week 17",
        "Week 18",
        "Week 19",
        "Week 20",
    ];
};

// Legacy exports for backward compatibility (default to English)
export const SUBJECTS = getSubjects('en');
export const GRADES = getGrades('en');
export const WEEKS = getWeeks('en');