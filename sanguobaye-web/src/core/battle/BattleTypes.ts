export const TerrainType = {
    GRASS: 0,    // 草地
    PLAIN: 1,    // 平原
    MOUNTAIN: 2, // 山地
    FOREST: 3,   // 森林
    VILLAGE: 4,  // 村庄
    CITY: 5,     // 城池
    CAMP: 6,     // 营寨
    RIVER: 7     // 河流
} as const;
export type TerrainType = typeof TerrainType[keyof typeof TerrainType];

export const ArmsType = {
    CAVALRY: 0,  // 骑兵
    INFANTRY: 1, // 步兵
    ARCHER: 2,   // 弓兵
    WATER: 3,    // 水军
    JI: 4,       // 极兵
    XUAN: 5      // 玄兵
} as const;
export type ArmsType = typeof ArmsType[keyof typeof ArmsType];

export const BattleUnitState = {
    NORMAL: 0,
    DISORDER: 1, // 混乱
    STUNNED: 2   // 眩晕/禁咒
} as const;
export type BattleUnitState = typeof BattleUnitState[keyof typeof BattleUnitState];

export interface BattleUnit {
    id: string;          // 唯一ID
    personId: number;    // 对应的武将ID
    name: string;        // 武将名称
    forceId: number;     // 势力ID
    isAttacker: boolean; // 是否为攻方
    
    // 战斗属性
    armsType: ArmsType;
    armsCount: number;   // 当前兵力
    maxArms: number;     // 最大兵力
    force: number;       // 武力
    iq: number;          // 智力
    level: number;
    
    // 状态
    x: number;
    y: number;
    hp: number;          // 武将生命值 (体力)
    maxHp: number;
    mp: number;          // 技能点 (内力)
    maxMp: number;
    moveRange: number;   // 移动力
    attack: number;      // 实时攻击力
    defense: number;     // 实时防御力
    state: BattleUnitState;
    hasActed: boolean;   // 本回合是否已行动
    expGained?: number;  // 战斗中获得的经验
    
    // 渲染辅助
    color: string;
}

export interface BattleMap {
    width: number;
    height: number;
    tiles: TerrainType[][];
}

export const Weather = {
    SUNNY: 0,  // 晴
    CLOUDY: 1, // 阴
    WINDY: 2,  // 风
    RAINY: 3,  // 雨
    SNOWY: 4   // 冰雹
} as const;
export type Weather = typeof Weather[keyof typeof Weather];

export interface BattleStateData {
    map: BattleMap;
    units: Record<string, BattleUnit>;
    day: number;
    weather: Weather;
    
    attackerForceId: number;
    defenderForceId: number;
    attackerCityId: number;
    defenderCityId: number;
    
    attackerFood: number;
    defenderFood: number;

    // 当前选中的武将和状态
    activeUnitId: string | null;
    reachableTiles: { x: number, y: number }[];
    attackableTiles: { x: number, y: number }[];
    
    isAttackerTurn: boolean;
    isAiThinking: boolean;
}
