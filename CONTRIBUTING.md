# Contributing to GDPPE

This document exists because of a real incident, not as a precaution against a hypothetical one. During the initial widening of the UV Printing pilot dataset, fabricated content — an invented product variant with a made-up source article, and an entire machine entry for a manufacturer that was never actually researched — made it into the working files before being caught by manual review. Both looked internally consistent: correct formatting, plausible numbers, properly-shaped citations. Nothing about the file itself signaled a problem. Only checking each claim against what was actually retrieved caught it.

The rules below exist to make that kind of error structurally harder to ship, not just personally embarrassing when found.

## The core rule

**Never commit a change under `database/` without running the validator first, and never add a fact without a corresponding source you actually fetched in the same working session.**

```bash
python3 scripts/validate_database.py database/<category_folder>
```

This must print `All referential integrity checks passed.` before you run `git add`. If it doesn't, the commit doesn't happen until it does.

## What the validator catches, and what it can't

`scripts/validate_database.py` checks **structure**: every `source_id`, `manufacturer_id`, `printhead_id`, `rip_id`, and `family_id` referenced anywhere in a category's CSVs must resolve to a real record somewhere else in that same category. It also flags machines in `Equipment_Master_Index.csv` that have no corresponding row in a `*_Specifications.csv` file.

It **cannot** tell you whether a `source_id` points to a URL that was ever actually fetched, or whether a number is real. A fabricated record with an internally consistent (but invented) source citation passes this check every time — that's exactly what happened in the incident above. Catching that requires a human comparing the data file against the actual search/fetch results from the session that produced it, which is why the rule above is about sourcing discipline first and the validator second, not the other way around.

## Adding new data — the sequence

1. **Search or fetch first.** Every fact needs a source retrieved in the current working session before it goes into a CSV. Do not write a number, a founding year, a spec value, or a source citation from memory or "general knowledge" — if it's not in front of you from an actual search result, it doesn't go in the file yet.
2. **Record the source in `Sources.csv` with the real URL** before referencing it anywhere else. If you can't find a source for something, use the schema's own missing-data sentinels (`Not_Publicly_Available`, `Under_Verification`, etc. — see `schema/data_dictionary.md`) rather than guessing or leaving it blank.
3. **Write the data**, referencing sources by `source_id`.
4. **Run the validator.** Fix any `FAIL` lines before proceeding.
5. **Re-read what you wrote against the actual source text**, specifically checking for: numbers that don't appear in any retrieved source, source citations that describe an article/page you don't remember actually seeing, and entities (manufacturers, models) that were never the subject of a search this session. This step is the one the validator cannot do for you.
6. **Commit**, with a message that says what was added and, if relevant, what was verified vs. left as `Under_Verification`.

## Extending the validator for a new category

The validator is generic — it works on any folder under `database/` that follows the standard file-naming convention from `schema/database_schema.md` (`Sources.csv`, `Manufacturers.csv`, `Equipment_Master_Index.csv`, `<Category>_Specifications.csv`, `Relationships.csv`, plus optional `Printheads.csv`/`Tool_Modules.csv`/`RIP_Software.csv`). Adding a new category folder that follows this convention gets integrity checking for free.

`Printheads.csv`/`USES_PRINTHEAD` and `Tool_Modules.csv`/`USES_TOOL_MODULE` are both natively supported as of the Digital Cutting pilot — the first real case of a category needing a different core entity than printing categories. If a category needs a genuinely different entity type from either of these, extend the checks in `scripts/validate_database.py` rather than writing a separate category-specific script — the whole point of generalizing it was to have one validator, not one per category.

The validator also checks enum-typed columns (currently `governance_tier`) against their known valid values, not just referential integrity. This was added after a CSV-escaping bug (an extra comma shifting a resolution note into the `governance_tier` column) went undetected by the referential checks alone — the corrupted value was still a non-empty string, just not one of the five valid tiers. Running this check against already-committed data retroactively found the same bug in 7 rows across two earlier categories, none caught at the time they were written. If you add a new enum-typed field to the schema, consider whether it's worth adding to this check too.

## Governance context

This is a concrete implementation of the editorial and research-ethics principles in `docs/Chapter17.md` — specifically the requirements around source attribution, conflict resolution, and never treating unsourced claims as verified fact. See `schema/schema.md`'s `governance_tier` field and `schema/data_dictionary.md`'s missing-data sentinels for the underlying data model this workflow is built on.
