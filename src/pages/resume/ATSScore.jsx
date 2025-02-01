// import { useState } from 'react';

// const jobProfiles = {
//   'Frontend Developer': ['React', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'TypeScript', 'Webpack', 'REST API', 'Responsive Design', 'Git'],
//   'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Microservices', 'REST API', 'Linux'],
//   'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Ansible', 'Linux', 'Jenkins', 'Monitoring', 'Git'],
//   'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'REST API', 'GraphQL', 'TypeScript', 'AWS', 'Docker', 'CI/CD', 'Jest'],
//   'Mobile Developer': ['React Native', 'Swift', 'Kotlin', 'Java', 'iOS', 'Android', 'REST API', 'Firebase', 'Xcode', 'Git'],
//   'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'TensorFlow', 'Data Visualization', 'Statistics', 'Big Data'],
//   'UX Designer': ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'UI/UX', 'Accessibility', 'Responsive Design', 'Photoshop'],
//   'QA Engineer': ['Automation', 'Selenium', 'Jest', 'Cypress', 'Test Cases', 'Bug Tracking', 'CI/CD', 'Performance Testing', 'API Testing', 'Agile'],
//   'Cloud Engineer': ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Networking', 'Security', 'Linux'],
//   'Product Manager': ['Agile', 'Scrum', 'Roadmapping', 'JIRA', 'User Stories', 'Market Research', 'KPIs', 'Prototyping', 'SDLC', 'Stakeholder Management']
// };

// const EnhancedATSScore = () => {
//   const [resumeText, setResumeText] = useState('');
//   const [selectedJob, setSelectedJob] = useState('Frontend Developer');
//   const [score, setScore] = useState(null);
//   const [analysis, setAnalysis] = useState({
//     matches: [],
//     missing: [],
//     keywordCounts: {}
//   });
//   const [loading, setLoading] = useState(false);

//   const calculateATSScore = () => {
//     if (!resumeText.trim()) {
//       setAnalysis({ matches: [], missing: [], keywordCounts: {} });
//       setScore(null);
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => { // Simulate processing delay
//       const keywords = jobProfiles[selectedJob];
//       const resumeWords = resumeText.toLowerCase().split(/\W+/);
      
//       const matches = [];
//       const missing = [];
//       const keywordCounts = {};

//       keywords.forEach(keyword => {
//         const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
//         const count = (resumeText.match(regex) || []).length;
//         keywordCounts[keyword] = count;
        
//         if (count > 0) {
//           matches.push(keyword);
//         } else {
//           missing.push(keyword);
//         }
//       });

//       const newScore = (matches.length / keywords.length) * 100;
      
//       setAnalysis({ matches, missing, keywordCounts });
//       setScore(newScore);
//       setLoading(false);
//     }, 500);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//         <div className="p-8 sm:p-12">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
//             Professional ATS Score Analyzer
//           </h1>

//           <div className="space-y-6">
//             <div className="grid gap-6 md:grid-cols-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Job Profile
//                 </label>
//                 <select
//                   value={selectedJob}
//                   onChange={(e) => setSelectedJob(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   {Object.keys(jobProfiles).map((job) => (
//                     <option key={job} value={job}>{job}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Target Score ({score ? `${score.toFixed(1)}%` : '--'})
//                 </label>
//                 <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                   <div 
//                     className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500" 
//                     style={{ width: `${score || 0}%` }}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Paste Your Resume
//               </label>
//               <textarea
//                 value={resumeText}
//                 onChange={(e) => setResumeText(e.target.value)}
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                 rows="8"
//                 placeholder="Enter your resume text here..."
//               />
//             </div>

//             <button
//               onClick={calculateATSScore}
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
//             >
//               {loading ? 'Analyzing...' : 'Analyze Resume'}
//             </button>

//             {score !== null && (
//               <div className="space-y-6">
//                 <div className="p-6 bg-gray-50 rounded-lg">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                     Keyword Analysis
//                   </h2>
                  
//                   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     {analysis.matches.map((keyword) => (
//                       <div key={keyword} className="p-3 bg-green-50 rounded-lg flex items-center">
//                         <span className="h-2 w-2 bg-green-500 rounded-full mr-2"/>
//                         <span className="font-medium text-green-700">{keyword}</span>
//                         <span className="ml-auto text-sm text-green-600">
//                           ({analysis.keywordCounts[keyword]}x)
//                         </span>
//                       </div>
//                     ))}
                    
//                     {analysis.missing.map((keyword) => (
//                       <div key={keyword} className="p-3 bg-red-50 rounded-lg flex items-center">
//                         <span className="h-2 w-2 bg-red-500 rounded-full mr-2"/>
//                         <span className="font-medium text-red-700">{keyword}</span>
//                         <span className="ml-auto text-sm text-red-600">Missing</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="p-6 bg-blue-50 rounded-lg">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                     Optimization Suggestions
//                   </h2>
//                   <ul className="space-y-3">
//                     {analysis.missing.length > 0 ? (
//                       analysis.missing.map((keyword) => (
//                         <li key={keyword} className="flex items-start">
//                           <span className="text-red-500 mr-2">•</span>
//                           <span className="text-gray-700">
//                             Add <span className="font-medium">{keyword}</span> to match {selectedJob} requirements
//                           </span>
//                         </li>
//                       ))
//                     ) : (
//                       <div className="text-center py-4">
//                         <p className="text-green-600 font-medium">
//                           Great job! All key keywords are present in your resume.
//                         </p>
//                       </div>
//                     )}
//                   </ul>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnhancedATSScore;

import { useState } from 'react';

const jobProfiles = {
  'Frontend Developer': ['React', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'TypeScript', 'Webpack', 'REST API', 'Responsive Design', 'Git'],
  'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Microservices', 'REST API', 'Linux'],
  'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Ansible', 'Linux', 'Jenkins', 'Monitoring', 'Git'],
  'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'REST API', 'GraphQL', 'TypeScript', 'AWS', 'Docker', 'CI/CD', 'Jest'],
  'Mobile Developer': ['React Native', 'Swift', 'Kotlin', 'Java', 'iOS', 'Android', 'REST API', 'Firebase', 'Xcode', 'Git'],
  'Data Scientist': ['Python', 'R', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'TensorFlow', 'Data Visualization', 'Statistics', 'Big Data'],
  'UX Designer': ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'UI/UX', 'Accessibility', 'Responsive Design', 'Photoshop'],
  'QA Engineer': ['Automation', 'Selenium', 'Jest', 'Cypress', 'Test Cases', 'Bug Tracking', 'CI/CD', 'Performance Testing', 'API Testing', 'Agile'],
  'Cloud Engineer': ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Networking', 'Security', 'Linux'],
  'Product Manager': ['Agile', 'Scrum', 'Roadmapping', 'JIRA', 'User Stories', 'Market Research', 'KPIs', 'Prototyping', 'SDLC', 'Stakeholder Management']
};

const EnhancedATSScore = () => {
  const [resumeText, setResumeText] = useState('');
  const [selectedJob, setSelectedJob] = useState('Frontend Developer');
  const [score, setScore] = useState(null);
  const [analysis, setAnalysis] = useState({
    matches: [],
    missing: [],
    keywordCounts: {}
  });
  const [loading, setLoading] = useState(false);

  const calculateATSScore = () => {
    if (!resumeText.trim()) {
      setAnalysis({ matches: [], missing: [], keywordCounts: {} });
      setScore(null);
      return;
    }

    setLoading(true);
    setTimeout(() => { // Simulate processing delay
      const keywords = jobProfiles[selectedJob];
      const resumeWords = resumeText.toLowerCase().split(/\W+/);
      
      const matches = [];
      const missing = [];
      const keywordCounts = {};

      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
        const count = (resumeText.match(regex) || []).length;
        keywordCounts[keyword] = count;
        
        if (count > 0) {
          matches.push(keyword);
        } else {
          missing.push(keyword);
        }
      });

      const newScore = (matches.length / keywords.length) * 100;
      
      setAnalysis({ matches, missing, keywordCounts });
      setScore(newScore);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl shadow-slate-200/60 overflow-hidden">
        <div className="p-8 sm:p-12 space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Resume Intelligence Analyzer
            </h1>
            <p className="text-slate-600 text-sm font-medium">
              Optimize your resume for Applicant Tracking Systems
            </p>
          </header>

          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Target Position
                </label>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm appearance-none"
                >
                  {Object.keys(jobProfiles).map((job) => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-700">
                    ATS Readiness Score
                  </span>
                  <span className="text-sm font-medium text-indigo-600">
                    {score ? `${score.toFixed(1)}%` : '--'}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-700 ease-out"
                    style={{ width: `${score || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Resume Content Analysis
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm resize-none placeholder-slate-400"
                rows="8"
                placeholder="Paste your resume text here..."
              />
            </div>

            <button
              onClick={calculateATSScore}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none group"
            >
              <span className="relative">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"/>
                    Analyzing...
                  </span>
                ) : (
                  <>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                      Generate Insights →
                    </span>
                  </>
                )}
              </span>
            </button>

            {score !== null && (
              <div className="space-y-8">
                <section className="bg-slate-50 rounded-xl p-6 shadow-inner">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <span className="bg-indigo-500 w-1.5 h-1.5 rounded-full mr-2"/>
                    Keyword Match Analysis
                  </h2>
                  
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {analysis.matches.map((keyword) => (
                      <div key={keyword} className="p-3 bg-white rounded-lg border border-emerald-100 flex items-center shadow-sm">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"/>
                        <span className="text-sm font-medium text-slate-700">{keyword}</span>
                        <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          {analysis.keywordCounts[keyword]}x
                        </span>
                      </div>
                    ))}
                    
                    {analysis.missing.map((keyword) => (
                      <div key={keyword} className="p-3 bg-white rounded-lg border border-rose-100 flex items-center shadow-sm">
                        <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"/>
                        <span className="text-sm font-medium text-slate-700">{keyword}</span>
                        <span className="ml-auto text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded">
                          Missing
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <span className="bg-indigo-500 w-1.5 h-1.5 rounded-full mr-2"/>
                    Optimization Recommendations
                  </h2>
                  <ul className="space-y-3">
                    {analysis.missing.length > 0 ? (
                      analysis.missing.map((keyword, index) => (
                        <li key={keyword} className="flex items-start">
                          <span className="text-rose-500 font-bold mr-2">#{index + 1}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">
                              Incorporate <span className="text-indigo-600">{keyword}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Essential skill for {selectedJob} positions. Consider adding projects or experience demonstrating {keyword.toLowerCase()} proficiency.
                            </p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <div className="text-center p-4 bg-white rounded-lg border border-emerald-100">
                        <p className="text-emerald-600 font-medium">
                          🎉 Excellent keyword coverage! Focus on quantifying achievements and verifying ATS formatting.
                        </p>
                      </div>
                    )}
                  </ul>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedATSScore;