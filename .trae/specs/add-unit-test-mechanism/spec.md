# 增加单元测试机制 Spec

## Why
目前项目中缺乏单元测试，无法保证现有业务逻辑和组件的稳定性。在后续通过 AI 进行功能迭代和新模块开发时，极易无意间破坏原有功能。为了提高代码质量、保证项目的健壮性，同时规范 AI 开发流程，需要引入完善的单元测试机制。
通过引入业界成熟的 [obra/superpowers](https://github.com/obra/superpowers) AI 技能框架，我们可以确保在后续的开发中，AI 会严格遵守测试驱动开发（TDD）流程。

## What Changes
- 在项目中引入 Vitest、React Testing Library 及其相关依赖，并配置测试环境（如 JSDOM 支持、全局 setup 文件）。
- 针对项目中 `src/core/` 下的核心数据模型、命令处理、状态管理（包含 AI 和 utils 目录），以及 `src/view/` 下的关键组件补充单元测试。
- 在项目根目录集成 **Superpowers** 技能集（下载并配置其核心指令）。
- 在项目根目录的 AI 提示规范文件（如 `.clinerules`、`AGENTS.md` 或 `.cursorrules`）中，引入 Superpowers 的 `test-driven-development` (TDD) 和相关协作技能，强制要求 AI 开发任何功能前必须先写测试、测试失败后再写实现、最后保证测试通过。

## Impact
- Affected specs: 增加了强制的 TDD 开发规范约束。
- Affected code: 
  - 构建配置：`package.json`, `vite.config.ts`
  - 核心逻辑：`src/core/` 目录下的代码文件将新增对应的 `.test.ts` 测试文件（重点覆盖 ai 和 utils 等所有子目录）
  - UI 视图：`src/view/` 目录下的组件将新增对应的 `.test.tsx` 测试文件
  - 规范文件：新增并集成 Superpowers 相关文档和规则文件。

## ADDED Requirements
### Requirement: 单元测试基础环境
项目 SHALL 提供开箱即用的单元测试环境，并支持测试覆盖率统计。

### Requirement: 现有逻辑全覆盖
现有的核心业务（包含 `ai`, `utils`, `models`, `commands`, `state`, `battle` 等） SHALL 拥有对应的单元测试代码，且确保所有用例通过。

### Requirement: 基于 Superpowers 的 AI 开发规范
项目 SHALL 包含针对 AI 的全局提示规则文件，强制要求：
- 任何功能开发和迭代必须遵守 Superpowers 提供的 `test-driven-development` 技能流程。
- 采用 RED-GREEN-REFACTOR 循环：先编写失败的测试，再编写极简代码使之通过，最后重构。
