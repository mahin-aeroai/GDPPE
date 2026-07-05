# GDPPE Database & Physical Architecture
### Companion to schema.md — Excel/CSV mapping, workbook structure, technology stack, build sequencing

*Extracted from the master schema for readers focused on implementation rather than the entity model itself. Source of truth for entity definitions remains schema.md.*

---

## 6a. Excel Master Index — Column Mapping (Ch.5 §5.15)

Ch.5 specifies a flat 21-column workbook as the human-facing view of the Master Equipment Index. Every column maps onto a field already in this schema — useful as a sanity check that the relational model can flatten cleanly when Chapter 6 gets to the Excel/CSV architecture:

| Excel Column | Schema Field |
|---|---|
| UEID | `Machine.ueid` |
| Category / Subcategory | `primary_category_node_id` / `secondary_category_node_id` -> `TaxonomyNode` |
| Manufacturer / Brand | `manufacturer_id` -> `Manufacturer`, `manufacturer_name` alias |
| Family / Series / Model / Generation | `family_name` / `series_name` / `model_name` / `generation` |
| Configuration | `configuration` |
| OEM Platform | `oem_platform_id` -> `OEMPlatform` |
| Country | `country_of_manufacture` |
| Launch Year / End Year | `release_year` / `discontinued_year` |
| Status | `machine_status` |
| Official Product URL / Brochure URL | `DataSource.url` where `source_type` = Product Page / Brochure |
| Research Status / Confidence / Last Verified | `ResearchStatus.overall_pct` / `FieldValue.confidence` (rolled up) / `FieldValue.last_verified_date` (max) |
| Notes | free text field on `Machine` |

Nothing here requires a new entity — it confirms the v0.5 model is a superset of the flat index, which is the right direction (relational model → flattened export), not the other way around.

---

## 6b. Master Workbook — 19-Sheet Mapping (Ch.6 §6.3–§6.4)

Ch.6 specifies a 19-sheet linked workbook as the physical implementation layer. Same exercise as §6a, at the whole-workbook level — confirms every sheet maps onto entities already in this schema, with no orphans in either direction:

| Sheet | Schema Entity/Table |
|---|---|
| Dashboard | Rollup view over `ResearchStatus` + `ManufacturerCompleteness`, no new entity |
| Equipment Master Index | `Machine` identity fields only (§2a/§3) — Ch.6 §6.6 repeats §5.6's "no specs here" rule |
| Manufacturers | `Manufacturer` (§1a) |
| Product Families | `Product Line / Series` |
| Machine Specifications | `Machine.technical_specs`, shaped by whichever `CategoryTemplate` applies (§3a) — one physical sheet per category per §6.7, now formalized by Ch.8's 17 TSRT |
| Printheads | `Printhead` |
| Ink Systems | `Ink / Consumable System` |
| RIP Software | `RIP / Software Platform` |
| Materials | `Substrate / Material` |
| Tool Modules | `Tool Module` *(new entity, added this version)* |
| Dealers | `Distributor / Service Network` |
| Service Centres | `Distributor / Service Network` (same entity, different role tag) |
| Documentation | `Data Source / Citation` |
| Images / Videos | `Data Source` with `source_type` = Image/Video, linked via UEID |
| Research Sources | `Data Source` (general) |
| Relationships | The relationship graph itself (§7) — lives in Neo4j, not a flat sheet, once migrated |
| Knowledge Graph | Same — graph layer, Excel sheet is a temporary flat export |
| Validation | Derived queries against `ResearchStatus`/`FieldValue`, not a stored entity |
| Change Log | `Change Log Entry` |

The only genuinely new entity out of all 19 sheets is `Tool Module` — everything else already existed in v0.5. That's a reasonable signal the model is converging rather than still discovering major gaps.


---

## 8. Suggested Stack (reusing your ORBITIQ-X pattern)

| Layer | Tool | Purpose |
|---|---|---|
| Canonical specs | **PostgreSQL** | Machine profiles, structured fields, provenance table |
| Relationship graph | **Neo4j** | Printhead reuse, lineage, competitive maps, component supply chains |
| Semantic search | **Qdrant** | Unstructured source docs — brochures, manuals, forum threads — for the "scattered documentation" problem |
| Cache/session | **Redis** | Same role as in ORBITIQ-X |

You already have the sync-only pipeline patterns (ingestion orchestrator, provenance service) built for CAEM — this is a very close structural analog, so a lot of that ingestion code is probably reusable almost as-is, just with a different entity taxonomy loaded in. The `FieldValue` and `ChangeLogEntry` tables map directly onto whatever your existing `ProvenanceService` already does for CAEM.

**Ch.6 §6.15 explicitly lists PostgreSQL, Neo4j, and Qdrant** among its target migration databases (alongside MongoDB, Elasticsearch, Weaviate, Pinecone) — so the stack above isn't just a convenient reuse of ORBITIQ-X, it's a direct hit on the spec's own stated compatibility goals. **Ch.14 §14.16 independently lists Neo4j again** (alongside Amazon Neptune, Azure Cosmos DB/Gremlin, JanusGraph, Memgraph) as its graph-database target — third chapter now to name Neo4j specifically, so that choice is about as validated as anything in this document gets.

**Starting point per Ch.6 §6.1–§6.3, now given explicit phase numbers by Ch.16 §16.5**:

| Phase | Database Layer | Purpose |
|---|---|---|
| 1 | Excel / CSV / JSON | Initial implementation — matches §6b's 19-sheet workbook |
| 2 | PostgreSQL | Canonical specs, `FieldValue`, `ChangeLogEntry` |
| 3 | Neo4j | Relationship graph, `RelationshipProvenance` (§6c) |
| 4 | Elasticsearch | Keyword/faceted search — Ch.11 §11.13's filters (Print Width, Speed, Ink Type...) |
| 5 | Vector Database (Qdrant/Weaviate/Pinecone) | Semantic search over `DataSource` text, AI/GraphRAG |

**Two distinct search technologies, not one** — Ch.16 separates Elasticsearch (Phase 4, keyword/faceted) from the vector database (Phase 5, semantic). Earlier versions of this doc used "Qdrant" loosely for "search index" without distinguishing these; going forward, `searchable`/`filterable` field flags (§3b) map to Elasticsearch, while semantic/NL search and GraphRAG (Ch.14 §14.17) map to the vector DB — same underlying `FieldValue`/`DataSource` data, indexed twice for two different query patterns.

**Ch.15 §15.5's Hybrid Search Architecture confirms this four-way split exactly**, independently arriving at Keyword (→ Elasticsearch), Structured Database (→ Postgres), Vector (→ Vector DB), and Knowledge Graph (→ Neo4j) as four distinct retrieval modes that get merged into one response. Two chapters landing on the identical four-layer split without either referencing the other is a good sign the architecture is sound rather than arbitrary.

**Frontend (Ch.16 §16.5)**: React + Next.js + TypeScript + Tailwind, D3.js for the interactive diagrams from Ch.12 §12.11, Three.js flagged explicitly as future (likely for the Digital Twin concept in Ch.13 §13.9/Ch.16 §16.23 Phase 6). This is presentation-layer detail — no schema impact, noted here only because it's the first chapter to name specific frontend tech rather than describing requirements abstractly.

If you're following the phased sequencing literally, the practical move is a 19-sheet Excel/Google Sheets workbook matching §6b first, then writing the ingestion pipeline to read that workbook into Postgres once the pilot category (see below) is populated, then Neo4j, then the two search layers — rather than standing up the full stack before a single machine is researched.

---

## 9. Where to Start (practical sequencing)

1. **Load `Manufacturer` records before any `Machine` records** — Ch.4 §4.1 explicitly calls the Manufacturer Directory "the backbone" that every other record links to; this is now the true root of the ingestion order, ahead of even the taxonomy tree.
2. **Load the 17-category `TaxonomyNode` tree next, with its `CategoryTemplate` attached** — tiny, stable dataset, and both `Manufacturer.category_node_ids[]` and `Machine.primary_category_node_id`/`technical_specs` depend on it. As of Ch.10, this step now includes writing category-specific engineering domain weights (§10.7), not just the category names and section groups.
3. **Pilot one category first** — pick UV flatbeds or wide-format latex (well-documented, active market, and the only template with a fully worked field list in Ch.8) rather than trying to model all categories at once.
4. **Build the Printhead + Ink cross-reference tables before the full Machine schema** — highest-leverage, lowest-volume dataset (maybe 30-50 printhead models cover most of the market) and every Machine entity will hang off it.
5. **Stand up `DataSource`, `FieldValue`, and `ChangeLogEntry` before ingesting a single machine** — retrofitting field-level sourcing after the fact is painful; you learned this lesson already on the "unverified BI Copilot metrics" issue, and Ch.2 makes it a hard requirement (§2.2 principles 2–3) rather than a nice-to-have.
6. **Resolve `CompanyRelationship` and `OEMPlatform` during Manufacturer research (Ch.4 §4.8 steps 6–7, Ch.2 §2.5 step 8), not after** — both research workflows already put acquisitions/OEM-variants as explicit steps; wire the entity checks into those steps so duplicates and orphaned lineage never get created in the first place.
7. **Assign the UEID only after duplicate detection passes (Ch.5 §5.17, §5.21)** — the UEID is permanent once issued, so it's the last step of registration, not the first; run manufacturer/family/series/model/OEM-platform/regional-naming checks before generating it.
8. **If any pilot data was already tier-tagged 1–6 under the old Ch.2 scheme, remap to the Ch.7 9-tier scale before scaling up** — tiers 3–6 under the old scheme split into 6 distinct tiers now (industry press, trade shows, patents, academic, business filings, archives), and patents/academic sources need their `confidence` scoped to engineering concepts rather than inherited as blanket-high.
9. **Stand up `ReviewSchedule` alongside `FieldValue`/`ChangeLogEntry`**, not after — Ch.7 §7.14's cadence table (12mo machines, 30 days for new launches, per-release for software/firmware, 24mo printheads) only has teeth if `next_review_due` exists from the first record, otherwise the backlog silently grows unnoticed.
10. **Write the UV Printing `CategoryTemplate` before ingesting any UV machine** — both Ch.8 (field lists) and Ch.10 (mandatory/recommended/advanced/factory tiers, §10.5 Category 1) give UV Printing the fully worked treatment; the other 16 categories will need the same before their pilot rounds, but UV is doubly unblocked now.
11. **Load the controlled vocabularies and preferred-term/synonym lists (Ch.9 §9.4, §9.7) before writing any `CategoryTemplate` field definitions** — the field definitions reference these by ID (`controlled_vocabulary_id`) and by `preferred_term`, so they need to exist first, not get invented ad hoc per template as you go category by category.
12. **Write each category's `CategoryCompletenessMatrix` alongside its `CategoryTemplate`, not after** — Ch.10 §10.7's domain weights only work if defined before the first machine in that category is scored, otherwise early records get scored against a matrix that didn't exist yet when they were published.
13. **Set `searchable`/`filterable` flags on field definitions when writing each `CategoryTemplate`, not as a retrofit before launch** — Ch.11 §11.13's filter list (Print Width, Speed, Ink Type, Price Range, Country, Year...) is specific enough to decide these flags at template-authoring time; deciding it later means re-indexing the whole category.
14. **`EditorialReview`, `HistoricalEvent`, `EngineeringScorecard`, `ApplicationSuitability`, `TCOProfile`, and `ComparisonReport` can all wait until after a category's `Machine` records are populated** — these are additive commentary/comparison layers, not blockers; a machine page is functional without them, so they're reasonable to backfill once the verified-spec pipeline for a category is already running. `TCOProfile` in particular depends on `FieldValue`-sourced cost data that's often genuinely unavailable — don't let it block the base record.
15. **Attach `RelationshipProvenance` to judgment relationships (`COMPATIBLE_WITH`, `COMPETES_WITH`, `REPLACES`) from the very first edge written, not retroactively** — Ch.14 §14.20 is explicit that unsourced relationships aren't verified facts; structural relationships (`MANUFACTURED_BY`, `USES_PRINTHEAD`) can inherit provenance from the node fields they're derived from, so don't over-engineer those, but the judgment ones need it built in from day one of graph population.
16. **Load `ConfigurationOption` as a small controlled list before tagging any `Machine.configuration_option_ids[]`** — same pattern as the taxonomy tree and controlled vocabularies: cheap, stable, and everything downstream references it by ID.
17. **Gate publish on `review_status = Published`, not just `ResearchStatus.qa_checklist_passed`** — per Ch.16 §16.10, a machine's underlying data can be fully verified while its `EditorialReview`/`ComparisonReport` is still in draft; these are two independent gates now, and the HTML generation pipeline (§16.13, "manual editing of generated pages shall be avoided") should check both before a page goes live.
18. **Build `ChangeLogEntry.proposed_by`/`approval_status` before any AI research-assistant feature goes live, not after** — Ch.15 §15.15's AI Research Assistant (flagging outdated records, suggesting verification priorities) and §15.18's Human-in-the-Loop rule assume this gate already exists; retrofitting it after AI features ship risks a period where AI suggestions and human edits are indistinguishable in the audit trail.
19. **Stand up `Contributor` before backfilling any existing `researcher`/`author` string fields** — every prior chapter's entities (`DataSource`, `EditorialReview`, `ComparisonReport`, `ChangeLogEntry`) used plain name strings; migrating those to `Contributor.contributor_id` references is a one-time data-migration cost that only grows if deferred, and `RecordGovernance`'s segregation-of-duties rule (§17.9) can't be enforced at all until `Contributor` exists.
20. **`KnownIssue`, `TroubleshootingEntry`, and `MaintenanceRecommendation` are second-wave content, not pilot-category blockers** — service/failure data is typically the hardest to source (often factory-only per the availability-class model in §3a) and least urgent for a machine page's core value; reasonable to build the entities now but not prioritize populating them until the base spec pipeline for a category is mature.
21. **Defer Finishing Equipment and Components** to a second pass — they're real entities but not on the critical path for the core encyclopedia value.
