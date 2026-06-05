# 游戏分辨率设置与响应式布局设计

## 概述
目标是将目前的“地图编辑”菜单替换为“游戏设置”菜单，允许玩家将游戏分辨率在 `1920x1080` (16:9) 和 `1080x720` (3:2) 之间切换。为了确保在不同比例下所有画面均能正确显示且不出现黑边，我们将基于当前窗口宽度实现一套动态响应式的等比缩放系统。

## 全局状态 (Global State)
- 在 `useGameStore` 中增加 `resolution: { width: number, height: number }` 状态，默认值为 `{ width: 1920, height: 1080 }`。
- 增加 `setResolution` 方法。
- 更新 `useGameStore` 中的 `ScreenType`，加入 `'SETTINGS'` 并移除 `'MAP_EDITOR'`。

## 设置菜单 (Settings Menu)
- 在 `MainMenu.tsx` 中，将“地图编辑”按钮修改为“游戏设置”。
- 创建新的界面组件 `SettingsScreen.tsx`。
- 设置界面提供两个分辨率选项：`1920x1080` 和 `1080x720`。
- 选择选项后，更新全局的 `resolution` 状态，并将其持久化（如使用 `localStorage`）。

## 响应式缩放策略 (Responsive Scaling Strategy)
为了在适配新比例的同时保持原有视觉效果，我们将基于宽度计算一个基础缩放系数：
`scale = currentResolution.width / 1920`
对于 `1920x1080`，`scale = 1`。
对于 `1080x720`，`scale = 1080 / 1920 = 0.5625`。

### 1. 根容器 (Root Containers)
- 将 `App.tsx` 和各个界面的最外层容器尺寸改为 `width: '100%', height: '100%'`。我们将在主游戏容器包裹层应用 `resolution.width` 和 `resolution.height`，以确保完美匹配所选尺寸。

### 2. 布局 (Layouts)
- 将原本写死的 1920x1080 容器宽度和高度改为 `width: '100%', height: '100%'`。
- 对于侧边栏等固定宽度的容器（如 `GameScreen` 中的 300px 侧边栏），将其宽度更新为 `300 * scale`px。
- 对于主地图视口（`GameScreen` 的大地图、`BattleScreen` 的战场地图），使用 `flex: 1` 让其动态填满剩余的垂直空间，从而自然适应不同长宽比而不会产生黑边。

### 3. 具体元素与坐标 (Elements and Coordinates)
- 大地图的城池坐标计算：`left: (x * 120 + 135) * scale`, `top: (y * 120 + 105) * scale`。
- 城池标记和图片尺寸：乘以 `scale`。
- 战场地图：`TILE_SIZE = 80 * scale`。
- 所有的字号、内边距、弹窗宽度以及其他写死的像素值，均统一乘以 `scale`。
- 提供一个自定义 Hook `useScale()`，方便在各个组件中获取当前的缩放系数。

## 实施步骤 (Implementation Steps)
1. 在 `useGameStore` 中添加 `resolution` 状态及相关的本地存储逻辑。
2. 创建 `useScale()` Hook。
3. 编写 `SettingsScreen.tsx` 组件，并集成到 `App.tsx` 与 `MainMenu.tsx` 中。
4. 对 `MainMenu.tsx`、`SelectScenario.tsx` 和 `SelectForce.tsx` 进行响应式和缩放适配。
5. 更新 `GameScreen.tsx` 中的布局、城池坐标以及弹窗的尺寸。
6. 更新 `BattleScreen.tsx` 中的布局、`TILE_SIZE` 以及浮层尺寸。
7. （如有必要）更新其他涉及具体尺寸的 UI 组件。

## 测试 (Testing)
- 切换到 1080x720。验证主菜单、剧本选择、游戏界面和战斗界面是否完美适配。
- 确保在大地图和战场地图上的点击交互（如城池点击、部队点击）准确无误。
- 验证界面没有出现不必要的滚动条或元素裁剪。
