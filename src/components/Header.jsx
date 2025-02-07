import { useState } from "react";
import { Link } from "react-router-dom";
import UnityHubLogo from '../../public/newLogo-removebg-preview.png';
import { 
  HomeIcon, DocumentIcon, ChartBarIcon, QuestionMarkCircleIcon,
  CommandLineIcon, CalculatorIcon, ClipboardIcon, AcademicCapIcon,
  LockClosedIcon, BookOpenIcon, LinkIcon, CogIcon,
  PresentationChartBarIcon, DocumentTextIcon, SparklesIcon,
  UserGroupIcon, PhotoIcon, CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { EditRoadTwoTone, FaceRetouchingNatural, Newspaper, PersonOffOutlined, PhotoAlbumRounded, Quiz, RemoveCircleOutline, RestaurantMenuOutlined, Score, ScreenshotMonitor, Timer3Rounded, TimerOutlined, TimeToLeaveOutlined } from "@mui/icons-material";
import { PhotoshopPicker } from "react-color";
import { FaSnapchat } from "react-icons/fa";
import { LetterTextIcon } from "lucide-react";


const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigation = {
    "Productivity": [
      { to: "/e-sign", icon: DocumentTextIcon, text: "DocuSignPro" },
      { to: "/project-tracker", icon: ClipboardIcon, text: "Project Tracker" },
      { to: "/invoice-generator", icon: DocumentIcon, text: "Invoice Generator" },
      {to:'/quiz',icon:Quiz,text:'Quiz'},
      {to:'/timezoneconvertor',icon:TimerOutlined,text:'Time Zone Convertor'}
    ],
    "Academic": [
      { to: "/smart-board", icon: PresentationChartBarIcon, text: "Smart Board" },
      { to: "/question-bank", icon: QuestionMarkCircleIcon, text: "Question Bank" },
      { to: "/study-plan", icon: AcademicCapIcon, text: "Study Planner" },
      { to: "/grade-tracker", icon: ChartBarIcon, text: "Grade Tracker" },
      {to:"/resume-ats",icon:Score,text:'Resume ATS Score Checker'},
      {to:'/resume-preview',icon:LetterTextIcon,text:'Cover Letter Generator'}
    ],
    "Utilities": [
      { to: "/ai-summarizer", icon: SparklesIcon, text: "Text Summarizer" },
      { to: "/expense-tracker", icon: CurrencyDollarIcon, text: "Expense Tracker" },
      { to: "/password-generator", icon: LockClosedIcon, text: "Password Generator" },
      { to: "/dictionary", icon: BookOpenIcon, text: "Dictionary" },
      { to: "/url-shortener", icon: LinkIcon, text: "URL Shortener" },
      {to:'/snapshot-generator',icon:EditRoadTwoTone,text:"Snapshot-Editor"}
    ],
    "Ai Tools":[
      { to: "/cartoon-selfie", icon: PhotoAlbumRounded, text: "Cartoon Selfie" },
      { to: "/face-cutout", icon: FaceRetouchingNatural, text: "Face Cutout" },
      { to: "/remove-background", icon: RemoveCircleOutline, text: "Remove Background" },
      { to: "/passport-photo", icon: PhotoIcon, text: "Passport-Photo" },
      {to:"/screenshort-edit",icon:ScreenshotMonitor,text:"Image Editor"},
      {to:"/system-design",icon:FaSnapchat,text:'System Design'}
    ]
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-gradient-to-r from-gray-900 to-blue-900 shadow-xl fixed w-full top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-blue-100 p-2 hover:bg-blue-800/30 rounded-lg transition-colors z-20"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link to="/" className="ml-2 md:ml-0 flex items-center">
                <img
                  src={UnityHubLogo}
                  alt="LearnNova"
                  className="h-9 w-auto transition-transform duration-300 hover:scale-105"
                />
          
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex md:text-[13px] lg:text-[18px] ml-8 z-10 space-x-2">
                {Object.entries(navigation).map(([category, items]) => (
                  <div key={category} className="relative group">
                    <button
                      onMouseEnter={() => setActiveDropdown(category)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="flex items-center z-20 px-4 py-2 text-blue-100 hover:bg-blue-800/30 rounded-lg transition-colors"
                    >
                      <span className="font-medium z-20">{category}</span>
                      <svg className="w-4 h-4 ml-2  transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {activeDropdown === category && (
                      <div
                        onMouseEnter={() => setActiveDropdown(category)}
                        onMouseLeave={() => setActiveDropdown(null)}
                        className="absolute top-full left-0 z-20 mt-1 w-56 bg-blue-900/95 backdrop-blur-lg rounded-lg shadow-xl border border-blue-800 py-2"
                      >
                        {items.map((item, index) => (
                          <Link
                            key={index}
                            to={item.to}
                            className="flex items-center z-20 px-4 py-2.5 text-blue-100 hover:bg-blue-800/30 transition-colors"
                          >
                            <item.icon className="w-5 z-20 h-5 mr-3 text-blue-400" />
                            {item.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Section - Search and Documentation */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <Link 
                to="/news" 
                className="text-blue-100 hover:bg-blue-800/30 px-3 py-2 rounded-lg flex items-center transition-colors"
              >
            <Newspaper/>
           </Link>
              {/* Documentation Link */}
              <Link 
                to="/documentation" 
                className="text-blue-100 hover:bg-blue-800/30 px-3 py-2 rounded-lg flex items-center transition-colors"
              >
                <CogIcon className="h-5 w-5 mr-2" />
                <span className="hidden lg:inline">Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900/95 to-gray-900/95 backdrop-blur-lg border-r border-blue-800 transform transition-transform duration-300 ease-in-out z-40 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-800">
            <div className="flex items-center">
              <img
                src={UnityHubLogo}
                alt="LearnNova"
                className="h-8 w-auto"
              />
              <span className="ml-3 text-lg font-semibold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              LearnNova
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-blue-400 hover:text-blue-300"
            >
              ×
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            {Object.entries(navigation).map(([category, items]) => (
              <div key={category} className="mb-6">
                <div className="text-blue-400/80 text-xs font-semibold uppercase tracking-wider mb-2 px-3">
                  {category}
                </div>
                <div className="space-y-1">
                  {items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center px-3 py-2.5 text-blue-100 hover:bg-blue-800/30 rounded-lg group transition-all"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-sm font-medium">{item.text}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-800">
            <p className="text-xs text-blue-400/80 text-center">
              © 2024 LearnNova
              <br />
              Open Source Academic Suite
            </p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Padding */}
      <div className="pt-16" />
    </>
  );
};

export default Header;