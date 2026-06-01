import React from 'react';
import { useGameStore } from '../../core/state/useGameStore';

export const TopBar: React.FC = () => {
    const { year, month, playerForceId, forces, nextTurn } = useGameStore();

    const force = forces[playerForceId];

    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 20px', backgroundColor: '#3e2723', color: '#f5f5dc',
            borderBottom: '2px solid #8d6e63', fontFamily: 'serif'
        }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                《三国霸业》复刻版
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <span>君主: {force ? '势力ID ' + force.id : '无'}</span>
                <span>时间: {year} 年 {month} 月</span>
                <button 
                    onClick={nextTurn}
                    style={{
                        padding: '5px 15px', backgroundColor: '#5d4037', color: 'white',
                        border: '1px solid #d7ccc8', cursor: 'pointer', borderRadius: '4px'
                    }}>
                    结束回合 (下个月)
                </button>
            </div>
        </div>
    );
};
