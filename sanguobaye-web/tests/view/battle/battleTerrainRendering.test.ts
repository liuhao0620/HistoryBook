import { describe, expect, it } from 'vitest';
import { TerrainType, type BattleMap } from '../../../src/core/battle/BattleTypes';
import {
    BATTLE_PANEL_BACKGROUND_IMAGE,
    PLAIN_MAP_BACKGROUND_IMAGE,
    WATER_MAP_BACKGROUND_IMAGE,
    getBattleSceneThemeAssets,
    getTerrainRenderLayers,
    computeMountainBlocks,
} from '../../../src/view/battle/battleTerrainRendering';

const makeMap = (tiles: TerrainType[][]): BattleMap => ({
    width: tiles[0]?.length ?? 0,
    height: tiles.length,
    tiles,
});

describe('battle terrain rendering', () => {
    it('returns empty overlays for river without water edges', () => {
        const map = makeMap([[TerrainType.RIVER]]);
        const layers = getTerrainRenderLayers(0, 0, map);
        expect(layers.overlays).toEqual([]);
    });

    it('returns water edges for river with land neighbors', () => {
        const map = makeMap([
            [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
            [TerrainType.PLAIN, TerrainType.RIVER, TerrainType.PLAIN],
            [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
        ]);
        const layers = getTerrainRenderLayers(1, 1, map);
        expect(layers.overlays).toEqual([
            { src: '/assets/images/battle/bank/bank_straight.png', top: '-46%', transform: 'rotate(90deg)' },
            { src: '/assets/images/battle/bank/bank_straight.png', top: '46%', transform: 'rotate(-90deg)' },
            { src: '/assets/images/battle/bank/bank_straight.png', left: '-46%', transform: 'rotate(0deg)' },
            { src: '/assets/images/battle/bank/bank_straight.png', left: '46%', transform: 'rotate(180deg)' },
            { src: '/assets/images/battle/bank/bank_inner_corner.png', top: '-15%', left: '-15%', transform: 'rotate(180deg)' },
            { src: '/assets/images/battle/bank/bank_inner_corner.png', top: '-15%', left: '15%', transform: 'rotate(-90deg)' },
            { src: '/assets/images/battle/bank/bank_inner_corner.png', top: '15%', left: '15%', transform: 'rotate(0deg)' },
            { src: '/assets/images/battle/bank/bank_inner_corner.png', top: '15%', left: '-15%', transform: 'rotate(90deg)' },
        ]);
    });

    it('exposes the plain texture for the map-level background', () => {
        expect(PLAIN_MAP_BACKGROUND_IMAGE).toBe('/assets/images/battle/tile_base_plane.png');
    });

    it('exposes the water texture for map-aligned water tiles', () => {
        expect(WATER_MAP_BACKGROUND_IMAGE).toBe('/assets/images/battle/tile_base_water.png');
    });

    it('exposes the ancient battle scene theme assets', () => {
        expect(BATTLE_PANEL_BACKGROUND_IMAGE).toBe('/assets/images/battle/ui_panel.png');
        expect(getBattleSceneThemeAssets()).toEqual({
            panelBackgroundImage: BATTLE_PANEL_BACKGROUND_IMAGE,
        });
    });

    it('keeps plain tiles transparent so the map-level plain texture shows through', () => {
        const layers = getTerrainRenderLayers(0, 0, makeMap([[TerrainType.PLAIN]]));

        expect(layers.baseImage).toBeNull();
        expect(layers.fallbackColor).toBe('transparent');
        expect(layers.overlays).toEqual([]);
    });

    it('returns tile_wood.png for forest', () => {
        const map = makeMap([[TerrainType.FOREST]]);
        const layers = getTerrainRenderLayers(0, 0, map);
        expect(layers.overlays).toEqual([{ src: '/assets/images/battle/tile_wood.png' }]);
    });

    it('returns correct mountain origin and dimensions', () => {
        const map = makeMap([
            [TerrainType.MOUNTAIN, TerrainType.MOUNTAIN],
            [TerrainType.MOUNTAIN, TerrainType.MOUNTAIN],
        ]);
        const blocks = computeMountainBlocks(map);
        const originLayers = getTerrainRenderLayers(0, 0, map, blocks);
        expect(originLayers.overlays).toEqual([{ src: '/assets/images/battle/tile_hill_2_2.png', width: '200%', height: '200%' }]);
        
        const nonOriginLayers = getTerrainRenderLayers(1, 0, map, blocks);
        expect(nonOriginLayers.overlays).toEqual([]);
    });

    it('renders land props over the plain base image', () => {
        const cases: Array<[TerrainType, string]> = [
            [TerrainType.GRASS, '/assets/images/battle/tile_lea.png'],
            [TerrainType.VILLAGE, '/assets/images/battle/tile_thorp.png'],
            [TerrainType.CITY, '/assets/images/battle/tile_city.png'],
            [TerrainType.CAMP, '/assets/images/battle/tile_tent.png'],
        ];

        for (const [terrain, overlay] of cases) {
            const layers = getTerrainRenderLayers(0, 0, makeMap([[terrain]]));

            expect(layers.baseImage).toBeNull();
            expect(layers.overlays).toEqual([{ src: overlay }]);
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
