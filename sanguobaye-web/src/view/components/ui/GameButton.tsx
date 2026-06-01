import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './index.css';

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export const GameButton: React.FC<GameButtonProps> = ({ 
    children, 
    className = '', 
    variant = 'primary', 
    ...props 
}) => {
    // You can extend styles based on variant if needed
    const variantClass = variant !== 'primary' ? `game-button-${variant}` : '';
    
    return (
        <button 
            className={`game-button ${variantClass} ${className}`.trim()} 
            {...props}
        >
            {children}
        </button>
    );
};
