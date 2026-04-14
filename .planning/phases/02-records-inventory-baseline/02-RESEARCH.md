# Phase 2 Research: Records & Inventory Baseline

**Phase:** 02  
**Date:** 2026-04-14  
**Status:** Complete

## 结论

Phase 2 最稳的实现方式，不是直接在现有 `household_items` 上硬塞库存字段，而是把“主数据”“购买记录”“库存快照”分成三层：

1. `household_items` 继续只保存追踪物品本身的配置
2. `purchase_records` 专门保存手动录入和文本粘贴解析后的购买事实
3. `inventory_states` 专门保存由记录推导出的库存估算结果

这样做的好处是：

- 记录和估算是分开的，后面 Phase 5 做反馈校正时不用返工主模型
- Phase 2 就能把“新增记录后立即刷新库存”做成明确链路
- Web 端可以围绕物品详情页同时展示“这件物品本身”“最近买过什么”“现在估算还剩多少”

Phase 2 仍然要坚持 KISS：

- 文本解析只做单条候选记录，不做复杂订单拆分
- 没有购买记录时不强行估算；有 1 条记录时才给“估算中”的粗略结果
- 不新增 `记录` 一级导航，继续围绕 `物品` 做主工作区

## 1. 数据模型建议

### 1.1 PurchaseRecord 应独立建表

现有 [household_item.py](E:/HomeStockAI/apps/api/app/models/household_item.py) 只适合保存物品配置，不适合混入多次购买历史。Phase 2 建议新增 `purchase_records` 表：

- `id`
- `household_item_id`
- `platform`
- `sku_title`
- `quantity`
- `total_price`
- `unit_price`
- `purchased_at`
- `source`
- `raw_text`
- `created_at`

实现建议：

- `quantity`、`total_price`、`unit_price` 用 `Numeric(10, 2)`，避免价格和数量精度乱掉
- `source` 先固定 `manual | paste`
- `raw_text` 只在 `source=paste` 时保存，用于后续调试文本解析

### 1.2 InventoryState 应独立建表

库存估算不是用户输入，而是系统推导结果，所以不建议塞回 `household_items`。建议新增 `inventory_states` 表：

- `id`
- `household_item_id`，并做唯一约束
- `estimated_remaining_qty`
- `estimated_remaining_days`
- `daily_consumption_rate`
- `confidence_score`
- `below_safety_stock`
- `calc_reason`
- `last_recalc_at`

这样后续：

- Phase 3 可以直接把价格快照和库存快照组合
- Phase 4 可以直接根据库存快照生成建议
- Phase 5 可以在反馈后重算并覆写同一条状态记录

### 1.3 不建议把库存字段直接加回 item 主表

原因很直接：

- `household_items` 是配置层，`inventory_states` 是衍生状态层
- 购买记录保存、反馈修正、定时重算都可能改库存状态，但不应该改物品配置
- Phase 2 之后如果要做“最近购买时间”“最近价格时间”，都更适合在状态/快照层演进

## 2. API 边界建议

当前 API 已经有 [items.py](E:/HomeStockAI/apps/api/app/api/routes/items.py) 和 session 保护依赖 [deps.py](E:/HomeStockAI/apps/api/app/api/deps.py)。Phase 2 建议继续沿用“当前账户 -> 当前家庭 -> 当前物品”的边界，不新增独立账户参数。

### 2.1 购买记录接口

建议新增：

- `POST /purchase-records`
- `GET /purchase-records?item_id=...`
- `POST /purchase-records/parse-text`

设计理由：

- `POST /purchase-records` 负责真保存
- `GET /purchase-records?item_id=` 负责物品详情页历史列表
- `POST /purchase-records/parse-text` 只负责“解析成候选记录”，不直接落库

### 2.2 库存状态接口

建议新增：

- `GET /items/{id}/inventory-state`
- `POST /items/{id}/recalculate`

设计理由：

- 详情页需要直接拉当前库存状态
- 保存购买记录后可以复用同一个重算入口
- 后面 Phase 5 的反馈校正也能走同一套重算链路

### 2.3 列表页状态不要靠前端自己拼

当前 [items/page.tsx](E:/HomeStockAI/apps/web/src/app/items/page.tsx) 只拿基础 item 列表。Phase 2 如果让前端为每个物品再单独拉一次库存状态，会让页面变重，也会让 server fetch 很啰嗦。

更稳的方式是：

- `GET /items` 在 Phase 2 扩展出轻量库存字段
- 只返回列表需要的最小值：
  - `estimated_remaining_days`
  - `inventory_status`
  - `last_purchased_at`

不要把完整 `daily_consumption_rate`、`confidence_score` 全部塞进列表响应。

## 3. 文本粘贴解析建议

### 3.1 先走规则解析，不上 LLM

Phase 2 的目标是“够用”，不是“聪明”。最简单稳定的方案是一个小型规则解析器：

- 平台关键词：`京东`、`淘宝`、`天猫`、`拼多多`、`抖音`
- 价格匹配：`¥59`、`￥59`、`实付59`、`到手59`
- 数量匹配：`2件`、`2瓶`、`x2`、`*2`
- 商品标题：优先取最长的非金额、非平台文本片段

### 3.2 解析结果只产出单条候选记录

这是已经锁定的产品决策，理由也很充分：

- 当前入口来自某个物品详情页，核心是减少手填
- 一次返回多条候选会让页面复杂度暴涨
- MVP 先把“能少填几个字段”做好，比“能拆复杂订单”更重要

### 3.3 item_id 仍然应该由当前页面决定

即使文本里解析出了商品名，也不建议用它重新绑定物品。Phase 2 的添加记录页是从某个物品详情进去的，所以：

- `item_id` 由路由上下文固定
- 解析出的商品名只用来帮助回填 `sku_title`
- 避免文本误判把记录记到错误物品上

## 4. 库存估算 baseline 建议

### 4.1 有 2 到 5 条记录时的估算

建议算法：

1. 按 `purchased_at` 升序取最近 2 到 5 条有效记录
2. 对每一对相邻记录计算区间天数 `days_between`
3. 用“前一条记录的数量 / 区间天数”得到该区间的日均消耗
4. 对最近区间给更高权重，做加权平均
5. 取最近一条记录作为当前库存起点，扣掉距今已消耗量

具体可执行公式：

- `interval_rate = previous.quantity / max(days_between, 1)`
- `daily_consumption_rate = weighted_average(interval_rates)`
- `estimated_remaining_qty = max(last_record.quantity - daily_consumption_rate * days_since_last_purchase, 0)`
- `estimated_remaining_days = floor(estimated_remaining_qty / daily_consumption_rate)`

### 4.2 只有 1 条记录时的 fallback

只有 1 条记录时，不能靠记录间隔估算，只能退化成：

- `daily_consumption_rate = last_record.quantity / adjusted_cycle_days`

其中 `adjusted_cycle_days` 来自：

- 品类默认周期
- 家庭人数
- 是否有宠物 / 婴幼儿

建议单独建一个 `inventory_defaults.py`，按品类提供默认周期，例如：

- 纸巾类：`21`
- 洗护类：`30`
- 宠物食品：`20`
- 猫砂：`18`
- 尿不湿：`14`
- 湿巾：`20`

家庭画像修正只做很轻量的倍率，不做复杂模型：

- `household_size >= 4`：`1.3`
- `household_size == 3`：`1.15`
- 婴儿用品且 `has_baby=true`：额外 `1.25`
- 宠物用品且 `has_pet=true`：额外 `1.2`

### 4.3 没有任何购买记录时不应伪造估算

这点很重要。虽然决策里要求“记录不足也先给粗略估算”，但 UI-SPEC 已经明确：

- 没有第一条购买记录时，详情页应展示“先记下第一次购买”
- 粗略估算的前提是至少有 1 条记录

所以：

- `0 条记录` -> 不返回可用库存估算，显示 empty state
- `1 条记录` -> 返回 `估算中`
- `2 条及以上` -> 返回正式 baseline 估算

## 5. 置信度和低于安全库存判断

### 5.1 置信度先做离散分层，不做复杂评分

Phase 2 没必要引入复杂统计指标，先把展示口径稳定住：

- `0.35`：只有 1 条记录，靠 fallback
- `0.60`：有 2 条记录，可形成 1 个区间
- `0.80`：有 3 条及以上记录，估算相对稳定

Web 展示时再映射成：

- `估算中`
- `参考性一般`
- `相对稳定`

### 5.2 below_safety_stock 应写进库存状态

安全库存阈值已经在 `household_items.safety_stock_days` 里存在，所以在重算时直接得到：

- `below_safety_stock = estimated_remaining_days < item.safety_stock_days`

不要把这个判断留给前端自己算。否则列表页、详情页、提醒系统后面容易口径不一致。

## 6. Web 集成建议

### 6.1 详情页应该替代当前编辑页成为主入口

当前 [items/[id]/edit/page.tsx](E:/HomeStockAI/apps/web/src/app/items/[id]/edit/page.tsx) 还是“编辑物品”页。Phase 2 更合理的演进是：

- 新增 `/items/[id]` 作为详情页
- 详情页承接库存状态、购买记录和添加记录入口
- `/items/[id]/edit` 退成次级入口

这样符合已经锁定的产品判断链：

- 先看这件物品现在怎么样
- 再决定是否补录购买记录或编辑配置

### 6.2 添加购买记录页单独走路由

建议新增：

- `/items/[id]/records/new`

原因：

- 手动录入是一个完整任务，需要 client form
- 文本粘贴解析也在这个页里发生
- 保存后回跳详情页最自然

### 6.3 列表页只做轻量状态

列表页建议只加：

- 一行库存状态
- 最近购买时间的短信息

不要在卡片里堆：

- 日均消耗
- 置信度细节
- 文本解释

这些都留给详情页。

## 7. 这阶段最容易踩的坑

### 坑 1：把 purchase record 和 inventory state 混成一张表

后果：

- 记录历史不好追
- 每次重算都像“改主数据”
- 后面反馈校正会很难接

应对：坚持“事实表”和“快照表”分开。

### 坑 2：让 parse-text 直接落库

后果：

- 错误解析不可见
- 用户更难信任系统

应对：只返回候选值，用户确认后再保存。

### 坑 3：让列表页自己并发拉一堆 inventory-state

后果：

- server component 里请求爆炸
- 性能和代码复杂度都变差

应对：列表接口只补最小库存摘要。

### 坑 4：没有记录也硬给库存结果

后果：

- 用户会觉得系统在瞎猜

应对：0 条记录就诚实展示空状态，1 条记录再进入“估算中”。

## 8. 对 planning 的直接建议

Phase 2 按 roadmap 的 3 个 plan 顺序拆最稳：

- `02-01`：购买记录模型、迁移、录入 API、文本解析入口、记录历史查询
- `02-02`：库存状态模型、估算服务、置信度、低于安全库存判断、保存记录后重算
- `02-03`：物品详情页、添加购买记录页、列表页轻量库存状态

依赖关系建议：

- `02-02` 依赖 `02-01`
- `02-03` 依赖 `02-01` 和 `02-02`

不要并行做。因为：

- 详情页和列表页依赖 inventory API 形状
- 保存记录后的回流依赖重算链路
- 这阶段最大价值就是闭环，不是吞吐量

## 一句话总结

Phase 2 的关键，不是“做更多页面”，而是建立一条可信的闭环：记下一次购买 -> 立刻重算库存 -> 在详情页和列表里用诚实的方式显示结果。
