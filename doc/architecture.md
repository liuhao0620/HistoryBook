# 架构设计文档

## 一、分层架构

```
                    ┌──────────┐
                    │  用户    │
                    └────┬─────┘
                         │ 触屏/鼠标
                    ┌────▼─────┐
                    │  Client  │  React + Canvas
                    │  表现层   │  视图、交互、渲染
                    └────┬─────┘
                         │ REST API / WebSocket
                    ┌────▼─────┐
                    │  Server  │  Express + Socket.IO
                    │  通信层   │  路由、状态广播
                    └────┬─────┘
                         │ 函数调用 (同步)
                    ┌────▼─────┐
                    │  Engine  │  GameEngine / BattleEngine
                    │  逻辑层   │  纯数据计算、零渲染依赖
                    └────┬─────┘
                         │ 引用
                    ┌────▼─────┐
                    │  Shared  │  常量、类型、接口定义
                    │  数据层   │  无框架依赖
                    └──────────┘
```

## 二、设计决策

### 2.1 数据-表现分离

**决策：** 引擎层零渲染依赖，所有输出为纯 JS 对象。

**原因：**
- 引擎可以完全脱离浏览器测试（`node debug-test.mjs`）
- 后续可以换任何前端框架（Vue、React Native、Unity 等）
- 单元测试不需要模拟 DOM
- AI 对战模拟不需要运行客户端

**体现：**
- `GameEngine.getState()` 返回纯对象 `{ cities, persons, orders, ... }`
- `BattleEngine._getClientState()` 返回纯对象 `{ tiles, units, turn, ... }`
- 引擎内部所有计算基于内存数据结构，不涉及像素、坐标映射、渲染

### 2.2 剧本插件系统

**决策：** 剧本 = 一个 JS 文件，符合 `scenario-interface.js` 定义的结构。

**原因：**
- 新剧本无需修改引擎代码
- 剧本可以覆盖所有数据（城市、武将、道具、AI行为）
- 支持自定义脚本钩子（`onMonthStart`、`onBattleEnd` 等）

**剧本加载流程：**
```
1. scenario-interface.js 验证数据结构
2. GameEngine.loadScenario(data) 深拷贝初始化
3. 执行 scripts.onStart(engine) 钩子
4. 游戏循环中按需调用 scripts.onMonthEnd 等
```

### 2.3 网络层设计

**REST API** — 用于状态变更操作（新建游戏、添加指令、执行月份）
**WebSocket** — 用于状态同步推送（`game:state`、`battle:state`）

**原因：**
- REST 适合请求-响应模式（用户操作 → 服务器处理 → 返回结果）
- WebSocket 适合服务端主动推送（AI 行动、战斗回合切换、其他客户端操作）

### 2.4 客户端状态管理

使用 React Context + useReducer，不引入 Redux/Zustand。

**原因：**
- 当前状态树规模可控（游戏状态 + 战斗状态 + UI 状态）
- Context 对中小型单页应用足够
- 避免额外依赖

**状态流：**
```
server/engine → API/WS → GameContext.reducer → React组件树
```

## 三、模块职责

### shared/constants.js

定义所有游戏常量。这是整个项目的"真理之源"(source of truth)。

| 类别 | 示例 |
|------|------|
| 兵种 | `ARMY_TYPE.CAVALRY = 0` |
| 地形 | `TERRAIN.GRASS = 0` |
| 战斗 | `BATTLE_STATE.CONFUSED = 1` |
| 指令 | `INTERIOR_ORDERS.ASSART = 1` |
| 伤害公式参数 | `ARMY_COUNTER_MOD[6][6]` |

### server/engine/GameEngine.js

核心游戏循环。不涉及网络。

主要方法：
- `loadScenario(data)` — 加载剧本，初始化所有数据结构
- `addOrder(order)` / `removeOrder(id)` — 指令队列管理
- `executeMonth()` — 执行所有指令 → AI行动 → 城市武将变化 → 推时间
- `getState()` / `getPlayerState()` — 序列化状态
- `save()` / `load()` — 存档序列化

### server/engine/BattleEngine.js

战棋战斗模拟。独立于 GameEngine 运行。

主要方法：
- `initBattle(atkCity, defCity, attackers)` — 初始化战场
- `getMoveRange(unit)` — BFS 计算可移动范围
- `moveUnit(unit, x, y)` — 执行移动
- `attack(attacker, defender)` — 计算伤害 + 反击
- `_calcDamage(a, d)` — 伤害公式：兵力×武力比×兵种克×攻防系×地形×随机

### server/src/index.js

通信层。把 Express 路由映射到引擎方法。

| 路由 | 对应引擎方法 |
|------|------------|
| `POST /api/game/new` | `engine.loadScenario()` |
| `POST /api/game/order` | `engine.addOrder()` |
| `POST /api/game/execute` | `engine.executeMonth()` |
| `POST /api/battle/start` | `battleEngine.initBattle()` |
| `POST /api/battle/move` | `battleEngine.moveUnit()` |
| `POST /api/battle/attack` | `battleEngine.attack()` |

### client/views/

纯视图层。每个视图通过 `useGame()` 获取状态，通过 `actions` 调用 API。

| 视图 | 数据源 | 渲染方式 |
|------|--------|---------|
| MainMenu | API `/scenarios` + localStorage | DOM 按钮列表 |
| CityView | `state.gameState.cities/persons/orders` | DOM 列表面板 |
| BattleView | `state.battleState` | Canvas 2D 绘制 |
| SaveLoadView | localStorage | DOM 列表 |
