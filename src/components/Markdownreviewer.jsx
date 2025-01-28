import React, { useState } from 'react';
import axios from 'axios';
import AiHeader from './AiHeader'; // Assuming AiHeader is the professional header

const MarkdownReviewer = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const processImage = async () => {
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
        'https://www.cutout.pro/api/v1/matting?mattingType=3&crop=true',
        formData,
        {
          headers: {
            APIKEY: apiKey,
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setResult(imageUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = result;
    link.download = 'processed-image.png'; // You can customize the file name
    link.click();
  };

  return (
    <>
      <AiHeader />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 p-4">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-extrabold text-gray-800">Face Cutout Tool</h3>
          <p className="text-gray-600 mt-2">Remove backgrounds with precision and ease.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
          {/* API Key Input */}
          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-gray-700 font-medium mb-2">
              API Key <span className="text-sm text-gray-500">(Get it from <a href="https://www.cutout.pro/user/secret-key" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">here</a>)</span>
            </label>
            <input
              id="apiKey"
              type="text"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="block w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label htmlFor="imageUpload" className="block text-gray-700 font-medium mb-2">
              Upload Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Process Button */}
          <button
            onClick={processImage}
            disabled={!image || loading}
            className={`w-full py-3 px-6 rounded-lg text-white font-medium ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} transition duration-300`}
          >
            {loading ? 'Processing...' : 'Process Image'}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          {/* API Key Alert */}
          {showApiKeyAlert && (
            <div className="mt-4 text-red-500 text-center">
              <p>Please enter your API key to proceed.</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 text-center">
              <h4 className="text-lg font-semibold text-gray-700">Processed Image:</h4>
              <img src={result} alt="Processed" className="mt-4 max-w-full rounded-lg shadow-md" />
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

export default MarkdownReviewer;
