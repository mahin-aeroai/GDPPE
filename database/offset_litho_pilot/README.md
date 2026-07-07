# Offset Litho Pilot

Phase 2 category pilot for **sheetfed offset lithography** — the highest-volume
commercial print process on earth (books, magazines, folding cartons, packaging).
Ninth category in GDPPE, and the largest process still missing until now.

## Scope: a planographic process, and a whole new spec vocabulary

Offset is *planographic*: ink and water compete on a flat plate; the inked image
transfers ("offsets") to a rubber blanket, then to the sheet. Nothing about inkjet,
toner, or screen applies. The new schema this category forces:

- **`sheet_format`** — B3 | A1 | A1_Plus | B1 — the size class that defines the machine.
- **`max_speed` in sheets per hour (sph)** — not m²/hr; one sheet per impression cycle.
- **`printing_units`** — the number of colour towers (each a plate/blanket/impression
  cylinder set), distinct from inkjet ink channels.
- **`perfecting`** — printing both sides in one pass via a sheet-reversal drum.
- **`coating_unit`, `plate_changer`, `dampening_system`** — the water/ink balance
  (dampening) is unique to litho and has no analogue anywhere else in GDPPE.

## Machines (5) — the format ladder across all three major makers

| UEID | Machine | Maker | Format | Max sph | Tier |
|------|---------|-------|--------|---------|------|
| GDPPE-OFF-HDB-SX52 | Speedmaster SX 52 | Heidelberg | B3 (37×52cm) | 15,000 | Compact commercial |
| GDPPE-OFF-KOM-G37 | Lithrone G37 | Komori | A1 (64×94cm) | 15,000 | Short-run commercial |
| GDPPE-OFF-RMGT-970 | RMGT 970 | RMGT | A1-plus / 8-up | 16,200 | Bridge (A1↔B1) |
| GDPPE-OFF-KOM-G40 | Lithrone G40 advance | Komori | B1 (72×103cm) | 16,500 | Large commercial |
| GDPPE-OFF-HDB-XL106 | Speedmaster XL 106 | Heidelberg | B1 (75×106cm) | 21,000 | Packaging flagship |

The ladder runs B3 → A1 → A1-plus → B1 → B1-flagship, and the three dominant
sheetfed makers (Heidelberg, Komori, RMGT) are all represented. Every machine is
sourced from manufacturer product pages or technical PDFs.

## Notable schema points

- **The "8-up" bridge format** (RMGT 970, `A1_Plus`) is a real market niche between
  A1 and B1 — 8-up A4 imposition at lower plate cost and footprint than a full B1.
  It earns its own `sheet_format` value.
- **The Speedmaster XL 106** carries the most `printing_units` of any machine in
  GDPPE — 2 to 19, up to 23 with coating/finishing towers.
- **LED-UV / H-UV instant curing** appears across the Japanese makers (RMGT was
  first to commercialise LED-UV offset) — a bridge to the UV category's curing axis.

## Preserved spec variances (shown, not resolved)

- **Speeds are mode-dependent:** straight vs perfecting differ on every machine
  (XL 106 21,000/18,000; G40 16,500/15,000; RMGT 16,200/15,000). Both preserved.
- **XL 106 units:** 2-19 base vs up to 23 with finishing towers.

## Validation

```bash
python3 scripts/validate_database.py database/offset_litho_pilot
```
All referential-integrity + uniqueness checks pass. Every spec value traces to a
source in `Sources.csv` fetched during the sourcing session (2026-07-06).
