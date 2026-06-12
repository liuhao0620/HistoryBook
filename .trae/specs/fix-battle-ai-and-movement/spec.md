# 修复战斗AI与移动逻辑规格说明 (Fix Battle AI and Movement Logic Spec)

## 为什么 (Why)
用户的核心诉求是**100%忠实复刻原版游戏的AI与战斗逻辑**。
当前代码中存在两个与原版C代码不符的差异：
1. 防守方AI的主将会离开城池。但在原版 `FgtPkAi.c` 的 `FgtCmpMove` 函数中，存在明确的代码逻辑：`if(FgtGetGenTer(idx) == TERRAIN_CITY) return;`，即任何站在城池上的将领在寻路时会直接返回，不进行移动。
2. 敌方将领（及陆地兵种）走不下水。目前TS版本中将 `RIVER` 等地形的移动力消耗设为了 `MOV_NOT`（不可通行），而原版 `pconst.c` 的 `dFgtLandR` 数组中，水域对大部分陆地兵种的消耗值为 3，是可以通行的。

## 做了哪些修改 (What Changes)
- 严格复刻原版 `FgtCmpMove` 的移动阻断逻辑：在计算AI移动时，如果当前单位所在的地形是 `CITY`（城池），则跳过移动逻辑。
- 严格复刻原版 `dFgtLandR` 地形阻力数据：更新 `BattleConstants.ts` 中的 `LandResistance` 矩阵，使所有兵种在所有地形（如 `RIVER`, `MOUNTAIN`）上的消耗值与原版C代码的二维数组完全一一对应。

## 影响范围 (Impact)
- 受影响的规格：AI阵营策略 (AI Faction Strategy)，战斗系统复刻 (Battle System Replication)
- 受影响的代码：
  - `src/core/battle/useBattleStore.ts`
  - `src/core/battle/BattleConstants.ts`

## 新增需求 (ADDED Requirements)
### 需求：复刻原版AI城池驻守逻辑
系统必须忠实还原原版 `FgtPkAi.c` 中的 `FgtCmpMove` 行为：当进行AI回合移动计算时，如果单位当前处于 `TerrainType.CITY` 地形，则直接终止该单位的移动计算（不发生位移）。

## 修改需求 (MODIFIED Requirements)
### 需求：严格还原原版地形移动力消耗
系统必须使用原版游戏 `pconst.c` 中 `dFgtLandR` 记录的确切数值。`RIVER`（河流）和 `MOUNTAIN`（山地）对于大部分兵种而言，移动消耗应为 1-3 之间的整数，而不是目前的 `MOV_NOT`。陆地兵种只要有足够的剩余移动力即可跨入水域。