# GDPPE — Global Digital Print Production Equipment Encyclopedia

An engineering-grade reference database for the digital print production industry, modeled as a knowledge graph with full provenance tracking on every fact and every relationship.

**Live demo:** https://mahin-aeroai.github.io/GDPPE/frontend/ — a static, provenance-first browser for the pilot data (dashboard, per-category machine lists, full sourced spec sheets, and a side-by-side compare). Reads the same CSVs the validator checks, so it can't drift from the source of truth.

## Repository Structure

```
GDPPE
├── docs/           Chapter-by-chapter specification (Chapter01.md ... Chapter17.md, ProjectRoadmap.md)
├── schema/         Entity/relationship data model (source of truth)
│   ├── schema.md              Core entity types & field definitions
│   ├── database_schema.md     Excel/CSV workbook mapping, tech stack, build sequencing
│   ├── knowledge_graph.md     Relationship types & edge provenance
│   └── data_dictionary.md     Units, controlled vocabularies, data types, missing-data sentinels
├── database/       Real data, structured per the schema
│   ├── uv_printing_pilot/               Phase 2 pilot: 8 UV flatbed/hybrid printers
│   ├── toner_electrophotographic_pilot/ Phase 2 pilot: 6 production toner presses
│   ├── latex_printing_pilot/            Phase 2 pilot: 3 latex printers
│   └── digital_cutting_pilot/           Phase 2 pilot: 3 digital cutting tables
├── templates/      Category-specific research templates — not yet populated
├── frontend/       Static provenance-first browser (dashboard / category / machine / compare)
├── api/            API layer — not yet populated
├── ai/             AI/semantic search layer — not yet populated
├── assets/         Images, documents — not yet populated
├── scripts/        Ingestion/ETL scripts — not yet populated
├── tests/          Validation tests — not yet populated
└── CHANGELOG.md    Version history of the schema, chapter by chapter
```

## Status

- **Specification**: Chapters 1–17 processed (of an apparent ~40-chapter full spec, per the project roadmap memo)
- **Schema**: v0.19 — 36 core entity types, 5-value governance tier, 9-tier source hierarchy, full edge provenance model
- **Category count**: resolved at **17** (see `schema/schema.md` header for the full decision record) — `Ink` is a full entity but not a standalone category, since ink chemistry is intrinsically tied to its printing category rather than being a cross-category shared component like Printheads/RIP/Media.
- **Phase 2 — Master Database**: **4 category pilots** built and validated — UV Printing (8 machines), Toner/Electrophotographic (6), Latex Printing (3), and Digital Cutting (3): **20 machines, 77 sources**, all fully sourced. `scripts/validate_database.py` runs referential-integrity + primary-key uniqueness checks across every category. Each pilot's `README.md` documents what it proved, including data-integrity issues caught and fixed along the way.
- **Frontend**: `frontend/` is a dependency-free static site that reads the pilot CSVs directly — dashboard, per-category machine lists, full sourced spec sheets, and a side-by-side compare view. Live at https://mahin-aeroai.github.io/GDPPE/frontend/

## Getting Started

1. Read `docs/Chapter01.md` through `Chapter17.md` for the full specification narrative.
2. Read `schema/schema.md` for the current data model — this is the single source of truth for entity/field definitions.
3. Read `database/uv_printing_pilot/README.md` to see the schema tested against real research.
4. See `CHANGELOG.md` for how the schema evolved chapter by chapter, and why specific design decisions were made.

## Contributing

See `docs/Chapter17.md` for editorial principles, contributor roles, and research ethics governing this project.
