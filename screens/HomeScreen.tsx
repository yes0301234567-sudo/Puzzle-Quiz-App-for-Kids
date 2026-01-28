import React from 'react';
import { Play, Settings, Trophy } from 'lucide-react';
import Button from '../components/Button';
import { useGame } from '../context/GameContext';
import { useSettings } from '../context/SettingsContext';

const HomeScreen: React.FC = () => {
  const { navigateTo, getHighScore, resetGame } = useGame();
  const { difficulty } = useSettings();

  const handleStart = () => {
    resetGame();
    navigateTo('GAME');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 animate-pop">
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-black text-purple-600 tracking-tight drop-shadow-sm">
          Math <br /> Whiz
        </h1>
        <p className="text-slate-500 font-bold text-lg">Fun Learning for Kids!</p>
      </div>

      <div className="w-full bg-yellow-100 rounded-2xl p-4 flex items-center justify-between border-2 border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-2 rounded-xl text-white">
            <Trophy size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider">High Score</span>
            <span className="text-2xl font-black text-yellow-800">{getHighScore()}</span>
          </div>
        </div>
        <div className="px-3 py-1 bg-yellow-200 rounded-lg text-yellow-800 text-xs font-bold">
          {difficulty}
        </div>
      </div>

      <div className="w-full space-y-4">
        <Button 
          variant="primary" 
          size="xl" 
          fullWidth 
          onClick={handleStart}
          className="shadow-purple-300"
        >
          <Play fill="currentColor" className="mr-2" />
          Play Now
        </Button>

        <Button 
          variant="secondary" 
          size="lg" 
          fullWidth 
          onClick={() => navigateTo('SETTINGS')}
          className="shadow-yellow-300"
        >
          <Settings className="mr-2" />
          Settings
        </Button>
      </div>

      <div className="absolute bottom-6 text-slate-400 text-sm font-semibold">
        Build v1.0 • For Kids 6-12
      </div>
    </div>
  );
};

export default HomeScreen;
