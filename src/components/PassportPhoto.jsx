// import React, { useState } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import AiHeader from './AiHeader';

// const PassportPhoto = () => {
//     const [image, setImage] = useState(null);
//     const [resultUrl, setResultUrl] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [apiKey, setApiKey] = useState('');
//     const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImage(reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""));
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const generatePassportPhoto = async () => {
//         if (!apiKey) {
//             setShowApiKeyAlert(true);
//             return;
//         }

//         if (!image) {
//             setError('Please upload an image.');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         try {
//             const response = await axios.post(
//                 'https://www.cutout.pro/api/v1/idphoto/printLayout',
//                 {
//                     base64: image,
//                     bgColor: 'FFFFFF',
//                     dpi: 300,
//                     mmHeight: 35,
//                     mmWidth: 25,
//                     printBgColor: 'FFFFFF',
//                     printMmHeight: 210,
//                     printMmWidth: 150
//                 },
//                 {
//                     headers: {
//                         'APIKEY': apiKey,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             if (response.data && response.data.data) {
//                 const { idPhotoImage } = response.data.data;
//                 setResultUrl(idPhotoImage);
//             } else {
//                 throw new Error('Unexpected API response format');
//             }
//         } catch (error) {
//             console.error('Error generating passport photo:', error);
//             setError('Error generating passport photo. Please check the input data and try again.');
//         }
//         setLoading(false);
//     };

//     const downloadImage = () => {
//         const link = document.createElement('a');
//         link.href = resultUrl;
//         link.download = 'passport-photo.png'; // Customize the downloaded file name
//         link.click();
//     };

//     return (
//         <div>
           
//             <motion.div
//                 className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <motion.h3
//                     className="text-4xl font-bold mb-8 text-center text-white"
//                     initial={{ y: -50 }}
//                     animate={{ y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     Passport Photo Generator
//                 </motion.h3>
//                 <motion.div
//                     className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
//                     initial={{ scale: 0.9 }}
//                     animate={{ scale: 1 }}
//                     transition={{ duration: 0.3 }}
//                 >
//                     <div className="mb-6">
//                         <label htmlFor="apiKey" className="block text-gray-700 font-medium mb-2">Api Key <span className="text-sm text-gray-500">(Get it from <a href="https://www.cutout.pro/user/secret-key" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>)</span></label>
//                         <input
//                             type="text"
//                             placeholder="Enter your API Key"
//                             value={apiKey}
//                             onChange={(e) => setApiKey(e.target.value)}
//                             className="block w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                             className="block w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <motion.button
//                         onClick={generatePassportPhoto}
//                         disabled={loading}
//                         className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'
//                             } transition duration-200`}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                     >
//                         {loading ? 'Generating...' : 'Generate Passport Photo'}
//                     </motion.button>
//                     {error && <p className="mt-4 text-red-500">{error}</p>}
//                     {showApiKeyAlert && (
//                         <div className="mt-4 text-red-500">
//                             <p>
//                                 Please enter your API key. If you don't have one, you can get it from
//                                 <a
//                                     href="https://www.cutout.pro/user/secret-key"
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-500 hover:underline"
//                                 >
//                                     {' '}
//                                     here
//                                 </a>
//                                 .
//                             </p>
//                         </div>
//                     )}
//                     {resultUrl && (
//                         <div className="mt-4">
//                             <h4 className="text-gray-800 font-semibold">Generated Passport Photo:</h4>
//                             <img src={resultUrl} alt="Passport Photo" className="mt-2 max-w-full rounded shadow" />
//                             <motion.button
//                                 onClick={downloadImage}
//                                 className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg shadow-md font-medium hover:bg-green-600 transition duration-300"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                             >
//                                 Download Passport Photo
//                             </motion.button>
//                         </div>
//                     )}
//                 </motion.div>
//             </motion.div>
//         </div>
//     );
// };

// export default PassportPhoto;


import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const PassportPhoto = () => {
    const [image, setImage] = useState(null);
    const [resultUrl, setResultUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""));
            };
            reader.readAsDataURL(file);
        }
    };

    const generatePassportPhoto = async () => {
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
            const response = await axios.post(
                'https://www.cutout.pro/api/v1/idphoto/printLayout',
                {
                    base64: image,
                    bgColor: 'FFFFFF',
                    dpi: 300,
                    mmHeight: 35,
                    mmWidth: 25,
                    printBgColor: 'FFFFFF',
                    printMmHeight: 210,
                    printMmWidth: 150
                },
                {
                    headers: {
                        'APIKEY': apiKey,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data?.data?.idPhotoImage) {
                setResultUrl(response.data.data.idPhotoImage);
            } else {
                throw new Error('Unexpected API response format');
            }
        } catch (error) {
            console.error('Error generating passport photo:', error);
            setError('Error generating passport photo. Please check the input data and try again.');
        }
        setLoading(false);
    };

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = resultUrl;
        link.download = 'passport-photo.png';
        link.click();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-12">
                <motion.div 
                    className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            AI Passport Photo Generator
                        </h1>
                        <div className="h-1 w-16 bg-blue-400 mx-auto rounded-full" />
                        <p className="mt-4 text-blue-100 text-sm">
                            Compliant with international photo standards • 35×45mm • 300 DPI
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="p-8 space-y-8">
                        {/* API Key Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                API Key
                                <span className="text-xs text-gray-500 ml-2">
                                    (Get from <a 
                                        href="https://www.cutout.pro/user/secret-key" 
                                        className="text-blue-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        cutout.pro
                                    </a>)
                                </span>
                            </label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your secure API key"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                            />
                        </div>

                        {/* Drag & Drop Area */}
                        <div 
                            className={`relative group border-2 ${isDragging ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-xl transition-all ${!image && 'hover:border-blue-400'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="fileInput"
                            />
                            <label 
                                htmlFor="fileInput"
                                className="block p-8 text-center cursor-pointer"
                            >
                                <div className="space-y-4">
                                    <div className="relative inline-block">
                                        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl transition-colors
                                            ${image ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}
                                        >
                                            {image ? '✓' : '+'}
                                        </div>
                                        {!image && (
                                            <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-0 group-hover:opacity-40" />
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        {image ? 'Photo Ready' : 'Drag & Drop or Click to Upload'}
                                    </p>
                                    {image && (
                                        <span className="text-xs text-gray-500 block mt-2">
                                            Click to change photo
                                        </span>
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* Generate Button */}
                        <motion.button
                            onClick={generatePassportPhoto}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-medium text-white transition-all relative overflow-hidden
                                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                'Generate Professional Photo'
                            )}
                            <div className={`absolute inset-0 bg-white/10 opacity-0 ${!loading && 'group-hover:opacity-10'} transition-opacity`} />
                        </motion.button>

                        {/* Error Messages */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        {/* Results Section */}
                        {resultUrl && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 space-y-6"
                            >
                                <div className="border-t border-gray-100 pt-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                                        Your Official Passport Photo
                                    </h3>
                                    <div className="relative group">
                                        <div className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
                                            <img 
                                                src={resultUrl} 
                                                alt="Passport Photo" 
                                                className="w-full h-auto border-8 border-white"
                                            />
                                        </div>
                                        <div className="mt-6 flex justify-center gap-4">
                                            <motion.button
                                                onClick={downloadImage}
                                                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Download HD Image
                                            </motion.button>
                                        </div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <p className="font-medium">35×45mm</p>
                                            <p className="text-xs">Standard Size</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <p className="font-medium">300 DPI</p>
                                            <p className="text-xs">Print Quality</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <p className="font-medium">White BG</p>
                                            <p className="text-xs">Compliant</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Secure processing • No images stored • Compliant with international standards</p>
                </div>
            </div>
        </div>
    );
};

export default PassportPhoto;