import React from 'react';
import { useGameStore } from '../../core/state/useGameStore';

export const LogPanel: React.FC = () => {
    const logs = useGameStore(state => state.logs);

    return (
        <div style={{ 
            height: '150px', 
            overflowY: 'auto', 
            backgroundColor: '#3e2723', 
            color: '#a1887f', 
            padding: '10px',
            fontFamily: 'monospace',
            borderTop: '2px solid #8d6e63'
        }}>
            {logs.map((log, i) => (
                <div key={i}>{log}</div>
            ))}
        </div>
    );
};
