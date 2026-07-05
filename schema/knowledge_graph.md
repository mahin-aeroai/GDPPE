# GDPPE Knowledge Graph
### Companion to schema.md — relationship types, edge provenance, graph database design

*Extracted from the master schema. Node/entity definitions live in schema.md; this file is the graph structure that connects them.*

---

## 6c. Edge Provenance (Ch.14 §14.20) — relationships need sourcing too, not just node attributes

Every relationship in §7 has been treated as a bare edge up to this version — `Machine -[USES_PRINTHEAD]-> Printhead` with no metadata of its own. Ch.14 §14.20 makes this explicit: **"every relationship shall include Source, Date Verified, Confidence Level, Relationship Type, Last Reviewed... relationships without evidence should not be treated as verified facts."** This is the same discipline `FieldValue` already enforces for node attributes, just never extended to edges.

Fix: every relationship instance in the graph carries its own provenance record, not just the two nodes it connects:

```
RelationshipProvenance {
  from_entity_id
  to_entity_id
  relationship_type       // e.g. USES_PRINTHEAD, COMPATIBLE_WITH, COMPETES_WITH
  source_id                 -> DataSource
  confidence                  // High | Medium | Low | Pending — same scale as FieldValue
  date_verified
  last_reviewed_date
  governance_tier               // Public_Verifiable | Editorial_Content | Internal_Research_Note | AI_Generated_Explanation | Industry_Practice
}
```

**Not every relationship needs equal scrutiny** — worth distinguishing two tiers rather than forcing full provenance on everything uniformly:
- **Structural/definitional relationships** (`MANUFACTURED_BY`, `USES_PRINTHEAD`, `BASED_ON_PLATFORM`) — these come directly from verified `Machine`/`Manufacturer` fields already sourced via `FieldValue`; provenance here is largely inherited, not independently researched.
- **Judgment relationships** (`COMPATIBLE_WITH`, `COMPETES_WITH`, `REPLACES`) — these require actual research or editorial judgment and need real, independent `RelationshipProvenance`, since two products "competing" or being "compatible" isn't self-evident from either node's own specs.

This distinction also directly answers Ch.14 §14.19's requirement that recommendations "clearly distinguish between verified compatibility, editorial recommendations, and AI-generated suggestions" — that's exactly what `governance_tier` on the edge does, extended from nodes to relationships rather than needing a separate mechanism.

---

## 7. Relationship Types (representative set — expect ~40-50 at full scale, same order of magnitude as CAEM's 76)

```
Machine        -[MANUFACTURED_BY]->        Manufacturer
Machine        -[USES_PRINTHEAD]->         Printhead
Machine        -[COMPATIBLE_WITH_INK]->    Ink
Machine        -[SUPPORTS_SUBSTRATE]->     Substrate
Machine        -[REQUIRES_SOFTWARE]->      RIP
Machine        -[USES_CURING_TECH]->       CuringTechnology
Machine        -[PART_OF_SERIES]->         ProductLine
Machine        -[SUCCEEDED_BY]->           Machine            (= REPLACED_BY in Ch.14 §14.6's terms — same relationship, formalizing both names since Ch.14 uses REPLACES/REPLACED_BY explicitly)
Machine        -[COMPETES_WITH]->          Machine
Machine        -[COMPATIBLE_WITH]->        Machine            (new, Ch.14 §14.6 — generic cross-brand compatibility, distinct from COMPETES_WITH (rivalry) and SUCCEEDED_BY (lineage); e.g. two machines that can run the same finishing workflow)
Machine        -[HAS_OPTION]->             ConfigurationOption (new — see below; replaces the free-text `configuration` field with real graph nodes per Ch.14's worked example: White Ink, Roll Option, Automation Kit)
Machine        -[INSTALLED_AT]->           Installation        (new, optional — Ch.14 §14.6, "optional where publicly documented"; never store non-public customer/site data)
Machine        -[PAIRS_WITH]->             FinishingEquipment
Machine        -[USED_FOR]->               Application
Machine        -[CERTIFIED_BY]->           Standard
Machine        -[SERVICED_BY]->            DistributorNetwork
Machine        -[SOURCED_FROM]->           DataSource
Machine        -[CONTAINS_COMPONENT]->     Component

Printhead      -[SUCCEEDED_BY]->           Printhead           (new — Ch.14 §14.10's Gen3→Gen4→Gen5→Gen6 lineage; same pattern as Machine.successor_model_id, Printhead never had it)
Printhead      -[MANUFACTURED_BY]->        PrintheadManufacturer
Printhead      -[USED_IN]->                Machine            (inverse — surfaces cross-brand reuse)
Printhead      -[COMPATIBLE_WITH]->        Ink

Ink            -[FORMULATED_FOR]->         Printhead
Ink            -[MANUFACTURED_BY]->        Manufacturer

Component      -[SUPPLIED_BY]->            Manufacturer
Component      -[USED_IN]->                Machine

ProductLine    -[MANUFACTURED_BY]->        Manufacturer

Machine        -[BASED_ON_PLATFORM]->      OEMPlatform        (Ch.2 §2.11 duplicate detection)
OEMPlatform    -[SOLD_AS]->                Machine            (inverse — one platform, many commercial names)
OEMPlatform    -[MANUFACTURED_BY]->        Manufacturer       (the actual builder, which may differ from the brand on the nameplate)

Machine        -[REGIONAL_VARIANT_OF]->    Machine            (Ch.5 §5.12 — voltage/language/regional branding, linked to primary model)

Machine        -[HAS_FIELD_VALUE]->        FieldValue         (per-field provenance, not a plain attribute)
FieldValue     -[SOURCED_FROM]->           DataSource
FieldValue     -[CHANGED_VIA]->            ChangeLogEntry
Machine        -[HAS_STATUS]->             ResearchStatus

Manufacturer   -[RELATED_TO]->             CompanyRelationship -> Manufacturer   (Ch.4 §4.7 — acquisitions, JV, OEM supply, licensing)
Manufacturer   -[HAS_COMPLETENESS]->       ManufacturerCompleteness
Manufacturer   -[OPERATES_IN]->            Region             (Ch.4 §4.4 geography)
Manufacturer   -[CLASSIFIED_AS]->          TaxonomyNode        (which of the 17 categories it plays in, via `category_node_ids[]`)

FinishingEquipment -[USES_TOOL_MODULE]->   ToolModule          (Ch.6 Sheet 10 — e.g. a Zünd cutter's UCT/EOT/KCT heads)
ToolModule     -[MANUFACTURED_BY]->        Manufacturer        (tool modules are frequently 3rd-party, not the cutter OEM)

Machine        -[HAS_REVIEW_SCHEDULE]->    ReviewSchedule      (Ch.7 §7.14 — cadence varies by entity type, not one blanket policy)
Manufacturer   -[HAS_REVIEW_SCHEDULE]->    ReviewSchedule
RIP            -[HAS_REVIEW_SCHEDULE]->    ReviewSchedule
Printhead      -[HAS_REVIEW_SCHEDULE]->    ReviewSchedule

TaxonomyNode   -[HAS_TEMPLATE]->           CategoryTemplate    (Ch.8 §8.2 — one template per category, drives Machine.technical_specs shape)
Machine        -[VALIDATED_AGAINST]->      CategoryTemplate    (via primary_category_node_id -> HAS_TEMPLATE)
TaxonomyNode   -[HAS_MILESTONE]->          TechnologyMilestone (Ch.8 §8.6 — category-level timeline, not machine-level)
CategoryTemplate -[HAS_COMPLETENESS_MATRIX]-> CategoryCompletenessMatrix (Ch.10 §10.7 — subdivides ResearchStatus.specifications_pct per category)

Machine        -[HAS_REVIEW]->             EditorialReview     (Ch.12 §12.17 — always Editorial_Content, never confused with FieldValue specs)
Machine        -[HAS_EVENT]->              HistoricalEvent     (typed per Ch.12 §12.19)
Manufacturer   -[HAS_EVENT]->               HistoricalEvent     (same entity, manufacturer-level events like Acquisition/Rebrand)

EditorialReview -[HAS_SCORECARD]->          EngineeringScorecard  (Ch.13 §13.6)
Machine        -[RATED_FOR]->               ApplicationSuitability -> Application  (Ch.13 §13.3/§13.11)
Machine        -[HAS_TCO_PROFILE]->         TCOProfile           (Ch.13 §13.10)
TCOProfile     -[EACH_FACTOR_SOURCED_AS]->  FieldValue            (every cost factor individually sourced/dated, not a plain number)
ComparisonReport -[COMPARES]->              Machine               (2+ machines, same category per §13.2 Principle 2)
ComparisonReport -[CITES]->                 DataSource

Machine        -[HAS_GOVERNANCE]->          RecordGovernance    (Ch.17 §17.5)
Manufacturer   -[HAS_GOVERNANCE]->          RecordGovernance
RecordGovernance -[OWNED_BY]->              Contributor
RecordGovernance -[REVIEWED_BY]->           Contributor         (technical_reviewer, editorial_reviewer — two separate edges to two Contributors per §17.9 segregation of duties)
ChangeLogEntry -[PROPOSED_BY]->             Contributor

Machine        -[HAS_KNOWN_ISSUE]->         KnownIssue          (Roadmap Phase 5)
Machine        -[HAS_TROUBLESHOOTING]->     TroubleshootingEntry
TroubleshootingEntry -[LIKELY_CAUSE]->      KnownIssue          (nullable)
Machine        -[HAS_MAINTENANCE_REC]->     MaintenanceRecommendation
```

The `Printhead -[USED_IN]-> Machine` inverse relationship is still the one I'd prioritize building first — it's what turns "HP uses a Ricoh printhead" and "Roland uses the same Ricoh printhead" into a queryable fact. The `OEMPlatform -[SOLD_AS]-> Machine` relationship is the second priority: it's the direct database implementation of Ch.2's explicit instruction to never create duplicate machine records for rebadged platforms.

**Worked example (Ch.3 §3.4)** — this is what a fully-populated Machine node's relationship set looks like in practice:

```
EFI Pro 30f+  -[USES_PRINTHEAD]->        Ricoh Gen5
EFI Pro 30f+  -[REQUIRES_SOFTWARE]->     EFI Fiery proServer
EFI Pro 30f+  -[COMPATIBLE_WITH_INK]->   UV LED Ink
EFI Pro 30f+  -[SUPPORTS_SUBSTRATE]->    Acrylic, PVC, Foam Board
EFI Pro 30f+  -[PAIRS_WITH]->            Zünd G3 Cutter
EFI Pro 30f+  -[PAIRS_WITH]->            Kala Laminator
```

Notice this single machine touches multiple Ch.10 §10.5 categories (CAT-01 printing, CAT-06 cutting, CAT-10 laminating, CAT-14 printheads, CAT-15 software) — which is exactly the cross-category linking Ch.3 §3.1 lists as a goal ("Knowledge Graph," "product comparison"). This is the concrete proof that category should live on the individual entity (Printhead, RIP, Substrate...) rather than forcing the whole bundle into one Machine-category field.

---

