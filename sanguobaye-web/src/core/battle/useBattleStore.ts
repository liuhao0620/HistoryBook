import { create } from 'zustand';
import { produce } from 'immer';
import type { BattleStateData, BattleUnit, BattleMap } from './BattleTypes';
import { Weather, TerrainType, ArmsType, BattleUnitState } from './BattleTypes';
import { useGameStore } from '../state/useGameStore';
import { C_MAP, CITY_MAP_W, dCityMapId } from '../constants/cityMap';
import { LandResistance, MOV_NOT } from './BattleConstants';
import { 
    calculateUnitInitStats, 
    calculatePhysicalDamage, 
    calculateSkillDamage, 
    calculateFoodConsumption, 
    calculateExperience 
} from './battleCalculations';

export interface BattleStore extends BattleStateData {
    initBattle: (attackerCityId: number, defenderCityId: number, attackerPersonIds: number[], defenderPersonIds: number[]) => Promise<void>;
    endTurn: () => void;
    selectUnit: (unitId: string | null) => void;
    moveUnit: (unitId: string, x: number, y: number) => void;
    attack: (attackerId: string, defenderId: string) => void;
    rest: (unitId: string) => void;
    useSkill: (attackerId: string, defenderId: string, skillId: number) => void;
    checkWinCondition: () => 'ATTACKER_WIN' | 'DEFENDER_WIN' | null;
    endBattle: (result: 'ATTACKER_WIN' | 'DEFENDER_WIN') => void;
    addBattleLog: (msg: string) => void;
    battleLogs: string[];
    runAiTurn: () => Promise<void>;
}

export const useBattleStore = create<BattleStore>((set, get) => ({
    map: { width: 15, height: 10, tiles: [] },
    units: {},
    day: 1,
    weather: Weather.SUNNY,
    
    attackerForceId: 0,
    defenderForceId: 0,
    attackerCityId: 0,
    defenderCityId: 0,
    
    attackerFood: 0,
    defenderFood: 0,

    activeUnitId: null,
    reachableTiles: [],
    attackableTiles: [],
    
    isAttackerTurn: true,
    isAiThinking: false,
    battleLogs: [],

    addBattleLog: (msg) => set(produce((state: BattleStore) => {
        state.battleLogs.unshift(msg);
        if (state.battleLogs.length > 50) state.battleLogs.pop();
    })),

    initBattle: async (attackerCityId, defenderCityId, attackerPersonIds, defenderPersonIds) => {
        const gameStore = useGameStore.getState();
        const aCity = gameStore.cities[attackerCityId];
        const dCity = gameStore.cities[defenderCityId];
        
        // 1. 获取两座城池在世界地图上的坐标，计算进攻方向
        const aIndex = C_MAP.indexOf(attackerCityId + 1);
        const dIndex = C_MAP.indexOf(defenderCityId + 1);
        const ax = aIndex % CITY_MAP_W;
        const ay = Math.floor(aIndex / CITY_MAP_W);
        const dx = dIndex % CITY_MAP_W;
        const dy = Math.floor(dIndex / CITY_MAP_W);
        
        // 方向：N=0, NE=1, E=2, SE=3, S=4, SW=5, W=6, NW=7
        let way = 0;
        if (ax === dx && ay < dy) way = 0; // N
        else if (ax > dx && ay < dy) way = 1; // NE
        else if (ax > dx && ay === dy) way = 2; // E
        else if (ax > dx && ay > dy) way = 3; // SE
        else if (ax === dx && ay > dy) way = 4; // S
        else if (ax < dx && ay > dy) way = 5; // SW
        else if (ax < dx && ay === dy) way = 6; // W
        else if (ax < dx && ay < dy) way = 7; // NW

        // 2. 加载战斗地图
        const mapId = dCityMapId[defenderCityId];
        let map: BattleMap = { width: 32, height: 32, tiles: [] };
        try {
            const res = await fetch(`/config/maps/map_${mapId}.json`);
            if (res.ok) {
                const mapData = await res.json();
                // 转换一维数组到二维数组
                for (let y = 0; y < mapData.height; y++) {
                    const row: TerrainType[] = [];
                    for (let x = 0; x < mapData.width; x++) {
                        row.push(mapData.tiles[y * mapData.width + x]);
                    }
                    map.tiles.push(row);
                }
                map.width = mapData.width;
                map.height = mapData.height;
            }
        } catch (e) {
            console.error('Failed to load map', e);
        }

        // 3. 找到城池(CITY)在战斗地图上的坐标
        let cx = map.width / 2;
        let cy = map.height / 2;
        outer: for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                if (map.tiles[y][x] === TerrainType.CITY) {
                    cx = x;
                    cy = y;
                    break outer;
                }
            }
        }
        
        // 4. 根据进攻方向确定攻方初始基准坐标 (sx, sy)
        let sx = map.width - 5;
        let sy = map.height - 5;
        switch (way) {
            case 0: // N
                sx = Math.floor(map.width / 2) - 2;
                sy = 0;
                break;
            case 1: // NE
                sy = 2;
                break;
            case 2: // E
                sy = Math.floor(map.height / 2) - 2;
                break;
            case 3: // SE
                break;
            case 4: // S
                sx = Math.floor(map.width / 2) - 2;
                break;
            case 5: // SW
                sx = 2;
                break;
            case 6: // W
                sx = 2;
                sy = Math.floor(map.height / 2) - 2;
                break;
            case 7: // NW
                sx = 2;
                sy = 2;
                break;
        }
        
        // 守方基准坐标在城池附近
        cx = cx - 2;
        cy = cy - 2;

// 5. 原版静态坐标偏移表 FGT_INT_POS (dFgtIntPos)
// 共9个方向（前8个为攻方8个方向，第9个为守方阵型），每个方向20字节(10个武将，每人x,y)
const FGT_INT_POS: number[][] = [
    [2,2, 2,3, 1,2, 3,2, 2,1, 0,4, 4,4, 1,1, 3,1, 2,0], // 0: N
    [2,2, 2,3, 1,2, 3,2, 2,1, 1,3, 0,1, 3,4, 3,1, 4,0], // 1: NE
    [2,2, 2,3, 1,2, 3,2, 2,1, 0,0, 0,4, 3,1, 3,3, 4,2], // 2: E
    [2,2, 2,3, 1,2, 3,2, 2,1, 1,1, 0,3, 3,0, 3,3, 4,4], // 3: SE
    [2,2, 2,3, 1,2, 3,2, 2,1, 0,0, 4,0, 1,3, 3,3, 2,4], // 4: S
    [2,2, 2,3, 1,2, 3,2, 2,1, 3,1, 1,0, 4,3, 1,3, 0,4], // 5: SW
    [2,2, 2,3, 1,2, 3,2, 2,1, 4,0, 4,4, 1,1, 1,3, 0,2], // 6: W
    [2,2, 2,3, 1,2, 3,2, 2,1, 3,3, 1,4, 4,1, 1,1, 0,0], // 7: NW
    [2,2, 2,3, 1,2, 3,2, 2,1, 1,1, 3,3, 1,3, 3,1, 2,0]  // 8: Defender
];
        const attackerOffsets = [];
        for (let i = 0; i < 10; i++) {
            attackerOffsets.push({ dx: FGT_INT_POS[way][i * 2], dy: FGT_INT_POS[way][i * 2 + 1] });
        }
        
        const defenderOffsets = [];
        for (let i = 0; i < 10; i++) {
            defenderOffsets.push({ dx: FGT_INT_POS[8][i * 2], dy: FGT_INT_POS[8][i * 2 + 1] });
        }

        const units: Record<string, BattleUnit> = {};
        
        // 初始化攻方武将
        attackerPersonIds.forEach((pid, idx) => {
            if (idx >= 10) return;
            const p = gameStore.persons[pid];
            const uid = `A_${pid}`;
            const armsType = p.armsType as ArmsType || ArmsType.INFANTRY;
            
            const stats = calculateUnitInitStats({
                force: p.force,
                iq: p.iq,
                level: p.level,
                armsType
            }, p.thew);
            
            units[uid] = {
                id: uid,
                personId: p.id,
                name: p.name,
                forceId: aCity.belong,
                isAttacker: true,
                armsType,
                armsCount: p.arms || 0,
                maxArms: stats.maxArms,
                force: p.force,
                iq: p.iq,
                level: p.level,
                x: Math.max(0, Math.min(map.width - 1, sx + attackerOffsets[idx].dx)),
                y: Math.max(0, Math.min(map.height - 1, sy + attackerOffsets[idx].dy)),
                hp: stats.maxHp,
                maxHp: stats.maxHp,
                mp: stats.maxMp,
                maxMp: stats.maxMp,
                moveRange: stats.moveRange,
                attack: stats.attack,
                defense: stats.defense,
                state: BattleUnitState.NORMAL,
                hasActed: false,
                color: gameStore.forces[aCity.belong]?.color || '#ff0000'
            };
        });

        // 初始化守方武将
        defenderPersonIds.forEach((pid, idx) => {
            if (idx >= 10) return;
            const p = gameStore.persons[pid];
            const uid = `D_${pid}`;
            const armsType = p.armsType as ArmsType || ArmsType.INFANTRY;
            
            const stats = calculateUnitInitStats({
                force: p.force,
                iq: p.iq,
                level: p.level,
                armsType
            }, p.thew);

            units[uid] = {
                id: uid,
                personId: p.id,
                name: p.name,
                forceId: dCity.belong,
                isAttacker: false,
                armsType,
                armsCount: Math.max(100, p.arms || 0),
                maxArms: stats.maxArms,
                force: p.force,
                iq: p.iq,
                level: p.level,
                x: Math.max(0, Math.min(map.width - 1, cx + defenderOffsets[idx].dx)),
                y: Math.max(0, Math.min(map.height - 1, cy + defenderOffsets[idx].dy)),
                hp: stats.maxHp,
                maxHp: stats.maxHp,
                mp: stats.maxMp,
                maxMp: stats.maxMp,
                moveRange: stats.moveRange,
                attack: stats.attack,
                defense: stats.defense,
                state: BattleUnitState.NORMAL,
                hasActed: false,
                color: gameStore.forces[dCity.belong]?.color || '#0000ff'
            };
        });

        set({
            map,
            units,
            day: 1,
            weather: Math.floor(Math.random() * 5) as Weather,
            attackerForceId: aCity.belong,
            defenderForceId: dCity.belong,
            attackerCityId,
            defenderCityId,
            attackerFood: 5000, // TODO: 从出征界面获取
            defenderFood: dCity.food,
            activeUnitId: null,
            reachableTiles: [],
            attackableTiles: [],
            isAttackerTurn: true,
            isAiThinking: false,
            battleLogs: [`【系统】战斗开始！攻方：${gameStore.persons[gameStore.forces[aCity.belong]?.kingId]?.name}军 vs 守方：${gameStore.persons[gameStore.forces[dCity.belong]?.kingId]?.name}军`]
        });

        // 6. 如果攻方（先手）是AI，自动触发AI回合
        if (aCity.belong !== gameStore.playerForceId) {
            setTimeout(() => {
                get().runAiTurn();
            }, 1000);
        }
    },

    endTurn: () => {
        const state = get();
        const nextIsAttackerTurn = !state.isAttackerTurn;
        const isNextDay = nextIsAttackerTurn === true;

        set(produce((s: BattleStore) => {
            if (isNextDay) {
                // 重置所有单位行动状态
                Object.values(s.units).forEach(u => {
                    u.hasActed = false;
                });
                
                s.day += 1;
                s.weather = Math.floor(Math.random() * 5) as Weather; // 随机天气
                
                // 粮草消耗 (原版逻辑：消耗 = sqrt(总兵力) / 3)
                const attackerTotalArms = Object.values(s.units).filter(u => u.isAttacker && u.armsCount > 0).reduce((sum, u) => sum + u.armsCount, 0);
                const defenderTotalArms = Object.values(s.units).filter(u => !u.isAttacker && u.armsCount > 0).reduce((sum, u) => sum + u.armsCount, 0);
                
                const attackerConsume = calculateFoodConsumption(attackerTotalArms);
                const defenderConsume = calculateFoodConsumption(defenderTotalArms);

                s.attackerFood = s.attackerFood > attackerConsume ? s.attackerFood - attackerConsume : 0;
                s.defenderFood = s.defenderFood > defenderConsume ? s.defenderFood - defenderConsume : 0;

                s.battleLogs.unshift(`【系统】进入第 ${s.day} 天。`);
            } else {
                s.battleLogs.unshift(`【系统】守方回合开始。`);
            }

            s.isAttackerTurn = nextIsAttackerTurn;
            s.activeUnitId = null;
            s.reachableTiles = [];
            s.attackableTiles = [];
        }));

        const finalState = get();
        const nextForceId = finalState.isAttackerTurn ? finalState.attackerForceId : finalState.defenderForceId;
        const gameStore = useGameStore.getState();
        if (nextForceId !== gameStore.playerForceId && !finalState.checkWinCondition()) {
            setTimeout(() => {
                get().runAiTurn();
            }, 500);
        }
    },

    selectUnit: (unitId) => set(produce((state: BattleStore) => {
        state.activeUnitId = unitId;
        if (!unitId) {
            state.reachableTiles = [];
            state.attackableTiles = [];
            return;
        }
        
        const unit = state.units[unitId];
        if (unit.hasActed) return;

        // 简易移动范围计算 (考虑地形阻力，类似Dijkstra)
        const moveRange = unit.moveRange;
        state.reachableTiles = [];
        
        // 初始化距离矩阵
        const dist = Array(state.map.height).fill(0).map(() => Array(state.map.width).fill(Infinity));
        dist[unit.y][unit.x] = 0;
        
        // 队列存 {x, y, cost}
        const queue: {x: number, y: number, cost: number}[] = [{x: unit.x, y: unit.y, cost: 0}];
        
        // 获取其他单位的阻挡
        const occupied = new Set<string>();
        Object.values(state.units).forEach(u => {
            if (u.id !== unitId && u.hp > 0) {
                // 敌我双方都阻挡移动（简化版，若只敌方阻挡可判断 isAttacker）
                occupied.add(`${u.x},${u.y}`);
            }
        });

        while (queue.length > 0) {
            // 简单排序取最小cost (对于小范围寻路性能足够)
            queue.sort((a, b) => a.cost - b.cost);
            const curr = queue.shift()!;
            
            if (curr.cost > dist[curr.y][curr.x]) continue;
            
            // 加入可达列表 (排除自己所在的格子)
            if (curr.x !== unit.x || curr.y !== unit.y) {
                // 如果该格子没有被占用，则可以停留
                if (!occupied.has(`${curr.x},${curr.y}`)) {
                    // 查重
                    if (!state.reachableTiles.some(t => t.x === curr.x && t.y === curr.y)) {
                        state.reachableTiles.push({ x: curr.x, y: curr.y });
                    }
                }
            }

            // 四个方向
            const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            for (const [dx, dy] of dirs) {
                const nx = curr.x + dx;
                const ny = curr.y + dy;
                
                if (nx >= 0 && nx < state.map.width && ny >= 0 && ny < state.map.height) {
                    const tileType = state.map.tiles[ny][nx];
                    const resistance = LandResistance[unit.armsType]?.[tileType] || 1;
                    
                    if (resistance !== MOV_NOT) {
                        // 如果有敌方阻挡，通常不能穿过，但我们刚才把所有单位都加进了occupied
                        // 如果允许穿过友军但不能停留，我们在这里判断：
                        // occupied只影响停留，不影响经过？原版三国霸业敌方阻挡经过，我方可穿过
                        const uAtPos = Object.values(state.units).find(u => u.x === nx && u.y === ny && u.hp > 0);
                        if (uAtPos && uAtPos.isAttacker !== unit.isAttacker) {
                            continue; // 敌方完全阻挡
                        }

                        const nCost = curr.cost + resistance;
                        if (nCost <= moveRange && nCost < dist[ny][nx]) {
                            dist[ny][nx] = nCost;
                            queue.push({ x: nx, y: ny, cost: nCost });
                        }
                    }
                }
            }
        }
        
        // 简易攻击范围 (近战1格)
        state.attackableTiles = [];
        const atkRange = unit.armsType === ArmsType.ARCHER ? 2 : 1;
        Object.values(state.units).forEach(target => {
            if (target.isAttacker !== unit.isAttacker && target.hp > 0) {
                const dist = Math.abs(target.x - unit.x) + Math.abs(target.y - unit.y);
                if (dist <= atkRange) {
                    state.attackableTiles.push({ x: target.x, y: target.y });
                }
            }
        });
    })),

    moveUnit: (unitId, x, y) => set(produce((state: BattleStore) => {
        const unit = state.units[unitId];
        if (unit) {
            unit.x = x;
            unit.y = y;
            state.battleLogs.unshift(`【移动】${unit.name} 移动到了 (${x}, ${y})。`);
            
            // 重新计算攻击范围
            state.reachableTiles = [];
            state.attackableTiles = [];
            const atkRange = unit.armsType === ArmsType.ARCHER ? 2 : 1;
            Object.values(state.units).forEach(target => {
                if (target.isAttacker !== unit.isAttacker && target.armsCount > 0) {
                    const dist = Math.abs(target.x - unit.x) + Math.abs(target.y - unit.y);
                    if (dist <= atkRange) {
                        state.attackableTiles.push({ x: target.x, y: target.y });
                    }
                }
            });
            
            // 如果移动后没有可攻击目标，直接结束行动
            if (state.attackableTiles.length === 0) {
                unit.hasActed = true;
                state.activeUnitId = null;
            }
        }
    })),

    attack: (attackerId, defenderId) => set(produce((state: BattleStore) => {
        const attacker = state.units[attackerId];
        const defender = state.units[defenderId];
        if (!attacker || !defender) return;

        // 原版伤害公式
        const dTerrain = state.map.tiles[defender.y][defender.x];
        const actualDmg = calculatePhysicalDamage({
            attacker: {
                attack: attacker.attack,
                armsCount: attacker.armsCount,
                armsType: attacker.armsType
            },
            defender: {
                defense: defender.defense,
                armsCount: defender.armsCount,
                armsType: defender.armsType
            },
            defenderTerrain: dTerrain
        });
        
        defender.armsCount -= actualDmg;
        state.battleLogs.unshift(`【战斗】${attacker.name} 攻击了 ${defender.name}，造成了 ${actualDmg} 兵力损失！`);

        if (defender.armsCount <= 0) {
            state.battleLogs.unshift(`【战斗】${defender.name} 的部队被击溃了！`);
            defender.armsCount = 0;
            defender.hp = 0;
        }
        
        // 经验结算
        const expGained = calculateExperience({
            actualDmg,
            defenderArmsCountAfter: defender.armsCount,
            attackerLevel: attacker.level,
            defenderLevel: defender.level
        });
        attacker.expGained = (attacker.expGained || 0) + expGained;

        attacker.hasActed = true;
        state.activeUnitId = null;
        state.reachableTiles = [];
        state.attackableTiles = [];
    })),

    rest: (unitId) => set(produce((state: BattleStore) => {
        const unit = state.units[unitId];
        if (unit) {
            unit.hasActed = true;
            state.activeUnitId = null;
            state.reachableTiles = [];
            state.attackableTiles = [];
            state.battleLogs.unshift(`【待命】${unit.name} 结束了行动。`);
        }
    })),

    useSkill: (attackerId, defenderId, skillId) => set(produce((state: BattleStore) => {
        const attacker = state.units[attackerId];
        const defender = state.units[defenderId];
        if (!attacker || !defender) return;

        // 简易技能消耗与伤害计算 (这里可以扩展具体的技能逻辑)
        const mpCost = 10;
        if (attacker.mp < mpCost) {
            state.battleLogs.unshift(`【提示】${attacker.name} 技能点不足！`);
            return;
        }
        attacker.mp -= mpCost;

        // 技能伤害基础公式 (智力影响)
        const actualDmg = calculateSkillDamage({
            attacker: {
                iq: attacker.iq,
                armsCount: attacker.armsCount
            },
            defender: {
                iq: defender.iq,
                armsCount: defender.armsCount
            },
            skillId
        });
        
        defender.armsCount -= actualDmg;
        state.battleLogs.unshift(`【技能】${attacker.name} 对 ${defender.name} 使用了技能，造成了 ${actualDmg} 兵力损失！`);

        if (defender.armsCount <= 0) {
            state.battleLogs.unshift(`【战斗】${defender.name} 的部队被击溃了！`);
            defender.armsCount = 0;
            defender.hp = 0;
        }

        // 经验结算
        const expGained = calculateExperience({
            actualDmg,
            defenderArmsCountAfter: defender.armsCount,
            attackerLevel: attacker.level,
            defenderLevel: defender.level
        });
        attacker.expGained = (attacker.expGained || 0) + expGained;

        attacker.hasActed = true;
        state.activeUnitId = null;
        state.reachableTiles = [];
        state.attackableTiles = [];
    })),

    checkWinCondition: () => {
        const state = get();
        if (state.day > 30) return 'DEFENDER_WIN';
        if (state.attackerFood <= 0) return 'DEFENDER_WIN';
        if (state.defenderFood <= 0) return 'ATTACKER_WIN';
        
        const attackers = Object.values(state.units).filter(u => u.isAttacker && u.armsCount > 0);
        const defenders = Object.values(state.units).filter(u => !u.isAttacker && u.armsCount > 0);
        
        if (attackers.length === 0) return 'DEFENDER_WIN';
        if (defenders.length === 0) return 'ATTACKER_WIN';
        
        return null;
    },

    endBattle: (result) => {
        const gameStore = useGameStore.getState();
        const state = get();
        
        // 处理武将变更
        Object.values(state.units).forEach(u => {
            gameStore.updatePerson(u.personId, p => {
                p.arms = u.armsCount;
                p.thew = u.hp;
                
                // 经验结算
                if (u.expGained) {
                    p.experience = (p.experience || 0) + u.expGained;
                    if (p.experience >= 100) {
                        p.experience -= 100;
                        p.level = (p.level || 0) + 1;
                        gameStore.addLog(`【升级】${p.name} 升级了！`);
                    }
                }

                const isWinnerSide = (result === 'ATTACKER_WIN' && u.isAttacker) || (result === 'DEFENDER_WIN' && !u.isAttacker);
                
                if (isWinnerSide) {
                    p.city = u.isAttacker ? state.defenderCityId : state.defenderCityId; 
                    if (result === 'DEFENDER_WIN' && !u.isAttacker) {
                        p.city = state.defenderCityId;
                    }
                } else {
                    // 战败方逻辑
                    const fallbackCityId = u.isAttacker ? state.attackerCityId : state.defenderCityId;
                    const captureCityId = result === 'ATTACKER_WIN' ? state.defenderCityId : state.defenderCityId; // 赢家所在的城
                    
                    const rnd = Math.random() * 100;
                    if (u.armsCount === 0 && rnd > p.iq) {
                        // 被俘虏
                        p.oldBelong = p.belong;
                        p.belong = 0xffff;
                        p.city = captureCityId;
                        p.arms = 0;
                        gameStore.addLog(`【俘虏】${p.name} 被俘虏了！`);
                    } else {
                        // 逃跑
                        const forceCities = Object.values(gameStore.cities).filter(c => 
                            c.belong === p.belong && 
                            !(result === 'ATTACKER_WIN' && c.id === state.defenderCityId)
                        );
                        if (forceCities.length > 0) {
                            // 优先逃回出发城/原属城
                            const targetCity = forceCities.find(c => c.id === fallbackCityId) || forceCities[Math.floor(Math.random() * forceCities.length)];
                            p.city = targetCity.id;
                            gameStore.addLog(`【撤退】${p.name} 撤退到了 ${targetCity.name}。`);
                        } else {
                            // 无处可逃
                            if (Math.random() > 0.5) {
                                p.oldBelong = p.belong;
                                p.belong = 0xffff;
                                p.city = captureCityId;
                                p.arms = 0;
                                gameStore.addLog(`【俘虏】${p.name} 无路可退，被俘虏了！`);
                            } else {
                                p.oldBelong = p.belong;
                                p.belong = 0xffff;
                                p.city = captureCityId;
                                p.arms = 0;
                                if (p.equip && p.equip.length > 0) {
                                    gameStore.addLog(`【缴获】缴获了 ${p.name} 的装备！`);
                                    p.equip = [];
                                }
                                gameStore.addLog(`【流亡】${p.name} 军溃败，流亡在野。`);
                            }
                        }
                    }
                }
            });
        });

        // 战后城市属性下降
        const dCity = gameStore.cities[state.defenderCityId];
        gameStore.updateCity(state.defenderCityId, c => {
            c.farming = Math.floor(c.farming * 0.95);
            c.commerce = Math.floor(c.commerce * 0.95);
            c.money = Math.floor(c.money * 0.95);
            c.peopleDevotion = Math.floor(c.peopleDevotion * 0.9);
            c.food = state.attackerFood + state.defenderFood;
            
            if (result === 'ATTACKER_WIN') {
                c.belong = state.attackerForceId;
            }
        });

        // 如果攻方胜利，发送占领战报
        if (result === 'ATTACKER_WIN') {
            const executorId = Object.values(state.units).find(u => u.isAttacker)?.personId;
            const isKing = executorId === gameStore.forces[state.attackerForceId]?.kingId;
            const msgPrefix = isKing ? `孤已率军攻克了` : `主公，臣已率军攻克了`;
            
            gameStore.addReport({ forceId: state.attackerForceId, msg: `${msgPrefix} ${dCity.name}！`, avatarId: executorId });
            gameStore.addLog(`【系统】战斗结束，攻方取得了胜利，占领了 ${dCity.name}！`);
        } else {
            gameStore.addLog(`【系统】战斗结束，守方成功击退了敌军！`);
        }

        gameStore.setScreen('GAME');
    },

    runAiTurn: async () => {
        const state = get();
        const gameStore = useGameStore.getState();
        const { isAttackerTurn, attackerForceId, defenderForceId } = state;
        const currentForceId = isAttackerTurn ? attackerForceId : defenderForceId;
        
        if (currentForceId === gameStore.playerForceId || state.isAiThinking) {
            return;
        }

        set({ isAiThinking: true });

        const units = Object.values(get().units).filter(u => u.isAttacker === isAttackerTurn && !u.hasActed && u.armsCount > 0);
        
        for (const unit of units) {
            if (!get().units[unit.id]) continue;
            
            await new Promise(r => setTimeout(r, 500));
            
            let targetX = unit.x;
            let targetY = unit.y;
            
            if (isAttackerTurn) {
                const map = get().map;
                outer: for (let y = 0; y < map.height; y++) {
                    for (let x = 0; x < map.width; x++) {
                        if (map.tiles[y][x] === TerrainType.CITY) {
                            targetX = x; targetY = y;
                            break outer;
                        }
                    }
                }
            } else {
                const enemies = Object.values(get().units).filter(u => u.isAttacker !== isAttackerTurn && u.armsCount > 0);
                if (enemies.length > 0) {
                    let minD = Infinity;
                    for (const e of enemies) {
                        const d = Math.abs(e.x - unit.x) + Math.abs(e.y - unit.y);
                        if (d < minD) {
                            minD = d; targetX = e.x; targetY = e.y;
                        }
                    }
                }
            }

            get().selectUnit(unit.id);
            await new Promise(r => setTimeout(r, 300));
            
            const reachable = get().reachableTiles;
            let bestTile = { x: unit.x, y: unit.y };
            
            if (reachable.length > 0) {
                let minDist = Math.abs(targetX - unit.x) + Math.abs(targetY - unit.y);
                for (const t of reachable) {
                    const d = Math.abs(targetX - t.x) + Math.abs(targetY - t.y);
                    if (d < minDist) {
                        minDist = d;
                        bestTile = t;
                    }
                }
            }
            
            if (bestTile.x !== unit.x || bestTile.y !== unit.y) {
                get().moveUnit(unit.id, bestTile.x, bestTile.y);
                await new Promise(r => setTimeout(r, 300));
            }

            const attackable = get().attackableTiles;
            if (attackable.length > 0) {
                let bestTargetId = null;
                let minHp = Infinity;
                for (const t of attackable) {
                    const enemy = Object.values(get().units).find(u => u.x === t.x && u.y === t.y && u.armsCount > 0);
                    if (enemy && enemy.armsCount < minHp) {
                        minHp = enemy.armsCount;
                        bestTargetId = enemy.id;
                    }
                }
                if (bestTargetId) {
                    get().attack(unit.id, bestTargetId);
                } else {
                    get().rest(unit.id);
                }
            } else {
                get().rest(unit.id);
            }
        }

        set({ isAiThinking: false });
        get().endTurn();
    }
}));
