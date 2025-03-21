// import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// import Esign from "./pages/Esign";
// import QuestionBankGenerator from "./pages/QuestionBankGenerator";
// import AISummarizer from "./pages/AISummarizer";
// import Header from "./components/Header";
// import Contact from "./pages/Contact";
// import StudyPlanner from "./pages/StudyPlanner";
// import GradeTracker from "./pages/GradeTracker";
// import SmartBoard from "./pages/SmartBoard";
// import Trail from "./pages/Trail";
// import ExpenseTracker from "./pages/ExpenseTracker ";
// import InvoiceGenerator from "./pages/InvoiceGenerator";
// import Documentation from "./pages/Documentation";
// import Footer from "./components/Footer";
// import Services from "./pages/Services";
// import SignUp from "./pages/SignUp";
// import UnityHubLogo from "../public/newLogo-removebg-preview.png";
// import PassportPhotoGenerator from "./pages/PassportPhotoGenerator";
// import Dictionary from "./pages/Dictionary";
// import Translator from "./pages/Translator";
// import InputForm from "./pages/resume/InputForm";
// import ResumePreview from "./pages/resume/ResumePreview";
// import JobDescriptionAnalyzer from "./pages/resume/JobDescriptionAnalyzer";
// import ATSScore from "./pages/resume/ATSScore";
// import UrlShortener from "./components/UrlShortener";
// import PomodoroTimer from "./components/PomodoroTimer";
// import Markdownreviewer from "./components/Markdownreviewer";
// import QrCodeGenerator from "./components/QrCodeGenerator";
// import Error4U from "./pages/Error4U";
// import TimeZoneConverter from "./pages/TimeZoneConverter";
// import DataBreachChecker from "./pages/DataBreachChecker";
// import { motion } from 'framer-motion';
// import PassportPhoto from "./components/PassportPhoto";
// import { 
//   BookOpenIcon, ChartBarIcon, SparklesIcon, CheckCircleIcon,
//   DocumentMagnifyingGlassIcon, PhotoIcon, UserGroupIcon,
//   AcademicCapIcon, DocumentTextIcon, GlobeAltIcon, RocketLaunchIcon ,
//   BriefcaseIcon, CodeBracketIcon
// } from '@heroicons/react/24/outline';
// import { useRef,useEffect } from "react";
// import ImageEditor from "./pages/ImageEditor";
// import SystemDesign from "./pages/SystemDesign";
// const Home = () => {

//   const scrollRef = useRef(null);

//   // Auto-scroll effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (scrollRef.current) {
//         scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
//         if (
//           scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
//           scrollRef.current.scrollWidth
//         ) {
//           scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
//         }
//       }
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);
//   const testimonials = [
//     {
//       text: "This app is a lifesaver! The invoice generator helped me send professional invoices instantly.",
//       author: "Samantha K.",
//       rating: 5,
//     },
//     {
//       text: "I love how easy it is to create passport photos. No more running to photo studios!",
//       author: "James L.",
//       rating: 4.5,
//     },
//     {
//       text: "The background remover is insanely good! Helped me clean up product photos in seconds.",
//       author: "Emily T.",
//       rating: 5,
//     },
//     {
//       text: "I use this app daily for creating digital signboards. Super smooth experience!",
//       author: "Ryan P.",
//       rating: 4,
//     },
//     {
//       text: "Simple, effective, and free! What else could I ask for? Highly recommended!",
//       author: "Chris M.",
//       rating: 5,
//     },
//   ];
//   return (
//     <div className="min-h-screen  bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
//       {/* Modern Hero Section with Parallax Effect */}
//       <section id="home" className="relative h-[45rem] flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
//         <div className="container mx-auto px-4 text-center relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="max-w-6xl mx-auto"
//           >
//             <div className="mb-12 flex justify-center pt-[1rem]">
//               <Link to="/" className="group">
//                 <motion.div
//                   className="inline-block transform hover:scale-105 transition-transform duration-300"
//                   whileHover={{ rotate: [0, -10, 10, 0] }}
//                 >
//                   <img
//                     src={UnityHubLogo}
//                     alt="UnityHub"
//                     className="h-24 md:h-32 mx-auto filter brightness-125 drop-shadow-2xl animate-float"
//                   />
//                 </motion.div>
//               </Link>
//             </div>
          

//             <motion.h1
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"
//             >
//               Revolutionizing Academic Excellence Through
//               <span className="block mt-4 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
//                 Intelligent Automation
//               </span>
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 font-light"
//             >
//               Harness the power of AI-driven academic optimization with our integrated suite of smart learning tools
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="flex flex-col sm:flex-row gap-6 justify-center mb-[1rem] text-center items-center"
//             >
//               <Link
//                 to="/documentation"
//                 className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-2"
//               >
//                 <SparklesIcon className="w-6 h-6" />
//                 Start Free 
//               </Link>
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Interactive Background Particles */}
//         <div className="absolute inset-0 opacity-20">
//           {[...Array(20)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute w-2 h-2 bg-teal-400 rounded-full"
//               style={{
//                 top: `${Math.random() * 100}%`,
//                 left: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 y: [0, 40, 0],
//                 opacity: [0.4, 0.8, 0.4],
//               }}
//               transition={{
//                 duration: 4 + Math.random() * 4,
//                 repeat: Infinity,
//                 delay: Math.random() * 2,
//               }}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Feature Showcase - Holographic Grid */}
//       <section className="py-24 bg-white">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             className="text-center mb-20"
//           >
//             <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               Next-Gen Academic Toolkit
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
//               Integrated solutions combining AI, collaboration, and predictive analytics
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 category: "Cognitive Assistant",
//                 features: ["Adaptive Learning Paths", "Predictive Grading", "Smart Research"],
//                 icon: AcademicCapIcon,
//                 color: "from-teal-500 to-cyan-600",
//                 pattern: "pattern-circuit"
//               },
//               {
//                 category: "Productivity Nexus",
//                 features: ["Automated Scheduling", "Resource Optimization", "Team Synergy"],
//                 icon: BriefcaseIcon,
//                 color: "from-blue-500 to-indigo-600",
//                 pattern: "pattern-plus"
//               },
//               {
//                 category: "Innovation Studio",
//                 features: ["AI Visualization", "Interactive Prototyping", "Dynamic Presentation"],
//                 icon: CodeBracketIcon,
//                 color: "from-purple-500 to-fuchsia-600",
//                 pattern: "pattern-wiggle"
//               },
//             ].map((category, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="group relative p-8 bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 overflow-hidden"
//               >
//                 <div className={`absolute inset-0 ${category.pattern} opacity-5 -z-1`} />
//                 <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
//                   <category.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold mb-4 text-gray-900">{category.category}</h3>
//                 <ul className="space-y-3">
//                   {category.features.map((feature, i) => (
//                     <motion.li 
//                       key={i}
//                       whileHover={{ x: 5 }}
//                       className="flex items-center text-gray-600 font-medium"
//                     >
//                       <CheckCircleIcon className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" />
//                       <span>{feature}</span>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
//             What Our Users Say
//           </h2>
//           <p className="text-xl font-light text-blue-200">
//             See why people love using our tools!
//           </p>
//         </div>

//         {/* Scrollable Testimonials */}
//         <div className="relative overflow-hidden">
//           <motion.div
//             ref={scrollRef}
//             className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
//             initial={{ x: 50, opacity: 0 }}
//             whileInView={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             {testimonials.map((testimonial, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.2 }}
//                 viewport={{ once: true }}
//                 className="min-w-[80%] md:min-w-[45%] lg:min-w-[30%] bg-white/10 text-white p-6 rounded-2xl shadow-lg snap-center backdrop-blur-lg border border-white/20 hover:scale-105 transition-transform duration-300"
//               >
//                 {/* Testimonial Text */}
//                 <p className="text-lg leading-relaxed italic">
//                   "{testimonial.text}"
//                 </p>

//                 {/* Author & Rating */}
//                 <div className="mt-4 flex justify-between items-center">
//                   <h4 className="text-lg font-semibold">{testimonial.author}</h4>
//                   <div className="text-yellow-400 text-lg">
//                     {"★".repeat(Math.floor(testimonial.rating))}
//                     {testimonial.rating % 1 !== 0 && <span>☆</span>}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </div>
//     </section>
// {/* Floating CTA Section */}
// <section className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-center">
//   <div className="container mx-auto px-4">
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }} 
//       whileInView={{ opacity: 1, y: 0 }} 
//       className="max-w-4xl mx-auto"
//     >
//       <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
//         Try It Now – It's Free!
//       </h2>
//       <p className="text-xl text-blue-200 mb-12">
//         Experience the best tools for invoices, passport photos, background removal & more.
//       </p>
//       <a
//         href="#home"
//         className="px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-xl text-lg font-semibold hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 shadow-xl"
//       >
//         Get Started
//       </a>
//     </motion.div>
//   </div>
// </section>
    
//       {/* Professional Footer */}
//       <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-gray-300">
//         <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
//             <div className="space-y-6">
//               <img
//                 src={UnityHubLogo}
//                 alt="UnityHub"
//                 className="h-12 w-auto"
//               />
//               <p className="text-sm leading-relaxed">
//                 Empowering academic excellence through innovative technology solutions
//               </p>
//               <div className="flex space-x-4">
//                 <a href="https://learnova1.vercel.app" className="text-gray-400 hover:text-white transition-colors">
//                   <GlobeAltIcon className="h-6 w-6" />
//                 </a>
//                 <a href="/documentation" className="text-gray-400 hover:text-white transition-colors">
//                   <DocumentTextIcon className="h-6 w-6" />
//                 </a>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
//                 Solutions
//               </h3>
//               <ul className="space-y-4">
//                 <li><a href="/dictionary" className="text-sm hover:text-white transition-colors">Academic Tools</a></li>
//                 <li><a href="/news" className="text-sm hover:text-white transition-colors">Research Suite</a></li>
//                 <li><a href="/cartoon-selfie" className="text-sm hover:text-white transition-colors">AI Tools</a></li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
//                 Resources
//               </h3>
//               <ul className="space-y-4">
//                 <li><a href="/documentation" className="text-sm hover:text-white transition-colors">Documentation</a></li>
//                 <li><a href="https://github.com/bhavya681/UnityHub" className="text-sm hover:text-white transition-colors">Contribute</a></li>
//               <li><a href="https://bhavyawade.vercel.app/" className="text-sm hover:text-white transition-colors">Portfolio</a></li>
//               </ul>
//             </div>

//             <div>
//               <h3 className="text-sm font-semibold tracking-wider uppercase text-white mb-6">
//                 Connect
//               </h3>
//               <ul className="space-y-4">
               
//                 <li>
//                 <a href="https://www.linkedin.com/in/bhavya-wade/" className="text-sm hover:text-white">
//                     LinkedIn
//                   </a>
//                 </li>
//                 <li>
//                   <a href="https://twitter.com/wade_bhavy55123" className="text-sm hover:text-white">
//                     Twitter
//                   </a>
//                 </li>
//                 <li>
//                   <a href="https://www.instagram.com/bhavya_wade/" className="text-sm hover:text-white">
//                     Instagram
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="mt-16 pt-8 border-t border-gray-800">
//             <p className="text-xs text-gray-400 text-center">
//               © {new Date().getFullYear()} LearnNova. Open-source academic platform.<br />
//               Developed with ❤️ by Bhavya Wade
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <div className="min-h-screen flex flex-col">
//         <Header />
//         <main className="flex-grow">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/e-sign" element={<Esign />} />
//             <Route path="/smart-board" element={<SmartBoard />} />
//             <Route path="/screenshort-edit" element={<ImageEditor />} />
//             <Route path="/question-bank" element={<QuestionBankGenerator />} />
//             <Route path="/ai-summarizer" element={<AISummarizer />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/study-plan" element={<StudyPlanner />} />
//             <Route path="/grade-tracker" element={<GradeTracker />} />
//             <Route path="/expense-tracker" element={<ExpenseTracker />} />
//             <Route path="/invoice-generator" element={<InvoiceGenerator />} />
//             <Route path="/project-tracker" element={<Trail />} />
//             <Route path="/documentation" element={<Documentation />} />
//             <Route path="/services" element={<Services />} />
//             <Route path="/password-generator" element={<PassportPhotoGenerator />} />
//             <Route path="/dictionary" element={<Dictionary />} />
//             <Route path="/news" element={<Translator />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/resume-builder" element={<InputForm />} />
//             <Route path="/resume-preview" element={<ResumePreview />} />
//             <Route path="/quiz" element={<JobDescriptionAnalyzer />} />
//             <Route path="/resume-ats" element={<ATSScore />} />
//             <Route path="/contacts" element={<Contact />} />
//             <Route path="/url-shortener" element={<UrlShortener />} />
//             <Route path="/timezoneconvertor" element={<TimeZoneConverter />} />
//             <Route path="/services" element={<Services />} />
//             <Route path="*" element={<Error4U />} />
//             <Route path="/cartoon-selfie" element={<PomodoroTimer />} />
//             <Route path="/face-cutout" element={<Markdownreviewer />} />
//             <Route path="/remove-background" element={<QrCodeGenerator />} />
//             <Route path="/passport-photo" element={<PassportPhoto />} />

            
//             <Route path="/system-design" element={<SystemDesign />} />

//             <Route path="/snapshot-generator" element={<DataBreachChecker />} />
//           </Routes>
//         </main>
//         {/* <Footer /> */}
//       </div>
//     </Router>
//   );
// };

// export default App;


import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Helmet } from "react-helmet"; // Added for SEO management
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
import ImageEditor from "./pages/ImageEditor";
import SystemDesign from "./pages/SystemDesign";
import {
  BookOpenIcon, ChartBarIcon, SparklesIcon, CheckCircleIcon,
  DocumentMagnifyingGlassIcon, PhotoIcon, UserGroupIcon,
  AcademicCapIcon, DocumentTextIcon, GlobeAltIcon, RocketLaunchIcon,
  BriefcaseIcon, CodeBracketIcon
} from '@heroicons/react/24/outline';
import { useRef, useEffect } from "react";
import CodeCompare from "./components/CodeCompare";
import StockSurfer from "./components/StockSuffer";
import SudokuSolver from "./components/SudokuSolver";
import QRCodeGenerator from "./pages/QRCodeGenerator";

const Home = () => {
  const scrollRef = useRef(null);

  // Auto-scroll effect for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "This app is a lifesaver! The invoice generator helped me send professional invoices instantly.",
      author: "Samantha K.",
      rating: 5,
    },
    {
      text: "I love how easy it is to create passport photos. No more running to photo studios!",
      author: "James L.",
      rating: 4.5,
    },
    {
      text: "The background remover is insanely good! Helped me clean up product photos in seconds.",
      author: "Emily T.",
      rating: 5,
    },
    {
      text: "I use this app daily for creating digital signboards. Super smooth experience!",
      author: "Ryan P.",
      rating: 4,
    },
    {
      text: "Simple, effective, and free! What else could I ask for? Highly recommended!",
      author: "Chris M.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Modern Hero Section with Parallax Effect */}
      <section id="home" className="relative h-[45rem] flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-12 flex justify-center pt-4">
              <Link to="/" className="group">
                <motion.div
                  className="inline-block transform hover:scale-105 transition-transform duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                >
                  <img
                    src={UnityHubLogo}
                    alt="UnityHub"
                    className="h-24 md:h-32 mx-auto filter brightness-125 drop-shadow-2xl animate-float"
                  />
                </motion.div>
              </Link>
            </div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"
            >
              Revolutionizing Academic Excellence Through
              <span className="block mt-4 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
                Intelligent Automation
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 font-light"
            >
              Harness the power of AI-driven academic optimization with our integrated suite of smart learning tools.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center mb-4 text-center items-center"
            >
              <Link
                to="/documentation"
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center gap-2"
              >
                <SparklesIcon className="w-6 h-6" />
                Start Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
        {/* Interactive Background Particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-teal-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, 40, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>
      {/* Feature Showcase - Holographic Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Next-Gen Academic Toolkit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Integrated solutions combining AI, collaboration, and predictive analytics.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: "Cognitive Assistant",
                features: ["Adaptive Learning Paths", "Predictive Grading", "Smart Research"],
                icon: AcademicCapIcon,
                color: "from-teal-500 to-cyan-600",
                pattern: "pattern-circuit"
              },
              {
                category: "Productivity Nexus",
                features: ["Automated Scheduling", "Resource Optimization", "Team Synergy"],
                icon: BriefcaseIcon,
                color: "from-blue-500 to-indigo-600",
                pattern: "pattern-plus"
              },
              {
                category: "Innovation Studio",
                features: ["AI Visualization", "Interactive Prototyping", "Dynamic Presentation"],
                icon: CodeBracketIcon,
                color: "from-purple-500 to-fuchsia-600",
                pattern: "pattern-wiggle"
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-8 bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute inset-0 ${category.pattern} opacity-5 -z-1`} />
                <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{category.category}</h3>
                <ul className="space-y-3">
                  {category.features.map((feature, i) => (
                    <motion.li 
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-600 font-medium"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl font-light text-blue-200">
              See why people love using our tools!
            </p>
          </div>
          <div className="relative overflow-hidden">
            <motion.div
              ref={scrollRef}
              className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="min-w-[80%] md:min-w-[45%] lg:min-w-[30%] bg-white/10 text-white p-6 rounded-2xl shadow-lg snap-center backdrop-blur-lg border border-white/20 hover:scale-105 transition-transform duration-300"
                >
                  <p className="text-lg leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <h4 className="text-lg font-semibold">{testimonial.author}</h4>
                    <div className="text-yellow-400 text-lg">
                      {"★".repeat(Math.floor(testimonial.rating))}
                      {testimonial.rating % 1 !== 0 && <span>☆</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900 text-center">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
              Try It Now – It's Free!
            </h2>
            <p className="text-xl text-blue-200 mb-12">
              Experience the best tools for invoices, passport photos, background removal & more.
            </p>
            <a
              href="#home"
              className="px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-xl text-lg font-semibold hover:from-teal-500 hover:to-cyan-600 transition-all duration-300 shadow-xl"
            >
              Get Started
            </a>
          </motion.div>
        </div>
      </section>
      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <img src={UnityHubLogo} alt="UnityHub" className="h-12 w-auto" />
              <p className="text-sm leading-relaxed">
                Empowering academic excellence through innovative technology solutions.
              </p>
              <div className="flex space-x-4">
                <a href="https://learnova1.vercel.app" className="text-gray-400 hover:text-white transition-colors">
                  <GlobeAltIcon className="h-6 w-6" />
                </a>
                <a href="/documentation" className="text-gray-400 hover:text-white transition-colors">
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
                <li><a href="https://bhavyawade.vercel.app/" className="text-sm hover:text-white transition-colors">Portfolio</a></li>
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
              © {new Date().getFullYear()} LearnNova. Open-source academic platform.
              <br />
              Developed with ❤️ by Bhavya Wade
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
const beforeCode = `function greet() {\n  console.log("Hello, World!");\n}`;
const afterCode = `const greet = () => {\n  console.log("Hello, Universe!");\n}`;
const App = () => {
  return (
    <Router>
      {/* SEO Meta Tags with React Helmet */}
      <Helmet>
        <title>LearnNova - AI Powered Academic & Productivity Suite</title>
        <meta
          name="description"
          content="LearnNova brings innovative tools for academic excellence and productivity, including a system design tool, advanced image editors, ATS resume optimizers, and much more. Experience intelligent automation today."
        />
        <meta
          name="keywords"
          content="AI, Productivity, Academic Tools, Automation, Resume Optimizer, System Design, Image Editor, React, Vercel, LearnNova"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourdomain.com" />
        {/* Open Graph Tags */}
        <meta property="og:title" content="LearnNova - AI Powered Academic & Productivity Suite" />
        <meta property="og:description" content="LearnNova brings innovative tools for academic excellence and productivity, including a system design tool, advanced image editors, ATS resume optimizers, and much more." />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="LearnNova - AI Powered Academic & Productivity Suite" />
        <meta name="twitter:description" content="LearnNova brings innovative tools for academic excellence and productivity, including a system design tool, advanced image editors, ATS resume optimizers, and much more." />
        <meta name="twitter:image" content="https://yourdomain.com/twitter-image.png" />
      </Helmet>
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
            <Route path="/quiz" element={<JobDescriptionAnalyzer />} />
            <Route path="/resume-ats" element={<ATSScore />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/url-shortener" element={<UrlShortener />} />
            <Route path="/timezoneconvertor" element={<TimeZoneConverter />} />
            <Route path="/services" element={<Services />} />
            <Route path="*" element={<Error4U />} />
            <Route path="/cartoon-selfie" element={<PomodoroTimer />} />
            <Route path="/face-cutout" element={<Markdownreviewer />} />
            <Route path="/remove-background" element={<QrCodeGenerator />} />
            <Route path="/passport-photo" element={<PassportPhoto />} />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route path="/snapshot-generator" element={<DataBreachChecker />} />
            <Route path="/screenshort-edit" element={<ImageEditor />} />
            <Route path="/compare" element={<CodeCompare before="before.png" after="after.png" />} />
            <Route path="/stock-suffer" element={<StockSurfer/>}/>
            <Route path="/sudoku-solver" element={<SudokuSolver/>}/>
            <Route path="/qrcode-generate" element={<QRCodeGenerator/>}/>
                      </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;
