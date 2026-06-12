import { BaseCommand } from './Command';
import type { CommandResult } from './Command';
import { useGameStore } from '../state/useGameStore';
import type { Order } from '../state/useGameStore';

export class AlienateCommand extends BaseCommand {
    executorCityId: number;
    executorId: number;
    targetId: number;

    constructor(executorCityId: number, executorId: number, targetId: number) {
        super();
        this.executorCityId = executorCityId;
        this.executorId = executorId;
        this.targetId = targetId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const COST_MONEY = 100;
        const COST_THEW = 10;

        if (!this.checkMoney(this.executorCityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.executorId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.executorId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.executorCityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.executorId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'ALIENATE',
            forceId: store.playerForceId,
            cityId: this.executorCityId,
            personId: this.executorId,
            targetId: this.targetId
        });

        return { success: true, message: this.getAckMessage(this.executorId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const executor = store.persons[order.personId!];
        const targetPerson = store.persons[order.targetId!];
        const targetName = targetPerson ? targetPerson.name : `目标(${order.targetId})`;
        const isKing = store.forces[order.forceId]?.kingId === executor.id;

        store.addDelayedTask({
            type: 'DIPLOMACY',
            monthsLeft: 1,
            forceId: order.forceId,
            data: {
                subtype: 'Alienate',
                executorId: order.personId,
                targetId: order.targetId
            }
        });

        store.addReport({
            forceId: order.forceId,
            msg: isKing ? `孤已出发前往离间 ${targetName}，预计需要 10 个月。` : `主公，臣已出发前往离间 ${targetName}，预计需要 10 个月。`,
            avatarId: executor.id
        });
    }
}

export class CanvassCommand extends BaseCommand {
    executorCityId: number;
    executorId: number;
    targetId: number;

    constructor(executorCityId: number, executorId: number, targetId: number) {
        super();
        this.executorCityId = executorCityId;
        this.executorId = executorId;
        this.targetId = targetId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const COST_MONEY = 100;
        const COST_THEW = 10;

        if (!this.checkMoney(this.executorCityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.executorId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.executorId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.executorCityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.executorId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'CANVASS',
            forceId: store.playerForceId,
            cityId: this.executorCityId,
            personId: this.executorId,
            targetId: this.targetId
        });

        return { success: true, message: this.getAckMessage(this.executorId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const executor = store.persons[order.personId!];
        const targetPerson = store.persons[order.targetId!];
        const targetName = targetPerson ? targetPerson.name : `目标(${order.targetId})`;
        const isKing = store.forces[order.forceId]?.kingId === executor.id;

        store.addDelayedTask({
            type: 'DIPLOMACY',
            monthsLeft: 1,
            forceId: order.forceId,
            data: {
                subtype: 'Canvass',
                executorId: order.personId,
                targetId: order.targetId
            }
        });

        store.addReport({
            forceId: order.forceId,
            msg: isKing ? `孤已出发前往拉拢 ${targetName}，预计需要 10 个月。` : `主公，臣已出发前往拉拢 ${targetName}，预计需要 10 个月。`,
            avatarId: executor.id
        });
    }
}

export class CounterespionageCommand extends BaseCommand {
    executorCityId: number;
    executorId: number;
    targetId: number;

    constructor(executorCityId: number, executorId: number, targetId: number) {
        super();
        this.executorCityId = executorCityId;
        this.executorId = executorId;
        this.targetId = targetId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const COST_MONEY = 100;
        const COST_THEW = 10;

        if (!this.checkMoney(this.executorCityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.executorId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.executorId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.executorCityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.executorId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'COUNTERESPIONAGE',
            forceId: store.playerForceId,
            cityId: this.executorCityId,
            personId: this.executorId,
            targetId: this.targetId
        });

        return { success: true, message: this.getAckMessage(this.executorId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const executor = store.persons[order.personId!];
        const targetPerson = store.persons[order.targetId!];
        const targetName = targetPerson ? targetPerson.name : `目标(${order.targetId})`;
        const isKing = store.forces[order.forceId]?.kingId === executor.id;

        store.addDelayedTask({
            type: 'DIPLOMACY',
            monthsLeft: 1,
            forceId: order.forceId,
            data: {
                subtype: 'Counterespionage',
                executorId: order.personId,
                targetId: order.targetId
            }
        });

        store.addReport({
            forceId: order.forceId,
            msg: isKing ? `孤已出发前往对 ${targetName} 施展反间计，预计需要 10 个月。` : `主公，臣已出发前往对 ${targetName} 施展反间计，预计需要 10 个月。`,
            avatarId: executor.id
        });
    }
}

export class InduceCommand extends BaseCommand {
    executorCityId: number;
    executorId: number;
    targetId: number;

    constructor(executorCityId: number, executorId: number, targetId: number) {
        super();
        this.executorCityId = executorCityId;
        this.executorId = executorId;
        this.targetId = targetId;
    }

    execute(): CommandResult {
        const store = useGameStore.getState();
        const COST_MONEY = 100;
        const COST_THEW = 10;

        if (!this.checkMoney(this.executorCityId, COST_MONEY)) return { success: false, message: `府库空虚，无钱可用...（需要金钱 ${COST_MONEY}）` };
        if (!this.checkThew(this.executorId, COST_THEW)) {
            const isKing = this.store.forces[this.store.playerForceId]?.kingId === this.executorId;
            return { success: false, message: isKing ? `孤体力不支，无法亲自处理此事...（需要体力 ${COST_THEW}）` : `臣体力不支，无法从命...（需要体力 ${COST_THEW}）` };
        }

        store.updateCity(this.executorCityId, (c) => { c.money -= COST_MONEY; });
        store.updatePerson(this.executorId, (p) => { p.thew -= COST_THEW; });

        store.addOrder({
            type: 'INDUCE',
            forceId: store.playerForceId,
            cityId: this.executorCityId,
            personId: this.executorId,
            targetId: this.targetId
        });

        return { success: true, message: this.getAckMessage(this.executorId) };
    }

    static resolve(order: Order) {
        const store = useGameStore.getState();
        const executor = store.persons[order.personId!];
        const targetPerson = store.persons[order.targetId!];
        const targetName = targetPerson ? targetPerson.name : `目标(${order.targetId})`;
        const isKing = store.forces[order.forceId]?.kingId === executor.id;

        store.addDelayedTask({
            type: 'DIPLOMACY',
            monthsLeft: 1,
            forceId: order.forceId,
            data: {
                subtype: 'Induce',
                executorId: order.personId,
                targetId: order.targetId
            }
        });

        store.addReport({
            forceId: order.forceId,
            msg: isKing ? `孤已出发前往劝降 ${targetName}，预计需要 10 个月。` : `主公，臣已出发前往劝降 ${targetName}，预计需要 10 个月。`,
            avatarId: executor.id
        });
    }
}
