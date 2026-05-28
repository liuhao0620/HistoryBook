# 剧本开发指南

## 概述

剧本是一个独立的 ES Module 文件，放在 `server/src/data/scenarios/` 目录下。引擎通过 `GameEngine.loadScenario(data)` 加载剧本，无需修改任何引擎代码。

接口定义参见 `shared/scenario-interface.js`。

## 剧本文件最小结构

```js
// server/src/data/scenarios/my-scenario.js
import { ARMY_TYPE, CHARACTER, KING_CHARACTER, CITY_STATE }
  from '../../../../shared/constants.js';

export default {
  id: 'my-scenario',          // 唯一 ID，用于 API 路由
  name: '我的剧本',
  description: '剧本简介',
  startYear: 190,             // 起始年份
  startMonth: 1,              // 起始月份 (1-12)

  playerLord: 1,              // 玩家控制的君主 ID

  lords: [ /* 君主列表 */ ],
  cities: [ /* 城市列表 */ ],
  persons: [ /* 武将列表 */ ],
  items: [ /* 道具列表，可选 */ ],
  battleMaps: { /* 战斗地图，可选 */ },
  scripts: { /* 脚本钩子，可选 */ },
};
```

## 数据结构

### 君主 (Lord)

```js
{ id: 1, name: '曹操', character: KING_CHARACTER.DUPLICITY, color: '#ef4444' }
```

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 唯一标识，用于 `city.lord`、`person.lord` |
| name | string | 显示名称 |
| character | number | `KING_CHARACTER.PEACE/JUSTICE/DUPLICITY/CRAZY/RASH` |
| color | string | CSS 颜色，用于地图和战斗标识 |

### 城市 (City)

```js
{
  id: 1, name: '洛阳',
  lord: 2,                    // 归属君主 ID（0=无主）
  governor: 0,                // 太守 ID（0=无）
  state: CITY_STATE.NORMAL,
  farmingLimit: 1500, farming: 1000,
  commerceLimit: 1800, commerce: 1200,
  devotion: 80,               // 民忠 0-100
  disasterDef: 55,            // 防灾 0-100
  populationLimit: 200000, population: 120000,
  money: 10000, food: 50000,
  reserveArmy: 15000,         // 后备兵力
  x: 50, y: 30,               // 地图坐标（前端渲染用）
  links: [2, 3],              // 相邻城市 ID
  battleMapId: 1,             // 战斗地图 ID（mapId → battleMaps[mapId]）
}
```

### 武将 (Person)

```js
{
  id: 101, name: '关羽',
  lord: 3,                    // 归属君主（0=在野）
  city: 10,                   // 所在城市 ID
  level: 8,
  force: 97,                  // 武力
  iq: 75,                     // 智力
  devotion: 99,               // 忠诚度 0-100
  character: CHARACTER.LOYAL, // 性格
  experience: 0,
  thew: 95,                   // 体力 0-100
  armyType: ARMY_TYPE.CAVALRY,// 兵种
  armyCount: 8000,            // 当前带兵数
  equipment: [0, 0],          // [武器ID, 防具ID]
  age: 45,
  skills: [30, 31],           // 技能 ID 列表（预留）
  portraitId: 23,             // 头像 ID（前端渲染用）
}
```

### 道具 (Item)

```js
{
  id: 1, name: '青龙偃月刀', desc: '关羽的宝刀',
  type: 1,                    // 0=消耗品 1=武器 2=防具 3=坐骑 4=兵书
  atkBonus: 15,               // 武力加成
  iqBonus: 0,                 // 智力加成
  moveBonus: 0,               // 移动力加成
  armyChange: -1,             // 兵种改变（-1=不改变）
  atkRange: [],               // 攻击范围数据（预留）
  price: 5000,
}
```

### 战斗地图 (battleMaps)

可选。如果不提供，战斗引擎会随机生成地图。

```js
battleMaps: {
  1: {
    width: 16, height: 12,
    tiles: [
      // 地形数据，12 行 × 16 列
      [7,7,2,2,0,0,0,0,0,0,0,0,2,2,7,7],  // TERRAIN 枚举值
      [7,0,0,0,0,1,1,1,1,1,1,0,0,0,0,7],
      // ...
    ],
    cityX: 13, cityY: 3,      // 城池位置
    atkSpawnX: 2, atkSpawnY: 9,  // 攻击方出生区域
    defSpawnX: 11, defSpawnY: 6, // 防守方出生区域
  },
}
```

地形枚举值（`shared/constants.js → TERRAIN`）：
`0=草地 1=平原 2=山地 3=森林 4=村庄 5=城池 6=营寨 7=河流`

### 脚本钩子 (scripts)

所有钩子均可选。引擎在特定时机调用。

```js
scripts: {
  onStart: (engine) => {
    // 剧本加载后调用
    // engine 提供所有数据访问方法
    engine._log('剧本开始！');
  },

  onMonthStart: (engine) => {
    // 每月指令执行前调用
  },

  onMonthEnd: (engine) => {
    // 每月指令执行后、时间推进前调用
    // 适合放置历史事件：
    if (engine.year === 208 && engine.month === 11) {
      engine._log('赤壁之战爆发！');
    }
  },

  onBattleStart: (engine, battleState) => {
    // 战斗初始化后调用
  },

  onBattleEnd: (engine, result) => {
    // 战斗结算后调用
    // result: { result: BATTLE_RESULT, atkSurvivors, defSurvivors, log }
  },

  onPersonDie: (engine, person) => {
    // 武将死亡时调用
  },

  onCityChange: (engine, city, oldLord, newLord) => {
    // 城市易主时调用
  },
}
```

## 注册新剧本

1. 在 `server/src/data/scenarios/` 下创建 `.js` 文件
2. 修改 `server/src/index.js` 的 `loadScenario` 逻辑，加入新剧本的加载和路由

当前加载逻辑（index.js）：

```js
let chibiScenario = null; // ← 为每个剧本添加一个变量

async function loadChibiScenario() { /* ... */ }

// API handler:
app.post('/api/game/new', (req, res) => {
  const { scenarioId } = req.body;
  const scenario = scenarioId === 'chibi' ? chibiScenario
                 : scenarioId === 'new-id' ? newScenario
                 : null;
  // ...
});
```

后续可以改进为自动扫描 `scenarios/` 目录下的所有 `.js` 文件。

## 示例：从原版 dat.lib 提取数据

原版《三国霸业》将数据编译在 `dat.lib` 二进制文件中。提取方式参考原项目中的 `bind-objects.c` 和 `data-bind.c`：

1. 使用 msgpack 或直接读取 `dat.lib` 的结构体序列
2. 映射到上述 JS 数据结构
3. 输出为剧本 JS 文件

一个批量提取的简单思路：

```js
// 伪代码
const fs = require('fs');
const buf = fs.readFileSync('dat.lib');
// 按 offsetof 读取 CityType / PersonType 结构体
// 写入 scenario.js
```

## 测试剧本

```bash
cd server
# 创建临时测试脚本
node -e "
import('./src/data/scenarios/my-scenario.js').then(m => {
  const GameEngine = (await import('./src/engine/GameEngine.js')).default;
  const engine = new GameEngine();
  engine.loadScenario(m.default);
  console.log('OK:', engine.year, engine.cities.length, 'cities');
});
"
```
