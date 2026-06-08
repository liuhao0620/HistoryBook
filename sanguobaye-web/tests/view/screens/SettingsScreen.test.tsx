/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SettingsScreen } from '../../../src/view/screens/SettingsScreen';
import { useGameStore } from '../../../src/core/state/useGameStore';

describe('SettingsScreen', () => {
    beforeEach(() => {
        useGameStore.setState({ resolution: { width: 1920, height: 1080 }, currentScreen: 'SETTINGS' });
    });

    afterEach(() => {
        cleanup();
    });

    it('renders resolution options and handles selection', () => {
        render(<SettingsScreen />);
        expect(screen.getByText('游戏设置')).toBeTruthy();
        
        const option1080 = screen.getByText('1080 x 720');
        fireEvent.click(option1080);
        
        expect(useGameStore.getState().resolution).toEqual({ width: 1080, height: 720 });
    });
    
    it('handles back button', () => {
        render(<SettingsScreen />);
        const backBtn = screen.getByText('返回');
        fireEvent.click(backBtn);
        expect(useGameStore.getState().currentScreen).toBe('MAIN_MENU');
    });
});
