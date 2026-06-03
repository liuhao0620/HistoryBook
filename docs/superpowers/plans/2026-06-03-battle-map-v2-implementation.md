# Battle Map V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the V2 battle map assets rendering logic, including 2x2 and 1x2 mountain tile groupings, and clean up old assets.

**Architecture:** Use a greedy grouping algorithm to group mountain tiles into 2x2, 1x2, and 1x1 blocks. Update the terrain renderer to return explicit dimensions for overlays, allowing the React component to render overflowed images from the block's origin tile while leaving the other tiles transparent.

**Tech Stack:** React, TypeScript, Vitest

---

### Task 1: Asset Migration and Cleanup

**Files:**
- Modify: `public/assets/images/battle/`
- Modify: `public/assets/images/battle_v2_final/`

- [ ] **Step 1: Copy V2 assets to battle directory**
Run:
```powershell
Copy-Item -Path "public\assets\images\battle_v2_final\*.png" -Destination "public\assets\images\battle\" -Force
```
Expected: Files are copied successfully.

- [ ] **Step 2: Move UI elements to battle directory**
Run:
```powershell
Copy-Item -Path "public\assets\images\battle\ancient\ui_frame.png" -Destination "public\assets\images\battle\" -Force
Copy-Item -Path "public\assets\images\battle\ancient\ui_panel.png" -Destination "public\assets\images\battle\" -Force
Copy-Item -Path "public\assets\images\battle\ancient\compass_north.png" -Destination "public\assets\images\battle\" -Force
```
Expected: UI files are copied successfully.

- [ ] **Step 3: Remove old directories**
Run:
```powershell
Remove-Item -Path "public\assets\images\battle\ancient" -Recurse -Force
Remove-Item -Path "public\assets\images\battle_v2_final" -Recurse -Force
```
Expected: Directories removed.

- [ ] **Step 4: Commit**
```powershell
git add public/assets/images/battle/ public/assets/images/battle_v2_final/
git commit -m "chore: migrate battle v2 assets and cleanup ancient assets"
```

---

### Task 2: Mountain Grouping Algorithm

**Files:**
- Modify: `src/view/battle/battleTerrainRendering.ts`
- Modify: `tests/view/battle/battleTerrainRendering.test.ts`

- [ ] **Step 1: Write failing tests for grouping**
Add tests to `tests/view/battle/battleTerrainRendering.test.ts`:
```typescript
import { computeMountainBlocks } from '../../../src/view/battle/battleTerrainRendering';

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
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test tests/view/battle/battleTerrainRendering.test.ts`
Expected: FAIL with "computeMountainBlocks is not a function"

- [ ] **Step 3: Write minimal implementation**
In `src/view/battle/battleTerrainRendering.ts`:
```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test tests/view/battle/battleTerrainRendering.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/view/battle/battleTerrainRendering.ts tests/view/battle/battleTerrainRendering.test.ts
git commit -m "feat: add mountain grouping algorithm"
```

---

### Task 3: Update TerrainRenderLayers Interface and Logic

**Files:**
- Modify: `src/view/battle/battleTerrainRendering.ts`
- Modify: `tests/view/battle/battleTerrainRendering.test.ts`

- [ ] **Step 1: Update the interfaces and constants**
In `src/view/battle/battleTerrainRendering.ts`, update `BATTLE_ASSET_ROOT` and constants:
```typescript
const BATTLE_ASSET_ROOT = '/assets/images/battle';

export const PLAIN_MAP_BACKGROUND_IMAGE = `${BATTLE_ASSET_ROOT}/tile_base_plane.png`;
export const WATER_MAP_BACKGROUND_IMAGE = `${BATTLE_ASSET_ROOT}/tile_base_water.png`;
export const BATTLE_FRAME_IMAGE = `${BATTLE_ASSET_ROOT}/ui_frame.png`;
export const BATTLE_PANEL_BACKGROUND_IMAGE = `${BATTLE_ASSET_ROOT}/ui_panel.png`;
export const COMPASS_NORTH_IMAGE = `${BATTLE_ASSET_ROOT}/compass_north.png`;

export interface TerrainOverlay {
    src: string;
    width?: string;
    height?: string;
}

export interface TerrainRenderLayers {
    baseImage: string | null;
    overlays: TerrainOverlay[];
    fallbackColor: string;
}
```

- [ ] **Step 2: Update getTerrainRenderLayers**
Update the signature and logic:
```typescript
export const getTerrainRenderLayers = (
    x: number,
    y: number,
    map: BattleMap,
    mountainBlocks?: Map<string, MountainBlockInfo>
): TerrainRenderLayers => {
    const terrain = map.tiles[y]?.[x] ?? TerrainType.PLAIN;
    const baseImage = null;
    const overlays: TerrainOverlay[] = [];

    if (terrain === TerrainType.RIVER) {
        // No overlays for RIVER, rely on tile_base_water.png in BattleScreen
    } else if (terrain === TerrainType.FOREST) {
        overlays.push({ src: `${BATTLE_ASSET_ROOT}/tile_wood.png` });
    } else if (terrain === TerrainType.MOUNTAIN) {
        const block = mountainBlocks?.get(`${x},${y}`);
        if (block?.isOrigin) {
            if (block.type === '2x2') {
                overlays.push({ src: `${BATTLE_ASSET_ROOT}/tile_hill_2_2.png`, width: '200%', height: '200%' });
            } else if (block.type === '1x2') {
                overlays.push({ src: `${BATTLE_ASSET_ROOT}/tile_hill_1_2.png`, width: '200%', height: '100%' });
            } else {
                overlays.push({ src: `${BATTLE_ASSET_ROOT}/tile_hill_1_1.png` });
            }
        }
    } else {
        const propOverlay = getPropOverlay(terrain);
        if (propOverlay) overlays.push({ src: propOverlay });
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
```
Also remove `getEdgeMask` function.

- [ ] **Step 3: Update Tests**
In `tests/view/battle/battleTerrainRendering.test.ts`, remove tests related to edge masks and `getEdgeMask`.
Update `TerrainRenderLayers` expectations:
```typescript
    it('returns empty overlays for river without water edges', () => {
        const map = makeMap([[TerrainType.RIVER]]);
        const layers = getTerrainRenderLayers(0, 0, map);
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
```
Fix the `getBattleSceneThemeAssets` test to match the new `BATTLE_ASSET_ROOT`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test tests/view/battle/battleTerrainRendering.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```powershell
git add src/view/battle/battleTerrainRendering.ts tests/view/battle/battleTerrainRendering.test.ts
git commit -m "feat: update terrain render layers logic for V2 assets"
```

---

### Task 4: React Component Updates

**Files:**
- Modify: `src/view/screens/BattleScreen.tsx`

- [ ] **Step 1: Compute blocks in component**
In `src/view/screens/BattleScreen.tsx`:
Add `useMemo` for mountain blocks:
```tsx
import { useMemo } from 'react';
import { ..., computeMountainBlocks } from '../battle/battleTerrainRendering';

// inside BattleScreen component:
    const mountainBlocks = useMemo(() => computeMountainBlocks(map), [map]);
```

- [ ] **Step 2: Update layer retrieval and rendering**
Pass `mountainBlocks` to `getTerrainRenderLayers` and apply width/height to overlay styles.
Change:
```tsx
const terrainLayers = getTerrainRenderLayers(x, y, map);
```
To:
```tsx
const terrainLayers = getTerrainRenderLayers(x, y, map, mountainBlocks);
```
Change the overlay mapping:
```tsx
                                        {/* 渲染覆盖物图层 */}
                                        {terrainLayers.overlays.map((overlay, index) => (
                                            <div
                                                key={`overlay-${index}`}
                                                style={{
                                                    position: 'absolute',
                                                    width: overlay.width || '100%',
                                                    height: overlay.height || '100%',
                                                    backgroundImage: `url(${overlay.src})`,
                                                    backgroundSize: '100% 100%', // Use 100% 100% instead of cover so it fits the div
                                                    backgroundPosition: 'center',
                                                    pointerEvents: 'none',
                                                    zIndex: 2
                                                }}
                                            />
                                        ))}
```
Note: Changed `backgroundSize: 'cover'` to `100% 100%` so the image correctly stretches over the `200%` width/height.

- [ ] **Step 3: Run the app or tests to verify**
Run: `npm run test`
Expected: PASS

- [ ] **Step 4: Commit**
```powershell
git add src/view/screens/BattleScreen.tsx
git commit -m "feat: apply V2 terrain rendering in BattleScreen"
```
