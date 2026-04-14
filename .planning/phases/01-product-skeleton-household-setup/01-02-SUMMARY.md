---
phase: 01-product-skeleton-household-setup
plan: "02"
subsystem: api
tags: [fastapi, sqlalchemy, alembic, session, household, items]
requires:
  - phase: 01-01
    provides: web/api/worker 骨架与 session 基础入口
provides:
  - 测试账号登录、退出和会话查询接口
  - household / item 数据模型与初始迁移
  - 预设品类目录、自定义物品支持和启停接口
affects: [phase-01-03, auth, household, items]
tech-stack:
  added: [passlib, sqlalchemy-orm, alembic-migration]
  patterns: [single-household-per-account, session-guarded-api, preset-item-catalog]
key-files:
  created:
    - apps/api/alembic/versions/0001_phase1_schema.py
    - apps/api/app/api/routes/auth.py
    - apps/api/app/api/routes/household.py
    - apps/api/app/api/routes/items.py
    - apps/api/scripts/seed_phase1.py
  modified:
    - apps/api/app/core/database.py
    - apps/api/app/main.py
key-decisions:
  - "家庭档案继续保留 preferred_platforms 和 reminder_tolerance 字段，但在 Phase 1 只作为可选配置暴露。"
  - "物品的预设品类和默认单位/安全库存天数统一放在 item_catalog，避免后续前后端各自维护。"
patterns-established:
  - "所有 household / item 接口都必须先通过 session 找到当前 account，再反查 household。"
  - "预设品类和自定义物品走同一套 item schema，只在校验和默认值注入上分流。"
requirements-completed: [HOME-01, HOME-02, ITEM-01, ITEM-02, ITEM-03]
duration: 4 min
completed: 2026-04-14
---

# Phase 01 Plan 02 Summary

**单账号家庭档案、测试账号登录态和追踪物品 CRUD API 已经连成闭环**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-14T21:58:44+08:00
- **Completed:** 2026-04-14T22:02:43+08:00
- **Tasks:** 3
- **Files modified:** 21

## Accomplishments
- 建立了 `accounts / households / household_items` 三张主表和 Alembic 初始迁移
- 实现了 `POST /auth/login`、`POST /auth/logout`、`GET /auth/me` 与 `GET/POST/PATCH /household`
- 实现了预设品类目录、物品 CRUD 以及启用/停用接口，并支持自定义物品

## Task Commits

Each task was committed atomically:

1. **Task 1: 建立账户、家庭、物品模型与初始迁移** - `683d595` (feat)
2. **Task 2: 实现测试账号登录、退出、会话查询与家庭档案接口** - `683d595` (feat)
3. **Task 3: 实现预设品类目录与物品 CRUD / 启停接口** - `683d595` (feat)

**Plan metadata:** pending

## Files Created/Modified
- `apps/api/alembic/versions/0001_phase1_schema.py` - Phase 1 初始数据库结构
- `apps/api/app/models/account.py` - 账号模型
- `apps/api/app/models/household.py` - 家庭档案模型
- `apps/api/app/models/household_item.py` - 追踪物品模型
- `apps/api/app/api/routes/auth.py` - 登录、登出和会话接口
- `apps/api/app/api/routes/household.py` - 建档和设置编辑接口
- `apps/api/app/api/routes/items.py` - 物品列表、创建、编辑、启停接口
- `apps/api/scripts/seed_phase1.py` - 测试账号 seed 脚本

## Decisions Made
- 家庭档案接口使用 `GET /household/me` 而不是 household 列表，保持单账号单家庭边界简单清晰。
- 非自定义物品如果未传 `name / unit / safety_stock_days`，由后端根据预设目录自动补齐默认值。

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- 无阻塞问题；这一轮主要通过 `python -m compileall apps/api` 做语法级验证，未连接真实 PostgreSQL 运行迁移。

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- 前端已经可以直接对接 `/api/auth/*`、`/api/household/*` 和 `/api/items/*`。
- 还需要在最后统一验证一次数据库迁移和 seed 脚本的真实执行效果。

---
*Phase: 01-product-skeleton-household-setup*
*Completed: 2026-04-14*
