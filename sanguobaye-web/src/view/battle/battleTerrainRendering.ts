import { TerrainType, type BattleMap } from '../../core/battle/BattleTypes';

const BATTLE_ASSET_ROOT = '/assets/images/battle';

export const PLAIN_MAP_BACKGROUND_IMAGE = `${BATTLE_ASSET_ROOT}/tile_base_plain.png`;

export const TERRAIN_FALLBACK_COLORS: Record<TerrainType, string> = {
    [TerrainType.GRASS]: '#4caf50',
    [TerrainType.PLAIN]: '#8bc34a',
    [TerrainType.MOUNTAIN]: '#795548',
    [TerrainType.FOREST]: '#2e7d32',
    [TerrainType.VILLAGE]: '#ffeb3b',
    [TerrainType.CITY]: '#9e9e9e',
    [TerrainType.CAMP]: '#f44336',
    [TerrainType.RIVER]: '#2196f3',
};

export interface TerrainRenderLayers {
    baseImage: string | null;
    overlays: string[];
    fallbackColor: string;
}

export const getEdgeMask = (
    x: number,
    y: number,
    map: BattleMap,
    terrainType: TerrainType,
): number => {
    let mask = 0;

    const isSameType = (nx: number, ny: number) => {
        if (nx < 0 || nx >= map.width || ny < 0 || ny >= map.height) {
            return true;
        }

        return map.tiles[ny]?.[nx] === terrainType;
    };

    if (!isSameType(x, y - 1)) mask |= 1;
    if (!isSameType(x + 1, y)) mask |= 2;
    if (!isSameType(x, y + 1)) mask |= 4;
    if (!isSameType(x - 1, y)) mask |= 8;

    return mask;
};

export const getTerrainRenderLayers = (
    x: number,
    y: number,
    map: BattleMap,
): TerrainRenderLayers => {
    const terrain = map.tiles[y]?.[x] ?? TerrainType.PLAIN;
    const baseImage = terrain === TerrainType.RIVER
        ? `${BATTLE_ASSET_ROOT}/tile_base_water.png`
        : null;
    const overlays: string[] = [];

    if (terrain === TerrainType.RIVER) {
        const mask = getEdgeMask(x, y, map, TerrainType.RIVER);
        overlays.push(`${BATTLE_ASSET_ROOT}/water_edges/water_edge_${mask.toString().padStart(2, '0')}.png`);
    } else if (terrain === TerrainType.FOREST) {
        overlays.push(`${BATTLE_ASSET_ROOT}/wood_autotile/wood_center_01.png`);
    } else if (terrain === TerrainType.MOUNTAIN) {
        overlays.push(`${BATTLE_ASSET_ROOT}/hill_autotile/hill_center_01.png`);
    } else {
        const propOverlay = getPropOverlay(terrain);
        if (propOverlay) overlays.push(propOverlay);
    }

    return {
        baseImage,
        overlays,
        fallbackColor: terrain === TerrainType.RIVER ? TERRAIN_FALLBACK_COLORS[terrain] : 'transparent',
    };
};

const getPropOverlay = (terrain: TerrainType): string | null => {
    switch (terrain) {
        case TerrainType.GRASS:
            return `${BATTLE_ASSET_ROOT}/tile_lea.png`;
        case TerrainType.VILLAGE:
            return `${BATTLE_ASSET_ROOT}/tile_thorp.png`;
        case TerrainType.CITY:
            return `${BATTLE_ASSET_ROOT}/tile_city.png`;
        case TerrainType.CAMP:
            return `${BATTLE_ASSET_ROOT}/tile_tent.png`;
        default:
            return null;
    }
};
