import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
            <div className="prose prose-lg">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
                    <p className="text-lg text-gray-500 mt-2">Created on: {new Date().toLocaleDateString()}</p>
                </div>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to Lesson Planner ("we", "us", "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
                </p>

                <h2>2. Information We Collect</h2>
                <p>
                    We may collect information about you in a variety of ways. The information we may collect includes:
                </p>
                <ul>
                    <li>
                        <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, that you voluntarily give to us when you register with the application.
                    </li>
                    <li>
                        <strong>Data from Social Networks:</strong> If you register or log in using your social media account (e.g., Google), we may collect your name and email address from that service.
                    </li>
                    <li>
                        <strong>User-Generated Content:</strong> Any content you create, such as lesson plans, comments, and other data you enter into the application.
                    </li>
                </ul>

                <h2>3. Use of Your Information</h2>
                <p>
                    Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
                </p>
                <ul>
                    <li>Create and manage your account.</li>
                    <li>Provide, operate, and maintain our application.</li>
                    <li>Improve, personalize, and expand our application.</li>
                    <li>Communicate with you, either directly or through one of our partners, for customer service, to provide you with updates and other information relating to the application.</li>
                </ul>

                <h2>4. Disclosure of Your Information</h2>
                <p>
                    We do not share your personally identifiable information with third parties without your consent, except in the following situations:
                </p>
                <ul>
                    <li>
                        <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.
                    </li>
                    <li>
                        <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, hosting services (like Supabase), and customer service.
                    </li>
                </ul>

                <h2>5. Security of Your Information</h2>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </p>

                <h2>6. Your Data Rights</h2>
                <p>
                    You have the right to request access to the personal data we hold about you, to have any inaccuracies corrected, and to request the deletion of your personal data. You may terminate your account at any time, in which case we will delete your personal information.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    If you have questions or comments about this Privacy Policy, please contact us at <a href="mailto:ibnluqmanalawfaaweey@gmail.com" className='text-blue-600 hover:text-blue-800 font-medium'>ibnluqmanalawfaaweey@gmail.com</a>.
                </p>

                <div className="text-center mt-12">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
