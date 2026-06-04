# Tasks
- [x] Task 1: 在 `useBattleStore.ts` 中引入原版静态坐标偏移表 `FGT_INT_POS`。
- [x] Task 2: 修正攻击方基准坐标 `sx`, `sy` 的计算逻辑，使其完全对齐原版 `FgtGetBaseXY` 的逻辑。
- [x] Task 3: 删除 `useBattleStore.ts` 中的 `getFormationOffsets` 动态计算函数，改为读取 `FGT_INT_POS` 获取攻守双方的 `dx, dy` 偏移。
- [x] Task 4: 确认防守方主将（idx=0）的初始位置精确落在城池上。