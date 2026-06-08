import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useBattleStore } from '../useBattleStore';
import { useGameStore } from '../../state/useGameStore';
import { TerrainType, ArmsType, BattleUnitState } from '../BattleTypes';

describe('useBattleStore', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useGameStore.setState({
            playerForceId: 1, // Player is force 1
        });
        useBattleStore.setState({
            isAiThinking: false,
            isAttackerTurn: false,
            attackerForceId: 1, // Attacker is player
            defenderForceId: 2, // Defender is AI
            map: {
                width: 5,
                height: 5,
                tiles: [
                    [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                    [TerrainType.PLAIN, TerrainType.CITY, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                    [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                    [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                    [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN]
                ]
            },
            units: {
                'A_1': {
                    id: 'A_1',
                    personId: 1,
                    name: 'Attacker',
                    forceId: 1,
                    isAttacker: true,
                    armsType: ArmsType.INFANTRY,
                    armsCount: 1000,
                    maxArms: 1000,
                    force: 80,
                    iq: 80,
                    level: 1,
                    x: 4,
                    y: 4,
                    hp: 100,
                    maxHp: 100,
                    mp: 100,
                    maxMp: 100,
                    moveRange: 4,
                    attack: 100,
                    defense: 100,
                    state: BattleUnitState.NORMAL,
                    hasActed: false,
                    color: '#ff0000'
                },
                'D_2': {
                    id: 'D_2',
                    personId: 2,
                    name: 'Defender',
                    forceId: 2,
                    isAttacker: false,
                    armsType: ArmsType.INFANTRY,
                    armsCount: 1000,
                    maxArms: 1000,
                    force: 80,
                    iq: 80,
                    level: 1,
                    x: 1,
                    y: 1, // Standing on CITY (1, 1)
                    hp: 100,
                    maxHp: 100,
                    mp: 100,
                    maxMp: 100,
                    moveRange: 4,
                    attack: 100,
                    defense: 100,
                    state: BattleUnitState.NORMAL,
                    hasActed: false,
                    color: '#0000ff'
                }
            },
            reachableTiles: [],
            attackableTiles: []
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('runAiTurn', () => {
        it('defender unit on CITY should skip movement', async () => {
            const store = useBattleStore.getState();
            
            // Mock endTurn to prevent it from looping or doing extra things
            const endTurnSpy = vi.spyOn(store, 'endTurn').mockImplementation(() => {});

            // Run AI turn
            const runPromise = store.runAiTurn();
            
            // Advance timers to trigger all the setTimeouts in runAiTurn
            await vi.runAllTimersAsync();
            await runPromise;

            // Get updated state
            const updatedStore = useBattleStore.getState();
            const defenderUnit = updatedStore.units['D_2'];

            // The unit should still be at (1, 1) and not moved towards the attacker at (4, 4)
            expect(defenderUnit.x).toBe(1);
            expect(defenderUnit.y).toBe(1);
            
            endTurnSpy.mockRestore();
        });

        it('land units can enter river if they have enough movement points', async () => {
            const store = useBattleStore.getState();
            
            // Set up map with river
            useBattleStore.setState({
                isAttackerTurn: true,
                map: {
                    ...store.map,
                    tiles: [
                        [TerrainType.PLAIN, TerrainType.RIVER, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                        [TerrainType.PLAIN, TerrainType.RIVER, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                        [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                        [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                        [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN]
                    ]
                }
            });
            
            // Select attacker unit
            useBattleStore.getState().selectUnit('A_1');
            
            // Move Attacker to (0, 0)
            useBattleStore.setState(state => {
                const newUnits = { ...state.units };
                newUnits['A_1'] = {
                    ...newUnits['A_1'],
                    x: 0,
                    y: 0,
                    hasActed: false,
                    armsType: ArmsType.CAVALRY,
                    moveRange: 5
                };
                return { ...state, units: newUnits };
            });
            
            // Calculate reachable tiles
            useBattleStore.getState().selectUnit('A_1');
            
            const reachableTiles = useBattleStore.getState().reachableTiles;
            
            // Should be able to reach river at (1, 0) because cost is 3 <= 5
            const canReachRiver = reachableTiles.some(t => t.x === 1 && t.y === 0);
            expect(canReachRiver).toBe(true);
        });
    });
});
