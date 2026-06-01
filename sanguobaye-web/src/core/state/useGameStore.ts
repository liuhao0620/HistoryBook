import { create } from 'zustand';
import { produce } from 'immer';
import type { City } from '../models/City';
import type { Person } from '../models/Person';
import type { Force } from '../models/Force';

export type ScreenType = 'MAIN_MENU' | 'SELECT_SCENARIO' | 'SELECT_FORCE' | 'GAME' | 'MAP_EDITOR' | 'BATTLE';

export interface Order {
    id: string;
    type: string;
    forceId: number;
    personId?: number;
    cityId?: number;
    targetId?: number;
    data?: any;
}

export interface Report {
    id: string;
    forceId: number;
    msg: string;
    avatarId?: number;
}

export interface DelayedTask {
    id: string;
    type: 'TRANSPORT' | 'MOVE' | 'DIPLOMACY' | 'RECONNOITRE' | 'ATTACK';
    monthsLeft: number;
    data: any;
    forceId: number;
}

const FORCE_COLORS = [
    '#e53935', '#1e88e5', '#43a047', '#fdd835', '#8e24aa',
    '#00acc1', '#3949ab', '#039be5', '#00897b', '#7cb342',
    '#c0ca33', '#fbc02d', '#ffb300', '#fb8c00', '#f4511e',
    '#6d4c41', '#757575', '#546e7a'
];
const getForceColor = (belongId: number) => FORCE_COLORS[belongId % FORCE_COLORS.length];

export interface GameState {
    currentScreen: ScreenType;
    availableScenarios: any[];
    selectedScenario: any | null;
    
    year: number;
    month: number;
    cities: Record<number, City>;
    persons: Record<number, Person>;
    forces: Record<number, Force>;
    goods: Record<number, any>;
    playerForceId: number; // 当前玩家控制的势力
    selectedCityId: number | null;
    logs: string[]; // 游戏日志
    delayedTasks: DelayedTask[]; // 延迟任务队列
    orderQueue: Order[];
    reportQueue: Report[];
    aiThinkingForceId: number | null;

    // Actions
    setScreen: (screen: ScreenType) => void;
    setAvailableScenarios: (scenarios: any[]) => void;
    selectScenario: (scenario: any) => void;
    loadScenarioAndStart: (forceId: number) => void;
    nextTurn: () => Promise<void>;
    addOrder: (order: Omit<Order, 'id'>) => void;
    addReport: (report: Omit<Report, 'id'>) => void;
    clearReports: () => void;
    addDelayedTask: (task: Omit<DelayedTask, 'id'>) => void;
    processDelayedTasks: () => void;
    selectCity: (cityId: number | null) => void;
    addLog: (msg: string) => void;
    updateCity: (cityId: number, updater: (city: City) => void) => void;
    updatePerson: (personId: number, updater: (person: Person) => void) => void;
    saveGame: (slotId: number) => void;
    loadGame: (slotId: number) => boolean;
}

export const getSaveSlotsInfo = () => {
    return [1, 2, 3].map(slot => {
        const data = localStorage.getItem(`sanguobaye_save_${slot}`);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                return { 
                    slot, 
                    empty: false, 
                    year: parsed.year, 
                    month: parsed.month, 
                    forceName: parsed.forceName || '未知',
                    timestamp: parsed.timestamp 
                };
            } catch (e) {
                return { slot, empty: true };
            }
        }
        return { slot, empty: true };
    });
};

export const useGameStore = create<GameState>((set) => ({
    currentScreen: 'MAIN_MENU',
    availableScenarios: [],
    selectedScenario: null,

    year: 184,
    month: 1,
    cities: {},
    persons: {},
    forces: {},
    goods: {},
    playerForceId: 1,
    selectedCityId: null,
    logs: [],
    delayedTasks: [],
    orderQueue: [],
    reportQueue: [],
    aiThinkingForceId: null,

    setScreen: (screen) => set({ currentScreen: screen }),
    
    setAvailableScenarios: (scenarios) => set({ availableScenarios: scenarios }),
    
    selectScenario: async (scenario) => {
        try {
            const dir = scenario.id;
            const [cities, generals, forces, queues, goodsArray] = await Promise.all([
                fetch(`/config/scenarios/${dir}/cities.json`).then(r => r.json()),
                fetch(`/config/scenarios/${dir}/persons.json`).then(r => r.json()),
                fetch(`/config/scenarios/${dir}/forces.json`).then(r => r.json()),
                fetch(`/config/scenarios/${dir}/queues.json`).then(r => r.json()),
                fetch(`/config/goods.json`).then(r => r.json()).catch(() => [])
            ]);
            
            const goodsMap: Record<number, any> = {};
            goodsArray.forEach((g: any) => { goodsMap[g.id] = g; });

            const fullScenario = {
                ...scenario,
                cities,
                generals,
                forces,
                genQueue: queues.genQueue,
                goodsQueue: queues.goodsQueue
            };
            
            set({ selectedScenario: fullScenario, goods: goodsMap, currentScreen: 'SELECT_FORCE' });
        } catch (e) {
            console.error('Failed to load scenario details', e);
        }
    },

    loadScenarioAndStart: (forceId) => set(produce((state: GameState) => {
        const data = state.selectedScenario;
        if (!data) return;

        state.year = data.startYear || data.yearDate;
        state.month = data.startMonth || 1;
        
        state.cities = {};
        state.persons = {};
        state.forces = {};
        
        data.generals.forEach((p: any) => { 
            state.persons[p.id] = { 
                ...p, 
                thew: 100, 
                equip: [p.equip0, p.equip1].filter(e => e !== undefined && e > 0).map(e => e - 1),
                acted: false 
            }; 
        });
        
        data.cities.forEach((c: any) => { 
            state.cities[c.id] = { ...c, peopleDevotion: c.peopleDevotion !== undefined ? c.peopleDevotion : (c.devotion || 50) }; 
            for (let i = 0; i < c.persons; i++) {
                const personId = data.genQueue[c.personQueue + i];
                if (state.persons[personId]) {
                    state.persons[personId].city = c.id;
                }
            }
        });
        
        // 动态生成势力列表 (根据剧本配置或城池归属)
        if (data.forces && data.forces.length > 0) {
            data.forces.forEach((f: any) => {
                state.forces[f.id] = {
                    id: f.id,
                    kingId: f.kingId,
                    character: f.character || 0,
                    color: f.color || getForceColor(f.id)
                };
            });
        } else {
            const forcesMap: Record<number, Force> = {};
            data.cities.forEach((c: City) => {
                if (c.belong > 0 && c.belong !== 255) {
                    if (!forcesMap[c.belong]) {
                        const king = state.persons[c.belong - 1];
                        forcesMap[c.belong] = {
                            id: c.belong,
                            kingId: c.belong - 1, 
                            character: king?.character || 0,
                            color: getForceColor(c.belong)
                        };
                    }
                }
            });
            Object.values(forcesMap).forEach((f: Force) => { state.forces[f.id] = f; });
        }
        
        // 根据原版游戏逻辑动态计算太守
        Object.values(state.cities).forEach(city => {
            if (city.belong > 0 && city.belong !== 255) {
                const force = state.forces[city.belong];
                if (force) {
                    let sp = 0;
                    const personsInCity = Object.values(state.persons).filter(p => p.city === city.id && p.belong === city.belong);
                    if (personsInCity.length > 0) {
                        const king = personsInCity.find(p => p.id === force.kingId);
                        if (king) {
                            sp = king.id + 1;
                        } else {
                            let highestIq = -1;
                            for (const p of personsInCity) {
                                if (sp === 0) {
                                    sp = p.id + 1;
                                    highestIq = p.iq;
                                } else if (p.iq > highestIq) {
                                    sp = p.id + 1;
                                    highestIq = p.iq;
                                }
                            }
                        }
                    }
                    city.satrapId = sp;
                } else {
                    city.satrapId = 0;
                }
            } else {
                city.satrapId = 0;
            }
        });

        state.playerForceId = forceId;
        state.selectedCityId = data.cities[0].id;
        state.delayedTasks = [];
        state.logs = [`【系统】载入剧本：${data.name}，您选择了势力君主 ${state.persons[state.forces[forceId]?.kingId]?.name || forceId}`];
        state.currentScreen = 'GAME';
    })),

    nextTurn: async () => {
        // Here we do async state updates
        const store = useGameStore.getState();
        const forces = Object.values(store.forces);
        
        for (const force of forces) {
            if (force.id === store.playerForceId) continue;
            
            useGameStore.setState({ aiThinkingForceId: force.id });
            // Simulate AI thinking time
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Generate AI orders
            const { AIEngine } = await import('../ai/AIEngine');
            AIEngine.generateOrdersForForce(force.id);
        }
        
        useGameStore.setState({ aiThinkingForceId: null });

        // Now process all orders in the queue
        // Because of circular dependency if we import commands here, we will just call an external resolver,
        // or we just emit an event?
        // Wait, instead of importing OrderResolver here, we can expose a function or we just resolve it in the UI layer.
        // Actually, we can import OrderResolver in useGameStore if we are careful about circular dependency.
        // Wait, `useGameStore` is imported by commands, so `OrderResolver` importing commands might cause a circular dependency.
        // Let's create an `OrderResolver` that takes `store` as argument, and doesn't import `useGameStore`.
        // That avoids circular dependency!
        
        // So we can import OrderResolver here:
        // const { resolveOrders } = await import('../commands/OrderResolver');
        // resolveOrders(useGameStore.getState(), useGameStore.setState);
        
        const { resolveOrders } = await import('../commands/OrderResolver');
        resolveOrders();
        
        set(produce((state: GameState) => {
            // 先处理本月到期的延迟任务
            state.delayedTasks.forEach(task => {
                task.monthsLeft -= 1;
            });
            // 注意：不要在这里过滤掉 monthsLeft <= 0 的任务，留给 GameScreen 处理后调用 processDelayedTasks 清理
            
            
            state.orderQueue = []; // 清空当月指令队列

            state.month += 1;
            if (state.month > 12) {
                state.month = 1;
                state.year += 1;
            }
            
            // 每月自动恢复武将体力并重置行动状态
            Object.values(state.persons).forEach(p => {
                if (p.thew < 100) {
                    p.thew = Math.min(100, p.thew + 10);
                }
                p.acted = false;
            });

            if (state.month === 7) {
                Object.values(state.cities).forEach(c => {
                    c.food += c.farming * 10;
                });
                state.logs.push(`【系统】秋季丰收，各城池获得粮食。`);
            }
            if (state.month === 1) {
                Object.values(state.cities).forEach(c => {
                    c.money += c.commerce * 5;
                });
                state.logs.push(`【系统】春季收税，各城池获得金钱。`);
            }

            // 每月重新计算各城池太守（原版游戏逻辑）
            Object.values(state.cities).forEach(city => {
                if (city.belong > 0 && city.belong !== 255) {
                    const force = state.forces[city.belong];
                    if (force) {
                        let sp = 0;
                        const personsInCity = Object.values(state.persons).filter(p => p.city === city.id && p.belong === city.belong);
                        if (personsInCity.length > 0) {
                            const king = personsInCity.find(p => p.id === force.kingId);
                            if (king) {
                                sp = king.id + 1;
                            } else {
                                let highestIq = -1;
                                for (const p of personsInCity) {
                                    if (sp === 0) {
                                        sp = p.id + 1;
                                        highestIq = p.iq;
                                    } else if (p.iq > highestIq) {
                                        sp = p.id + 1;
                                        highestIq = p.iq;
                                    }
                                }
                            }
                        }
                        city.satrapId = sp;
                    } else {
                        city.satrapId = 0;
                    }
                } else {
                    city.satrapId = 0;
                }
            });

            state.logs.push(`【系统】进入 ${state.year}年 ${state.month}月`);
        }));
    },

    addOrder: (order) => set(produce((state: GameState) => {
        state.orderQueue.push({
            ...order,
            id: Math.random().toString(36).substring(2, 9)
        });
    })),

    addReport: (report) => set(produce((state: GameState) => {
        state.reportQueue.push({
            ...report,
            id: Math.random().toString(36).substring(2, 9)
        });
        state.logs.unshift(report.msg);
        if (state.logs.length > 50) state.logs.pop();
    })),

    clearReports: () => set({ reportQueue: [] }),

    addDelayedTask: (task) => set(produce((state: GameState) => {
        state.delayedTasks.push({
            ...task,
            id: Math.random().toString(36).substring(2, 9)
        });
    })),

    processDelayedTasks: () => set(produce((state: GameState) => {
        // 清理掉已经完成的任务 (monthsLeft <= 0 的认为在外部已被处理并应该被移除)
        state.delayedTasks = state.delayedTasks.filter(t => t.monthsLeft > 0);
    })),

    selectCity: (cityId) => set({ selectedCityId: cityId }),
    
    addLog: (msg) => set(produce((state: GameState) => {
        state.logs.unshift(msg);
        if (state.logs.length > 50) state.logs.pop(); // 保留最近50条
    })),

    updateCity: (cityId, updater) => set(produce((state: GameState) => {
        if (state.cities[cityId]) updater(state.cities[cityId]);
    })),

    updatePerson: (personId, updater) => set(produce((state: GameState) => {
        if (state.persons[personId]) updater(state.persons[personId]);
    })),

    saveGame: (slotId) => {
        const state = useGameStore.getState();
        const kingName = state.persons[state.forces[state.playerForceId]?.kingId]?.name || '未知';
        const saveData = {
            timestamp: Date.now(),
            forceName: kingName,
            year: state.year,
            month: state.month,
            cities: state.cities,
            persons: state.persons,
            forces: state.forces,
            playerForceId: state.playerForceId,
            logs: state.logs,
            delayedTasks: state.delayedTasks,
            selectedScenario: state.selectedScenario
        };
        localStorage.setItem(`sanguobaye_save_${slotId}`, JSON.stringify(saveData));
        state.addLog(`【系统】游戏进度已成功储存至进度 ${slotId}。`);
    },

    loadGame: (slotId) => {
        const savedData = localStorage.getItem(`sanguobaye_save_${slotId}`);
        if (!savedData) return false;

        try {
            const data = JSON.parse(savedData);
            
            if (data.cities) {
                Object.values(data.cities).forEach((c: any) => {
                    if (c.peopleDevotion === undefined) {
                        c.peopleDevotion = c.devotion !== undefined ? c.devotion : 50;
                    }
                });
            }

            set({
                year: data.year,
                month: data.month,
                cities: data.cities,
                persons: data.persons,
                forces: data.forces,
                playerForceId: data.playerForceId,
                logs: data.logs,
                delayedTasks: data.delayedTasks || [],
                selectedScenario: data.selectedScenario,
                currentScreen: 'GAME',
                selectedCityId: null
            });
            useGameStore.getState().addLog(`【系统】进度 ${slotId} 已成功读取。`);
            return true;
        } catch (e) {
            console.error('Failed to parse save data', e);
            return false;
        }
    }
}));
