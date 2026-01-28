import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Music, Check, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import { useGame } from '../context/GameContext';
import { useSettings } from '../context/SettingsContext';
import { Difficulty } from '../types';

const SettingsScreen: React.FC = () => {
  const { navigateTo } = useGame();
  const { 
    difficulty, setDifficulty, 
    soundEnabled, setSoundEnabled, 
    musicEnabled, setMusicEnabled,
    resetProgress 
  } = useSettings();

  const difficulties = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 animate-pop">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-10">
        <button 
          onClick={() => navigateTo('HOME')}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-black text-slate-800">Settings</h2>
      </div>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        
        {/* Difficulty Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-600 uppercase tracking-wider">Difficulty</h3>
          <div className="grid grid-cols-1 gap-3">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`
                  relative p-4 rounded-2xl border-2 text-left transition-all duration-200
                  ${difficulty === diff 
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-purple-200'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block font-bold text-lg">{diff}</span>
                    <span className="text-sm opacity-80">
                      {diff === 'Easy' && '1-10, Add & Sub'}
                      {diff === 'Medium' && '1-50, Add, Sub & Mult'}
                      {diff === 'Hard' && '1-100, All Operations'}
                    </span>
                  </div>
                  {difficulty === diff && (
                    <div className="bg-purple-500 text-white p-1 rounded-full">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Sound Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-600 uppercase tracking-wider">Sound & Music</h3>
          <div className="flex gap-4">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex-1 p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-colors ${
                soundEnabled 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-slate-200 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 size={32} /> : <VolumeX size={32} />}
              <span className="font-bold">Effects</span>
            </button>

            <button 
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`flex-1 p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-colors ${
                musicEnabled 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-slate-200 text-slate-400'
              }`}
            >
              <Music size={32} />
              <span className="font-bold">Music</span>
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <Button 
            variant="danger" 
            fullWidth 
            onClick={() => {
              if(window.confirm('Are you sure you want to reset all high scores?')) {
                resetProgress();
              }
            }}
          >
            <RefreshCw className="mr-2" size={20} />
            Reset Progress
          </Button>
        </section>

      </div>
    </div>
  );
};

export default SettingsScreen;
