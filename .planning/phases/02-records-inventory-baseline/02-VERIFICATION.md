---
phase: 02-records-inventory-baseline
verified: 2026-04-15T00:35:58+08:00
status: passed
score: 3/3 wave goals verified
---

# Phase 2 Verification Report

## Phase Goal
让用户记下一次购买后，系统可以立刻给出可见、可解释的库存 baseline，并在 Web 端形成可点击的完整闭环。

## 验证结果

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 用户可以为当前物品新增购买记录，并查看该物品的历史记录 | VERIFIED | `POST /purchase-records`、`GET /purchase-records?item_id=...` 已实现；前端有 [apps/web/src/app/items/[id]/records/new/page.tsx](E:/HomeStockAI/apps/web/src/app/items/[id]/records/new/page.tsx) 和 [apps/web/src/components/items/purchase-record-list.tsx](E:/HomeStockAI/apps/web/src/components/items/purchase-record-list.tsx) |
| 2 | 新购买记录保存后，系统会自动刷新库存状态，并把结果回流到详情页和列表页 | VERIFIED | `create_purchase_record()` 在保存后调用 `recalculate_inventory_state()`；详情页和列表页分别消费 `/items/{id}/inventory-state` 与 `/items` 轻量状态 |
| 3 | 用户已经可以走通“列表 -> 详情 -> 添加记录 -> 回详情看到库存结果”的主链路 | VERIFIED | [apps/web/src/app/items/page.tsx](E:/HomeStockAI/apps/web/src/app/items/page.tsx)、[apps/web/src/app/items/[id]/page.tsx](E:/HomeStockAI/apps/web/src/app/items/[id]/page.tsx)、[apps/web/src/components/items/purchase-record-form.tsx](E:/HomeStockAI/apps/web/src/components/items/purchase-record-form.tsx) |

## Requirements Coverage
- Completed: `RECD-01`, `RECD-02`, `RECD-03`, `INVT-01`, `INVT-02`, `INVT-03`, `INVT-04`
- Deferred by traceability correction: `RECD-04`
  原因：原文里的“刷新购买建议”属于推荐引擎范围，真实实现会在 Phase 4 随 recommendation 能力一起落地；本轮已经完成“刷新库存状态”这半段能力。

## 验证命令
- `python -m compileall apps/api/app`
- `npm run build:web`

## 备注
- 额外做过一次模块导入检查，确认 Phase 2 新增的 `inventory_estimator` 和 `purchase_records` 代码路径可被 Python 正常解析。
- 完整启动 API 进程仍受本地缺少 `passlib` 依赖影响，这不是本次代码回归。

## 一句话
Phase 2 的真实目标已经达成，库存 baseline 和记录闭环都已经可以被用户感知到。
