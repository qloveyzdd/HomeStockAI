<!-- GSD:project-start source:.planning/PROJECT.md -->
## Project

- 项目名：家补 AI（RefillWise）
- 产品定位：面向中国大陆家庭的补货决策助手，不做家庭 ERP，不做导购瀑布流
- 核心价值：少输入、能解释、真有用，优先解决缺货、重复购买和不知道是否值得囤的问题
- 当前重点：先完成 MVP 闭环，再进入内测验证
<!-- GSD:project-end -->

<!-- GSD:stack-start source:.planning/research/STACK.md -->
## Technology Stack

- 前端：Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
- 前端数据层：TanStack Query v5 + 明确的 API Client
- 后端：FastAPI 0.135.x + Pydantic v2 + SQLAlchemy 2.0 + Alembic 1.18
- 基础设施：PostgreSQL 17.x + Redis 8 + Celery 5.6
- 原则：前后端拆开，但不做微服务；推荐引擎先规则化，LLM 只做解释和弱解析增强
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:repo-local -->
## Conventions

- 所有实现优先服务 MVP 闭环：建档 -> 物品 -> 记录 -> 库存 -> 价格 -> 建议 -> 反馈
- 遵循 KISS，避免为了未来场景过度抽象
- 核心决策必须可解释、可回溯，不把“该不该买”直接交给 LLM
- 默认先做移动端友好的页面和低打扰交互
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:.planning/research/ARCHITECTURE.md -->
## Architecture

- `apps/web`：负责界面、表单和决策展示
- `apps/api`：负责 household、item、record、inventory、pricing、recommendation、notification 领域逻辑
- `apps/worker`：负责抓价、重算、提醒等异步任务
- 同步请求只做用户即时操作，定时抓价与批量重算全部走异步链路
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

优先通过 GSD 流程推进阶段性工作，保持 `.planning/` 与实际执行同步。

建议入口：
- `/gsd-discuss-phase 1`：继续澄清 Phase 1 方案
- `/gsd-plan-phase 1`：直接把 Phase 1 拆成计划
- `/gsd-quick`：处理小范围任务

除非用户明确要求直接改代码，否则优先让阶段规划先行。
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
