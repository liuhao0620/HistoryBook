import { TerrainType, type BattleMap } from '../../core/battle/BattleTypes';

const BATTLE_ASSET_ROOT = '/assets/images/battle';
const ANCIENT_BATTLE_ASSET_ROOT = `${BATTLE_ASSET_ROOT}/ancient`;

export const PLAIN_MAP_BACKGROUND_IMAGE = `${ANCIENT_BATTLE_ASSET_ROOT}/tile_base_parchment.png`;
export const WATER_MAP_BACKGROUND_IMAGE = `${ANCIENT_BATTLE_ASSET_ROOT}/tile_base_water.png`;
export const BATTLE_FRAME_IMAGE = `${ANCIENT_BATTLE_ASSET_ROOT}/ui_frame.png`;
export const BATTLE_PANEL_BACKGROUND_IMAGE = `${ANCIENT_BATTLE_ASSET_ROOT}/ui_panel.png`;
export const COMPASS_NORTH_IMAGE = `${ANCIENT_BATTLE_ASSET_ROOT}/compass_north.png`;

export const getBattleSceneThemeAssets = () => ({
    frameImage: BATTLE_FRAME_IMAGE,
    panelBackgroundImage: BATTLE_PANEL_BACKGROUND_IMAGE,
    compassNorthImage: COMPASS_NORTH_IMAGE,
});

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
    const baseImage = null;
    const overlays: string[] = [];

    if (terrain === TerrainType.RIVER) {
        const mask = getEdgeMask(x, y, map, TerrainType.RIVER);
        overlays.push(`${ANCIENT_BATTLE_ASSET_ROOT}/water_edges/water_edge_${mask.toString().padStart(2, '0')}.png`);
    } else if (terrain === TerrainType.FOREST) {
        const mask = getEdgeMask(x, y, map, TerrainType.FOREST);
        overlays.push(mask === 0
            ? `${ANCIENT_BATTLE_ASSET_ROOT}/wood_autotile/wood_center_01.png`
            : `${ANCIENT_BATTLE_ASSET_ROOT}/wood_autotile/wood_mask_${mask.toString().padStart(2, '0')}.png`);
    } else if (terrain === TerrainType.MOUNTAIN) {
        const mask = getEdgeMask(x, y, map, TerrainType.MOUNTAIN);
        overlays.push(mask === 0
            ? `${ANCIENT_BATTLE_ASSET_ROOT}/hill_autotile/hill_center_01.png`
            : `${ANCIENT_BATTLE_ASSET_ROOT}/hill_autotile/hill_mask_${mask.toString().padStart(2, '0')}.png`);
    } else {
        const propOverlay = getPropOverlay(terrain);
        if (propOverlay) overlays.push(propOverlay);
    }

    return {
        baseImage,
        overlays,
        fallbackColor: 'transparent',
    };
};

const getPropOverlay = (terrain: TerrainType): string | null => {
    switch (terrain) {
        case TerrainType.GRASS:
            return `${ANCIENT_BATTLE_ASSET_ROOT}/tile_lea.png`;
        case TerrainType.VILLAGE:
            return `${ANCIENT_BATTLE_ASSET_ROOT}/tile_thorp.png`;
        case TerrainType.CITY:
            return `${ANCIENT_BATTLE_ASSET_ROOT}/tile_city.png`;
        case TerrainType.CAMP:
            return `${ANCIENT_BATTLE_ASSET_ROOT}/tile_tent.png`;
        default:
            return null;
    }
};

export interface MountainBlockInfo {
    type: '2x2' | '1x2' | '1x1';
    isOrigin: boolean;
}

export const computeMountainBlocks = (map: BattleMap): Map<string, MountainBlockInfo> => {
    const blocks = new Map<string, MountainBlockInfo>();
    
    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            if (map.tiles[y]?.[x] === TerrainType.MOUNTAIN && !blocks.has(`${x},${y}`)) {
                // Check 2x2
                if (
                    x + 1 < map.width && y + 1 < map.height &&
                    map.tiles[y]?.[x+1] === TerrainType.MOUNTAIN && !blocks.has(`${x+1},${y}`) &&
                    map.tiles[y+1]?.[x] === TerrainType.MOUNTAIN && !blocks.has(`${x},${y+1}`) &&
                    map.tiles[y+1]?.[x+1] === TerrainType.MOUNTAIN && !blocks.has(`${x+1},${y+1}`)
                ) {
                    blocks.set(`${x},${y}`, { type: '2x2', isOrigin: true });
                    blocks.set(`${x+1},${y}`, { type: '2x2', isOrigin: false });
                    blocks.set(`${x},${y+1}`, { type: '2x2', isOrigin: false });
                    blocks.set(`${x+1},${y+1}`, { type: '2x2', isOrigin: false });
                } 
                // Check 1x2 (horizontal)
                else if (
                    x + 1 < map.width &&
                    map.tiles[y]?.[x+1] === TerrainType.MOUNTAIN && !blocks.has(`${x+1},${y}`)
                ) {
                    blocks.set(`${x},${y}`, { type: '1x2', isOrigin: true });
                    blocks.set(`${x+1},${y}`, { type: '1x2', isOrigin: false });
                }
                // Fallback to 1x1
                else {
                    blocks.set(`${x},${y}`, { type: '1x1', isOrigin: true });
                }
            }
        }
    }
    
    return blocks;
};
