# GDPPE — Global Digital Print Production Equipment Encyclopedia

An engineering-grade reference database for the digital print production industry, modeled as a knowledge graph with full provenance tracking on every fact and every relationship.

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
│   └── uv_printing_pilot/     Phase 2 pilot: 4 real UV flatbed/hybrid printers, fully sourced
├── templates/      Category-specific research templates — not yet populated
├── html/           Frontend — not yet populated
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
- **Phase 2 — Master Database**: pilot started. `database/uv_printing_pilot/` has 4 real UV flatbed/hybrid printers (Canon Arizona 2380 GTF, EFI Pro 30f+, Durst P5 350 HS, Mimaki JFX200-2513 EX) fully researched and sourced against the schema — including two genuine real-world conflicting-source cases, resolved per the schema's own tier-priority rules. See `database/uv_printing_pilot/README.md` for what this proved and what's still missing.

## Getting Started

1. Read `docs/Chapter01.md` through `Chapter17.md` for the full specification narrative.
2. Read `schema/schema.md` for the current data model — this is the single source of truth for entity/field definitions.
3. Read `database/uv_printing_pilot/README.md` to see the schema tested against real research.
4. See `CHANGELOG.md` for how the schema evolved chapter by chapter, and why specific design decisions were made.

## Contributing

See `docs/Chapter17.md` for editorial principles, contributor roles, and research ethics governing this project.
