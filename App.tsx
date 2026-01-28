import React from 'react';
import Layout from './components/Layout';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import SettingsScreen from './screens/SettingsScreen';
import ResultScreen from './screens/ResultScreen';
import { useGame } from './context/GameContext';

const App: React.FC = () => {
  const { currentScreen } = useGame();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return <HomeScreen />;
      case 'GAME':
        return <GameScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
      case 'RESULT':
        return <ResultScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <Layout>
      {renderScreen()}
    </Layout>
  );
};

export default App;
