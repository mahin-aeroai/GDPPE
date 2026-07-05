# GDPPE Frontend

A static browser for the GDPPE pilot database. No backend, no build step — plain
HTML/CSS/JS that reads the pilot CSVs in `../database/` directly and renders them
in four linked views:

- **Dashboard** (`#/`) — coverage across the 17 target categories, with per-category machine / source / conflict stats.
- **Category** (`#/c/<id>`) — the machines in one category with headline specs. IDs: `uv`, `toner`, `latex`, `cut`.
- **Machine** (`#/m/<ueid>`) — the full sourced spec sheet for one machine: every value with its confidence, source tier, and any preserved conflict.
- **Compare** (`#/compare`) — up to three machines side by side, with a flag where their metrics use different source units.

## Design

"Spec sheet as instrument." A graphite ground with the CMYK process colours used
only as functional signal — cyan for data, amber for medium confidence, magenta
for a preserved source conflict — never as decoration. Space Grotesk for display,
IBM Plex Mono for all data values and IDs, Inter for prose. The provenance is the
through-line: confidence dot + source tier + conflict flag appear at every level.

## Run locally

The views fetch the CSVs over HTTP, so opening `index.html` as a `file://` URL
will not work (the browser blocks the fetches). Serve the repo root instead:

```bash
# from the repository root (one level up from this folder)
python3 -m http.server 8000
```

Then open <http://localhost:8000/frontend/>.

## Deploy to GitHub Pages

Because the frontend reads `../database/`, deploy the **whole repository** (not
just this folder) so the CSV paths resolve:

1. Repo → Settings → Pages
2. Source: "Deploy from a branch", branch `main`, folder `/ (root)`
3. The site will be at `https://mahin-aeroai.github.io/GDPPE/frontend/`

No files are duplicated — the site reads the same CSVs the validator checks, so
the frontend can never drift from the source of truth.

## Files

- `index.html` — shell: top bar, view container, footer.
- `css/app.css` — all styling and the colour-token system.
- `js/data.js` — CSV parser + loader; shapes the four categories into one model.
- `js/views.js` — pure render functions, one per view.
- `js/app.js` — hash router + compare state.
