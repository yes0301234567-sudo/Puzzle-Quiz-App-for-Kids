import React, { useEffect } from 'react';
import { Home, RefreshCw, Star } from 'lucide-react';
import Button from '../components/Button';
import { useGame } from '../context/GameContext';

const ResultScreen: React.FC = () => {
  const { stats, navigateTo, resetGame } = useGame();

  const percentage = stats.correctCount + stats.incorrectCount > 0 
    ? Math.round((stats.correctCount / (stats.correctCount + stats.incorrectCount)) * 100)
    : 0;

  const getMessage = () => {
    if (percentage === 100) return "Perfect Score! 🌟";
    if (percentage >= 80) return "Awesome Job! 🎉";
    if (percentage >= 50) return "Good Effort! 💪";
    return "Keep Practicing! 📚";
  };

  // Simple confetti effect using DOM elements (pure React way without big libs)
  useEffect(() => {
    if (percentage > 70) {
      // Just a simple visual trigger, in a real app use canvas-confetti
    }
  }, [percentage]);

  const handlePlayAgain = () => {
    resetGame();
    navigateTo('GAME');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 bg-white animate-pop">
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800">Game Over!</h2>
        <p className="text-xl text-purple-500 font-bold">{getMessage()}</p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-yellow-300 to-yellow-500 text-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-lg border-4 border-yellow-200">
          <Star size={40} className="fill-white mb-1" />
          <span className="text-4xl font-black">{stats.score}</span>
          <span className="text-xs font-bold uppercase tracking-wider opacity-90">Points</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
          <div className="text-2xl font-black text-green-600">{stats.correctCount}</div>
          <div className="text-xs font-bold text-green-800 uppercase">Correct</div>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
          <div className="text-2xl font-black text-red-600">{stats.incorrectCount}</div>
          <div className="text-xs font-bold text-red-800 uppercase">Wrong</div>
        </div>
      </div>

      <div className="w-full space-y-3 pt-6">
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          onClick={handlePlayAgain}
        >
          <RefreshCw className="mr-2" />
          Play Again
        </Button>

        <Button 
          variant="secondary" 
          size="lg" 
          fullWidth 
          onClick={() => navigateTo('HOME')}
        >
          <Home className="mr-2" />
          Back Home
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
