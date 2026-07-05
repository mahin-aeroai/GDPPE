# Solvent / Eco-Solvent Printing Pilot

Phase 2 category pilot for wide-format **solvent and eco-solvent** sign/display
printers. Fifth category dataset in GDPPE.

## Scope: ink chemistry, across the solvent gradient

Defined by ink chemistry (solvent-based), spanning the real solvent gradient
rather than a single ink type: **True solvent -> Eco-solvent -> Mild solvent.**
These are genuinely different chemistries with different ventilation, odour, and
durability profiles, and the market positions machines explicitly along this axis.

## Machines (5)

| UEID | Machine | Maker | Solvent type | Ink line | Tier |
|------|---------|-------|-------------|----------|------|
| GDPPE-SOLV-EPSON-S80600 | SureColor S80600 | Epson | True solvent | UltraChrome GS3 | Premium (9-colour) |
| GDPPE-SOLV-EPSON-S60600 | SureColor S60600 | Epson | True solvent | UltraChrome GS3 | Mid (4-colour) |
| GDPPE-SOLV-ROLAND-RF640 | VersaEXPRESS RF-640 | Roland DG | Eco-solvent | Eco-Sol MAX 2 | Mainstream |
| GDPPE-SOLV-MIMAKI-CJV300-160P | CJV300-160 Plus | Mimaki | Mild solvent | SS21 | Mainstream (print+cut) |
| GDPPE-SOLV-MUTOH-VJ1638X | ValueJet VJ-1638X | Mutoh | Mild solvent | Eco-Ultra / UMS | Value-mainstream |

All four major sign-printer OEMs (Epson, Roland, Mimaki, Mutoh) are represented.
The two Epsons form a deliberate tier ladder within one true-solvent family.

## Schema additions this pilot

**Two-field solvent model** (mirrors the toner `TonerType`/`TonerChemistry` split):
- `solvent_type` -- controlled vocab: `True_Solvent | Eco_Solvent | Mild_Solvent`
- `solvent_ink_line` -- named ink: `UltraChrome_GS3 | Eco_Sol_MAX_2 | SS21 | Eco_Ultra_UMS`

`solvent_type` carries the queryable chemistry class; `solvent_ink_line` preserves
each vendor's marketed ink name. Note: the existing `InkType` enum has only
`Solvent` and `Eco_Solvent` (no `Mild_Solvent`), so mild-solvent machines record
`ink_type=Eco_Solvent` as the nearest existing enum while `solvent_type=Mild_Solvent`
carries the finer distinction. A future schema pass may add `Mild_Solvent` to `InkType`.

**`ventilation_requirement`** -- the first category where workplace ventilation /
VOC handling is a real, sourced spec field. Epson explicitly markets "no special
ventilation or air purification is required" precisely because legacy true-solvent
machines *did* need extraction. A genuine environmental spec, not marketing gloss.

## The Chinese industrial-value tier -- a documented gap

The largest solvent segment by unit volume is the Chinese wide-format tier --
white-label 3.2 m machines built around Konica 512i / 1024i printheads. One trade
estimate puts Asia-Pacific at ~65% of global production.

**This tier is deliberately absent.** It has no authoritative manufacturer spec
source -- only reseller and trading-company listings with inconsistent, unverifiable
specs. Per GDPPE's sourcing discipline, recording it would mean citing Tier-8/9
reseller pages as if authoritative. It is logged here as a known gap rather than
fabricated. Populating it properly would need a primary source (a real OEM datasheet
or an independent lab measurement), not an aggregated reseller listing.

## Preserved spec variances (shown, not resolved)

- **Epson speeds** -- banner vs adhesive-vinyl modes quoted separately. Mode-dependent.
- **Roland / Mutoh colour count** -- base CMYK or an extended-gamut option
  (8-colour Roland; 7-colour Mutoh). Base recorded, option preserved as conflict.
- **Mutoh speed** -- 48 sqm/hr billboard vs 36 speed-production; ~10-15 modes.

## Validation

```bash
python3 scripts/validate_database.py database/solvent_ecosolvent_printing_pilot
```
All referential-integrity + uniqueness checks pass. Every spec value traces to a
source in `Sources.csv` fetched during the sourcing session (2026-07-06).
