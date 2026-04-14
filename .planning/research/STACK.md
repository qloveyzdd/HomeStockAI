# Stack Research: 家补 AI（RefillWise）

## 结论

这个项目最适合的 MVP 技术路线不是“多服务、多语言、多平台”，而是：

- 前端：`Next.js 16` + `TypeScript` + `Tailwind CSS` + `shadcn/ui`
- 数据获取与交互：`TanStack Query v5` + 明确的 API Client
- 后端：`FastAPI 0.135.x` + `Pydantic v2` + `SQLAlchemy 2.0` + `Alembic 1.18`
- 数据库：`PostgreSQL 17.x`
- 任务调度：`Redis 8` + `Celery 5.6`
- 部署：前后端分离部署，但实现保持单体仓库/双应用，不做微服务

## 推荐栈

| 层 | 建议 | 为什么选 | 先不做什么 |
|----|------|----------|-----------|
| Web 前端 | Next.js 16 App Router + TypeScript | 适合移动优先 Web，SSR/CSR 混合能力强，页面、表单、SEO 和后续扩展都顺手 | 不上 React Native / Flutter，首版没必要双端并行 |
| UI 层 | Tailwind CSS + shadcn/ui | 适合快速搭建高密度卡片和表单，组件可控，后续迁移设计系统成本低 | 不引入重型商业组件库 |
| 前端数据层 | TanStack Query v5 + 自定义 API SDK | 这个产品有轮询、失效、手动刷新、提交后重算等场景，单纯靠本地 state 很快会乱 | 不把状态管理上升到 Redux 这类全局复杂方案 |
| API 后端 | FastAPI 0.135.x | 适合 typed schema、后台任务和规则计算，和后续 OCR / 统计 / 推荐逻辑天然兼容 | 不把核心业务塞回 Next.js Route Handlers |
| 数据访问 | SQLAlchemy 2.0 + Alembic 1.18 | Python 生态里最稳的 ORM + migration 组合，适合结构化业务数据长期演进 | 不上过度封装的 ORM 黑盒 |
| 主数据库 | PostgreSQL 17.x | 对结构化数据、时间序列快照、查询统计都够用，成熟稳定 | 首版不拆 OLAP，不上 ClickHouse 之类分析库 |
| 缓存 / 队列 | Redis 8 + Celery 5.6 | 价格抓取、定时重算、通知节流都需要异步任务；既然后端选 Python，就不要再引入 BullMQ 双栈维护 | 不用 BullMQ，避免 Node/Python 两套 worker 逻辑并存 |
| 鉴权 | FastAPI 统一签发会话 / token，前端走安全 Cookie | 这个项目真正难点不在鉴权，先做简单可靠的用户体系更合理 | 不急着接入复杂第三方身份平台 |
| OCR / 解析 | v1 先做订单文本粘贴解析，OCR 延后到 v2 | 冷启动最先要验证的是闭环，不是图像识别精度 | 首版不把 OCR 做成主入口 |
| LLM 使用方式 | 只负责解释文本和弱解析增强，不负责核心推荐决策 | 核心决策要稳定可控、可回溯，不能把“该不该买”全交给模型 | 不把 LLM 放到关键规则闭环里直接拍板 |

## 为什么这个组合最适合当前项目

### 1. 前后端拆开，但不要拆成微服务

你已经确认前后端要拆开，这个判断是对的，因为：

- 前端更像一个高交互、移动优先、解释性强的产品壳
- 后端更像一个带定时任务的数据计算系统
- 价格抓取、库存重算、提醒去重天然是后台职责

但 MVP 阶段不要进一步拆成“用户服务 / 推荐服务 / 通知服务 / 抓价服务”的独立部署单元。更好的做法是：

- 一个前端应用：`web`
- 一个后端应用：`api`
- 一个异步 worker：`worker`

它们可以在同一仓库里共享类型和契约，但运行职责分开。

### 2. Python 后端比 Node 后端更适合这个项目

这个产品长期会有三类非 CRUD 能力：

- 库存估算
- 价格统计
- 解析 / OCR / 规则计算

这些都更贴近 Python 生态，所以后端用 FastAPI 比继续堆在 Next.js API Route 更顺手。这里不是说 Next.js 不能做，而是说你后面一定会越来越像一个“计算型后端”，到那时再拆会更痛。

### 3. 任务系统必须尽早上，但只上最小的

这个项目如果没有异步任务，很快会卡住：

- 每日库存重算
- 定时抓价
- 抓价后重算建议
- 提醒去重和发送

既然后端是 Python，任务系统就直接用 Celery。BullMQ 本身没问题，但会让你为了队列额外维护一套 Node worker，不划算。

## MVP 建议保留的工程边界

### 必须有

- `web` 前端应用
- `api` 后端应用
- `worker` 异步任务入口
- `postgres` 主库
- `redis` 队列 / 缓存 / 限流

### 可以后补

- 对象存储
- OCR 服务
- 多价格源聚合
- 复杂搜索与 BI 分析
- 事件总线 / Kafka

## 不建议现在就上的东西

- 微服务拆分
- GraphQL
- 重型事件驱动架构
- 全量消息队列编排
- 各种“智能推荐模型平台化”
- 复杂多租户设计

## 2026-04 校验过的官方版本信号

- Next.js 文档当前显示 `16.2.3`
- FastAPI release notes 当前最新为 `0.135.3`（2026-04-01）
- SQLAlchemy 2.0 文档当前 release 为 `2.0.49`
- Alembic 文档当前版本为 `1.18.4`
- Celery stable 文档当前为 `5.6.x`
- PostgreSQL 官方当前支持版本包含 `17.x` 与 `18.x`

## 建议落地方式

1. 先用单仓多目录：`apps/web`、`apps/api`、`apps/worker`
2. 前端先把首页、物品、记录、设置四个主要界面跑起来
3. 后端先把 Household / Item / PurchaseRecord / InventoryState 四张核心链路表做稳
4. 抓价先只接一个来源，不做“全网最低价”
5. 推荐引擎先规则化，可解释优先，不追求模型感

## Sources

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Release Notes](https://fastapi.tiangolo.com/release-notes/)
- [SQLAlchemy 2.0 Docs](https://docs.sqlalchemy.org/en/20/)
- [Alembic Docs](https://alembic.sqlalchemy.org/en/latest/)
- [PostgreSQL Versioning Policy](https://www.postgresql.org/support/versioning/)
- [Celery Stable Docs](https://docs.celeryq.dev/en/stable/getting-started/index.html)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
