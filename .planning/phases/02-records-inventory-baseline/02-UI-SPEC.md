---
phase: 02
slug: records-inventory-baseline
status: approved
shadcn_initialized: false
preset: new-york
created: 2026-04-14
---

# Phase 02 - UI Design Contract

> Visual and interaction contract for frontend phases. Generated for Phase 2 and intended to guide planning and execution.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn |
| Preset | new-york |
| Component library | radix |
| Icon library | lucide-react |
| Font | Noto Sans SC |

### Design Direction

- 延续 Phase 1 的“可靠的家庭生活助手”气质，不切成记账工具，也不做电商导购页
- Phase 2 的核心感受是“我知道这件东西还够用多久”，不是“我录了一堆流水”
- 详情页比列表页更重要，信息层级要服务单个物品判断
- 录入体验优先短路径，避免长表单压迫感
- 继续移动优先，单手完成主要动作，桌面端仍保持单列内容

### Phase Tone

- 关键词：稳、清楚、少打扰、可解释
- 不做复杂图表，不做后台式数据表，不做密集筛选器
- “估算中”必须看起来诚实，不伪装成高确定性结论

---

## Layout Contract

### Global Shell

- 继续复用现有移动优先应用壳
- 一级导航仍只保留 `物品` 和 `设置`
- Phase 2 不新增 `记录` 一级入口，也不恢复首页
- 从物品列表进入物品详情；记录录入和库存展示都围绕物品详情展开

### Page Width

- Mobile max content width: `480px`
- Desktop fallback: 居中单列，内容不超过 `640px`
- 列表页、详情页、记录页都保持单列阅读节奏

### Page Surfaces

- 页面背景继续使用暖灰底色，维持 Phase 1 连续性
- 详情页使用“顶部摘要卡 + 分段信息卡”的结构
- 添加记录页使用“主录入卡 + 次级解析入口卡 + 固定底部 CTA”
- 列表页卡片只增加轻量库存状态，不增加第二层复杂信息块

### Information Density

- 列表页：一眼看状态，不解释算法
- 详情页：解释库存估算和记录历史，但每个模块最多承载一个主题
- 添加记录页：同屏只让用户完成一件事，手动录入和文本粘贴不能同时争主位

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | 标签与图标的微间距 |
| sm | 8px | 状态徽标、表单内部紧凑间距 |
| md | 16px | 卡片内边距、常规组件间距 |
| lg | 24px | 页面模块间距 |
| xl | 32px | 详情页大模块切换 |
| 2xl | 48px | 长页面顶部摘要与正文分隔 |
| 3xl | 64px | 空状态与页面级留白 |

Exceptions: 底部固定 CTA 区可使用 `20px` 内边距，以兼顾安全区和视觉紧凑度

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 15px | 400 | 1.6 |
| Label | 13px | 500 | 1.4 |
| Heading | 22px | 700 | 1.3 |
| Display | 28px | 700 | 1.2 |

### Typography Rules

- 库存相关数字优先突出，例如“还够 6 天”
- “估算中”不是小字脚注，必须以可见标签或说明出现
- 详情页的解释文案控制在 2 行到 3 行，不写成长段说明
- 时间类信息用口语化表达优先，如“上次买是在 4 月 8 日”
- 表单标签始终显示，不靠 placeholder 承担字段语义

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #F5F1E8 | 页面背景、滚动底色 |
| Secondary (30%) | #E5DED1 | 卡片底、弱分组、信息分层 |
| Accent (10%) | #2E6A57 | 主 CTA、选中状态、关键确认动作 |
| Destructive | #C5523F | 删除记录、停用追踪、退出等破坏性动作 |

Accent reserved for: 主按钮、当前选中的入口、手动录入主路径、确认保存

### Color Behavior

- 列表页库存状态优先用文案和细标签区分，不靠大面积彩色底块
- “低于安全库存”可以用轻量强调标签，但不要做成报警页
- “估算中”用中性色标签，不使用红色制造恐慌
- 文本粘贴解析结果卡使用比主表单更弱的底色，明确它是辅助入口

---

## Core Interaction Contract

### 物品列表页

- 仍然是 Phase 2 的默认主工作区
- 每张物品卡点击后进入物品详情页，不再直接进入编辑页
- 卡片新增轻量库存状态区，只展示以下其中一种：
  - `预计剩余 X 天`
  - `估算中`
  - `低于安全库存`
- 卡片可以显示最近一次购买的简短信息，但不能挤掉物品基本信息
- 顶部主动作仍是 `添加物品`

### 物品详情页

- Phase 2 新增的核心页面，承接库存状态、购买记录和添加记录入口
- 页面顶部先给一个摘要卡，必须同时包含：
  - 物品名
  - 当前库存状态
  - 安全库存基线
  - 一个最主要动作：`添加购买记录`
- 摘要卡下面按顺序展示三个模块：
  1. 库存状态
  2. 最近购买记录
  3. 物品信息与编辑入口
- 库存状态模块必须能展示：
  - 预计剩余天数
  - 预计剩余数量
  - 日均消耗
  - 置信度或“估算中”说明
- 记录历史模块优先展示最近几条记录，采用时间线或列表，不做表格
- 编辑物品作为次级入口，不与 `添加购买记录` 抢主 CTA

### 添加购买记录页

- 从物品详情进入，默认绑定当前物品
- 页面主路径是手动录入，只保留 5 个必填字段：
  - 物品
  - 购买数量
  - 总价
  - 购买日期
  - 平台
- 平台字段采用“预设选项 + 自定义补充”结构
- 一次只提交一条记录，保存成功后回到物品详情查看更新结果
- 底部固定主按钮文案使用 `保存这次购买`

### 文本粘贴解析

- 放在添加购买记录页内，作为次级入口卡片
- 用户先粘贴文本，再点解析；解析结果回填到同一张表单里
- Phase 2 只解析基础字段：物品名、数量、价格、平台
- 解析结果必须允许完整修改，不能直接自动保存
- 解析失败时给清楚下一步，例如“先继续手动填写”

### 库存状态表达

- “估算中”时，仍然展示粗略结果，但同时说明依据不足
- 当低于安全库存时，详情页要明确展示“已低于你的安全库存 X 天”或等价表达
- 置信度不做抽象分数可视化仪表盘，优先用简单标签：
  - `估算中`
  - `参考性一般`
  - `相对稳定`

---

## Component Contract

### Required Components

- `AppShell`: 延续现有双标签壳
- `ItemSummaryCard`: 升级为可显示轻量库存状态，并跳转详情页
- `ItemDetailHero`: 详情页顶部摘要卡，承接主 CTA
- `InventoryStatusCard`: 展示剩余天数、剩余数量、消耗速度和安全库存
- `PurchaseRecordList`: 购买记录时间线或列表
- `PurchaseRecordForm`: 手动录入表单
- `ParseOrderTextCard`: 文本粘贴解析入口
- `PrimaryActionBar`: 继续复用底部固定主动作区

### Interaction Rules

- 同一屏只允许一个强主动作
- 详情页里的 `添加购买记录` 强于 `编辑物品`
- 手动录入是主路径，文本粘贴解析是辅助路径
- 列表页不提供直接编辑按钮，避免主流路径分叉
- 删除记录如果出现在本阶段，只能放在次级层级并要求确认

---

## Empty / Error / Destructive States

### Empty States

- 物品详情暂无购买记录：
  - 标题：`先记下第一次购买`
  - 说明：`有了第一条记录后，我们就能开始估算还够用多久。`
- 记录列表为空时，页面仍要保留库存说明区，不能只剩一片空白
- 文本解析没有识别出结果时，不说“解析失败”了事，要提示回到手动录入

### Error States

- 添加记录失败时，错误提示贴近表单底部和主按钮区域
- 详情页拉取库存失败时，允许显示物品基础信息和重试入口，不整页崩掉
- 文本解析失败文案要偏帮助式，例如：`这段文字没能识别出完整购买信息，你可以继续手动补上。`

### Destructive Behavior

- `停用追踪` 继续沿用 Phase 1 规则，不升级为危险主按钮
- `删除购买记录` 如果本阶段实现，必须二次确认
- 破坏性动作只用在真正不可逆或会影响估算历史的地方

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | 保存这次购买 / 添加购买记录 |
| Empty state heading | 先记下第一次购买 |
| Empty state body | 有了第一条记录后，我们就能开始估算还够用多久。 |
| Error state | 这次没保存成功，请检查购买信息后重试。 |
| Destructive confirmation | 删除这条记录：删除后，这件物品的库存估算也会跟着变化。 |

### Copy Style

- 记录文案要像“帮你记住这次购买”，不是“录入交易数据”
- 库存文案围绕“还够多久”和“要不要担心”展开
- 避免工程词，如“解析管道”“置信模型”“实体抽取”
- 用户已录入行为的反馈尽量直接，例如：`已记下这次购买`

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | button, input, label, form, card, badge, select, textarea, separator, sheet | not required |

---

## Phase 2 Page Inventory

### Must Exist

- 物品列表页（增强轻量库存状态）
- 物品详情页
- 添加购买记录页
- 设置页

### Can Reuse

- 添加物品页
- 编辑物品页
- 登录页
- 建档页

### Must Not Exist In This Phase

- `记录` 一级导航
- 首页 / Dashboard
- 价格趋势主页面
- 推荐结果页
- 复杂图表式库存分析页

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-14
