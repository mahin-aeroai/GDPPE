# Screen Printing Pilot

Phase 2 category pilot for **screen printing** presses. Eighth category in GDPPE,
and the **first non-inkjet, non-toner** process — the biggest schema test so far.

## Scope: a fundamentally different process

Screen printing forces ink through a stencilled mesh screen with a squeegee, one
screen per colour. Nothing about the inkjet spec model applies:

- **No printhead, no dpi/resolution, no ink cartridges.**
- Instead: **stations**, **colours** (= number of screens), squeegee/floodbar,
  print/index speed in *prints per hour*, **image area**, and registration type.

This validates that GDPPE's schema generalises past inkjet — the per-category
specification table absorbs an entirely different vocabulary without structural
change, exactly as intended.

## New axis: `automation_level`

Controlled vocab: `Manual | Automatic`. This is screen printing's defining
structural split, and **no inkjet category ever needed it** — every inkjet/toner
machine is automatic. A manual press has the operator rotate the carousel and pull
each squeegee stroke by hand; an automatic press indexes and prints under servo
control. The two are the same *process* at wildly different scales.

## Machines (4) — spanning the automation ladder

| UEID | Machine | Maker | Automation | Tier |
|------|---------|-------|-----------|------|
| GDPPE-SCRN-VASTEX-V2000HD | V-2000HD | Vastex | **Manual** | Entry / commercial |
| GDPPE-SCRN-MR-SPORTSMAN-EX | Sportsman EX | M&R | Automatic | Mid production |
| GDPPE-SCRN-ROQ-NEXT | NEXT | ROQ | Automatic | High production |
| GDPPE-SCRN-MR-CHALLENGER-III | Challenger III | M&R | Automatic | Industrial oversize |

All four are the major garment/textile press makers, all with authoritative
published specs. The ladder runs from a hand-operated Vastex to M&R's flagship
oversize Challenger III (up to 20 stations, 36×43 in image area).

## Documented gap: the industrial-graphic cylinder tier

Screen printing also has a large **industrial-graphic** branch — cylinder and
flatbed presses for decals, membrane switches, electronics, glass, and luxury
packaging (historically Sakurai, Thieme, Svecia, Sias). **This tier is deliberately
absent**, for an honest reason:

- The leading makers have largely **exited or discontinued** their graphic
  screen-press lines (Sakurai's current catalogue is signage/inkjet/laser, not
  screen presses). The market has moved much of this work to digital.
- What remains is almost entirely **used-equipment reseller and auction listings**
  — Tier-8/9 sources describing *specific second-hand units* (a 1995 machine with a
  particular dryer), not current model specifications, and inconsistent between
  sellers.

Per GDPPE's sourcing discipline, recording specs from those sources would break the
provenance guarantee — so the tier is logged here as a **known gap** rather than
fabricated. Populating it properly would need an authoritative manufacturer
datasheet or an independent lab measurement. The gap itself is useful signal: it
documents that this once-major category has largely left the new-equipment market.

## Screen-specific mechanisms captured

Details with no inkjet analogue: M&R's **Ink Dip** ink-retrieval system, the
**squeegee/floodbar** mechanics, per-colour **screens**, and ROQ's optional
**Hybrid** module that bolts inkjet onto a screen press (a bridge to the digital
categories).

## Validation

```bash
python3 scripts/validate_database.py database/screen_printing_pilot
```
All referential-integrity + uniqueness checks pass. Every spec value traces to a
source in `Sources.csv` fetched during the sourcing session (2026-07-06).
