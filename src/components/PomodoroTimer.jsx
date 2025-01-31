// import React, { useState } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import AiHeader from './AiHeader';

// const PomodoroTimer = () => {
//   const [image, setImage] = useState(null);
//   const [resultUrl, setResultUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [apiKey, setApiKey] = useState('');
//   const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);
//   const [showHelp, setShowHelp] = useState(false);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const generateCartoonSelfie = async () => {
//     if (!apiKey) {
//       setShowApiKeyAlert(true);
//       return;
//     }

//     if (!image) {
//       setError('Please upload an image.');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     try {
//       const formData = new FormData();
//       formData.append('file', dataURItoBlob(image));
//       const response = await axios.post(
//         'https://www.cutout.pro/api/v1/cartoonSelfie?cartoonType=1',
//         formData,
//         {
//           headers: {
//             'APIKEY': apiKey,
//             'Content-Type': 'multipart/form-data',
//           },
//           responseType: 'blob',
//         }
//       );

//       const resultImageUrl = URL.createObjectURL(response.data);
//       setResultUrl(resultImageUrl);
//     } catch (error) {
//       console.error('Error generating cartoon selfie:', error);
//       setError('Error generating cartoon selfie. Please try again.');
//     }
//     setLoading(false);
//   };

//   const dataURItoBlob = (dataURI) => {
//     const byteString = atob(dataURI.split(',')[1]);
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: 'image/jpeg' });
//   };

//   return (
//     <div>
     
//       <motion.div
//         className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.h3
//           className="text-4xl font-bold mb-8 text-center text-white"
//           initial={{ y: -50 }}
//           animate={{ y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           Cartoon Selfie Generator
//         </motion.h3>
//         <motion.div
//           className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="mb-6">
//             <label htmlFor="apiKey" className="block text-gray-700 font-medium mb-2">Api Key <span className="text-sm text-gray-500">(Get it from <a href="https://www.cutout.pro/user/secret-key" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>)</span></label>
//             <input
//               type="text"
//               placeholder="Enter your API Key"
//               value={apiKey}
//               onChange={(e) => setApiKey(e.target.value)}
//               className="block w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="mb-6">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="block w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <motion.button
//             onClick={generateCartoonSelfie}
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} transition duration-200`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {loading ? 'Generating...' : 'Generate Cartoon Selfie'}
//           </motion.button>

//           {error && <p className="mt-4 text-red-500">{error}</p>}
//           {showApiKeyAlert && (
//             <div className="mt-4 text-red-500">
//               <p>
//                 Please enter your API key. If you don't have one, you can get it from
//                 <a
//                   href="https://www.cutout.pro/user/secret-key"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline"
//                 >
//                   {' '}here
//                 </a>
//                 .
//               </p>
//             </div>
//           )}
//           {resultUrl && (
//             <div className="mt-4">
//               <h4 className="text-gray-800 font-semibold">Generated Cartoon Selfie:</h4>
//               <img src={resultUrl} alt="Cartoon Selfie" className="mt-2 max-w-full rounded shadow" />
//               <a
//                 href={resultUrl}
//                 download="cartoon_selfie.jpg"
//                 className="block mt-4 text-center bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded shadow-lg transition duration-200"
//               >
//                 Download Image
//               </a>
//             </div>
//           )}
//         </motion.div>

//       </motion.div>
//     </div>
//   );
// };

// export default PomodoroTimer;

import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CartoonSelfieGenerator = () => {
  const [image, setImage] = useState(null);
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCartoonSelfie = async () => {
    if (!apiKey) {
      setShowApiKeyAlert(true);
      return;
    }

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', dataURItoBlob(image));
      const response = await axios.post(
        'https://www.cutout.pro/api/v1/cartoonSelfie?cartoonType=1',
        formData,
        {
          headers: {
            'APIKEY': apiKey,
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        }
      );

      const resultImageUrl = URL.createObjectURL(response.data);
      setResultUrl(resultImageUrl);
    } catch (error) {
      console.error('Error generating cartoon selfie:', error);
      setError('Error generating cartoon selfie. Please try again.');
    }
    setLoading(false);
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  };

  // SVG Icons
  const AlertIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );

  const HelpIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const DownloadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 animate-gradient-x">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 border border-white/20">
            {/* Header Section */}
            <div className="mb-10 text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AI Cartoonizer
              </h1>
              <p className="mt-4 text-gray-200 text-lg">
                Transform your photos into professional cartoon artwork
              </p>
            </div>

            {/* API Key Input */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-2">
                  API Key
                  <span className="text-xs ml-2 text-gray-300">
                    (Get from{' '}
                    <a
                      href="https://www.cutout.pro/user/secret-key"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      Cutout.pro
                    </a>
                    )
                  </span>
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30 text-white placeholder-gray-400 transition-all"
                  placeholder="••••••••••••"
                />
              </div>

              {/* Upload Section */}
              <div>
                <label className="block text-sm font-medium text-cyan-100 mb-2">
                  Upload Image
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 group-hover:border-cyan-400 transition-colors flex items-center justify-center space-x-2">
                    <span className="text-gray-200">
                      {image ? 'Image Selected' : 'Choose File...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mb-8">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-cyan-300 hover:text-cyan-200 flex items-center space-x-2"
              >
                <HelpIcon />
                <span>How does this work?</span>
              </button>
              {showHelp && (
                <div className="mt-4 p-4 bg-black/20 rounded-lg text-gray-200">
                  <p className="mb-2">
                    1. Obtain your API key from Cutout.pro's developer portal
                  </p>
                  <p className="mb-2">
                    2. Upload a clear portrait photo (JPEG/PNG)
                  </p>
                  <p>3. Generate and download your cartoonized image</p>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <motion.button
              onClick={generateCartoonSelfie}
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-medium text-lg ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              } transition-colors shadow-lg`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-cyan-300 rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Generate Magic ✨'
              )}
            </motion.button>

            {/* Error Handling */}
            {error && (
              <div className="mt-6 p-4 bg-red-900/30 rounded-lg flex items-center space-x-3 text-red-200">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}

            {/* Result Display */}
            {resultUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-10"
              >
                <div className="border-4 border-white/20 rounded-2xl overflow-hidden">
                  <img
                    src={resultUrl}
                    alt="Cartoon Result"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="mt-6 flex justify-center">
                  <a
                    href={resultUrl}
                    download="cartoon-selfie.png"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <DownloadIcon />
                    <span>Download HD Version</span>
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Attribution */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>
              Powered by{' '}
              <a
                href="https://www.cutout.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200"
              >
                Cutout.pro API
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartoonSelfieGenerator;