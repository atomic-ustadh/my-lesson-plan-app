import { Link } from 'react-router-dom';

export default function TermsOfUse() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
            <div className="prose prose-lg">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900">Terms of Use</h1>
                    <p className="text-lg text-gray-500 mt-2">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>

                <h2>1. Agreement to Terms</h2>
                <p>
                    By using our application, Lesson Planner ("the Service"), you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, do not use the Service.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                    The Service is a lesson planning application that allows users to create, store, and manage educational lesson plans. The features and functionality are provided as-is and may be modified or discontinued at our sole discretion.
                </p>

                <h2>3. User Accounts</h2>
                <p>
                    When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service (if applicable) and for any activities or actions under your account. You agree not to disclose your password to any third party.
                </p>

                <h2>4. User-Generated Content</h2>
                <p>
                    You are solely responsible for the content you create and store using the Service ("User Content"), including its legality, reliability, and appropriateness. You retain all of your rights to any User Content you submit, post or display on or through the Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for User Content you or any third-party posts on or through the Service.
                </p>

                <h2>5. Acceptable Use</h2>
                <p>
                    You agree not to use the Service for any unlawful purpose or to engage in any activity that would violate these Terms. You agree not to:
                </p>
                <ul>
                    <li>Upload any content that is illegal, harmful, or infringing on the rights of others.</li>
                    <li>Attempt to gain unauthorized access to our systems or engage in any activity that disrupts, diminishes the quality of, interferes with the performance of, or impairs the functionality of, the Service.</li>
                    <li>Use the Service for any commercial purpose without our prior written consent.</li>
                </ul>

                <h2>6. Termination</h2>
                <p>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h2>7. Limitation of Liability</h2>
                <p>
                    In no event shall we, nor our directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>

                <h2>8. Governing Law</h2>
                <p>
                    These Terms shall be governed and construed in accordance with the Jurisdiction of the Federal Government of Nigeria, without regard to its conflict of law provisions.
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
