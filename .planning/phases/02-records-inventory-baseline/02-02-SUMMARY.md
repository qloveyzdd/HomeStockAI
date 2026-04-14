---
phase: 02-records-inventory-baseline
plan: "02"
completed: 2026-04-15
focus: inventory-baseline
requirements_completed: [INVT-01, INVT-02, INVT-03, INVT-04]
---

# Phase 02 Plan 02 Summary

## 完成内容
- 新增 `inventory_states` 快照表和 `0003_phase2_inventory_states` 迁移
- 新增品类默认周期与家庭画像轻量修正逻辑
- 新增库存估算服务，支持多记录加权估算和单记录 fallback
- 保存购买记录后自动重算库存状态
- 扩展 `/items` 列表响应和库存状态接口

## 关键结果
- 0 条记录时诚实返回空状态，不伪造库存结果
- 1 条记录时显示“估算中”，2 条以上进入正式 baseline 估算
- 列表页和详情页共用同一套库存口径：`estimated / estimating / low_stock / no_records`

## 主要文件
- `apps/api/app/models/inventory_state.py`
- `apps/api/app/services/inventory_estimator.py`
- `apps/api/app/domain/inventory_defaults.py`
- `apps/api/app/api/routes/items.py`
- `packages/shared-types/src/inventory.ts`

## 一句话
“新增一条购买记录 -> 立刻得到库存状态” 这条后端闭环已经打通了。
