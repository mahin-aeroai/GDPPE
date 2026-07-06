# GDPPE Schema — Change Log

All notable changes to the GDPPE entity schema, tracked chapter by chapter.

## Phase 2 — Aqueous / Inkjet Printing pilot (5 machines)
- Added `database/aqueous_inkjet_printing_pilot/`: 5 real, sourced water-based inkjet printers — Canon PIXMA PRO-200, Canon imagePROGRAF PRO-4600, HP DesignJet T950, Epson SureColor P8570DL, HP PageWide XL 5200. Every spec value traces to a source fetched in the same session (15 sources).
- **Two new controlled vocabularies** (aqueous is broad enough to need two axes): `InkSubtype` (Dye | Pigment) and `PrintArchitecture` (Scanning_Carriage | Pagewide_Array). Both registered in `schema/data_dictionary.md`.
- **Both axes deliberately exercised, not uniform:** the PIXMA PRO-200 is the sole dye machine (honest to the market — dye is now a desktop-photo niche), and the PageWide XL 5200 is the sole pagewide-array machine (the rest scan). Minority values included on purpose so the columns aren't single-valued.
- **Spans all three application segments** — photo/fine-art, CAD/technical, production — which are rated in different units (per-print seconds, sqft/hr, A1 pages/hr, pages/min). Captured faithfully rather than forced to a common metric; the T950 also carries a CAD-only line-accuracy spec (±0.1%).
- Mode-dependent production speeds preserved as conflicts (Epson 361 vs 1571 sqft/hr; PageWide 20 pages/min vs ~400 m2/hr).
- Frontend updated to show the 7th category.
- Full referential integrity + uniqueness verified via `scripts/validate_database.py`.

## Phase 2 — Dye-Sublimation Printing pilot (5 machines)
- Added `database/dye_sublimation_printing_pilot/`: 5 real, sourced dye-sublimation printers — Sawgrass SG1000 (desktop), Epson SureColor F6470, Roland Texart RT-640, Mimaki TS330-1600, Durst P5 TEX iSUB. Every spec value traces to a source fetched in the same session (15 sources).
- **Scoped by the sublimation workflow, not ink** — dye-sub ink is uniformly disperse-dye, so the distinguishing axis is how the image reaches the fabric.
- **New controlled vocabulary `SublimationWorkflow`** (Transfer | Direct | Dual). Registered in `schema/data_dictionary.md`. Durst P5 TEX iSUB additionally captures inline (contactless) fixation — direct-to-fabric with no separate calender.
- **Widest tier spread of any pilot:** a desktop unit rated in prints/hr and page sizes (Sawgrass, 11x17 in) up to a 3.3 m industrial press at 383 m2/hr (Durst) — ~1000x throughput range in one category, stress-testing the speed/size fields.
- Mode-dependent speeds and colour-count options preserved as conflicts throughout (7 conflicts kept).
- Frontend updated to show the 6th category.
- Full referential integrity + uniqueness verified via `scripts/validate_database.py`.

## Phase 2 — Solvent / Eco-Solvent Printing pilot (5 machines)
- Added `database/solvent_ecosolvent_printing_pilot/`: 5 real, sourced wide-format solvent sign printers — Epson SureColor S80600 & S60600, Roland VersaEXPRESS RF-640, Mimaki CJV300-160 Plus, Mutoh ValueJet VJ-1638X. All four major sign-printer OEMs represented. Every spec value traces to a source fetched in the same session (16 sources).
- **Ink-chemistry scoped across the solvent gradient** (True → Eco → Mild), not a single ink type.
- **New controlled vocabulary: two-field solvent model** — `SolventType` (True_Solvent | Eco_Solvent | Mild_Solvent) + `SolventInkLine` (UltraChrome_GS3 | Eco_Sol_MAX_2 | SS21 | Eco_Ultra_UMS). Registered in `schema/data_dictionary.md`. Same split rationale as the toner TonerType/TonerChemistry pair.
- **New field `ventilation_requirement`** — first category where workplace ventilation / VOC handling is a real sourced spec (Epson markets 'no special ventilation required' vs legacy true-solvent that needed extraction).
- **`InkType` enum gap flagged:** mild-solvent machines record `ink_type=Eco_Solvent` (nearest existing value) with `SolventType=Mild_Solvent` carrying the finer distinction; a future pass may add `Mild_Solvent` to `InkType`.
- **Documented sourcing gap:** the Chinese industrial-value true-solvent tier (Konica 512i/1024i white-label machines, ~65% of global production by one trade estimate) is deliberately absent — it has no authoritative manufacturer spec source, only reseller listings. Logged as a known gap rather than fabricated from Tier-8/9 pages.
- Frontend updated to show the 5th category.
- Full referential integrity + uniqueness verified via `scripts/validate_database.py`.

## Phase 2 — Toner / Electrophotographic Printing pilot (6 machines)
- Added `database/toner_electrophotographic_pilot/`: 6 real, sourced production electrophotographic presses — HP Indigo 100K, Xerox iGen 5, Canon imagePRESS V1350, Konica Minolta AccurioPress C14000, Ricoh Pro C9500, Xerox Versant 4100. Every spec value traces to a source fetched in the same working session (18 sources).
- **Category scoped by imaging technology, not market segment.** The Canon varioPRINT iX3200 was researched but deliberately excluded — it competes head-to-head in the production cut-sheet market but is sheetfed *inkjet*, not electrophotographic. It belongs in a future Production Inkjet category. Keeps the scoping axis consistent with UV and Latex (both technology-scoped).
- **New controlled vocabulary: two-field toner model** — `TonerType` (closed: Dry_Toner | Liquid_Toner) + `TonerChemistry` (open: ElectroInk | EA | CV | Simitri_V | PxP). Registered in `schema/data_dictionary.md`. Same mechanism-vs-implementation split as UV's curing-type/lamp separation. Market skew captured honestly: 1 liquid-toner machine vs 5 dry (liquid toner is effectively HP-exclusive via LEP).
- **DFEs modelled as `RIP_Software`, not a new table.** A production toner press's Digital Front End (Fiery, FreeFlow, PRISMAsync, SmartStream) *is* its RIP/print-server, so DFEs are recorded in the existing `RIP_Software.csv` and wired via `REQUIRES_SOFTWARE` — no new component table, no validator edit, per the schema's "convention gets integrity checking for free" principle.
- Real spec conflicts preserved rather than silently resolved: HP Indigo 100K speed (mode-dependent 6000/4600/4500/2250 sph), Canon V1350 resolution (2400 engine vs 1200 controller), KM C14000 resolution (equiv-dpi ordering variance across sources), Ricoh C9500 speed (115 standard vs 135 with upgrade kit).
- Full referential integrity verified across all 7 CSVs via `scripts/validate_database.py`.
- **Documentation-drift note:** in bringing the docs up to date for this pilot, found that the earlier **Latex Printing** and **Digital Cutting** pilots were committed without their own CHANGELOG entries or data-dictionary updates — the docs had drifted two categories behind the data. Neither introduced a *formal controlled vocabulary* (their distinguishing fields are free-text/numeric, not enums), so no data-dictionary backfill is strictly required, but their pilot additions remain unlogged here. Flagged for a future cleanup pass rather than silently backfilled with reconstructed detail.

## Phase 2 — UV Printing pilot widened to 8 machines
- Added 4 more real, sourced UV printers: Agfa Jeti Tauro H3300 LED, swissQprint Nyala 5, Roland VersaUV LEJ-640FT, HandTop HT2512UV — now spans 3 of 5 `Manufacturer.market_tier` values (Global Premium down to Industrial Value)
- **Caught and removed fabricated content** during this expansion: an invented "Agfa H3300 UHS" variant with a made-up source article, and an entire "Flora Q25" entry for a manufacturer never actually researched. Neither had a corresponding search in the session that produced it. Full details in `database/uv_printing_pilot/README.md`.
- Added `scripts/validate_pilot.py` — automated referential-integrity checker (source_id, manufacturer_id, family_id, printhead_id, rip_id, UEID cross-references). Explicitly documented as checking structure only, not truth — catching a fabricated-but-internally-consistent record still requires human review against actual search results.
- HandTop HT2512UV is the first pilot machine with no official-manufacturer datasheet found at all — every spec traces to a single Tier-2 dealer page, recorded at Medium confidence throughout. Real test of the tier-priority model at the low end of documentation quality.

## Phase 2 kickoff — UV Printing pilot dataset (4 machines)
- Added `database/uv_printing_pilot/`: 4 real, sourced UV flatbed/hybrid printers (Canon Arizona 2380 GTF, EFI Pro 30f+, Durst P5 350 HS, Mimaki JFX200-2513 EX) — first real-data test of the schema
- Validated: `CategoryTemplate` field list for UV Printing holds up against real manufacturer specs; conflicting-value model correctly captured two genuine real-world discrepancies (Canon speed rating, Mimaki speed rating) and resolved them per the schema's own tier-priority rules
- Confirmed discipline: unconfirmed facts (EFI/Mimaki exact launch years, Ricoh founding year) recorded as `Under_Verification`, not guessed
- Full referential integrity verified across all 7 CSV files (UEIDs, manufacturer_ids, source_ids all cross-check cleanly)

## v0.19 — Category count decision: CLOSED
- **Resolved permanently at 17 categories.** Two detailed breakdowns exist (Ch.3: 18, Ch.10: 17) and are identical except for one entry — Ch.3 includes "Industrial Ink Systems" as its own category, Ch.10 folds ink into each printing category's engineering section instead.
- Decision: 17 categories stands. `Ink` remains a full entity with its own controlled vocabulary (`InkType`) but no standalone `TaxonomyNode`/category code, since ink chemistry is intrinsically category-specific (unlike Printheads/RIP/Media, which are genuinely cross-category shared components).
- This closes the question raised in v0.3, reopened/resolved in v0.10, and challenged again in v0.16/v0.17. Full reasoning recorded in `schema/schema.md`'s header.

## v0.18 — Project Roadmap memo
- New: `KnownIssue`, `TroubleshootingEntry`, `MaintenanceRecommendation` entities (Roadmap Phase 5 — failure modes, service bulletins, troubleshooting, known upgrades)
- New: `Service_Bulletin` added to `DataSource.source_type`
- Note: source document reveals full spec runs to ~40 chapters; confirmed Phases 6–11 of the roadmap map onto existing structures without changes

## v0.17 — Ch.17: Data Governance, Editorial Policies, Research Ethics
- New: `Contributor` entity (roles, conflict-of-interest disclosure) — replaces bare name strings across the schema
- New: `RecordGovernance` (record owner, technical reviewer, editorial reviewer, last editor) per Machine/Manufacturer
- New: two lifecycle stages — `Monitored`, `Historical`
- Changed: `ChangeLogEntry.proposed_by` extended to 3 values (`Internal_Researcher | Community_Contributor | AI`)
- Flagged: category count contradiction resurfaced a third time (18 vs. 17) — needs explicit resolution

## v0.16 — Ch.16: Implementation Roadmap, Development Architecture, Project Governance
- New: `review_status` on `EditorialReview`/`ComparisonReport` (Draft → ... → Published → Archived), independent of `Machine.lifecycle_stage`
- Clarified: 5-phase database rollout (Excel/CSV → Postgres → Neo4j → Elasticsearch → Vector DB); Elasticsearch and vector DB confirmed as two distinct search layers
- Flagged: category count contradiction (18 vs. 17) resurfaced

## v0.15 — Ch.15: AI, Semantic Search, Recommendation Engine
- Changed: `governance_tier` extended to 5 values — added `Industry_Practice`
- New: `ChangeLogEntry.proposed_by`/`approval_status` — Human-in-the-Loop gating for AI-suggested edits
- Confirmed: Hybrid Search Architecture independently validates the Ch.16 stack split (keyword/structured/vector/graph)

## v0.14 — Ch.14: Knowledge Graph, Relationship Mapping
- New: Edge Provenance (`RelationshipProvenance`) — every relationship now carries source/confidence/date-verified, not just node attributes
- New: `ConfigurationOption`, `Installation` (optional, privacy-gated) entities
- New: `Machine -[COMPATIBLE_WITH]-> Machine`, Printhead lineage (`predecessor_printhead_id`/`successor_printhead_id`)
- Changed: `CompanyRelationship` extended with `product_line_id` and `ProductLine_Transfer` type

## v0.13 — Ch.13: Comparison Framework, Benchmarking
- New: `EngineeringScorecard`, `ApplicationSuitability`, `TCOProfile`, `ComparisonReport` entities
- New: Sustainability added as a 14th engineering domain
- Confirmed: `Manufacturer.market_tier` matches Ch.13's Competitive Positioning example exactly

## v0.12 — Ch.12: Engineering Page Design Standards
- New: `EditorialReview` entity — Design Philosophy / Mechanical Construction / Production Performance / Reliability / Best Use Cases / Considerations
- Changed: `Historical Event` formalized with a typed event vocabulary
- Changed: `DataSource.source_type` extended (ICC_Profile, Template, White_Paper, Release_Notes)

## v0.11 — Ch.11: HTML Information Architecture & UX
- Changed: `governance_tier` extended to 4 values — added `AI_Generated_Explanation`
- New: `searchable`/`filterable` flags on `CategoryTemplate` field definitions
- Confirmation pass: IA/UX requirements mapped onto existing entities without new structures (see §3b coverage table)

## v0.10 — Ch.10: Engineering Data Collection Standards
- **Category count resolved to 17** (from 18) — Ch.10's category-by-category list demoted Ink Systems from a standalone category to a cross-cutting entity
- New: Research Level (1–4 priority tiers), Engineering Domains (13-domain controlled list), Availability Class (P/D/M/F/E), `CategoryCompletenessMatrix`

## v0.9 — Ch.9: Technical Data Dictionary, Units, Terminology
- New: `data_type` field on `FieldValue`; original/converted value pair for unit conversion
- New: Preferred term / synonym system; 4 controlled vocabularies
- Reconciled: `machine_status` (kept Ch.5's 8-value version over Ch.9's incomplete 6-value restatement); missing-data sentinels merged to a 6-value superset

## v0.8 — Ch.8: Technology-Specific Research Templates
- **Major architecture change**: Machine's technical fields split into Section A (universal) + Section B (category-driven via new `CategoryTemplate` entity)
- New: `TechnologyMilestone` entity

## v0.7 — Ch.7: Research Sources, Documentation Standards
- Changed: source tier scale expanded from 6 to 9
- New: image/video sub-fields on `DataSource`; `ReviewSchedule` object; missing-data vocabulary expanded to 4 values

## v0.6 — Ch.6: Master Research Database Architecture
- New: `Tool Module` entity
- New: unit standard, data governance tier (`Public_Verifiable | Editorial_Content | Internal_Research_Note`), 19-sheet workbook mapping

## v0.5 — Ch.5: Master Equipment Index & Machine Identification
- New: UEID primary key scheme; lifecycle stages; full 8-value `machine_status` enum
- New: Regional Variant relationship; Excel Master Index column mapping

## v0.4 — Ch.4: Global Manufacturer Directory
- Changed: `Manufacturer` expanded into a full corporate profile (6-class taxonomy, geography, market tier, completeness score)
- New: `CompanyRelationship` entity

## v0.3 — Ch.3: Global Equipment Taxonomy & Classification
- New: `TaxonomyNode` self-referencing hierarchy; 18-category list (later revised to 17 in v0.10)

## v0.2 — Ch.2: Research Methodology & Data Collection Framework
- New: `FieldValue` (per-field provenance), `DataSource`, `ChangeLogEntry`, `ResearchStatus`, `OEMPlatform` entities

## v0.1 — Initial schema
- Baseline entity/relationship model derived from Chapter 1 (vision/objectives)
