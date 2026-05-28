# 三国霸业 (HistoryBook) — 项目概览

## 项目简介

复刻步步高电子词典经典策略游戏《三国霸业》，基于 React + Node.js 全栈架构。

- 原版 C 源码参考：`E:\Personal\sanguobaye_c\`
- 当前项目路径：`E:\Personal\HistoryBook\`
- 剧本：董卓弄权 (189)、曹操崛起 (194)、赤壁之战 (208)、三足鼎立 (220)

## 当前实现进度

### ✅ 已完成

| 模块 | 内容 |
|------|------|
| 剧本系统 | 4 个完整剧本，每个剧本所有君主可选 |
| 内政指令 (15项) | 开垦/招商/搜寻/治理/出巡/招降/处斩/流放/赏赐/没收/交易/宴请/输送/移动/任命 |
| 外交指令 (5项) | 离间/招揽/策反/反间/劝降 |
| 军备指令 (4项) | 侦察/征兵/掠夺/出征 |
| 分配系统 | 道具/装备分配给武将 |
| 战斗系统 | 16×12战棋地图、BFS寻路、伤害/反击、兵种相克、地形加成、天气 |
| AI 对手 | 城市发展 + 征兵 + 补给 + 进攻逻辑 |
| 城市变化 | 自然增长、随机灾害、维持费 |
| 武将成长 | 经验升级、年龄增长、自然死亡 |
| 存档系统 | 3 槽位 localStorage + API |
| 触屏支持 | Canvas touch 事件、按钮 40px+ 热区 |

### ⏳ 待完成

| 模块 | 说明 |
|------|------|
| 城市战略地图 | 城市位置 (x,y) 和道路 (links) 数据已就绪，前端渲染待做 |
| 技能系统 | 数据结构预留，战斗 UI 待接入 |
| 头像/立绘 | portraitId 已定义，需美术资源 |
| 剧本自动扫描 | 当前硬编码加载，可改为 `fs.readdir` |

## 四层架构

```
client/  React 前端 (Vite)
  → REST / WebSocket
server/  Express + Socket.IO
  → 函数调用
server/engine/  GameEngine + BattleEngine（头跑可测）
  → 引用
shared/  常量|类型|剧本接口（零依赖）
```

## 目录

```
HistoryBook/
├── doc/               ← 文档
├── shared/            常量、类型、剧本接口
├── server/
│   ├── src/engine/    GameEngine.js (370行 完整版)  BattleEngine.js (530行)
│   ├── src/data/scenarios/  4 个剧本
│   └── src/index.js   Express + WS 服务器
├── client/
│   ├── src/views/     MainMenu / CityView / BattleView / SaveLoadView
│   ├── src/context/   GameContext (状态管理)
│   └── src/api.js     API 客户端
```

## 启动

```bash
# 服务端
cd server && node src/index.js    # → :3001

# 前端开发
cd client && npx vite             # → :3000 (代理到 :3001)

# 或直接访问 :3001 (已内嵌 client/dist)
```

## 测试

```bash
cd server
node debug-test.mjs    # 引擎头跑
node test.js             # 完整引擎模拟
node test-api.mjs        # API 端到端 (需先启动服务端)
```
