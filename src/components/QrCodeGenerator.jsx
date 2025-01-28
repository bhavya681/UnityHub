import React, { useState } from 'react';
import axios from 'axios';
import AiHeader from './AiHeader';

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
    link.download = 'processed-image.png'; // Customize the downloaded file name
    link.click();
  };

  return (
    <>
      <AiHeader />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-4">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">AI Background Remover</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
          {/* API Key Input */}
          <div className="mb-6 relative">
            <label htmlFor="api-key" className="block text-sm font-semibold text-gray-700 mb-2">
              API Key
              <span className="text-sm text-gray-500">(Get it from <a href="https://www.cutout.pro/user/secret-key" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>)</span>
            </label>
            <input
              id="api-key"
              type="text"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="block w-full p-3 border rounded-lg focus:ring-blue-400 focus:border-blue-400 border-gray-300"
            />
            {showApiKeyAlert && (
              <p className="text-sm text-red-500 mt-2">
                Please enter your API key. Don’t have one?{' '}
                <a
                  href="https://www.cutout.pro/user/secret-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Get your API key here.
                </a>
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label htmlFor="image-upload" className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full p-3 border rounded-lg focus:ring-blue-400 focus:border-blue-400 border-gray-300"
            />
          </div>

          {/* Background Removal Button */}
          <button
            onClick={removeBackground}
            disabled={!image || loading}
            className={`w-full py-3 text-white font-semibold rounded-lg ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 transition duration-300'
              }`}
          >
            {loading ? 'Processing...' : 'Remove Background'}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          {/* Result Section */}
          {result && (
            <div className="mt-6 text-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Processed Image:</h2>
              <img src={result} alt="Processed" className="w-full rounded-lg shadow-md" />
              <button
                onClick={downloadImage}
                className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md font-medium hover:bg-blue-600 transition duration-300"
              >
                Download Image
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QrCodeGenerator;
