// ============================================
// 战斗视图 - Canvas 战棋地图
// ============================================

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import {
  ARMY_NAMES, TERRAIN_NAMES, BATTLE_STATE,
  WEATHER, TILE_SIZE,
} from '../../../shared/constants';

const TERRAIN_COLORS = {
  0: '#4a7c3f', // 草地
  1: '#8b9a46', // 平原
  2: '#6b5b3a', // 山地
  3: '#2d5a1e', // 森林
  4: '#8b7355', // 村庄
  5: '#7a6a5a', // 城池
  6: '#9b8b5a', // 营寨
  7: '#2a6496', // 河流
};

const LORD_COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#f59e0b', '#e94560'];

export default function BattleView() {
  const { state, actions } = useGame();
  const canvasRef = useRef(null);
  const [moveRange, setMoveRange] = useState([]);
  const [attackRange, setAttackRange] = useState([]);
  const [selectedMode, setSelectedMode] = useState(null); // 'move' | 'attack' | null
  const [hoverTile, setHoverTile] = useState(null);
  const [log, setLog] = useState([]);

  const bs = state.battleState;
  if (!bs) return <div style={{ color: '#a0a0b0', padding: 20 }}>无战斗数据</div>;

  const CANVAS_W = Math.min(window.innerWidth - 20, 640);
  const CANVAS_H = Math.min(window.innerHeight - 120, 480);
  const scale = Math.min(
    CANVAS_W / (bs.mapWidth * TILE_SIZE),
    CANVAS_H / (bs.mapHeight * TILE_SIZE)
  );

  // 渲染地图
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = bs.mapWidth * TILE_SIZE * scale;
    const h = bs.mapHeight * TILE_SIZE * scale;
    canvas.width = w;
    canvas.height = h;

    // 背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, w, h);

    // 地形
    for (let y = 0; y < bs.mapHeight; y++) {
      for (let x = 0; x < bs.mapWidth; x++) {
        const t = bs.tiles[y]?.[x] ?? 0;
        ctx.fillStyle = TERRAIN_COLORS[t] || '#333';
        ctx.fillRect(x * TILE_SIZE * scale, y * TILE_SIZE * scale, TILE_SIZE * scale, TILE_SIZE * scale);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.strokeRect(x * TILE_SIZE * scale, y * TILE_SIZE * scale, TILE_SIZE * scale, TILE_SIZE * scale);
      }
    }

    // 移动范围
    moveRange.forEach(r => {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.25)';
      ctx.fillRect(r.x * TILE_SIZE * scale + 1, r.y * TILE_SIZE * scale + 1, TILE_SIZE * scale - 2, TILE_SIZE * scale - 2);
    });

    // 攻击范围
    attackRange.forEach(r => {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(r.x * TILE_SIZE * scale + 1, r.y * TILE_SIZE * scale + 1, TILE_SIZE * scale - 2, TILE_SIZE * scale - 2);
    });

    // 悬停提示
    if (hoverTile && (moveRange.find(r => r.x === hoverTile.x && r.y === hoverTile.y) ||
        attackRange.find(r => r.x === hoverTile.x && r.y === hoverTile.y))) {
      ctx.fillStyle = 'rgba(255,255,0,0.4)';
      ctx.fillRect(hoverTile.x * TILE_SIZE * scale, hoverTile.y * TILE_SIZE * scale, TILE_SIZE * scale, TILE_SIZE * scale);
    }

    // 单位
    const allUnits = [...(bs.attackers || []), ...(bs.defenders || [])];
    allUnits.forEach(u => {
      if (!u.isAlive) return;
      const color = LORD_COLORS[u.lord % LORD_COLORS.length] || '#fff';
      const cx = u.x * TILE_SIZE * scale + TILE_SIZE * scale / 2;
      const cy = u.y * TILE_SIZE * scale + TILE_SIZE * scale / 2;
      const r = TILE_SIZE * scale * 0.38;

      // 单位圆圈
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = u.side === 0 ? (u.lord === state.gameState?.playerLord ? '#22c55e' : '#3b82f6') : '#ef4444';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 部队名
      ctx.fillStyle = '#fff';
      ctx.font = `${Math.max(8, 10 * scale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(u.name.slice(0, 2), cx, cy - r - 4);

      // 兵力
      ctx.fillStyle = '#ffd700';
      ctx.font = `${Math.max(7, 9 * scale)}px sans-serif`;
      ctx.fillText(u.armyCount, cx, cy + r + 10);

      // 当前选中单位高亮
      if (bs.currentUnit && u.personId === bs.currentUnit.personId) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
      }

      // 状态标记
      if (u.state !== BATTLE_STATE.NORMAL) {
        ctx.fillStyle = '#ff4444';
        ctx.font = `${Math.max(8, 12 * scale)}px sans-serif`;
        ctx.fillText('!', cx + r, cy - r);
      }
    });
  }, [bs, moveRange, attackRange, hoverTile, scale, state.gameState]);

  useEffect(() => {
    render();
  }, [render]);

  useEffect(() => {
    if (bs.log) setLog([...bs.log]);
  }, [bs.log]);

  // 点击地图
  const handleCanvasClick = async (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const tx = Math.floor(mx / (TILE_SIZE * scale));
    const ty = Math.floor(my / (TILE_SIZE * scale));

    if (selectedMode === 'move') {
      const res = await actions.moveUnit(tx, ty);
      if (!res.ok) {
        setLog(l => [...l, res.msg]);
      } else {
        setMoveRange([]);
        setSelectedMode(null);
      }
    } else if (selectedMode === 'attack') {
      // 查找该位置的敌方单位
      const oppSide = bs.currentSide === 0 ? bs.defenders : bs.attackers;
      const targetIdx = oppSide.findIndex(u => u.isAlive && u.x === tx && u.y === ty);
      if (targetIdx >= 0) {
        const res = await actions.attackUnit(targetIdx, bs.currentSide !== 0);
        if (!res.ok) {
          setLog(l => [...l, res.msg]);
        } else {
          setAttackRange([]);
          setSelectedMode(null);
        }
      }
    } else {
      // 选中模式
      const cu = bs.currentUnit;
      if (!cu) return;

      // 检查是否点击了己方未行动单位
      const mySide = bs.currentSide === 0 ? bs.attackers : bs.defenders;
      const clickedUnit = mySide.find(u => u.isAlive && u.x === tx && u.y === ty);
      if (clickedUnit && clickedUnit.personId === cu.personId) {
        // 点击了当前单位，不做特殊处理
      }
    }
  };

  const handleCanvasHover = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const tx = Math.floor(mx / (TILE_SIZE * scale));
    const ty = Math.floor(my / (TILE_SIZE * scale));
    setHoverTile({ x: tx, y: ty });
  };

  // 显示移动范围
  const showMoveRange = async () => {
    const range = await actions.getMoveRange();
    setMoveRange(range || []);
    setAttackRange([]);
    setSelectedMode('move');
  };

  // 显示攻击范围
  const showAttackRange = async () => {
    const range = await actions.getAttackRange();
    setAttackRange(range || []);
    setMoveRange([]);
    setSelectedMode('attack');
  };

  // 结束行动
  const endAction = async () => {
    setMoveRange([]);
    setAttackRange([]);
    setSelectedMode(null);
    const res = await actions.endAction();
    if (res.battleOver) {
      setLog(l => [...l, `战斗结束！${res.result?.log?.slice(-3).join('\n') || ''}`]);
    }
  };

  const cu = bs.currentUnit;
  const weatherNames = ['晴', '阴', '风', '雨', '雹'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* 战斗状态栏 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '4px 10px', background: '#16213e', borderBottom: '1px solid #0f3460',
        fontSize: 12, color: '#c0c0c0', flexShrink: 0,
      }}>
        <span>回合 {bs.turn} | 天气: {weatherNames[bs.weather] || '晴'}</span>
        <span>攻方粮: {bs.atkProvender} | 守方粮: {bs.defProvender}</span>
        <span>
          {bs.currentSide === 0 ? '进攻方' : '防守方'}行动
        </span>
      </div>

      {/* Canvas 地图 */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0d1b36' }}>
        <canvas
          ref={canvasRef}
          style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasHover}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            handleCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
          }}
        />
      </div>

      {/* 操作栏 */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: '#16213e', borderTop: '1px solid #0f3460',
        flexShrink: 0, padding: '4px 10px',
      }}>
        {/* 当前单位信息 */}
        {cu && (
          <div style={{ fontSize: 11, color: '#a0a0b0', marginBottom: 4 }}>
            当前: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{cu.name}</span>
            {' '} Lv.{cu.level} {ARMY_NAMES[cu.armyType]}
            {' '} 兵:{cu.armyCount} 移:{cu.curMove}/{cu.move}
            {' '} {cu.hasActed ? '(已行动)' : ''}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={showMoveRange} style={battleBtn(selectedMode === 'move')}>
            移动
          </button>
          <button onClick={showAttackRange} style={battleBtn(selectedMode === 'attack')}>
            攻击
          </button>
          <button onClick={endAction} style={battleBtn(false)}>
            结束行动
          </button>
          <button onClick={() => { setMoveRange([]); setAttackRange([]); setSelectedMode(null); }} style={battleBtn(false)}>
            取消
          </button>
        </div>

        {/* 日志 */}
        <div style={{
          maxHeight: 80, overflowY: 'auto', marginTop: 4,
          fontSize: 11, color: '#808090',
        }}>
          {log.slice(-8).map((l, i) => (
            <div key={i} style={{ padding: '1px 0' }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function battleBtn(active) {
  return {
    padding: '5px 12px', fontSize: 12, fontWeight: 'bold',
    borderRadius: 4, cursor: 'pointer',
    background: active ? '#e94560' : '#0f3460',
    color: active ? '#fff' : '#c0c0c0',
    border: 'none',
  };
}
