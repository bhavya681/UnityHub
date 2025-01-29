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
import { 
  BookOpenIcon, ChartBarIcon, SparklesIcon, CheckCircleIcon,
  DocumentMagnifyingGlassIcon, PhotoIcon, UserGroupIcon,
  AcademicCapIcon, DocumentTextIcon, GlobeAltIcon, 
  BriefcaseIcon, CodeBracketIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Modern Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
               <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-12 flex justify-center">
              <Link to="/">
                <motion.div
                  className="inline-block transform hover:scale-105 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                >
                  <img
                    src={UnityHubLogo}
                    alt="LearnNova"
                    className="h-24 md:h-32 mx-auto filter brightness-125"
                  />
                </motion.div>
              </Link>
            </div>
         
         
          </motion.div>
        </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Transform Your Academic Journey with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                AI-Powered Innovation
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12">
              Elevate your academic performance with our integrated suite of intelligent tools designed for modern learners
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/documentation"
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-xl"
              >
                Platform Tour
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-150" />
        </div>
      </section>

      {/* Academic Solutions Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Integrated Academic Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seamlessly connected tools that adapt to your learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: "Study Mastery",
                features: ["Smart Note-taking", "Exam Strategist", "Grade Optimizer"],
                icon: AcademicCapIcon,
                color: "from-teal-500 to-cyan-600"
              },
              {
                category: "Productivity Suite",
                features: ["Project Orchestrator", "Expense Analyst", "Study Scheduler"],
                icon: BriefcaseIcon,
                color: "from-blue-500 to-indigo-600"
              },
              {
                category: "Creative Studio",
                features: ["AI Visual Enhancer", "Interactive Whiteboard", "Presentation Architect"],
                icon: CodeBracketIcon,
                color: "from-purple-500 to-fuchsia-600"
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{category.category}</h3>
                <ul className="space-y-3">
                  {category.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <CheckCircleIcon className="w-5 h-5 text-teal-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Trusted by Global Academic Community
            </h2>
            <p className="text-xl text-gray-600">Join 750,000+ students across 2,300+ institutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                text: "UnityHub's intelligent tools helped me balance research and coursework effortlessly. The grade prediction system is remarkably accurate!",
                author: "Dr. Emily Rodriguez",
                role: "Postdoctoral Researcher",
                university: "University of Cambridge"
              },
              {
                text: "The collaborative features revolutionized our group projects. We reduced preparation time by 60% while improving output quality.",
                author: "Raj Patel",
                role: "Engineering Team Lead",
                university: "MIT"
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-indigo-600 font-medium">{testimonial.university}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
              Begin Your Academic Revolution
            </h2>
            <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
              Experience the future of academic productivity - completely free forever
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/documentation"
                className="px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-xl text-lg font-semibold hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 shadow-xl"
              >
                Explore Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <img
                src={UnityHubLogo}
                alt="UnityHub"
                className="h-12 w-auto"
              />
              <p className="text-sm leading-relaxed">
                Empowering academic excellence through innovative technology solutions
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <GlobeAltIcon className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <DocumentTextIcon className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
                Solutions
              </h3>
              <ul className="space-y-4">
                <li><a href="/dictionary" className="text-sm hover:text-white transition-colors">Academic Tools</a></li>
                <li><a href="/news" className="text-sm hover:text-white transition-colors">Research Suite</a></li>
                <li><a href="/cartoon-selfie" className="text-sm hover:text-white transition-colors">AI Tools</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
                Resources
              </h3>
              <ul className="space-y-4">
                <li><a href="/documentation" className="text-sm hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com/bhavya681/UnityHub" className="text-sm hover:text-white transition-colors">Contribute</a></li>
             
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
                Connect
              </h3>
              <ul className="space-y-4">
               
                <li>
                <a href="https://www.linkedin.com/in/bhavya-wade/" className="text-sm hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/wade_bhavy55123" className="text-sm hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/bhavya_wade/" className="text-sm hover:text-white">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800">
            <p className="text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} UnityHub. Open-source academic platform.<br />
              Developed with ❤️ by Bhavya Wade
            </p>
          </div>
        </div>
      </footer>
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
            <Route path="/news" element={<Translator />} />
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
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;
