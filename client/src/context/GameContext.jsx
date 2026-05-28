// ============================================
// 游戏全局状态 Context
// ============================================

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { io } from 'socket.io-client';
import api from '../api';

const GameContext = createContext(null);

const initialState = {
  gameState: null,
  battleState: null,
  loading: false,
  error: null,
  view: 'menu', // menu | scenario | city | battle | saveload
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'SET_BATTLE_STATE':
      return { ...state, battleState: action.payload, view: action.payload ? 'battle' : state.view };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // WebSocket 连接
  const socketRef = React.useRef(null);

  React.useEffect(() => {
    const socket = io({ transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('game:state', (data) => {
      dispatch({ type: 'SET_GAME_STATE', payload: data });
    });

    socket.on('battle:state', (data) => {
      dispatch({ type: 'SET_BATTLE_STATE', payload: data });
    });

    socket.on('battle:start', (data) => {
      dispatch({ type: 'SET_BATTLE_STATE', payload: data });
      dispatch({ type: 'SET_VIEW', payload: 'battle' });
    });

    socket.on('battle:end', (data) => {
      dispatch({ type: 'SET_BATTLE_STATE', payload: null });
      dispatch({ type: 'SET_VIEW', payload: 'city' });
    });

    return () => socket.disconnect();
  }, []);

  const actions = {
    setView: useCallback((view) => dispatch({ type: 'SET_VIEW', payload: view }), []),

    newGame: useCallback(async (scenarioId, lordId) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await api.newGame(scenarioId, lordId);
        dispatch({ type: 'SET_GAME_STATE', payload: res.state });
        dispatch({ type: 'SET_VIEW', payload: 'city' });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, []),

    refreshState: useCallback(async () => {
      try {
        const res = await api.getState();
        dispatch({ type: 'SET_GAME_STATE', payload: res });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
      }
    }, []),

    addOrder: useCallback(async (order) => {
      try {
        const res = await api.addOrder(order);
        if (!res.ok) throw new Error(res.msg);
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
        return false;
      }
      return true;
    }, []),

    removeOrder: useCallback(async (id) => {
      try {
        await api.removeOrder(id);
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
      }
    }, []),

    executeMonth: useCallback(async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await api.executeMonth();
        dispatch({ type: 'SET_GAME_STATE', payload: res.state });
        return res;
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, []),

    // 战斗操作
    startBattle: useCallback(async (atkCityId, defCityId, attackerIds) => {
      try {
        const res = await api.startBattle(atkCityId, defCityId, attackerIds);
        dispatch({ type: 'SET_BATTLE_STATE', payload: res });
        dispatch({ type: 'SET_VIEW', payload: 'battle' });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
      }
    }, []),

    getMoveRange: useCallback(async () => {
      return await api.getMoveRange();
    }, []),

    moveUnit: useCallback(async (x, y) => {
      return await api.moveUnit(x, y);
    }, []),

    getAttackRange: useCallback(async () => {
      return await api.getAttackRange();
    }, []),

    attackUnit: useCallback(async (defIdx, isDefender) => {
      return await api.attackUnit(defIdx, isDefender);
    }, []),

    endAction: useCallback(async () => {
      return await api.endAction();
    }, []),

    // 存档
    saveGame: useCallback(async (slot) => {
      const res = await api.saveGame(slot);
      return res;
    }, []),

    loadGame: useCallback(async (data) => {
      try {
        const res = await api.loadGame(data);
        dispatch({ type: 'SET_GAME_STATE', payload: res.state });
        dispatch({ type: 'SET_VIEW', payload: 'city' });
      } catch (e) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
      }
    }, []),

    clearError: useCallback(() => dispatch({ type: 'SET_ERROR', payload: null }), []),
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
