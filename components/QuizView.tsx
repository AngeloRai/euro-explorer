import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { fetchQuizQuestions } from '../services/gemini';
import { CheckCircle, XCircle, RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizView: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const q = await fetchQuizQuestions();
      setQuestions(q);
      setScore(0);
      setCurrentQIndex(0);
      setGameState('playing');
      setSelectedOption(null);
      setIsAnswered(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameState('finished');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500 mb-4"></div>
        <h2 className="text-2xl font-bold text-sky-800">Generating your quiz...</h2>
        <p className="text-sky-600">Asking our AI travel guide for tricky questions!</p>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 max-w-2xl mx-auto">
        <div className="bg-yellow-100 p-6 rounded-full mb-6">
            <Trophy size={64} className="text-yellow-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 mb-4">European Knowledge Quiz</h1>
        <p className="text-lg text-slate-600 mb-8">
          Test your knowledge about the countries, capitals, flags, and foods of Europe! 
          Are you ready to become a geography master?
        </p>
        <button
          onClick={startQuiz}
          className="bg-sky-500 hover:bg-sky-600 text-white text-xl font-bold py-4 px-10 rounded-2xl shadow-lg transform transition hover:scale-105"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
        <div className="text-6xl font-black text-sky-500 mb-4">{score} / {questions.length}</div>
        <p className="text-slate-600 mb-8 text-lg">
            {score === questions.length ? "Wow! You're an expert explorer! 🌍" : 
             score > questions.length / 2 ? "Great job! Keep traveling! ✈️" : 
             "Good try! Explore the map more and come back! 🗺️"}
        </p>
        <button
          onClick={startQuiz}
          className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition"
        >
          <RefreshCw className="mr-2" /> Play Again
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto p-4 md:p-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div 
          className="bg-sky-500 h-3 rounded-full transition-all duration-500" 
          style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center leading-tight">
          {currentQ.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;
            
            let cardClass = "p-4 rounded-xl border-2 text-left transition-all duration-200 font-semibold text-lg relative overflow-hidden ";
            
            if (isAnswered) {
              if (isCorrect) cardClass += "bg-green-100 border-green-500 text-green-900";
              else if (isSelected) cardClass += "bg-red-100 border-red-500 text-red-900";
              else cardClass += "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
            } else {
              cardClass += "bg-white border-gray-200 hover:border-sky-400 hover:shadow-md cursor-pointer text-slate-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={cardClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle className="text-green-600" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="h-24">
            <AnimatePresence>
            {isAnswered && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center justify-between ${
                        selectedOption === currentQ.correctAnswerIndex ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                    }`}
                >
                    <div className="mr-4">
                        <p className={`font-bold ${selectedOption === currentQ.correctAnswerIndex ? 'text-green-800' : 'text-blue-800'}`}>
                            {selectedOption === currentQ.correctAnswerIndex ? 'Correct!' : 'Explanation:'}
                        </p>
                        <p className="text-sm text-slate-700">{currentQ.explanation}</p>
                    </div>
                    <button 
                        onClick={nextQuestion}
                        className="flex-shrink-0 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg font-bold flex items-center transition"
                    >
                        {currentQIndex === questions.length - 1 ? "Finish" : "Next"} <ArrowRight size={18} className="ml-2" />
                    </button>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuizView;