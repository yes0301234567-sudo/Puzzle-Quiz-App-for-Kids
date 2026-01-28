import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Difficulty } from '../types';

interface SettingsContextType {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  resetProgress: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available
  const [difficulty, setDifficultyState] = useState<Difficulty>(() => {
    const saved = localStorage.getItem('difficulty');
    return (saved as Difficulty) || Difficulty.Easy;
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [musicEnabled, setMusicEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', JSON.stringify(musicEnabled));
  }, [musicEnabled]);

  const setDifficulty = (diff: Difficulty) => setDifficultyState(diff);
  const setSoundEnabled = (enabled: boolean) => setSoundEnabledState(enabled);
  const setMusicEnabled = (enabled: boolean) => setMusicEnabledState(enabled);

  const resetProgress = () => {
    localStorage.removeItem('highScore_Easy');
    localStorage.removeItem('highScore_Medium');
    localStorage.removeItem('highScore_Hard');
    // We could dispatch an event or expose a way to refresh high score in GameContext
    window.location.reload(); // Simple way to ensure all states reset
  };

  return (
    <SettingsContext.Provider
      value={{
        difficulty,
        setDifficulty,
        soundEnabled,
        setSoundEnabled,
        musicEnabled,
        setMusicEnabled,
        resetProgress,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
