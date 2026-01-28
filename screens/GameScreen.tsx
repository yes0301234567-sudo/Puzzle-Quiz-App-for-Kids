import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, Sparkles, BrainCircuit } from 'lucide-react';
import Button from '../components/Button';
import { useGame } from '../context/GameContext';
import { useSettings } from '../context/SettingsContext';
import { generatePuzzle } from '../services/puzzleGenerator';
import { getMathHint } from '../services/geminiService';
import { Puzzle } from '../types';

const GameScreen: React.FC = () => {
  const { stats, updateScore, navigateTo } = useGame();
  const { difficulty, soundEnabled } = useSettings();
  
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  // Sound effects
  const playSound = (type: 'correct' | 'wrong' | 'click') => {
    if (!soundEnabled) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'correct') {
        // Cheerful ascending arpeggio (C5 -> E5 -> G5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'wrong') {
        // Low buzzing sound / Error
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.3);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'click') {
        // Simple UI Click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.start(now);
        osc.stop(now + 0.08);
      }

      // Cleanup context after sound finishes
      osc.onended = () => {
        ctx.close();
      };

    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const loadNewPuzzle = () => {
    setPuzzle(generatePuzzle(difficulty));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setHint(null);
  };

  useEffect(() => {
    loadNewPuzzle();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return; // Prevent double clicking

    setSelectedAnswer(answer);
    const correct = answer === puzzle?.correctAnswer;
    setIsCorrect(correct);
    playSound(correct ? 'correct' : 'wrong');
    
    // Delay before updating score and showing next puzzle or result
    setTimeout(() => {
      updateScore(correct);
      // If user has done 10 questions, go to result? 
      // For now, let's just make it infinite until they quit, 
      // or we could add a question counter limit in GameContext.
      // The prompt says "at least 10 puzzles per session", implies a session end.
      // Let's go to result screen if incorrect count reaches 3 (Lives system) or user clicks "Done".
      // But adhering to the prompt "Score tracking", let's keep it simple continuous play until back.
      loadNewPuzzle();
    }, 1500);
  };

  const fetchHint = async () => {
    playSound('click');
    if (!puzzle) return;
    setLoadingHint(true);
    const hintText = await getMathHint(puzzle.question);
    setHint(hintText);
    setLoadingHint(false);
  };

  if (!puzzle) return <div className="p-10 text-center font-bold text-slate-500">Loading Puzzles...</div>;

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10">
        <button 
          onClick={() => {
            playSound('click');
            navigateTo('RESULT');
          }} // End game shows result
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200">
          <Star className="fill-yellow-500 text-yellow-500" size={20} />
          <span className="font-black text-yellow-700 text-xl">{stats.score}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        
        {/* Question Card */}
        <div className="w-full bg-white rounded-3xl p-10 shadow-lg border-b-8 border-purple-100 text-center relative overflow-hidden">
          <h2 className="text-5xl font-black text-slate-800 tracking-wider">
            {puzzle.question.replace('=', '')}
          </h2>
          
          {/* Feedback Overlay */}
          {isCorrect !== null && (
            <div className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm transition-all ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <div className={`text-6xl animate-pop ${isCorrect ? 'scale-110' : 'scale-100'}`}>
                {isCorrect ? '🎉' : '❌'}
              </div>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {puzzle.options.map((option, idx) => {
            let btnVariant: 'primary' | 'success' | 'danger' | 'outline' = 'outline';
            if (selectedAnswer !== null) {
              if (option === puzzle.correctAnswer) btnVariant = 'success';
              else if (option === selectedAnswer) btnVariant = 'danger';
            }

            return (
              <Button
                key={idx}
                variant={selectedAnswer === null ? 'outline' : btnVariant}
                size="xl"
                className={`h-24 text-3xl font-bold border-b-4 active:border-b-0 ${selectedAnswer === null ? 'hover:-translate-y-1' : ''}`}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Footer / Hint */}
      <div className="p-6 bg-white border-t border-slate-100">
        {hint ? (
           <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-blue-800 text-sm font-semibold animate-pop relative">
             <button onClick={() => { playSound('click'); setHint(null); }} className="absolute top-2 right-2 text-blue-300">×</button>
             <p className="pr-4">💡 {hint}</p>
           </div>
        ) : (
          <button 
            onClick={fetchHint}
            disabled={loadingHint}
            className="w-full py-3 text-purple-500 font-bold flex items-center justify-center gap-2 hover:bg-purple-50 rounded-xl transition-colors"
          >
            {loadingHint ? (
              <span>Thinking...</span>
            ) : (
              <>
                <BrainCircuit size={20} />
                <span>Need a Hint? Ask AI</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameScreen;