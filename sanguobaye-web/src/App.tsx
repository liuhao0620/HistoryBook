import { useEffect } from 'react';
import { useGameStore } from './core/state/useGameStore';
import { MainMenu } from './view/screens/MainMenu';
import { SelectScenario } from './view/screens/SelectScenario';
import { SelectForce } from './view/screens/SelectForce';
import { GameScreen } from './view/screens/GameScreen';
import { SettingsScreen } from './view/screens/SettingsScreen';
import { BattleScreen } from './view/screens/BattleScreen';

function App() {
  const { currentScreen, setAvailableScenarios, resolution } = useGameStore();

  useEffect(() => {
    // 启动时自动获取剧本列表
    fetch('/config/scenarios/index.json')
      .then(res => res.json())
      .then(data => {
        setAvailableScenarios(data.scenarios);
      });
  }, [setAvailableScenarios]);

  // 根据状态渲染不同页面
  const renderScreen = () => {
    switch (currentScreen) {
      case 'MAIN_MENU':
        return <MainMenu />;
      case 'SELECT_SCENARIO':
        return <SelectScenario />;
      case 'SELECT_FORCE':
        return <SelectForce />;
      case 'GAME':
        return <GameScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
      case 'BATTLE':
        return <BattleScreen />;
      default:
        return <div>未知页面</div>;
    }
  };

  return (
    <div style={{ width: `${resolution.width}px`, height: `${resolution.height}px`, overflow: 'hidden' }}>
      {renderScreen()}
    </div>
  );
}

export default App;

