import { useState, useRef } from "react";
import { FaStar } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", rating: 0, message: "" });
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change for text and message fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  // Form submission to send feedback via EmailJS
  const submitFeedback = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.rating || !formData.message) {
      setErrorMessage("Please fill in all fields before submitting.");
      return;
    }

    // Log the form data being sent to EmailJS for debugging
    console.log("Data being sent to EmailJS:", formData);

    try {
      // Send email via EmailJS
      const emailResponse = await emailjs.send(
        "service_bva52eb", // Your Service ID
        "template_92ektbs", // Your Template ID
        {
          name: formData.name,
          email: formData.email,
          rating: formData.rating,
          message: formData.message,
        },
        "TifqqkMgwGUe0d1OD" // Your Public Key
      );

      // Log the response from EmailJS for debugging
      console.log("Email sent successfully:", emailResponse);

      // Update reviews list after successful submission
      setReviews([...reviews, formData]);

      // Reset form fields after submission
      setFormData({ name: "", email: "", rating: 0, message: "" });
      setSuccessMessage("Your review has been submitted successfully!");

    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Failed to send feedback. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-200 to-gray-400 min-h-screen py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Feedback & Reviews</h1>

      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        {/* Displaying error or success messages */}
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        {/* Feedback Form */}
        <form ref={form} onSubmit={submitFeedback} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Your email"
              required
            />
          </div>

          {/* Rating Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <FaStar
                    size={30}
                    className={`${formData.rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Your feedback"
              rows="4"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Submit Feedback
          </button>
        </form>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">User Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <p className="text-lg font-semibold text-gray-700">{review.name}</p>
                  <p className="text-sm text-gray-600">{review.email}</p>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        className={`${review.rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
