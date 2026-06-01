# Tasks
- [x] Task 1: 分析并梳理原版战斗系统架构
  - [x] SubTask 1.1: 在 `E:\Personal\sanguobaye_c\` 中定位战斗地图、兵种、AI、结算相关的核心代码和数据文件。
  - [x] SubTask 1.2: 制定对应的数据结构和当前项目的接口映射。
- [x] Task 2: 复刻战斗地图加载逻辑
  - [x] SubTask 2.1: 实现战斗地图数据的解析与加载（地形、障碍物、建筑）。
  - [x] SubTask 2.2: 实现出征流程与战斗地图场景的无缝衔接。
- [x] Task 3: 复刻兵种与核心战斗逻辑
  - [x] SubTask 3.1: 建立单位的基础属性和组件（生命值、攻击力、防御、射程等）。
  - [x] SubTask 3.2: 实现单位的移动（寻路）和指令控制。
  - [x] SubTask 3.3: 实现原版伤害计算公式和技能效果。
- [x] Task 4: 复刻敌方战斗AI
  - [x] SubTask 4.1: 分析原版AI索敌与行为树/状态机逻辑。
  - [x] SubTask 4.2: 在当前项目中实现并绑定给敌方单位。
- [x] Task 5: 复刻战斗结算逻辑
  - [x] SubTask 5.1: 监听战斗结束条件（如主营被毁、全军覆没等）。
  - [x] SubTask 5.2: 实现经验分配、战利品计算和俘虏判定。
  - [x] SubTask 5.3: 更新大地图状态并返回主界面。

# Task Dependencies
- Task 2 依赖于 Task 1
- Task 3 依赖于 Task 2
- Task 4 依赖于 Task 3
- Task 5 依赖于 Task 3
