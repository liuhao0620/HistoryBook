# Tasks
- [x] Task 1: 移植 AI 内政逻辑
  - [x] SubTask 1.1: 分析原版 `E:\Personal\sanguobaye_c\` 中的 AI 内政决策代码
  - [x] SubTask 1.2: 在当前项目中实现 AI 城市的资源自动增长、开发和征兵逻辑
- [x] Task 2: 移植 AI 军事扩张逻辑
  - [x] SubTask 2.1: 分析原版中 AI 判断出征条件、目标选择及武将编排的代码
  - [x] SubTask 2.2: 实现 AI 势力生成出征指令的功能
- [x] Task 3: 实现 AI 间战斗的模拟与结算
  - [x] SubTask 3.1: 编写快速战斗模拟算法（或直接移植原版胜负判定公式），用于计算 AI 之间的战斗结果
  - [x] SubTask 3.2: 根据模拟结果，更新胜负双方的武将状态、兵力损失及城市归属
- [x] Task 4: 整合策略结算流程与结果播报
  - [x] SubTask 4.1: 在所有策略指令执行完毕后，汇总 AI 之间的战斗事件
  - [x] SubTask 4.2: 制作或复用 UI 界面，按顺序播报战报（如“刘备军进攻了许昌，取得胜利！”）
  - [x] SubTask 4.3: 播报结束后，刷新大地图表现以反映最新的领地归属

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3
