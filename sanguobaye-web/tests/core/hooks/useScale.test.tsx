/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { useScale } from '../../../src/core/hooks/useScale';
import { useGameStore } from '../../../src/core/state/useGameStore';

const TestComponent = () => {
    const scale = useScale();
    return <div data-testid="scale-value">{scale}</div>;
};

describe('useScale', () => {
    afterEach(() => {
        cleanup();
    });

    it('returns 1 for 1920 width', () => {
        useGameStore.setState({ resolution: { width: 1920, height: 1080 } });
        render(<TestComponent />);
        expect(screen.getByTestId('scale-value').textContent).toBe('1');
    });

    it('returns 0.5625 for 1080 width', () => {
        useGameStore.setState({ resolution: { width: 1080, height: 720 } });
        render(<TestComponent />);
        expect(screen.getByTestId('scale-value').textContent).toBe('0.5625');
    });
});
