import { describe, it, expect } from 'vitest';
import {
    calculateUnitInitStats,
    calculatePhysicalDamage,
    calculateSkillDamage,
    calculateFoodConsumption,
    calculateExperience
} from '../battleCalculations';
import type {
    UnitBaseStats,
    PhysicalDamageContext,
    SkillDamageContext,
    ExpContext
} from '../battleCalculations';
import { ArmsType, TerrainType } from '../BattleTypes';

describe('battleCalculations', () => {
    describe('calculateUnitInitStats', () => {
        it('should calculate initial stats correctly for INFANTRY', () => {
            const stats: UnitBaseStats = {
                force: 80,
                iq: 70,
                level: 5,
                armsType: ArmsType.INFANTRY
            };
            const thew = 100;
            const result = calculateUnitInitStats(stats, thew);
            
            // maxHp: Math.floor((80*0.8 + 70*0.3 + 5)*1) = Math.floor(64 + 21 + 5) = 90
            expect(result.maxHp).toBe(90);
            
            // maxMp: Math.floor((70*0.8 + floor(sqrt(80))/2 + 5)*1) = Math.floor(56 + floor(8.94)/2 + 5) = floor(56 + 4 + 5) = 65
            expect(result.maxMp).toBe(65);
            
            // moveRange: INFANTRY -> 4
            expect(result.moveRange).toBe(4);
            
            // maxArms: 5*100 + 80*10 + 70*10 = 500 + 800 + 700 = 2000
            expect(result.maxArms).toBe(2000);
            
            // attack: Math.floor(80 * (5+10) * AtkModulus[INFANTRY]=0.8) = floor(1200 * 0.8) = 960
            expect(result.attack).toBe(960);
            
            // defense: Math.floor(70 * (5+10) * DfModulus[INFANTRY]=1.2) = floor(1050 * 1.2) = 1260
            expect(result.defense).toBe(1260);
        });
    });

    describe('calculatePhysicalDamage', () => {
        it('should calculate physical damage correctly', () => {
            const ctx: PhysicalDamageContext = {
                attacker: {
                    attack: 1000,
                    armsCount: 1000,
                    armsType: ArmsType.CAVALRY
                },
                defender: {
                    defense: 800,
                    armsCount: 2000,
                    armsType: ArmsType.INFANTRY
                },
                defenderTerrain: TerrainType.PLAIN
            };
            
            // defVal: max(1, 800 * 1.0) = 800
            // baseDmg: (1000 / 800) * (1000 / 8) = 1.25 * 125 = 156.25
            // baseDmg *= CAVALRY vs INFANTRY (1.2) -> 156.25 * 1.2 = 187.5
            // baseDmg = floor(187.5) + 10 = 197
            
            const dmg = calculatePhysicalDamage(ctx);
            expect(dmg).toBe(197);
        });

        it('should cap damage to defender armsCount', () => {
            const ctx: PhysicalDamageContext = {
                attacker: {
                    attack: 5000,
                    armsCount: 5000,
                    armsType: ArmsType.CAVALRY
                },
                defender: {
                    defense: 100,
                    armsCount: 50, // lower than calculated dmg
                    armsType: ArmsType.INFANTRY
                },
                defenderTerrain: TerrainType.PLAIN
            };
            
            const dmg = calculatePhysicalDamage(ctx);
            expect(dmg).toBe(50);
        });
    });

    describe('calculateSkillDamage', () => {
        it('should calculate basic skill damage', () => {
            const ctx: SkillDamageContext = {
                attacker: {
                    iq: 90,
                    armsCount: 1000
                },
                defender: {
                    iq: 50,
                    armsCount: 2000
                },
                skillId: 1
            };
            
            // baseDmg = floor((90 / 50) * (1000 / 5) + 20) = floor(1.8 * 200 + 20) = 380
            const dmg = calculateSkillDamage(ctx);
            expect(dmg).toBe(380);
        });

        it('should apply skillId 4 multiplier', () => {
            const ctx: SkillDamageContext = {
                attacker: {
                    iq: 90,
                    armsCount: 1000
                },
                defender: {
                    iq: 50,
                    armsCount: 2000
                },
                skillId: 4
            };
            
            // baseDmg = 380 * 1.5 = 570
            const dmg = calculateSkillDamage(ctx);
            expect(dmg).toBe(570);
        });
    });

    describe('calculateFoodConsumption', () => {
        it('should calculate food consumption based on total arms', () => {
            expect(calculateFoodConsumption(900)).toBe(10); // sqrt(900) / 3 = 30 / 3 = 10
            expect(calculateFoodConsumption(1000)).toBe(10); // sqrt(1000) = 31.62 -> /3 = 10.54 -> floor -> 10
        });
    });

    describe('calculateExperience', () => {
        it('should calculate exp without kill bonus', () => {
            const ctx: ExpContext = {
                actualDmg: 550,
                defenderArmsCountAfter: 100,
                attackerLevel: 5,
                defenderLevel: 5
            };
            // exp = floor(550/100) + 2 = 5 + 2 = 7
            expect(calculateExperience(ctx)).toBe(7);
        });

        it('should calculate exp with kill bonus when attacker level < defender level', () => {
            const ctx: ExpContext = {
                actualDmg: 550,
                defenderArmsCountAfter: 0,
                attackerLevel: 3,
                defenderLevel: 5
            };
            // levelDiff = 2 > 0 -> bonus = 24
            // exp = 7 + 24 = 31
            expect(calculateExperience(ctx)).toBe(31);
        });

        it('should calculate exp with kill bonus when attacker level == defender level', () => {
            const ctx: ExpContext = {
                actualDmg: 550,
                defenderArmsCountAfter: 0,
                attackerLevel: 5,
                defenderLevel: 5
            };
            // levelDiff = 0 -> bonus = 16
            // exp = 7 + 16 = 23
            expect(calculateExperience(ctx)).toBe(23);
        });

        it('should calculate exp with kill bonus when attacker level > defender level', () => {
            const ctx: ExpContext = {
                actualDmg: 550,
                defenderArmsCountAfter: 0,
                attackerLevel: 8,
                defenderLevel: 5
            };
            // levelDiff = -3 -> bonus = 8
            // exp = 7 + 8 = 15
            expect(calculateExperience(ctx)).toBe(15);
        });
    });
});
