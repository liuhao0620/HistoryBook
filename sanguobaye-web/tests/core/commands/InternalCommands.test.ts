import { describe, it, expect, beforeEach } from 'vitest';
import { AssartCommand, SearchCommand } from '../../../src/core/commands/InternalCommands';
import { useGameStore } from '../../../src/core/state/useGameStore';

describe('InternalCommands', () => {
    beforeEach(() => {
        // Reset the store to a clean state before each test
        useGameStore.setState({
            playerForceId: 1,
            cities: {
                1: {
                    id: 1,
                    name: 'TestCity',
                    belong: 1,
                    satrapId: 1,
                    state: 0,
                    farming: 50,
                    farmingLimit: 100,
                    commerce: 50,
                    commerceLimit: 100,
                    peopleDevotion: 50,
                    avoidCalamity: 50,
                    population: 10000,
                    populationLimit: 50000,
                    money: 1000,
                    food: 1000,
                    mothballArms: 1000,
                    personQueue: [],
                    toolQueue: []
                }
            },
            persons: {
                1: {
                    id: 1,
                    name: 'TestPerson',
                    belong: 1,
                    oldBelong: 1,
                    force: 80,
                    iq: 80,
                    thew: 100,
                    devotion: 100,
                    experience: 0,
                    level: 1,
                    age: 20,
                    armsType: 0,
                    arms: 1000,
                    equip: [],
                    character: 0,
                    city: 1,
                    acted: false
                }
            },
            forces: {
                1: {
                    id: 1,
                    kingId: 1,
                    character: 0,
                    color: '#ff0000'
                }
            },
            orderQueue: [],
            reportQueue: []
        });
    });

    describe('AssartCommand', () => {
        it('should execute successfully if city has enough money and person has enough thew', () => {
            const command = new AssartCommand(1, 1);
            const result = command.execute();

            expect(result.success).toBe(true);
            expect(result.message).toBe('孤亲自去办。');

            const state = useGameStore.getState();
            // City money should decrease by 50
            expect(state.cities[1].money).toBe(950);
            // Person thew should decrease by 4
            expect(state.persons[1].thew).toBe(96);
            // Order should be added to queue
            expect(state.orderQueue).toHaveLength(1);
            expect(state.orderQueue[0].type).toBe('ASSART');
        });

        it('should fail if city farming is at or above limit', () => {
            useGameStore.setState(state => ({
                cities: {
                    ...state.cities,
                    1: { ...state.cities[1], farming: 100, farmingLimit: 100 }
                }
            }));

            const command = new AssartCommand(1, 1);
            const result = command.execute();

            expect(result.success).toBe(false);
            expect(result.message).toContain('本地农业已极其繁荣');
        });

        it('should fail if city money is insufficient', () => {
            useGameStore.setState(state => ({
                cities: {
                    ...state.cities,
                    1: { ...state.cities[1], money: 40 } // Need 50
                }
            }));

            const command = new AssartCommand(1, 1);
            const result = command.execute();

            expect(result.success).toBe(false);
            expect(result.message).toContain('府库空虚');
        });

        it('should fail if person thew is insufficient', () => {
            useGameStore.setState(state => ({
                persons: {
                    ...state.persons,
                    1: { ...state.persons[1], thew: 3 } // Need 4
                }
            }));

            const command = new AssartCommand(1, 1);
            const result = command.execute();

            expect(result.success).toBe(false);
            expect(result.message).toContain('体力不支');
        });

        it('should resolve and increase farming', () => {
            // Setup an order in the queue manually
            const order = { id: 'order-1', type: 'ASSART', forceId: 1, cityId: 1, personId: 1 };
            AssartCommand.resolve(order);

            const state = useGameStore.getState();
            // Initial farming was 50, should have increased
            expect(state.cities[1].farming).toBeGreaterThan(50);
            // A report should be added
            expect(state.reportQueue).toHaveLength(1);
        });
    });

    describe('SearchCommand', () => {
        it('should execute successfully with enough money and thew', () => {
            const command = new SearchCommand(1, 1);
            const result = command.execute();

            expect(result.success).toBe(true);

            const state = useGameStore.getState();
            // City money should decrease by 10
            expect(state.cities[1].money).toBe(990);
            // Person thew should decrease by 4
            expect(state.persons[1].thew).toBe(96);
            expect(state.orderQueue).toHaveLength(1);
            expect(state.orderQueue[0].type).toBe('SEARCH');
        });
    });
});
