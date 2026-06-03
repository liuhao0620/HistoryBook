# 战斗地图 V2 资源渲染设计规范

## 1. 背景与目标
本次更新的目的是使用 `battle_v2_final` 中的新资源来实现战斗地图的地形渲染逻辑。特别是山地地块，需要被分组为 2x2、1x2（横向两格）和 1x1 的区块，并分别使用 `tile_hill_2_2.png`、`tile_hill_1_2.png` 和 `tile_hill_1_1.png` 进行渲染。同时，清理不再使用的旧资源。

## 2. 资源管理
- **复制**: 将 `public/assets/images/battle_v2_final/` 目录下的所有 `.png` 文件复制到 `public/assets/images/battle/`。
- **保留**: 将原 UI 元素（`ui_frame.png`, `ui_panel.png`, `compass_north.png`）从 `battle/ancient/` 移动到 `battle/` 目录。
- **清理**: 彻底删除 `battle/ancient/` 目录（移除旧的自动拼接贴图和边缘图片）。文件迁移完成后，删除 `battle_v2_final/` 目录。

## 3. 山地连块计算算法
为了确定渲染哪张山地图片，我们将使用贪心分组算法。将创建一个辅助函数 `computeMountainBlocks(map: BattleMap)`：
- 从上到下、从左到右遍历地图。
- 对于每一个尚未分配区块的 `MOUNTAIN` (山地) 格子：
  1. 检查是否能形成 2x2 区块（即该格子及其右侧、下方、右下方的格子均为未分配的山地）。如果是，则将这 4 个格子标记为已分组，并将当前格子设为该 2x2 区块的“起点 (Origin)”。
  2. 如果不能，检查是否能形成 1x2 区块（横向：该格子及其右侧格子为未分配的山地）。如果是，则将这 2 个格子标记为已分组，并将当前格子设为该 1x2 区块的“起点 (Origin)”。
  3. 如果仍然不能，则将该格子标记为 1x1 区块的起点。
- 该计算出的布局信息将在渲染时被使用。

## 4. TerrainRenderLayers 更新
- **接口更新**: 将 `TerrainRenderLayers` 中的 `overlays` 数组类型修改为对象数组，以支持可选的尺寸配置：
  ```typescript
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
- **渲染逻辑**:
  - `getTerrainRenderLayers` 将接收山地分组信息。
  - 对于作为起点的山地格子：
    - 2x2 区块: 返回 `{ src: 'tile_hill_2_2.png', width: '200%', height: '200%' }`
    - 1x2 区块: 返回 `{ src: 'tile_hill_1_2.png', width: '200%', height: '100%' }`
    - 1x1 区块: 返回 `{ src: 'tile_hill_1_1.png', width: '100%', height: '100%' }`
  - 对于非起点（属于某个区块的其他格子）的山地格子，返回 `overlays: []`。
  - 更新其他地形（平原、河流、森林、村庄等）直接使用 `battle/` 文件夹中的新文件名（如 `tile_base_plane.png`、`tile_base_water.png`、`tile_wood.png`）。因为 V2 资源不再使用边缘过渡图片，所以移除原有的河流和森林的 edge 计算逻辑。

## 5. React 组件更新 (`BattleScreen.tsx`)
- 调用 `computeMountainBlocks`（可以通过 memoize 缓存或每次地图加载时计算一次）来获取分组信息。
- 将分组信息传递给 `getTerrainRenderLayers`。
- 渲染 `overlays` 数组时，将 `width` 和 `height` 属性应用到覆盖层 `div` 的 `style` 中。
- 由于非起点的分组山地格子的 `baseImage` 为 `null` 且 `fallbackColor` 为 `'transparent'`，并且 `overlays` 为空，因此它们会完全透明，不会遮挡从起点格子溢出渲染的图片。
