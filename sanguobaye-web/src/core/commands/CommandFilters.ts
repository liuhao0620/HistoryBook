import type { Person } from '../models/Person';
import type { Force } from '../models/Force';
import type { City } from '../models/City';

export function getAvailableExecutors(
    cmd: string, 
    allPersons: Person[], 
    currentCityId: number, 
    playerForceId: number
): Person[] {
    const isTargetOnlyCmd = ['赏赐', '没收', '宴请', '处斩', '流放'].includes(cmd);
    let availablePersons = allPersons.filter(p => p.city === currentCityId);
    
    if (cmd === '处斩') {
        // 原版：GetCityCaptives，只能是本城俘虏（属于其他势力，但在本城）
        availablePersons = availablePersons.filter(p => p.belong !== playerForceId && p.belong !== 0);
    } else if (cmd === '流放') {
        // 原版：GetCityPersons + GetCityCaptives，本城己方武将+俘虏（排除在野）
        availablePersons = availablePersons.filter(p => p.belong !== 0);
    } else if (cmd === '没收') {
        availablePersons = availablePersons.filter(p => p.belong === playerForceId && p.equip && p.equip.length > 0);
    } else if (cmd === '赏赐') {
        availablePersons = availablePersons.filter(p => p.belong === playerForceId && (!p.equip || p.equip.length < 2));
    } else {
        // 其他内政/军备指令：必须是己方武将
        availablePersons = availablePersons.filter(p => p.belong === playerForceId);
        if (!isTargetOnlyCmd) {
            availablePersons = availablePersons.filter(p => !p.acted);
        }
    }
    return availablePersons;
}

export function getAvailableTargets(
    cmd: string, 
    allPersons: Person[], 
    currentCityId: number, 
    playerForceId: number,
    forces: Record<number, Force>,
    cities: Record<number, City>
): Person[] {
    let availablePersons = allPersons;
            
    if (cmd === '招降') {
        // 原版：GetCityCaptives，本城俘虏
        availablePersons = availablePersons.filter(p => p.city === currentCityId && p.belong !== playerForceId && p.belong !== 0);
    } else if (['离间', '招揽', '策反', '劝降'].includes(cmd)) {
        // 原版：外交指令对象均为敌方武将（非在野）
        availablePersons = availablePersons.filter(p => p.belong !== playerForceId && p.belong !== 0);
        
        if (cmd === '离间' || cmd === '招揽') {
            // 原版：GetEnemyPersons，必须非君主
            availablePersons = availablePersons.filter(p => {
                const force = forces[p.belong];
                return force && force.kingId !== p.id;
            });
        } else if (cmd === '策反') {
            // 原版：GetEnemySatraps，必须是太守且非君主
            availablePersons = availablePersons.filter(p => {
                const force = forces[p.belong];
                const city = p.city !== undefined ? cities[p.city] : null;
                const isSatrap = city && city.satrapId === p.id + 1;
                const isKing = force && force.kingId === p.id;
                return isSatrap && !isKing;
            });
        } else if (cmd === '劝降') {
            // 原版：GetEnemyKing，必须是君主
            availablePersons = availablePersons.filter(p => {
                const force = forces[p.belong];
                return force && force.kingId === p.id;
            });
        }
    }
    return availablePersons;
}
