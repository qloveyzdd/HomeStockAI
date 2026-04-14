# Phase 1 Research: Product Skeleton & Household Setup

**Phase:** 01  
**Date:** 2026-04-14  
**Status:** Complete

## 结论

Phase 1 最稳的落地方式不是一开始就铺太多基建，而是把下面三件事按顺序做实：

1. 搭起 `apps/web`、`apps/api`、`apps/worker` 的最小工程骨架和本地开发环境
2. 先在后端建立 `Account / Household / HouseholdItem` 这条最小数据链
3. 再把登录、建档、物品管理界面按 `01-UI-SPEC.md` 接到这条链路上

这个阶段不应该碰购买记录、库存估算、抓价、推荐，也不应该把“未来手机号验证码登录”提前做复杂。

## 1. 仓库与应用结构建议

### 推荐目录

```txt
apps/
  web/
  api/
  worker/
packages/
  shared-types/
.planning/
```

### 原因

- `web`、`api`、`worker` 物理拆开，符合已经锁定的前后端拆分方向
- 仍然保持单仓，避免 MVP 阶段的多仓协调成本
- `shared-types` 只放少量跨端协议类型，不要在 Phase 1 就做大而全公共库

### 本阶段不建议做

- 不做微服务目录再细拆
- 不做前后端多环境复杂编排
- 不做 monorepo 工具链花活，保持能跑即可

## 2. Phase 1 的简化登录怎么做最稳

### 推荐方案

- 后端建一个简单 `accounts` 表
- 账号字段最少包括：`id`、`phone`、`password_hash`、`created_at`、`updated_at`
- 通过 seed 或 SQL 初始化一个或多个测试账号
- 前端登录页只收 `phone` 和 `password`
- 登录成功后，后端签发 session cookie
- 用 cookie + 后端 session/me 接口保护后续页面

### 为什么不用 token-first 复杂方案

- 当前阶段只需要支持单端、单主账号、测试账号
- cookie session 更直接，减少前端显式存 token 的噪音
- 到未来切手机号验证码登录时，可以替换认证入口，但保留“登录成功得到 session”这条后续链路

### 本阶段需要明确的接口

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### 本阶段不要做

- 注册流程
- 忘记密码
- 短信服务接入
- 第三方登录

## 3. Household / Item 数据边界

### Household

Phase 1 只需要支撑建档和编辑：

- `id`
- `owner_account_id`
- `household_size`
- `has_pet`
- `pet_type`
- `has_baby`
- `storage_level`
- `price_sensitivity`
- `stock_style`
- `created_at`
- `updated_at`

`preferred_platforms` 和 `reminder_tolerance` 已经在 context 里被明确延后，不要强塞进 Phase 1 表单主流程。

### HouseholdItem

Phase 1 重点是“追踪物品能被创建、编辑、启用、停用”，所以建议先包含：

- `id`
- `household_id`
- `name`
- `category`
- `brand`
- `spec_text`
- `unit`
- `enabled`
- `is_custom`
- `created_at`
- `updated_at`

先不要把未来库存估算字段、价格字段混进主表。那些属于 Phase 2/3 的状态层。

## 4. API 边界建议

### Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Household

- `GET /household/me`
- `POST /household`
- `PATCH /household/{id}`

MVP 下一个账号只对应一个 household，所以 `GET /household/me` 比 `GET /households` 更贴近产品实际。

### Items

- `GET /items`
- `POST /items`
- `GET /items/{id}`
- `PATCH /items/{id}`
- `POST /items/{id}/disable`
- `POST /items/{id}/enable`

### 为什么不做更多

- 不做复杂搜索、分页、排序接口
- 不做批量接口
- 不做“全量分类字典服务”，预设品类先用后端配置/种子数据提供即可

## 5. UI 实现上的关键含义

基于 `01-UI-SPEC.md`，Phase 1 前端要守住这些约束：

- 没有首页，登录后就是建档或物品页
- Shell 里只有 `物品 / 设置`
- 建档是单页表单，不是向导
- 物品添加主路径是“预设品类 -> 品牌/规格”
- 自定义物品是次级入口，不应该压过主路径
- 所有主动作都应该是单 CTA，不堆多个大按钮

这意味着前端路由不需要很多：

- `/login`
- `/setup`
- `/items`
- `/items/new`
- `/items/[id]` 或 `/items/[id]/edit`
- `/settings`

## 6. 推荐的构建顺序

### Step 1

先把工程和运行环境立住：

- monorepo 目录
- 前后端基础启动
- 数据库连接
- migration 流程
- session 基础能力

### Step 2

建立 Household / HouseholdItem 领域：

- 数据模型
- schema
- CRUD API
- seed data

### Step 3

再接页面：

- 登录页
- 建档页
- 物品列表页
- 物品创建/编辑页
- 设置页

## 7. 本阶段最容易踩的坑

### 坑 1：为了未来验证码登录，把当前登录做太复杂

应对：Phase 1 只做 phone+password test account，session 机制保持简单。

### 坑 2：把 Phase 2/3 的字段提前塞进 item 主模型

应对：Phase 1 的 item 只服务管理，不承担库存或价格状态。

### 坑 3：把物品页做成未来 dashboard 占位

应对：Phase 1 的默认落点页就是“追踪物品管理页”，不要塞推荐卡片和预测模块。

### 坑 4：建档页信息过多

应对：严格只收 context 已锁定的关键字段，其他延后。

## 8. 对 planning 的直接建议

- Plan 01：工程骨架、运行环境、鉴权基础
- Plan 02：Household / Item 数据模型与 API
- Plan 03：按 UI-SPEC 完成登录、建档、物品、设置页面

其中：

- Plan 02 依赖 Plan 01 的后端骨架和数据库能力
- Plan 03 依赖 Plan 01 的 web 骨架和 Plan 02 的 API/模型
- 所以这三个 plan 应该顺序执行，不适合并行

## 一句话总结

Phase 1 的核心不是“做出很多页面”，而是建立一个以后能继续长的最小产品主干：登录、家庭、物品、应用壳。 
