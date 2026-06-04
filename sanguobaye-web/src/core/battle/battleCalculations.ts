import { ArmsType, TerrainType } from './BattleTypes';
import { AtkModulus, DfModulus, SubduModu, TerrDfModu, FgtIntMove } from './BattleConstants';

export interface UnitBaseStats {
    force: number;
    iq: number;
    level: number;
    armsType: ArmsType;
}

export function calculateUnitInitStats(stats: UnitBaseStats, thew: number) {
    const { force, iq, level, armsType } = stats;
    
    const maxHp = Math.floor((force * 0.8 + iq * 0.3 + level) * thew / 100);
    const maxMp = Math.floor((iq * 0.8 + Math.floor(Math.sqrt(force)) / 2 + level) * thew / 100);
    const moveRange = FgtIntMove[armsType] || 4;
    const maxArms = level * 100 + force * 10 + iq * 10;
    
    const attack = Math.floor(force * (level + 10) * (AtkModulus[armsType] || 1));
    const defense = Math.floor(iq * (level + 10) * (DfModulus[armsType] || 1));

    return { maxHp, maxMp, moveRange, maxArms, attack, defense };
}

export interface PhysicalDamageContext {
    attacker: {
        attack: number;
        armsCount: number;
        armsType: ArmsType;
    };
    defender: {
        defense: number;
        armsType: ArmsType;
        armsCount: number;
    };
    defenderTerrain: TerrainType;
}

export function calculatePhysicalDamage(ctx: PhysicalDamageContext): number {
    const { attacker, defender, defenderTerrain } = ctx;
    
    const defVal = Math.max(1, defender.defense * (TerrDfModu[defenderTerrain] || 1.0));
    let baseDmg = (attacker.attack / defVal) * (attacker.armsCount / 8);
    baseDmg *= SubduModu[attacker.armsType]?.[defender.armsType] || 1.0;
    baseDmg = Math.floor(baseDmg) + 10;
    
    return Math.min(defender.armsCount, baseDmg);
}

export interface SkillDamageContext {
    attacker: {
        iq: number;
        armsCount: number;
    };
    defender: {
        iq: number;
        armsCount: number;
    };
    skillId: number;
}

export function calculateSkillDamage(ctx: SkillDamageContext): number {
    const { attacker, defender, skillId } = ctx;
    let baseDmg = Math.floor((attacker.iq / Math.max(1, defender.iq)) * (attacker.armsCount / 5) + 20);
    if (skillId === 4) {
        baseDmg = Math.floor(baseDmg * 1.5); // 火攻伤害加成
    }
    return Math.min(defender.armsCount, baseDmg);
}

export function calculateFoodConsumption(totalArms: number): number {
    return Math.floor(Math.sqrt(totalArms) / 3);
}

export interface ExpContext {
    actualDmg: number;
    defenderArmsCountAfter: number;
    attackerLevel: number;
    defenderLevel: number;
}

export function calculateExperience(ctx: ExpContext): number {
    const { actualDmg, defenderArmsCountAfter, attackerLevel, defenderLevel } = ctx;
    const exp = Math.floor(actualDmg / 100) + 2;
    let bonus = 0;
    if (defenderArmsCountAfter <= 0) {
        const levelDiff = defenderLevel - attackerLevel;
        bonus = levelDiff > 0 ? 24 : (levelDiff === 0 ? 16 : 8);
    }
    return exp + bonus;
}
