# GDPPE — Global Digital Print Production Equipment Encyclopedia

An engineering-grade reference database for the digital print production industry, modeled as a knowledge graph with full provenance tracking on every fact and every relationship.

## Repository Structure

```
GDPPE
├── README.md
├── CONTRIBUTING.md Data-integrity workflow — read before adding anything to /database
├── CHANGELOG.md    Version history of the schema, chapter by chapter
├── docs/           Chapter-by-chapter specification (Chapter01.md ... Chapter17.md, ProjectRoadmap.md)
├── schema/         Entity/relationship data model (source of truth)
│   ├── schema.md              Core entity types & field definitions
│   ├── database_schema.md     Excel/CSV workbook mapping, tech stack, build sequencing
│   ├── knowledge_graph.md     Relationship types & edge provenance
│   └── data_dictionary.md     Units, controlled vocabularies, data types, missing-data sentinels
├── database/       Real data, structured per the schema
│   └── uv_printing_pilot/     Phase 2 pilot: 8 real UV flatbed/hybrid printers, fully sourced
├── scripts/
│   └── validate_database.py   Generic referential-integrity checker — run before every /database commit
├── templates/      Category-specific research templates — not yet populated
├── html/           Frontend — not yet populated
├── api/            API layer — not yet populated
├── ai/             AI/semantic search layer — not yet populated
├── assets/         Images, documents — not yet populated
└── tests/          Validation tests — not yet populated
```

## Status

- **Specification**: Chapters 1–17 processed (of an apparent ~40-chapter full spec, per the project roadmap memo)
- **Schema**: v0.19 — 36 core entity types, 5-value governance tier, 9-tier source hierarchy, full edge provenance model
- **Category count**: resolved at **17** (see `schema/schema.md` header for the full decision record) — `Ink` is a full entity but not a standalone category, since ink chemistry is intrinsically tied to its printing category rather than being a cross-category shared component like Printheads/RIP/Media.
- **Phase 2 — Master Database**: three categories now populated.
  - `database/uv_printing_pilot/` — **8 real UV flatbed/hybrid printers** across 3 market tiers (Canon, EFI, Durst, Agfa, Mimaki, swissQprint, Roland DG, HandTop)
  - `database/latex_printing_pilot/` — **3 real HP Latex printers**, first cross-category test. Led to a real schema fix (`UVCuringType` simplified to `Arc_Lamp | LED_Lamp`, resolved via direct domain correction)
  - `database/digital_cutting_pilot/` — **3 real digital cutters** (Zünd, Esko Kongsberg, Summa), the first category with no printhead/ink/curing at all. Uses `Tool_Modules.csv` instead of `Printheads.csv` — the exact case `CONTRIBUTING.md` anticipated. This also forced `scripts/validate_database.py` to gain real new capability: native Tool Module support, plus enum-value validation that retroactively found 7 pre-existing CSV bugs in the other two categories
  - See each category's `README.md` for full findings, and `CONTRIBUTING.md` for the workflow rules that govern adding more.

## Getting Started

1. Read `docs/Chapter01.md` through `Chapter17.md` for the full specification narrative.
2. Read `schema/schema.md` for the current data model — this is the single source of truth for entity/field definitions.
3. Read `database/uv_printing_pilot/README.md` to see the schema tested against real research.
4. **Before adding or editing anything under `database/`, read `CONTRIBUTING.md`** — it documents a real fabrication incident caught during Phase 2 and the resulting workflow rule (source everything in-session, run the validator before every commit).
5. See `CHANGELOG.md` for how the schema evolved chapter by chapter, and why specific design decisions were made.

## Contributing

See `CONTRIBUTING.md` for the data-integrity workflow, and `docs/Chapter17.md` for editorial principles, contributor roles, and research ethics governing this project.
