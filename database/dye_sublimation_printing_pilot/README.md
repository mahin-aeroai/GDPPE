# Dye-Sublimation Printing Pilot

Phase 2 category pilot for **dye-sublimation** printers. Sixth category in GDPPE.

## Scope: the sublimation process, across the workflow axis

Dye-sublimation's structurally distinguishing feature isn't ink chemistry (it's
all disperse-dye) but **workflow** — how the image gets onto the fabric:

- **Transfer** — print onto paper, then heat-press (calender) onto polyester.
- **Direct** — print straight onto fabric, fix inline or separately.
- **Dual** — the machine does both.

This is the new controlled vocab this category forces: `sublimation_workflow`.

## Machines (5) — spanning both workflows and the full tier ladder

| UEID | Machine | Maker | Workflow | Tier |
|------|---------|-------|----------|------|
| GDPPE-DYESUB-SAWGRASS-SG1000 | SG1000 | Sawgrass | Transfer | Entry (desktop) |
| GDPPE-DYESUB-EPSON-F6470 | SureColor F6470 | Epson | Transfer | Mainstream |
| GDPPE-DYESUB-ROLAND-RT640 | Texart RT-640 | Roland DG | Dual | Mainstream |
| GDPPE-DYESUB-MIMAKI-TS330-1600 | TS330-1600 | Mimaki | Transfer | Industrial |
| GDPPE-DYESUB-DURST-P5-TEX-ISUB | P5 TEX iSUB | Durst | Dual (direct-primary) | High-industrial |

The tier spread is deliberately wide and stresses the schema: the Sawgrass is a
**desktop** unit rated in prints/hr and page sizes (11x17 in), while the Durst is
a **3.3 m industrial press** rated at 383 m2/hr. Same category, ~1000x throughput
range — a real test of whether the speed/size fields generalise.

## Schema addition: `sublimation_workflow`

Controlled vocab: `Transfer | Direct | Dual`. Note that no machine here is
*Direct-only* — even the direct-capable machines (Roland RT-640, Durst iSUB) also
print transfer paper, so they're `Dual`. That's honest to the market: pure
direct-to-fabric-only machines are rare because transfer remains the flexible
default. The `Direct` value exists in the vocab for future machines even though
this pilot doesn't use it alone.

The Durst also introduces `inline_fixation` — its iSUB technology fuses the dye
into fabric inside the same machine (no separate calender), the only such machine
in the pilot. That ties into the finishing axis shared with Digital Cutting.

## Preserved spec variances (shown, not resolved)

- **Speeds are mode-dependent** across every roll machine (max vs draft/production
  passes) — Roland 32.6 vs 22 sqm/hr, Mimaki 135 vs 69, all preserved as conflicts.
- **Colour count** — most machines offer 4-colour base or 6/8-colour extended
  (incl. fluorescent). Base recorded, extended preserved.
- **Sawgrass resolution** — 1200x1200 standard vs 4880x1200 ultra-fine mode.

## Validation

```bash
python3 scripts/validate_database.py database/dye_sublimation_printing_pilot
```
All referential-integrity + uniqueness checks pass. Every spec value traces to a
source in `Sources.csv` fetched during the sourcing session (2026-07-06).
