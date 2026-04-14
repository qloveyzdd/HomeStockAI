# Phase 1: Product Skeleton & Household Setup - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

本阶段只交付项目骨架、简化登录、家庭建档和追踪物品管理能力，目标是把 `web/api/worker` 的最小可运行骨架立起来，并让用户能完成“登录 -> 建档 -> 添加追踪物品”。本阶段不包含购买记录、库存估算、价格追踪、推荐引擎、首页决策视图和提醒系统。

</domain>

<decisions>
## Implementation Decisions

### 账户与首启方式
- **D-01:** Phase 1 必须先登录后使用，不做免登录体验，也不做单机本地模式。
- **D-02:** 一个家庭在 MVP 阶段只对应一个主账号，不做多人协同。
- **D-03:** 长期产品方向是手机号验证码登录，但 Phase 1 不接真实短信能力。
- **D-04:** Phase 1 先做数据库预置测试账号的 `手机号 + 密码登录`，用于跑通产品闭环。
- **D-05:** 新用户登录成功后直接进入家庭建档流程，不先进入空首页或设置页。

### 家庭建档流程
- **D-06:** 建档使用单页表单，一次填写完成，不做多步向导。
- **D-07:** Phase 1 建档只收最关键字段：家庭人数、是否有宠物、宠物类型、是否有婴幼儿、储物空间等级、价格敏感度、囤货偏好。
- **D-08:** 常购平台和提醒容忍度不作为 Phase 1 建档必填项，可留到后续设置中补充。
- **D-09:** 建档完成后直接进入“添加追踪物品”流程。

### 物品添加方式
- **D-10:** 添加物品的主方式是先选择预设支持品类，再补品牌和规格。
- **D-11:** Phase 1 允许自定义物品，不强制限制在预设品类内。
- **D-12:** 自定义物品在产品规则层面与标准品类同等待遇，但后续价格追踪能否稳定覆盖，仍以真实价格源可用性为准。
- **D-13:** 创建物品时采用折中字段策略：必填品类、品牌、规格，其他配置项后补。

### 产品壳范围
- **D-14:** Phase 1 要把一级导航壳一起搭出来，而不是只做独立功能页。
- **D-15:** Phase 1 的一级导航首版只保留 `物品` 和 `设置` 两个入口。
- **D-16:** Phase 1 不做首页入口，也不做占位首页；建档完成后直接进入物品页。

### the agent's Discretion
- 简化登录的具体会话机制、token/cookie 细节和鉴权中间件结构由后续规划决定。
- 建档表单的字段布局、校验提示文案、移动端表单交互细节由后续规划决定。
- 物品创建页的具体信息密度、列表卡片样式和导航视觉设计由后续规划决定。
- 预设品类的初始实现方式（枚举、配置表或种子数据）由后续规划决定。

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 项目边界与目标
- `.planning/PROJECT.md` - 产品定位、核心价值、MVP 边界、技术约束
- `.planning/REQUIREMENTS.md` - Phase 1 对应的需求项 `HOME-01`、`HOME-02`、`ITEM-01`、`ITEM-02`、`ITEM-03`
- `.planning/ROADMAP.md` - Phase 1 的目标、依赖、成功标准和计划拆分入口
- `.planning/STATE.md` - 当前项目位置与后续阶段注意事项

### 研究结论
- `.planning/research/SUMMARY.md` - 技术栈、架构与 MVP 优先级总结
- `.planning/research/STACK.md` - `Next.js + FastAPI + PostgreSQL + Redis + Celery` 的选型依据
- `.planning/research/ARCHITECTURE.md` - `web/api/worker` 结构、模块边界和构建顺序
- `.planning/research/FEATURES.md` - MVP table stakes 与反模式边界
- `.planning/research/PITFALLS.md` - 冷启动、提醒过多、价格源不稳等关键风险

### 工作方式
- `AGENTS.md` - 当前项目的 GSD 工作流约束、技术栈摘要和架构摘要

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 当前仓库还没有业务代码、组件库、hook 或工具函数可复用。

### Established Patterns
- 当前不存在既有前端样式模式、数据获取模式或后端模块组织模式，需要在 Phase 1 内建立第一版规范。
- 项目级约束已经锁定为前后端拆分，但保持简单，不做微服务。

### Integration Points
- 新代码应从 `apps/web`、`apps/api`、`apps/worker` 这类最小分层开始建立。
- Phase 1 交付后，Phase 2 会直接在本阶段的账号、家庭和物品数据模型上继续叠加购买记录与库存估算。

</code_context>

<specifics>
## Specific Ideas

- 产品语境始终是中国大陆家庭场景，登录习惯优先贴近手机号体系。
- 当前阶段不追求“看起来像真实短信登录”，而是先用最简单的测试账号模式跑通。
- 用户希望尽快进入产品主流程，所以登录后直接建档，建档后直接进入添加物品。
- Phase 1 更像“产品骨架 + 建档与物品起步能力”，不是一个完整可消费首页。

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 01-product-skeleton-household-setup*
*Context gathered: 2026-04-14*
