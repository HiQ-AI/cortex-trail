// AUTO-GENERATED demo scripts for <Screencast>. Long, granular Cortex sessions.
// Regenerate via /tmp/gen_demos.py if the flow changes.
export const anodizingAuthoringEn = [
  {
    "kind": "user",
    "text": "The folder ./anodizing-source has our environmental reports and energy ledgers. Build a reusable LCA background dataset from them and get it into HiQ Editor for review."
  },
  {
    "kind": "think",
    "text": "This is the full UPR pipeline followed by an editor handoff. I'll run it in stages — extract, build the workbook, match IDs, validate, then push to the editor — and farm the heavy stages out to worker subagents so each artifact is checked before the next begins. Nothing unmeasured gets guessed."
  },
  {
    "kind": "say",
    "text": "Stage 1 — source extraction. Spawning a worker."
  },
  {
    "kind": "task",
    "items": [
      "List ./anodizing-source"
    ]
  },
  {
    "kind": "say",
    "text": "Four files: 环评报告.pdf (62 pp), 验收监测报告.pdf, 工艺说明.docx, 能耗台账_2024.xlsx."
  },
  {
    "kind": "task",
    "items": [
      "Read 环评报告.pdf — 62 pages"
    ]
  },
  {
    "kind": "say",
    "text": "Activity data sits in §4.3 (material & energy balance) and Appendix B (emissions monitoring)."
  },
  {
    "kind": "task",
    "items": [
      "Extract §4.3 material balance table → JSON (cite p.31)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract §4.3 energy table → JSON (cite p.33)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract Appendix B emissions → JSON (cite p.55–58)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read 工艺说明.docx — process narrative"
    ]
  },
  {
    "kind": "say",
    "text": "Process is: degrease → rinse → anodize (sulfuric, 18 °C) → seal → dry. That fixes the unit-process boundary."
  },
  {
    "kind": "task",
    "items": [
      "Read 能耗台账_2024.xlsx — monthly meter log"
    ]
  },
  {
    "kind": "say",
    "text": "Cross-check: ledger electricity is within 2% of the EIA annual figure. Using the metered ledger — it's the stronger source."
  },
  {
    "kind": "task",
    "items": [
      "OCR scanned mass-balance figure — p.42"
    ]
  },
  {
    "kind": "say",
    "text": "Sulfuric acid appears only as an annual total. I'll allocate it per m² treated surface and flag the assumption. Solvent recovery rate has no source — marking it unsupported, not guessing."
  },
  {
    "kind": "task",
    "items": [
      "Normalise units — kWh, kg, m³"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Tag each figure with its evidence page"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Write extracted_activity.json — 11 items, 2 flagged"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Generate extraction_report.md + evidence pages"
    ]
  },
  {
    "kind": "say",
    "text": "Worker 1 handoff: 11 activity items, all page-cited, 2 marked for review."
  },
  {
    "kind": "think",
    "text": "Stage 2 — generate the UPR workbook from the blank template: 基本信息 metadata, then the P-工序 exchange rows. The reference flow drives everything downstream, so I'll confirm it first."
  },
  {
    "kind": "ask",
    "q": "Reference flow for the unit process?",
    "options": [
      "1 m² treated surface",
      "1 kg part",
      "1 part"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "task",
    "items": [
      "基本信息 — product/process description"
    ]
  },
  {
    "kind": "task",
    "items": [
      "基本信息 — activity boundary (degrease → dry)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "基本信息 — geography: CN, technology: sulfuric anodizing"
    ]
  },
  {
    "kind": "task",
    "items": [
      "基本信息 — reference year 2024, synonyms"
    ]
  },
  {
    "kind": "say",
    "text": "Now the P-工序 rows — one per exchange, source name preserved verbatim."
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — electricity, CN grid"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — sulfuric acid 98%"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — sodium hydroxide"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — process water"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — compressed air"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — aluminium part (in)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — anodized surface (ref)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — spent acid (waste)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — rinse wastewater"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — Al³⁺ to water"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 row — VOC to air"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Generate UPR-anodizing-2026.xlsx"
    ]
  },
  {
    "kind": "say",
    "text": "Worker 2 handoff: 基本信息 + 11 P-工序 rows written, template checks pass."
  },
  {
    "kind": "think",
    "text": "Stage 3 — match every flow to a catalogue ID and every input to a background dataset. Never construct an ID by hand; always search first and pass the returned tuple through."
  },
  {
    "kind": "task",
    "items": [
      "search_flows — electricity"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — sulfuric acid"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — sodium hydroxide"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — process water"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — compressed air"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — aluminium"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — spent acid"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — rinse wastewater"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — Al³⁺ (elementary)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — VOC (elementary)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — anodized surface"
    ]
  },
  {
    "kind": "say",
    "text": "9 of 11 auto-matched. Two are ambiguous: the NaOH grade and the 'process water' flow."
  },
  {
    "kind": "ask",
    "q": "NaOH — which background dataset?",
    "options": [
      "ecoinvent 3.12 · sodium hydroxide (market, RER)",
      "HiQLCD 1.4 · 烧碱 (CN, 50% liquid)",
      "Leave for manual review"
    ],
    "pick": [
      1
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — electricity → HiQLCD 1.4 'CN grid mix'"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — sulfuric acid → ecoinvent 3.12 (market, RER)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — sodium hydroxide → HiQLCD 1.4 (CN)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — compressed air → ecoinvent 3.12"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — aluminium → HiQLCD 1.4 (primary, CN)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — spent acid treatment → ecoinvent 3.12"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — wastewater treatment → HiQLCD 1.4"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Write 匹配报告 sheet + background-quality JSON"
    ]
  },
  {
    "kind": "say",
    "text": "Worker 3 handoff: 11 flows matched, 7 background links resolved, all IDs from search responses."
  },
  {
    "kind": "think",
    "text": "Stage 4 — validate the workbook and apply only safe automatic fixes. Anything needing source judgement stays for the reviewer."
  },
  {
    "kind": "task",
    "items": [
      "Run validate_upr_file.py"
    ]
  },
  {
    "kind": "say",
    "text": "1 error, 3 warnings. Process-water unit is in L; the flow expects kg. Two DQI cells are blank, and the acid row carries my allocation flag."
  },
  {
    "kind": "task",
    "items": [
      "Auto-fix — convert process water L → kg (ρ=1.0)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Auto-fix — fill DQI time/geography from metadata"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Run mass_balance.py — inputs vs outputs (kg)"
    ]
  },
  {
    "kind": "say",
    "text": "Mass balance closes within 0.4% once rinse drag-out is counted. The solvent-recovery row stays flagged — no source, reviewer decides."
  },
  {
    "kind": "task",
    "items": [
      "Re-validate — confirm 0 blocking errors"
    ]
  },
  {
    "kind": "artifact",
    "title": "UPR-anodizing-2026.xlsx",
    "desc": "validated · 11 exchanges",
    "lines": [
      "Every figure page-cited to source",
      "2 items flagged for reviewer",
      "匹配报告 + DQI scored",
      "0 blocking errors — ready for HiQ Editor"
    ]
  },
  {
    "kind": "think",
    "text": "Stage 5 — hand the validated workbook to HiQ Editor. Create the process, add every exchange, link the background matches, trial-calc, then stop for your sign-off. I never auto-submit."
  },
  {
    "kind": "task",
    "items": [
      "list_datasources → 公司背景库"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows PRODUCT_FLOW 'anodized aluminium surface'"
    ]
  },
  {
    "kind": "task",
    "items": [
      "create_process — reference flow = 1 m²"
    ]
  },
  {
    "kind": "task",
    "items": [
      "get_process_detail — verify reference_flow_id written"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — reference product (anodized surface, 1 m²)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — electricity 4.2 kWh"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — sulfuric acid 0.31 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — sodium hydroxide 0.08 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — process water 12 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — compressed air 0.9 m³"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — aluminium 0.02 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — spent acid 0.28 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — rinse wastewater 11 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — Al³⁺ to water 3 g"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — VOC to air 1.2 g"
    ]
  },
  {
    "kind": "task",
    "items": [
      "get_process_detail — verify 11 exchanges written"
    ]
  },
  {
    "kind": "task",
    "items": [
      "link background — electricity"
    ]
  },
  {
    "kind": "task",
    "items": [
      "link background — sulfuric acid"
    ]
  },
  {
    "kind": "task",
    "items": [
      "link background — sodium hydroxide"
    ]
  },
  {
    "kind": "task",
    "items": [
      "link background — compressed air"
    ]
  },
  {
    "kind": "task",
    "items": [
      "link background — aluminium"
    ]
  },
  {
    "kind": "task",
    "items": [
      "link background — spent acid treatment"
    ]
  },
  {
    "kind": "task",
    "items": [
      "link background — wastewater treatment"
    ]
  },
  {
    "kind": "task",
    "items": [
      "calculate_process — trial LCI"
    ]
  },
  {
    "kind": "task",
    "items": [
      "calculate_process — trial LCIA (IPCC AR6)"
    ]
  },
  {
    "kind": "say",
    "text": "Trial GWP is 8.7 kg CO₂e / m². Hotspot is grid electricity (64%), then primary aluminium drag-out. DQI is solid except the acid (EU geo proxy). Order of magnitude matches the reference anodizing dataset."
  },
  {
    "kind": "ask",
    "q": "Trial calc is sane. Submit to review?",
    "options": [
      "Submit for review",
      "Not yet — recheck the acid allocation"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "task",
    "items": [
      "submit_review_tool — state → in_review"
    ]
  },
  {
    "kind": "artifact",
    "title": "anodizing background dataset",
    "desc": "HiQ Editor · in review",
    "lines": [
      "Process + 11 exchanges, 7 background links",
      "Trial GWP — 8.7 kg CO₂e / m²",
      "Mass balance closes (0.4%)",
      "Submitted · awaiting reviewer sign-off"
    ]
  }
];

export const anodizingAuthoringZh = [
  {
    "kind": "user",
    "text": "工作目录 ./anodizing-source 里是我们的环评报告和能耗台账。基于它们做一个可复用的 LCA 背景数据集，并导入 HiQ Editor 送审。"
  },
  {
    "kind": "think",
    "text": "这是一条完整的 UPR 管线，后接编辑器交接。我分阶段跑——提取、建表、匹配 ID、校验、再推到编辑器——重活交给 worker 子代理，每个产物先校验再进下一步。没有实测的项绝不臆造。"
  },
  {
    "kind": "say",
    "text": "阶段 1 — 源数据提取。启动一个 worker。"
  },
  {
    "kind": "task",
    "items": [
      "列出 ./anodizing-source"
    ]
  },
  {
    "kind": "say",
    "text": "四个文件：环评报告.pdf（62 页）、验收监测报告.pdf、工艺说明.docx、能耗台账_2024.xlsx。"
  },
  {
    "kind": "task",
    "items": [
      "读取 环评报告.pdf — 62 页"
    ]
  },
  {
    "kind": "say",
    "text": "活动数据在 §4.3（物料能量平衡）和附录 B（排放监测）。"
  },
  {
    "kind": "task",
    "items": [
      "提取 §4.3 物料平衡表 → JSON（引用 p.31）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取 §4.3 能量表 → JSON（引用 p.33）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取 附录 B 排放 → JSON（引用 p.55–58）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取 工艺说明.docx — 工艺说明"
    ]
  },
  {
    "kind": "say",
    "text": "工艺为：脱脂 → 水洗 → 阳极氧化（硫酸，18 °C）→ 封孔 → 干燥。单元过程边界由此确定。"
  },
  {
    "kind": "task",
    "items": [
      "读取 能耗台账_2024.xlsx — 月度电表台账"
    ]
  },
  {
    "kind": "say",
    "text": "交叉核对：台账电力与环评年度值相差 2% 以内。采用台账实测值——证据更强。"
  },
  {
    "kind": "task",
    "items": [
      "OCR 扫描版物料平衡图 — p.42"
    ]
  },
  {
    "kind": "say",
    "text": "硫酸只给了年度总量。我按每 m² 处理面积分摊，并标注该假设。溶剂回收率没有来源——标记为无源，不臆造。"
  },
  {
    "kind": "task",
    "items": [
      "归一化单位 — kWh、kg、m³"
    ]
  },
  {
    "kind": "task",
    "items": [
      "为每个数值打上证据页码"
    ]
  },
  {
    "kind": "task",
    "items": [
      "写入 extracted_activity.json — 11 项，2 项标记"
    ]
  },
  {
    "kind": "task",
    "items": [
      "生成 extraction_report.md + 证据页"
    ]
  },
  {
    "kind": "say",
    "text": "Worker 1 交接：11 个活动项，全部带页码引用，2 项待人工复核。"
  },
  {
    "kind": "think",
    "text": "阶段 2 — 用空白模板生成 UPR 工作簿：先填 基本信息 元数据，再做 P-工序 交换行。参考流决定下游一切，先确认它。"
  },
  {
    "kind": "ask",
    "q": "该单元过程的参考流？",
    "options": [
      "1 m² 处理表面",
      "1 kg 零件",
      "1 个零件"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "task",
    "items": [
      "基本信息 — 产品/过程说明"
    ]
  },
  {
    "kind": "task",
    "items": [
      "基本信息 — 活动边界（脱脂 → 干燥）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "基本信息 — 地理：CN，技术：硫酸阳极氧化"
    ]
  },
  {
    "kind": "task",
    "items": [
      "基本信息 — 参考年份 2024、同义词"
    ]
  },
  {
    "kind": "say",
    "text": "接着是 P-工序 行——每条交换一行，源名称原样保留。"
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 电力，中国电网"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 硫酸 98%"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 氢氧化钠"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 工艺水"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 压缩空气"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 铝件（入）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 阳极氧化表面（参考）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 废酸（废物）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — 漂洗废水"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — Al³⁺ 入水"
    ]
  },
  {
    "kind": "task",
    "items": [
      "P-工序 行 — VOC 入气"
    ]
  },
  {
    "kind": "task",
    "items": [
      "生成 UPR-anodizing-2026.xlsx"
    ]
  },
  {
    "kind": "say",
    "text": "Worker 2 交接：基本信息 + 11 条 P-工序 行已写入，模板检查通过。"
  },
  {
    "kind": "think",
    "text": "阶段 3 — 把每条流匹配到目录 ID、每个输入匹配到背景数据集。绝不手拼 ID；先搜索，再把返回的元组原样传下去。"
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 电力"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 硫酸"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 氢氧化钠"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 工艺水"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 压缩空气"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 铝"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 废酸"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 漂洗废水"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — Al³⁺（基本流）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — VOC（基本流）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows — 阳极氧化表面"
    ]
  },
  {
    "kind": "say",
    "text": "11 条里 9 条自动匹配。两条有歧义：NaOH 牌号 和「工艺水」流。"
  },
  {
    "kind": "ask",
    "q": "NaOH — 用哪个背景数据集？",
    "options": [
      "ecoinvent 3.12 · 烧碱（market, RER）",
      "HiQLCD 1.4 · 烧碱（CN，50% 液碱）",
      "留待人工复核"
    ],
    "pick": [
      1
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — 电力 → HiQLCD 1.4「CN grid mix」"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — 硫酸 → ecoinvent 3.12（market, RER）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — 氢氧化钠 → HiQLCD 1.4（CN）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — 压缩空气 → ecoinvent 3.12"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — 铝 → HiQLCD 1.4（原铝，CN）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — 废酸处理 → ecoinvent 3.12"
    ]
  },
  {
    "kind": "task",
    "items": [
      "match_background — 废水处理 → HiQLCD 1.4"
    ]
  },
  {
    "kind": "task",
    "items": [
      "写入 匹配报告 sheet + 背景数据质量 JSON"
    ]
  },
  {
    "kind": "say",
    "text": "Worker 3 交接：11 条流已匹配，7 条背景链接已解析，所有 ID 均来自搜索返回。"
  },
  {
    "kind": "think",
    "text": "阶段 4 — 校验工作簿，只做安全的自动修复。需要源判断的留给评审。"
  },
  {
    "kind": "task",
    "items": [
      "运行 validate_upr_file.py"
    ]
  },
  {
    "kind": "say",
    "text": "1 个错误、3 个警告。工艺水单位是 L，流要求 kg。两个 DQI 单元为空，硫酸行带着我的分摊标记。"
  },
  {
    "kind": "task",
    "items": [
      "自动修复 — 工艺水 L → kg（ρ=1.0）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "自动修复 — 由元数据补全 DQI 时间/地理"
    ]
  },
  {
    "kind": "task",
    "items": [
      "运行 mass_balance.py — 输入 vs 输出（kg）"
    ]
  },
  {
    "kind": "say",
    "text": "计入漂洗带出后，物料平衡闭合在 0.4% 以内。溶剂回收行仍标记——无来源，由评审定夺。"
  },
  {
    "kind": "task",
    "items": [
      "重新校验 — 确认 0 阻断错误"
    ]
  },
  {
    "kind": "artifact",
    "title": "UPR-anodizing-2026.xlsx",
    "desc": "已校验 · 11 条交换",
    "lines": [
      "每个数值都带源页码引用",
      "2 项标记给评审",
      "匹配报告 + DQI 已评分",
      "0 阻断错误——可进 HiQ Editor"
    ]
  },
  {
    "kind": "think",
    "text": "阶段 5 — 把校验过的工作簿交给 HiQ Editor。创建过程、添加每条交换、链接背景匹配、试算，然后停下等你拍板。我绝不自动提交。"
  },
  {
    "kind": "task",
    "items": [
      "list_datasources → 公司背景库"
    ]
  },
  {
    "kind": "task",
    "items": [
      "search_flows PRODUCT_FLOW「阳极氧化铝表面」"
    ]
  },
  {
    "kind": "task",
    "items": [
      "create_process — 参考流 = 1 m²"
    ]
  },
  {
    "kind": "task",
    "items": [
      "get_process_detail — 确认 reference_flow_id 已写入"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 参考产品（阳极氧化表面，1 m²）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 电力 4.2 kWh"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 硫酸 0.31 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 氢氧化钠 0.08 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 工艺水 12 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 压缩空气 0.9 m³"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 铝 0.02 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 废酸 0.28 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — 漂洗废水 11 kg"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — Al³⁺ 入水 3 g"
    ]
  },
  {
    "kind": "task",
    "items": [
      "add_exchange — VOC 入气 1.2 g"
    ]
  },
  {
    "kind": "task",
    "items": [
      "get_process_detail — 确认 11 条交换已写入"
    ]
  },
  {
    "kind": "task",
    "items": [
      "链接背景 — 电力"
    ]
  },
  {
    "kind": "task",
    "items": [
      "链接背景 — 硫酸"
    ]
  },
  {
    "kind": "task",
    "items": [
      "链接背景 — 氢氧化钠"
    ]
  },
  {
    "kind": "task",
    "items": [
      "链接背景 — 压缩空气"
    ]
  },
  {
    "kind": "task",
    "items": [
      "链接背景 — 铝"
    ]
  },
  {
    "kind": "task",
    "items": [
      "链接背景 — 废酸处理"
    ]
  },
  {
    "kind": "task",
    "items": [
      "链接背景 — 废水处理"
    ]
  },
  {
    "kind": "task",
    "items": [
      "calculate_process — 试算 LCI"
    ]
  },
  {
    "kind": "task",
    "items": [
      "calculate_process — 试算 LCIA（IPCC AR6）"
    ]
  },
  {
    "kind": "say",
    "text": "试算 GWP 为 8.7 kg CO₂e / m²。热点是电网电力（64%），其次是原铝带出。DQI 整体扎实，仅硫酸偏弱（欧盟地理代理）。数量级与参考阳极氧化数据集吻合。"
  },
  {
    "kind": "ask",
    "q": "试算合理。提交审核？",
    "options": [
      "提交审核",
      "先别——再核硫酸分摊"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "task",
    "items": [
      "submit_review_tool — 状态 → 审核中"
    ]
  },
  {
    "kind": "artifact",
    "title": "阳极氧化背景数据集",
    "desc": "HiQ Editor · 审核中",
    "lines": [
      "过程 + 11 条交换、7 条背景链接",
      "试算 GWP — 8.7 kg CO₂e / m²",
      "物料平衡闭合（0.4%）",
      "已提交 · 等待评审签字"
    ]
  }
];

export const epdAuditEn = [
  {
    "kind": "user",
    "text": "Audit concrete_C30_EPD.pdf before we register it. EN 15804+A2 declaration, ready-mix concrete, declared unit 1 m³. We're the programme operator."
  },
  {
    "kind": "think",
    "text": "I'll run the full audit pipeline — intake & triage, parse, twelve concurrent check-group workers, merge, benchmark against reference data and peer EPDs, then a risk-graded report. I'm the independent second pair of eyes that complements the verifier, and every flag lands on disk with its cited clause so a regulator can reconstruct it."
  },
  {
    "kind": "say",
    "text": "Phase 0 — intake & triage."
  },
  {
    "kind": "task",
    "items": [
      "Copy dossier → work/intake/"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Open work/log.jsonl — append-only audit trail"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Identify programme operator → EPD International"
    ]
  },
  {
    "kind": "say",
    "text": "EPD International never receives the background LCA report — this audit is the only second technical review before publication. Tightening the data-quality thresholds accordingly."
  },
  {
    "kind": "task",
    "items": [
      "Resolve PCR → PCR 2019:14"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Resolve c-PCR → concrete & cement"
    ]
  },
  {
    "kind": "ask",
    "q": "Verification pathway?",
    "options": [
      "Independent verifier (per-EPD report)",
      "Process-certified (GPI 5.0.1)"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "task",
    "items": [
      "Set pathway modifiers — verifier report expected"
    ]
  },
  {
    "kind": "think",
    "text": "Phase 1 — parse the EPD and supporting docs, then spot-check what the parser dropped against the source PDF."
  },
  {
    "kind": "task",
    "items": [
      "Parse concrete_C30_EPD.pdf — 18 pages"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract header — declared unit, PCR refs, validity"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — A1 raw materials"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — A2 transport"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — A3 manufacturing"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — A4 transport to site"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — A5 installation"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — C1 deconstruction"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — C2 transport"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — C3 waste processing"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — C4 disposal"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Read module — D reuse/recovery"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — GWP-total"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — GWP-fossil"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — GWP-biogenic"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — GWP-luluc"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — ODP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — AP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — EP-freshwater"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — EP-marine"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — EP-terrestrial"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — POCP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — ADP-minerals/metals"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — ADP-fossil"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Extract indicator — WDP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Parse data-quality annex (DQI per module)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Parse scenario annex — A4 transport, C end-of-life"
    ]
  },
  {
    "kind": "say",
    "text": "Parser dropped the C-module table — it's a scanned image on p.12–13. Re-reading from source."
  },
  {
    "kind": "task",
    "items": [
      "OCR p.12–13 → recover C2–C4 values"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Write extracted/epd_data.json + parser_gaps.md"
    ]
  },
  {
    "kind": "say",
    "text": "Parse confidence High. 13 indicators × 11 modules captured, 1 gap recovered."
  },
  {
    "kind": "think",
    "text": "Phase 2 — dispatch the twelve check groups as concurrent workers. Each writes a findings file and a trace scratchpad so a later auditor can review the reasoning."
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group A — format & completeness"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group B — PCR 2019:14 conformance"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group C — EN 15804+A2 modules & indicators"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group D — LCA methodology & boundary"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group E — data quality (DQI) & representativeness"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group F — impact plausibility"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group G — verifier provenance & report"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group H — biogenic carbon accounting"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group I — allocation & cut-off"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group J — cross-EPD peer cohort"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group K — units & reference-flow consistency"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Dispatch Group L — scenario (SF) assumptions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group A → clean"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group B → clean"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group C → 1 critical"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group D → clean"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group E → 1 warning"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group F → defer to Phase 3"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group G → clean"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group H → clean"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group I → 1 advisory"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group J → defer to Phase 3"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group K → clean"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group L → 1 advisory"
    ]
  },
  {
    "kind": "say",
    "text": "Group C: GWP-biogenic is absent from module A1 — mandatory under A2. Critical."
  },
  {
    "kind": "say",
    "text": "Group E: the cement dataset is ecoinvent 3.7 (2020), superseded by 3.12. Warning."
  },
  {
    "kind": "say",
    "text": "Group I: 70/30 economic allocation on the slag co-product where PCR wants mass below the 1% threshold. Advisory."
  },
  {
    "kind": "task",
    "items": [
      "Collect 12 group outputs + trace files"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate findings against schema"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Phase 2.5 — verifier severity tally → tally.json"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Merge → audit_state.json"
    ]
  },
  {
    "kind": "think",
    "text": "Phase 3 — benchmark the declared values against HiQLCD reference data and a peer cohort; flag outliers, but don't call a high-but-explained value an error."
  },
  {
    "kind": "task",
    "items": [
      "Query HiQLCD reference — C30 ready-mix concrete (CN)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Pull peer EPD #1 from registry"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Pull peer EPD #2 from registry"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Pull peer EPD #3 from registry"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Pull peer EPD #4 from registry"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Pull peer EPD #5 from registry"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Pull peer EPD #6 from registry"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Build peer cohort → cohort.json"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Compute distributions (IQR, percentiles) → distributions.json"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Outlier check — GWP-total"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Outlier check — AP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Outlier check — EP-marine"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Outlier check — POCP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Outlier check — ADP-fossil"
    ]
  },
  {
    "kind": "say",
    "text": "Declared GWP-total 241 kg CO₂e/m³ sits at the 88th percentile — high, but inside the upper whisker. The declared cement content explains it."
  },
  {
    "kind": "task",
    "items": [
      "Compare A1–A3 split vs peer median"
    ]
  },
  {
    "kind": "say",
    "text": "A1 (cement) share is 8 points above the peer median — consistent with the declared mix, not flagged."
  },
  {
    "kind": "task",
    "items": [
      "Recompute indicators — cement → ecoinvent 3.12"
    ]
  },
  {
    "kind": "say",
    "text": "Recomputed GWP-total is 248 vs 241 declared (+2.9%) — inside tolerance, noted for the verifier."
  },
  {
    "kind": "task",
    "items": [
      "Write benchmarks/comparison.json"
    ]
  },
  {
    "kind": "ask",
    "q": "1 critical (missing GWP-biogenic, A1), 1 warning, 2 advisories. Generate the report?",
    "options": [
      "Generate Excel + PDF",
      "Critical findings only"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "task",
    "items": [
      "Build audit_report.xlsx — findings by risk grade"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Attach cited clauses + evidence excerpts"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Tag findings by verifier → performance signal"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Render audit_report.pdf (external)"
    ]
  },
  {
    "kind": "artifact",
    "title": "audit_report.xlsx",
    "desc": "EPD audit · concrete C30",
    "lines": [
      "1 critical · 1 warning · 2 advisories",
      "Missing GWP-biogenic (A1) blocks registration",
      "GWP-total recompute +2.9% vs declared",
      "Every finding cites its EN 15804+A2 / PCR clause"
    ]
  }
];

export const epdAuditZh = [
  {
    "kind": "user",
    "text": "注册前先审一遍 concrete_C30_EPD.pdf。EN 15804+A2 声明，预拌混凝土，声明单位 1 m³。我们是计划运营方。"
  },
  {
    "kind": "think",
    "text": "我跑完整审核管线——接收与分流、解析、十二个并发检查组 worker、合并、对参考数据和同类 EPD 做基准比对，再出风险分级报告。我是补充核查员的独立第二双眼睛，每条标记都落盘并附引用条款，监管方可回溯。"
  },
  {
    "kind": "say",
    "text": "阶段 0 — 接收与分流。"
  },
  {
    "kind": "task",
    "items": [
      "拷贝材料 → work/intake/"
    ]
  },
  {
    "kind": "task",
    "items": [
      "打开 work/log.jsonl — 只追加审计轨迹"
    ]
  },
  {
    "kind": "task",
    "items": [
      "识别计划运营方 → EPD International"
    ]
  },
  {
    "kind": "say",
    "text": "EPD International 拿不到背景 LCA 报告——本次审核是发布前唯一的第二次技术复核。据此收紧数据质量阈值。"
  },
  {
    "kind": "task",
    "items": [
      "确定 PCR → PCR 2019:14"
    ]
  },
  {
    "kind": "task",
    "items": [
      "确定 c-PCR → 混凝土与水泥"
    ]
  },
  {
    "kind": "ask",
    "q": "核查路径？",
    "options": [
      "独立核查员（逐 EPD 报告）",
      "过程认证（GPI 5.0.1）"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "task",
    "items": [
      "设置路径修饰 — 期望有核查员报告"
    ]
  },
  {
    "kind": "think",
    "text": "阶段 1 — 解析 EPD 和支撑文件，再对照源 PDF 抽查解析器漏掉了什么。"
  },
  {
    "kind": "task",
    "items": [
      "解析 concrete_C30_EPD.pdf — 18 页"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取抬头 — 声明单位、PCR 引用、有效期"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — A1 raw materials"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — A2 transport"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — A3 manufacturing"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — A4 transport to site"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — A5 installation"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — C1 deconstruction"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — C2 transport"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — C3 waste processing"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — C4 disposal"
    ]
  },
  {
    "kind": "task",
    "items": [
      "读取模块 — D reuse/recovery"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — GWP-total"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — GWP-fossil"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — GWP-biogenic"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — GWP-luluc"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — ODP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — AP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — EP-freshwater"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — EP-marine"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — EP-terrestrial"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — POCP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — ADP-minerals/metals"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — ADP-fossil"
    ]
  },
  {
    "kind": "task",
    "items": [
      "提取指标 — WDP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "解析数据质量附录（各模块 DQI）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "解析情景附录 — A4 运输、C 末端"
    ]
  },
  {
    "kind": "say",
    "text": "解析器漏了 C 模块表——p.12–13 是扫描图。从源文件重读。"
  },
  {
    "kind": "task",
    "items": [
      "OCR p.12–13 → 恢复 C2–C4 数值"
    ]
  },
  {
    "kind": "task",
    "items": [
      "写入 extracted/epd_data.json + parser_gaps.md"
    ]
  },
  {
    "kind": "say",
    "text": "解析置信度 高。13 指标 × 11 模块已捕获，1 处缺口已恢复。"
  },
  {
    "kind": "think",
    "text": "阶段 2 — 把十二个检查组作为并发 worker 派出。每个写一份发现文件和一份推理便签，便于后续审核者复核。"
  },
  {
    "kind": "task",
    "items": [
      "派发 Group A — 格式与完整性"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group B — PCR 2019:14 符合性"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group C — EN 15804+A2 模块与指标"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group D — LCA 方法学与边界"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group E — 数据质量（DQI）与代表性"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group F — 影响值合理性"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group G — 核查员溯源与报告"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group H — 生物质碳核算"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group I — 分配与截断"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group J — 跨 EPD 同类对比"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group K — 单位与参考流一致性"
    ]
  },
  {
    "kind": "task",
    "items": [
      "派发 Group L — 情景（SF）假设"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group A → 通过"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group B → 通过"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group C → 1 严重"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group D → 通过"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group E → 1 警告"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group F → 转阶段 3"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group G → 通过"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group H → 通过"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group I → 1 提示"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group J → 转阶段 3"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group K → 通过"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Group L → 1 提示"
    ]
  },
  {
    "kind": "say",
    "text": "Group C：A1 模块缺 GWP-biogenic——A2 下为强制项。严重。"
  },
  {
    "kind": "say",
    "text": "Group E：水泥数据集是 ecoinvent 3.7（2020），已被 3.12 取代。警告。"
  },
  {
    "kind": "say",
    "text": "Group I：矿渣副产用 70/30 经济分配，而 PCR 要求物理量低于 1% 阈值时按质量。提示。"
  },
  {
    "kind": "task",
    "items": [
      "收集 12 组输出 + 轨迹文件"
    ]
  },
  {
    "kind": "task",
    "items": [
      "按 schema 校验发现"
    ]
  },
  {
    "kind": "task",
    "items": [
      "阶段 2.5 — 核查员严重度汇总 → tally.json"
    ]
  },
  {
    "kind": "task",
    "items": [
      "合并 → audit_state.json"
    ]
  },
  {
    "kind": "think",
    "text": "阶段 3 — 把声明值对 HiQLCD 参考数据和同类样本做基准比对；标出离群值，但不把「偏高但有解释」当错误。"
  },
  {
    "kind": "task",
    "items": [
      "查询 HiQLCD 参考 — C30 预拌混凝土（CN）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "从注册库拉取同类 EPD #1"
    ]
  },
  {
    "kind": "task",
    "items": [
      "从注册库拉取同类 EPD #2"
    ]
  },
  {
    "kind": "task",
    "items": [
      "从注册库拉取同类 EPD #3"
    ]
  },
  {
    "kind": "task",
    "items": [
      "从注册库拉取同类 EPD #4"
    ]
  },
  {
    "kind": "task",
    "items": [
      "从注册库拉取同类 EPD #5"
    ]
  },
  {
    "kind": "task",
    "items": [
      "从注册库拉取同类 EPD #6"
    ]
  },
  {
    "kind": "task",
    "items": [
      "构建同类样本 → cohort.json"
    ]
  },
  {
    "kind": "task",
    "items": [
      "计算分布（IQR、分位数）→ distributions.json"
    ]
  },
  {
    "kind": "task",
    "items": [
      "离群检查 — GWP-total"
    ]
  },
  {
    "kind": "task",
    "items": [
      "离群检查 — AP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "离群检查 — EP-marine"
    ]
  },
  {
    "kind": "task",
    "items": [
      "离群检查 — POCP"
    ]
  },
  {
    "kind": "task",
    "items": [
      "离群检查 — ADP-fossil"
    ]
  },
  {
    "kind": "say",
    "text": "声明 GWP-total 241 kg CO₂e/m³ 处在第 88 百分位——偏高，但在上须线内。声明的水泥用量能解释。"
  },
  {
    "kind": "task",
    "items": [
      "对比 A1–A3 拆分 vs 同类中位"
    ]
  },
  {
    "kind": "say",
    "text": "A1（水泥）占比高于同类中位 8 个百分点——与声明配比一致，不标记。"
  },
  {
    "kind": "task",
    "items": [
      "重算指标 — 水泥 → ecoinvent 3.12"
    ]
  },
  {
    "kind": "say",
    "text": "重算 GWP-total 为 248 vs 声明 241（+2.9%）——在容差内，记给核查员。"
  },
  {
    "kind": "task",
    "items": [
      "写入 benchmarks/comparison.json"
    ]
  },
  {
    "kind": "ask",
    "q": "1 严重（A1 缺 GWP-biogenic）、1 警告、2 提示。生成报告？",
    "options": [
      "生成 Excel + PDF",
      "只出严重项"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "task",
    "items": [
      "生成 audit_report.xlsx — 按风险分级列发现"
    ]
  },
  {
    "kind": "task",
    "items": [
      "附引用条款 + 证据摘录"
    ]
  },
  {
    "kind": "task",
    "items": [
      "按核查员标记发现 → 表现信号"
    ]
  },
  {
    "kind": "task",
    "items": [
      "渲染 audit_report.pdf（对外）"
    ]
  },
  {
    "kind": "artifact",
    "title": "audit_report.xlsx",
    "desc": "EPD 审核 · 混凝土 C30",
    "lines": [
      "1 严重 · 1 警告 · 2 提示",
      "缺 GWP-biogenic（A1）阻断注册",
      "GWP-total 重算较声明 +2.9%",
      "每条发现都引用 EN 15804+A2 / PCR 条款"
    ]
  }
];

export const ilcdValidationEn = [
  {
    "kind": "user",
    "text": "Validate steel_processes.zip against ILCD before I import it into openLCA — and convert a clean copy to JSON-LD for a colleague who runs openLCA."
  },
  {
    "kind": "think",
    "text": "Parse first to see what's inside, then validate structure, UUID format, required fields, cross-references and exchange directions across all seven dataset types. Import failures almost always trace to a missing exchange direction or a reference pointing at nothing. After it's clean I'll convert ILCD → JSON-LD and re-validate the output, since conversion can introduce its own issues."
  },
  {
    "kind": "say",
    "text": "Parse — detect format and enumerate contents."
  },
  {
    "kind": "task",
    "items": [
      "Detect format → ILCD directory structure"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Unzip steel_processes.zip"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Enumerate processes — 12"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Enumerate flows — 45"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Enumerate flow properties — 8"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Enumerate unit groups — 3"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Enumerate sources — 5"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Enumerate contacts — 4"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Enumerate impact categories — 2"
    ]
  },
  {
    "kind": "say",
    "text": "ILCD package: 12 processes, 45 flows, 8 flow properties, 3 unit groups, 5 sources, 4 contacts, 2 impact categories."
  },
  {
    "kind": "think",
    "text": "Validation — structure, identifiers, required fields, then cross-references, then per-process exchanges."
  },
  {
    "kind": "task",
    "items": [
      "Check XML well-formedness — 34 files"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Attach ILCD schema (jsonschema)"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID format — processes"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID format — flows"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID format — flow properties"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID format — unit groups"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID format — sources"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID format — contacts"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID format — impact categories"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Required fields — processes"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Required fields — flows"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Required fields — flow properties"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Required fields — unit groups"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Required fields — sources"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Required fields — contacts"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Required fields — impact categories"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Cross-ref — flow → flow property"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Cross-ref — flow property → unit group"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Cross-ref — process exchange → flow"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Cross-ref — process → source / contact"
    ]
  },
  {
    "kind": "say",
    "text": "Cross-refs: 2 process exchanges point to flow UUIDs not in the package. Recording as errors."
  },
  {
    "kind": "task",
    "items": [
      "Validate process P01 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P02 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P03 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P04 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P05 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P06 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P07 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P08 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P09 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P10 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P11 — exchanges + directions"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Validate process P12 — exchanges + directions"
    ]
  },
  {
    "kind": "say",
    "text": "Process P07 has two exchanges with no Input/Output direction set — openLCA will reject those on import."
  },
  {
    "kind": "task",
    "items": [
      "Unit consistency — mass, energy, volume"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Reference-flow resolves on every process"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Flow type — elementary vs product"
    ]
  },
  {
    "kind": "say",
    "text": "Validation complete: 3 errors, 5 warnings."
  },
  {
    "kind": "task",
    "items": [
      "ERROR · P07 L142 — reference flow missing unit"
    ]
  },
  {
    "kind": "task",
    "items": [
      "ERROR · P03 L210 — exchange flow UUID not found"
    ]
  },
  {
    "kind": "task",
    "items": [
      "ERROR · P11 L233 — exchange direction unset"
    ]
  },
  {
    "kind": "task",
    "items": [
      "WARNING ×5 — uncertainty / data-source fields blank"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Write validation_report.md"
    ]
  },
  {
    "kind": "ask",
    "q": "3 errors block import. What next?",
    "options": [
      "Show the line-by-line fix list",
      "Convert the valid datasets anyway"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "say",
    "text": "Fix list written. The 5 warnings are optional fields — not blocking, but worth filling for completeness."
  },
  {
    "kind": "think",
    "text": "Now the conversion — ILCD → openLCA JSON-LD, all seven dataset types, then re-validate the output."
  },
  {
    "kind": "task",
    "items": [
      "Convert processes → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Convert flows → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Convert flow properties → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Convert unit groups → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Convert sources → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Convert contacts → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Convert impact categories → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Write olca-schema.json + zip"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Re-parse converted package"
    ]
  },
  {
    "kind": "task",
    "items": [
      "Re-validate JSON-LD output"
    ]
  },
  {
    "kind": "say",
    "text": "Converted package re-validates clean — the 2 missing-flow errors carried over (same source data), the rest mapped 1:1."
  },
  {
    "kind": "artifact",
    "title": "validation_report.md",
    "desc": "ILCD · 34 datasets",
    "lines": [
      "3 errors located by file + line",
      "5 optional-field warnings",
      "Every error has a fix instruction",
      "Fix the 3, re-run, then import"
    ]
  },
  {
    "kind": "artifact",
    "title": "steel_processes.jsonld.zip",
    "desc": "openLCA JSON-LD",
    "lines": [
      "All 7 dataset types converted",
      "Re-validated against olca-schema",
      "Ready for openLCA import",
      "No field silently dropped"
    ]
  }
];

export const ilcdValidationZh = [
  {
    "kind": "user",
    "text": "导入 openLCA 前，把 steel_processes.zip 对着 ILCD 校验一遍——再转一份干净的 JSON-LD 给用 openLCA 的同事。"
  },
  {
    "kind": "think",
    "text": "先解析看清里面有什么，再对七种数据集类型逐项校验：结构、UUID 格式、必填字段、交叉引用、交换方向。导入失败几乎都出在交换方向缺失、或引用指向了不存在的对象。校验干净后我把 ILCD → JSON-LD 转出来再重校一遍——转换本身也可能引入问题。"
  },
  {
    "kind": "say",
    "text": "解析 — 识别格式并枚举内容。"
  },
  {
    "kind": "task",
    "items": [
      "识别格式 → ILCD 目录结构"
    ]
  },
  {
    "kind": "task",
    "items": [
      "解压 steel_processes.zip"
    ]
  },
  {
    "kind": "task",
    "items": [
      "枚举过程 — 12"
    ]
  },
  {
    "kind": "task",
    "items": [
      "枚举流 — 45"
    ]
  },
  {
    "kind": "task",
    "items": [
      "枚举流属性 — 8"
    ]
  },
  {
    "kind": "task",
    "items": [
      "枚举单位组 — 3"
    ]
  },
  {
    "kind": "task",
    "items": [
      "枚举来源 — 5"
    ]
  },
  {
    "kind": "task",
    "items": [
      "枚举联系人 — 4"
    ]
  },
  {
    "kind": "task",
    "items": [
      "枚举影响类别 — 2"
    ]
  },
  {
    "kind": "say",
    "text": "ILCD 包：12 过程、45 流、8 流属性、3 单位组、5 来源、4 联系人、2 影响类别。"
  },
  {
    "kind": "think",
    "text": "校验 — 结构、标识符、必填字段，再交叉引用，再逐过程交换。"
  },
  {
    "kind": "task",
    "items": [
      "检查 XML 良构性 — 34 个文件"
    ]
  },
  {
    "kind": "task",
    "items": [
      "挂载 ILCD schema（jsonschema）"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID 格式 — 过程"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID 格式 — 流"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID 格式 — 流属性"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID 格式 — 单位组"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID 格式 — 来源"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID 格式 — 联系人"
    ]
  },
  {
    "kind": "task",
    "items": [
      "UUID 格式 — 影响类别"
    ]
  },
  {
    "kind": "task",
    "items": [
      "必填字段 — 过程"
    ]
  },
  {
    "kind": "task",
    "items": [
      "必填字段 — 流"
    ]
  },
  {
    "kind": "task",
    "items": [
      "必填字段 — 流属性"
    ]
  },
  {
    "kind": "task",
    "items": [
      "必填字段 — 单位组"
    ]
  },
  {
    "kind": "task",
    "items": [
      "必填字段 — 来源"
    ]
  },
  {
    "kind": "task",
    "items": [
      "必填字段 — 联系人"
    ]
  },
  {
    "kind": "task",
    "items": [
      "必填字段 — 影响类别"
    ]
  },
  {
    "kind": "task",
    "items": [
      "交叉引用 — 流 → 流属性"
    ]
  },
  {
    "kind": "task",
    "items": [
      "交叉引用 — 流属性 → 单位组"
    ]
  },
  {
    "kind": "task",
    "items": [
      "交叉引用 — 过程交换 → 流"
    ]
  },
  {
    "kind": "task",
    "items": [
      "交叉引用 — 过程 → 来源 / 联系人"
    ]
  },
  {
    "kind": "say",
    "text": "交叉引用：2 条过程交换指向包内不存在的流 UUID。记为错误。"
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P01 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P02 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P03 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P04 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P05 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P06 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P07 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P08 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P09 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P10 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P11 — 交换 + 方向"
    ]
  },
  {
    "kind": "task",
    "items": [
      "校验过程 P12 — 交换 + 方向"
    ]
  },
  {
    "kind": "say",
    "text": "过程 P07 有两条交换未设 Input/Output 方向——openLCA 导入时会拒收。"
  },
  {
    "kind": "task",
    "items": [
      "单位一致性 — 质量、能量、体积"
    ]
  },
  {
    "kind": "task",
    "items": [
      "每个过程的参考流均可解析"
    ]
  },
  {
    "kind": "task",
    "items": [
      "流类型 — 基本流 vs 产品流"
    ]
  },
  {
    "kind": "say",
    "text": "校验完成：3 个错误、5 个警告。"
  },
  {
    "kind": "task",
    "items": [
      "ERROR · P07 L142 — 参考流缺单位"
    ]
  },
  {
    "kind": "task",
    "items": [
      "ERROR · P03 L210 — 交换流 UUID 找不到"
    ]
  },
  {
    "kind": "task",
    "items": [
      "ERROR · P11 L233 — 交换方向未设"
    ]
  },
  {
    "kind": "task",
    "items": [
      "WARNING ×5 — 不确定度 / 数据来源字段为空"
    ]
  },
  {
    "kind": "task",
    "items": [
      "写入 validation_report.md"
    ]
  },
  {
    "kind": "ask",
    "q": "3 个错误会阻断导入。下一步？",
    "options": [
      "给出逐行修复清单",
      "先转换有效的数据集"
    ],
    "pick": [
      0
    ]
  },
  {
    "kind": "say",
    "text": "修复清单已生成。5 个警告是可选字段——不阻断，但补全更完整。"
  },
  {
    "kind": "think",
    "text": "接着是转换——ILCD → openLCA JSON-LD，七种类型全转，再重校输出。"
  },
  {
    "kind": "task",
    "items": [
      "转换过程 → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "转换流 → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "转换流属性 → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "转换单位组 → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "转换来源 → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "转换联系人 → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "转换影响类别 → JSON-LD"
    ]
  },
  {
    "kind": "task",
    "items": [
      "写入 olca-schema.json + 打包"
    ]
  },
  {
    "kind": "task",
    "items": [
      "重新解析转换后的包"
    ]
  },
  {
    "kind": "task",
    "items": [
      "重校 JSON-LD 输出"
    ]
  },
  {
    "kind": "say",
    "text": "转换后的包重校通过——2 个缺流错误沿用过来了（源数据相同），其余 1:1 映射。"
  },
  {
    "kind": "artifact",
    "title": "validation_report.md",
    "desc": "ILCD · 34 个数据集",
    "lines": [
      "3 个错误按文件 + 行号定位",
      "5 个可选字段警告",
      "每个错误都附修复说明",
      "改完 3 个，重跑，再导入"
    ]
  },
  {
    "kind": "artifact",
    "title": "steel_processes.jsonld.zip",
    "desc": "openLCA JSON-LD",
    "lines": [
      "7 种数据集类型全部转换",
      "已对 olca-schema 重校",
      "可直接导入 openLCA",
      "无字段被静默丢弃"
    ]
  }
];
