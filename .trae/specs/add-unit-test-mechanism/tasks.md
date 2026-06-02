# Tasks
- [x] Task 1: 引入并配置测试框架环境
  - [x] SubTask 1.1: 安装 `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@vitest/coverage-v8`
  - [x] SubTask 1.2: 修改 `package.json` 添加测试相关 scripts
  - [x] SubTask 1.3: 更新 `vite.config.ts` 集成 Vitest
- [x] Task 2: 编写已有逻辑的单元测试
  - [x] SubTask 2.1: 为 `src/core/` 目录下的核心逻辑（特别是 `ai`, `utils`, `models`, `commands`, `state`, `battle`）补充单元测试
  - [x] SubTask 2.2: 为 `src/view/components/` 的关键组件补充单元测试
- [x] Task 3: 安装并配置 Superpowers SKILL 机制
  - [x] SubTask 3.1: 从 `https://github.com/obra/superpowers` 获取并集成适合当前 AI Agent 的配置文件（如 `AGENTS.md`, `.clinerules` 等）
  - [x] SubTask 3.2: 配置全局提示：强制后续开发必须遵循 Superpowers 中的 `test-driven-development` 技能（RED-GREEN-REFACTOR 流程）

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] 可以与 [Task 1] 并行执行
