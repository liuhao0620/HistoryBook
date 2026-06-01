import { useGameStore } from '../state/useGameStore';
import type { City } from '../models/City';
import type { Person } from '../models/Person';

export class AIEngine {
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

        // 根据原版逻辑，每个武将随机决定做什么
        for (let i = 0; i < personsInCity.length; i++) {
            const person = personsInCity[i];
            
            // 为了简化，将内政、外交、协调、军备合并在一起做概率判断
            // 原版中是先将策略分为4大类，再根据武将循环
            
            // 简单划分类别：60%内政/防灾，20%军备(征兵/出征)，20%什么都不做(休息)
            const rnd = Math.random();
            
            if (rnd < 0.6) {
                this.doInternalAffairs(city, person);
            } else if (rnd < 0.8) {
                // 只有前面的武将负责出征判定，避免所有人都在出征
                this.doMilitaryAffairs(city, person, i, personsInCity);
            }
        }
    }

    private static doInternalAffairs(city: City, person: Person) {
        const store = useGameStore.getState();
        const rnd = Math.floor(Math.random() * 4);
        
        switch (rnd) {
            case 0: // 开垦
                if (city.farming < city.farmingLimit) {
                    store.addOrder({ type: 'ASSART', forceId: city.belong, cityId: city.id, personId: person.id });
                    store.updatePerson(person.id, p => { p.acted = true; });
                }
                break;
            case 1: // 招商
                if (city.commerce < city.commerceLimit) {
                    store.addOrder({ type: 'ACCRACTBUSINESS', forceId: city.belong, cityId: city.id, personId: person.id });
                    store.updatePerson(person.id, p => { p.acted = true; });
                }
                break;
            case 2: // 搜寻
                store.addOrder({ type: 'SEARCH', forceId: city.belong, cityId: city.id, personId: person.id });
                store.updatePerson(person.id, p => { p.acted = true; });
                break;
            case 3: // 治理 (防灾)
                if ((city.avoidCalamity || 0) < 100) {
                    store.addOrder({ type: 'FATHER', forceId: city.belong, cityId: city.id, personId: person.id });
                    store.updatePerson(person.id, p => { p.acted = true; });
                }
                break;
        }
    }

    private static doMilitaryAffairs(city: City, person: Person, index: number, personsInCity: Person[]) {
        const store = useGameStore.getState();
        
        const rnd = Math.floor(Math.random() * 5);
        if (rnd < 3) { // 征兵
            const arms = Math.min(city.money * 2, (city.peopleDevotion || 50) * 10);
            const costMoney = Math.floor(arms / 2);
            
            store.addOrder({ 
                type: 'CONSCRIPTION', 
                forceId: city.belong, 
                cityId: city.id, 
                personId: person.id,
                data: { arms, costMoney }
            });
            store.updatePerson(person.id, p => { p.acted = true; });
        } else if (rnd === 3 && index === 0) { // 出征，只有第一个人判断出征，以统帅身份
            // 找附近的敌对城市
            const allCities = Object.values(store.cities);
            // 简单处理：找与自己相邻且 belong 不为自己的城池
            // 目前没有完整的地图拓扑，可以暂时找任意一个非本势力的城池（如果是大地图，应该找距离近的）
            // 如果项目中已经有 mapTopology 或类似的，我们这里简单实现
            const enemyCities = allCities.filter(c => c.belong !== city.belong);
            if (enemyCities.length === 0) return;

            const targetCity = enemyCities[Math.floor(Math.random() * enemyCities.length)];
            
            // 挑选出征武将：兵力排名前10的武将
            const availableGenerals = [...personsInCity].filter(p => !p.acted && (p.arms || 0) > 500);
            availableGenerals.sort((a, b) => (b.arms || 0) - (a.arms || 0));
            
            if (availableGenerals.length >= 2 && availableGenerals[0].arms > 1000) { // 至少2个武将且主力兵力大于1000
                const attackGenerals = availableGenerals.slice(0, 10);
                store.addOrder({
                    type: 'ATTACK',
                    forceId: city.belong,
                    cityId: city.id,
                    data: {
                        toCityId: targetCity.id,
                        personIds: attackGenerals.map(g => g.id)
                    }
                });
                
                // 标记为已行动
                attackGenerals.forEach(g => {
                    store.updatePerson(g.id, p => { p.acted = true; });
                });
            }
        } else if (rnd === 4) { // 掠夺
            store.addOrder({ type: 'DEPREDATE', forceId: city.belong, cityId: city.id, personId: person.id });
            store.updatePerson(person.id, p => { p.acted = true; });
        }
    }
}