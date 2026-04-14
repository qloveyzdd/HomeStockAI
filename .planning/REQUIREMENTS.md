# Requirements: 家补 AI（RefillWise）

**Defined:** 2026-04-14
**Core Value:** 在尽量少输入的前提下，持续给出可信、可解释、真正有用的家庭补货结论

## v1 Requirements

### Household Setup

- [x] **HOME-01**: 用户可以创建家庭档案，填写家庭人数、宠物/婴幼儿情况、储物空间等级、价格敏感度、囤货偏好、常购平台和提醒容忍度
- [x] **HOME-02**: 用户可以在设置页修改家庭档案，更新后的信息会参与后续库存估算和提醒策略

### Item Management

- [x] **ITEM-01**: 用户可以从受支持的高频消耗品类中添加追踪物品
- [x] **ITEM-02**: 用户可以为追踪物品设置品牌、常用规格、单位、安全库存天数、首选平台和是否接受平替
- [x] **ITEM-03**: 用户可以停用或重新启用某个追踪物品，且不会丢失该物品的历史记录
- [ ] **ITEM-04**: 用户可以在物品列表中查看每个追踪物品的预计剩余天数、当前建议、最近购买时间和价格状态

### Purchase Records

- [x] **RECD-01**: 用户可以手动添加购买记录，至少包含物品、数量、平台、总价和购买日期
- [x] **RECD-02**: 用户可以粘贴订单文本，由系统解析出结构化购买记录并在保存前确认
- [x] **RECD-03**: 用户可以在物品详情页查看该物品的购买记录历史
- [ ] **RECD-04**: 新的购买记录保存后，系统会自动刷新库存状态和购买建议

### Inventory Estimation

- [x] **INVT-01**: 系统可以基于最近 2 到 5 条有效购买记录和家庭档案，估算物品的日均消耗速度
- [x] **INVT-02**: 系统可以为每个追踪物品计算预计剩余数量和预计剩余天数
- [x] **INVT-03**: 当估算依据不足时，系统可以显示置信度，并以“估算中”弱化展示结果
- [x] **INVT-04**: 系统可以基于品类默认值和物品配置，判断某物品是否低于安全库存天数

### Price Tracking

- [ ] **PRIC-01**: 系统可以从至少一个稳定的中国大陆价格来源抓取追踪物品的价格快照
- [ ] **PRIC-02**: 系统可以保存当前价、到手价、单位价格、平台、抓取时间和优惠信息
- [ ] **PRIC-03**: 系统可以为追踪物品计算近 7 天最低价、近 30 天均价和是否接近低价
- [ ] **PRIC-04**: 系统只展示与当前追踪物品相关的价格信息，而不是全量优惠流

### Recommendation Engine

- [ ] **RECO-01**: 系统可以为每个追踪物品生成 `buy_now`、`restock_soon`、`watch`、`wait`、`do_not_buy` 五种建议之一
- [ ] **RECO-02**: 系统可以综合缺货风险、价格机会、囤货偏好和重复购买风险计算建议结果
- [ ] **RECO-03**: 当建议为购买类动作时，系统可以给出推荐购买数量
- [ ] **RECO-04**: 系统可以为每条建议生成可读的原因说明，解释为什么现在买、继续观察或暂时别买

### Feedback Correction

- [ ] **FDBK-01**: 用户可以对物品执行“我刚买了”，系统会据此更新库存状态和建议
- [ ] **FDBK-02**: 用户可以对物品执行“家里还有”，系统会增加估算余量并降低短期提醒频率
- [ ] **FDBK-03**: 用户可以对物品执行“用得更快”或“用得更慢”，系统会修正消耗速度估算
- [ ] **FDBK-04**: 用户可以对物品执行“不再提醒”，系统会停止该物品的提醒和主动建议触达

### Dashboard & Detail

- [ ] **DASH-01**: 首页可以展示当前追踪物品数量、快见底数量、值得买数量和本周预估节省金额
- [ ] **DASH-02**: 首页可以稳定展示“快见底”“现在值得买”“先别买”三个核心决策模块
- [ ] **DASH-03**: 物品详情页可以展示预计剩余天数、安全库存、消耗趋势、最近购买记录和价格比较信息
- [ ] **DASH-04**: 物品详情页可以展示 AI 建议解释，并提供快捷反馈入口

### Notification Rules

- [ ] **NOTI-01**: 系统只会在高置信度且低于安全库存时发出快缺货提醒
- [ ] **NOTI-02**: 系统只会在价格有明显机会且该物品存在补货语境时发出值得买提醒
- [ ] **NOTI-03**: 系统会执行提醒去重规则，包括同一物品 3 天内最多提醒 1 次，以及对“稍后提醒/不再提醒”的抑制策略

## v2 Requirements

### Input Enhancements

- **INPT-01**: 用户可以上传订单截图，由系统 OCR 解析出结构化购买记录
- **INPT-02**: 用户可以导入电商平台历史订单，减少手工录入成本

### Pricing & Shopping

- **SHOP-01**: 用户可以查看更完整的价格趋势图和历史波动说明
- **SHOP-02**: 系统可以提供平替商品建议，并说明替代理由
- **SHOP-03**: 系统可以支持更多价格来源和跨平台比价

### Collaboration

- **COLL-01**: 一个家庭可以由多个成员共同维护和接收提醒
- **COLL-02**: 系统可以按家庭成员角色区分提醒和操作权限

### Automation

- **AUTO-01**: 系统可以基于用户授权实现自动下单
- **AUTO-02**: 系统可以接入智能硬件或 IoT 数据，减少手动反馈

## Out of Scope

| Feature | Reason |
|---------|--------|
| 生鲜、零食、调味料等高波动品类 | 消耗波动和价格结构复杂，超出首版估算能力 |
| 全屋物品可视化与家庭仓库台账 | 这会把产品带向家庭 ERP，偏离补货决策核心 |
| 全量促销瀑布流和导购聚合 | 产品价值不在“活动多”，而在“是否值得买” |
| 自动下单 | 需要更高信任度与更复杂交易链路，MVP 不做 |
| 多家庭协同 | 先验证单家庭场景是否成立 |
| 智能硬件接入 | 依赖外部设备，不适合作为冷启动前提 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | Phase 1 | Completed |
| HOME-02 | Phase 1 | Completed |
| ITEM-01 | Phase 1 | Completed |
| ITEM-02 | Phase 1 | Completed |
| ITEM-03 | Phase 1 | Completed |
| RECD-01 | Phase 2 | Completed |
| RECD-02 | Phase 2 | Completed |
| RECD-03 | Phase 2 | Completed |
| RECD-04 | Phase 4 | Pending |
| INVT-01 | Phase 2 | Completed |
| INVT-02 | Phase 2 | Completed |
| INVT-03 | Phase 2 | Completed |
| INVT-04 | Phase 2 | Completed |
| PRIC-01 | Phase 3 | Pending |
| PRIC-02 | Phase 3 | Pending |
| PRIC-03 | Phase 3 | Pending |
| PRIC-04 | Phase 3 | Pending |
| ITEM-04 | Phase 4 | Pending |
| RECO-01 | Phase 4 | Pending |
| RECO-02 | Phase 4 | Pending |
| RECO-03 | Phase 4 | Pending |
| RECO-04 | Phase 4 | Pending |
| DASH-01 | Phase 4 | Pending |
| DASH-02 | Phase 4 | Pending |
| DASH-03 | Phase 4 | Pending |
| DASH-04 | Phase 4 | Pending |
| FDBK-01 | Phase 5 | Pending |
| FDBK-02 | Phase 5 | Pending |
| FDBK-03 | Phase 5 | Pending |
| FDBK-04 | Phase 5 | Pending |
| NOTI-01 | Phase 5 | Pending |
| NOTI-02 | Phase 5 | Pending |
| NOTI-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0

---
*Requirements defined: 2026-04-14*
*Last updated: 2026-04-15 after Phase 2 completion*
