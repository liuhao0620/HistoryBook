import { useGameStore } from '../state/useGameStore';

export class AIBattleSimulator {
    static simulateBattle(attackerForceId: number, defenderForceId: number, targetCityId: number, attackerIds: number[], defenderIds: number[]) {
        const store = useGameStore.getState();
        
        let attackerTotalPower = 0;
        attackerIds.forEach(id => {
            const p = store.persons[id];
            if (p) {
                attackerTotalPower += (p.force + p.iq) * (p.arms || 0);
            }
        });

        let defenderTotalPower = 0;
        defenderIds.forEach(id => {
            const p = store.persons[id];
            if (p) {
                defenderTotalPower += (p.force + p.iq) * (p.arms || 0);
            }
        });
        
        // 守城方有防御加成 (比如 20%)
        defenderTotalPower *= 1.2;

        const attackerWinProb = attackerTotalPower / (attackerTotalPower + defenderTotalPower || 1);
        const attackerWins = Math.random() < attackerWinProb;

        // 计算战损
        const attackerLossRatio = attackerWins ? 0.2 + Math.random() * 0.2 : 0.5 + Math.random() * 0.3;
        const defenderLossRatio = attackerWins ? 0.5 + Math.random() * 0.3 : 0.2 + Math.random() * 0.2;

        attackerIds.forEach(id => {
            store.updatePerson(id, p => {
                p.arms = Math.floor((p.arms || 0) * (1 - attackerLossRatio));
            });
        });

        defenderIds.forEach(id => {
            store.updatePerson(id, p => {
                p.arms = Math.floor((p.arms || 0) * (1 - defenderLossRatio));
            });
        });

        const attackerKing = store.persons[store.forces[attackerForceId]?.kingId];
        const defenderKing = store.persons[store.forces[defenderForceId]?.kingId];
        const attackerName = attackerKing ? attackerKing.name : '未知';
        const defenderName = defenderKing ? defenderKing.name : '未知';
        const cityName = store.cities[targetCityId].name;

        let reportMsg = '';
        if (attackerWins) {
            // 更新城市归属
            store.updateCity(targetCityId, c => {
                c.belong = attackerForceId;
            });
            // 攻方武将进驻新城市
            attackerIds.forEach(id => {
                store.updatePerson(id, p => {
                    p.city = targetCityId;
                });
            });
            
            // 守方武将撤退到本势力其他城市，如果没有则下野
            const defenderCities = Object.values(store.cities).filter(c => c.belong === defenderForceId && c.id !== targetCityId);
            if (defenderCities.length > 0) {
                const retreatCityId = defenderCities[Math.floor(Math.random() * defenderCities.length)].id;
                defenderIds.forEach(id => {
                    store.updatePerson(id, p => {
                        p.city = retreatCityId;
                    });
                });
            } else {
                // 势力覆灭，武将下野（或者可以设定为被俘虏，这里简单处理为下野）
                defenderIds.forEach(id => {
                    store.updatePerson(id, p => {
                        p.belong = 255;
                        p.city = targetCityId; // 留在原地成为在野武将
                    });
                });
            }

            reportMsg = `【战报】${attackerName}军 进攻了 ${cityName}，取得胜利，成功占领该城！`;
        } else {
            reportMsg = `【战报】${attackerName}军 进攻了 ${cityName}，被 ${defenderName}军 击退！`;
        }

        return {
            attackerWins,
            reportMsg
        };
    }
}
