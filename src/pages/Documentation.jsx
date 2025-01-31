import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  ClipboardIcon,
  AcademicCapIcon,
  SparklesIcon,
  PhotoIcon,
  GlobeAltIcon,
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
  CodeBracketIcon,
  PresentationChartBarIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  BookOpenIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { Face2, PhotoAlbum, RemoveCircle } from '@mui/icons-material';

const Documentation = () => {
  const socialLinks = [
    { name: 'LinkedIn', url: '#', icon: '/icons/linkedin.svg' },
    { name: 'Twitter', url: '#', icon: '/icons/twitter.svg' },
    { name: 'GitHub', url: '#', icon: '/icons/github.svg' },
  ];

  const navigation = {
    "Productivity": [
      { to: "/e-sign", icon: DocumentTextIcon, text: "DocuSignPro" },
      { to: "/project-tracker", icon: ClipboardIcon, text: "Project Tracker" },
      { to: "/invoice-generator", icon: ChatBubbleLeftEllipsisIcon, text: "Invoice Generator" }
    ],
    "Academic": [
      { to: "/smart-board", icon: PresentationChartBarIcon, text: "Smart Board" },
      { to: "/question-bank", icon: QuestionMarkCircleIcon, text: "Question Bank" },
      { to: "/study-plan", icon: AcademicCapIcon, text: "Study Planner" },
      { to: "/grade-tracker", icon: ChartBarIcon, text: "Grade Tracker" }
    ],
    "Utilities": [
      { to: "/ai-summarizer", icon: SparklesIcon, text: "Text Summarizer" },
      { to: "/expense-tracker", icon: CurrencyDollarIcon, text: "Expense Tracker" },
      { to: "/password-generator", icon: LockClosedIcon, text: "Password Generator" },
      { to: "/dictionary", icon: BookOpenIcon, text: "Dictionary" },
      { to: "/url-shortener", icon: LinkIcon, text: "URL Shortener" }
    ],
    "AI Tools": [
      { to: "/cartoon-selfie", icon: PhotoAlbum, text: "Cartoon Selfie" },
      { to: "/face-cutout", icon: Face2, text: "Face Cutout" },
      { to: "/remove-background", icon: RemoveCircle, text: "Remove Background" },
      { to: "/passport-photo", icon: PhotoIcon, text: "Passport Photo" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl backdrop-blur-lg border border-gray-100/50 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4"
            >
              LearnNova Documentation
            </motion.h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Master our comprehensive suite of tools with detailed guides and interactive examples.
            </p>
          </div>

          {/* Main Content */}
          <div className="px-8 py-12">
            {/* Navigation Sections */}
            <div className="space-y-12">
              {Object.entries(navigation).map(([category, items]) => (
                <motion.section 
                  key={category}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-8 rounded-2xl border border-gray-100"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <motion.div
                        key={item.to}
                        whileHover={{ scale: 1.05 }}
                        className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:bg-blue-50"
                      >
                        <div className="flex items-center mb-4">
                          <item.icon className="w-8 h-8 text-blue-600 mr-3" />
                          <code className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                            {item.to}
                          </code>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.text}</h3>
                        <p className="text-gray-600 text-sm">Explore features and integration options</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>

            {/* Footer */}
            <motion.footer 
              className="mt-20 text-center border-t border-gray-200 pt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="mt-8 text-gray-600 text-sm">
                © {new Date().getFullYear()} LearnNova. All rights reserved.
              </p>
           
            </motion.footer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Documentation;
