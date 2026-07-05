# UV Printing Pilot Dataset

Phase 2 proof-of-concept: 4 real UV flatbed/hybrid printers, researched and sourced according to the standards in `schema/schema.md`. This is the first real test of whether the schema holds up against actual research, not just design on paper.

## What's in here

| File | Maps to schema entity | Rows |
|---|---|---|
| `Manufacturers.csv` | `Manufacturer` (§1a) | 5 (4 machine OEMs + Ricoh as a component supplier) |
| `ProductFamilies.csv` | `Product Line / Series` | 4 |
| `Equipment_Master_Index.csv` | `Machine` identity fields only (§2a/§3) — no specs, per Ch.6's rule | 4 |
| `UV_Printing_Specifications.csv` | `Machine.technical_specs` via the UV Printing `CategoryTemplate` (§3a) | 46 field values |
| `Printheads.csv` | `Printhead` | 4 |
| `RIP_Software.csv` | `RIP / Software Platform` | 3 |
| `Sources.csv` | `DataSource` (§4) | 17 citations |
| `Relationships.csv` | Edges from §7, with `RelationshipProvenance` fields (§6c) | 18 |

## Machines researched

- **Canon Arizona 2380 GTF** — 8-channel UV flatbed, 1250×2500mm bed, Canon's proprietary VariaDot piezo printheads
- **EFI Pro 30f+** — UV LED flatbed, 3.05×2.04m bed, Ricoh Gen6 printheads
- **Durst P5 350 HS** — UV LED hybrid (roll + board), 3.5m width, Ricoh Gen5 printheads
- **Mimaki JFX200-2513 EX** — UV LED flatbed, 2.5×1.3m bed, Mimaki's own on-demand piezo printheads

## What this pilot actually tested

1. **Does the CategoryTemplate field list hold up against real specs?** Yes — every field in Ch.8's UV Printing template (print width, printhead, drop size, ink channels, curing type, RIP) had a real, findable value for all 4 machines.

2. **Does the conflicting-value model work in practice?** Yes, and it found two genuine real-world conflicts, not staged examples:
   - **Canon Arizona 2380 GTF speed**: Canon's own press release says 95 m²/hr; an independent Printweek review says 11.1–89 m²/hr depending on quality mode. Recorded both — likely different measurement conditions (peak vs. quality-mode range), not a true contradiction.
   - **Mimaki JFX200-2513 EX speed**: Mimaki's own official spec page says 35 m²/hr; one reseller page says 200 m²/hr — a 5.7x discrepancy almost certainly a reseller error. Resolved in favor of the official source per the Ch.7/Ch.17 tier-priority rule (Tier 1 official docs > Tier 2 dealer pages).

3. **Did anything get guessed instead of sourced?** No — EFI Pro 30f+'s exact launch year and Mimaki JFX200-2513 EX's exact launch year weren't confirmable from the sources reviewed, so both are recorded as `Under_Verification` rather than estimated. Same for Ricoh's founding year, added only as a minimal placeholder since it's referenced as a printhead supplier, not a pilot-category machine OEM.

## What's NOT in here yet

- Images, documents (brochures/manuals/datasheets themselves — only their *citations* are recorded)
- `EditorialReview`, `TCOProfile`, `ApplicationSuitability`, `EngineeringScorecard` — deliberately deferred per the schema's own sequencing (§9), since these are additive layers, not blockers
- `KnownIssue`/`TroubleshootingEntry`/`MaintenanceRecommendation` — same reason, plus this kind of data is typically the hardest to source publicly
- `CategoryTemplate`/`CategoryCompletenessMatrix` as their own formal records — this pilot used the UV Printing field list informally; formalizing the template itself as data (not just documentation) is a reasonable next step

## Known gaps in this specific dataset

- Canon's exact founding/incorporation date for the Arizona-producing entity isn't public (it inherited history from Océ, acquired by Canon in 2010)
- EFI's founding year has a genuine 1988/1989 split across otherwise-reliable business history sources — recorded as 1988 per majority sourcing, noted in `Manufacturers.csv`
- Ricoh is included only as a minimal placeholder (printhead supplier reference) — not researched as a full manufacturer profile
