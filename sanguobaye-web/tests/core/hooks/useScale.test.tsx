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

const setViewportSize = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
};

describe('useScale', () => {
    afterEach(() => {
        cleanup();
    });

    it('returns 1 when viewport matches resolution', () => {
        setViewportSize(1920, 1080);
        useGameStore.setState({ resolution: { width: 1920, height: 1080 } });
        render(<TestComponent />);
        expect(screen.getByTestId('scale-value').textContent).toBe('1');
    });

    it('uses the smaller width or height scale to avoid cropping', () => {
        setViewportSize(1280, 720);
        useGameStore.setState({ resolution: { width: 1920, height: 1080 } });
        render(<TestComponent />);
        expect(screen.getByTestId('scale-value').textContent).toBe(`${2 / 3}`);
    });
});
