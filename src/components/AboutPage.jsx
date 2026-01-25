import { Link } from 'react-router-dom';

export default function AboutPage() {
    // TODO: Replace this with your actual GitHub repository URL
    const githubRepoUrl = "https://github.com/atomic-ustadh/my-lesson-plan-app";

    return (
        <div className="bg-[#FDFBF7] text-gray-800">
            <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-emerald-900">About Our Mission</h1>
                    <p className="text-xl text-emerald-700/80 mt-4 leading-relaxed">
                        Empowering educators with tools that understand their needs.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="space-y-12 prose prose-lg max-w-none">
                    {/* Our Mission Section */}
                    <div>
                        <h2 className="text-3xl font-semibold text-emerald-800">Our Mission</h2>
                        <p>
                            In today's fast-paced educational environment, teachers need tools that are not just powerful, but also intuitive, flexible, and culturally aware. Our mission is to empower educators, particularly in Islamic schools, with a modern lesson planning application that respects and integrates the unique bilingual needs of English and Arabic curricula. We aim to streamline the planning process, giving teachers more time to focus on what they do best: inspiring and educating students.
                        </p>
                    </div>

                    {/* The Story Section */}
                    <div>
                        <h2 className="text-3xl font-semibold text-emerald-800">The Story Behind the App</h2>
                        <p>
                            This application was born from a simple observation: a lack of high-quality, bilingual educational tools designed with the specific workflows of Islamic schools in mind. Seeing this gap, we were motivated to create a solution that was more than just a text editor—a comprehensive platform that handles right-to-left language support seamlessly and understands the structure of a well-defined lesson plan.
                        </p>
                    </div>

                    {/* Open Source & Contribution Section */}
                    <div>
                        <h2 className="text-3xl font-semibold text-emerald-800">Open Source & Contribution</h2>
                        <p>
                            We believe in the power of community and collaboration. This project is open-source, and we welcome contributions from developers, educators, and designers who share our vision. Whether you're fixing a bug, proposing a new feature, or improving translations, your input is valuable.
                        </p>
                        <p>
                            You can find the complete installation and usage guide on our GitHub repository. Fork the project, submit pull requests, and help us build the future of educational tools together.
                        </p>
                        <div className="text-center mt-6">
                            <a
                                href={githubRepoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-4 rounded-full bg-gray-800 text-white text-lg font-semibold shadow-lg hover:bg-gray-900 transition-all hover:scale-105"
                            >
                                Contribute on GitHub
                            </a>
                        </div>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-20">
                    <Link to="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
