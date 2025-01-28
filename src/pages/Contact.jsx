import { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Importing star icon from react-icons

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', rating: 0, message: '' });
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.rating || !formData.message) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      // Simulate an API call to send feedback
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating network delay

      // Update reviews state
      setReviews([...reviews, formData]);
      // Reset form data
      setFormData({ name: '', email: '', rating: 0, message: '' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage('Failed to submit feedback. Please try again later.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-200 to-gray-400 min-h-screen py-10 px-4">
      <h1 className="text-3xl md:text-4xl text-center font-bold mb-8 text-gray-800">Feedback and Reviews</h1>
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 shadow-md rounded-md">
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={submitFeedback}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className={`focus:outline-none`}
                >
                  <FaStar
                    size={30}
                    className={`cursor-pointer ${formData.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your feedback"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Submit Feedback
          </button>
        </form>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Reviews</h2>
            {reviews.map((review, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-100 rounded-md shadow-md">
                <p className="text-lg font-semibold text-gray-700">{review.name}</p>
                <p className="text-gray-600">{review.email}</p>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} size={20} className={`${review.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600">{review.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
