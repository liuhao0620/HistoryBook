import React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './index.css';

interface GamePanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: ReactNode;
}

export const GamePanel: React.FC<GamePanelProps> = ({ 
    children, 
    title, 
    className = '', 
    ...props 
}) => {
    return (
        <div className={`game-panel ${className}`.trim()} {...props}>
            {title && <h3 className="game-panel-title">{title}</h3>}
            {children}
        </div>
    );
};
