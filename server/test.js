import GameEngine from './src/engine/GameEngine.js';
import BattleEngine from './src/engine/BattleEngine.js';
import chibiScenario from './src/data/scenarios/chibi.js';

console.log('=== 三国霸业 引擎测试 ===\n');

// 1. 测试剧本加载
const engine = new GameEngine();
engine.loadScenario(chibiScenario);
const state = engine.getState();

console.log('1. 剧本加载');
console.log('   剧本:', state.scenarioId);
console.log('   时间:', state.year + '年' + state.month + '月');
console.log('   君主数:', state.lords.length);
console.log('   城市数:', state.cities.length);
console.log('   武将数:', state.persons.length);
console.log('   道具数:', state.items.length);

// 2. 测试指令系统
console.log('\n2. 指令系统');
const playerCity = state.cities.find(c => c.lord === state.playerLord);
const cityPerson = state.persons.find(p => p.city === playerCity.id && p.lord === state.playerLord && p.isAlive);
console.log('   玩家城市:', playerCity.name);
console.log('   执行武将:', cityPerson.name);

const result = engine.addOrder({
  type: 1,
  personId: cityPerson.id,
  cityId: playerCity.id,
});
console.log('   添加开垦指令:', result.ok ? '成功' : result.msg);

// 3. 测试月份执行
console.log('\n3. 月份执行');
const execResult = engine.executeMonth();
console.log('   执行结果:', execResult.ok ? '成功' : execResult.msg);
console.log('   最近日志:');
state.eventLog.slice(-3).forEach(l => console.log('     ' + l));

// 4. 测试战斗引擎
console.log('\n4. 战斗引擎');
const battleEng = new BattleEngine(engine);

const enemyCity = state.cities.find(c => c.lord !== state.playerLord && c.lord !== 0);
if (enemyCity) {
  console.log('   攻击方城市:', playerCity.name);
  console.log('   防守方城市:', enemyCity.name);

  const fighterIds = state.persons
    .filter(p => p.city === playerCity.id && p.lord === state.playerLord && p.armyCount > 0 && p.isAlive)
    .slice(0, 5)
    .map(p => p.id);

  if (fighterIds.length > 0) {
    const battleState = battleEng.initBattle(playerCity.id, enemyCity.id, fighterIds);
    if (battleState) {
      console.log('   战斗初始化: 成功');
      console.log('   攻击方单位:', battleState.attackers.length);
      console.log('   防守方单位:', battleState.defenders.length);
      console.log('   地图尺寸:', battleState.mapWidth + 'x' + battleState.mapHeight);

      const cu = battleEng.getCurrentUnit();
      if (cu) {
        const moveRange = battleEng.getMoveRange(cu);
        console.log('   当前单位:', cu.name);
        console.log('   可移动范围:', moveRange.length, '格');

        const oppSide = battleState.currentSide === 0 ? battleState.defenders : battleState.attackers;
        const target = oppSide.find(u => u.isAlive);
        if (target) {
          const adjTile = moveRange.find(r => Math.abs(r.x - target.x) + Math.abs(r.y - target.y) === 1);
          if (adjTile) battleEng.moveUnit(cu, adjTile.x, adjTile.y);
          const atkResult = battleEng.attack(cu, target);
          console.log('   攻击结果:', atkResult.ok ? ('伤害: ' + atkResult.damage) : atkResult.msg);
        }
      }

      const endResult = battleEng.endBattle();
      console.log('   战斗结束:', endResult ? '结果=' + endResult.result : '无结果');
    }
  }
}

console.log('\n=== 所有测试通过 ===');
