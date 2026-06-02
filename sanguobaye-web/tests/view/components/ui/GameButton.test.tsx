import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GameButton } from '../../../../src/view/components/ui/GameButton';
import '@testing-library/jest-dom/vitest';

describe('GameButton', () => {
    it('should render children correctly', () => {
        render(<GameButton>Click Me</GameButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should apply primary variant by default', () => {
        const { container } = render(<GameButton>Primary</GameButton>);
        const button = container.firstChild as HTMLElement;
        expect(button).toHaveClass('game-button');
        // 'game-button-primary' class is not explicitly added in component, 
        // it just relies on the base 'game-button' class.
    });

    it('should apply variant class when provided', () => {
        const { container } = render(<GameButton variant="danger">Danger</GameButton>);
        const button = container.firstChild as HTMLElement;
        expect(button).toHaveClass('game-button');
        expect(button).toHaveClass('game-button-danger');
    });

    it('should append custom className', () => {
        const { container } = render(<GameButton className="custom-class">Custom</GameButton>);
        const button = container.firstChild as HTMLElement;
        expect(button).toHaveClass('game-button');
        expect(button).toHaveClass('custom-class');
    });

    it('should handle click events', () => {
        const handleClick = vi.fn();
        render(<GameButton onClick={handleClick}>Clickable</GameButton>);
        
        fireEvent.click(screen.getByText('Clickable'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is passed', () => {
        render(<GameButton disabled>Disabled</GameButton>);
        const button = screen.getByText('Disabled');
        expect(button).toBeDisabled();
    });
});
