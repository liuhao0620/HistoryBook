import { describe, it, expect, beforeEach } from 'vitest';
import { ConscriptionCommand, MoveCommand, TransportationCommand } from '../../../src/core/commands/MilitaryCommands';
import { useGameStore } from '../../../src/core/state/useGameStore';
import { resolveOrders } from '../../../src/core/commands/OrderResolver';

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
        it('should execute successfully and cost money based on devotion, and increase mothballArms immediately', () => {
            const command = new ConscriptionCommand(1, 1, 500);
            const result = command.execute();

            expect(result.success).toBe(true);

            const state = useGameStore.getState();
            // Devotion is 50, arms to conscript is min(50*10=500, money*2=2000) = 500
            // Cost is 500 / 2 = 250
            expect(state.cities[1].money).toBe(750);
            expect(state.cities[1].mothballArms).toBe(1500); // Effect is immediate
            expect(state.persons[1].thew).toBe(96);
            expect(state.orderQueue).toHaveLength(1);
            expect(state.orderQueue[0].type).toBe('CONSCRIPTION');
            expect(state.orderQueue[0].data.arms).toBe(500);
            expect(state.orderQueue[0].data.costMoney).toBe(250);
        });

        it('should resolve and only add report', () => {
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
            expect(state.cities[1].mothballArms).toBe(1000); // resolve should not increase arms again
            expect(state.reportQueue).toHaveLength(1);
        });
    });

    describe('Move and Transport Cross-City Delayed Resolution', () => {
        it('should simulate MoveCommand and resolve it next month', async () => {
            const command = new MoveCommand(1, 2, [1], 1);
            
            // 1. Execute command
            const result = command.execute();
            expect(result.success).toBe(true);
            
            // 武将应该立即离开原城池（处于在途状态）
            let state = useGameStore.getState();
            expect(state.persons[1].city).toBeUndefined();
            expect(state.orderQueue).toHaveLength(1);
            expect(state.orderQueue[0].type).toBe('MOVE');

            // 2. Simulate next turn (automatically resolves orders and decreases monthsLeft)
            // It will also increment the month, but that's fine.
            await useGameStore.getState().nextTurn();

            // 3. Process delayed tasks (beginning of next month)
            useGameStore.getState().processDelayedTasks();
            state = useGameStore.getState();

            // 武将应当已经到达目标城池
            expect(state.persons[1].city).toBe(2);
            // 延迟任务被清理
            expect(state.delayedTasks).toHaveLength(0);
            // 收到报告
            expect(state.reportQueue.some(r => r.msg.includes('抵达 TargetCity'))).toBe(true);
        });

        it('should simulate TransportationCommand and resolve it next month', async () => {
            const command = new TransportationCommand(1, 2, 1, 1, 100, 200, 300);
            
            // 1. Execute command
            const result = command.execute();
            expect(result.success).toBe(true);

            // 资源立即扣除，武将立即离开原城池
            let state = useGameStore.getState();
            expect(state.cities[1].money).toBe(900);
            expect(state.cities[1].food).toBe(800);
            expect(state.cities[1].mothballArms).toBe(700);
            expect(state.persons[1].city).toBeUndefined();

            // 2. Simulate next turn
            await useGameStore.getState().nextTurn();

            // 3. Process delayed tasks
            useGameStore.getState().processDelayedTasks();
            state = useGameStore.getState();

            // 目标城池资源增加 (初始 1000 + 收税 250 = 1250) + 100 = 1350 
            // Wait, nextTurn() will trigger spring tax in month 1.
            // Let's just assert the difference or the exact expected value based on nextTurn logic.
            // In setup, month is 1. nextTurn makes it month 2. No tax in month 2! 
            // Wait, setup sets month = 1, year = 184 by default in store, but the test didn't mock month. 
            // Let's check exactly what money is after nextTurn.
            expect(state.cities[2].money).toBe(1100); // 1000 + 100
            expect(state.cities[2].food).toBe(1200); // 1000 + 200
            expect(state.cities[2].mothballArms).toBe(1300); // 1000 + 300

            // 押送武将返回原城池
            expect(state.persons[1].city).toBe(1);

            // 延迟任务被清理
            expect(state.delayedTasks).toHaveLength(0);
            // 收到报告
            expect(state.reportQueue.some(r => r.msg.includes('送达金钱 100，粮草 200，兵力 300'))).toBe(true);
        });
    });
});
