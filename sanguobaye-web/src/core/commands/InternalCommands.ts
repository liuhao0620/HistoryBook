import { BaseCommand } from './Command';
import type { CommandResult } from './Command';
import { useGameStore } from '../state/useGameStore';
import type { Order } from '../state/useGameStore';

export class AssartCommand extends BaseCommand {
    private cityId: number;
    private personId: number;

    constructor(cityId: number, personId: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const city = store.cities[this.cityId];

        const COST_MONEY = 50;
        const COST_THEW = 4;

        if (city.farming >= city.farmingLimit) {
            return { success: false, message: `本地农业已极其繁荣，无需再开垦了。` };
        }

        if (!this.checkMoney(this.cityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.cityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.personId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'ASSART',
            forceId: store.playerForceId,
            cityId: this.cityId,
            personId: this.personId
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const city = store.cities[order.cityId!];
        const person = store.persons[order.personId!];

        const rnd = Math.floor(Math.random() * 4) + 2;
        let addFarming = Math.floor(person.iq / 10) * rnd + Math.floor(person.iq / 2);
        
        store.updateCity(order.cityId!, (c) => {
            c.farming = Math.min(c.farmingLimit, c.farming + addFarming);
        });

        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤在${city.name}开垦，` : `主公，臣在${city.name}开垦，`;
        
        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}农业开发度上升了 ${addFarming} 点。\n【内政】${person.name} 提升了 ${city.name} 的农业。`,
            avatarId: person.id
        });
    }
}

export class AccractbusinessCommand extends BaseCommand {
    private cityId: number;
    private personId: number;

    constructor(cityId: number, personId: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const city = store.cities[this.cityId];

        const COST_MONEY = 50;
        const COST_THEW = 4;

        if (city.commerce >= city.commerceLimit) {
            return { success: false, message: `本地商业已极其繁荣，无需再招商了。` };
        }

        if (!this.checkMoney(this.cityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.cityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.personId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'ACCRACTBUSINESS',
            forceId: store.playerForceId,
            cityId: this.cityId,
            personId: this.personId
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const city = store.cities[order.cityId!];
        const person = store.persons[order.personId!];

        const rnd = Math.floor(Math.random() * 4) + 2;
        let addCommerce = Math.floor(person.iq / 10) * rnd + Math.floor(person.iq / 2);
        
        store.updateCity(order.cityId!, (c) => {
            c.commerce = Math.min(c.commerceLimit, c.commerce + addCommerce);
        });

        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤在${city.name}招商，` : `主公，臣在${city.name}招商，`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}商业开发度上升了 ${addCommerce} 点。\n【内政】${person.name} 提升了 ${city.name} 的商业。`,
            avatarId: person.id
        });
    }
}

export class SearchCommand extends BaseCommand {
    private cityId: number;
    private personId: number;

    constructor(cityId: number, personId: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();

        const COST_MONEY = 10;
        const COST_THEW = 4;

        if (!this.checkMoney(this.cityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.cityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.personId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'SEARCH',
            forceId: store.playerForceId,
            cityId: this.cityId,
            personId: this.personId
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const city = store.cities[order.cityId!];
        const person = store.persons[order.personId!];

        const pss = Math.floor(Math.random() * 4);
        const rnd = Math.floor(Math.random() * 150);

        if (pss === 1 && rnd < person.iq) {
            const isFindPerson = Math.floor(Math.random() * 2) === 0;
            if (isFindPerson) {
                const freePersons = Object.values(store.persons).filter(p => p.belong === 0 && p.city === order.cityId);
                if (freePersons.length > 0) {
                    const target = freePersons[Math.floor(Math.random() * freePersons.length)];
                    const success = Math.floor(Math.random() * 110) < person.iq;
                    if (success) {
                        store.updatePerson(target.id, p => {
                            p.belong = order.forceId;
                            p.devotion = 70 + Math.floor(Math.random() * 30);
                        });
                        const isKing = store.forces[order.forceId]?.kingId === person.id;
                        store.addReport({ forceId: order.forceId, msg: isKing ? `孤在${city.name}搜寻，成功招募了在野武将 ${target.name}！` : `主公，臣在${city.name}搜寻，成功招募了在野武将 ${target.name}！`, avatarId: person.id });
                        store.addReport({ forceId: order.forceId, msg: `主公，在下${target.name}，愿效犬马之劳！`, avatarId: target.id });
                        return;
                    } else {
                        const isKing = store.forces[order.forceId]?.kingId === person.id;
                        store.addReport({ forceId: order.forceId, msg: isKing ? `孤发现了在野武将 ${target.name}，但未能说服其出山。` : `主公，臣发现了在野武将 ${target.name}，但未能说服其出山。`, avatarId: person.id });
                        store.addReport({ forceId: order.forceId, msg: `承蒙错爱，但在下尚无出山之意。`, avatarId: target.id });
                        return;
                    }
                }
            } else {
                // Find unassigned goods (not in any person's equip and not in any city's toolQueue)
                const assignedGoodsIds = new Set<number>();
                Object.values(store.persons).forEach(p => {
                    if (p.equip) {
                        p.equip.forEach(gid => assignedGoodsIds.add(gid));
                    }
                });
                Object.values(store.cities).forEach(c => {
                    if (c.toolQueue) {
                        c.toolQueue.forEach(gid => assignedGoodsIds.add(gid));
                    }
                });
                
                const availableGoods = Object.values(store.goods).filter(g => !assignedGoodsIds.has(g.id));
                if (availableGoods.length > 0) {
                    const targetGood = availableGoods[Math.floor(Math.random() * availableGoods.length)];
                    store.updateCity(order.cityId!, c => {
                        if (!c.toolQueue) c.toolQueue = [];
                        c.toolQueue.push(targetGood.id);
                    });
                    
                    const kingId = store.forces[order.forceId]?.kingId;
                    const msgPrefix = person.id === kingId 
                        ? `苍天护佑！孤偶得此稀世珍宝！发现了宝物【${targetGood.name}】，已存入${city.name}库房！` 
                        : `主公，臣幸不辱命，在${city.name}寻得一件宝物【${targetGood.name}】，已存入库房！`;
                    
                    store.addReport({ 
                        forceId: order.forceId, 
                        msg: msgPrefix,
                        avatarId: person.id
                    });
                } else {
                    const isKing = store.forces[order.forceId]?.kingId === person.id;
                    store.addReport({ forceId: order.forceId, msg: isKing ? `孤在${city.name}四处搜寻，但一无所获。` : `主公，臣在${city.name}四处搜寻，但一无所获。`, avatarId: person.id });
                }
                return;
            }
        }

        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const rnd2 = Math.random();
        if (rnd2 < 0.2) {
            const addMoney = 10 + Math.floor(Math.random() * (person.iq * 2));
            store.updateCity(order.cityId!, c => { c.money += addMoney; });
            store.addReport({ forceId: order.forceId, msg: isKing ? `孤在${city.name}搜寻，找到了金钱 ${addMoney}。` : `主公，臣在${city.name}搜寻，找到了金钱 ${addMoney}。`, avatarId: person.id });
        } else if (rnd < 0.4) {
            const addFood = 10 + Math.floor(Math.random() * (person.iq * 2));
            store.updateCity(order.cityId!, c => { c.food += addFood; });
            store.addReport({ forceId: order.forceId, msg: isKing ? `孤在${city.name}搜寻，找到了粮草 ${addFood}。` : `主公，臣在${city.name}搜寻，找到了粮草 ${addFood}。`, avatarId: person.id });
        } else {
            store.addReport({ forceId: order.forceId, msg: isKing ? `孤在${city.name}四处搜寻，但一无所获。` : `主公，臣在${city.name}四处搜寻，但一无所获。`, avatarId: person.id });
        }
    }
}

export class FatherCommand extends BaseCommand {
    private cityId: number;
    private personId: number;

    constructor(cityId: number, personId: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const city = store.cities[this.cityId];

        const COST_MONEY = 20;
        const COST_THEW = 4;

        if (city.avoidCalamity >= 100) {
            return { success: false, message: `本地防灾措施已十分完善。` };
        }

        if (!this.checkMoney(this.cityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.cityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.personId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'FATHER',
            forceId: store.playerForceId,
            cityId: this.cityId,
            personId: this.personId
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const city = store.cities[order.cityId!];
        const person = store.persons[order.personId!];

        const addAvoid = 1 + Math.floor(Math.random() * 4);
        
        store.updateCity(order.cityId!, (c) => {
            c.avoidCalamity = Math.min(100, c.avoidCalamity + addAvoid);
        });

        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤治理${city.name}，` : `主公，臣治理${city.name}，`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}防灾度上升了 ${addAvoid} 点。\n【内政】${person.name} 提升了 ${city.name} 的防灾。`,
            avatarId: person.id
        });
    }
}

export class InspectionCommand extends BaseCommand {
    private cityId: number;
    private personId: number;

    constructor(cityId: number, personId: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const city = store.cities[this.cityId];

        const COST_MONEY = 20;
        const COST_THEW = 4;

        if (city.peopleDevotion >= 100) {
            return { success: false, message: `本地百姓已十分归心，无需再出巡。` };
        }

        if (!this.checkMoney(this.cityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.cityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.personId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'INSPECTION',
            forceId: store.playerForceId,
            cityId: this.cityId,
            personId: this.personId
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const city = store.cities[order.cityId!];
        const person = store.persons[order.personId!];

        const addDevotion = 1 + Math.floor(Math.random() * 4);
        
        store.updateCity(order.cityId!, (c) => {
            c.peopleDevotion = Math.min(100, (c.peopleDevotion || 50) + addDevotion);
            c.population += 100;
        });

        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤出巡${city.name}，` : `主公，臣出巡${city.name}，`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}百姓归心，民忠上升了 ${addDevotion} 点，人口增加了 100。\n【内政】${person.name} 提升了 ${city.name} 的民忠。`,
            avatarId: person.id
        });
    }
}

export class ExchangeCommand extends BaseCommand {
    private cityId: number;
    private personId: number;
    private type: 'buy' | 'sell';
    private amount: number;

    constructor(cityId: number, personId: number, type: 'buy' | 'sell', amount: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
        this.type = type;
        this.amount = amount;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const city = store.cities[this.cityId];

        if (this.type === 'buy') {
            const costMoney = Math.ceil(this.amount / 5);
            if (!this.checkMoney(this.cityId, costMoney)) return { success: false };
            store.updateCity(this.cityId, (c) => { 
                c.money -= costMoney;
                c.food += this.amount; // 立即获得
            });
        } else {
            if (city.food < this.amount) {
                store.addLog(`【系统】${city.name} 粮草不足，需要 ${this.amount}。`);
                return { success: false };
            }
            const gainMoney = this.amount * 2;
            store.updateCity(this.cityId, (c) => { 
                c.food -= this.amount;
                c.money += gainMoney; // 立即获得
            });
        }

        store.addOrder({
            type: 'EXCHANGE',
            forceId: store.playerForceId,
            cityId: this.cityId,
            personId: this.personId,
            data: { type: this.type, amount: this.amount }
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const city = store.cities[order.cityId!];
        const person = store.persons[order.personId!];
        const { type, amount } = order.data;

        // 状态更新已在 execute 中立即生效
        if (type === 'buy') {
            const costMoney = Math.ceil(amount / 5);
            store.addReport({
                forceId: order.forceId,
                msg: `【内政】${person.name} 在 ${city.name} 买入了 ${amount} 粮草，花费了 ${costMoney} 金钱。`
            });
        } else {
            const gainMoney = amount * 2;
            store.addReport({
                forceId: order.forceId,
                msg: `【内政】${person.name} 在 ${city.name} 卖出了 ${amount} 粮草，获得了 ${gainMoney} 金钱。`
            });
        }
    }
}

export class SurrenderCommand extends BaseCommand {
    private executorId: number;
    private targetId: number;

    constructor(executorId: number, targetId: number) {
        super();
        this.executorId = executorId;
        this.targetId = targetId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();

        const COST_THEW = 4;
        if (!this.checkThew(this.executorId, COST_THEW)) return { success: false };

        store.updatePerson(this.executorId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'SURRENDER',
            forceId: store.playerForceId,
            personId: this.executorId,
            targetId: this.targetId
        });

        return { success: true, message: this.getAckMessage(this.executorId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const executor = store.persons[order.personId!];
        const target = store.persons[order.targetId!];

        const prob = (executor.iq - target.iq) + 50;
        const success = (Math.random() * 100) < prob;

        if (success) {
            const newDevotion = 40 + Math.floor(Math.random() * 40);
            store.updatePerson(order.targetId!, (p) => {
                p.belong = executor.belong;
                p.devotion = newDevotion;
            });
            const isKing = store.forces[order.forceId]?.kingId === executor.id;
            store.addReport({
                forceId: order.forceId,
                msg: isKing ? `孤已成功招降 ${target.name}！` : `主公，臣已成功招降 ${target.name}！`,
                avatarId: executor.id
            });
            store.addReport({
                forceId: order.forceId,
                msg: `末将愿降！今后定当誓死效忠主公！\n【内政】${executor.name} 成功招降了 ${target.name}！其忠诚度变为 ${newDevotion}。`,
                avatarId: target.id
            });
        } else {
            const isKing = store.forces[order.forceId]?.kingId === executor.id;
            store.addReport({
                forceId: order.forceId,
                msg: isKing ? `孤试图招降 ${target.name}，但被拒绝了。` : `主公，臣试图招降 ${target.name}，但被拒绝了。`,
                avatarId: executor.id
            });
            store.addReport({
                forceId: order.forceId,
                msg: `忠臣不事二主，要杀便杀！`,
                avatarId: target.id
            });
        }
    }
}

export class LargessCommand extends BaseCommand {
    private cityId: number;
    private targetId: number;
    private targetItemId: number;

    constructor(cityId: number, targetId: number, targetItemId: number) {
        super();
        this.cityId = cityId;
        this.targetId = targetId;
        this.targetItemId = targetItemId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const item = store.goods[this.targetItemId];

        // 立即生效（同原版游戏）
        store.updateCity(this.cityId, (c) => {
            if (c.toolQueue) {
                const idx = c.toolQueue.indexOf(this.targetItemId);
                if (idx > -1) c.toolQueue.splice(idx, 1);
            }
        });
        
        store.updatePerson(this.targetId, (p) => {
            if (!p.equip) p.equip = [];
            p.equip.push(this.targetItemId);
            p.devotion = Math.min(100, p.devotion + (item ? Math.floor(item.money / 10) + 1 : 8));
        });

        store.addOrder({
            type: 'LARGESS',
            forceId: store.playerForceId,
            cityId: this.cityId,
            targetId: this.targetId,
            data: { targetItemId: this.targetItemId }
        });

        return { success: true, message: "谢主公赏赐！" };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const target = store.persons[order.targetId!];
        const targetItemId = order.data?.targetItemId;
        const item = store.goods[targetItemId];

        // 状态更新已在 execute 中立即生效，此处仅输出月末报告
        store.addReport({
            forceId: order.forceId,
            msg: `谢主公赏赐！定当万死不辞！\n【内政】赏赐了 ${target.name} 【${item?.name || '物品'}】，其忠诚度上升了。`,
            avatarId: target.id
        });
    }
}

export class ConfiscateCommand extends BaseCommand {
    private cityId: number;
    private targetId: number;
    private targetItemId: number;

    constructor(cityId: number, targetId: number, targetItemId: number) {
        super();
        this.cityId = cityId;
        this.targetId = targetId;
        this.targetItemId = targetItemId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();

        // 立即生效
        store.updatePerson(this.targetId, (p) => {
            if (p.equip) {
                const idx = p.equip.indexOf(this.targetItemId);
                if (idx > -1) p.equip.splice(idx, 1);
            }
            p.devotion = Math.max(0, p.devotion - 20);
        });

        store.updateCity(this.cityId, (c) => {
            if (!c.toolQueue) c.toolQueue = [];
            c.toolQueue.push(this.targetItemId);
        });

        store.addOrder({
            type: 'CONFISCATE',
            forceId: store.playerForceId,
            cityId: this.cityId,
            targetId: this.targetId,
            data: { targetItemId: this.targetItemId }
        });

        return { success: true, message: "主公，您这是..." };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const target = store.persons[order.targetId!];
        const targetItemId = order.data?.targetItemId;
        const item = store.goods[targetItemId];

        // 状态更新已在 execute 中立即生效
        store.addReport({
            forceId: order.forceId,
            msg: `主公，您这是...臣实在心寒！\n【内政】没收了 ${target.name} 的【${item?.name || '物品'}】，其忠诚度大幅下降。`,
            avatarId: target.id
        });
    }
}

export class TreatCommand extends BaseCommand {
    private cityId: number;
    private targetId: number;

    constructor(cityId: number, targetId: number) {
        super();
        this.cityId = cityId;
        this.targetId = targetId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();

        const COST_MONEY = 50;
        if (!this.checkMoney(this.cityId, COST_MONEY)) return { success: false };

        // 立即生效
        store.updateCity(this.cityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.targetId, (p) => {
            p.thew = 100;
            p.devotion = Math.min(100, p.devotion + 1);
        });

        store.addOrder({
            type: 'TREAT',
            forceId: store.playerForceId,
            cityId: this.cityId,
            targetId: this.targetId
        });

        return { success: true, message: "谢主公赐宴！" };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const target = store.persons[order.targetId!];

        // 状态更新已在 execute 中立即生效
        store.addReport({
            forceId: order.forceId,
            msg: `谢主公赐宴！臣感觉精神百倍！\n【内政】宴请了 ${target.name}，其体力已完全恢复。`,
            avatarId: target.id
        });
    }
}

export class KillCommand extends BaseCommand {
    private targetId: number;

    constructor(targetId: number) {
        super();
        this.targetId = targetId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const target = store.persons[this.targetId];

        // 立即生效
        store.updatePerson(this.targetId, (p) => {
            p.belong = 255; // 死亡
        });

        if (target.equip && target.equip.length > 0) {
            store.updateCity(target.city!, (c) => {
                if (!c.toolQueue) c.toolQueue = [];
                c.toolQueue.push(...target.equip!);
            });
        }

        store.addOrder({
            type: 'KILL',
            forceId: store.playerForceId,
            targetId: this.targetId
        });

        return { success: true, message: `左右，将【${target.name}】拉出去斩了！` };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const target = store.persons[order.targetId!];

        // 状态更新已在 execute 中立即生效
        store.addReport({
            forceId: order.forceId,
            msg: `【内政】${target.name} 被处斩了。`
        });
    }
}

export class BanishCommand extends BaseCommand {
    private targetId: number;

    constructor(targetId: number) {
        super();
        this.targetId = targetId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();

        // 立即生效
        const cityIds = Object.keys(store.cities).map(Number);
        const randomCityId = cityIds[Math.floor(Math.random() * cityIds.length)];

        store.updatePerson(this.targetId, (p) => {
            p.belong = 0; // 在野
            p.city = randomCityId; // 流放到随机城市
        });

        store.addOrder({
            type: 'BANISH',
            forceId: store.playerForceId,
            targetId: this.targetId
        });

        return { success: true, message: `将【${store.persons[this.targetId].name}】逐出城外！` };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const target = store.persons[order.targetId!];

        // 状态更新已在 execute 中立即生效
        store.addReport({
            forceId: order.forceId,
            msg: `【内政】${target.name} 被流放了。`
        });
    }
}
