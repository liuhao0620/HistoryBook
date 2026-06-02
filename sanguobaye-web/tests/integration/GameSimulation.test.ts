import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { useGameStore } from '../../src/core/state/useGameStore';

describe('Game Integration', () => {
    it('should simulate 50 turns without crashing', async () => {
        // 1. Load real JSON data
        const scenarioDir = path.join(process.cwd(), 'public/config/scenarios/190_0');
        const goodsFile = path.join(process.cwd(), 'public/config/goods.json');

        const cities = JSON.parse(fs.readFileSync(path.join(scenarioDir, 'cities.json'), 'utf-8'));
        const generals = JSON.parse(fs.readFileSync(path.join(scenarioDir, 'persons.json'), 'utf-8'));
        const forces = JSON.parse(fs.readFileSync(path.join(scenarioDir, 'forces.json'), 'utf-8'));
        const queues = JSON.parse(fs.readFileSync(path.join(scenarioDir, 'queues.json'), 'utf-8'));
        const goodsArray = JSON.parse(fs.readFileSync(goodsFile, 'utf-8'));

        const goodsMap: Record<number, any> = {};
        goodsArray.forEach((g: any) => { goodsMap[g.id] = g; });

        const scenario = {
            id: '190_0',
            name: '反董卓联盟',
            yearDate: 190,
            cities,
            generals,
            forces,
            genQueue: queues.genQueue,
            goodsQueue: queues.goodsQueue
        };

        // 2. Initialize store with scenario
        useGameStore.setState({ selectedScenario: scenario, goods: goodsMap });
        useGameStore.getState().loadScenarioAndStart(1); // Play as force 1

        // 3. Spy on console.error to catch silent failures caught by try-catch
        let errorCaught = false;
        let errorMessage = '';
        const originalConsoleError = console.error;
        const originalSetTimeout = global.setTimeout;
        
        console.error = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('Failed to resolve order:')) {
                errorCaught = true;
                errorMessage = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
            }
            // originalConsoleError(...args); // Keep silent to keep test output clean
        };

        // Mock setTimeout to bypass the 500ms AI thinking delay
        global.setTimeout = ((cb: Function) => cb()) as any;

        try {
            // 4. Run 50 turns instantly
            for (let turn = 1; turn <= 50; turn++) {
                await useGameStore.getState().nextTurn();
                
                // Fail immediately if the internal try-catch caught something
                if (errorCaught) {
                    throw new Error(`Order resolution failed during turn ${turn}: ${errorMessage}`);
                }
            }
        } finally {
            // Restore console.error and setTimeout
            console.error = originalConsoleError;
            global.setTimeout = originalSetTimeout;
        }

        // 5. Final assertions
        expect(errorCaught).toBe(false);
        const state = useGameStore.getState();
        // 50 turns = 4 years and 2 months. 190-01 + 50 months -> 194-03
        expect(state.year).toBeGreaterThanOrEqual(194);
    }, 15000); // 15 seconds is plenty when delays are mocked
});