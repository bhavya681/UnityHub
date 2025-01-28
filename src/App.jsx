import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Esign from "./pages/Esign";
import QuestionBankGenerator from "./pages/QuestionBankGenerator";
import AISummarizer from "./pages/AISummarizer";
import Header from "./components/Header";
import Contact from "./pages/Contact";
import StudyPlanner from "./pages/StudyPlanner";
import GradeTracker from "./pages/GradeTracker";
import SmartBoard from "./pages/SmartBoard";
import Trail from "./pages/Trail";
import ExpenseTracker from "./pages/ExpenseTracker ";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import Documentation from "./pages/Documentation";
import Footer from "./components/Footer";
import Services from "./pages/Services";
import SignUp from "./pages/SignUp";
import UnityHubLogo from "../public/newLogo-removebg-preview.png";
import PassportPhotoGenerator from "./pages/PassportPhotoGenerator";
import Dictionary from "./pages/Dictionary";
import Translator from "./pages/Translator";
import InputForm from "./pages/resume/InputForm";
import ResumePreview from "./pages/resume/ResumePreview";
import JobDescriptionAnalyzer from "./pages/resume/JobDescriptionAnalyzer";
import ATSScore from "./pages/resume/ATSScore";
import UrlShortener from "./components/UrlShortener";
import PomodoroTimer from "./components/PomodoroTimer";
import Markdownreviewer from "./components/Markdownreviewer";
import QrCodeGenerator from "./components/QrCodeGenerator";
import Error4U from "./pages/Error4U";
import TimeZoneConverter from "./pages/TimeZoneConverter";
import DataBreachChecker from "./pages/DataBreachChecker";
import { motion } from 'framer-motion';
import PassportPhoto from "./components/PassportPhoto";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-400">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Link to="/">
              <motion.div
                className="transform hover:scale-105 transition-transform duration-300 animate-bounce"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  src={UnityHubLogo}
                  alt="LearnNova"
                  className="h-16 md:h-20 mx-auto bg-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </Link>
            <h1 className="mt-8 text-4xl md:text-6xl font-bold text-gray-900 leading-tight animate-fade-in">
              Empower Your Workflow with <span className="text-blue-600">LearnNova</span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-gray-600">
              Your all-in-one platform for seamless productivity and collaboration
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:bg-gradient-to-l from-blue-600 to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Explore Services
              </Link>
              <Link
                to="/documentation"
                className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-gray-50 border border-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose LearnNova?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Seamless Integration",
                description: "Connect and sync with your favorite tools effortlessly",
                iconPath: "M12 6v6m0 0v6m0-6h6m-6 0H6",
                iconColor: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                title: "Secure Cloud Storage",
                description: "Access your data anywhere with enterprise-grade security",
                iconPath: "M19 9l-7 7-7-7",
                iconColor: "text-green-600",
                bgColor: "bg-green-100",
              },
              {
                title: "Advanced Analytics",
                description: "Make data-driven decisions with powerful insights",
                iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                iconColor: "text-purple-600",
                bgColor: "bg-purple-100",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-xl hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 ${feature.bgColor} rounded-full flex items-center justify-center`}
                >
                  <svg
                    className={`w-8 h-8 ${feature.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={feature.iconPath}
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            AI Tools at Your Fingertips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { path: "/cartoon-selfie", label: "Cartoon Selfie" },
              { path: "/face-cutout", label: "Face Cutout" },
              { path: "/remove-background", label: "Remove Background" },
              { path: "/passport-photo", label: 'Passport Photo' },
            ].map((tool, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <Link
                  to={tool.path}
                  className="block text-xl font-semibold text-blue-600 hover:underline"
                >
                  {tool.label}
                </Link>
                <p className="mt-4 text-gray-600">
                  Try out our powerful AI tools to enhance your tasks.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">About LearnNova</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              LearnNova is more than just a productivity platform. We're on a mission to transform how teams work together, making collaboration seamless and efficient. Our innovative solutions are designed to help you achieve more while doing less.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of teams already using LearnNova
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/e-sign" element={<Esign />} />
            <Route path="/smart-board" element={<SmartBoard />} />
            <Route path="/question-bank" element={<QuestionBankGenerator />} />
            <Route path="/ai-summarizer" element={<AISummarizer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/study-plan" element={<StudyPlanner />} />
            <Route path="/grade-tracker" element={<GradeTracker />} />
            <Route path="/expense-tracker" element={<ExpenseTracker />} />
            <Route path="/invoice-generator" element={<InvoiceGenerator />} />
            <Route path="/project-tracker" element={<Trail />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/services" element={<Services />} />
            <Route path="/password-generator" element={<PassportPhotoGenerator />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/compress" element={<Translator />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/resume-builder" element={<InputForm />} />
            <Route path="/resume-preview" element={<ResumePreview />} />
            <Route path="/resume-jobdesc" element={<JobDescriptionAnalyzer />} />
            <Route path="/resume-ats" element={<ATSScore />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/url-shortener" element={<UrlShortener />} />
            <Route path="/timezoneconvertor" element={<TimeZoneConverter />} />
            <Route path="/databreachchecker" element={<DataBreachChecker />} />
            <Route path="/services" element={<Services />} />
            <Route path="*" element={<Error4U />} />
            <Route path="/cartoon-selfie" element={<PomodoroTimer />} />
            <Route path="/face-cutout" element={<Markdownreviewer />} />
            <Route path="/remove-background" element={<QrCodeGenerator />} />
            <Route path="/passport-photo" element={<PassportPhoto />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
