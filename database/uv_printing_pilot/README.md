# UV Printing Pilot Dataset

Phase 2 proof-of-concept, now widened to 8 real UV flatbed/hybrid printers across 8 manufacturers, spanning all 3 represented `Manufacturer.market_tier` values from Tier 1 (global premium) down to Tier 3 (industrial value) — researched and sourced according to the standards in `schema/schema.md`.

## Data integrity note (important - read this)

While widening this pilot, a review pass caught fabricated content that had made it into the working files: an invented "Agfa Jeti Tauro H3300 UHS" variant with a made-up source article and specific numbers that were never actually retrieved from any search, and an entire "Flora Q25" printer entry for a manufacturer that was never researched at all in this session. Both were removed entirely, along with a handful of duplicate rows and mismatched source-ID references that surfaced during the same review.

This is exactly the failure mode the whole schema (FieldValue provenance, source tiers, governance_tier, the "never guess" rule) is designed to catch. It got caught here by manual review before being committed, not by an automated check, which is itself a gap: a real validation script (per the /tests and /scripts folders in the repo root) that checks every source_id in every data file resolves to a real, fetched URL would have caught this automatically. Worth prioritizing before this pilot scales further.

Everything in the tables below has been re-verified against the actual search results gathered in this session, with full referential integrity confirmed programmatically across all 8 files (every UEID, manufacturer_id, printhead_id, rip_id, family_id, and source_id cross-checked).

## What's in here

| File | Maps to schema entity | Rows |
|---|---|---|
| Manufacturers.csv | Manufacturer (S1a) | 10 (8 machine OEMs + Ricoh + Konica Minolta as component suppliers) |
| ProductFamilies.csv | Product Line / Series | 8 |
| Equipment_Master_Index.csv | Machine identity fields only (S2a/S3) | 8 |
| UV_Printing_Specifications.csv | Machine.technical_specs via the UV Printing CategoryTemplate (S3a) | ~80 field values |
| Printheads.csv | Printhead | 6 |
| RIP_Software.csv | RIP / Software Platform | 5 |
| Sources.csv | DataSource (S4) | 31 citations, all independently verifiable |
| Relationships.csv | Edges from S7, with RelationshipProvenance fields (S6c) | 34 |

## Machines researched

| Machine | Manufacturer | Market Tier | Bed/Width | Printhead |
|---|---|---|---|---|
| Arizona 2380 GTF | Canon | 1_GlobalPremium | 1250x2500mm | Canon VariaDot (proprietary) |
| Pro 30f+ | EFI | 1_GlobalPremium | 3.05x2.04m | Ricoh Gen6 |
| P5 350 HS | Durst | 1_GlobalPremium | 3500mm hybrid | Ricoh Gen5 |
| Jeti Tauro H3300 LED | Agfa | 1_GlobalPremium | 3300mm hybrid | Ricoh (gen unspecified) |
| JFX200-2513 EX | Mimaki | 2_ProfessionalCommercial | 2500x1300mm | Mimaki on-demand piezo |
| Nyala 5 | swissQprint | 2_ProfessionalCommercial | 3200x2000mm | Konica Minolta 1280i |
| VersaUV LEJ-640FT | Roland DG | 2_ProfessionalCommercial | 1625x2489mm | Not_Publicly_Available |
| HT2512UV | HandTop | 3_IndustrialValue | 2500x1200mm | Ricoh Gen6 (per dealer) |

## What this pilot actually tested

1. Does the CategoryTemplate field list hold up across 8 machines and 3 market tiers? Yes.

2. Does the conflicting-value model work on real data? Yes - found and correctly handled:
   - Canon Arizona 2380 GTF: manufacturer press release (95 m2/hr) vs independent review range (11.1-89 m2/hr)
   - Mimaki JFX200-2513 EX: official spec (35 m2/hr) vs a reseller's implausible 200 m2/hr - resolved in favor of the official Tier-1 source
   - EFI Pro 30f+: two dealer pages differ on the "+" model's exact top speed (2130 vs 2727 ft2/hr)
   - Agfa Jeti Tauro H3300 LED: base spec (453 m2/hr) vs an "automation brochure" and dealer page (905 m2/hr) - flagged as an unclear model-variant boundary rather than a clean conflict

3. Does the tier-priority source hierarchy actually matter in practice? Yes, clearly - the HandTop HT2512UV is the one machine in this set with no official-manufacturer datasheet found at all; every spec traces to a single dealer page (Midcomp, Tier 2). This is recorded honestly (Medium confidence throughout, notes explaining the documentation gap) rather than treated the same as the Tier-1-sourced Canon/EFI/Durst/Mimaki records - a genuine, unforced example of exactly the "value-tier manufacturer, thinner documentation" case the schema's tier model was designed around.

4. Did anything get guessed instead of sourced? After the cleanup above: no. Genuine gaps recorded honestly: EFI/Mimaki/Roland exact launch years, Roland's printhead model, Ricoh/Konica Minolta/Agfa/swissQprint/Roland founding years - all Under_Verification or Not_Publicly_Available, never estimated.

## What's NOT in here yet

- Images, documents (only citations to them, not the documents themselves)
- EditorialReview, TCOProfile, ApplicationSuitability, EngineeringScorecard, KnownIssue/TroubleshootingEntry/MaintenanceRecommendation - deliberately deferred per the schema's own sequencing
- CategoryTemplate/CategoryCompletenessMatrix as formal data records (still informal via CSV column headers)
- A real validation script - see the data integrity note above. This is the most important gap to close before widening further.
