# Digital Cutting Pilot Dataset

Phase 2, third category. 3 real digital cutters (Zünd, Esko Kongsberg, Summa), the first category with no printhead, no ink, and no curing/drying step at all — a deliberately maximal structural test of the schema, not just another printer.

## Why this category, specifically

UV Printing and Latex Printing are both "print something with ink" categories — different chemistry, same basic shape (printhead, ink, resolution, curing/drying). Digital Cutting has none of that: no ink system, no printhead, no curing domain. It uses interchangeable **tool modules** (knives, routers, creasing wheels) on a motion system, with vacuum hold-down and camera-based registration instead of ink chemistry. This was chosen specifically to stress-test whether the schema's core patterns (sourcing, provenance, conflicting values, category-specific specs) generalize to a genuinely different equipment shape, not just a different printing chemistry.

## What this pilot actually tested

**1. `Tool_Modules.csv` instead of `Printheads.csv` — exactly the case `CONTRIBUTING.md` anticipated.** This category has no printheads. It has interchangeable tool modules (Zünd's Universal Module/Wheel Knife Tool/Universal Router Tool, Esko's Multi-Cut Head/MultiCUT-HP spindle, Summa's Drag/Tangential/Router modules) with a new `USES_TOOL_MODULE` relationship type instead of `USES_PRINTHEAD`.

**2. The validator needed extending, and got extended.** `scripts/validate_database.py` previously only knew about `Printheads.csv`. Per `CONTRIBUTING.md`'s own instruction ("extend the checks... rather than writing a separate category-specific script"), it now also validates `Tool_Modules.csv` and `USES_TOOL_MODULE` relationships natively. Re-tested against both prior categories to confirm no regression.

**3. The validator also gained a real new capability: enum validation.** While building this pilot, a CSV-escaping bug (same class as before — an extra comma shifting a `resolution_note` into the `governance_tier` column) was caught by manual inspection, not the validator, because the old validator only checked that referenced IDs resolve — it never checked that a value in an enum-typed column was actually one of the valid enum values. Fixed by adding `check_enum_values()` and running it against `governance_tier` across all specification/relationship files.

**4. Running the upgraded validator against the two *already-committed* categories retroactively found 7 more instances of this exact bug** — 6 in the UV pilot, 1 in the Latex pilot — that had been sitting in already-pushed data since earlier sessions, undetected because the old validator had no way to see them. All 7 fixed in this same pass. This is the single best demonstration so far of why `CONTRIBUTING.md`'s validator requirement matters: it's not just for new data, improving the check retroactively finds problems in old data too.

## What's in here

| File | Rows |
|---|---|
| Manufacturers.csv | 3 (Zünd, Esko, Summa) |
| ProductFamilies.csv | 3 |
| Equipment_Master_Index.csv | 3 |
| Digital_Cutting_Specifications.csv | ~27 field values |
| Tool_Modules.csv | 8 |
| RIP_Software.csv | 3 |
| Sources.csv | 14 citations |
| Relationships.csv | 17 |

## Machines researched

| Machine | Cutting Area | Max Speed | Tool Positions | Registration |
|---|---|---|---|---|
| Zünd G3 M-2500 | 1330×2500mm | 1414mm/s (X/Y) | Up to 3 modules | ICC camera (optional) |
| Esko Kongsberg X24 | 1680×3200mm | 50m/min | Multi-cut head, multiple inserts | Camera (config-dependent) |
| Summa F1612 | 1600×1200mm | 1000mm/s | Up to 3 modules | OPOS-CAM (standard) |

## Genuine finding: unit heterogeneity within one category

Unlike UV/Latex printing where every machine reports speed in m²/hr, this category's sources report speed in three different unit conventions: Zünd in mm/s (linear axis speed), Esko in m/min (linear), Summa in mm/s (linear) — none in area-per-hour, because cutting speed is fundamentally a linear/path-following measurement, not an area-coverage one like printing. This is a real, structural difference from the print categories, not a documentation gap — `schema/data_dictionary.md`'s unit table already anticipated this exact case ("m/min for roll-fed/linear machines... m²/hr for area-coverage printers — choose per §9.5"), so no schema change was needed, but it's worth flagging as the value's field name reflects axis-specific speed (`max_speed_xy`) rather than a generic `max_speed`, unlike the printing categories.

## Genuine documentation gaps recorded honestly

- All three manufacturers' founding years are `Under_Verification` — available sources describe company history in relative terms ("over 20 years," "quarter century of expertise") rather than dated founding citations
- Exact model launch years not confirmed for any of the 3 machines
- Two tool-module relationships (Esko's MultiCUT-HP, Summa's Tangential/Router modules) are recorded at Medium confidence with explicit notes that they're confirmed as *available* for the product line but not confirmed as *included* on this specific researched configuration

## Category count sanity check

This category maps to `CAT-06` (Digital Cutting Systems) in the resolved 17-category taxonomy — confirmed against `schema/schema.md`'s decision record.
