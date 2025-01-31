import { useState, useEffect } from 'react';
import axios from 'axios';

const TriviaQuiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [settings, setSettings] = useState({
    category: 9,
    difficulty: 'easy'
  });

  const categories = [
    { id: 9, name: 'General Knowledge' },
    { id: 17, name: 'Science & Nature' },
    { id: 23, name: 'History' },
    { id: 18, name: 'Computers' }
  ];

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `https://opentdb.com/api.php?amount=10&category=${settings.category}&difficulty=${settings.difficulty}`
      );
      setQuizData(response.data.results.map(q => ({
        ...q,
        answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
      })));
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (answer) => {
    if (answer === quizData[currentQuestion].correct_answer) {
      setScore(prev => prev + 10);
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowScore(true);
      updateLeaderboard();
    }
  };

  const updateLeaderboard = () => {
    const newEntry = { 
      score, 
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) 
    };
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
    setLeaderboard(updatedLeaderboard);
  };

  useEffect(() => {
    const savedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    setLeaderboard(savedLeaderboard);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        {!quizData.length ? (
          <div className="glass-container bg-slate-800/30 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12">
            <h1 className="text-center mb-12">
              <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Quiz Master
              </span>
              <p className="mt-4 text-slate-400 text-lg">Test Your Knowledge</p>
            </h1>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <h3 className="text-slate-300 text-lg font-medium">Category</h3>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSettings(p => ({ ...p, category: cat.id }))}
                      className={`p-4 text-left rounded-xl transition-all border ${
                        settings.category === cat.id 
                          ? 'bg-purple-400/20 border-purple-400/50' 
                          : 'bg-slate-700/30 hover:bg-slate-700/50 border-slate-600'
                      }`}
                    >
                      <span className={`block text-sm ${
                        settings.category === cat.id ? 'text-purple-400' : 'text-slate-300'
                      }`}>
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-slate-300 text-lg font-medium">Difficulty</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map(level => (
                    <button
                      key={level}
                      onClick={() => setSettings(p => ({ ...p, difficulty: level }))}
                      className={`p-3 text-center rounded-xl transition-all border ${
                        settings.difficulty === level 
                          ? 'bg-blue-400/20 border-blue-400/50' 
                          : 'bg-slate-700/30 hover:bg-slate-700/50 border-slate-600'
                      }`}
                    >
                      <span className={`block text-sm capitalize ${
                        settings.difficulty === level ? 'text-blue-400' : 'text-slate-300'
                      }`}>
                        {level}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={fetchQuestions}
              className="w-full py-4 bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-300 hover:to-blue-300 text-slate-900 rounded-xl font-bold text-lg transition-all"
            >
              Start Challenge
            </button>
          </div>
        ) : showScore ? (
          <div className="glass-container bg-slate-800/30 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {score}/100
              </h2>
              <p className="text-slate-400 mt-4">Final Score</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-300 mb-6">Leaderboard</h3>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl flex justify-between items-center ${
                      index < 3 ? 'bg-gradient-to-r from-purple-400/10 to-blue-400/10' : 'bg-slate-700/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        index < 3 
                          ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-slate-900 font-bold' 
                          : 'text-slate-400'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-slate-300">{entry.date}</span>
                    </div>
                    <span className="font-medium text-slate-300">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setQuizData([]);
                setShowScore(false);
                setCurrentQuestion(0);
                setScore(0);
              }}
              className="w-full py-3.5 border-2 border-slate-600 hover:border-blue-400 text-slate-300 hover:text-blue-400 rounded-xl font-semibold transition-all"
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <div className="glass-container bg-slate-800/30 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12">
            <div className="flex justify-between items-center mb-10">
              <div className="text-slate-400">
                Question <span className="text-purple-400 font-medium">{currentQuestion + 1}</span>/10
              </div>
              <div className="text-blue-400 font-medium text-xl">
                {score} Points
              </div>
            </div>

            <h2 className="text-2xl text-slate-200 mb-10 leading-relaxed font-light">
              {decodeURIComponent(quizData[currentQuestion]?.question)}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizData[currentQuestion]?.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(answer)}
                  className="p-4 text-left bg-slate-700/30 hover:bg-slate-700/50 border-2 border-slate-600 rounded-xl transition-all text-slate-300 hover:text-purple-400 hover:border-purple-400/50"
                >
                  {decodeURIComponent(answer)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriviaQuiz;