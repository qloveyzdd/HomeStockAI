# Phase 3: Price Tracking Baseline - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

这一阶段只解决“给追踪物品接入首个真实价格来源，并稳定产出价格快照与历史比较结果”这件事。

Phase 3 的交付边界是：
- 为追踪物品建立可维护的商品绑定关系
- 接入首个真实售卖平台价格来源
- 抓取并落库存量相关商品的价格快照
- 计算近 7 天最低价、近 30 天均价和是否接近低价
- 在物品详情页展示最小可用的价格信息

这一阶段不做：
- 推荐引擎
- 首页决策卡片
- 新的一级导航 `优惠`
- 全网最低价导购
- `什么值得买` 主链路接入
</domain>

<decisions>
## Implementation Decisions

### 价格来源角色
- **D-01:** Phase 3 的主价格来源先用真实售卖平台，不用 `什么值得买` 作为主链路。
- **D-02:** 首个真实售卖平台优先接 `京东`。

### 商品绑定策略
- **D-03:** 商品绑定先走系统自动搜索匹配，不要求用户手动粘贴商品链接。
- **D-04:** 每个追踪物品先支持 `2 到 3` 个候选商品。
- **D-05:** 候选商品由用户手动确认要追踪哪几个，不自动静默绑定。
- **D-06:** 如果物品还没有完成商品绑定，就不抓价，详情页明确提示用户先绑定商品。

### 候选商品筛选原则
- **D-07:** 候选池只展示高信用、公司规模较大、行业头部、品牌感稳定的商品，不展示泛杂候选。
- **D-08:** 产品心智不是“全网最低价”，而是“保留好品牌前提下，买得更值”。用户画像更接近高认知、重品牌信任和稳定品质的人群，类似“山姆心智”。

### 抓价节奏
- **D-09:** 商品绑定成功后立即抓一次价格，让用户第一时间看到结果。
- **D-10:** 定时抓价频率先按每 6 小时一次。
- **D-11:** 抓价失败时记录失败并自动重试 `1 到 2` 次，不在 Phase 3 直接把失败前台打给用户。

### 前端展示边界
- **D-12:** Phase 3 的价格主展示入口先放在物品详情页，不单独扩一级入口。
- **D-13:** 继续只保留 `物品 / 设置` 两个一级导航，不新增 `优惠`。
- **D-14:** 详情页价格模块首版只展示：当前价、近 7 天最低、近 30 天均价、是否接近低价、最近抓价时间。

### the agent's Discretion
- 候选商品搜索时如何组合品牌、规格、品类关键词，由 researcher / planner 在不违背“高信用头部品牌优先”的前提下决定。
- 京东商品绑定后的内部数据结构是单主商品加少量候选，还是主从关系表，由后续 planning 决定，但外部产品行为必须保持为“每个物品可确认 2 到 3 个候选”。
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 项目与范围
- `.planning/PROJECT.md` - 项目定位、市场语境、核心价值与约束
- `.planning/REQUIREMENTS.md` - Phase 3 对应的 `PRIC-01` 到 `PRIC-04` requirement
- `.planning/ROADMAP.md` - Phase 3 目标、成功标准与 plan 边界
- `.planning/STATE.md` - 当前项目状态与下一阶段焦点

### 前置阶段产物
- `.planning/phases/02-records-inventory-baseline/02-CONTEXT.md` - 已锁定的记录与库存展示口径
- `.planning/phases/02-records-inventory-baseline/02-03-SUMMARY.md` - Phase 2 前端闭环与详情页主入口现状

### 当前代码锚点
- `apps/api/app/models/household_item.py` - 现有物品配置字段，尤其是 `preferred_platform`
- `apps/api/app/api/routes/items.py` - 当前物品列表、详情与库存状态接口
- `apps/web/src/app/items/[id]/page.tsx` - 物品详情页，Phase 3 的价格展示主入口
- `apps/web/src/components/items/item-detail-hero.tsx` - 详情页顶部摘要组件，可承接价格模块布局
- `apps/worker/worker/celery_app.py` - 现有 worker 入口，可承接抓价任务
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/web/src/app/items/[id]/page.tsx` 已经是物品详情页主入口，适合直接挂价格模块，不需要再造新页面壳。
- `apps/api/app/api/routes/items.py` 已经具备 item 详情和列表接口，可在不改变主导航的情况下补充价格摘要字段。
- `apps/worker/worker/celery_app.py` 已有 worker 入口，Phase 3 可以直接接定时抓价任务，不需要从零搭后台任务框架。

### Established Patterns
- 物品相关体验继续围绕 `物品` 视角展开，而不是新增 `记录` 或 `优惠` 一级导航。
- 列表页只展示轻量摘要，完整解释留在详情页，这个模式在库存状态里已经建立，Phase 3 价格展示也应沿用。
- household 边界已经在 API 中明确，价格绑定和价格快照也应该继续严格挂在当前 household 的 item 上。

### Integration Points
- 商品绑定关系应挂在现有 `HouseholdItem` 体系附近，避免另起一套脱离物品上下文的价格域模型。
- 定时抓价和首次立即抓价都应通过现有 worker / task 体系承接。
- 详情页价格模块会直接消费新建的价格查询接口，与当前库存卡片并列出现。
</code_context>

<specifics>
## Specific Ideas

- 用户明确希望商品筛选先保“品牌可信度”和“行业头部感”，而不是盲目扩大候选池。
- 用户强调产品心智更像“山姆”：不是为了找最便宜，而是在可信品牌前提下找到更合适的购买时机。
- `什么值得买` 不是被否定，而是被明确延后到后续阶段，作为“价格机会信号增强层”更合适。
</specifics>

<deferred>
## Deferred Ideas

- `什么值得买` 作为价格机会信号源：不在 Phase 3 做主链路，后续可以作为增强信号加入。
- 全量优惠页或一级导航 `优惠`：明确不在本阶段落地。
- 全网最低价导购体验：与当前品牌信任优先的产品方向不一致，后续如要做也应单独评估。
</deferred>

---

*Phase: 03-price-tracking-baseline*
*Context gathered: 2026-04-15*
