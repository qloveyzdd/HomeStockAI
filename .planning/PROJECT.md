# 家补 AI（RefillWise）

## What This Is

家补 AI 是一个面向中国大陆家庭场景的移动优先网页产品，用来追踪高频消耗品的库存状态、价格机会和补货风险，并给出可执行的购买建议。它不是家庭库存台账，而是一个低输入、可解释的家庭补货决策助手，后续可迁移到小程序或 App。

## Core Value

在尽量少输入的前提下，持续给出可信、可解释、真正有用的家庭补货结论，优先解决“快没了忘记买、看到优惠不知道该不该囤、库存还够却重复购买”这三个问题。

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] 用户可以建立家庭档案，为消耗速度、安全库存和提醒策略提供初始参数
- [ ] 用户可以添加并管理家庭高频消耗品，只追踪主动启用的物品
- [ ] 用户可以录入购买记录，MVP 先支持手动录入和订单文本粘贴解析
- [ ] 系统可以根据购买记录和家庭画像估算库存余量、剩余天数和置信度
- [ ] 系统可以持续跟踪价格并结合库存状态判断当前是否值得买
- [ ] 系统可以输出“现在买、尽快补货、继续观察、先等等、暂时别买”等建议
- [ ] 用户可以通过“我刚买了、家里还有、用得更快、用得更慢、不再提醒”等反馈修正系统判断
- [ ] 首页可以稳定展示“快见底、现在值得买、先别买”三类决策结果

### Out of Scope

- 自动下单 - MVP 先验证决策是否有用，不做交易闭环
- 生鲜、零食、调味料等高波动或低标准化品类 - 会显著增加估算复杂度，偏离首版目标
- 多家庭协同与多成员共享 - 首版先验证单家庭闭环
- 智能硬件接入 - MVP 不依赖额外设备
- 全屋物品可视化管理 - 产品定位是补货决策，不是家庭 ERP
- 复杂会员体系、社交功能、导购聚合 - 与核心价值弱相关，容易分散注意力

## Context

用户已经明确了完整的 MVP 产品方向：围绕高频、标准化、可持续复购的家庭消耗品，建立“库存状态 + 消耗预测 + 价格机会 + 用户偏好”的决策链路。目标用户优先覆盖双职工家庭、养宠家庭、有娃家庭和精打细算型用户。

MVP 首批支持 6 到 10 个高频品类，重点验证三个能力：系统能否推断何时用完、能否基于价格给出购买建议、用户是否愿意根据建议做反馈。价格语境以中国大陆市场为主，价格追踪优先考虑“什么值得买”等可落地数据来源，但实现上需要保留后续扩展抓价源的空间。

项目技术上确认采用前后端拆分：前端承担移动优先产品体验和可解释展示，后端承担记录处理、库存估算、价格追踪与推荐决策。虽然服务职责会分层，但 MVP 阶段仍然以简单、易维护、可快速验证闭环为第一原则。

## Constraints

- **市场**: 先面向中国大陆用户 - 价格平台、文案语境和购物行为都以大陆家庭为准
- **产品范围**: 只做高频标准化消耗品 - 避免被泛生活管理拖散
- **核心优先级**: 优先验证库存估算是否有用 - 这是补货决策可信度的基础
- **产品形态**: 移动优先网页 - 需要兼顾后续迁移到小程序或 App 的可能性
- **技术栈**: 前端 `Next.js`，后端 `FastAPI`，数据库 `PostgreSQL` - 前后端拆开，但保持实现简单
- **实现原则**: KISS，先跑通闭环 - 不为远期场景做过度设计
- **价格数据**: 抓价来源受平台可用性限制 - MVP 需要限制来源和追踪数量，先验证决策链路

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 产品定位为家庭补货决策助手，而不是库存系统 | 要把输出聚焦在“是否该买”的结论，而不是原始库存表 | Pending |
| MVP 优先验证库存估算是否有用 | 如果库存判断不可信，后续价格建议和提醒都会失去价值 | Pending |
| 首发市场聚焦中国大陆家庭 | 便于统一价格来源、平台语境和提醒策略 | Pending |
| 价格追踪优先考虑“什么值得买”等可落地来源 | 先把价格机会判断做起来，再扩展更多源 | Pending |
| 前后端拆分为 `Next.js` + `FastAPI` | 便于把产品界面与决策逻辑解耦，同时保持后续扩展空间 | Pending |
| MVP 只覆盖 6 到 10 个高频标准化品类 | 控制冷启动复杂度，尽快验证闭环 | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone**:
1. Full review of all sections
2. Core Value check -> still the right priority?
3. Audit Out of Scope -> reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-14 after initialization*
