import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { TerrainType, ArmsType, BattleUnitState } from '../../../src/core/battle/BattleTypes';
import { BattleScreen } from '../../../src/view/screens/BattleScreen';

const mockStore = {
    map: {
        width: 2,
        height: 2,
        tiles: [
            [TerrainType.PLAIN, TerrainType.RIVER],
            [TerrainType.FOREST, TerrainType.CITY],
        ],
    },
    units: {
        u1: {
            id: 'u1',
            personId: 1,
            name: '关羽',
            forceId: 1,
            isAttacker: true,
            armsType: ArmsType.INFANTRY,
            armsCount: 500,
            maxArms: 500,
            force: 95,
            iq: 75,
            level: 1,
            x: 0,
            y: 0,
            hp: 100,
            maxHp: 100,
            mp: 10,
            maxMp: 10,
            moveRange: 4,
            attack: 80,
            defense: 60,
            state: BattleUnitState.NORMAL,
            hasActed: false,
            color: '#a33',
        },
    },
    day: 3,
    activeUnitId: null,
    reachableTiles: [],
    attackableTiles: [],
    isAiThinking: false,
    isAttackerTurn: true,
    attackerFood: 234,
    defenderFood: 100,
    checkWinCondition: vi.fn(() => null),
    endBattle: vi.fn(),
    selectUnit: vi.fn(),
    moveUnit: vi.fn(),
    attack: vi.fn(),
    useSkill: vi.fn(),
    rest: vi.fn(),
    endTurn: vi.fn(),
};

vi.mock('../../../src/core/battle/useBattleStore', () => ({
    useBattleStore: () => mockStore,
}));

describe('BattleScreen ancient theme', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders the ancient map frame, panel, and north compass', () => {
        render(<BattleScreen />);

        expect(screen.getByTestId('ancient-battle-frame')).toBeInTheDocument();
        expect(screen.getByTestId('ancient-battle-panel')).toBeInTheDocument();
        expect(screen.getByTestId('ancient-compass-north')).toBeInTheDocument();
    });

    it('aligns water texture by map coordinates instead of restarting it on each tile', () => {
        render(<BattleScreen />);

        expect(screen.getByTestId('battle-terrain-tile-1-0')).toHaveStyle({
            backgroundPosition: '-80px 0px',
        });
    });
});
