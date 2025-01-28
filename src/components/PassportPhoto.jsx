import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AiHeader from './AiHeader';

const PassportPhoto = () => {
    const [image, setImage] = useState(null);
    const [resultUrl, setResultUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
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

            if (response.data && response.data.data) {
                const { idPhotoImage } = response.data.data;
                setResultUrl(idPhotoImage);
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
        link.download = 'passport-photo.png'; // Customize the downloaded file name
        link.click();
    };

    return (
        <div>
            <AiHeader />
            <motion.div
                className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h3
                    className="text-4xl font-bold mb-8 text-center text-white"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Passport Photo Generator
                </motion.h3>
                <motion.div
                    className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-6">
                        <label htmlFor="apiKey" className="block text-gray-700 font-medium mb-2">Api Key <span className="text-sm text-gray-500">(Get it from <a href="https://www.cutout.pro/user/secret-key" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>)</span></label>
                        <input
                            type="text"
                            placeholder="Enter your API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="block w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="block w-full mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <motion.button
                        onClick={generatePassportPhoto}
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'
                            } transition duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {loading ? 'Generating...' : 'Generate Passport Photo'}
                    </motion.button>
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                    {showApiKeyAlert && (
                        <div className="mt-4 text-red-500">
                            <p>
                                Please enter your API key. If you don't have one, you can get it from
                                <a
                                    href="https://www.cutout.pro/user/secret-key"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {' '}
                                    here
                                </a>
                                .
                            </p>
                        </div>
                    )}
                    {resultUrl && (
                        <div className="mt-4">
                            <h4 className="text-gray-800 font-semibold">Generated Passport Photo:</h4>
                            <img src={resultUrl} alt="Passport Photo" className="mt-2 max-w-full rounded shadow" />
                            <motion.button
                                onClick={downloadImage}
                                className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg shadow-md font-medium hover:bg-green-600 transition duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Download Passport Photo
                            </motion.button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PassportPhoto;
