import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function PrivacyPolicy() {
    const { t, language } = useLanguage();
    const isRtl = language === 'ar';

    return (
        <div className={`max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-800 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="prose prose-lg">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">{t("privacyPolicyTitle")}</h1>
                </div>

                <h2>{t("privacySection1Title")}</h2>
                <p>
                    {t("privacySection1Content")}
                </p>

                <h2>{t("privacySection2Title")}</h2>
                <p>
                    {t("privacySection2Content")}
                </p>
                <ul>
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

                <h2>{t("privacySection3Title")}</h2>
                <p>
                    {t("privacySection3Content")}
                </p>
                <ul>
                    <li>{t("privacySection3ListItem1")}</li>
                    <li>{t("privacySection3ListItem2")}</li>
                    <li>{t("privacySection3ListItem3")}</li>
                    <li>{t("privacySection3ListItem4")}</li>
                </ul>

                <h2>{t("privacySection4Title")}</h2>
                <p>
                    {t("privacySection4Content")}
                </p>
                <ul>
                    <li>
                        <strong>{t("privacySection4ListItem1Strong")}</strong> {t("privacySection4ListItem1")}
                    </li>
                    <li>
                        <strong>{t("privacySection4ListItem2Strong")}</strong> {t("privacySection4ListItem2")}
                    </li>
                </ul>

                <h2>{t("privacySection5Title")}</h2>
                <p>
                    {t("privacySection5Content")}
                </p>

                <h2>{t("privacySection6Title")}</h2>
                <p>
                    {t("privacySection6Content")}
                </p>

                <h2>{t("privacySection7Title")}</h2>
                <p>
                    {t("privacySection7Content")} <a href="mailto:ibnluqmanalawfaaweey@gmail.com" className='text-blue-600 hover:text-blue-800 font-medium'>ibnluqmanalawfaaweey@gmail.com</a>.
                </p>

                <div className="text-center mt-12">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                        &larr; {t("btnBackHome")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
