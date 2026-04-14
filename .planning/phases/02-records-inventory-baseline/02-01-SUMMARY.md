---
phase: 02-records-inventory-baseline
plan: "01"
completed: 2026-04-15
focus: purchase-records
requirements_completed: [RECD-01, RECD-02, RECD-03]
---

# Phase 02 Plan 01 Summary

## 完成内容
- 新增 `purchase_records` 事实表和 `0002_phase2_purchase_records` 迁移
- 新增购买记录 schema、录入接口、按物品查询历史接口
- 新增订单文本规则解析器，只返回单条待确认候选，不直接落库
- 为 Web 端补上购买记录和文本解析 shared types

## 关键结果
- 当前家庭下的物品可以安全新增购买记录，不会跨 household 写入
- 物品详情页需要的历史记录接口已经可用：`GET /purchase-records?item_id=...`
- 粘贴订单文本已经可以识别平台、数量、总价和标题候选

## 主要文件
- `apps/api/app/models/purchase_record.py`
- `apps/api/app/api/routes/purchase_records.py`
- `apps/api/app/domain/order_text_parser.py`
- `packages/shared-types/src/purchase-record.ts`

## 一句话
购买记录的数据层和 API 已经立住了，后面库存估算和前端页面都能直接接上。
