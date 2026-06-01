import React, { useEffect } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './index.css';

interface GameModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    children: ReactNode;
}

export const GameModal: React.FC<GameModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    className = '', 
    ...props 
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="game-modal-overlay" onClick={onClose}>
            <div 
                className={`game-modal-content ${className}`.trim()} 
                onClick={(e) => e.stopPropagation()}
                {...props}
            >
                {onClose && (
                    <button className="game-modal-close" onClick={onClose}>
                        &times;
                    </button>
                )}
                {title && <h3 className="game-panel-title" style={{ marginTop: 0, paddingRight: '20px' }}>{title}</h3>}
                <div className="game-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};
