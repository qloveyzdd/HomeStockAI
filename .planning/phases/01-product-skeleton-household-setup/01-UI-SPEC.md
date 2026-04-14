---
phase: 01
slug: product-skeleton-household-setup
status: approved
shadcn_initialized: false
preset: new-york
created: 2026-04-14
---

# Phase 01 - UI Design Contract

> Visual and interaction contract for frontend phases. Generated for Phase 1 and intended to guide planning and execution.

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

- 产品气质：像“可靠的家庭生活助手”，不是后台系统，也不是花哨导购页
- 感受关键词：克制、可信、轻负担、清楚
- 移动优先：优先服务单手操作、竖屏使用、短链路完成任务
- 界面层级：大块信息少、动作少、一步一步推进，不做密集表格

---

## Layout Contract

### Global Shell

- Phase 1 采用移动优先应用壳，不做首页入口
- 登录后如果未完成建档，直接进入建档页
- 建档完成后直接进入物品页
- 一级导航采用底部固定双标签：`物品`、`设置`
- 顶部保留简洁页面标题栏，不放复杂统计或二级导航

### Page Width

- Mobile max content width: `480px`
- Desktop fallback: 居中单列，内容不超过 `640px`
- 所有核心表单与列表保持单列，不做双栏后台布局

### Page Surfaces

- 页面背景使用大面积暖灰底
- 主要内容使用圆角卡片承载
- 强交互区域集中在屏幕下半部，减少拇指跨区操作

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | 图标与短标签间距 |
| sm | 8px | 输入框内部、按钮内边距微调 |
| md | 16px | 默认内容间距、卡片内部间距 |
| lg | 24px | 页面区块间距 |
| xl | 32px | 表单分组间距 |
| 2xl | 48px | 页面首屏呼吸区 |
| 3xl | 64px | 空状态或大段落切换 |

Exceptions: 底部固定 CTA 区可使用 `20px` 内边距，以兼顾安全区和视觉紧凑度

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 15px | 400 | 1.6 |
| Label | 13px | 500 | 1.4 |
| Heading | 22px | 700 | 1.3 |
| Display | 30px | 700 | 1.15 |

### Typography Rules

- 页面标题使用中文直白表达，不用抽象命名
- 说明文案短句化，每段不超过两行
- 数字信息优先突出，例如“10 个物品”“2 只猫”
- 表单标签始终显示，不使用只靠 placeholder 的输入设计

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #F5F1E8 | 页面背景、整体底色 |
| Secondary (30%) | #E5DED1 | 卡片背景、分组底、弱分隔块 |
| Accent (10%) | #2E6A57 | 主按钮、选中状态、关键确认动作 |
| Destructive | #C5523F | 删除、停用、退出高风险操作 |

Accent reserved for: 主 CTA、当前选中导航、已选标签、关键保存动作；禁止用于所有可点击元素

### Color Behavior

- 默认输入框边框使用低对比中性色，不用高饱和蓝色焦点框
- 卡片状态优先靠标签和文案区分，不用大面积高饱和底色
- 自定义物品入口可使用弱强调描边样式，不应抢过主路径“选择预设品类”

---

## Core Interaction Contract

### 登录页

- 单屏完成登录，不做注册/忘记密码复杂分流
- 只展示两个字段：手机号、密码
- 页面提供“测试账号说明”小卡片，明确这是 Phase 1 简化登录
- 主按钮固定文案：`登录并开始`
- 登录成功直接跳转建档页

### 家庭建档页

- 单页表单，不拆步骤，不做进度条
- 字段顺序按理解成本排序：
  1. 家庭人数
  2. 是否有宠物
  3. 宠物类型（条件显示）
  4. 是否有婴幼儿
  5. 储物空间等级
  6. 价格敏感度
  7. 囤货偏好
- 选择类字段优先使用大号 segmented chips / radio cards，而不是原生下拉
- 页面底部固定主按钮：`保存并添加物品`

### 物品页

- 这是 Phase 1 的默认落点页
- 顶部应有明确主动作：`添加物品`
- 列表视图优先展示：
  - 物品名称
  - 品类
  - 品牌 / 规格摘要
  - 启用状态
- 不展示未来阶段才有的库存预测、价格机会、建议动作占位块
- 每个物品卡片提供进入编辑页或详情抽屉的入口

### 添加物品流

- 主路径是“先选预设品类，再补品牌和规格”
- 预设品类用可点击卡片或大号 chips 展示，首屏就能看到常用品类
- `自定义物品` 作为列表底部的次级入口，不与主路径同权重展示
- 创建页字段优先级：
  - 品类
  - 品牌
  - 规格
  - 其他字段折叠到“更多设置”
- 主按钮文案：`保存物品`

### 设置页

- Phase 1 设置页只承担两个职责：
  - 修改家庭档案
  - 查看当前账号与退出登录
- 设置页结构要像“可编辑信息页”，不是功能菜单墙
- 家庭档案编辑可复用建档表单结构，不重新发明第二套交互

---

## Component Contract

### Required Components

- `AppShell`：带页面标题和底部双导航
- `PrimaryActionBar`：移动端底部固定主按钮区域
- `FormSectionCard`：建档表单分组卡片
- `ChoiceChipGroup`：用于偏好选择和枚举字段
- `ItemCategoryGrid`：预设品类选择区
- `ItemSummaryCard`：物品列表卡片
- `EmptyStateCard`：无物品时的引导状态

### Interaction Rules

- 主按钮始终只有一个，不同时出现多个同级主 CTA
- 次级操作用文本按钮或描边按钮，不与主按钮抢视觉层级
- 列表页支持显式启用/停用切换，但删除操作需要确认
- 空状态必须给用户下一步，而不是只告诉“这里还没有内容”

---

## Empty / Error / Destructive States

### Empty States

- 物品页空状态：强调“先把常用消耗品放进来”，而不是“暂无数据”
- 设置页不做空状态，始终展示家庭信息和账号区块

### Error States

- 表单校验错误贴近字段显示，不用页面顶部统一报错大块
- 登录失败信息必须直接说明原因和动作，例如密码错误或账号不存在

### Destructive Behavior

- 停用物品文案使用“停用追踪”，不用“删除”
- 真删除时必须二次确认，并提示“历史记录可能受影响”

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | 保存并继续 / 保存物品 / 登录并开始 |
| Empty state heading | 先把家里常买的加进来 |
| Empty state body | 先添加 1 到 3 个常用消耗品，后面才能继续做库存和补货判断。 |
| Error state | 这次没保存成功，请检查填写内容后重试。 |
| Destructive confirmation | 停用追踪：停用后这个物品不会再出现在当前追踪列表里。 |

### Copy Style

- 文案必须像生活产品，不像后台系统
- 优先用“你家”“常买”“先添加”这类口语化表达
- 避免“配置”“实体”“实例化”这类工程词

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | button, input, label, form, card, badge, select, tabs, sheet, textarea, separator | not required |

---

## Phase 1 Page Inventory

### Must Exist

- 登录页
- 家庭建档页
- 物品列表页
- 添加 / 编辑物品页
- 设置页

### Must Not Exist In This Phase

- 首页 / Dashboard
- 优惠页
- 记录页
- 库存预测可视化页
- 补货建议结果页

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-04-14
