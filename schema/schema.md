# GDPPE Entity Schema v0.19
### Global Digital Print Production Equipment Encyclopedia — Data Model
*v0.2: Ch.2 research methodology. v0.3: Ch.3 classification taxonomy. v0.4: Ch.4 Manufacturer Directory. v0.5: Ch.5 Master Equipment Index. v0.6: Ch.6 physical architecture. v0.7: Ch.7 source standards. v0.8: Ch.8 Technology-Specific Templates. v0.9: Ch.9 Data Dictionary. v0.10: Ch.10 Engineering Data Collection Standards. v0.11: Ch.11 HTML IA/UX. v0.12: Ch.12 Page Design Standards. v0.13: Ch.13 Comparison/Benchmarking. v0.14: Ch.14 Knowledge Graph. v0.15: Ch.15 AI Architecture. v0.16: Ch.16 Implementation Roadmap. v0.17: Ch.17 Governance/Ethics. v0.18: Project Roadmap memo. v0.19: **Category count decision — CLOSED.**

> ## Category Count: RESOLVED at 17 (final, v1.0-schema baseline)
>
> Two detailed, worked category breakdowns exist in the source material — Ch.3 §3.3 (18 categories) and Ch.10 §10.5 (17 categories) — and every other mention across the doc set ("17" in Ch.6/Ch.8-intro, "18" in Ch.16/Ch.17-appendix) is a casual restatement of one or the other, not independent evidence. Comparing the two detailed lists directly: **they are identical except for one entry** — Ch.3 includes "Industrial Ink Systems" as its own category (between Printheads and RIP Software); Ch.10 omits it entirely, folding ink into each printing category's own engineering section instead. Everything else — including keeping CNC Routing and Laser Systems split — matches across both lists.
>
> **Decision: 17 categories. `Ink` remains a full entity with its own field set and controlled vocabulary (`InkType`), but does not get a standalone `TaxonomyNode` / category code.**
>
> Reasoning:
> 1. Ch.10 is the chapter whose entire purpose is enumerating categories precisely for research use — its omission of Ink is far more likely deliberate than an oversight, especially since it's careful to keep CNC/Laser split (the more tempting place to cut a category if someone were just padding toward a target number).
> 2. There's a structural argument independent of which chapter is "more authoritative": Printheads, RIP, and Media are **cross-category shared components** — a specific printhead or RIP exists independently of which printer category uses it, which is exactly why they earn their own taxonomy slot. Ink doesn't work that way — UV ink and eco-solvent ink aren't the same concept wearing different labels; ink chemistry is intrinsically tied to its printing category. Folding it into each category's own "Ink System" engineering section (which is what Ch.8's field lists already do for UV/Latex/Eco-Solvent/Textile) is the more defensible design on its own merits, not just the majority-vote outcome.
>
> This closes the question raised in v0.3, reopened in v0.10 (resolved to 17), and challenged again in v0.16/v0.17 (18). No further re-litigation unless a future chapter provides comparably detailed, direct evidence — a passing mention of "18" in an objectives list or appendix title does not meet that bar.

---

## 1. Entity Types (36 core types + 1 new engineering domain, not a full entity — see row 30)

| # | Entity | What it represents |
|---|---|---|
| 1 | **Machine** *(primary key note — see §2a; technical fields note — see §3)* | A specific commercial model of digital print production equipment, keyed by the Ch.5 §5.4 **Universal Equipment Identifier (UEID)**, e.g. HP Latex 700, Epson SureColor S80600 |
| 2 | **Manufacturer** *(expanded — see §1a)* | Full corporate profile per Ch.4 §4.6, not just a name — classified into 6 classes (§4.3), tagged with geography (§4.4) and market tier (§4.5) |
| 3 | **OEM Platform** | The underlying physical machine when the same platform is sold under multiple commercial names — per Ch.2 §2.11 |
| 4 | **Company Relationship** | Acquisition, JV, OEM-manufacturing, licensing, distribution, private-label — per Ch.4 §4.7 |
| 5 | **Taxonomy Node** | Self-referencing hierarchy: `Production Technology → Category → Equipment Type` (Ch.3 §3.2) |
| 6 | **Category Template** | Defines the Section-B engineering field groups for one `TaxonomyNode` category (17 of them, per Ch.10 §10.5's resolved count) — now also carrying research-level priority, availability class, engineering-domain tags, and a per-category `CategoryCompletenessMatrix` — see §3a |
| 7 | **Technology Milestone** *(new)* | Category-level historical timeline entry (e.g. "UV curing: Mercury → LED"), per Ch.8 §8.6 — distinct from machine/manufacturer-level `Historical Event` |
| 8 | **Printhead** | The physical printing component (Ricoh Gen5, Kyocera KJ4B, Konica Minolta 1024i...) |
| 9 | **Printhead Manufacturer** | Links to `Manufacturer` — often distinct from the machine OEM |
| 10 | **Ink / Consumable System** | UV, latex, solvent, dye-sub, aqueous pigment, etc. |
| 11 | **Substrate / Material** | Vinyl, textile, rigid board, canvas, film (Ch.3 Category 17) |
| 12 | **RIP / Software Platform** | Onyx, Caldera, EFI Fiery, proprietary RIPs (Ch.3 Category 16, Ch.4 Class E) |
| 13 | **Curing/Drying Technology** | UV-LED, thermal, IR, forced air |
| 14 | **Finishing Equipment** | Cutters, welders, laminators, trimmers, CNC/laser systems — Ch.3 Categories 6–13 |
| 15 | **Tool Module** | Sub-component of a Finishing Equipment machine, esp. digital cutters — Ch.6 Sheet 10: UCT, EOT, POT, KCT, VCT, Router, Creasing wheel |
| 16 | **Product Line / Series** | Groups machine generations (e.g. "HP Latex 700 series" spans 700/730/750) |
| 17 | **Application / Industry Use Case** | Signage, textile, packaging, décor, industrial, apparel |
| 18 | **Standard / Certification** | CE, FCC, UL, ISO, Energy Star, RoHS, REACH |
| 19 | **Distributor / Service Network** | Regional dealer/service org |
| 20 | **Historical Event** *(now typed — Ch.12 §12.19)* | Launch, Major_Revision, Firmware_Update, Software_Update, Replacement, Discontinuation, Acquisition, Rebrand — machine/manufacturer-level timeline entry (see #7 for category-level) |
| 26 | **Editorial Review** | Structured engineer-written review per Ch.12 §12.17 — Design Philosophy / Mechanical Construction / Production Performance / Reliability / Best Use Cases / Considerations, always `governance_tier = Editorial_Content`; now also carries the Ch.13 §13.6 `EngineeringScorecard` — see §3a |
| 27 | **Application Suitability** *(new)* | Machine ↔ Application rating junction (Ch.13 §13.3 Type 5, §13.11) — 1-5 star scale, with Excellent/Very Good/.../Not Recommended as display labels over the same scale |
| 28 | **TCO Profile** *(new)* | Total Cost of Ownership factors per machine (Ch.13 §13.10) — capital, installation, power, consumables, maintenance, spares, service contracts, training, downtime, expected service life, each individually sourced/dated |
| 29 | **Comparison Report** *(new)* | Multi-machine structured comparison document (Ch.13 §13.14) — Executive Summary through Source References, distinct from a single-machine `EditorialReview` |
| 30 | **Sustainability Data** *(new domain, not new entity — see §3a)* | Energy consumption, VOC emissions, water use, recyclability, environmental certifications — verified `FieldValue`s under a new "Sustainability" engineering domain, distinct from `EditorialReview`'s qualitative sustainability commentary |
| 31 | **Configuration Option** *(new)* | Real graph node for factory options (White Ink, Roll Option, Automation Kit) — Ch.14 §14.6's `HAS_OPTION`; replaces the free-text `configuration` field from v0.5 with proper entities and relationships |
| 32 | **Installation** *(new, optional)* | A specific machine's install site — Ch.14 §14.6 `INSTALLED_AT`, explicitly optional and only where publicly documented; never store non-public customer data here |
| 33 | **Contributor** *(new)* | A named person with one or more governance roles (Ch.17 §17.11) — backs `RecordGovernance` and `ChangeLogEntry.researcher`, replacing bare name strings with a real entity carrying role and conflict-of-interest data |
| 34 | **Known Issue** *(new)* | Documented failure mode or recurring problem for a machine (Roadmap Phase 5) — symptoms, root cause, affected generations, always sourced |
| 35 | **Troubleshooting Entry** *(new)* | Symptom → diagnostic steps → recommended action, optionally linked to a `KnownIssue` (Roadmap Phase 5) |
| 36 | **Maintenance Recommendation** *(new)* | Recommended spare part, known upgrade, or preventive task for a machine (Roadmap Phase 5) — one entity, `recommendation_type` distinguishes the three |
| 21 | **Component** | Motors, carriages, drying units, sensors — often OEM'd from a Ch.4 Class F Component Manufacturer |
| 22 | **Data Source / Citation** | Full Ch.2 §2.7 Source Recording Standard, refined to 9 tiers by Ch.7 §7.3, plus a Ch.6 §6.18 data-governance tier and Ch.7 image/video sub-fields — see §4 |
| 23 | **Price / Market Tier** | Machine-level price band — distinct from Manufacturer market tier (§1a) |
| 24 | **Change Log Entry** | Audit trail — Ch.2 §2.13, workbook-level version per Ch.6 §6.14 |
| 25 | **Research Status** | Per-machine completion tracking — Ch.2 §2.12, reconciled with Ch.5 §5.16 |

This mirrors the CAEM pattern from ORBITIQ-X: a **canonical entity model** with **typed relationships**, not a flat product table. The payoff here is the same — most of the analytical value comes from the relationships, not the entities themselves.

---

## 1a. Manufacturer — Full Field Set (Ch.4 §4.3–§4.6, §4.10–§4.12)

**Classification (§4.3)** — `manufacturer_class`: enum `A_OEM | B_Industrial | C_PrivateLabel | D_SystemIntegrator | E_Software | F_Component`

**Geography (§4.4)** — `country`, `region` (Asia/Europe/North America/South America/Middle East/Africa)

**Market Tier (§4.5)** — `market_tier`: enum `1_GlobalPremium | 2_ProfessionalCommercial | 3_IndustrialValue | 4_Regional | 5_Emerging` — kept as its own field, separate from the Machine-level `Price/Market Tier` entity, since a Tier-1 manufacturer can still sell an entry-level machine. Confirmed by Ch.13 §13.12's "Competitive Positioning" — its worked example (Durst/Canon/EFI/Agfa in "Premium Industrial," Mimaki/swissQprint in "Professional Industrial"...) maps directly onto this existing enum, no new field needed.

**Company Identity** — `manufacturer_name` (official registered name — §4.12 naming standard), `brand_aliases[]` (common names, e.g. "Canon Arizona" for "Canon Production Printing Netherlands B.V."), `parent_company_id`, `former_names[]`, `company_type`, `headquarters`, `year_founded`, `founder`, `ownership`, `stock_exchange_listing`, `website`, `logo_asset`

**Manufacturing Info** — `manufacturing_locations[]`, `assembly_facilities[]`, `rd_centers[]`, `regional_offices[]`, `countries_served[]`, `distributor_ids[]`, `dealer_ids[]`, `service_center_ids[]`, `training_center_ids[]`

**Product Portfolio** — `category_node_ids[]` (links to `TaxonomyNode` — which of the 17 categories this manufacturer plays in)

**Technology Expertise** — `technology_tags[]` (UV, Latex, Eco-Solvent, Dye-Sub, Digital Cutting, Automation, Robotics, Vision Systems...)

**Business Info** — `estimated_employees`, `revenue_range`, `export_countries[]`, `major_customers[]`, `industry_focus`

**Certifications** — `certification_ids[]` -> `Standard` (ISO 9001, ISO 14001, CE, UL, RoHS, REACH...)

**Status (§4.11)** — `manufacturer_status`: enum `Active | Active_Limited | Acquired | Merged | Rebranded | Discontinued | Defunct | Under_Restructuring`

**Manufacturer Quality Score (§4.10)** — mirrors `ResearchStatus` but with Ch.4's own weights:
```
ManufacturerCompleteness {
  company_identity_pct        // 10%
  manufacturing_info_pct       // 10%
  product_portfolio_pct        // 20%
  machine_coverage_pct         // 25%
  documentation_pct            // 10%
  dealer_network_pct           // 10%
  historical_info_pct          // 5%
  media_pct                    // 5%
  relationships_pct            // 5%
  overall_pct                  // weighted roll-up = 100%
}
```

---

## 2. Taxonomy Node — Classification Hierarchy (Ch.3 §3.2–§3.3)

Rather than hardcoding "category" as a flat enum on Machine, model it as a **self-referencing tree** — same pattern you'd use for a knowledge-graph taxonomy:

```
TaxonomyNode {
  node_id
  parent_node_id        // null for top-level Production Technology nodes
  level                  // "technology" | "category" | "type"
  name
  code                   // e.g. "CAT-01" for UV Printing Systems
}
```

Worked example from Ch.3 §3.2:
```
Printing (technology)
  └─ UV Printing (category, CAT-01)
       └─ Flatbed (type)
            └─ [Manufacturer/Family/Series/Model/Generation live on Machine itself]
```

**17 primary categories — CLOSED, see decision record at the top of this document**

Ch.10's category-specific engineering standards (§10.5) run Category 1 through Category 17 by name, keeping CNC Routers (Cat.12) and Laser Systems (Cat.13) as separate categories. `Ink` remains a full entity (`Ink / Consumable System`) with its own fields, controlled vocabulary, and relationships — it's just not a top-level `TaxonomyNode`; it's a sub-domain living inside the printer categories (UV, Latex, Eco-Solvent, Textile) instead.

| Code | Category |
|---|---|
| CAT-01 | UV Printing Systems |
| CAT-02 | Latex Printing Systems |
| CAT-03 | Eco-Solvent & Solvent Printing Systems |
| CAT-04 | Textile & Dye Sublimation Printing Systems |
| CAT-05 | Industrial & Specialty Printing |
| CAT-06 | Digital Cutting Systems |
| CAT-07 | Heat Transfer Systems |
| CAT-08 | Industrial Sewing Systems |
| CAT-09 | Welding & Fabric Finishing |
| CAT-10 | Laminating Systems |
| CAT-11 | Trimming Systems |
| CAT-12 | CNC Routing Systems |
| CAT-13 | Laser Processing Systems |
| CAT-14 | Industrial Printheads |
| CAT-15 | RIP Software & Workflow |
| CAT-16 | Print Media & Materials |
| CAT-17 | Production Automation & Factory Accessories |

Categories 14, 15, 16 are worth noting structurally: they're not "machines" at all — they map onto entities you already have (`Printhead`, `RIP`, `Substrate`). Rather than creating duplicate entities for them, tag those existing entities with the relevant `TaxonomyNode` instead of building parallel category-specific tables. `Ink` gets the same treatment as an entity, just without a dedicated category code — it's tagged via its relationships to `Printhead` and `Machine` instead of via `TaxonomyNode`.

**Retroactive fix needed if any pilot data used CAT-15 (Ink) or CAT-18 under the old numbering:** remap `Ink` records to have no `category_node_id` (or a nullable one, since it's not a category-bearing entity), and shift anything tagged CAT-16/17/18 in the old scheme down by one. Cheap to do now, expensive later once machine records reference these codes directly.

---

## 2a. Machine — Primary Key & Lifecycle (Ch.5 §5.3–§5.4, §5.8)

**UEID (Universal Equipment Identifier)** — permanent primary key, never changes even if renamed or discontinued:
```
Format: GDPPE-{CategoryCode}-{Manufacturer}-{Family}-{Model}-{Generation}
Examples:
  GDPPE-UV-CANON-ARIZONA-2380-GTF
  GDPPE-CUT-ZUND-G3-3XL3200
  GDPPE-RIP-CALDERA-V18
  GDPPE-PH-RICOH-GEN6
```
Note this gives `RIP` and `Printhead` entities UEIDs too, not just `Machine` — the identifier scheme is universal across entity types, which is why it's `GDPPE-{Category}` rather than `GDPPE-MACHINE-{Category}`.

**Printhead lineage (Ch.14 §14.10)** — `Printhead` gets the same succession fields `Machine` has had since v0.5: `predecessor_printhead_id`, `successor_printhead_id` (nullable FKs to `Printhead`). Worked example: Ricoh Gen3 → Gen4 → Gen5 → Gen6. This didn't exist before this chapter because nothing forced a printhead-to-printhead relationship until Ch.14's technology evolution graph made it explicit.

**Lifecycle** (`lifecycle_stage` — Ch.5 §5.3, extended by Ch.17 §17.6, sequential, never skips backward except to `Archived`/`Historical`):
`Research_Candidate → Manufacturer_Verified → Model_Verified → Master_Index_Created → Engineering_Research_Started → Technical_Validation → Published → Monitored → Updated → Discontinued → Archived → Historical`

`Monitored` and `Historical` are new (Ch.17 §17.6's "Research Lifecycle Governance": `Candidate → Research → Validation → Editorial Review → Published → Monitored → Updated → Archived → Historical`). Ch.17's version is a simplified restatement rather than a wholesale replacement — it doesn't have Ch.5's granular pre-publish steps (Manufacturer_Verified, Model_Verified, Master_Index_Created) — but it adds two real states that were missing: `Monitored` (a published record under periodic review per its `ReviewSchedule`, not yet flagged for update) sits between `Published` and `Updated`; `Historical` is a distinct terminal state after `Archived`, matching the `Historical` value `machine_status` already had since v0.5 but which `lifecycle_stage` never had a corresponding stage for. Ch.17's "Editorial Review" stage is not added here — that's `EditorialReview.review_status` (§3a, added in v0.16), kept deliberately separate since a machine's data lifecycle and its written review's approval lifecycle are independent (established in v0.16).

**Machine Status** (`machine_status` — Ch.5 §5.8, kept as authoritative over Ch.9 §9.7's shorter restatement; distinct from `Manufacturer.manufacturer_status` per Ch.4 §4.11):
`Current_Production | Limited_Production | Discontinued | Legacy | Prototype | Cancelled | Historical | Unknown`

Ch.9 §9.7 lists this vocabulary again but drops `Limited_Production` and `Historical`, listing only 6 of Ch.5's 8 values. Treating this as an incomplete restatement rather than an intentional narrowing — `Limited_Production` (still selling, reduced volume) and `Historical` (kept for reference, distinct from actively `Discontinued`) are real distinctions the rest of the schema depends on (e.g. `Historical` pairs with the `Archived` lifecycle stage per §5.3), so Ch.5's 8-value version stays authoritative. If a future chapter explicitly narrows this on purpose, revisit.

Historical machines are never deleted — `Archived`/`Historical` lifecycle + `Historical`/`Discontinued` status keep the record live but flagged, per §5.3 and §17.18's explicit "no permanent deletion without documented justification" rule.

## 3. Machine Profile — Section A (Universal Information, Ch.8 §8.3)

**Architecture change this version:** everything I built in v0.2–v0.7 as flat "Print Performance / Printhead & Ink / Media Handling..." field groups was really just the UV printer template wearing a generic hat. Ch.8 makes explicit what should've been obvious once heat-transfer calenders and sewing machines showed up in Ch.3 — a digital cutter has no "drop size," a laminator has no "nozzle count." Machine's technical fields can no longer be a fixed schema; they have to be **driven by whichever `CategoryTemplate` the machine's `primary_category_node_id` points to** (§3a). Only identity/business/commercial/documentation/research stay universal (Section A) — everything else is Section B, and Section B's shape depends on category.

**Identification** *(enforces Ch.2 §2.10 + Ch.5 §5.5 naming standard, Ch.3 §3.5 + Ch.5 §5.14 mandatory classification fields)*
`ueid` (primary key), `manufacturer_name`, `family_name`, `series_name`, `model_name`, `generation`, `configuration`, `manufacturer_id`, `product_line_id`, `primary_category_node_id`, `secondary_category_node_id`, `technology_node_id`, `equipment_type_node_id`, `lifecycle_stage`, `machine_status`, `country_of_origin`, `country_of_manufacture`, `release_year`, `discontinued_year`, `successor_model_id`, `predecessor_model_id`, `regional_variant_of_id` (nullable — Ch.5 §5.12), `oem_platform_id` (nullable — set when this model is a rebadge of a shared platform)

> Example from Ch.2/Ch.5: store `EFI VUTEk GS3250 LX Pro` as its full nomenclature — `generation`/variant suffix is its own field, not dropped text. `configuration` (free text, kept for display/search convenience) is now backed by `configuration_option_ids[]` -> `ConfigurationOption` as of Ch.14 — see below — since Ch.14 §14.6 wants factory options (White Ink, Roll Option, Automation Kit) as real graph nodes, not just a string.

**Configuration Option (Ch.14 §14.6 `HAS_OPTION`)**:
```
ConfigurationOption {
  option_id
  option_name          // "White Ink", "Roll Option", "Automation Kit"...
  category_node_id       -> TaxonomyNode   // some options are category-specific (e.g. "Roll Option" only makes sense for flatbeds)
}
```
`Machine.configuration_option_ids[]` replaces the plain-string `configuration` for anything that should be queryable/comparable (e.g. "show all machines with the White Ink option") — the free-text field stays for display but the real relationship does the work.

**Installation (Ch.14 §14.6 `INSTALLED_AT`, optional)**:
```
Installation {
  machine_id           -> Machine
  location_general       // country/region level — never a specific address unless the source is a public case study naming it
  installation_date
  publicly_documented      // bool — must be true to create this record at all
  source_id                 -> DataSource
}
```
This is the one entity in the schema that needs explicit privacy discipline: Ch.14 marks it "optional where publicly documented," and that's a hard gate, not a soft preference — no inferring or estimating a customer's location from indirect signals, only recording what a public case study or press release already states.

**Product Overview** *(new field group — Ch.8 §8.3)*
`machine_description`, `application_ids[]`, `industry_segment`, `production_class`, `typical_customers`, `recommended_production_volume`

**Commercial** *(expanded per Ch.8 §8.3)*
`price_tier_id`, `list_price_range`, `target_application_ids[]`, `distributor_regions[]`, `estimated_market_segment`, `warranty_terms`, `dealer_network_ids[]`, `service_availability`

**Documentation** — pointers into `DataSource`, not stored inline: `product_page_source_id`, `brochure_source_id`, `datasheet_source_id`, `user_manual_source_id`, `installation_manual_source_id`, `service_manual_source_id`, `parts_manual_source_id`, `video_source_ids[]`

**Research** — `confidence_level`, `research_completion_pct`, `last_verified_date`, `research_notes` (all roll up from `ResearchStatus`/`FieldValue`, restated here as the Section A view of them)

**Reference: full unit standard (Ch.6 §6.12, expanded by Ch.9 §9.5 with secondary/context-dependent units)** — applies across every Section B template's numeric fields:

| Quantity | Primary Unit | Secondary/Alternative | Notes |
|---|---|---|---|
| Length | mm | m | |
| Area | m² | | |
| Speed | m²/hr | m/min | m/min for roll-fed/linear machines (cutters, calenders); m²/hr for area-coverage printers — choose per §9.5 |
| Weight | kg | t (metric ton) | |
| Pressure | bar | kPa, psi (optional) | |
| Temperature | °C | | |
| Power | kW | W | |
| Voltage | V | | |
| Current | A | | |
| Frequency | Hz | | |
| Resolution | dpi | | |
| Drop size | pL | | |
| Humidity | %RH | | new in Ch.9 — environmental fields (§9.12) |
| Noise | dB(A) | | A-weighted, not plain dB |
| Air flow | L/min | CFM (where appropriate) | new in Ch.9 |

**Approved acronym glossary (Ch.9 §9.15)** — reference table, not a stored entity; used for display/label consistency:

`UV` Ultraviolet · `LED` Light Emitting Diode · `RIP` Raster Image Processor · `ICC` International Color Consortium · `PLC` Programmable Logic Controller · `HMI` Human-Machine Interface · `VFD` Variable Frequency Drive · `AGV` Automated Guided Vehicle · `ATC` Automatic Tool Changer · `ERP` Enterprise Resource Planning · `API` Application Programming Interface · `JDF` Job Definition Format · `OPC UA` Open Platform Communications Unified Architecture · `ΔE` Delta E Color Difference

**Performance metric disambiguation (Ch.9 §9.8, §9.13)** — Template 1's "Performance" section (Ch.8) lists Draft/Production/Quality/Maximum Speed as separate fields; worth being explicit these are genuinely different metrics, not redundant near-duplicates, so ingestion doesn't collapse them into one "speed" number:

| Field | Definition |
|---|---|
| `max_speed` | Highest published throughput, draft conditions |
| `production_speed` | Typical throughput under recommended commercial settings |
| `quality_speed` | Throughput using high-quality print mode |
| `recommended_daily_volume` | Suggested production capacity — a capacity planning figure, not a speed |
| `duty_cycle` | Maximum designed workload over a defined period, if published |

Per §9.13: **editorial estimates never substitute for a manufacturer-published value** in any of these fields — if a manufacturer hasn't published `duty_cycle`, the field gets a missing-data sentinel (§4), not an estimated number, regardless of `governance_tier`.

**Provenance (per-field, not per-record) — full sub-object per Ch.2 §2.7-2.9, extended by Ch.9's data typing and unit conversion policy**

```
FieldValue {
  field_name
  data_type            // Text | Integer | Decimal | Boolean | Enumeration | Date | URL | Image | Document | Relationship — Ch.9 §9.3
  value                 // stored in GDPPE's standard unit (see unit table above)
  original_value         // as published by the source, before conversion — Ch.9 §9.6
  original_unit           // e.g. "in" when the datasheet said 100 inches
  confidence            // High | Medium | Low | Pending  — per Ch.2 §2.8
  source_id              -> DataSource
  conflicting_values[]   // {value, source_id}[]  — kept, never silently overwritten (§2.9)
  resolution_note         // free text: which value won and why (generation, date, config)
  last_verified_date
}
```

**Unit conversion policy (Ch.9 §9.6):** `value` always holds the converted, standardized-unit number; `original_value`/`original_unit` preserve exactly what the source published (e.g. `original_value: 100, original_unit: "in"` alongside `value: 2540` in mm). Never discard the original — that's the traceability the whole `FieldValue` model exists for.

**Missing-data sentinel values — reconciling Ch.7 §7.10 and Ch.9 §9.14 into one 6-value vocabulary** (superset, since the two chapters' lists only partially overlap):
`Not_Publicly_Available | Under_Verification | Manufacturer_Not_Disclosed | Information_Pending | Not_Applicable | Unknown`

Distinct meanings worth keeping separate rather than collapsing: `Not_Applicable` (Ch.9-only — the field genuinely doesn't exist for this technology, e.g. "Drop Size" on a sewing machine) is different from all the others, which mean "the field applies but the value isn't known yet for some reason." `Unknown` (Ch.9) is specifically for historical machines where the information is lost to time, distinct from `Under_Verification` (Ch.7) meaning active current research. `Information_Pending` (Ch.7-only) and `Under_Verification` overlap heavily — kept both since Ch.9 didn't explicitly retire the term, but they're candidates to merge into one value in a future cleanup pass if a chapter ever addresses it directly.

This applies identically whether `field_name` comes from Section A (universal) or Section B (category template) — provenance doesn't care which template defined the field.

**Research Status** *(implements Ch.2 §2.12 + Ch.5 §5.16's explicit weights)*
```
ResearchStatus {
  identity_pct              // 15%
  documentation_pct         // 10%
  images_pct                // 5%
  specifications_pct        // 40%  — heaviest weight; this is Section B, the engineering core
  commercial_pct             // 10%
  manuals_pct                // 10%
  media_pct                  // 5%
  validation_pct              // 5%
  overall_pct                 // weighted roll-up = 100%
  qa_checklist_passed        // bool — gates publish, per §2.16
}
```

**Record Governance (Ch.17 §17.5)** — new, one per `Machine` and `Manufacturer`: "each record shall have a Record Owner, Technical Reviewer, Editorial Reviewer, Last Editor... no orphaned records shall exist."
```
RecordGovernance {
  entity_id             -> Machine | Manufacturer
  record_owner            -> Contributor
  technical_reviewer        -> Contributor
  editorial_reviewer          -> Contributor
  last_editor                   -> Contributor
}
```
**Segregation of duties (Ch.17 §17.9):** "No single contributor should complete every stage for high-impact records" — worth enforcing as a validation rule at write time: for records above some impact threshold (e.g. Tier-1 manufacturer flagship machines), `technical_reviewer`, `editorial_reviewer`, and `record_owner` should resolve to different `Contributor` records, not the same person wearing three hats.

**Contributor (Ch.17 §17.11–§17.12)** — replaces bare name strings (`researcher`, `author` fields used everywhere from `DataSource` to `EditorialReview`) with a real entity:
```
Contributor {
  contributor_id
  name
  roles[]                // Research_Contributor | Technical_Reviewer | Editorial_Reviewer | Data_Curator | Knowledge_Graph_Curator | Platform_Administrator | Project_Maintainer — a person can hold multiple roles
  conflict_of_interest_disclosure   // free text — §17.12: "commercial influence shall be disclosed"
}
```
This is a genuine backfill, not a new concept — every `researcher`/`author` field in the schema so far (on `DataSource`, `ChangeLogEntry`, `EditorialReview`, `ComparisonReport`) has been a plain string; as of Ch.17 those should resolve to `Contributor.contributor_id` instead, so role and conflict-of-interest data isn't duplicated per record.

---

## 3a. Category Template — Section B Mechanism (Ch.8 §8.2, §8.4)

```
CategoryTemplate {
  template_id
  category_node_id       -> TaxonomyNode        // which category this template applies to
  template_name          // e.g. "UV Printing Systems"
  section_groups[]        // ordered list of engineering sections, each field carrying:
                           //   { field_name, preferred_term, synonyms[], data_type, unit,
                           //     controlled_vocabulary_id, research_level, engineering_domain }
  comparison_key_fields[] // 5-15 fields flagged for side-by-side comparison tables (§8.5)
  completeness_matrix     -> CategoryCompletenessMatrix   // Ch.10 §10.7 — see below
}
```

**Research Level (Ch.10 §10.2)** — every field definition now carries a priority tier, separate from `confidence` (which is about *how sure* a value is) and `document_priority` (which is about *documents*, not fields):

| Level | Meaning | Examples |
|---|---|---|
| 1 | Mandatory — must be collected whenever publicly published | Machine Width, Weight, Print Width, Printheads, Voltage, Speed |
| 2 | Recommended — collect whenever available | Servo Motors, PLC, Vacuum Pump, Cooling System, Automation Features |
| 3 | Advanced — usually only in manuals | Linear Guides, Bearings, Encoder Resolution, Controller Type |
| 4 | Factory Research — service manuals or direct manufacturer contact only | PCB Architecture, Internal Wiring, Servo Tuning, PLC Ladder, Factory Calibration |

This gives `ResearchStatus.specifications_pct` a real basis for partial credit — a machine with all Level 1/2 fields but no Level 3/4 data is meaningfully more complete than one missing Level 1 fields, even if both have gaps.

**Availability Class (Ch.10 §10.6)** — added to `FieldValue`, a different axis from `governance_tier`: this one is about *where* the information could realistically be found, not what kind of claim it is:

`P` (Publicly Available) | `D` (Dealer/Distributor) | `M` (Manual/Service Documentation) | `F` (Factory/OEM Only — never guess this) | `E` (Estimated from multiple sources)

**Cross-link, not a duplicate field:** `availability_class = E` should always imply `governance_tier = Editorial_Content` — Ch.10 §10.6 explicitly says estimated values "must be clearly marked as editorial, not fact," which is exactly what `governance_tier` already enforces. Validate this pairing at write-time rather than trusting both fields to agree independently.

Ch.10 §10.8's "Verified Specification vs. Editorial Engineering Note" distinction is the same governance split restated at the presentation layer — no new field needed, it's confirmation that `governance_tier` was the right mechanism to build back in v0.6.

**Engineering Domains (Ch.10 §10.3–§10.4)** — a controlled list of cross-cutting domains that `section_groups[]` entries tag into, rather than each `CategoryTemplate` inventing domain names from scratch:

| Domain | Applicability |
|---|---|
| Identity | All |
| Mechanical | All |
| Electrical | All |
| Motion | Most |
| Imaging | Printers only |
| Tooling | Cutters only |
| Heating | Calendars only |
| Sewing | Sewing machines only |
| Control | All |
| Software | All |
| Utilities | All |
| Maintenance | All |
| Commercial | All |

Ch.10 §10.4 also gives a universal 8-section record structure (Identity / Mechanical / Electrical / Motion / Automation / Utilities / Software / Maintenance) that sits *underneath* Ch.8's broader Section A/B/C/D/E split — Ch.8's Section B ("Technology-Specific Engineering") is where these 8 domains actually live, refined per category by which domains apply and what fields each contributes.

**Category Completeness Matrix (Ch.10 §10.7)** — subdivides `ResearchStatus.specifications_pct` (the flat 40% from §3) into category-specific domain weights, since "Ink System" completeness means nothing for a digital cutter and "Tool Modules" completeness means nothing for a UV printer:

```
CategoryCompletenessMatrix {
  category_node_id     -> TaxonomyNode
  domain_weights[]        // {domain_name, weight_pct}[], sums to 100% within this matrix
}
```

Worked example for UV Printing (Ch.10 §10.7): Identity 10%, Mechanical 15%, Print System 20%, Ink System 10%, Motion System 10%, Electrical 10%, Software 10%, Maintenance 10%, Documentation 5%. A digital cutter's matrix would swap "Print System"/"Ink System" for "Tooling"/"Vision System" at whatever weights that category's research priorities call for — each category gets its own matrix, not a shared template.

**Preferred term / synonym handling (Ch.9 §9.4):** every field definition inside `section_groups[]` carries a `preferred_term` (the name GDPPE always displays/stores under) plus a `synonyms[]` list for matching manufacturer language during research. Example: a datasheet says "Printable Width" — the researcher enters the value under the field whose `preferred_term` is `Print Width` and whose `synonyms[]` includes `"Printable Width"`. This keeps `field_name` in `FieldValue` consistent across manufacturers even when their brochures don't agree on what to call something.

**Controlled Vocabularies (Ch.9 §9.7)** — referenced by `controlled_vocabulary_id` on the relevant field definitions:

| Vocabulary | Values | Applies to |
|---|---|---|
| `UVCuringType` | LED, Mercury, Hybrid, UV_Gel, Not_Applicable | Template 1 (UV Printing) "UV Curing" section |
| `PrintheadTechnology` | Piezoelectric, Thermal_Inkjet, Continuous_Inkjet, MEMS, Electrostatic, Not_Applicable | `Printhead` entity |
| `InkType` | UV, Latex, Eco_Solvent, Solvent, Dye_Sublimation, Reactive, Acid, Pigment, Ceramic, Textile_Pigment, Water_Based, UV_Gel | `Ink` entity |
| `MachineConfiguration` | Flatbed, Hybrid, Roll_to_Roll, Single_Pass, Object_Printer, Cylindrical, Conveyor, Static_Table | Template 1 "Machine Platform" section |

A Machine's Section B is not stored as fixed columns — it's `Machine.technical_specs: { [section_name]: { [field_name]: FieldValue } }`, validated at write-time against the `CategoryTemplate` its `primary_category_node_id` resolves to. This is the same "flexible field-set validated against a schema" pattern as `FieldValue`, just applied one level up.

**17 templates from Ch.8 §8.4** (section-group names only — full field lists live in Ch.8 itself, not duplicated here):

| Template | Category | Engineering Sections |
|---|---|---|
| 1 | UV Printing Systems | Machine Platform, Printhead System, Ink System, UV Curing, Performance, Motion System, Electrical, Software, Maintenance *(this is the template my earlier "Print Performance/Printhead & Ink/Media Handling/Curing-Drying/Software/Physical & Environmental" field groups were actually modeling — now formalized as Template 1, not the universal default)* |
| 2 | Digital Cutting Systems | Machine Platform, Tool Modules, Motion System, Vacuum System, Vision System, Software, Applications |
| 3 | Latex Printers | Latex Generation, Ink Cartridge, Printheads, Optimizer, Curing, Media Handling, Indoor Certifications |
| 4 | Eco-Solvent & Solvent Printers | Ink Chemistry, Heater Configuration, Drying System, Take-up System, Printheads, Media Width, Outdoor Durability |
| 5 | Textile & Dye Sublimation | Fabric Width, Ink Type, Transfer/Direct, Fabric Transport, Tension Control, Dryer, Winder |
| 6 | Heat Transfer Systems | Drum, Heating, Blanket, Productivity, Safety |
| 7 | Industrial Sewing Systems | Stitch, Machine, Applications |
| 8 | Laminators | Roller specs, Heating, Speed, Media Thickness |
| 9 | CNC Routers | Spindle, Tool Changer, Vacuum Table, Axis Travel, Controller, Dust Extraction |
| 10 | Laser Systems | Laser Type/Source, Power, Beam Quality, Cutting Area, Cooling, Exhaust |
| 11 | Printheads | Technology, Nozzle Count, Drop Size, Resolution, Firing Frequency, Compatible Printers |
| 12 | RIP Software | Vendor, Supported OS/Printers/Printheads, ICC Engine, Nesting, API, Licensing |
| 13 | Ink Systems | Chemistry, Color Config, Viscosity, Shelf Life, Compatible Printheads/Machines |
| 14 | Media & Materials | Material Type, Thickness, Weight (GSM), Fire Rating, Compatibility |
| 15 | Welding Systems | Technology, Seam Width, Speed, Temperature Range, Material Compatibility |
| 16 | Production Automation | Type, Payload, Sensors, Vision, PLC, Safety, Integration Protocols |
| 17 | Knowledge & Documentation | *Not an equipment category* — see note below |

**Template 17 ("Knowledge & Documentation") is not a machine category.** It's a cross-cutting documentation checklist (brochures, manuals, CAD drawings, wiring diagrams, service bulletins) that duplicates what `DataSource.document_priority` and the Ch.7 documentation standards already cover. Don't create a `TaxonomyNode` or `CategoryTemplate` for it.

**Note on reconciling with Ch.10:** Ch.8's list above includes "Template 13 — Ink Systems" as its own template, but Ch.10 §10.5's category list (§2) does *not* include Ink Systems as a category — Ch.10 folds ink directly into the relevant printer categories' engineering sections instead. Ch.10 is the more recent, more specific chapter on category-by-category engineering standards, so its list is treated as authoritative for what counts as a category (§2's resolution). Practically: `CategoryTemplate` still needs an "Ink System" *section* inside the UV/Latex/Eco-Solvent/Textile templates (per Ch.8's own field lists for those templates), it just doesn't get a standalone `TaxonomyNode` the way Printheads, RIP, and Media do.

**Comparison Key Fields (§8.5, expanded by Ch.13 §13.5's "Category-Specific Benchmark Parameters")** — Ch.13 gives fuller lists than Ch.8's original worked examples; treat §13.5 as the more authoritative/current version of `comparison_key_fields[]` per category:
- UV Printers: Print Width, Max Speed, Production Speed, Printhead Technology, Number of Printheads, Ink Configuration, White Ink Performance, Media Thickness, Vacuum System, Automation, Electrical Consumption, Daily Production Capacity
- Digital Cutters: Working Area, Traverse Speed, Tool Capacity, Max Thickness, Vision Accuracy, Repeatability, Router Power, Conveyor Length, Automation
- Heat Transfer Calendars: Drum Width, Drum Diameter, Heating Method, Temperature Stability, Transfer Speed, Blanket Life, Energy Consumption
- Industrial Sewing: Sewing Speed, Stitch Quality, Automation, Needle System, Thread Handling, Material Compatibility
- RIP Software: Supported Printers, ICC Engine, Spot Colour Handling, Automation, Nesting, Variable Data, API Support, Cloud Integration

These flagged fields are what a comparison-table UI queries directly, rather than pulling every field in `technical_specs` — keeps comparisons readable per §8.1's stated goal. Ch.13 §13.2 Principle 2 adds a hard constraint on top: comparisons should only run within the same category ("compare like with like") unless explicitly framed as a cross-technology selection comparison — worth enforcing at the query layer, not just as a UX convention.

**Technology Milestone (§8.6)** — category-level historical timeline, distinct from machine/manufacturer `Historical Event`:
```
TechnologyMilestone {
  category_node_id     -> TaxonomyNode
  milestone_name         // e.g. "LED Curing Introduced"
  approximate_date
  description
  source_id              -> DataSource
}
```
Example chain for UV Printing: Mercury lamps → LED curing → Variable-drop printheads → Automation. This gives category pages engineering context beyond a spec table, per §8.1's "provides valuable engineering context" goal.

**Historical Event — now typed (Ch.12 §12.19)**. Since v0.4 this entity had only a loose description ("launch, discontinuation, acquisition, rebrand"); Ch.12's Timeline Section requirement forces an actual enum, and adds three event types that weren't there before:
```
HistoricalEvent {
  entity_id             -> Machine | Manufacturer     // which record this event belongs to
  event_type             // Launch | Major_Revision | Firmware_Update | Software_Update |
                          //   Replacement | Discontinuation | Acquisition | Rebrand
  event_date
  description
  source_id               -> DataSource
}
```
`Firmware_Update`/`Software_Update` are new — they didn't exist in the v0.4 description, but Ch.7 §7.14 already established firmware/software as having their own review cadence, so this just gives that cadence something to log against. `Replacement` is distinct from `Discontinuation` — a model can be replaced by a successor (`Machine.successor_model_id` already captures the FK) while the timeline entry captures *when* that transition happened.

**Editorial Review (Ch.12 §12.17, extended by Ch.13 §13.6-13.9)** — this is new structure, not just another `governance_tier = Editorial_Content` tag. The earlier "Engineering Review" mention in Ch.11 §11.9 (Strengths/Weaknesses/Reliability) turns out to have a real sub-structure once Ch.12 spells it out, and Ch.13 adds two more assessment fields plus a formal scorecard:
```
EditorialReview {
  machine_id            -> Machine
  design_philosophy       // free text
  mechanical_construction // frame rigidity, structural design, service access
  production_performance  // real-world throughput, typical scenarios, strengths, limitations
  reliability_notes       // known service history, maintenance requirements, component longevity — Ch.12
  serviceability_notes    // maintenance access, tool-less features, printhead/consumable replacement — Ch.13 §13.8
  sustainability_notes    // qualitative sustainability commentary — Ch.13 §13.9 (see Sustainability domain below for the verified numeric data this commentary interprets)
  best_use_cases          // suitable industries, recommended materials, ideal environment
  considerations           // free text: what to evaluate before purchase
  scorecard                -> EngineeringScorecard    // Ch.13 §13.6
  review_status              // Draft | Under_Review | Technical_Validation | Editorial_Approval | Published | Archived — Ch.16 §16.10, new
  author
  review_date
  governance_tier          // always Editorial_Content — enforced, not optional, for this entity
}
```
This also gives the Ch.12 §12.10 Performance Dashboard's synthetic scores (Reliability Score, Automation Level, Service Complexity, Engineering Complexity) a home — they're derived/editorial metrics, not manufacturer-published specs, so they belong as fields on `EditorialReview` rather than as `FieldValue`s on `Machine.technical_specs`, keeping the "verified vs. editorial" boundary intact at the schema level, not just the UI level.

**`review_status` is new (Ch.16 §16.10)** — worth distinguishing from `Machine.lifecycle_stage` (§2a), which tracks the *equipment record's* research progress (Research_Candidate → ... → Published → Archived). Ch.16's editorial workflow is specifically about the *review content itself* going through draft/approval before it's shown alongside a published machine — a machine can be fully `Published` in its own lifecycle while its `EditorialReview` is still `Draft`. Same field added to `ComparisonReport` (§3a) for the same reason — both are authored editorial documents that need their own approval gate independent of the underlying data's status.

**Engineering Scorecard (Ch.13 §13.6)** — a weighted qualitative score, always editorial, never confused with verified specs:
```
EngineeringScorecard {
  mechanical_engineering_pct   // 15%
  imaging_tooling_pct           // 20%
  automation_pct                 // 10%
  reliability_pct                 // 15%
  serviceability_pct              // 10%
  productivity_pct                 // 15%
  software_ecosystem_pct           // 5%
  expandability_pct                 // 5%
  documentation_quality_pct         // 5%
  sustainability_pct                 // 5%
  overall_score                       // weighted roll-up = 100%
  methodology_notes                    // required per §13.6 — "the methodology used to assign scores shall be documented"
}
```
Note this is a *fourth* weighted-percentage structure in the schema, alongside `ResearchStatus` (§3, completeness), `ManufacturerCompleteness` (§1a, completeness), and `CategoryCompletenessMatrix` (§3a, completeness). This one is different in kind — it's not measuring how *complete* the research is, it's an editorial *quality judgment* on the machine itself. Worth keeping distinct rather than trying to unify with the completeness scores, since conflating "how much do we know" with "how good is it" would corrupt both.

**Application Suitability (Ch.13 §13.3 Type 5, §13.11)** — reconciling two rating scales the chapter uses for the same concept: §13.3's worked example uses 1-5 stars, §13.11's uses categorical labels (Excellent/Very Good/.../Not Recommended). Treating stars as canonical and labels as a display mapping, rather than storing both independently:
```
ApplicationSuitability {
  machine_id          -> Machine
  application_id        -> Application
  rating                  // 1-5 (stars) — canonical value
  rating_label             // computed display mapping: 5=Excellent, 4=Very_Good, 3=Good, 2=Fair, 1=Not_Recommended
  basis                     // "documented capabilities" | "editorial analysis" — per §13.3/§13.11's explicit rule that ratings can't be marketing-claim-based
  governance_tier            // Editorial_Content — this is always a judgment call, even when grounded in verified specs
}
```

**TCO Profile (Ch.13 §13.10)** — one per machine, each factor individually sourced/dated since §13.10 explicitly requires "actual cost values should only be displayed when sourced and dated":
```
TCOProfile {
  machine_id            -> Machine
  capital_cost            -> FieldValue   // reuses the FieldValue pattern — each TCO factor needs its own source/date/confidence
  installation_cost        -> FieldValue
  power_consumption_cost    -> FieldValue
  consumables_cost           -> FieldValue
  maintenance_cost             -> FieldValue
  spare_parts_cost              -> FieldValue
  service_contract_cost          -> FieldValue
  operator_training_cost          -> FieldValue
  downtime_cost                     -> FieldValue
  expected_service_life              -> FieldValue
}
```
Each factor is a `FieldValue`, not a plain number — this is the same reasoning as everywhere else in the schema: a capital cost figure needs the same source/confidence/conflicting-values tracking as any other spec, and per §13.10, absent reliable sourcing GDPPE presents a *framework* (the field list itself) rather than fabricated numbers — missing factors get the standard missing-data sentinel (§4), never an estimate.

**Sustainability — new engineering domain, not a new entity (Ch.13 §13.9)**. Extends the Ch.10 §10.3 domain list (Identity/Mechanical/Electrical/Motion/Imaging/Tooling/Heating/Sewing/Control/Software/Utilities/Maintenance/Commercial) with a 14th: `Sustainability`, applicable to All. Fields live on `Machine.technical_specs` as ordinary `FieldValue`s (verified, sourced) — distinct from `EditorialReview.sustainability_notes` (qualitative interpretation of these same numbers): `energy_consumption`, `curing_technology_type` (already exists via `UVCuringType` — LED vs. mercury is explicitly called out in §13.9 as a sustainability-relevant fact, not a new field), `voc_emissions`, `water_consumption`, `recyclability_notes`, `environmental_certification_ids[]` (→ `Standard`).

**Comparison Report (Ch.13 §13.14)** — multi-machine structured document, distinct from a single-machine `EditorialReview`:
```
ComparisonReport {
  report_id
  machine_ids[]            // 2+ machines being compared, per Ch.13 §13.2 Principle 2 — same technology class only
  executive_summary
  equipment_overview
  technical_comparison        // pulls comparison_key_fields[] per machine's CategoryTemplate
  engineering_analysis
  production_analysis
  commercial_considerations
  application_suitability      // pulls from ApplicationSuitability records for the compared machines
  strengths
  limitations
  conclusions
  source_ids[]                  -> DataSource
  review_status                   // Draft | Under_Review | Technical_Validation | Editorial_Approval | Published | Archived — Ch.16 §16.10
  author
  report_date
  governance_tier                 // always Editorial_Content
}
```
`Comparison Center` (Ch.11 §11.10, Ch.12 §12.12) is the *interactive* UI version of this — a live query over `comparison_key_fields[]` for 2-5 machines. `ComparisonReport` is the *authored, static* version (§13.14's 11-section template) — same underlying data, two different presentation modes, worth keeping both since one is user-driven and the other is editorially curated.

---

## 3b. HTML IA/UX Coverage Check (Ch.11–12) — presentation layer, not new data structures

Ch.11 defines navigation, page layouts, search, filters, comparisons, dashboards, and theming. Running through it against the existing schema — everything maps onto something already built, no new entities required beyond the one governance-tier addition above:

| Ch.11 Requirement | Existing Schema Coverage |
|---|---|
| §11.4 Site nav (Technologies, Manufacturers, Equipment, Printheads, Ink, Software, Materials...) | Direct reads over `TaxonomyNode`, `Manufacturer`, `Machine`, `Printhead`, `Ink`, `RIP`, `Substrate` |
| §11.6 Navigation hierarchy (Technology → Type → Manufacturer → Family → Series → Model) | Same path as `TaxonomyNode` → `Machine` identification fields (§2a/§3) |
| §11.7 Category landing page (history, timeline, market leaders) | `TechnologyMilestone` (§3a) + `Manufacturer` filtered by `category_node_ids[]` |
| §11.8 Manufacturer page | `Manufacturer` full profile (§1a) + `CompanyRelationship` (§6) for "related technologies"/timeline |
| §11.9 Machine detail page — Quick Specs, Tech Specs by section, Performance Dashboard | `Machine` Section A (§3) + `technical_specs` via `CategoryTemplate` (§3a), sections already domain-tagged |
| §11.9 "Engineering Review" (Strengths/Weaknesses/Reliability) | `EditorialReview` entity (§3a) as of v0.12 — was just a `governance_tier` tag until Ch.12 §12.17 gave it real sub-structure |
| §11.10 Comparison Center (2–5 machines) | `comparison_key_fields[]` on `CategoryTemplate` (§3a) — already designed for exactly this |
| §11.11 Knowledge Graph Explorer | Direct Neo4j traversal of the relationship set in §7 — no new relationship types needed, Ch.11's worked example (Ricoh Gen6 → Used By → manufacturers → Compatible Ink → Applications) is a 3-hop walk over relationships already defined |
| §11.12 Global Search (synonyms, fuzzy, semantic) | `preferred_term`/`synonyms[]` (§3a, Ch.9) for exact/fuzzy matching; Qdrant (§8) for semantic search over `DataSource` text |
| §11.13 Filters (print width, speed, ink type, price range, year...) | All direct `FieldValue`/`Machine` fields — see `searchable`/`filterable` flags below |
| §11.14 Dashboards | Aggregate queries over `ResearchStatus`, `ManufacturerCompleteness`, `TaxonomyNode` counts — no new entity, just rollups |
| §11.21 AI advisor / NL search / AI-generated explanations | `AI_Generated_Explanation` governance tier (§4) — the one real addition this chapter forced |
| §11.22 Data flow (DB → Validation Engine → JSON Export → Search Index → Knowledge Graph → Frontend) | Matches the stack in §8: Validation Engine = `ResearchStatus.qa_checklist_passed` gate; Search Index = Qdrant; Knowledge Graph = Neo4j; JSON Export = flattened `Machine`+`technical_specs` per §6a/§6b's mapping logic |
| Ch.12 §12.5 Hero Badges (Current Model, Industrial Grade, LED UV, Hybrid...) | Computed/derived at render time from `machine_status`, `production_class`, `UVCuringType`, `MachineConfiguration` (§3a) — not stored fields of their own |
| Ch.12 §12.10 Performance Dashboard synthetic scores (Reliability Score, Automation Level, Service Complexity) | `EditorialReview` fields (§3a) — these are derived/editorial metrics, never `FieldValue`s, so the verified/editorial boundary holds at the schema level |
| Ch.12 §12.19 Timeline Section | `HistoricalEvent` (§3a, now typed) for machine/manufacturer-level entries + `TechnologyMilestone` for category-level context, combined in one UI timeline |
| Ch.12 §12.22 Download Center new types (ICC Profiles, Templates, White Papers) | `DataSource.source_type` extended (§4) |
| Ch.12 §12.23 Page Variants (different layout per category) | Already the point of `CategoryTemplate.section_groups` (§3a) — one template per category was designed for exactly this |

**Two small additions to field definitions** (on `CategoryTemplate.section_groups[]` entries, alongside `research_level`/`engineering_domain` from §3a) — needed because Ch.11 §11.13 is explicit about which fields must be filterable, and that's a UI/index concern the schema didn't previously flag:

`searchable` (bool — indexed for full-text/semantic search) and `filterable` (bool — indexed for faceted filtering, e.g. Print Width, Speed, Ink Type, Price Range, Country, Year, Current/Discontinued). Most Level 1/2 fields (§3a) will be both; Level 4 factory-research fields typically won't need either.

---

## 3c. Maintenance & Service Intelligence (Roadmap Phase 5) — genuinely new area

Everything else in the roadmap memo's 11 phases maps onto structures already built (see table below). Phase 5 doesn't — it's the first time "what breaks and how to fix it" shows up anywhere in the document set, and none of the 17 chapters processed so far have a home for it.

```
KnownIssue {
  machine_id            -> Machine
  issue_title
  symptoms
  root_cause
  affected_generations[]  // which model generations/serial ranges are affected
  resolution              // official fix if one exists
  source_id                -> DataSource
  governance_tier            // Public_Verifiable if from an official service bulletin, Industry_Practice if from aggregated field reports (§3, v0.15)
}

TroubleshootingEntry {
  machine_id            -> Machine
  symptom
  diagnostic_steps
  likely_cause_id         -> KnownIssue   (nullable — not every symptom traces to a documented issue)
  recommended_action
  source_id                -> DataSource
}

MaintenanceRecommendation {
  machine_id            -> Machine
  recommendation_type     // Recommended_Part | Known_Upgrade | Preventive_Task
  description
  applicable_generations[]
  source_id                -> DataSource
}
```

`Service_Bulletin` also needs adding as a `DataSource.source_type` value (§4) — it existed informally as "Technical Bulletins" in Ch.2's source hierarchy but was never a first-class type in the enum.

These three entities are deliberately kept separate from `EditorialReview` — a known issue or troubleshooting step is closer to a verified/semi-verified fact (often traceable to an official service bulletin) than to an engineer's subjective assessment, so it gets its own governance path rather than being folded into editorial commentary. Firmware itself doesn't need a new entity — `HistoricalEvent.event_type = Firmware_Update` (§3a, v0.12) already covers "what changed and when"; `KnownIssue`/`TroubleshootingEntry` cover "what goes wrong and how to fix it," which is a different question.

**Roadmap phase-by-phase coverage check:**

| Phase | Concept | Schema Coverage |
|---|---|---|
| 1–2 (Foundation, Master DB) | Schema freeze, manufacturer→family→model→spec priority | This is exactly the sequencing already recommended in §9 |
| 3 (AI Knowledge Base) | Industry-scoped AI, not general-purpose | `AI_Generated_Explanation` governance tier (§4) + vector DB layer (§8) |
| 4 (Knowledge Graph) | Verb-labeled relationships, not bare links | §7's relationship set + Edge Provenance (§6c) — already the point of both |
| 5 (Engineering Intelligence) | Failure modes, service bulletins, troubleshooting, upgrades | **New this version** — `KnownIssue`, `TroubleshootingEntry`, `MaintenanceRecommendation` above |
| 6 (Production Intelligence) | Artwork→RIP→Printer→Calendar→Fabric→Sewing→Frame→Packing→Dispatch | Chained `PAIRS_WITH`/`REQUIRES_SOFTWARE`/`USED_FOR` relationships (§7) — no new relationship types needed, just multi-hop traversal |
| 7 (Color Intelligence) | ICC library, DeviceLink, Delta E, certifications | `DataSource.source_type = ICC_Profile` (§4, v0.12) + Ch.9 §9.11 color terminology + `Standard` entity |
| 8 (Commercial Intelligence) | Launch year, successor, price, warranty, regional availability | All already in Machine Section A Commercial group (§3) |
| 9–11 (AI Assistant, Wikipedia, Copilot) | Long-term AI vision | Conceptually covered by Ch.15's AI module list (§ "AI Architecture") — these are capability/product goals, not data-model requirements |

---

## 4. Data Source — Full Field Set (Ch.2 §2.7, refined by Ch.7 §7.3–§7.12)

The `DataSource` entity carries every field the methodology requires, plus the tier it falls into:

`source_title`, `source_type` (Datasheet / Manual / Brochure / Dealer Page / Trade Show / Trade Press / Patent / Academic Paper / Business Filing / Archive / Forum / Social Media / Image / Video / ICC_Profile / Template / White_Paper / Release_Notes / Service_Bulletin...), `tier` (1–9, per §7.3 — see below), `document_priority` (Mandatory | Preferred | Optional, per §7.4), `organization`, `publication_date`, `url`, `date_accessed`, `researcher`, `confidence` (High/Medium/Low/Pending), `version_or_revision`, `governance_tier` (Ch.6 §6.18)

`ICC_Profile`, `Template`, `White_Paper`, and `Release_Notes` are new source types from Ch.12 §12.16/§12.22's Download Center — none of these existed in earlier documentation-collection chapters, which focused on brochures/manuals/datasheets. Note §12.22's explicit rule: "only provide links to publicly available documents or documents for which permission has been obtained" — this is a `governance_tier`/copyright check that applies to every one of these new types the same as any other `DataSource`, not a separate rule.

**Tier scale expanded from 6 to 9 (Ch.7 §7.3 supersedes Ch.2 §2.4 — more granular, use this version):**

| Tier | Source Type | Typical Confidence |
|---|---|---|
| 1 | Official Manufacturer (site, brochure, datasheet, manuals, drawings, firmware notes) | Very High |
| 2 | Authorized Channel Partners (dealers, distributors, regional offices) | High |
| 3 | Industry Publications (Printweek, WhatTheyThink, SignLink...) | Medium–High |
| 4 | Trade Exhibitions (drupa, FESPA, ITMA, Labelexpo...) | Medium–High |
| 5 | Patent Databases (Google Patents, USPTO, WIPO, EPO, JPO) | High (engineering concepts only) |
| 6 | Academic & Research Publications | High |
| 7 | Business Information Sources (annual reports, SEC filings, registries) | High |
| 8 | Historical Archives (Wayback Machine, archived catalogs) | Medium |
| 9 | Community & Professional Sources (forums, LinkedIn, user groups) | Medium–Low |

Note patents (tier 5) and academic papers (tier 6) rank *above* historical archives and community sources despite being non-manufacturer — they're high-confidence for engineering *concepts*, not commercial specs, so `confidence` should be scoped to what's actually being sourced from them rather than applied blanket-high to every field. Ch.2's old 6-tier scheme folded patents/academic/business info into a single "Tier 4 trade press" bucket — this version separates them because they serve genuinely different research purposes (§7.3), not just different reliability levels.

**Image-specific fields** (when `source_type` = Image, per §7.6): `image_angle_tag` (Front | Rear | Left | Right | ControlPanel | PrintCarriage_ToolHead | InkSystem_ToolModules | MediaLoadingArea | VacuumTable | ElectricalCabinet | MaintenanceArea | FinishedSample | FactoryInstallation | Application), `resolution` (min. 1920×1080 per spec), `watermarked` (bool), `image_source_type` (Official | Third-Party)

**Video-specific fields** (when `source_type` = Video, per §7.7): `platform`, `duration`, `publisher` — in addition to the standard `url`/`publication_date`

**Governance tier (§6.18, extended by Ch.11 §11.21 and Ch.15 §15.8)** is a different axis from source-priority tier — it classifies *what kind of claim* the data is, not *how trustworthy the source* is:
`Public_Verifiable | Editorial_Content | Internal_Research_Note | AI_Generated_Explanation | Industry_Practice`

`AI_Generated_Explanation` is new as of Ch.11 §11.21 — it explicitly requires that "AI-generated content should always distinguish between verified data and AI-generated explanations" once natural-language search/comparison/advisor features exist. This is a distinct category from `Editorial_Content` (human-written analysis) — an AI-generated explanation of *why* a machine suits an application is a different provenance chain (model + prompt + underlying `FieldValue`s it drew on) than an engineer's written review.

`Industry_Practice` is new as of Ch.15 §15.8 — the Recommendation Engine requirement explicitly lists a third category alongside "verified compatibility" and "editorial recommendation": **"common industry practice."** This doesn't fit either existing bucket cleanly: it's not a manufacturer-verified fact (no datasheet says "commonly paired with"), and it's not one editor's individual judgment either — it's an aggregate observation about how the industry actually uses equipment (e.g. "UV flatbeds are commonly paired with Zünd cutters for rigid-substrate finishing" is a market pattern, not a single reviewer's opinion or a manufacturer spec). Kept as its own tier rather than folding into `Editorial_Content`, since conflating "one engineer's assessment" with "observed industry norm" would lose a real distinction in how confidently each should be presented.

**Reconciling with Ch.17 §17.4's "Editorial Content Categories" (A-D)** — Ch.17 gives a simpler, reader-facing 4-category classification: A = Verified Technical Specifications, B = Verified Historical Information, C = Editorial Engineering Analysis, D = AI-Generated Explanations. This maps onto `governance_tier` as: A and B are both `Public_Verifiable` (B is a sub-type — historical/lineage facts rather than technical specs, but equally verifiable and sourced), C = `Editorial_Content`, D = `AI_Generated_Explanation`. Ch.17's scheme doesn't mention `Internal_Research_Note` or `Industry_Practice` because it's describing what a *reader* sees, not the full internal governance model — those two remain internal/backend distinctions that never surface as their own labeled category on a published page.

Only `Public_Verifiable` records should ever be surfaced as factual specifications on a published machine page. Filter on `governance_tier`, not `confidence` — a high-confidence internal note is still not a public spec.

**Missing-data sentinel values** — see §3's `FieldValue` definition for the full reconciled 6-value vocabulary (`Not_Publicly_Available | Under_Verification | Manufacturer_Not_Disclosed | Information_Pending | Not_Applicable | Unknown`). Not restated here to avoid the two copies drifting out of sync — this note existed as a standalone 4-value list through v0.8 and was superseded when Ch.9 §9.14 forced the reconciliation in v0.9; kept as a pointer rather than a second copy.

Filename convention for any linked document (§7.5, restated from Ch.6 §6.10): `Manufacturer_Model_DocumentType_Version_Year.pdf` (e.g. `Canon_Arizona2380_Brochure_2025.pdf`) — stored as `DataSource.filename`.

**Review cadence (Ch.7 §7.14, formalizing Ch.2 §2.14's Update Policy with explicit intervals)** — add to the entity being reviewed, not to `DataSource` itself:
```
ReviewSchedule {
  entity_type          // Machine | Manufacturer | RIP | Printhead
  review_cadence        // "12mo" (current machines) | "30d" (new launches) | "per_release" (software/firmware) | "24mo" (printheads) | "as_available" (discontinued) | "annual" (company info)
  last_reviewed_date
  next_review_due        // computed: last_reviewed_date + cadence
}
```

## 5. Change Log Entry — Audit Trail (Ch.2 §2.13, extended by Ch.15 §15.18 Human-in-the-Loop and Ch.17 §17.16 Community Contributions)

One row per field modification, append-only:

`change_id`, `machine_id`, `field_name`, `previous_value`, `new_value`, `research_date`, `researcher` -> `Contributor` (was a plain string, now resolves to `Contributor.contributor_id` as of Ch.17 §17.11), `source_id`, `reason_for_change`, `version`, `proposed_by` (Internal_Researcher | Community_Contributor | AI — extended from 2 to 3 values), `approval_status` (Auto_Applied | Pending_Review | Approved | Rejected)

**`proposed_by`/`approval_status` originated in Ch.15 §15.18**: "AI may suggest updates but should not publish them automatically." Every other field-modification path in the schema (a researcher entering a verified spec, an editor writing a review) has always implicitly been human-initiated and immediately live; AI-suggested edits need a distinct state that sits in `Pending_Review` until a human approves it, rather than reusing the same immediate-write path. Critical update categories called out explicitly in §15.18 — new machine entries, corrected specifications, manufacturer changes, relationship changes, historical revisions — should never set `approval_status = Auto_Applied` when `proposed_by = AI`.

**`Community_Contributor` is new (Ch.17 §17.16)**: "community submissions shall undergo the same review process as internal research" — this is structurally the identical gating pattern as AI proposals, just a different source, so it reuses the same `proposed_by`/`approval_status` fields rather than inventing a parallel review mechanism for community input.

This is a straightforward append-only table in Postgres — no need for it to touch the graph layer.

---

## 6. Company Relationship (Ch.4 §4.7)

Distinct from `OEMPlatform` (which links machine-to-machine when a platform is rebadged): `CompanyRelationship` links manufacturer-to-manufacturer.

```
CompanyRelationship {
  from_manufacturer_id
  to_manufacturer_id
  relationship_type    // Acquisition | JointVenture | OEM_Manufacturing | TechnologyLicensing | StrategicPartnership | DistributionAgreement | PrivateLabelManufacturing | FormerlyKnownAs | ProductLine_Transfer
  product_line_id        -> ProductLine   (nullable — new in Ch.14; only set for ProductLine_Transfer)
  effective_date
  source_id            -> DataSource
}
```

Worked examples from Ch.4 §4.7:
```
EFI        -[ACQUIRED]->        Inca Digital
Kongsberg  -[FORMERLY_KNOWN_AS]-> Esko Kongsberg
```

**`ProductLine_Transfer` is new in Ch.14 §14.14** — its own worked example ("Esko → Former Product Line → Kongsberg") is subtly different from the two above: it's not a full company acquisition or rename, it's a specific *product line* moving between companies while both companies continue to exist independently. That needed the nullable `product_line_id` added — without it, there'd be no way to say *which* product line changed hands versus the whole company.

This is what feeds the Knowledge Graph's "who owns whom" queries, and it's also where Class C (Private Label) manufacturers get resolved: `RegionalBrand -[PRIVATE_LABEL_OF]-> OEMManufacturer` uses the same table rather than a separate one.

---


*This file covers §1–§6 (entity types, field definitions, and core sourcing model). For workbook/database mapping and the technology stack, see database_schema.md. For the full relationship graph and edge provenance, see knowledge_graph.md. For units, controlled vocabularies, and data types in one place, see data_dictionary.md.*
