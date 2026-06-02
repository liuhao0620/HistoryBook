import { describe, it, expect, beforeEach } from 'vitest';
import { ConscriptionCommand, MoveCommand } from '../../../src/core/commands/MilitaryCommands';
import { useGameStore } from '../../../src/core/state/useGameStore';

describe('MilitaryCommands', () => {
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
                },
                2: {
                    id: 2,
                    name: 'TargetCity',
                    belong: 2,
                    satrapId: 2,
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
            reportQueue: [],
            delayedTasks: []
        });
    });

    describe('ConscriptionCommand', () => {
        it('should execute successfully and cost money based on devotion', () => {
            const command = new ConscriptionCommand(1, 1);
            const result = command.execute();

            expect(result.success).toBe(true);

            const state = useGameStore.getState();
            // Devotion is 50, arms to conscript is min(50*10=500, money*2=2000) = 500
            // Cost is 500 / 2 = 250
            expect(state.cities[1].money).toBe(750);
            expect(state.persons[1].thew).toBe(96);
            expect(state.orderQueue).toHaveLength(1);
            expect(state.orderQueue[0].type).toBe('CONSCRIPTION');
            expect(state.orderQueue[0].data.arms).toBe(500);
            expect(state.orderQueue[0].data.costMoney).toBe(250);
        });

        it('should resolve and increase mothballArms', () => {
            const order = { 
                id: 'order-1', 
                type: 'CONSCRIPTION', 
                forceId: 1, 
                cityId: 1, 
                personId: 1, 
                data: { arms: 500, costMoney: 250 } 
            };
            ConscriptionCommand.resolve(order);

            const state = useGameStore.getState();
            expect(state.cities[1].mothballArms).toBe(1500);
            expect(state.reportQueue).toHaveLength(1);
        });
    });

    describe('MoveCommand', () => {
        it('should execute successfully and add to orderQueue', () => {
            const command = new MoveCommand(1, 2, [1], 1);
            const result = command.execute();

            expect(result.success).toBe(true);
            const state = useGameStore.getState();
            expect(state.orderQueue).toHaveLength(1);
            expect(state.orderQueue[0].type).toBe('MOVE');
            expect(state.orderQueue[0].data.toCityId).toBe(2);
        });

        it('should resolve and add to delayed tasks', () => {
            const order = { 
                id: 'order-1', 
                type: 'MOVE', 
                forceId: 1, 
                cityId: 1, 
                personId: 1, 
                data: { toCityId: 2, personIds: [1] } 
            };
            MoveCommand.resolve(order);

            const state = useGameStore.getState();
            expect(state.delayedTasks).toHaveLength(1);
            expect(state.delayedTasks[0].type).toBe('MOVE');
            expect(state.delayedTasks[0].monthsLeft).toBe(2);
        });
    });
});
