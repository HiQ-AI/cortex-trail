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
