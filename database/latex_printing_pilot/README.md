# Latex Printing Pilot Dataset

Phase 2, second category. 3 real HP Latex printers, researched and sourced the same way as the UV pilot. This is the first real test of whether the schema generalizes *across* categories rather than just working well for the one category (UV Printing) that had a fully worked field list in Ch.8.

## What this pilot actually tested

**1. Does the field-name convention hold across a structurally different printing technology?** Mostly yes, with one real gap found (see below). Print width, speed, printhead, resolution, ink type/channels all carried over cleanly.

**2. Real schema gap found: the `UVCuringType` controlled vocabulary doesn't fit latex.** UV Printing's Template 1 has a "UV Curing" section with a vocabulary literally named `UVCuringType` (LED | Mercury | Hybrid | UV_Gel | Not_Applicable). Latex doesn't cure with UV light at all — it dries via radiant heat and forced airflow evaporating water from the ink. Rather than force a `Not_Applicable` value into a field that's asking the wrong question, this pilot used a new `drying_technology` free-text field for latex machines. **This is a naming/generalization gap in the original schema** (`schema/schema.md` §3a), built UV-first and not fully generalized when Ch.10 introduced other categories. Worth fixing properly before a third category: either rename `UVCuringType` to something technology-neutral (`CuringDryingType`) with values covering `UV_LED | UV_Mercury | Thermal_ForcedAir | Thermal_IR | Not_Applicable`, or keep them as genuinely separate fields since UV curing and thermal drying are different enough physical processes that conflating them into one vocabulary might not be right either. Flagging for a decision, not fixing unilaterally here.

**3. Manufacturer landscape structurally different from UV printing.** UV Printing's pilot had 8 machines across 8 different manufacturers. This category has 3 machines from **one** manufacturer (HP) — true latex ink chemistry is HP-proprietary technology, and no other major manufacturer makes a directly comparable product. The schema handles this fine (nothing breaks with a single-manufacturer category), but it's worth noting as a real finding: `Manufacturer.market_tier`, `CompanyRelationship`, and cross-manufacturer `COMPETES_WITH` relationships are far less useful in a category with this little competitive structure. No manufacturer-to-manufacturer relationships exist in this pilot's `Relationships.csv` for exactly this reason.

**4. The validator caught two real bugs before commit.** While writing `Latex_Printing_Specifications.csv`, two `value` fields contained unquoted commas inside parentheses (`HP 836 (Gen4, inferred)` and `...(7 cartridges, no white)`), which silently shifted every column after them — `confidence` values ended up in the `source_id` column. Running `scripts/validate_database.py` caught this immediately (`FAIL source_id: 2 dangling reference(s) -> High -> Medium`), which is exactly the kind of structural error the validator is designed to catch, distinct from the fabrication issue it can't catch. Both rows fixed by quoting the value field. This is a good real-world demonstration that the validator earns its place in the workflow even on routine data entry, not just fabrication.

**5. One inference caught and removed during review, not by the validator.** A `COMPETES_WITH` relationship between the 700W and R530 was written attributing it to a source that didn't actually make that comparison (Print Monthly compared the R530 to the R1000, not the 700W) — and conceptually, "competing" doesn't fit well for two products from the same manufacturer's own lineup anyway. Removed. A `PREDECESSOR_OF` relationship between two printhead types was also removed for the same reason — plausible-sounding but not actually sourced. Neither would have been caught by the validator, since both were structurally valid, just unsupported. This is the exact failure mode `CONTRIBUTING.md` step 5 exists for.

## What's in here

| File | Rows |
|---|---|
| Manufacturers.csv | 1 (HP) |
| ProductFamilies.csv | 3 |
| Equipment_Master_Index.csv | 3 |
| Latex_Printing_Specifications.csv | ~28 field values |
| Printheads.csv | 2 |
| RIP_Software.csv | 0 (header only — no RIP name confirmed for any machine in this category; HP's PrintOS is fleet management, not a RIP) |
| Sources.csv | 13 citations |
| Relationships.csv | 9 |

## Machines researched

| Machine | Segment | Width | Ink Channels | Printhead |
|---|---|---|---|---|
| HP Latex 700W | Entry production, roll-only | 64in / 1625mm | CMYKLcLm + White + Optimizer + Overcoat (9) | HP 836 |
| HP Latex R530 | Compact hybrid (rigid+roll) | 64in / 1600mm | CMYK + Lc + Lm + White(x2) + Optimizer + Overcoat (10) | HP 836 (inferred from ink generation) |
| HP Latex 1500 | Superwide industrial, roll-only | 126in / 3200mm | CMYK + Lc + Lm + Optimizer, no white (7) | HP Thermal Inkjet (generation unspecified, likely a different/simpler line) |

## Genuine documentation gaps recorded honestly

- Exact launch years for the R530 and 1500 are approximate/unconfirmed (`Under_Verification` / dated from indirect evidence)
- No RIP software name confirmed for any of the 3 machines
- R530's printhead model number is inferred from ink-generation matching, not independently stated
- 1500's printhead generation/model number not found in any source reviewed

## Category count sanity check

This category maps to `CAT-02` (Latex Printing Systems) in the resolved 17-category taxonomy — confirmed against `schema/schema.md`'s decision record.
