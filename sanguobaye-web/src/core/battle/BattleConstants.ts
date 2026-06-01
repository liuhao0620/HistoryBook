import { ArmsType, TerrainType } from './BattleTypes';

export const FgtIntMove: Record<ArmsType, number> = {
    [ArmsType.CAVALRY]: 6,
    [ArmsType.INFANTRY]: 4,
    [ArmsType.ARCHER]: 4,
    [ArmsType.WATER]: 5,
    [ArmsType.JI]: 4,
    [ArmsType.XUAN]: 3
};

// 兵种相克系数 [攻击方][防御方]
export const SubduModu: Record<ArmsType, Record<ArmsType, number>> = {
    [ArmsType.CAVALRY]: { [ArmsType.CAVALRY]: 1.0, [ArmsType.INFANTRY]: 1.2, [ArmsType.ARCHER]: 0.8, [ArmsType.WATER]: 1.0, [ArmsType.JI]: 0.7, [ArmsType.XUAN]: 1.3 },
    [ArmsType.INFANTRY]: { [ArmsType.CAVALRY]: 0.8, [ArmsType.INFANTRY]: 1.0, [ArmsType.ARCHER]: 1.2, [ArmsType.WATER]: 1.0, [ArmsType.JI]: 0.6, [ArmsType.XUAN]: 1.2 },
    [ArmsType.ARCHER]: { [ArmsType.CAVALRY]: 1.2, [ArmsType.INFANTRY]: 0.8, [ArmsType.ARCHER]: 1.0, [ArmsType.WATER]: 1.0, [ArmsType.JI]: 1.1, [ArmsType.XUAN]: 1.2 },
    [ArmsType.WATER]: { [ArmsType.CAVALRY]: 1.0, [ArmsType.INFANTRY]: 1.0, [ArmsType.ARCHER]: 1.0, [ArmsType.WATER]: 1.0, [ArmsType.JI]: 1.0, [ArmsType.XUAN]: 1.0 },
    [ArmsType.JI]: { [ArmsType.CAVALRY]: 1.1, [ArmsType.INFANTRY]: 1.3, [ArmsType.ARCHER]: 0.9, [ArmsType.WATER]: 1.0, [ArmsType.JI]: 1.0, [ArmsType.XUAN]: 1.5 },
    [ArmsType.XUAN]: { [ArmsType.CAVALRY]: 0.6, [ArmsType.INFANTRY]: 0.6, [ArmsType.ARCHER]: 0.6, [ArmsType.WATER]: 0.6, [ArmsType.JI]: 0.6, [ArmsType.XUAN]: 0.6 }
};

export const AtkModulus: Record<ArmsType, number> = {
    [ArmsType.CAVALRY]: 1.0,
    [ArmsType.INFANTRY]: 0.8,
    [ArmsType.ARCHER]: 0.9,
    [ArmsType.WATER]: 0.8,
    [ArmsType.JI]: 1.3,
    [ArmsType.XUAN]: 0.4
};

export const DfModulus: Record<ArmsType, number> = {
    [ArmsType.CAVALRY]: 0.7,
    [ArmsType.INFANTRY]: 1.2,
    [ArmsType.ARCHER]: 1.0,
    [ArmsType.WATER]: 1.1,
    [ArmsType.JI]: 1.2,
    [ArmsType.XUAN]: 0.6
};

export const TerrDfModu: Record<TerrainType, number> = {
    [TerrainType.GRASS]: 1.0,
    [TerrainType.PLAIN]: 1.0,
    [TerrainType.MOUNTAIN]: 1.3,
    [TerrainType.FOREST]: 1.15,
    [TerrainType.VILLAGE]: 1.1,
    [TerrainType.CITY]: 1.5,
    [TerrainType.CAMP]: 1.2,
    [TerrainType.RIVER]: 0.8
};

export const MOV_NOT = 255;

export const LandResistance: Record<ArmsType, Record<TerrainType, number>> = {
    [ArmsType.CAVALRY]: { [TerrainType.GRASS]: 1, [TerrainType.PLAIN]: 1, [TerrainType.MOUNTAIN]: MOV_NOT, [TerrainType.FOREST]: 2, [TerrainType.VILLAGE]: 1, [TerrainType.CITY]: 1, [TerrainType.CAMP]: 1, [TerrainType.RIVER]: MOV_NOT },
    [ArmsType.INFANTRY]: { [TerrainType.GRASS]: 1, [TerrainType.PLAIN]: 1, [TerrainType.MOUNTAIN]: 2, [TerrainType.FOREST]: 1, [TerrainType.VILLAGE]: 1, [TerrainType.CITY]: 1, [TerrainType.CAMP]: 1, [TerrainType.RIVER]: MOV_NOT },
    [ArmsType.ARCHER]: { [TerrainType.GRASS]: 1, [TerrainType.PLAIN]: 1, [TerrainType.MOUNTAIN]: 2, [TerrainType.FOREST]: 1, [TerrainType.VILLAGE]: 1, [TerrainType.CITY]: 1, [TerrainType.CAMP]: 1, [TerrainType.RIVER]: MOV_NOT },
    [ArmsType.WATER]: { [TerrainType.GRASS]: 2, [TerrainType.PLAIN]: 2, [TerrainType.MOUNTAIN]: MOV_NOT, [TerrainType.FOREST]: MOV_NOT, [TerrainType.VILLAGE]: 2, [TerrainType.CITY]: 2, [TerrainType.CAMP]: 2, [TerrainType.RIVER]: 1 },
    [ArmsType.JI]: { [TerrainType.GRASS]: 1, [TerrainType.PLAIN]: 1, [TerrainType.MOUNTAIN]: 2, [TerrainType.FOREST]: 1, [TerrainType.VILLAGE]: 1, [TerrainType.CITY]: 1, [TerrainType.CAMP]: 1, [TerrainType.RIVER]: MOV_NOT },
    [ArmsType.XUAN]: { [TerrainType.GRASS]: 1, [TerrainType.PLAIN]: 1, [TerrainType.MOUNTAIN]: 1, [TerrainType.FOREST]: 1, [TerrainType.VILLAGE]: 1, [TerrainType.CITY]: 1, [TerrainType.CAMP]: 1, [TerrainType.RIVER]: 1 }
};
