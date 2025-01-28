import React, { useState, useEffect } from "react";

const Translator = () => {
  const [articles, setArticles] = useState([]);
  const [topic, setTopic] = useState("technology");
  const [savedArticles, setSavedArticles] = useState([]);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = "182e2960ebb763a1dd80a14cec2d11c9"; // Replace with your API key
  const API_URL = `https://gnews.io/api/v4/top-headlines?topic=${topic}&lang=en&country=us&token=${API_KEY}`;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError(err.message);
      }
    };

    fetchArticles();
  }, [topic]);

  const saveArticle = (article) => {
    const updatedSavedArticles = [...savedArticles, article];
    setSavedArticles(updatedSavedArticles);
    localStorage.setItem("savedArticles", JSON.stringify(updatedSavedArticles));
    alert("Article saved for later!");
  };

  useEffect(() => {
    const storedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
    setSavedArticles(storedArticles);
  }, []);

  const categories = ["technology", "business", "sports", "health", "science", "entertainment", "world", "politics", "travel", "food"];

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex space-x-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setTopic(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${topic === category ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white"}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Top Headlines in {topic.charAt(0).toUpperCase() + topic.slice(1)}</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              <p>Error: {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
                  <img src={article.image || "https://via.placeholder.com/150"} alt={article.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{article.description || "No description available."}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">Read Full Article</a>
                    <button onClick={() => saveArticle(article)} className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">Save for Later</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No articles found for this topic.</p>
            )}
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6">Saved Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArticles.length > 0 ? (
              savedArticles.map((article, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
                  <img src={article.image || "https://via.placeholder.com/150"} alt={article.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{article.description || "No description available."}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">Read Full Article</a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No saved articles. Save articles to read later.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
