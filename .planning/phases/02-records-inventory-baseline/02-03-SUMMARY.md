---
phase: 02-records-inventory-baseline
plan: "03"
completed: 2026-04-15
focus: web-records-inventory-flow
requirements_completed: [RECD-01, RECD-02, RECD-03, INVT-02, INVT-03, INVT-04]
---

# Phase 02 Plan 03 Summary

## 完成内容
- 新增物品详情页，承接库存状态、购买记录历史和添加记录入口
- 新增添加购买记录页，支持手动录入和文本粘贴解析辅助
- 列表页改为进入详情页，并显示轻量库存状态和最近购买时间
- 保留编辑页作为次级入口，不再承担主查看路径
- 增加前后端数据 normalizer，统一 snake_case API 和 camelCase Web 类型

## 关键结果
- 用户已经可以走通 `列表 -> 详情 -> 添加记录 -> 返回详情` 的主链路
- 列表页只展示轻量库存状态，没有把复杂估算细节堆到卡片里
- 添加记录成功后会回到详情页并刷新库存结果

## 主要文件
- `apps/web/src/app/items/[id]/page.tsx`
- `apps/web/src/app/items/[id]/records/new/page.tsx`
- `apps/web/src/components/items/purchase-record-form.tsx`
- `apps/web/src/components/items/purchase-record-list.tsx`
- `apps/web/src/components/items/inventory-status-card.tsx`

## 验证
- `npm run build:web` 通过

## 一句话
Phase 2 的前端闭环已经可用了，用户终于能看见记录和库存估算的价值。
