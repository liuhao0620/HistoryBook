import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../../../src/core/state/useGameStore';

describe('Resolution State', () => {
    beforeEach(() => {
        useGameStore.setState({ resolution: { width: 1920, height: 1080 } });
    });

    it('has default resolution', () => {
        const state = useGameStore.getState();
        expect(state.resolution).toEqual({ width: 1920, height: 1080 });
    });

    it('can update resolution', () => {
        useGameStore.getState().setResolution({ width: 1080, height: 720 });
        expect(useGameStore.getState().resolution).toEqual({ width: 1080, height: 720 });
    });
});
