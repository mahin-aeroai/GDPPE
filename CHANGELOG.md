# GDPPE Schema — Change Log

All notable changes to the GDPPE entity schema, tracked chapter by chapter.

## Phase 2 — Third category: Digital Cutting (3 machines), validator extended
- Added `database/digital_cutting_pilot/`: Zünd G3 M-2500, Esko Kongsberg X24, Summa F1612 — first category with no printhead, ink, or curing/drying step at all
- **`scripts/validate_database.py` extended with native `Tool_Modules.csv`/`USES_TOOL_MODULE` support** — exactly the scenario `CONTRIBUTING.md` anticipated when it said "if a category needs Tool_Modules.csv instead of Printheads.csv, extend the checks rather than writing a separate script." Fixed a real bug in the process: the manufacturer-reference check for tool modules was originally added after the manufacturer check had already run, making it dead code — caught and corrected before commit.
- **`scripts/validate_database.py` gained enum validation** (`check_enum_values()`), checking `governance_tier` against its 5 known values, not just referential integrity. Added after a CSV-escaping bug (extra comma shifting a resolution note into the `governance_tier` column) went undetected by referential checks alone.
- **Running the upgraded validator against the two already-committed categories retroactively found 7 more instances of the same bug** — 6 in `uv_printing_pilot`, 1 in `latex_printing_pilot` — sitting in already-pushed data since earlier sessions. All 7 fixed in this pass. This is the clearest demonstration yet of why improving the validator has value beyond the data it's built alongside.
- **Finding**: cutting speed is reported in linear units (mm/s, m/min) across all 3 sources, not area-per-hour like the printing categories — a genuine structural difference already anticipated by `schema/data_dictionary.md`'s unit table, requiring no schema change, just the expected field-naming choice (`max_speed_xy` vs. printing's generic `max_speed`).

## v0.20 — UVCuringType resolved to Arc_Lamp | LED_Lamp
- **Domain correction**: the original 5-value `UVCuringType` vocabulary (LED, Mercury, Hybrid, UV_Gel, Not_Applicable) conflated three different kinds of error. Resolved to exactly two values: `Arc_Lamp | LED_Lamp`.
  - `Mercury` folded into `Arc_Lamp` (mercury-vapor is the standard arc-lamp implementation, not a separate mechanism)
  - `Hybrid` removed — a machine with both lamp types gets two `FieldValue` records, not a third enum value
  - `UV_Gel` removed — that's an ink chemistry, already correctly present in `InkType`; it was a category error to have duplicated it here
  - `Not_Applicable` removed from this vocabulary specifically — if UV curing doesn't apply (e.g. latex's thermal drying), the field is simply absent, not populated with a UV-specific sentinel
- This also resolves the open question flagged during the Latex pilot about whether `UVCuringType` should be renamed to cover non-UV drying too: **no** — it stays narrowly scoped, and `drying_technology` remains its own separate field for thermal-drying categories.
- Updated all 8 UV Printing pilot machines' `curing_technology_type` from `LED` to `LED_Lamp` — no data was factually wrong, just needed to match the corrected vocabulary spelling.

## Phase 2 — Second category: Latex Printing (3 machines)
- Added `database/latex_printing_pilot/`: HP Latex 700W, R530, and 1500 — first cross-category test of the schema (previously only UV Printing had real data)
- **Schema gap found, not yet fixed**: the `UVCuringType` controlled vocabulary (LED/Mercury/Hybrid/UV_Gel/Not_Applicable) doesn't accommodate latex's thermal drying process. Worked around with a new `drying_technology` free-text field for this pilot; a real fix (renaming to a technology-neutral `CuringDryingType` vocabulary, or splitting UV curing and thermal drying into genuinely separate fields) needs a decision before a third category surfaces the same gap again.
- **Finding**: this category has only one manufacturer (HP) — true latex ink chemistry is HP-proprietary. Confirmed the schema handles single-manufacturer categories without breaking, but cross-manufacturer relationships (`CompanyRelationship`, `COMPETES_WITH`) are largely inapplicable here.
- `scripts/validate_database.py` caught two real CSV-escaping bugs during construction (unquoted commas inside parenthetical values shifted subsequent columns) — fixed before commit. Separately, two unsourced inferences (`COMPETES_WITH` between two of HP's own products, a fabricated printhead lineage claim) were caught by manual review, not the validator, and removed per `CONTRIBUTING.md`.

## Process formalization — CONTRIBUTING.md and generic validator
- Added `CONTRIBUTING.md` — formalizes the data-integrity workflow that emerged from the fabrication incident during the pilot widening: source everything in-session, run the validator before every commit, never guess.
- Generalized `scripts/validate_pilot.py` → `scripts/validate_database.py` — now works against any category folder following the standard file-naming convention, not just `uv_printing_pilot`. Adding a second category (Latex, Digital Cutting, etc.) gets integrity checking for free without touching the script.
- Updated `README.md` and `database/uv_printing_pilot/README.md` to close out the "validation script is a gap" note, since it's now built and enforced.

## Phase 2 — UV Printing pilot widened to 8 machines
- Added 4 more real, sourced UV printers: Agfa Jeti Tauro H3300 LED, swissQprint Nyala 5, Roland VersaUV LEJ-640FT, HandTop HT2512UV — now spans 3 of 5 `Manufacturer.market_tier` values (Global Premium down to Industrial Value)
- **Caught and removed fabricated content** during this expansion: an invented "Agfa H3300 UHS" variant with a made-up source article, and an entire "Flora Q25" entry for a manufacturer never actually researched. Neither had a corresponding search in the session that produced it. Full details in `database/uv_printing_pilot/README.md`.
- Added `scripts/validate_database.py` — automated referential-integrity checker (source_id, manufacturer_id, family_id, printhead_id, rip_id, UEID cross-references). Explicitly documented as checking structure only, not truth — catching a fabricated-but-internally-consistent record still requires human review against actual search results.
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
