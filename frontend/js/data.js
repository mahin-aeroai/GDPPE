/* GDPPE data layer
   Loads the pilot CSVs straight from the repo (../database/...) and shapes them
   into an in-memory model the views can render. No backend: the CSVs ARE the API.

   Exposes window.GDPPE = { load(), state } where state is populated after load().
*/
(function () {
  "use strict";

  // --- category manifest ----------------------------------------------------
  // code:   short tag shown in the UI
  // dir:    folder under ../database/
  // specs:  the category-specific specifications filename
  // accent: [bg, fg] hex pair for the category tag (kept in JS so the palette
  //         lives in one place; mirrors the CSS signal-colour discipline)
  var CATEGORIES = [
    { id: "uv",    code: "UV",    name: "UV Printing",
      dir: "uv_printing_pilot",              specs: "UV_Printing_Specifications.csv",
      blurb: "Flatbed & hybrid printers · arc-lamp and LED curing",
      accent: ["#241f3d", "#a99cf0"] },
    { id: "toner", code: "Toner", name: "Toner / Electrophotographic",
      dir: "toner_electrophotographic_pilot", specs: "Toner_Electrophotographic_Specifications.csv",
      blurb: "Production cut-sheet presses · dry and liquid toner",
      accent: ["#123028", "#4fd1a5"] },
    { id: "latex", code: "Latex", name: "Latex Printing",
      dir: "latex_printing_pilot",           specs: "Latex_Printing_Specifications.csv",
      blurb: "Water-based latex-ink roll-to-roll & rigid",
      accent: ["#3a2018", "#e08a5f"] },
    { id: "cut",   code: "Cut",   name: "Digital Cutting",
      dir: "digital_cutting_pilot",          specs: "Digital_Cutting_Specifications.csv",
      blurb: "Flatbed digital cutters & finishing tables",
      accent: ["#12283f", "#5aa9e8"] },
    { id: "solvent", code: "Solvent", name: "Solvent / Eco-Solvent",
      dir: "solvent_ecosolvent_printing_pilot", specs: "Solvent_Ecosolvent_Printing_Specifications.csv",
      blurb: "Wide-format sign printers · true, eco & mild solvent",
      accent: ["#2e2410", "#e0b83c"] },
    { id: "dyesub", code: "DyeSub", name: "Dye-Sublimation",
      dir: "dye_sublimation_printing_pilot", specs: "Dye_Sublimation_Printing_Specifications.csv",
      blurb: "Textile & soft-signage · transfer, direct & dual workflow",
      accent: ["#2b1430", "#d977c8"] },
    { id: "aqueous", code: "Aqueous", name: "Aqueous / Inkjet",
      dir: "aqueous_inkjet_printing_pilot", specs: "Aqueous_Inkjet_Printing_Specifications.csv",
      blurb: "Water-based photo, CAD & production · dye and pigment",
      accent: ["#0f2a2e", "#43c9c0"] },
    { id: "screen", code: "Screen", name: "Screen Printing",
      dir: "screen_printing_pilot", specs: "Screen_Printing_Specifications.csv",
      blurb: "Stencil through mesh · manual & automatic garment presses",
      accent: ["#2e1616", "#e8705a"] }
  ];

  // path from frontend/index.html up to the database folder
  var DB = "../database/";

  // --- tiny robust CSV parser ----------------------------------------------
  // Handles quoted fields, embedded commas, escaped "" quotes, and both
  // \n and \r\n line endings. Returns array of arrays.
  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var i = 0;
    var inQuotes = false;
    var c;
    // normalise BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    while (i < text.length) {
      c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    // last field / row (if file doesn't end in newline)
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows;
  }

  // rows[0] as header -> array of objects
  function toObjects(rows) {
    if (!rows.length) return [];
    var header = rows[0].map(function (h) { return h.trim(); });
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      if (rows[r].length === 1 && rows[r][0] === "") continue; // blank line
      var o = {};
      for (var c = 0; c < header.length; c++) o[header[c]] = (rows[r][c] !== undefined ? rows[r][c] : "");
      out.push(o);
    }
    return out;
  }

  function fetchCSV(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Could not load " + path + " (" + res.status + ")");
      return res.text();
    }).then(function (t) { return toObjects(parseCSV(t)); });
  }

  // --- shape one category ---------------------------------------------------
  function loadCategory(cat) {
    var base = DB + cat.dir + "/";
    return Promise.all([
      fetchCSV(base + "Equipment_Master_Index.csv"),
      fetchCSV(base + "Manufacturers.csv"),
      fetchCSV(base + cat.specs),
      fetchCSV(base + "Sources.csv"),
      fetchCSV(base + "Relationships.csv").catch(function () { return []; })
    ]).then(function (parts) {
      var equipment = parts[0], mfgs = parts[1], specs = parts[2], sources = parts[3], rels = parts[4];

      var mfgById = {};
      mfgs.forEach(function (m) { mfgById[m.manufacturer_id] = m; });
      var srcById = {};
      sources.forEach(function (s) { srcById[s.source_id] = s; });

      // group specs by ueid
      var specsByUeid = {};
      specs.forEach(function (s) {
        (specsByUeid[s.ueid] = specsByUeid[s.ueid] || []).push(s);
      });

      // relationships by ueid (from_entity)
      var relsByUeid = {};
      rels.forEach(function (r) {
        (relsByUeid[r.from_entity] = relsByUeid[r.from_entity] || []).push(r);
      });

      var machines = equipment.map(function (e) {
        var mfg = mfgById[e.manufacturer_id] || {};
        return {
          ueid: e.ueid,
          category: cat.id,
          model: e.model_name || e.series_name || e.ueid,
          series: e.series_name || "",
          config: e.configuration || "",
          releaseYear: e.release_year || "",
          status: e.machine_status || e.lifecycle_stage || "",
          country: e.country_of_manufacture || "",
          notes: e.notes || "",
          mfgId: e.manufacturer_id,
          mfgName: mfg.manufacturer_name || e.manufacturer_id || "—",
          mfgTier: mfg.market_tier || "",
          specs: specsByUeid[e.ueid] || [],
          rels: relsByUeid[e.ueid] || []
        };
      });

      // per-category provenance stats
      var conflicts = specs.filter(function (s) { return (s.conflicting_value || "").trim(); }).length;

      return {
        meta: cat,
        machines: machines,
        sources: sources,
        sourceById: srcById,
        mfgById: mfgById,
        stats: {
          machines: machines.length,
          specs: specs.length,
          sources: sources.length,
          conflicts: conflicts
        }
      };
    });
  }

  var state = {
    categories: {},   // id -> shaped category
    order: CATEGORIES.map(function (c) { return c.id; }),
    totals: null,
    loaded: false
  };

  function load() {
    return Promise.all(CATEGORIES.map(loadCategory)).then(function (results) {
      var tM = 0, tSrc = 0, tConf = 0, tSpec = 0;
      results.forEach(function (r) {
        state.categories[r.meta.id] = r;
        tM += r.stats.machines; tSrc += r.stats.sources;
        tConf += r.stats.conflicts; tSpec += r.stats.specs;
      });
      state.totals = {
        machines: tM, sources: tSrc, conflicts: tConf, specs: tSpec,
        categoriesDone: CATEGORIES.length, categoriesTarget: 17
      };
      state.loaded = true;
      return state;
    });
  }

  // helpers exposed for views
  function findMachine(ueid) {
    for (var k in state.categories) {
      var arr = state.categories[k].machines;
      for (var i = 0; i < arr.length; i++) if (arr[i].ueid === ueid) return arr[i];
    }
    return null;
  }

  // pull a named spec field for a machine (first match)
  function specValue(machine, fieldNames) {
    var names = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
    for (var i = 0; i < machine.specs.length; i++) {
      if (names.indexOf(machine.specs[i].field_name) !== -1) return machine.specs[i];
    }
    return null;
  }

  window.GDPPE = {
    load: load,
    state: state,
    categoriesMeta: CATEGORIES,
    findMachine: findMachine,
    specValue: specValue
  };
})();
