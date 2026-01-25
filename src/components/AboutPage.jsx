import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    // TODO: Replace this with your actual GitHub repository URL
    const githubRepoUrl = "https://github.com/atomic-ustadh/my-lesson-plan-app";

    return (
        <div className={`bg-[#FDFBF7] text-gray-800 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-emerald-900">{t("aboutTitle")}</h1>
                    <p className="text-xl text-emerald-700/80 mt-4 leading-relaxed">
                        {t("aboutSubtitle")}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="space-y-12 prose prose-lg max-w-none">
                    {/* Our Mission Section */}
                    <div>
                        <h2 className="text-3xl font-semibold text-emerald-800">{t("aboutMissionTitle")}</h2>
                        <p>
                            {t("aboutMissionContent")}
                        </p>
                    </div>

                    {/* The Story Section */}
                    <div>
                        <h2 className="text-3xl font-semibold text-emerald-800">{t("aboutStoryTitle")}</h2>
                        <p>
                            {t("aboutStoryContent")}
                        </p>
                    </div>

                    {/* Open Source & Contribution Section */}
                    <div>
                        <h2 className="text-3xl font-semibold text-emerald-800">{t("aboutOpenSourceTitle")}</h2>
                        <p>
                            {t("aboutOpenSourceContentP1")}
                        </p>
                        <p>
                            {t("aboutOpenSourceContentP2")}
                        </p>
                        <div className="text-center mt-6">
                            <a
                                href={githubRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-4 rounded-full bg-gray-800 text-white text-lg font-semibold shadow-lg hover:bg-gray-900 transition-all hover:scale-105"
                            >
                                {t("aboutGithubButton")}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-20">
                    <Link to="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
                        &larr; {t("btnBackHome")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
