// ============================================
// 三国霸业 - 游戏常量定义
// ============================================

// 兵种定义
export const ARMY_TYPE = {
  CAVALRY: 0,    // 骑兵
  INFANTRY: 1,   // 步兵
  ARCHER: 2,     // 弓箭兵
  NAVY: 3,       // 水军
  ELITE: 4,      // 极兵
  MYSTIC: 5,     // 玄兵
};

export const ARMY_NAMES = ['骑兵', '步兵', '弓箭兵', '水军', '极兵', '玄兵'];

export const ARMY_MOVE = {
  [ARMY_TYPE.CAVALRY]: 5,
  [ARMY_TYPE.INFANTRY]: 4,
  [ARMY_TYPE.ARCHER]: 4,
  [ARMY_TYPE.NAVY]: 5,
  [ARMY_TYPE.ELITE]: 6,
  [ARMY_TYPE.MYSTIC]: 3,
};

// 战斗地形
export const TERRAIN = {
  GRASS: 0,     // 草地
  PLAINS: 1,    // 平原
  HILLS: 2,     // 山地
  FOREST: 3,    // 森林
  VILLAGE: 4,   // 村庄
  CITY: 5,      // 城池
  CAMP: 6,      // 营寨
  RIVER: 7,     // 河流
};

export const TERRAIN_NAMES = ['草地', '平原', '山地', '森林', '村庄', '城池', '营寨', '河流'];

// 各地形对不同兵种的移动力阻力 (值=消耗的移动力, 255=不可通行)
export const TERRAIN_MOVE_COST = {
  [TERRAIN.GRASS]:  [1, 1, 1, 1, 1, 1],
  [TERRAIN.PLAINS]: [1, 1, 1, 1, 1, 1],
  [TERRAIN.HILLS]:  [2, 2, 2, 3, 2, 2],
  [TERRAIN.FOREST]: [3, 2, 2, 3, 2, 2],
  [TERRAIN.VILLAGE]:[1, 1, 1, 1, 1, 1],
  [TERRAIN.CITY]:   [1, 1, 1, 1, 1, 1],
  [TERRAIN.CAMP]:   [1, 1, 1, 1, 1, 1],
  [TERRAIN.RIVER]:  [255, 255, 255, 1, 255, 255],
};

// 各地形对不同兵种的战力加成 (%) 
export const TERRAIN_POWER_MOD = {
  [TERRAIN.GRASS]:  [100, 100, 100, 80, 100, 100],
  [TERRAIN.PLAINS]: [110, 110, 100, 80, 110, 100],
  [TERRAIN.HILLS]:  [80, 100, 110, 80, 100, 100],
  [TERRAIN.FOREST]: [80, 110, 80, 80, 100, 100],
  [TERRAIN.VILLAGE]:[100, 100, 100, 100, 100, 100],
  [TERRAIN.CITY]:   [100, 120, 120, 80, 120, 120],
  [TERRAIN.CAMP]:   [100, 120, 100, 80, 110, 110],
  [TERRAIN.RIVER]:  [80, 80, 80, 110, 80, 80],
};

// 兵种相克系数 (攻方对守方的伤害倍率)
export const ARMY_COUNTER_MOD = [
  [100, 120, 130, 100, 100, 100], // 骑兵攻
  [80,  100, 80,  100, 80,  80],  // 步兵攻
  [60,  100, 100, 80,  80,  80],  // 弓箭兵攻
  [100, 100, 100, 100, 80,  80],  // 水军攻
  [120, 130, 130, 120, 100, 120], // 极兵攻
  [100, 110, 110, 100, 100, 100], // 玄兵攻
];

export const ARMY_ATK_MOD = [100, 90, 85, 95, 110, 105];
export const ARMY_DEF_MOD = [100, 110, 80, 100, 120, 110];

// 战斗状态
export const BATTLE_STATE = {
  NORMAL: 0,   // 正常
  CONFUSED: 1, // 混乱
  SILENCED: 2, // 禁咒
  ROOTED: 3,   // 定身
  QIMEN: 4,    // 奇门
  DUNJIA: 5,   // 遁甲
  STONE: 6,    // 石阵
  HIDDEN: 7,   // 潜踪
  DEAD: 8,     // 死亡
};

export const WEATHER = {
  FINE: 0,     // 晴
  CLOUDY: 1,   // 阴
  WIND: 2,     // 风
  RAIN: 3,     // 雨
  HAIL: 4,     // 冰雹
};

export const CHARACTER = {
  LOYAL: 4,       // 忠义
  AMBITIOUS: 3,   // 大志
  GREEDY: 2,      // 贪财
  COWARD: 1,      // 怕死
  RASH: 0,        // 卤莽
};

export const KING_CHARACTER = {
  PEACE: 4,      // 和平
  JUSTICE: 3,    // 大义
  DUPLICITY: 2,  // 奸诈
  CRAZY: 1,      // 狂人
  RASH: 0,       // 冒进
};

export const CITY_STATE = {
  NORMAL: 0,     // 正常
  FAMINE: 1,     // 饥荒
  DROUGHT: 2,    // 旱灾
  FLOOD: 3,      // 水灾
  REBELLION: 4,  // 暴动
};

export const ORDER_CATEGORY = {
  INTERIOR: 'interior',
  DIPLOMACY: 'diplomacy',
  ARMAMENT: 'armament',
};

export const INTERIOR_ORDERS = {
  NOP: 0, ASSART: 1, COMMERCE: 2, SEARCH: 3, GOVERN: 4,
  INSPECT: 5, SURRENDER: 6, EXECUTE: 7, BANISH: 8, REWARD: 9,
  CONFISCATE: 10, TRADE: 11, FEAST: 12, TRANSPORT: 13, MOVE: 14,
  APPOINT: 28, DISTRIBUTE: 25, PILLAGE: 26,
};

export const DIPLOMACY_ORDERS = {
  ALIENATE: 15, RECRUIT: 16, SUBVERT: 17, COUNTER_SPY: 18, PERSUADE: 19,
};

export const ARMAMENT_ORDERS = {
  SCOUT: 23, CONSCRIPT: 24, BATTLE: 27,
};

export const ORDER_THEW_COST = 4;

export const BATTLE_MODE = {
  DEFEND: 0,
  ATTACK: 1,
  AUTO: 2,
};

export const BATTLE_RESULT = {
  CONTINUE: 0,
  WON: 1,
  LOST: 2,
};

export const DIRECTION = {
  N: 0, NE: 1, E: 2, SE: 3,
  S: 4, SW: 5, W: 6, NW: 7,
};

export const PERSON_MAX_AGE = 90;
export const PERSON_MIN_AGE = 16;
export const MAX_SKILLS_PER_PERSON = 10;
export const MAX_SKILL_ID = 100;
export const TILE_SIZE = 16;
export const MAX_FIGHTERS_PER_SIDE = 10;
