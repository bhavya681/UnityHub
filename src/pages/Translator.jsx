import React, { useState, useEffect } from "react";

const Translator = () => {
  const [articles, setArticles] = useState([]);
  const [topic, setTopic] = useState("technology");
  const [savedArticles, setSavedArticles] = useState([]);
  const [error, setError] = useState(null);

  const API_KEY = "182e2960ebb763a1dd80a14cec2d11c9";
  const API_URL = `https://gnews.io/api/v4/top-headlines?topic=${topic}&lang=en&country=us&token=${API_KEY}`;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
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
  };

  useEffect(() => {
    const storedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];
    setSavedArticles(storedArticles);
  }, []);

  const categories = ["technology", "business", "sports", "health", "science", 
                     "entertainment", "world", "politics", "travel", "food"];

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-white text-xl font-bold">NewsHub Pro</h1>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setTopic(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    topic === category 
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-2">
            {topic.charAt(0).toUpperCase() + topic.slice(1)} Headlines
          </h2>
          <p className="text-blue-600">Stay informed with the latest updates</p>
        </header>

        {error && (
          <div className="bg-red-100 p-4 rounded-lg mb-8 text-red-700">
            Error: {error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <article 
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <img 
                  src={article.image || "https://via.placeholder.com/400x200?text=News+Image"} 
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-blue-600 text-sm mb-4">
                    {article.description || "No description available"}
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                    >
                      Read Article →
                    </a>
                    <button
                      onClick={() => saveArticle(article)}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full text-sm transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-blue-400">No articles found for this category</p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Saved Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArticles.length > 0 ? (
              savedArticles.map((article, index) => (
                <div 
                  key={index}
                  className="border border-blue-100 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                >
                  <h4 className="font-medium text-blue-900 mb-2">{article.title}</h4>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm hover:underline"
                  >
                    View Saved Article
                  </a>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-6">
                <p className="text-blue-300">No saved articles yet</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Translator;