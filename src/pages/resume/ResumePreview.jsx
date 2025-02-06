import React, { useState } from "react";

const CoverLetterGenerator = () => {
  const [formData, setFormData] = useState({
    applicantName: "",
    jobProfile: "",
    companyName: "", 
    skills: "",
    experience: "",
    email: "",
    phone: "",
    address: "",
    achievements: ""
  });

  const [coverLetter, setCoverLetter] = useState("");
  const [template, setTemplate] = useState("professional");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const templates = {
    professional: () => `
${formData.address}
${formData.email}
${formData.phone}

${new Date().toLocaleDateString()}

Hiring Manager
${formData.companyName}

Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.jobProfile} position at ${formData.companyName}. With ${formData.experience} years of experience and expertise in ${formData.skills}, I am confident in my ability to make significant contributions to your organization.

${formData.achievements}

My technical proficiency in ${formData.skills} has enabled me to consistently deliver high-quality results throughout my career. I am particularly drawn to ${formData.companyName}'s commitment to innovation and excellence, and I am excited about the possibility of bringing my unique blend of skills and experience to your team.

I would welcome the opportunity to discuss how my background aligns with your needs in more detail. Thank you for considering my application.

Best regards,
${formData.applicantName}
    `,

    creative: () => `
${formData.address}
${formData.email}
${formData.phone}

${new Date().toLocaleDateString()}

Dear Hiring Team at ${formData.companyName},

I was thrilled to discover the ${formData.jobProfile} opportunity at ${formData.companyName}. As a passionate professional with ${formData.experience} years of experience specializing in ${formData.skills}, I am eager to bring my creative approach and technical expertise to your innovative team.

${formData.achievements}

What excites me most about ${formData.companyName} is your commitment to pushing boundaries and fostering innovation. I believe my background in ${formData.skills} positions me perfectly to contribute to your continued success.

I would love to discuss how my unique perspective and skills could benefit your team.

Warm regards,
${formData.applicantName}
    `
  };

  const generateCoverLetter = () => {
    const letterTemplate = templates[template];
    setCoverLetter(letterTemplate());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Professional Cover Letter Generator</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <input
                  type="text"
                  name="applicantName"
                  placeholder="Your Full Name"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="address"
                  placeholder="Your Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  name="jobProfile"
                  placeholder="Job Position"
                  value={formData.jobProfile}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="skills"
                  placeholder="Key Skills (e.g., React, Python, Project Management)"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="experience"
                  placeholder="Years of Experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <textarea
                name="achievements"
                placeholder="Key Achievements and Qualifications"
                value={formData.achievements}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <select 
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="professional">Professional Template</option>
                <option value="creative">Creative Template</option>
              </select>

              <button
                onClick={generateCoverLetter}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                Generate Cover Letter
              </button>
            </div>
          </div>

          {coverLetter && (
            <div className="mt-8 p-6 bg-gray-50 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Your Professional Cover Letter:</h3>
              <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-sm">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">{coverLetter}</pre>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(coverLetter)}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
