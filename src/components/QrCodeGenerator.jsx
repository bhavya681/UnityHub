// import React, { useState } from 'react';
// import axios from 'axios';
// import AiHeader from './AiHeader';

// const QrCodeGenerator = () => {
//   const [image, setImage] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [apiKey, setApiKey] = useState('');
//   const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);

//   const handleImageUpload = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const removeBackground = async () => {
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
//     const formData = new FormData();
//     formData.append('file', image);

//     try {
//       const response = await axios.post(
//         'https://www.cutout.pro/api/v1/matting?mattingType=6&crop=true',
//         formData,
//         {
//           headers: {
//             'APIKEY': apiKey,
//             'Content-Type': 'multipart/form-data',
//           },
//           responseType: 'blob',
//         }
//       );

//       const imageUrl = URL.createObjectURL(response.data);
//       setResult(imageUrl);
//     } catch (error) {
//       setError('Error processing image. Please try again.');
//       console.error('Error processing image:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadImage = () => {
//     const link = document.createElement('a');
//     link.href = result;
//     link.download = 'processed-image.png'; // Customize the downloaded file name
//     link.click();
//   };

//   return (
//     <>
      
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4">
//         <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">AI Background Remover</h1>
//         <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
//           {/* API Key Input */}
//           <div className="mb-6 relative">
//             <label htmlFor="api-key" className="block text-sm font-semibold text-gray-700 mb-2">
//               API Key
//               <span className="text-sm text-gray-500">(Get it from <a href="https://www.cutout.pro/user/secret-key" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>)</span>
//             </label>
//             <input
//               id="api-key"
//               type="text"
//               placeholder="Enter your API Key"
//               value={apiKey}
//               onChange={(e) => setApiKey(e.target.value)}
//               className="block w-full p-3 border rounded-lg focus:ring-blue-400 focus:border-blue-400 border-gray-300"
//             />
//             {showApiKeyAlert && (
//               <p className="text-sm text-red-500 mt-2">
//                 Please enter your API key. Don’t have one?{' '}
//                 <a
//                   href="https://www.cutout.pro/user/secret-key"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   Get your API key here.
//                 </a>
//               </p>
//             )}
//           </div>

//           {/* Image Upload */}
//           <div className="mb-6">
//             <label htmlFor="image-upload" className="block text-sm font-semibold text-gray-700 mb-2">
//               Upload Image
//             </label>
//             <input
//               id="image-upload"
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="block w-full p-3 border rounded-lg focus:ring-blue-400 focus:border-blue-400 border-gray-300"
//             />
//           </div>

//           {/* Background Removal Button */}
//           <button
//             onClick={removeBackground}
//             disabled={!image || loading}
//             className={`w-full py-3 text-white font-semibold rounded-lg ${loading
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-500 hover:bg-blue-600 transition duration-300'
//               }`}
//           >
//             {loading ? 'Processing...' : 'Remove Background'}
//           </button>

//           {/* Error Message */}
//           {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

//           {/* Result Section */}
//           {result && (
//             <div className="mt-6 text-center">
//               <h2 className="text-lg font-semibold text-gray-800 mb-2">Processed Image:</h2>
//               <img src={result} alt="Processed" className="w-full rounded-lg shadow-md" />
//               <button
//                 onClick={downloadImage}
//                 className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md font-medium hover:bg-blue-600 transition duration-300"
//               >
//                 Download Image
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default QrCodeGenerator;

import React, { useState } from 'react';
import axios from 'axios';

const QrCodeGenerator = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const removeBackground = async () => {
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
    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post(
        'https://www.cutout.pro/api/v1/matting?mattingType=6&crop=true',
        formData,
        {
          headers: {
            'APIKEY': apiKey,
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setResult(imageUrl);
    } catch (error) {
      setError('Error processing image. Please try again.');
      console.error('Error processing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = result;
    link.download = 'professional-cutout.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Background Remover
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Professional-grade image processing powered by AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
          {/* API Key Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              API Authorization Key
              <span className="ml-2 text-sm text-gray-500">
                (Get from{' '}
                <a
                  href="https://www.cutout.pro/user/secret-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
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
              placeholder="Enter your secure API key"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400"
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Image
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl group-hover:border-blue-500 transition-colors text-center">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-500 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-600">
                    {image ? image.name : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Process Button */}
          <button
            onClick={removeBackground}
            disabled={!image || loading}
            className={`w-full py-4 rounded-xl font-medium text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
            } transition-all shadow-lg`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Remove Background'
            )}
          </button>

          {/* Error Handling */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center space-x-3 text-red-700 border border-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="mt-10 animate-fade-in">
              <div className="border-4 border-white shadow-lg rounded-xl overflow-hidden">
                <img
                  src={result}
                  alt="Processed result"
                  className="w-full h-auto object-contain"
                />
              </div>
              <button
                onClick={downloadImage}
                className="w-full mt-6 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Download Professional Result</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by{' '}
            <a
              href="https://www.cutout.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Cutout.pro API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;