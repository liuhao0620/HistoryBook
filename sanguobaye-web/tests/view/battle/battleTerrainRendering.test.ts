import { describe, expect, it } from 'vitest';
import { TerrainType, type BattleMap } from '../../../src/core/battle/BattleTypes';
import {
    BATTLE_FRAME_IMAGE,
    BATTLE_PANEL_BACKGROUND_IMAGE,
    COMPASS_NORTH_IMAGE,
    PLAIN_MAP_BACKGROUND_IMAGE,
    WATER_MAP_BACKGROUND_IMAGE,
    getBattleSceneThemeAssets,
    getEdgeMask,
    getTerrainRenderLayers,
    computeMountainBlocks,
} from '../../../src/view/battle/battleTerrainRendering';

const makeMap = (tiles: TerrainType[][]): BattleMap => ({
    width: tiles[0]?.length ?? 0,
    height: tiles.length,
    tiles,
});

describe('battle terrain rendering', () => {
    it('returns water edge 00 without a per-tile water base when surrounded by water', () => {
        const map = makeMap([
            [TerrainType.RIVER, TerrainType.RIVER, TerrainType.RIVER],
            [TerrainType.RIVER, TerrainType.RIVER, TerrainType.RIVER],
            [TerrainType.RIVER, TerrainType.RIVER, TerrainType.RIVER],
        ]);

        const layers = getTerrainRenderLayers(1, 1, map);

        expect(layers.baseImage).toBeNull();
        expect(layers.fallbackColor).toBe('transparent');
        expect(layers.overlays).toEqual(['/assets/images/battle/ancient/water_edges/water_edge_00.png']);
    });

    it('exposes the plain texture for the map-level background', () => {
        expect(PLAIN_MAP_BACKGROUND_IMAGE).toBe('/assets/images/battle/ancient/tile_base_parchment.png');
    });

    it('exposes the water texture for map-aligned water tiles', () => {
        expect(WATER_MAP_BACKGROUND_IMAGE).toBe('/assets/images/battle/ancient/tile_base_water.png');
    });

    it('exposes the ancient battle scene theme assets', () => {
        expect(BATTLE_FRAME_IMAGE).toBe('/assets/images/battle/ancient/ui_frame.png');
        expect(BATTLE_PANEL_BACKGROUND_IMAGE).toBe('/assets/images/battle/ancient/ui_panel.png');
        expect(COMPASS_NORTH_IMAGE).toBe('/assets/images/battle/ancient/compass_north.png');
        expect(getBattleSceneThemeAssets()).toEqual({
            frameImage: BATTLE_FRAME_IMAGE,
            panelBackgroundImage: BATTLE_PANEL_BACKGROUND_IMAGE,
            compassNorthImage: COMPASS_NORTH_IMAGE,
        });
    });

    it('keeps plain tiles transparent so the map-level plain texture shows through', () => {
        const layers = getTerrainRenderLayers(0, 0, makeMap([[TerrainType.PLAIN]]));

        expect(layers.baseImage).toBeNull();
        expect(layers.fallbackColor).toBe('transparent');
        expect(layers.overlays).toEqual([]);
    });

    it('returns water edge 09 when north and west neighbors are land', () => {
        const map = makeMap([
            [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.RIVER],
            [TerrainType.PLAIN, TerrainType.RIVER, TerrainType.RIVER],
            [TerrainType.RIVER, TerrainType.RIVER, TerrainType.RIVER],
        ]);

        expect(getEdgeMask(1, 1, map, TerrainType.RIVER)).toBe(9);
        expect(getTerrainRenderLayers(1, 1, map).overlays).toEqual([
            '/assets/images/battle/ancient/water_edges/water_edge_09.png',
        ]);
    });

    it('treats out-of-bounds neighbors as the same terrain', () => {
        const map = makeMap([[TerrainType.RIVER, TerrainType.RIVER]]);

        expect(getEdgeMask(0, 0, map, TerrainType.RIVER)).toBe(0);
    });

    it('renders a forest center without edges when surrounded by forest', () => {
        const map = makeMap([
            [TerrainType.FOREST, TerrainType.FOREST, TerrainType.FOREST],
            [TerrainType.FOREST, TerrainType.FOREST, TerrainType.FOREST],
            [TerrainType.FOREST, TerrainType.FOREST, TerrainType.FOREST],
        ]);

        expect(getTerrainRenderLayers(1, 1, map)).toMatchObject({
            baseImage: null,
            overlays: ['/assets/images/battle/ancient/wood_autotile/wood_center_01.png'],
        });
    });

    it('renders a forest masked terrain variant for non-forest neighbors', () => {
        const map = makeMap([
            [TerrainType.PLAIN, TerrainType.FOREST, TerrainType.FOREST],
            [TerrainType.PLAIN, TerrainType.FOREST, TerrainType.FOREST],
            [TerrainType.FOREST, TerrainType.FOREST, TerrainType.FOREST],
        ]);

        expect(getEdgeMask(1, 1, map, TerrainType.FOREST)).toBe(8);
        expect(getTerrainRenderLayers(1, 1, map).overlays).toEqual([
            '/assets/images/battle/ancient/wood_autotile/wood_mask_08.png',
        ]);
    });

    it('renders a mountain masked terrain variant for non-mountain neighbors', () => {
        const map = makeMap([
            [TerrainType.MOUNTAIN, TerrainType.PLAIN, TerrainType.MOUNTAIN],
            [TerrainType.MOUNTAIN, TerrainType.MOUNTAIN, TerrainType.PLAIN],
            [TerrainType.MOUNTAIN, TerrainType.MOUNTAIN, TerrainType.MOUNTAIN],
        ]);

        expect(getEdgeMask(1, 1, map, TerrainType.MOUNTAIN)).toBe(3);
        expect(getTerrainRenderLayers(1, 1, map).overlays).toEqual([
            '/assets/images/battle/ancient/hill_autotile/hill_mask_03.png',
        ]);
    });

    it('renders land props over the plain base image', () => {
        const cases: Array<[TerrainType, string]> = [
            [TerrainType.GRASS, '/assets/images/battle/ancient/tile_lea.png'],
            [TerrainType.VILLAGE, '/assets/images/battle/ancient/tile_thorp.png'],
            [TerrainType.CITY, '/assets/images/battle/ancient/tile_city.png'],
            [TerrainType.CAMP, '/assets/images/battle/ancient/tile_tent.png'],
        ];

        for (const [terrain, overlay] of cases) {
            const layers = getTerrainRenderLayers(0, 0, makeMap([[terrain]]));

            expect(layers.baseImage).toBeNull();
            expect(layers.overlays).toEqual([overlay]);
        }
    });
});

describe('computeMountainBlocks', () => {
    it('groups 2x2 mountains correctly', () => {
        const map = makeMap([
            [TerrainType.MOUNTAIN, TerrainType.MOUNTAIN],
            [TerrainType.MOUNTAIN, TerrainType.MOUNTAIN],
        ]);
        const blocks = computeMountainBlocks(map);
        expect(blocks.get('0,0')).toEqual({ type: '2x2', isOrigin: true });
        expect(blocks.get('1,0')).toEqual({ type: '2x2', isOrigin: false });
        expect(blocks.get('0,1')).toEqual({ type: '2x2', isOrigin: false });
        expect(blocks.get('1,1')).toEqual({ type: '2x2', isOrigin: false });
    });

    it('groups 1x2 mountains correctly', () => {
        const map = makeMap([
            [TerrainType.MOUNTAIN, TerrainType.MOUNTAIN],
            [TerrainType.PLAIN, TerrainType.PLAIN],
        ]);
        const blocks = computeMountainBlocks(map);
        expect(blocks.get('0,0')).toEqual({ type: '1x2', isOrigin: true });
        expect(blocks.get('1,0')).toEqual({ type: '1x2', isOrigin: false });
    });

    it('groups 1x1 mountains correctly', () => {
        const map = makeMap([[TerrainType.MOUNTAIN]]);
        const blocks = computeMountainBlocks(map);
        expect(blocks.get('0,0')).toEqual({ type: '1x1', isOrigin: true });
    });
});
