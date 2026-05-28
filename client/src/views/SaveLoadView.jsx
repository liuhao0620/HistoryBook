// ============================================
// 存档/读档视图
// ============================================

import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const styles = {
  container: {
    height: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '20px',
  },
  title: {
    fontSize: 20, fontWeight: 'bold', color: '#e94560', marginBottom: 20,
  },
  slotList: {
    width: '100%', maxWidth: 400,
  },
  slot: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 16px', margin: '6px 0',
    background: '#16213e', borderRadius: 6, border: '1px solid #0f3460',
    cursor: 'pointer',
  },
  slotInfo: {
    flex: 1,
  },
  slotName: {
    fontSize: 14, fontWeight: 'bold', color: '#e0d5b7',
  },
  slotDetail: {
    fontSize: 11, color: '#808090', marginTop: 2,
  },
  saveBtn: {
    padding: '6px 16px', fontSize: 13, fontWeight: 'bold',
    borderRadius: 4, border: 'none',
    background: '#e94560', color: '#fff', cursor: 'pointer',
    marginLeft: 12,
  },
  backBtn: {
    padding: '8px 24px', marginTop: 20, fontSize: 14,
    borderRadius: 6, border: '1px solid #0f3460',
    background: 'transparent', color: '#a0a0b0', cursor: 'pointer',
  },
};

export default function SaveLoadView() {
  const { state, actions } = useGame();
  const [saves, setSaves] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = () => {
    const slots = [];
    for (let i = 1; i <= 3; i++) {
      const data = localStorage.getItem(`save_${i}`);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          slots.push({
            slot: i,
            hasData: true,
            year: parsed.year,
            month: parsed.month,
            phase: parsed.phase,
            scenarioId: parsed.scenarioId,
          });
        } catch (e) {
          slots.push({ slot: i, hasData: false });
        }
      } else {
        slots.push({ slot: i, hasData: false });
      }
    }
    setSaves(slots);
  };

  const handleSave = async (slot) => {
    const res = await actions.saveGame(slot);
    if (res && res.ok && res.data) {
      localStorage.setItem(`save_${slot}`, JSON.stringify(res.data));
      setMsg(`存档 ${slot} 已保存`);
      loadSlots();
    }
  };

  const handleLoad = async (slot) => {
    const data = localStorage.getItem(`save_${slot}`);
    if (!data) {
      setMsg('存档为空');
      return;
    }
    try {
      const parsed = JSON.parse(data);
      await actions.loadGame(parsed);
      setMsg('读档成功');
    } catch (e) {
      setMsg('读档失败: ' + e.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>存档 / 读档</div>

      {msg && (
        <div style={{
          padding: '6px 16px', marginBottom: 12,
          background: 'rgba(233,69,96,0.2)',
          borderRadius: 4, fontSize: 13, color: '#e0d5b7',
        }}>
          {msg}
        </div>
      )}

      <div style={styles.slotList}>
        {saves.map(s => (
          <div key={s.slot} style={styles.slot}>
            <div style={styles.slotInfo}>
              <div style={styles.slotName}>存档 {s.slot}</div>
              <div style={styles.slotDetail}>
                {s.hasData
                  ? `${s.year}年${s.month}月 · ${s.phase}`
                  : '空'}
              </div>
            </div>
            <button style={styles.saveBtn} onClick={() => handleSave(s.slot)}>
              保存
            </button>
            {s.hasData && (
              <button
                style={{ ...styles.saveBtn, background: '#0f3460', marginLeft: 6 }}
                onClick={() => handleLoad(s.slot)}
              >
                读取
              </button>
            )}
          </div>
        ))}
      </div>

      <button style={styles.backBtn} onClick={() => actions.setView('city')}>
        返回
      </button>
    </div>
  );
}
