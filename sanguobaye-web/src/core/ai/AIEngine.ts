import { useGameStore } from '../state/useGameStore';
import type { City } from '../models/City';
import type { Person } from '../models/Person';

export class AIEngine {
    // 君主产生“内政、协调”、“外交”、“军备”策略几率
    private static readonly KingTacticOddsIH = [50, 40, 30, 20, 10];
    private static readonly KingTacticOddsD = [80, 70, 70, 40, 20];

    /**
     * 生成 AI 势力的指令
     * @param forceId 势力 ID
     */
    static generateOrdersForForce(forceId: number) {
        const store = useGameStore.getState();
        const cities = Object.values(store.cities).filter(c => c.belong === forceId);
        
        for (const city of cities) {
            this.generateOrdersForCity(city);
        }
    }

    private static generateOrdersForCity(city: City) {
        const store = useGameStore.getState();
        const personsInCity = Object.values(store.persons).filter(p => p.city === city.id && p.belong === city.belong && !p.acted);

        // 如果城中没有武将，无法执行任何命令
        if (personsInCity.length === 0) return;

        // 获取君主的性格 (0:忠义, 1:大志, 2:贪财, 3:怕死, 4:卤莽)
        const force = store.forces[city.belong];
        if (!force) return;
        const king = store.persons[force.kingId];
        const character = king?.character ?? 0;

        // 根据原版 C 代码：更新城池状态
        store.updateCity(city.id, c => {
            c.avoidCalamity = Math.min(100, (c.avoidCalamity || 0) + 1);
            if (c.food < 100) c.food = 500;
            if (c.money > 10000) c.money = Math.floor(c.money / 2);
        });

        const rnd = Math.floor(Math.random() * 100);

        if (rnd < this.KingTacticOddsIH[character]) {
            this.computerTacticInterior(city, personsInCity);
            this.computerTacticHarmonize(city, personsInCity);
        } else if (rnd < this.KingTacticOddsD[character]) {
            this.computerTacticDiplomatism(city, personsInCity);
        } else {
            this.computerTacticArmament(city, personsInCity);
        }
    }

    private static computerTacticInterior(city: City, persons: Person[]) {
        const store = useGameStore.getState();
        
        for (let i = 0; i < persons.length; i++) {
            const person = persons[i];
            if (person.acted) continue;

            const rnd = Math.floor(Math.random() * 5);
            let acted = false;

            switch (rnd) {
                case 0: // 开垦 ASSART
                    store.addOrder({ type: 'ASSART', forceId: city.belong, cityId: city.id, personId: person.id });
                    acted = true;
                    break;
                case 1: // 招商 ACCRACTBUSINESS
                    store.addOrder({ type: 'ACCRACTBUSINESS', forceId: city.belong, cityId: city.id, personId: person.id });
                    acted = true;
                    break;
                case 2: // 搜寻 SEARCH
                    store.addOrder({ type: 'SEARCH', forceId: city.belong, cityId: city.id, personId: person.id });
                    acted = true;
                    break;
                case 3: // 出巡 INSPECTION
                    store.addOrder({ type: 'INSPECTION', forceId: city.belong, cityId: city.id, personId: person.id });
                    acted = true;
                    break;
                case 4:
                    continue;
            }

            if (acted) {
                store.updatePerson(person.id, p => { p.acted = true; });
            }
        }
    }

    private static computerTacticHarmonize(city: City, persons: Person[]) {
        const store = useGameStore.getState();

        for (let i = 0; i < persons.length; i++) {
            const person = persons[i];
            if (person.acted) continue;

            const rnd = Math.floor(Math.random() * 7);
            let acted = false;

            switch (rnd) {
                case 0: // 治理 FATHER
                    store.addOrder({ type: 'FATHER', forceId: city.belong, cityId: city.id, personId: person.id });
                    acted = true;
                    break;
                case 1: // 赏赐
                case 2: // 没收
                case 3: // 交易
                case 4: // 输送
                    // 原版AI不执行这些指令
                    continue;
                case 5: // 移动 MOVE
                    // 至少留下 3 个人
                    if (i < 3) continue;
                    
                    const myCities = Object.values(store.cities).filter(c => c.belong === city.belong);
                    if (myCities.length < 2) continue;

                    // 寻找一个有敌人的相邻城池
                    let targetCityId = -1;
                    for (const myCity of myCities) {
                        const hasEnemyNeighbors = this.getEnemyNeighbors(myCity.id, city.belong).length > 0;
                        if (hasEnemyNeighbors) {
                            targetCityId = myCity.id;
                            if (Math.random() < 0.5) break; // 随机找一个
                        }
                    }
                    
                    if (targetCityId !== -1 && targetCityId !== city.id) {
                        store.addOrder({ type: 'MOVE', forceId: city.belong, cityId: city.id, data: { toCityId: targetCityId, personIds: [person.id] } });
                        acted = true;
                    }
                    break;
                case 6:
                    continue;
            }

            if (acted) {
                store.updatePerson(person.id, p => { p.acted = true; });
            }
        }
    }

    private static computerTacticDiplomatism(city: City, persons: Person[]) {
        const store = useGameStore.getState();

        for (let i = 0; i < persons.length; i++) {
            const person = persons[i];
            if (person.acted) continue;

            const rnd = Math.floor(Math.random() * 8);
            let acted = false;

            // 原版中处理战俘的逻辑暂时省略，因为当前版本战俘系统未完全实现
            
            switch (rnd) {
                case 0: // 招降
                case 1: // 处斩
                case 2: // 流放
                    continue;
                case 3: { // 离间 ALIENATE
                    const enemyPersons = this.getEnemyPersons(city.belong);
                    if (enemyPersons.length > 0) {
                        const target = enemyPersons[Math.floor(Math.random() * enemyPersons.length)];
                        store.addOrder({ type: 'ALIENATE', forceId: city.belong, cityId: city.id, personId: person.id, targetId: target.id });
                        acted = true;
                    }
                    break;
                }
                case 4: { // 招揽 CANVASS
                    const enemyPersons = this.getEnemyPersons(city.belong);
                    if (enemyPersons.length > 0) {
                        const target = enemyPersons[Math.floor(Math.random() * enemyPersons.length)];
                        store.addOrder({ type: 'CANVASS', forceId: city.belong, cityId: city.id, personId: person.id, targetId: target.id });
                        acted = true;
                    }
                    break;
                }
                case 5: { // 策反 COUNTERESPIONAGE
                    const enemySatraps = this.getEnemySatraps(city.belong);
                    if (enemySatraps.length > 0) {
                        const target = enemySatraps[Math.floor(Math.random() * enemySatraps.length)];
                        store.addOrder({ type: 'COUNTERESPIONAGE', forceId: city.belong, cityId: city.id, personId: person.id, targetId: target.id });
                        acted = true;
                    }
                    break;
                }
                case 6: { // 劝降 INDUCE (对君主)
                    const enemyKings = this.getEnemyKings(city.belong);
                    if (enemyKings.length > 0) {
                        const target = enemyKings[Math.floor(Math.random() * enemyKings.length)];
                        store.addOrder({ type: 'INDUCE', forceId: city.belong, cityId: city.id, personId: person.id, targetId: target.id });
                        acted = true;
                    }
                    break;
                }
                case 7:
                    continue;
            }

            if (acted) {
                store.updatePerson(person.id, p => { p.acted = true; });
            }
        }
    }

    private static computerTacticArmament(city: City, persons: Person[]) {
        const store = useGameStore.getState();

        for (let i = 0; i < persons.length; i++) {
            const person = persons[i];
            if (person.acted) continue;

            const rnd = Math.floor(Math.random() * 9);
            let acted = false;

            switch (rnd) {
                case 0: // 侦察 RECONNOITRE
                    // 简化为随机侦察一个相邻城池
                    const neighbors = this.getEnemyNeighbors(city.id, city.belong);
                    if (neighbors.length > 0) {
                        const targetCity = neighbors[Math.floor(Math.random() * neighbors.length)];
                        store.addOrder({ type: 'RECONNOITRE', forceId: city.belong, personId: person.id, targetId: targetCity.id });
                        acted = true;
                    }
                    break;
                case 1: // 征兵
                case 2: // 分配 -> 原版AI改为征兵
                case 3: // 征兵
                case 4: // 分配 -> 原版AI改为征兵
                case 5: // 分配 -> 原版AI改为征兵
                    // 原版中，AI的征兵不需要金钱，直接给武将满兵
                    // 这里的 PlcArmsMax 可以近似用 (level * 10 + force + iq) * 10 替代
                    const maxArms = (person.level * 10 + person.force + person.iq) * 10;
                    store.addOrder({ type: 'CONSCRIPTION', forceId: city.belong, cityId: city.id, personId: person.id, data: { arms: maxArms, costMoney: 0 } });
                    acted = true;
                    break;
                case 6: // 掠夺 DEPREDATE
                    store.addOrder({ type: 'DEPREDATE', forceId: city.belong, cityId: city.id, personId: person.id });
                    acted = true;
                    break;
                case 7: // 出征 BATTLE/ATTACK
                    // 出征判定非常严格，且只有遍历到的第一个武将 (i === 0) 才会触发
                    if (i >= 1) continue;

                    const enemyNeighbors = this.getEnemyNeighbors(city.id, city.belong);
                    const fcount = enemyNeighbors.length;
                    if (fcount === 0) continue;

                    // 50% 概率不出征
                    if (Math.floor(Math.random() * (fcount * 2)) >= fcount) continue;

                    // 寻找最弱的城池 (简化为随机选择)
                    const targetCity = enemyNeighbors[Math.floor(Math.random() * enemyNeighbors.length)];

                    // 武将按兵力排序
                    const sortedPersons = [...persons].filter(p => !p.acted).sort((a, b) => (b.arms || 0) - (a.arms || 0));
                    let fpcount = sortedPersons.length;

                    // 最大兵力的武将必须至少有 1000 兵
                    if (fpcount === 0 || (sortedPersons[0].arms || 0) < 1000) continue;

                    // 城里必须至少有 4 个人
                    if (fpcount < 4) continue;

                    // 留守 1 人，最多出征 10 人
                    fpcount -= 1;
                    if (fpcount > 10) fpcount = 10;

                    const attackGenerals = sortedPersons.slice(0, fpcount);
                    
                    store.addOrder({
                        type: 'ATTACK',
                        forceId: city.belong,
                        cityId: city.id,
                        data: {
                            toCityId: targetCity.id,
                            personIds: attackGenerals.map(g => g.id)
                        }
                    });

                    attackGenerals.forEach(g => {
                        store.updatePerson(g.id, p => { p.acted = true; });
                    });

                    return; // 出征后直接结束该城的军备策略
                case 8:
                    continue;
            }

            if (acted && rnd !== 7) {
                store.updatePerson(person.id, p => { p.acted = true; });
            }
        }
    }

    // --- Helper Methods ---

    private static getEnemyNeighbors(_cityId: number, myForceId: number): City[] {
        const store = useGameStore.getState();
        // 这里需要有地图拓扑信息，暂时用简单的规则：相邻城市的ID差在一定范围内，或者直接返回所有非己方城池（作为大地图简化）
        // 如果游戏已经有 adjacency 列表，应该使用它。假设暂时返回所有敌人城池（简化版）
        return Object.values(store.cities).filter(c => c.belong !== myForceId && c.belong !== 0);
    }

    private static getEnemyPersons(myForceId: number): Person[] {
        const store = useGameStore.getState();
        return Object.values(store.persons).filter(p => p.belong !== myForceId && p.belong !== 0 && p.belong !== 0xffff && p.city !== undefined);
    }

    private static getEnemySatraps(myForceId: number): Person[] {
        const store = useGameStore.getState();
        const satrapIds = Object.values(store.cities)
            .filter(c => c.belong !== myForceId && c.belong !== 0)
            .map(c => c.satrapId)
            .filter(id => id > 0);
        return satrapIds.map(id => store.persons[id - 1]).filter(Boolean);
    }

    private static getEnemyKings(myForceId: number): Person[] {
        const store = useGameStore.getState();
        return Object.values(store.forces)
            .filter(f => f.id !== myForceId)
            .map(f => store.persons[f.kingId])
            .filter(Boolean);
    }
}
