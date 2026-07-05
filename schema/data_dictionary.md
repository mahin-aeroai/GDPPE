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
| Noise | dB(A) | | A-weighted, not plain dB |
| Air flow | L/min | CFM (where appropriate) | new in Ch.9 |

**Approved acronym glossary (Ch.9 §9.15):**

`UV` Ultraviolet · `LED` Light Emitting Diode · `RIP` Raster Image Processor · `ICC` International Color Consortium · `PLC` Programmable Logic Controller · `HMI` Human-Machine Interface · `VFD` Variable Frequency Drive · `AGV` Automated Guided Vehicle · `ATC` Automatic Tool Changer · `ERP` Enterprise Resource Planning · `API` Application Programming Interface · `JDF` Job Definition Format · `OPC UA` Open Platform Communications Unified Architecture · `ΔE` Delta E Color Difference

---

## FieldValue Structure — Data Types & Unit Conversion

```
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

**Reconciling Ch.7 §7.10 and Ch.9 §9.14 into one 6-value vocabulary** (superset, since the two chapters' lists only partially overlap):
`Not_Publicly_Available | Under_Verification | Manufacturer_Not_Disclosed | Information_Pending | Not_Applicable | Unknown`


---

## Preferred Terms, Synonyms & Controlled Vocabularies

**Preferred term / synonym handling (Ch.9 §9.4):** every field definition inside `section_groups[]` carries a `preferred_term` (the name GDPPE always displays/stores under) plus a `synonyms[]` list for matching manufacturer language during research. Example: a datasheet says "Printable Width" — the researcher enters the value under the field whose `preferred_term` is `Print Width` and whose `synonyms[]` includes `"Printable Width"`. This keeps `field_name` in `FieldValue` consistent across manufacturers even when their brochures don't agree on what to call something.

**Controlled Vocabularies (Ch.9 §9.7)** — referenced by `controlled_vocabulary_id` on the relevant field definitions:

| Vocabulary | Values | Applies to |
|---|---|---|
| `UVCuringType` | LED, Mercury, Hybrid, UV_Gel, Not_Applicable | Template 1 (UV Printing) "UV Curing" section |
| `PrintheadTechnology` | Piezoelectric, Thermal_Inkjet, Continuous_Inkjet, MEMS, Electrostatic, Not_Applicable | `Printhead` entity |
| `InkType` | UV, Latex, Eco_Solvent, Solvent, Dye_Sublimation, Reactive, Acid, Pigment, Ceramic, Textile_Pigment, Water_Based, UV_Gel | `Ink` entity |
| `MachineConfiguration` | Flatbed, Hybrid, Roll_to_Roll, Single_Pass, Object_Printer, Cylindrical, Conveyor, Static_Table | Template 1 "Machine Platform" section |

A Machine's Section B is not stored as fixed columns — it's `Machine.technical_specs: { [section_name]: { [field_name]: FieldValue } }`, validated at write-time against the `CategoryTemplate` its `primary_category_node_id` resolves to. This is the same "flexible field-set validated against a schema" pattern as `FieldValue`, just applied one level up.

