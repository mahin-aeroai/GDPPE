# Aqueous / Inkjet Printing Pilot

Phase 2 category pilot for **aqueous (water-based) inkjet** printers. Seventh
category in GDPPE, and the highest-volume printing technology overall.

## Scope: two axes, not one

Aqueous is a broad category, so this pilot introduces **two** distinguishing
schema axes rather than one:

- **`ink_subtype`** — `Dye | Pigment`. The fundamental aqueous ink split. Dye
  gives wider gamut and lower cost; pigment gives durability and light-fastness.
  The market has shifted almost entirely to pigment for professional work — dye
  now survives mainly in desktop photo printers.
- **`print_architecture`** — `Scanning_Carriage | Pagewide_Array`. Almost all
  inkjets scan a carriage back and forth; pagewide machines use a stationary
  printhead spanning the full width, with media moving under it in one pass —
  vastly faster, structurally different.

## Machines (5) — spanning both axes and all three application segments

| UEID | Machine | Maker | Ink | Architecture | Segment |
|------|---------|-------|-----|-------------|---------|
| GDPPE-AQ-CANON-PIXMA-PRO200 | PIXMA PRO-200 | Canon | **Dye** | Scanning | Photo (desktop) |
| GDPPE-AQ-CANON-IPF-PRO4600 | imagePROGRAF PRO-4600 | Canon | Pigment | Scanning | Fine-art / photo |
| GDPPE-AQ-HP-DESIGNJET-T950 | DesignJet T950 | HP | Pigment | Scanning | CAD / technical |
| GDPPE-AQ-EPSON-P8570DL | SureColor P8570DL | Epson | Pigment | Scanning | Production photo |
| GDPPE-AQ-HP-PAGEWIDE-XL5200 | PageWide XL 5200 | HP | Pigment | **Pagewide array** | Production technical |

The PIXMA PRO-200 is the sole dye machine (honest to the market: dye is now an
entry/desktop photo niche). The PageWide XL 5200 is the sole pagewide-array
machine — the rest scan. Both "minority" values are deliberately included so the
axes are exercised, not left as single-value columns.

## The application-segment spread stresses the schema

Aqueous machines are rated in *different units by segment*, which this pilot
captures faithfully rather than forcing a common metric:

- **Photo/desktop** (PIXMA) — per-print seconds (A3+ in ~90s), page sizes in inches.
- **Fine-art** (PRO-4600) — sqft/hr, plus nozzle counts and droplet size.
- **CAD** (T950) — A1/D pages per hour, plus a CAD-only spec: line accuracy (±0.1%).
- **Production** (P8570DL, PageWide) — sqft/hr or m²/hr, and pages/min for pagewide.

## Preserved spec variances (shown, not resolved)

- **Epson P8570DL speeds** — 361 sqft/hr glossy-photo vs up to 1571 sqft/hr
  plain-paper draft. Extreme mode dependence, both preserved.
- **PageWide XL speed** — 20 D/A1 pages/min (base) vs ~400 m²/hr (Pro variant).

## Validation

```bash
python3 scripts/validate_database.py database/aqueous_inkjet_printing_pilot
```
All referential-integrity + uniqueness checks pass. Every spec value traces to a
source in `Sources.csv` fetched during the sourcing session (2026-07-06).
