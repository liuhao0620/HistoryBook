// ============================================
// 主应用组件
// ============================================

import React from 'react';
import { useGame } from './context/GameContext';
import MainMenu from './views/MainMenu';
import CityView from './views/CityView';
import BattleView from './views/BattleView';
import SaveLoadView from './views/SaveLoadView';

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#1a1a2e',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 12px',
    background: '#16213e',
    borderBottom: '1px solid #0f3460',
    minHeight: 40,
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e94560',
  },
  headerInfo: {
    fontSize: 12,
    color: '#a0a0b0',
  },
  errorBar: {
    background: '#e94560',
    color: '#fff',
    padding: '4px 12px',
    fontSize: 12,
    cursor: 'pointer',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
};

export default function App() {
  const { state, actions } = useGame();

  const getHeaderText = () => {
    if (state.gameState) {
      const lord = state.gameState.lords?.find(l => l.id === state.gameState.playerLord);
      return `${state.gameState.year}年${state.gameState.month}月 · ${lord?.name || ''}`;
    }
    return '三国霸业';
  };

  return (
    <div style={styles.container}>
      {/* 顶栏 */}
      {state.view !== 'menu' && (
        <div style={styles.header}>
          <span style={styles.headerTitle}>{getHeaderText()}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={styles.headerInfo}>
              {state.gameState?.phase === 'battle' ? '战斗中' : 
               state.gameState?.phase === 'execute' ? '执行中...' : '指令阶段'}
            </span>
            {state.view === 'city' && (
              <>
                <button onClick={() => actions.setView('saveload')} style={btnStyle}>
                  存档
                </button>
                <button onClick={() => actions.setView('menu')} style={btnStyle}>
                  菜单
                </button>
              </>
            )}
            {state.view === 'battle' && (
              <button onClick={() => actions.setView('city')} style={btnStyle}>
                返回
              </button>
            )}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {state.error && (
        <div style={styles.errorBar} onClick={actions.clearError}>
          {state.error} (点击关闭)
        </div>
      )}

      {/* 主内容区 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {state.view === 'menu' && <MainMenu />}
        {state.view === 'city' && <CityView />}
        {state.view === 'battle' && <BattleView />}
        {state.view === 'saveload' && <SaveLoadView />}
      </div>

      {/* 加载遮罩 */}
      {state.loading && (
        <div style={styles.loadingOverlay}>
          <div style={{ color: '#fff', fontSize: 18 }}>处理中...</div>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  background: '#0f3460',
  color: '#e0d5b7',
  border: '1px solid #1a1a4e',
  borderRadius: 4,
  padding: '2px 10px',
  fontSize: 12,
  cursor: 'pointer',
};
