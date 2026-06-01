import { useGameStore } from '../state/useGameStore';

export interface CommandResult {
    success: boolean;
    message?: string;
}

export interface Command {
    execute(): CommandResult;
}

// 命令基类，包含通用的检验方法
export abstract class BaseCommand implements Command {
    protected store = useGameStore.getState();

    abstract execute(): CommandResult;

    protected checkMoney(cityId: number, amount: number): boolean {
        const city = this.store.cities[cityId];
        if (city.money < amount) {
            return false;
        }
        return true;
    }

    protected checkThew(personId: number, amount: number): boolean {
        const person = this.store.persons[personId];
        if (person.thew < amount) {
            return false;
        }
        return true;
    }

    protected getAckMessage(personId: number, customMessage?: string, customKingMessage?: string): string {
        const force = this.store.forces[this.store.playerForceId];
        if (force && force.kingId === personId) {
            return customKingMessage || "孤亲自去办。";
        }
        return customMessage || "臣领命！定不负所托！";
    }
}

