# GDPPE Data Dictionary
### Companion to schema.md — units of measurement, data types, controlled vocabularies, missing-data sentinels, acronym glossary

*Extracted from the master schema (originally scattered across §3 and §3a). This is the quick-reference version; schema.md remains the source of truth if anything here looks out of date.*

---

## Units of Measurement

**Reference: full unit standard (Ch.6 §6.12, expanded by Ch.9 §9.5 with secondary/context-dependent units)** — applies across every Section B template's numeric fields:

| Quantity | Primary Unit | Secondary/Alternative | Notes |
|---|---|---|---|
| Length | mm | m | |
| Area | m² | | |
| Speed | m²/hr | m/min | m/min for roll-fed/linear machines (cutters, calenders); m²/hr for area-coverage printers — choose per §9.5 |
| Weight | kg | t (metric ton) | |
| Pressure | bar | kPa, psi (optional) | |
| Temperature | °C | | |
| Power | kW | W | |
| Voltage | V | | |
| Current | A | | |
| Frequency | Hz | | |
| Resolution | dpi | | |
| Drop size | pL | | |
| Humidity | %RH | | new in Ch.9 — environmental fields (§9.12) |

**Approved acronym glossary (Ch.9 §9.15):**

`UV` Ultraviolet · `LED` Light Emitting Diode · `RIP` Raster Image Processor · `ICC` International Color Consortium · `PLC` Programmable Logic Controller · `HMI` Human-Machine Interface · `VFD` Variable Frequency Drive · `AGV` Automated Guided Vehicle · `ATC` Automatic Tool Changer · `ERP` Enterprise Resource Planning · `API` Application Programming Interface · `JDF` Job Definition Format · `OPC UA` Open Platform Communications Unified Architecture · `ΔE` Delta E Color Difference

---

## FieldValue Structure — Data Types & Unit Conversion

FieldValue {
  field_name
  data_type            // Text | Integer | Decimal | Boolean | Enumeration | Date | URL | Image | Document | Relationship — Ch.9 §9.3
  value                 // stored in GDPPE's standard unit (see unit table above)
  original_value         // as published by the source, before conversion — Ch.9 §9.6
  original_unit           // e.g. "in" when the datasheet said 100 inches
  confidence            // High | Medium | Low | Pending  — per Ch.2 §2.8
  source_id              -> DataSource
  conflicting_values[]   // {value, source_id}[]  — kept, never silently overwritten (§2.9)
  resolution_note         // free text: which value won and why (generation, date, config)
  last_verified_date
}
```

**Unit conversion policy (Ch.9 §9.6):** `value` always holds the converted, standardized-unit number; `original_value`/`original_unit` preserve exactly what the source published (e.g. `original_value: 100, original_unit: "in"` alongside `value: 2540` in mm). Never discard the original — that's the traceability the whole `FieldValue` model exists for.


---

## Missing-Data Sentinel Values

**Missing-data sentinel values — reconciling Ch.7 §7.10 and Ch.9 §9.14 into one 6-value vocabulary** (superset, since the two chapters' lists only partially overlap):
`Not_Publicly_Available | Under_Verification | Manufacturer_Not_Disclosed | Information_Pending | Not_Applicable | Unknown`

---

## Preferred Terms, Synonyms & Controlled Vocabularies

**Preferred term / synonym handling (Ch.9 §9.4):** every field definition inside `section_groups[]` carries a `preferred_term` (the name GDPPE always displays/stores under) plus a `synonyms[]` list for matching manufacturer language during research. Example: a datasheet says "Printable Width" — the researcher enters the value under the field whose `preferred_term` is `Print Width` and whose `synonyms[]` includes `"Printable Width"`. This keeps `field_name` in `FieldValue` consistent across manufacturers even when their brochures don't agree on what to call something.

**Controlled Vocabularies (Ch.9 §9.7)** — referenced by `controlled_vocabulary_id` on the relevant field definitions:

| Vocabulary | Values | Applies to |
|---|---|---|
| `UVCuringType` | Arc_Lamp \| LED_Lamp | Template 1 (UV Printing) "UV Curing" section — corrected per domain review: only two real curing mechanisms exist. `Mercury` is folded into `Arc_Lamp` (mercury-vapor is the standard arc-lamp implementation, not a separate mechanism); `Hybrid` removed since it described a machine capability (supports both lamp types) rather than a value for one machine's curing type — a machine with both would need two `FieldValue` records, one per installed lamp, not a third enum value; `UV_Gel` removed since it's an ink chemistry (already correctly present in `InkType`), not a curing mechanism, and was a category error in the original vocabulary. `Not_Applicable` removed from this vocabulary specifically — if UV curing doesn't apply to a machine (e.g. a latex printer, which dries via heat instead — see `drying_technology`, a separate field, not a merged vocabulary), the field is simply absent rather than populated with a sentinel value from a UV-specific enum. |
| `PrintheadTechnology` | Piezoelectric, Thermal_Inkjet, Continuous_Inkjet, MEMS, Electrostatic, Not_Applicable | `Printhead` entity |
| `InkType` | UV, Latex, Eco_Solvent, Solvent, Dye_Sublimation, Reactive, Acid, Pigment, Ceramic, Textile_Pigment, Water_Based, UV_Gel | `Ink` entity |
| `TonerType` | Dry_Toner \| Liquid_Toner | Template (Toner / Electrophotographic Printing) "Ink System" section. Closed two-value vocabulary capturing the physical toner delivery mechanism. `Liquid_Toner` is essentially HP-exclusive (LEP/ElectroInk); all other production electrophotographic presses researched use `Dry_Toner`. Paired with `TonerChemistry` below — same split rationale as the UV `curing type` vs `lamp` separation: one field for the mechanism class, one for the named implementation. |
| `TonerChemistry` | ElectroInk \| EA \| CV \| Simitri_V \| PxP | Template (Toner / Electrophotographic Printing) "Ink System" section. OPEN enumeration (unlike the closed `TonerType`) — vendor-named toner chemistries, extended as new ones are researched. Current values: `ElectroInk` (HP liquid), `EA` = Emulsion Aggregation (Xerox dry), `CV` (Canon dry), `Simitri_V` (Konica Minolta dry), `PxP` = polymerised chemical toner (Ricoh dry). This is deliberately named-tech rather than a generic taxonomy: it preserves the marketing/spec-sheet term for traceability while `TonerType` carries the queryable mechanism class. |
| `SolventType` | True_Solvent \| Eco_Solvent \| Mild_Solvent | Template (Solvent / Eco-Solvent Printing) "Ink System" section. Controlled vocab for the solvent-chemistry gradient. `True_Solvent` (aggressive carrier, e.g. Epson UltraChrome GS3), `Eco_Solvent` (glycol-ester carrier, indoor-safe, e.g. Roland Eco-Sol MAX), `Mild_Solvent` (between the two, e.g. Mimaki SS21, Mutoh UMS). Paired with `SolventInkLine` below -- same mechanism-vs-named-implementation split as TonerType/TonerChemistry. NOTE: the older `InkType` enum has only `Solvent` and `Eco_Solvent`; mild-solvent machines record `ink_type=Eco_Solvent` (nearest existing value) with `SolventType=Mild_Solvent` carrying the finer class. A future pass may add `Mild_Solvent` to `InkType`. |
| `SolventInkLine` | UltraChrome_GS3 \| Eco_Sol_MAX_2 \| SS21 \| Eco_Ultra_UMS | Template (Solvent / Eco-Solvent Printing) "Ink System" section. OPEN enumeration -- vendor-named solvent ink lines, extended as new ones are researched. Preserves the marketed ink name for traceability while `SolventType` carries the queryable chemistry class. |
| `ventilation_requirement` | (free text, e.g. `None required`) | Template (Solvent / Eco-Solvent Printing) "Environmental" section. First field capturing workplace ventilation / VOC handling. Recorded from the manufacturer's own statement (e.g. Epson's "no special ventilation or air purification is required"), meaningful because legacy true-solvent machines required extraction. |
| `MachineConfiguration` | Flatbed, Hybrid, Roll_to_Roll, Single_Pass, Object_Printer, Cylindrical, Conveyor, Static_Table | Template 1 "Machine Platform" section |

A Machine's Section B is not stored as fixed columns — it's `Machine.technical_specs: { [section_name]: { [field_name]: FieldValue } }`, validated at write-time against the `CategoryTemplate` its `primary_category_node_id` resolves to. This is the same "flexible field-set validated against a schema" pattern as `FieldValue`, just applied one level up.
