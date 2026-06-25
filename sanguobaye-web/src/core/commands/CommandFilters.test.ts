import { describe, it, expect } from 'vitest';
import { getAvailableExecutors, getAvailableTargets } from './CommandFilters';
import type { Person } from '../models/Person';
import type { Force } from '../models/Force';
import type { City } from '../models/City';

describe('CommandFilters', () => {
    const playerForceId = 1;
    const enemyForceId = 2;
    const currentCityId = 10;

    const makePerson = (overrides: Partial<Person>): Person => ({
        id: 0,
        name: '武将',
        belong: 0,
        oldBelong: 0,
        force: 50,
        iq: 50,
        thew: 100,
        devotion: 80,
        experience: 0,
        level: 1,
        age: 30,
        armsType: 0,
        arms: 0,
        equip: [],
        character: 0,
        acted: false,
        ...overrides,
    });

    const makeCity = (overrides: Partial<City>): City => ({
        id: 0,
        name: '城池',
        belong: 0,
        satrapId: 0,
        state: 0,
        farming: 0,
        farmingLimit: 0,
        commerce: 0,
        commerceLimit: 0,
        peopleDevotion: 0,
        avoidCalamity: 0,
        population: 0,
        populationLimit: 0,
        money: 0,
        food: 0,
        mothballArms: 0,
        personQueue: [],
        toolQueue: [],
        ...overrides,
    });

    const mockPersons: Person[] = [
        makePerson({ id: 1, name: '玩家君主', city: currentCityId, belong: playerForceId }),
        makePerson({ id: 2, name: '玩家武将A', city: currentCityId, belong: playerForceId, equip: [1] }),
        makePerson({ id: 3, name: '玩家武将B(满装备)', city: currentCityId, belong: playerForceId, equip: [2, 3] }),
        makePerson({ id: 4, name: '玩家武将C(已行动)', city: currentCityId, belong: playerForceId, acted: true }),
        makePerson({ id: 5, name: '敌方君主', city: 11, belong: enemyForceId }),
        makePerson({ id: 6, name: '敌方太守', city: 11, belong: enemyForceId }),
        makePerson({ id: 7, name: '敌方武将', city: 11, belong: enemyForceId }),
        makePerson({ id: 8, name: '本城俘虏', city: currentCityId, belong: enemyForceId }),
        makePerson({ id: 9, name: '在野武将', city: currentCityId, belong: 0 }),
        makePerson({ id: 10, name: '其他城己方武将', city: 12, belong: playerForceId }),
    ];

    const mockForces: Record<number, Force> = {
        [playerForceId]: { id: playerForceId, kingId: 1, character: 0, color: '#ff0000' },
        [enemyForceId]: { id: enemyForceId, kingId: 5, character: 0, color: '#0000ff' },
    };

    const mockCities: Record<number, City> = {
        [currentCityId]: makeCity({ id: currentCityId, name: '主城', belong: playerForceId, satrapId: 2 }), // satrapId = personId + 1
        11: makeCity({ id: 11, name: '敌城', belong: enemyForceId, satrapId: 7 }), // satrapId = 7 (person 6)
        12: makeCity({ id: 12, name: '其他城', belong: playerForceId, satrapId: 0 }),
    };

    describe('getAvailableExecutors', () => {
        it('should filter persons in the current city for normal commands', () => {
            const result = getAvailableExecutors('开垦', mockPersons, currentCityId, playerForceId);
            expect(result.map(p => p.id)).toEqual([1, 2, 3]); // Only unacted player persons in currentCityId
        });

        it('should allow acted persons for target-only commands like 赏赐', () => {
            const result = getAvailableExecutors('宴请', mockPersons, currentCityId, playerForceId);
            expect(result.map(p => p.id)).toEqual([1, 2, 3, 4]); // Includes acted person (id 4)
        });

        it('should only return captives for 处斩', () => {
            const result = getAvailableExecutors('处斩', mockPersons, currentCityId, playerForceId);
            expect(result.map(p => p.id)).toEqual([8]); // Only '本城俘虏'
        });

        it('should return player persons and captives for 流放 (exclude free persons)', () => {
            const result = getAvailableExecutors('流放', mockPersons, currentCityId, playerForceId);
            expect(result.map(p => p.id)).toEqual([1, 2, 3, 4, 8]); // All non-free persons in city
        });

        it('should only return persons with equipment for 没收', () => {
            const result = getAvailableExecutors('没收', mockPersons, currentCityId, playerForceId);
            expect(result.map(p => p.id)).toEqual([2, 3]); // Only persons with equip length > 0
        });

        it('should only return persons with less than 2 equipments for 赏赐', () => {
            const result = getAvailableExecutors('赏赐', mockPersons, currentCityId, playerForceId);
            expect(result.map(p => p.id)).toEqual([1, 2, 4]); // Excludes id 3 (full equip)
        });
    });

    describe('getAvailableTargets', () => {
        it('should only return captives in the current city for 招降', () => {
            const result = getAvailableTargets('招降', mockPersons, currentCityId, playerForceId, mockForces, mockCities);
            expect(result.map(p => p.id)).toEqual([8]); // Only '本城俘虏'
        });

        it('should return non-king enemy persons for 离间 and 招揽', () => {
            const alienateResult = getAvailableTargets('离间', mockPersons, currentCityId, playerForceId, mockForces, mockCities);
            expect(alienateResult.map(p => p.id)).toEqual([6, 7, 8]); // Enemy persons excluding king (id 5)
            
            const canvassResult = getAvailableTargets('招揽', mockPersons, currentCityId, playerForceId, mockForces, mockCities);
            expect(canvassResult.map(p => p.id)).toEqual([6, 7, 8]);
        });

        it('should return enemy satraps (excluding kings) for 策反', () => {
            const result = getAvailableTargets('策反', mockPersons, currentCityId, playerForceId, mockForces, mockCities);
            expect(result.map(p => p.id)).toEqual([6]); // Only id 6 is a satrap (satrapId 7) and not king
        });

        it('should return enemy kings for 劝降', () => {
            const result = getAvailableTargets('劝降', mockPersons, currentCityId, playerForceId, mockForces, mockCities);
            expect(result.map(p => p.id)).toEqual([5]); // Only enemy king
        });

        it('should return all persons for other commands (no special filtering in getAvailableTargets)', () => {
            const result = getAvailableTargets('侦察', mockPersons, currentCityId, playerForceId, mockForces, mockCities);
            expect(result.length).toBe(mockPersons.length);
        });
    });
});
