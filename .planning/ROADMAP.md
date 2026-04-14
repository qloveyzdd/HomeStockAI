# Roadmap: 家补 AI（RefillWise）

## Overview

这条路线图的目标不是先堆很多“AI 功能”，而是先把家庭补货的最小闭环跑通：建档、追踪物品、录入购买记录、估算库存、抓取价格、生成建议、接收反馈，再逐步把提醒和解释做得更可信。前 5 个阶段会优先交付一个可内测的 MVP，让用户能在 3 秒内看懂“现在该不该买”。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions if needed later

- [ ] **Phase 1: Product Skeleton & Household Setup** - 搭好前后端骨架，完成家庭档案与追踪物品基础能力
- [ ] **Phase 2: Records & Inventory Baseline** - 打通购买记录录入和库存估算闭环
- [ ] **Phase 3: Price Tracking Baseline** - 接入首个价格来源，形成价格快照与历史比较能力
- [ ] **Phase 4: Decision Experience** - 生成补货建议，完成首页、列表和详情决策视图
- [ ] **Phase 5: Feedback & Reminder Hardening** - 用反馈校正模型，并收敛为低打扰提醒系统

## Phase Details

### Phase 1: Product Skeleton & Household Setup
**Goal**: 建立 `web/api/worker` 的最小骨架，并交付家庭档案和追踪物品管理能力
**Depends on**: Nothing (first phase)
**Requirements**: [HOME-01, HOME-02, ITEM-01, ITEM-02, ITEM-03]
**Success Criteria** (what must be TRUE):
  1. 用户可以在移动端完成家庭档案创建与编辑
  2. 用户可以添加、配置、启用和停用受支持的追踪物品
  3. 本地开发环境可以同时运行前端、后端、worker 和数据库迁移
**Plans**: 3 plans

Plans:
- [x] 01-01: 搭建仓库结构、运行时配置、共享 API 约定和本地开发环境
- [x] 01-02: 实现 household / item 核心模型、迁移和 CRUD API
- [ ] 01-03: 完成建档流程、设置页和追踪物品管理界面

### Phase 2: Records & Inventory Baseline
**Goal**: 让用户录入购买记录后，系统可以立即给出库存估算结果
**Depends on**: Phase 1
**Requirements**: [RECD-01, RECD-02, RECD-03, RECD-04, INVT-01, INVT-02, INVT-03, INVT-04]
**Success Criteria** (what must be TRUE):
  1. 用户可以手动录入购买记录并通过粘贴订单文本生成待确认记录
  2. 购买记录保存后，系统会刷新剩余数量、剩余天数和置信度
  3. 系统可以识别低于安全库存的物品，供首页和后续提醒使用
**Plans**: 3 plans

Plans:
- [ ] 02-01: 实现购买记录模型、录入 API、文本解析入口和历史查询
- [ ] 02-02: 实现库存估算服务、置信度计算和安全库存判断
- [ ] 02-03: 完成记录录入页、记录历史展示和库存状态展示

### Phase 3: Price Tracking Baseline
**Goal**: 接入至少一个稳定价格来源，为追踪物品建立价格快照与历史比较能力
**Depends on**: Phase 2
**Requirements**: [PRIC-01, PRIC-02, PRIC-03, PRIC-04]
**Success Criteria** (what must be TRUE):
  1. 系统可以为追踪物品定时采集价格快照并落库
  2. 系统可以计算近 7 天最低价、近 30 天均价和接近低价状态
  3. 价格页面和接口只返回与当前追踪物品相关的价格机会
**Plans**: 3 plans

Plans:
- [ ] 03-01: 设计价格快照模型、首个价格源适配器和 SKU 归一化规则
- [ ] 03-02: 建立抓价定时任务、失败重试和基础监控
- [ ] 03-03: 完成价格查询接口和优惠页最小展示

### Phase 4: Decision Experience
**Goal**: 基于库存、价格和偏好生成建议，并完成面向用户的决策视图
**Depends on**: Phase 3
**Requirements**: [ITEM-04, RECO-01, RECO-02, RECO-03, RECO-04, DASH-01, DASH-02, DASH-03, DASH-04]
**Success Criteria** (what must be TRUE):
  1. 首页可以稳定展示“快见底”“现在值得买”“先别买”三类结果
  2. 物品列表和详情页可以展示预计剩余天数、价格状态、当前建议和解释文本
  3. 推荐引擎可以输出动作、推荐数量和原因说明，且结果可回溯
**Plans**: 3 plans

Plans:
- [ ] 04-01: 实现推荐引擎、动作评分和推荐数量规则
- [ ] 04-02: 完成首页决策卡片、物品列表和物品详情页
- [ ] 04-03: 补齐建议解释、周摘要和关键指标埋点

### Phase 5: Feedback & Reminder Hardening
**Goal**: 让反馈真正修正系统判断，并把通知收敛到高价值低打扰
**Depends on**: Phase 4
**Requirements**: [FDBK-01, FDBK-02, FDBK-03, FDBK-04, NOTI-01, NOTI-02, NOTI-03]
**Success Criteria** (what must be TRUE):
  1. 用户反馈后，库存估算和建议会立即体现变化
  2. 系统只在高价值条件下提醒，并执行去重、稍后提醒和不再提醒规则
  3. MVP 闭环可以支撑一轮内测，提醒不会连续轰炸用户
**Plans**: 3 plans

Plans:
- [ ] 05-01: 实现反馈日志、反馈驱动的重算和行为校正逻辑
- [ ] 05-02: 实现提醒判定、节流规则、静默窗口和 mute 机制
- [ ] 05-03: 完成内测前联调、数据校验和提醒策略压测

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Product Skeleton & Household Setup | 0/3 | Not started | - |
| 2. Records & Inventory Baseline | 0/3 | Not started | - |
| 3. Price Tracking Baseline | 0/3 | Not started | - |
| 4. Decision Experience | 0/3 | Not started | - |
| 5. Feedback & Reminder Hardening | 0/3 | Not started | - |
