---
phase: 01-product-skeleton-household-setup
plan: "03"
subsystem: web
tags: [nextjs, shadcn, app-router, forms, session, mobile-web]
requires:
  - phase: 01-01
    provides: web 工程骨架与 shared types
  - phase: 01-02
    provides: auth / household / items API
provides:
  - 测试账号登录页与受保护页面守卫
  - 单页家庭建档与设置复用表单
  - 物品列表、添加、编辑、启停与双标签导航壳
affects: [phase-02, login, setup, items, settings, ui]
tech-stack:
  added: [shadcn-style-ui, next-app-router, server-only-fetch]
  patterns: [server-session-guard, shared-form-shell, mobile-first-two-tab-nav]
key-files:
  created:
    - apps/web/src/app/login/page.tsx
    - apps/web/src/app/setup/page.tsx
    - apps/web/src/app/items/page.tsx
    - apps/web/src/app/items/new/page.tsx
    - apps/web/src/app/items/[id]/edit/page.tsx
    - apps/web/src/app/settings/page.tsx
    - apps/web/src/components/app-shell.tsx
    - apps/web/src/components/forms/household-form.tsx
    - apps/web/src/components/items/item-form.tsx
    - apps/web/src/lib/server-api.ts
  modified:
    - apps/web/package.json
    - apps/web/src/app/layout.tsx
    - apps/web/src/app/globals.css
    - apps/web/src/app/page.tsx
    - package.json
    - package-lock.json
key-decisions:
  - "不接真实短信登录，Phase 1 先用数据库预置测试账号的手机号+密码登录跑通流程。"
  - "受保护页面统一通过 server-session 和 server-api 判断登录态，避免 client 侧直接依赖 next/headers。"
  - "字体不依赖 next/font/google 的联网下载，改用本机优先中文字体栈保证构建稳定。"
patterns-established:
  - "登录、建档、物品和设置页面都走移动优先卡片布局，底部导航只保留物品和设置。"
  - "建档与设置复用一套 HouseholdForm，添加与编辑物品复用一套 ItemForm。"
requirements-completed: [HOME-01, HOME-02, ITEM-01, ITEM-02, ITEM-03]
duration: 22 min
completed: 2026-04-14
---

# Phase 01 Plan 03 Summary

**Phase 1 的前端主流程已经跑通：登录、建档、物品管理和设置页都可以直接使用**

## Performance

- **Duration:** 22 min
- **Started:** 2026-04-14T22:02:43+08:00
- **Completed:** 2026-04-14T22:24:09+08:00
- **Tasks:** 3
- **Files modified:** 34

## Accomplishments
- 完成了 `登录 -> 建档 -> 物品管理 -> 设置` 的移动优先 Web 闭环
- 建立了统一的 client/server API 调用层和 server session 守卫
- 按 UI-SPEC 落地了双标签导航、单页建档表单、物品添加编辑表单和空状态文案

## Task Commits

Each task was committed atomically:

1. **Task 1: 落地 Web 设计基础、API client 与登录守卫** - `1c5fac3` (feat)
2. **Task 2: 实现单页建档和设置页复用表单** - `1c5fac3` (feat)
3. **Task 3: 实现物品页、添加/编辑物品页和双标签导航壳** - `1c5fac3` (feat)

**Plan metadata:** code committed in `1c5fac3`

## Files Created/Modified
- `apps/web/src/app/login/page.tsx` - 测试账号登录页
- `apps/web/src/app/setup/page.tsx` - 单页家庭建档页
- `apps/web/src/app/items/page.tsx` - 物品列表页
- `apps/web/src/app/items/new/page.tsx` - 添加物品页
- `apps/web/src/app/items/[id]/edit/page.tsx` - 编辑物品页
- `apps/web/src/app/settings/page.tsx` - 设置页
- `apps/web/src/components/app-shell.tsx` - 只保留物品/设置的底部导航壳
- `apps/web/src/components/forms/household-form.tsx` - 建档/设置复用表单
- `apps/web/src/components/items/item-form.tsx` - 添加/编辑复用表单
- `apps/web/src/lib/api-client.ts` - 浏览器侧 API 客户端
- `apps/web/src/lib/server-api.ts` - 服务端 API 客户端
- `apps/web/src/lib/server-session.ts` - 登录态和建档完成度守卫
- `apps/web/src/app/globals.css` - Phase 1 UI 色板、排版和移动优先样式
- `apps/web/package.json` - Next.js 依赖升级到 15.5.15
- `package-lock.json` - 安装锁文件，已消除已知漏洞

## Decisions Made
- 为了保证受保护页面稳定，`next/headers` 只放在服务端调用链里，不再混进通用 client 模块。
- 为了避免联网拉 Google 字体导致构建不稳定，改为使用本机优先中文字体栈。
- 自定义物品继续保留，但主路径仍然先走预设品类，保持 Phase 1 数据质量更稳。

## Deviations from Plan

### Auto-fixed Issues

**1. Next 15.2.4 存在安全告警**
- **Found during:** 依赖安装与构建前检查
- **Issue:** 初始安装后 `npm audit` 提示 `next@15.2.4` 存在已知漏洞。
- **Fix:** 将 `next` 与 `eslint-config-next` 升级到 `15.5.15`，重新安装并生成新的 `package-lock.json`。
- **Files modified:** `apps/web/package.json`, `package-lock.json`
- **Verification:** `npm install` 后显示 `found 0 vulnerabilities`。

**2. JSON 文件被写入 UTF-8 BOM，导致 Next 构建失败**
- **Found during:** `npm run build:web`
- **Issue:** `package.json`、`tsconfig.json`、`components.json` 等文件含 BOM，Next 解析时报 `Unexpected token`.
- **Fix:** 统一改写为无 BOM UTF-8。
- **Files modified:** `package.json`, `package-lock.json`, `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/components.json`, `packages/shared-types/package.json`, `packages/shared-types/tsconfig.json`
- **Verification:** 再次执行 `npm run build:web` 成功通过。

**3. 服务端页面误走 client import 链**
- **Found during:** `npm run build:web`
- **Issue:** 通用 API 模块引用了 `next/headers`，导致 client 组件构建失败。
- **Fix:** 保留 `api-client.ts` 作为浏览器安全模块，新增 `server-api.ts` 承担服务端取数。
- **Files modified:** `apps/web/src/lib/api-client.ts`, `apps/web/src/lib/server-api.ts`, `apps/web/src/lib/server-session.ts`
- **Verification:** 页面构建通过，服务端页面可正常使用守卫逻辑。

**4. next/font/google 联网拉字体超时**
- **Found during:** 构建阶段
- **Issue:** `next/font/google` 反复超时，拖慢并扰动本地构建。
- **Fix:** 去掉远程字体依赖，改用本机优先中文字体栈。
- **Files modified:** `apps/web/src/app/layout.tsx`, `apps/web/src/app/globals.css`
- **Verification:** `npm run build:web` 在当前环境稳定通过。

---

**Total deviations:** 4 auto-fixed
**Impact on plan:** 只修正构建稳定性和依赖安全问题，没有改变 Phase 1 的产品范围和实现边界。

## Issues Encountered
- 这一轮没有跑真实短信登录，也没有接入真实后端联调数据，当前验证主要覆盖前端构建、类型检查和页面守卫逻辑。

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 2 可以直接在当前前端壳子上接入购买记录录入和库存状态展示。
- Phase 1 的页面骨架已经就位，后续不需要再返工登录、建档和物品管理的页面结构。

---
*Phase: 01-product-skeleton-household-setup*
*Completed: 2026-04-14*
