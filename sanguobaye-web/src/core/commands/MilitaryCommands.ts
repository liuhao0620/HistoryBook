import { BaseCommand } from './Command';
import type { CommandResult } from './Command';
import { useGameStore } from '../state/useGameStore';
import type { Order } from '../state/useGameStore';

export class ConscriptionCommand extends BaseCommand {
    private cityId: number;
    private personId: number;
    private arms: number;

    constructor(cityId: number, personId: number, arms: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
        this.arms = arms;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const city = store.cities[this.cityId];

        const COST_THEW = 4;

        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }
        if (city.money <= 0) {
            return { success: false, message: `府库空虚，没有金钱用于征兵。` };
        }

        const maxByDevotion = city.peopleDevotion * 10;
        const maxAffordable = city.money * 2;
        const maxAmount = Math.min(maxByDevotion, maxAffordable);
        
        let actualArms = Math.min(this.arms, maxAmount);
        const costMoney = Math.floor(actualArms / 2);

        // 立即生效
        store.updateCity(this.cityId, (c) => { 
            c.money -= costMoney;
            c.mothballArms += actualArms;
        });
        store.updatePerson(this.personId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'CONSCRIPTION',
            forceId: store.playerForceId,
            cityId: this.cityId,
            personId: this.personId,
            data: { arms: actualArms, costMoney }
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const city = store.cities[order.cityId!];
        const person = store.persons[order.personId!];
        const { arms, costMoney } = order.data;

        // 状态更新已在 execute 中立即生效
        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤在${city.name}征兵，` : `主公，臣在${city.name}征兵，`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}消耗金钱 ${costMoney}，招募了 ${arms} 名士兵。`,
            avatarId: person.id
        });
    }
}

export class ReconnoitreCommand extends BaseCommand {
    private personId: number;
    private targetCityId: number;

    constructor(personId: number, targetCityId: number) {
        super();
        this.personId = personId;
        this.targetCityId = targetCityId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();

        const COST_THEW = 10;
        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updatePerson(this.personId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'RECONNOITRE',
            forceId: store.playerForceId,
            personId: this.personId,
            targetId: this.targetCityId
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const person = store.persons[order.personId!];
        const targetCity = store.cities[order.targetId!];

        store.addDelayedTask({
            type: 'RECONNOITRE',
            monthsLeft: 1,
            forceId: order.forceId,
            data: { targetCityId: order.targetId, executorId: order.personId }
        });

        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤已出发前往侦察` : `主公，臣已出发前往侦察`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix} ${targetCity.name}。`,
            avatarId: person.id
        });
    }
}

export class DistributeCommand extends BaseCommand {
    private cityId: number;
    private personId: number;
    private targetArms: number;

    constructor(cityId: number, personId: number, targetArms: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
        this.targetArms = targetArms;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const city = store.cities[this.cityId];
        const person = store.persons[this.personId];

        const currentArms = person.arms || 0;
        const deltaArms = this.targetArms - currentArms;
        
        if (deltaArms > 0 && city.mothballArms < deltaArms) {
            return { success: false, message: `${city.name} 后备兵力不足以分配给 ${person.name}。` };
        }

        // 兵力分配比较特殊，不消耗体力且立即生效
        store.updateCity(this.cityId, (c) => { c.mothballArms -= deltaArms; });
        store.updatePerson(this.personId, (p) => { p.arms = this.targetArms; });

        store.addOrder({
            type: 'DISTRIBUTE',
            forceId: store.playerForceId,
            cityId: this.cityId,
            personId: this.personId,
            data: { targetArms: this.targetArms }
        });

        return { success: true, message: this.getAckMessage(this.personId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const person = store.persons[order.personId!];
        const { targetArms } = order.data;

        // 状态更新已在 execute 中立即生效
        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤的兵力已调整为` : `主公，臣的兵力已调整为`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix} ${targetArms}。`,
            avatarId: person.id
        });
    }
}

export class DepredateCommand extends BaseCommand {
    private cityId: number;
    private personId: number;

    constructor(cityId: number, personId: number) {
        super();
        this.cityId = cityId;
        this.personId = personId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();

        const COST_THEW = 10;
        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updatePerson(this.personId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'DEPREDATE',
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

        const gainFood = (person.iq + person.force) * 5;
        const gainMoney = (person.iq + person.force) * 2;

        store.updateCity(order.cityId!, (c) => {
            c.food += gainFood;
            c.money += gainMoney;
            c.peopleDevotion = Math.floor(c.peopleDevotion / 2);
            c.farming = Math.floor(c.farming / 2);
            c.commerce = Math.floor(c.commerce / 2);
        });

        const dropDevotion = city.peopleDevotion - Math.floor(city.peopleDevotion / 2);
        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤在${city.name}掠夺，` : `主公，臣在${city.name}掠夺，`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}获得了金钱 ${gainMoney}，粮草 ${gainFood}。\n但${city.name}的民忠下降了 ${dropDevotion} 点！`,
            avatarId: person.id
        });
    }
}

export class TransportationCommand extends BaseCommand {
    private fromCityId: number;
    private toCityId: number;
    private personId: number;
    private forceId: number;
    private money: number;
    private food: number;
    private arms: number;

    constructor(
        fromCityId: number,
        toCityId: number,
        personId: number,
        forceId: number,
        money: number,
        food: number,
        arms: number
    ) {
        super();
        this.fromCityId = fromCityId;
        this.toCityId = toCityId;
        this.personId = personId;
        this.forceId = forceId;
        this.money = money;
        this.food = food;
        this.arms = arms;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const city = store.cities[this.fromCityId];

        const COST_THEW = 10;
        if (!this.checkThew(this.personId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.personId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        if (city.money < this.money || city.food < this.food || city.mothballArms < this.arms) {
            store.addLog(`【军备】${city.name} 资源不足，无法输送。`);
            return { success: false };
        }

        store.updateCity(this.fromCityId, (c) => {
            c.money -= this.money;
            c.food -= this.food;
            c.mothballArms -= this.arms;
        });

        // 运输者离开当前城市
        store.updatePerson(this.personId, (p) => { 
            p.thew -= COST_THEW; 
            p.city = undefined;
        });

        store.addOrder({
            type: 'TRANSPORTATION',
            forceId: this.forceId,
            personId: this.personId,
            cityId: this.fromCityId,
            data: { toCityId: this.toCityId, money: this.money, food: this.food, arms: this.arms }
        });

        return { success: true, message: this.getAckMessage(this.personId, "末将领命！粮草辎重必保万无一失！", "孤亲自押送物资。") };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const person = store.persons[order.personId!];
        const city = store.cities[order.cityId!];
        const { toCityId, money, food, arms } = order.data;
        const toCity = store.cities[toCityId];

        store.addDelayedTask({
            type: 'TRANSPORT',
            monthsLeft: 1,
            forceId: order.forceId,
            data: { toCityId, money, food, arms, executorId: order.personId, fromCityId: order.cityId }
        });

        const isKing = store.forces[order.forceId]?.kingId === person.id;
        const msgPrefix = isKing ? `孤已从 ${city.name} 出发，` : `主公，臣已从 ${city.name} 出发，`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}向 ${toCity.name} 输送物资。`,
            avatarId: person.id
        });
    }
}

export class MoveCommand extends BaseCommand {
    private fromCityId: number;
    private toCityId: number;
    private personIds: number[];
    private forceId: number;

    constructor(
        fromCityId: number,
        toCityId: number,
        personIds: number[],
        forceId: number
    ) {
        super();
        this.fromCityId = fromCityId;
        this.toCityId = toCityId;
        this.personIds = personIds;
        this.forceId = forceId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        
        // 移动者立即离开当前城市
        this.personIds.forEach(pid => {
            store.updatePerson(pid, (p) => {
                p.city = undefined;
            });
        });

        store.addOrder({
            type: 'MOVE',
            forceId: this.forceId,
            cityId: this.fromCityId,
            data: { toCityId: this.toCityId, personIds: this.personIds }
        });

        return { success: true, message: this.getAckMessage(this.personIds[0], "末将领命！全军拔营！", "孤亲自统帅大军！") };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const city = store.cities[order.cityId!];
        const { toCityId, personIds } = order.data;
        const toCity = store.cities[toCityId];
        const firstPerson = store.persons[personIds[0]];

        store.addDelayedTask({
            type: 'MOVE',
            monthsLeft: 1,
            forceId: order.forceId,
            data: { toCityId, personIds }
        });

        const isKing = store.forces[order.forceId]?.kingId === firstPerson.id;
        const msgPrefix = isKing ? `大军已从 ${city.name} 出发，` : `主公，臣等已从 ${city.name} 出发，`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}移动前往 ${toCity.name}。`,
            avatarId: firstPerson.id
        });
    }
}

export class AttackCommand extends BaseCommand {
    private fromCityId: number;
    private toCityId: number;
    private personIds: number[];
    private forceId: number;

    constructor(
        fromCityId: number,
        toCityId: number,
        personIds: number[],
        forceId: number
    ) {
        super();
        this.fromCityId = fromCityId;
        this.toCityId = toCityId;
        this.personIds = personIds;
        this.forceId = forceId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        
        store.addOrder({
            type: 'ATTACK',
            forceId: this.forceId,
            cityId: this.fromCityId,
            data: { toCityId: this.toCityId, personIds: this.personIds }
        });

        return { success: true, message: this.getAckMessage(this.personIds[0], "末将领命！全军出击！", "孤亲自统帅大军出征！") };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const { toCityId, personIds } = order.data;
        const toCity = store.cities[toCityId];
        const firstPerson = store.persons[personIds[0]];

        store.addDelayedTask({
            type: 'ATTACK',
            monthsLeft: 1,
            forceId: order.forceId,
            data: { 
                targetCityId: toCityId, 
                executorIds: personIds, 
                fromCityId: order.cityId 
            }
        });

        const isKing = store.forces[order.forceId]?.kingId === firstPerson.id;
        const msgPrefix = isKing ? `向 ${toCity.name} 的出征命令已经下达，` : `主公，向 ${toCity.name} 的出征命令已经传达，`;

        store.addReport({
            forceId: order.forceId,
            msg: `${msgPrefix}大军将于下月兵临城下！`,
            avatarId: firstPerson.id
        });
    }
}

