# Phase 2: Records & Inventory Baseline - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

本阶段只交付“购买记录录入 + 库存估算 baseline”闭环：用户可以围绕已追踪物品录入购买记录，系统可以基于购买记录、家庭档案和品类默认值给出第一版库存估算，并把结果展示在物品详情和物品列表中。

本阶段不包含价格追踪、推荐引擎、首页决策视图、提醒系统、OCR 图片识别和一级导航扩展。
</domain>

<decisions>
## Implementation Decisions

### 记录入口与页面结构
- **D-01:** 购买记录的主入口放在物品列表和物品详情内部，不新增一级导航 `记录`。
- **D-02:** Phase 2 要把现有“编辑物品”路径演进成独立的物品详情页，由详情页承接库存状态、购买记录和“添加购买记录”入口。
- **D-03:** 建档完成后的默认主工作区继续保持为 `物品` 页，不切换到记录页，也不恢复首页。

### 手动录入表单
- **D-04:** 手动录入从物品详情页进入，默认绑定当前物品，不要求用户先全局选物品。
- **D-05:** 手动录入的必填字段锁定为：物品、购买数量、总价、购买日期、平台。
- **D-06:** 平台字段采用“预设平台选项 + 允许自定义”的方式，不做完全自由输入，也不限制为纯预设值。
- **D-07:** 一次录入只保存一条购买记录，保存后再决定是否继续添加，不做批量录入或表格式录入。

### 文本粘贴解析
- **D-08:** “粘贴订单文本”作为“添加购买记录”页里的次级入口，不单独做导入页。
- **D-09:** 文本解析后的交互是先产出一条候选记录，再回填到表单中让用户确认后保存。
- **D-10:** Phase 2 的文本解析只追求基础字段提取：物品名、数量、价格、平台；不追求规格、优惠信息、到货时间等扩展字段。

### 库存估算与展示
- **D-11:** 记录不足时也要先给粗略库存估算，但必须明确标记“估算中”，不能假装结果很准。
- **D-12:** 库存估算优先使用最近 2 到 5 条有效购买记录；如果不足，则退化为“最近 1 条记录 + 家庭档案/品类默认值”。
- **D-13:** 库存信息优先展示在物品详情页，同时在物品列表页展示轻量状态。
- **D-14:** 物品列表页只展示轻量库存状态，例如“预计剩余天数 / 估算中 / 低于安全库存”，不把日均消耗、置信度和完整历史都堆在列表页。

### the agent's Discretion
- 文本解析的具体提取规则、正则/启发式顺序和失败兜底文案由后续规划决定。
- 库存估算公式中的平滑细节、异常记录过滤规则和置信度打分细节由后续研究和规划决定。
- 物品详情页里“记录历史”和“库存状态”模块的具体视觉层级、卡片密度和微文案由后续 UI/规划决定。
</decisions>

<specifics>
## Specific Ideas

- Phase 2 继续围绕 `物品` 做主工作区，不把产品重心切到新导航或新首页。
- 购买记录是为了服务库存估算，不是为了做记账流水，所以录入体验要尽量短。
- “估算中”必须可见，这样早期估算不准时不会伤害用户信任。
- 文本粘贴解析在 Phase 2 只做“够用”，核心目标是减少手填，不是做复杂订单理解。
</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 项目边界与需求
- `.planning/PROJECT.md` - 产品定位、MVP 边界、核心价值和技术约束。
- `.planning/REQUIREMENTS.md` - Phase 2 对应需求 `RECD-01`、`RECD-02`、`RECD-03`、`RECD-04`、`INVT-01`、`INVT-02`、`INVT-03`、`INVT-04`。
- `.planning/ROADMAP.md` - Phase 2 的目标、成功标准和 3 个计划拆分方向。
- `.planning/STATE.md` - 当前项目状态和下一阶段上下文。

### 前序阶段决策
- `.planning/phases/01-product-skeleton-household-setup/01-CONTEXT.md` - 已锁定的登录、导航、建档、物品管理边界，Phase 2 必须继承。
- `.planning/phases/01-product-skeleton-household-setup/01-VERIFICATION.md` - Phase 1 已验证通过的页面壳和数据流事实。

### 前序阶段实现结果
- `.planning/phases/01-product-skeleton-household-setup/01-03-SUMMARY.md` - 当前 Web 端已有哪些页面、守卫和构建修复。
- `.planning/phases/01-product-skeleton-household-setup/01-02-SUMMARY.md` - 当前 API 端已有的 account / household / item 模型和路由。

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/web/src/components/app-shell.tsx` - 现有双标签移动端外壳可继续复用，Phase 2 不需要扩一级导航。
- `apps/web/src/app/items/page.tsx` - 当前物品页已是主工作区，适合继续承接“记录入口 + 轻量库存状态”。
- `apps/web/src/lib/api-client.ts` 与 `apps/web/src/lib/server-api.ts` - 已建立 browser/server 分离的数据请求模式。
- `apps/web/src/components/items/item-summary-card.tsx` - 现有物品卡片可在不改主结构的前提下补充轻量库存状态。
- `apps/api/app/api/routes/items.py` - 已有 item CRUD、启停和 catalog，可作为记录和库存服务的挂载点。
- `apps/api/app/domain/item_catalog.py` - 已有预设品类默认信息，可继续提供默认安全库存和估算兜底参数。

### Established Patterns
- Web 侧受保护页面统一走 `server-session` 判断登录和建档完成状态。
- Phase 1 已确定主工作区是 `物品`，导航只保留 `物品 / 设置`，Phase 2 不能越界扩成多入口产品壳。
- API 侧坚持“单账号单家庭”，所有数据都通过当前账号所属 household 约束。

### Integration Points
- 需要在 API 层新增 purchase records 模型、迁移、录入接口、查询接口和库存重算接口。
- 需要把现有 `items/[id]/edit` 路径重构为详情导向页面，并为“编辑物品”留出二级入口。
- 需要在物品列表和详情之间建立库存状态的一致展示层，但保持列表信息轻量。
</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 02-records-inventory-baseline*
*Context gathered: 2026-04-14*
