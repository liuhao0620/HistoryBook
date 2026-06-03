import { describe, expect, it } from 'vitest';
import { TerrainType, type BattleMap } from '../../../src/core/battle/BattleTypes';
import {
    PLAIN_MAP_BACKGROUND_IMAGE,
    WATER_MAP_BACKGROUND_IMAGE,
    getEdgeMask,
    getTerrainRenderLayers,
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
        expect(layers.overlays).toEqual(['/assets/images/battle/water_edges/water_edge_00.png']);
    });

    it('exposes the plain texture for the map-level background', () => {
        expect(PLAIN_MAP_BACKGROUND_IMAGE).toBe('/assets/images/battle/tile_base_plain.png');
    });

    it('exposes the water texture for map-aligned water tiles', () => {
        expect(WATER_MAP_BACKGROUND_IMAGE).toBe('/assets/images/battle/tile_base_water.png');
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
            '/assets/images/battle/water_edges/water_edge_09.png',
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
            overlays: ['/assets/images/battle/wood_autotile/wood_center_01.png'],
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
            '/assets/images/battle/wood_autotile/wood_mask_08.png',
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
            '/assets/images/battle/hill_autotile/hill_mask_03.png',
        ]);
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
            expect(layers.overlays).toEqual([overlay]);
        }
    });
});
