#!/usr/bin/env python3
"""
GDPPE referential integrity validator.

Checks that every foreign-key-style reference across the pilot dataset's
CSV files resolves to a real record. Does NOT verify that facts are true
or that sources are real URLs (that requires a fetch, not just a file
check) - it only catches structural gaps: dangling references, orphaned
records, missing entities.

Run from the repo root:
    python3 scripts/validate_pilot.py database/uv_printing_pilot

Exit code 0 = clean. Exit code 1 = at least one integrity issue found.
"""
import csv
import sys
from pathlib import Path


def load_column(path, column, multi=False):
    """Return the set of non-empty values in `column` across a CSV file."""
    values = set()
    if not path.exists():
        return values
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            cols = column if isinstance(column, (list, tuple)) else [column]
            for c in cols:
                v = (row.get(c) or '').strip()
                if v:
                    values.add(v)
    return values


def check(label, used, defined):
    missing = used - defined
    if missing:
        print(f"  FAIL  {label}: {len(missing)} dangling reference(s)")
        for m in sorted(missing):
            print(f"          -> {m}")
        return False
    print(f"  OK    {label}: {len(used)} references, all resolve")
    return True


def main(pilot_dir):
    p = Path(pilot_dir)
    ok = True

    print(f"Validating {p}\n")

    sources = load_column(p / 'Sources.csv', 'source_id')
    used_sources = set()
    used_sources |= load_column(p / 'Manufacturers.csv', 'source_id')
    used_sources |= load_column(p / 'UV_Printing_Specifications.csv', ['source_id', 'conflicting_source_id'])
    used_sources |= load_column(p / 'Printheads.csv', 'source_id')
    used_sources |= load_column(p / 'RIP_Software.csv', 'source_id')
    used_sources |= load_column(p / 'Relationships.csv', 'source_id')
    ok &= check("source_id", used_sources, sources)

    manufacturers = load_column(p / 'Manufacturers.csv', 'manufacturer_id')
    used_mfg = set()
    used_mfg |= load_column(p / 'Equipment_Master_Index.csv', 'manufacturer_id')
    used_mfg |= load_column(p / 'ProductFamilies.csv', 'manufacturer_id')
    used_mfg |= load_column(p / 'Printheads.csv', 'printhead_manufacturer_id')
    used_mfg |= load_column(p / 'RIP_Software.csv', 'vendor_manufacturer_id')
    ok &= check("manufacturer_id", used_mfg, manufacturers)

    families = load_column(p / 'ProductFamilies.csv', 'family_id')
    used_fam = set()
    used_fam |= load_column(p / 'Equipment_Master_Index.csv', 'family_id')
    with open(p / 'Relationships.csv', newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row['relationship_type'] == 'PART_OF_SERIES':
                used_fam.add(row['to_entity'])
    ok &= check("family_id", used_fam, families)

    printheads = load_column(p / 'Printheads.csv', 'printhead_id')
    used_ph = set()
    with open(p / 'Relationships.csv', newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row['relationship_type'] == 'USES_PRINTHEAD':
                used_ph.add(row['to_entity'])
    ok &= check("printhead_id (via USES_PRINTHEAD)", used_ph, printheads)

    rips = load_column(p / 'RIP_Software.csv', 'rip_id')
    used_rip = set()
    with open(p / 'Relationships.csv', newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row['relationship_type'] == 'REQUIRES_SOFTWARE':
                used_rip.add(row['to_entity'])
    ok &= check("rip_id (via REQUIRES_SOFTWARE)", used_rip, rips)

    ueids_emi = load_column(p / 'Equipment_Master_Index.csv', 'ueid')
    ueids_spec = load_column(p / 'UV_Printing_Specifications.csv', 'ueid')
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
    print("search/fetch in the same working session.")

    return 0 if ok else 1


if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'database/uv_printing_pilot'
    sys.exit(main(target))
