import { useEffect, Component } from 'react';
import type { ReactNode } from 'react';
import { useGameStore } from './core/state/useGameStore';
import { MainMenu } from './view/screens/MainMenu';
import { SelectScenario } from './view/screens/SelectScenario';
import { SelectForce } from './view/screens/SelectForce';
import { GameScreen } from './view/screens/GameScreen';
import { SettingsScreen } from './view/screens/SettingsScreen';
import { BattleScreen } from './view/screens/BattleScreen';

import { useScale } from './core/hooks/useScale';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color: 'red', padding: '20px', background: 'white', zIndex: 9999, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>
        <h1>Something went wrong.</h1>
        <pre>{this.state.error?.toString()}</pre>
        <pre>{this.state.error?.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

function App() {
  const { currentScreen, setAvailableScenarios, resolution } = useGameStore();
  const scale = useScale();

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
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000'
    }}>
      <ErrorBoundary>
        <div style={{
          position: 'relative',
          width: `${resolution.width}px`,
          height: `${resolution.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: '0 0 30px rgba(0,0,0,0.8)' // 增加阴影以突出显示游戏区域
        }}>
          {renderScreen()}
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
