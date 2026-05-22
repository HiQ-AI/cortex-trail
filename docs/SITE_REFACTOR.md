# Cortex-trail 系统性重构方案

> 这是 cortex.hiq.earth 信息架构（IA）的重构基准文档。**所有重构按此文档分阶段推进**，每阶段一个 PR。
> 现状审计于 2026-05-22。

---

## 0. 原则（不可妥协）

1. **单一真相源（single source of truth）**：每个内容点只有**一个**主页拥有它的完整叙述；其它页面只放一行 teaser + 链接，**不重复全文**。
2. **四个访客意图驱动顶层导航**：了解产品 / 学会用 / 是否可信 / 多少钱。外加观点(Blog)、开发者(API)。
3. **体裁分明**：Product=「是什么」、Guides=「怎么用（含场景）」、Trust=「凭什么信」、Pricing=「怎么买」、Blog=「为什么」、Docs=「怎么接」。
4. **品牌 voice 不变**：editorial、terse、noun-heavy；禁 banned words；蜗牛隐喻只在 landing/about/Slow-Dispatch。
5. **不破链**：已有 URL 尽量保留；移除的入口用 redirect，不留 404。
6. **zh 与 en 严格 parity**：每个改动两边同步。
7. **冗余直接删，不要 fallback**：重复的页面/段落直接删除，**不留 redirect**（用户拍板：无所谓破链）。段落冗余删掉后改成一行 teaser+link。不做"两边都留着"的妥协。

---

## 1. 现状审计

### 1.1 导航
- **Header**：Overview · Product▾(Chat, Cowork) · Guides · Pricing · Blog
- **Footer**：Product / Guides / Scenarios / Reference(Skills,Standards,Security,API docs) / Company(Blog,About,HiQ-AI,Contact)

### 1.2 页面清单（EN 为准，几乎全部有 zh 镜像）

| 模块 | 页面 | section 数 | 角色 |
|---|---|---|---|
| A 品牌/入口 | `/`、`/about` | 4、5 | 定位、公司故事 |
| B 产品 | `/product/chat`、`/product/cowork`、`/skills` | 8、**13**、7 | 功能详情 |
| C 场景 | `/solutions`(index) + bom/pcf/epd/ilcd/authoring | 5 + 各 8-9 | 用例 |
| D 学习 | `/guides`(hub) + 3 篇 how-to(.mdx) | 3 + 文章 | 教程 |
| E 开发 | `/docs`(API) | 5 | REST/MCP/AG-UI/A2A |
| F 信任 | `/standards`、`/security` | 5、8 | 合规、数据 |
| G 转化 | `/pricing` | 7 | 三档 + license |
| H 洞察 | `/blog` + 3 篇(.mdx) | 2 + 文章 | 观点 |
| I 工具 | `/404` | 1 | — |

规模：~20 页面类型，~37 路由（多数 ×2 语言），~50 内容点。

### 1.3 问题清单

| # | 问题 | 证据 | 严重度 |
|---|---|---|---|
| P1 | **Scenarios 双 hub**：`/solutions` index 是带 persona 分组(practitioner/operator)的优质 hub，但 nav 已改指 `/guides`，它现在孤立；而 `/guides` hub 更薄、平铺 | solutions/index 6 entry + persona + Computer Use 入口 vs guides hub 平铺 5 卡 | 高 |
| P2 | **Cowork 页过载**：13 section，把 skills(§IX)、scenarios(§III)、privacy(§VI) 这些**已有独立页**的内容又全文重复 | 与 `/skills`、`/solutions/*`、`/security` 重复 | 高 |
| P3 | **首页欠展示**：hero+一句stat+两产品+CTA，**没露** scenarios / 数据库广度 / 信任 / demo | index.astro 仅 4 section | 中高 |
| P4 | **Cowork 内部顺序**：Dispatch(niche)排 §II，挤在 Platforms 与 Scenarios 之间 | §II Dispatch 先于 §III | 中 |
| P5 | 命名/死代码：`/solutions/*` URL 却叫 "Scenarios"；blog index `length===0` 死分支 | — | 低 |

---

## 2. 目标架构

### 2.1 目标导航
- **Header**：Product▾(Chat · Cowork · Skills) · Guides · Pricing · Trust▾(Standards · Security) · Blog
  - Skills 收进 Product▾（它是产品能力，且与 cowork §IX 重复 → 去重后只此一家）
  - Trust▾ 新增（LCA/核查员受众，信任是购买因素；现仅躺在 footer）
  - Guides 吸收 scenarios
  - Docs(API) 留 footer（仅开发者）
- **Footer**：Product / Guides / Trust(Standards,Security) / Developers(API docs,Skills) / Company(Blog,About,HiQ-AI,Contact)

### 2.2 单一真相源 — 内容归属映射（去重的核心）

| 内容点 | 主页（拥有完整叙述） | 其它页（只 teaser+link） |
|---|---|---|
| Chat vs Cowork 对比 | `product/cowork` §Compare（canonical 表） | index、product/chat 链接到它 |
| 14 数据库 + DQI + system model | `product/chat`（canonical） | pricing/skills/standards 链接 |
| 5 工作流场景 | `/solutions/*` 子页 + `/guides` hub 聚合 | cowork、首页只 teaser+link |
| 计算引擎(openLCA/brightway/积木) | `product/cowork` + `running-a-calculation` 指南 | solutions/pcf 细节 |
| 6层记忆 / progress.md / wiki / schedules | `product/cowork`（canonical） | — |
| Computer Use | `product/cowork#computer-use`（canonical） | guides 场景链接 |
| Skills 系统 | `/skills`（canonical） | cowork §Skills 砍成 teaser+link |
| 本地优先 / 隐私 | `/security`（canonical） | cowork §Privacy 砍成 teaser+link |
| 定价 + license 模型 | `/pricing`（canonical） | — |
| 标准对齐 | `/standards`（canonical） | — |
| API | `/docs`（canonical） | — |

### 2.3 每页「该展示什么」+ 目标内部顺序

- **`/` 首页**：Hero → 为何不同(data-work stat + "unlike general AI") → 两产品 → **场景条(新增, teaser→guides)** → 信任一行(standards/security) → CTA
- **`/product/cowork`**（瘦身后顺序）：Platforms → **Scenarios(teaser→/guides)** → 计算引擎 → BOM 交付物 → 记忆/审计(6层+wiki+progress) → Schedules → Dispatch → Computer Use → **Skills(teaser→/skills)** → **Privacy(teaser→/security)** → Compare(canonical)
- **`/product/chat`**：现状合理，保留；§VI Compare 改为链接 cowork 的 canonical 表
- **`/guides`**：Start here(how-to) → Scenarios(persona 分组：For practitioners / For programme operators，含 Computer Use 入口)
- **`/skills`**：保留为 canonical；cowork 不再重复
- **`/pricing`、`/security`、`/standards`、`/docs`**：内部顺序已合理，保留
- **`/blog` index**：删 `length===0` 死分支
- **`/solutions`(index)**：→ redirect 到 `/guides`（hub 统一）；5 子页 URL 不动

---

## 3. 分阶段实施（每阶段一个 PR，自合并）

| Phase | 内容 | 文件面 | 风险 |
|---|---|---|---|
| **P0** | 本文档落库 | docs/SITE_REFACTOR.md | 无 |
| **P1 IA 骨架** | nav 终态(Product▾加Skills + Trust▾) / footer 终态 / `/solutions`→`/guides` redirect / guides hub persona 分组 | Header, Footer, guides/index, solutions/index(en+zh) | 低 |
| **P2 Cowork 去重** | §Skills→teaser+link `/skills`；§Privacy→teaser+link `/security`；§Scenarios→teaser+link `/guides`；Dispatch 下移 | product/cowork(en+zh) | 中（大页重排，单独 PR） |
| **P3 首页重构** | 场景条 + 信任行 + "unlike general AI" 段；chat §VI 改链接 | index, product/chat(en+zh) | 中 |
| **P4 逐页排版校正** | 删 blog 死分支；各页 section 顺序/间距核对 | 多页 | 低 |
| **P5 内容补缺** | personas 路由 / "vs 通用 AI" 对比页 / changelog（按需，可延后） | 新页 | 中 |
| **P6 一致性 QA** | 命名统一 / zh parity 全量核对 / build 绿 / 部署验证 | 全站 | 低 |

**完成定义（每 PR）**：`astro build` 绿；en+zh 同步；无破链；自合并触发部署后人工抽查关键页。

---

## 4. 进度

- [x] P0 文档落库
- [x] P1 IA 骨架（nav: Product▾+Skills, 去 Overview; footer: Skills 移入 Product; **删除** /solutions 与 /zh/solutions index 页（无 redirect）; guides hub persona 分组。**未加 Trust▾** — zh 标签别扭+下拉太薄，Standards/Security 留 footer）
- [ ] P2 Cowork 去重
- [ ] P3 首页重构
- [ ] P4 逐页排版
- [ ] P5 内容补缺
- [ ] P6 一致性 QA
