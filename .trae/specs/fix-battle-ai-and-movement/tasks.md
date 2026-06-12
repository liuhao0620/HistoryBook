# 任务列表 (Tasks)
- [x] Task 1: 严格复刻原版AI移动限制逻辑
  - [x] SubTask 1.1: 查阅并确认原版C代码 `FgtPkAi.c` 中的 `FgtCmpMove` 函数逻辑。
  - [x] SubTask 1.2: 在 `src/core/battle/useBattleStore.ts` 的 `runAiTurn` 中，加入对当前单位是否位于 `TerrainType.CITY` 的判断。若满足，直接跳过寻路，保持原地（原版逻辑为 `if(FgtGetGenTer(idx) == TERRAIN_CITY) return;`）。
- [x] Task 2: 严格复刻原版地形移动力消耗表
  - [x] SubTask 2.1: 解析原版 `pconst.c` 中的 `dFgtLandR` 数组，提取各个兵种对所有地形的真实消耗值。
  - [x] SubTask 2.2: 使用提取出的真实数据替换 `src/core/battle/BattleConstants.ts` 中的 `LandResistance`，彻底修复陆地兵种无法下水的问题。
- [x] Task 3: 验证复刻准确性
  - [x] SubTask 3.1: 编写或更新针对 `battleCalculations` 和 `useBattleStore` 的单元测试，验证位于城池上的单位遵循了原版不移动的规则。
  - [x] SubTask 3.2: 验证陆地兵种在水域（RIVER）地形的移动消耗为正确数值（如骑兵为3），并能成功走入水域。

# 任务依赖 (Task Dependencies)
- [Task 2] 依赖于 [Task 1]
- [Task 3] 依赖于 [Task 2]