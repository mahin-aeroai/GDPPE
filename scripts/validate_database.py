#!/usr/bin/env python3
"""
GDPPE referential integrity validator.

Checks that every foreign-key-style reference across a category's CSV
files resolves to a real record. Does NOT verify that facts are true or
that sources are real URLs (that requires a fetch, not just a file check)
- it only catches structural gaps: dangling references, orphaned records,
missing entities.

This is a GENERIC validator, not specific to any one category. It expects
the standard file set from schema/database_schema.md's workbook mapping:

    Sources.csv                     (required)
    Manufacturers.csv                (required)
    Equipment_Master_Index.csv        (required)
    *_Specifications.csv               (one or more - e.g. UV_Printing_Specifications.csv,
                                        Latex_Specifications.csv, Digital_Cutting_Specifications.csv)
    Printheads.csv                      (optional - printing categories)
    Tool_Modules.csv                     (optional - cutting/finishing categories)
    RIP_Software.csv                      (optional)
    Relationships.csv                     (required)

Adding a new category folder under database/ that follows this naming
convention gets integrity checking for free - no changes to this script
needed for most categories. Printhead-based categories and tool-module-
based categories (cutters, routers) are both natively supported; if a
category needs a genuinely different entity type from either of these,
extend the CHECKS list below rather than writing a category-specific
script.

Run from the repo root:
    python3 scripts/validate_database.py database/uv_printing_pilot
    python3 scripts/validate_database.py database/latex_printing_pilot

Exit code 0 = clean. Exit code 1 = at least one integrity issue found.
"""
import csv
import sys
from pathlib import Path


def load_column(path, column):
    """Return the set of non-empty values in `column`(s) across a CSV file.
    `column` may be a single name or a list of names (checked per-row)."""
    values = set()
    if not path.exists():
        return values
    with open(path, newline='', encoding='utf-8') as f:
        cols = column if isinstance(column, (list, tuple)) else [column]
        for row in csv.DictReader(f):
            for c in cols:
                v = (row.get(c) or '').strip()
                if v:
                    values.add(v)
    return values


def load_column_where(path, value_col, filter_col, filter_value):
    """Return values of `value_col` for rows where `filter_col` == `filter_value`."""
    values = set()
    if not path.exists():
        return values
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row.get(filter_col) == filter_value:
                v = (row.get(value_col) or '').strip()
                if v:
                    values.add(v)
    return values


def check(label, used, defined, required=True):
    if not used and not defined:
        return True  # nothing to check, not an error (e.g. no printheads in this category)
    missing = used - defined
    if missing:
        print(f"  FAIL  {label}: {len(missing)} dangling reference(s)")
        for m in sorted(missing):
            print(f"          -> {m}")
        return False
    print(f"  OK    {label}: {len(used)} references, all resolve")
    return True


def check_enum_values(label, files_and_cols, valid_values):
    """Scan the given (file, column) pairs and flag any value not in valid_values.
    Catches structural corruption where a free-text note lands in an enum column
    (e.g. a resolution_note shifted into governance_tier because a file had an
    extra unnamed column) - a class of bug the referential-integrity checks above
    cannot see, since the corrupted value is still a non-empty string."""
    bad = []
    for path, col in files_and_cols:
        if not path.exists():
            continue
        with open(path, newline='', encoding='utf-8') as f:
            for i, row in enumerate(csv.DictReader(f), start=2):
                v = (row.get(col) or '').strip()
                if v and v not in valid_values:
                    bad.append((path.name, i, v))
    if bad:
        print(f"  FAIL  {label}: {len(bad)} value(s) outside the known enum")
        for fname, line, val in bad[:10]:
            shown = val if len(val) <= 80 else val[:77] + '...'
            print(f"          -> {fname}:{line}  '{shown}'")
        if len(bad) > 10:
            print(f"          ... and {len(bad) - 10} more")
        return False
    print(f"  OK    {label}: all values match the known enum")
    return True


def check_unique(label, path, column):
    """Fail if `column` has duplicate values in `path`. Catches duplicate
    primary keys - two rows sharing a UEID pass reference-resolution checks
    (the value still resolves) but are a real data bug."""
    from pathlib import Path as _P
    p = _P(path)
    if not p.exists():
        return True
    seen, dupes = set(), []
    with open(p, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            v = (row.get(column) or '').strip()
            if not v:
                continue
            if v in seen:
                dupes.append(v)
            seen.add(v)
    if dupes:
        print(f"  BAD   {label}: duplicate {column} -> " + ", ".join(sorted(set(dupes))))
        return False
    print(f"  OK    {label}: {len(seen)} unique {column}, no duplicates")
    return True


GOVERNANCE_TIERS = {'Public_Verifiable', 'Editorial_Content', 'Internal_Research_Note', 'AI_Generated_Explanation', 'Industry_Practice'}


def main(category_dir):
    p = Path(category_dir)
    if not p.exists():
        print(f"ERROR: {p} does not exist")
        return 1
    ok = True

    print(f"Validating {p}\n")

    # --- Sources ---
    # --- Primary-key uniqueness: every machine UEID must appear once ---
    ok &= check_unique("ueid uniqueness", p / 'Equipment_Master_Index.csv', 'ueid')

    sources = load_column(p / 'Sources.csv', 'source_id')
    used_sources = set()
    used_sources |= load_column(p / 'Manufacturers.csv', 'source_id')
    used_sources |= load_column(p / 'Printheads.csv', 'source_id')
    used_sources |= load_column(p / 'RIP_Software.csv', 'source_id')
    used_sources |= load_column(p / 'Relationships.csv', 'source_id')
    spec_files = sorted(p.glob('*_Specifications.csv'))
    for sf in spec_files:
        used_sources |= load_column(sf, ['source_id', 'conflicting_source_id'])
    ok &= check("source_id", used_sources, sources)

    # --- Manufacturers ---
    manufacturers = load_column(p / 'Manufacturers.csv', 'manufacturer_id')
    used_mfg = set()
    used_mfg |= load_column(p / 'Equipment_Master_Index.csv', 'manufacturer_id')
    used_mfg |= load_column(p / 'ProductFamilies.csv', 'manufacturer_id')
    used_mfg |= load_column(p / 'Printheads.csv', 'printhead_manufacturer_id')
    used_mfg |= load_column(p / 'Tool_Modules.csv', 'tool_manufacturer_id')
    used_mfg |= load_column(p / 'RIP_Software.csv', 'vendor_manufacturer_id')
    ok &= check("manufacturer_id", used_mfg, manufacturers)

    # --- Product families ---
    families = load_column(p / 'ProductFamilies.csv', 'family_id')
    used_fam = set()
    used_fam |= load_column(p / 'Equipment_Master_Index.csv', 'family_id')
    used_fam |= load_column_where(p / 'Relationships.csv', 'to_entity', 'relationship_type', 'PART_OF_SERIES')
    ok &= check("family_id", used_fam, families)

    # --- Printheads ---
    printheads = load_column(p / 'Printheads.csv', 'printhead_id')
    used_ph = load_column_where(p / 'Relationships.csv', 'to_entity', 'relationship_type', 'USES_PRINTHEAD')
    ok &= check("printhead_id (via USES_PRINTHEAD)", used_ph, printheads)

    # --- Tool Modules (cutting/finishing categories) ---
    tool_modules = load_column(p / 'Tool_Modules.csv', 'tool_module_id')
    used_tm = load_column_where(p / 'Relationships.csv', 'to_entity', 'relationship_type', 'USES_TOOL_MODULE')
    ok &= check("tool_module_id (via USES_TOOL_MODULE)", used_tm, tool_modules)

    # --- RIP / software ---
    rips = load_column(p / 'RIP_Software.csv', 'rip_id')
    used_rip = load_column_where(p / 'Relationships.csv', 'to_entity', 'relationship_type', 'REQUIRES_SOFTWARE')
    ok &= check("rip_id (via REQUIRES_SOFTWARE)", used_rip, rips)

    # --- Enum sanity: governance_tier ---
    # Catches a real bug class: a free-text note landing in this column because
    # a row had one more comma-separated value than the header defines. This is
    # invisible to the referential-integrity checks above since the corrupted
    # value is still non-empty - it just isn't one of the five valid values.
    gt_files = [
        (p / 'Relationships.csv', 'governance_tier'),
    ]
    for sf in spec_files:
        gt_files.append((sf, 'governance_tier'))
    ok &= check_enum_values("governance_tier", gt_files, GOVERNANCE_TIERS)

    # --- UEIDs: every machine should have specs ---
    ueids_emi = load_column(p / 'Equipment_Master_Index.csv', 'ueid')
    ueids_spec = set()
    for sf in spec_files:
        ueids_spec |= load_column(sf, 'ueid')
    if not spec_files:
        print("  WARN  No *_Specifications.csv file found in this category folder")
        ok = False
    else:
        ok &= check("UEIDs with specs", ueids_spec, ueids_emi)
    orphan_emi = ueids_emi - ueids_spec
    if orphan_emi:
        print(f"  WARN  {len(orphan_emi)} machine(s) in Equipment_Master_Index have NO specifications yet:")
        for u in sorted(orphan_emi):
            print(f"          -> {u}")

    print()
    if ok:
        print("All referential integrity checks passed.")
    else:
        print("Integrity issues found - see FAIL lines above. Do not commit until resolved.")
    print()
    print("NOTE: this script checks structure only, not truth. It cannot tell you whether")
    print("a source_id's URL was ever actually fetched, or whether a value is fabricated.")
    print("That still requires human review of anything added without a corresponding")
    print("search/fetch in the same working session - see CONTRIBUTING.md.")

    return 0 if ok else 1


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/validate_database.py <category_folder>")
        print("Example: python3 scripts/validate_database.py database/uv_printing_pilot")
        sys.exit(1)
    sys.exit(main(sys.argv[1]))
