import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GameStats, ScreenName } from '../types';
import { useSettings } from './SettingsContext';

interface GameContextType {
  currentScreen: ScreenName;
  navigateTo: (screen: ScreenName) => void;
  stats: GameStats;
  updateScore: (correct: boolean) => void;
  resetGame: () => void;
  getHighScore: () => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { difficulty } = useSettings();
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('HOME');
  
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    highScore: 0,
  });

  // Load high score when difficulty changes or app loads
  useEffect(() => {
    const savedHighScore = localStorage.getItem(`highScore_${difficulty}`);
    setStats(prev => ({
      ...prev,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) : 0
    }));
  }, [difficulty]);

  const navigateTo = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  const updateScore = (correct: boolean) => {
    setStats(prev => {
      const newScore = correct ? prev.score + 10 : Math.max(0, prev.score - 5);
      const newCorrect = correct ? prev.correctCount + 1 : prev.correctCount;
      const newIncorrect = !correct ? prev.incorrectCount + 1 : prev.incorrectCount;
      
      // Update High Score if needed
      let newHighScore = prev.highScore;
      if (newScore > prev.highScore) {
        newHighScore = newScore;
        localStorage.setItem(`highScore_${difficulty}`, newHighScore.toString());
      }

      return {
        score: newScore,
        correctCount: newCorrect,
        incorrectCount: newIncorrect,
        highScore: newHighScore
      };
    });
  };

  const resetGame = () => {
    setStats(prev => ({
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      highScore: prev.highScore // Keep high score
    }));
  };

  const getHighScore = () => stats.highScore;

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        navigateTo,
        stats,
        updateScore,
        resetGame,
        getHighScore
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
