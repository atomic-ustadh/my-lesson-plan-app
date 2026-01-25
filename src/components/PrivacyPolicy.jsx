import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicy() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';
    const navigate = useNavigate();

    return (
        <div className={`max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-800 ${isRtl ? 'text-right' : 'text-left'}`}>
            <button
                onClick={() => navigate('/')}
                className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                {t("btnBackHome")}
            </button>
            <div className="prose prose-lg">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">{t("privacyPolicyTitle")}</h1>
                </div>

                <h2 className="text-2xl font-semibold text-gray-700">{t("privacySection1Title")}</h2>
                <p className="mb-4">
                    {t("privacySection1Content")}
                </p>

                <h2 className="text-2xl font-semibold text-gray-700">{t("privacySection2Title")}</h2>
                <p>
                    {t("privacySection2Content")}
                </p>
                <ul className="mb-4">
                    <li>
                        <strong>{t("privacySection2ListItem1Strong")}</strong> {t("privacySection2ListItem1")}
                    </li>
                    <li>
                        <strong>{t("privacySection2ListItem2Strong")}</strong> {t("privacySection2ListItem2")}
                    </li>
                    <li>
                        <strong>{t("privacySection2ListItem3Strong")}</strong> {t("privacySection2ListItem3")}
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-700">{t("privacySection3Title")}</h2>
                <p>
                    {t("privacySection3Content")}
                </p>
                <ul className="mb-4">
                    <li>{t("privacySection3ListItem1")}</li>
                    <li>{t("privacySection3ListItem2")}</li>
                    <li>{t("privacySection3ListItem3")}</li>
                    <li>{t("privacySection3ListItem4")}</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-700">{t("privacySection4Title")}</h2>
                <p>
                    {t("privacySection4Content")}
                </p>
                <ul className="mb-4">
                    <li>
                        <strong>{t("privacySection4ListItem1Strong")}</strong> {t("privacySection4ListItem1")}
                    </li>
                    <li>
                        <strong>{t("privacySection4ListItem2Strong")}</strong> {t("privacySection4ListItem2")}
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-700">{t("privacySection5Title")}</h2>
                <p className="mb-4">
                    {t("privacySection5Content")}
                </p>

                <h2 className="text-2xl font-semibold text-gray-700">{t("privacySection6Title")}</h2>
                <p className="mb-4">
                    {t("privacySection6Content")}
                </p>

                <h2 className="text-2xl font-semibold text-gray-700">{t("privacySection7Title")}</h2>
                <p className="mb-4">
                    {t("privacySection7Content")} <a href="mailto:ibnluqmanalawfaaweey@gmail.com" className='text-blue-600 hover:text-blue-800 font-medium'>ibnluqmanalawfaaweey@gmail.com</a>.
                </p>
            </div>
        </div>
    );
}
