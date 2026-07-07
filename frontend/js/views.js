/* GDPPE views — pure render functions returning HTML strings.
   Each matches the class names already defined in css/app.css.
   Provenance is the through-line: every value carries a confidence dot,
   a source tier, and a conflict flag when sources disagree. */
(function () {
  "use strict";

  var G = window.GDPPE;

  // ---- small helpers -------------------------------------------------------
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function confClass(c) {
    c = (c || "").toLowerCase();
    if (c.indexOf("high") === 0) return "high";
    if (c.indexOf("medium") === 0) return "medium";
    if (!c) return "na";
    return "low";
  }
  function cdot(c) { return '<span class="cdot ' + confClass(c) + '" title="' + esc(c || "n/a") + ' confidence"></span>'; }

  // source tier: read from the source record if resolvable
  function tierOf(cat, sourceId) {
    var s = cat.sourceById[sourceId];
    if (!s) return null;
    var t = s.tier || s.source_tier || "";
    t = parseInt(t, 10);
    return isNaN(t) ? null : t;
  }
  function tierBadge(t) {
    if (t == null) return "";
    return '<span class="tierbadge ' + (t === 1 ? "t1" : "") + '">T' + t + "</span>";
  }
  function tag(accent, label) {
    return '<span class="tag" style="background:' + accent[0] + ";color:" + accent[1] + '">' + esc(label) + "</span>";
  }

  // choose a few "headline" spec fields per category for list/compare rows
  var HEADLINE = {
    uv:    [["print_width", "width"], ["max_speed", "speed"], ["native_resolution", "resolution"], [["uv_curing_type", "curing_type", "curing_technology"], "curing"]],
    toner: [[["max_speed_ppm", "max_speed_sph", "max_speed"], "speed"], [["toner_type"], "toner"], [["native_resolution"], "resolution"], [["monthly_duty_cycle"], "duty/mo"]],
    latex: [[["print_width"], "width"], [["max_speed"], "speed"], [["native_resolution"], "resolution"], [["ink_type", "drying_technology"], "ink"]],
    cut:   [[["cutting_area_width", "max_material_area"], "cut width"], [["max_speed", "max_speed_xy"], "speed"], [["accuracy"], "accuracy"], [["tool_positions"], "tools"]],
    solvent: [[["print_width"], "width"], [["max_speed"], "speed"], [["solvent_type"], "solvent"], [["native_resolution"], "resolution"]],
    dyesub: [[["sublimation_workflow"], "workflow"], [["max_speed", "throughput"], "speed"], [["native_resolution"], "resolution"], [["ink_channels"], "colours"]],
    aqueous: [[["ink_subtype"], "ink"], [["print_architecture"], "architecture"], [["native_resolution"], "resolution"], [["ink_channels"], "colours"]],
    screen: [[["automation_level"], "automation"], [["max_colours"], "colours"], [["max_stations"], "stations"], [["max_speed", "max_image_area"], "speed/area"]]
  };

  function fmtVal(sp) {
    if (!sp) return '<span style="color:var(--tx-2)">—</span>';
    var v = esc(sp.value);
    var u = sp.unit ? ' <span class="u">' + esc(sp.unit) + "</span>" : "";
    return cdot(sp.confidence) + v + u;
  }

  // ==========================================================================
  // DASHBOARD
  // ==========================================================================
  function dashboard() {
    var t = G.state.totals;
    var html = "";
    html += '<div class="crumb"><b style="color:var(--tx-1)">GDPPE</b></div>';
    html += '<div class="page-head"><div>' +
      '<h1 class="page-title">Global database of production printing equipment</h1>' +
      '<div class="page-desc">A provenance-first reference. Every specification traces to a cited source; conflicts between sources are shown, not silently resolved.</div>' +
      "</div></div>";

    // metrics
    html += '<div class="metrics">';
    html += metric("Machines", t.machines);
    html += metric("Categories", t.categoriesDone + '<small> / ' + t.categoriesTarget + "</small>");
    html += metric("Sources", t.sources);
    html += metric("Conflicts kept", t.conflicts);
    html += "</div>";

    // category coverage
    html += '<div class="section-label"><h2>Category coverage</h2><span>' +
      t.categoriesDone + " populated · " + (t.categoriesTarget - t.categoriesDone) + " planned</span></div>";

    var maxM = 0;
    G.state.order.forEach(function (id) { maxM = Math.max(maxM, G.state.categories[id].stats.machines); });

    G.state.order.forEach(function (id) {
      var cat = G.state.categories[id];
      var st = cat.stats, m = cat.meta;
      var pct = maxM ? Math.round(st.machines / maxM * 100) : 0;
      html += '<a class="catrow" href="#/c/' + id + '">';
      html += '<div class="catrow-top">';
      html += '<div class="catrow-name">' + tag(m.accent, m.code) + "<b>" + esc(m.name) + "</b></div>";
      html += '<div class="catrow-count"><b>' + st.machines + "</b><span>machines</span></div>";
      html += "</div>";
      html += '<div class="bar"><i style="width:' + pct + "%;background:" + m.accent[1] + '"></i></div>';
      html += '<div class="catrow-stats">';
      html += "<span>" + st.sources + " sources</span>";
      html += "<span" + (st.conflicts ? ' style="color:var(--magenta)"' : "") + ">" + st.conflicts + " conflicts kept</span>";
      html += '<span class="push">' + (st.sources / st.machines).toFixed(1) + " src/machine</span>";
      html += "</div>";
      html += "</a>";
    });

    // planned categories as chips
    var planned = ["Solvent / Eco-Solvent", "Aqueous / Inkjet", "Dye-Sublimation", "Screen Printing",
      "Flexography", "Offset Litho", "Thermal Transfer", "3D / Additive", "Label / Narrow-Web",
      "Textile Direct", "Sign Finishing", "Laser Marking", "Pad Printing"];
    html += '<div class="chips" style="margin-top:14px">';
    planned.forEach(function (p) { html += '<span class="chip">' + esc(p) + "</span>"; });
    html += "</div>";

    return html;
  }
  function metric(label, val) {
    return '<div class="metric"><div class="metric-label">' + esc(label) +
      '</div><div class="metric-val">' + val + "</div></div>";
  }

  // ==========================================================================
  // CATEGORY  (machine list)
  // ==========================================================================
  function category(id) {
    var cat = G.state.categories[id];
    if (!cat) return errorView("Unknown category: " + esc(id));
    var m = cat.meta;
    var fields = HEADLINE[id] || [];

    var html = "";
    html += '<div class="crumb"><a href="#/">GDPPE</a><span class="sep">›</span><b style="color:var(--tx-1)">' + esc(m.name) + "</b></div>";
    html += '<div class="page-head"><div>' +
      '<h1 class="page-title">' + esc(m.name) + "</h1>" +
      '<div class="page-desc">' + esc(m.blurb) + "</div></div>" +
      '<div class="catrow-count"><b class="mono" style="font-family:var(--mono);font-size:22px">' + cat.stats.machines +
      '</b><div style="font-size:11px;color:var(--tx-2)">machines</div></div>';
    html += "</div>";

    html += '<div class="legend">' +
      '<span><span class="cdot high"></span>high</span>' +
      '<span><span class="cdot medium"></span>medium</span>' +
      '<span class="conflict" style="border:none;background:none;padding:0">conflict kept</span>' +
      '<span class="push">tap a machine for its full sourced spec sheet</span></div>';

    // sort by presence of a numeric speed where possible, else by name
    var machines = cat.machines.slice();

    machines.forEach(function (mac) {
      html += '<a class="mcard" href="#/m/' + encodeURIComponent(mac.ueid) + '">';
      html += '<div class="mcard-top"><div>';
      html += '<div class="mcard-name">' + esc(mac.model) + "</div>";
      html += '<div class="mcard-sub">' + esc(mac.mfgName) + (mac.config ? " · " + esc(mac.config) : "") + "</div>";
      html += "</div>";
      if (mac.mfgTier) html += '<span class="badge">' + esc(mac.mfgTier) + "</span>";
      html += "</div>";

      html += '<div class="spec-grid">';
      fields.forEach(function (f) {
        var sp = G.specValue(mac, f[0]);
        html += '<div class="spec-cell"><div class="k">' + esc(f[1]) + '</div><div class="v">' + fmtVal(sp);
        if (sp && (sp.conflicting_value || "").trim()) {
          html += ' <span class="conflict">⚠ vs ' + esc(sp.conflicting_value) + "</span>";
        }
        html += "</div></div>";
      });
      html += "</div></a>";
    });

    return html;
  }

  // ==========================================================================
  // MACHINE DETAIL  (spec explorer)
  // ==========================================================================
  function machine(ueid) {
    var mac = G.findMachine(ueid);
    if (!mac) return errorView("Machine not found: " + esc(ueid));
    var cat = G.state.categories[mac.category];
    var m = cat.meta;

    var html = "";
    html += '<div class="crumb"><a href="#/">GDPPE</a><span class="sep">›</span>' +
      '<a href="#/c/' + mac.category + '">' + esc(m.name) + "</a>" +
      '<span class="sep">›</span><span style="color:var(--tx-1);font-family:var(--mono)">' + esc(mac.ueid) + "</span></div>";

    // header
    html += '<div class="page-head"><div>';
    html += '<h1 class="page-title">' + esc(mac.model) + "</h1>";
    html += '<div class="page-desc">' + esc(mac.mfgName) +
      (mac.series ? " · " + esc(mac.series) : "") +
      (mac.releaseYear ? " · released " + esc(mac.releaseYear) : "") +
      (mac.country ? " · " + esc(mac.country) : "") + "</div>";
    html += "</div>";
    // toner-type / ink badges where present
    var badges = provBadges(mac);
    if (badges) html += '<div class="badges">' + badges + "</div>";
    html += "</div>";

    // legend
    html += '<div class="legend">' +
      '<span><span class="cdot high"></span>high confidence</span>' +
      '<span><span class="cdot medium"></span>medium</span>' +
      '<span class="conflict" style="border:none;background:none;padding:0">⚠ conflict preserved</span>' +
      '<span class="push">tier = source rank (1 best)</span></div>';

    // spec rows
    var usedSources = {};
    mac.specs.forEach(function (sp) {
      var t = tierOf(cat, sp.source_id);
      if (sp.source_id) usedSources[sp.source_id] = true;
      html += '<div class="specrow">';
      html += '<div class="field"><div class="fn">' + esc(sp.field_name) + "</div>" +
        '<div class="dom">' + esc(sp.engineering_domain || "") + "</div></div>";
      html += '<div class="val"><div class="vnum">' + cdot(sp.confidence) + esc(sp.value) +
        (sp.unit ? ' <span class="u">' + esc(sp.unit) + "</span>" : "");
      if ((sp.conflicting_value || "").trim()) {
        html += ' <span class="conflict">⚠ vs ' + esc(sp.conflicting_value) +
          (sp.conflicting_source_id ? " (" + esc(sp.conflicting_source_id) + ")" : "") + "</span>";
      }
      html += "</div>";
      if ((sp.resolution_note || "").trim()) html += '<div class="note">' + esc(sp.resolution_note) + "</div>";
      html += "</div>";
      html += '<div class="prov">' + tierBadge(t) + cdot(sp.confidence) +
        '<span class="src">' + esc(sp.source_id || "") + "</span></div>";
      html += "</div>";
    });

    // sources box
    var srcIds = Object.keys(usedSources);
    if (srcIds.length) {
      html += '<div class="sourcebox"><h3>Sources cited on this machine</h3>';
      srcIds.forEach(function (sid) {
        var s = cat.sourceById[sid] || {};
        var t = tierOf(cat, sid);
        html += '<div class="srcline">' + tierBadge(t) +
          '<span class="sid">' + esc(sid) + "</span>" +
          '<span class="org">' + esc(s.organization || s.publisher || "") + "</span>" +
          '<span class="stitle">' + esc(s.source_title || s.title || "") + "</span></div>";
      });
      html += "</div>";
    }

    // actions
    html += '<div class="btnrow">';
    html += '<a class="btn" href="#/c/' + mac.category + '">← all ' + esc(m.name) + "</a>";
    html += '<button class="btn" onclick="GDPPEApp.addCompare(\'' + esc(mac.ueid) + "')\">＋ add to compare</button>";
    html += "</div>";

    return html;
  }

  function provBadges(mac) {
    var out = "";
    var tt = G.specValue(mac, "toner_type");
    if (tt) {
      var liquid = /liquid/i.test(tt.value);
      out += '<span class="badge ' + (liquid ? "liquid" : "") + '">' + esc(tt.value.replace(/_/g, " ")) + "</span>";
    }
    var tc = G.specValue(mac, "toner_chemistry");
    if (tc) out += '<span class="badge">' + esc(tc.value) + "</span>";
    var ink = G.specValue(mac, "ink_type");
    if (ink) out += '<span class="badge">' + esc(ink.value) + "</span>";
    return out;
  }

  // ==========================================================================
  // COMPARE
  // ==========================================================================
  function compare(ueids) {
    var html = "";
    html += '<div class="crumb"><a href="#/">GDPPE</a><span class="sep">›</span><b style="color:var(--tx-1)">Compare</b></div>';
    html += '<div class="page-head"><div><h1 class="page-title">Compare machines</h1>' +
      '<div class="page-desc">Add up to three machines. Rows where the two use different source units are flagged — GDPPE keeps each value in its own unit rather than forcing a conversion.</div></div></div>';

    var macs = (ueids || []).map(function (u) { return G.findMachine(u); }).filter(Boolean);

    if (macs.length < 2) {
      html += '<div class="err" style="color:var(--tx-1);background:var(--ink-1);border-color:var(--line)">' +
        "Pick at least two machines to compare. Open any machine and choose <b>add to compare</b>, " +
        "or add one now:</div>";
      html += pickerGrid(macs);
      return html;
    }

    // build union of headline-ish fields across categories, plus a few common ones
    var rowDefs = [
      { label: "Manufacturer", group: "identity", get: function (m) { return { value: m.mfgName }; } },
      { label: "Imaging / tech", group: "print system", fields: ["imaging_technology", "print_technology", "drying_technology"] },
      { label: "Resolution", group: "print system", fields: ["native_resolution"] },
      { label: "Speed", group: "throughput", fields: ["max_speed", "max_speed_ppm", "max_speed_sph", "max_speed_xy"], unitcheck: true },
      { label: "Print / cut width", group: "mechanical", fields: ["print_width", "cutting_area_width", "max_sheet_size"] },
      { label: "Duty cycle", group: "throughput", fields: ["monthly_duty_cycle"], unitcheck: true },
      { label: "Ink / toner", group: "consumable", fields: ["toner_type", "ink_type", "toner_chemistry"] },
      { label: "DFE / RIP", group: "workflow", fields: ["print_server_dfe", "rip_software"] }
    ];

    var cols = "160px" + macs.map(function () { return " 1fr"; }).join("");
    html += '<div class="cmp" style="grid-template-columns:' + cols + '">';

    // header row
    html += '<div class="cmp-head" style="background:var(--ink-0);border-bottom:1px solid var(--line)"></div>';
    macs.forEach(function (m) {
      html += '<div class="cmp-head"><div class="cmp-name">' + esc(m.model) + "</div>" +
        '<div class="cmp-sub">' + esc(m.mfgName) + (m.releaseYear ? " · " + esc(m.releaseYear) : "") + "</div></div>";
    });

    // body rows
    rowDefs.forEach(function (def) {
      var vals = macs.map(function (m) {
        if (def.get) return def.get(m);
        return G.specValue(m, def.fields);
      });
      // unit mismatch?
      var incomp = false;
      if (def.unitcheck) {
        var units = vals.map(function (v) { return v && v.unit ? v.unit : null; }).filter(Boolean);
        incomp = units.length > 1 && units.some(function (u) { return u !== units[0]; });
      }
      html += '<div class="cmp-rowlabel"><div class="rl">' + esc(def.label) + "</div>" +
        '<div class="rg">' + esc(def.group) + "</div>" +
        (incomp ? '<div style="margin-top:5px"><span class="badge-units">≠ units</span></div>' : "") + "</div>";
      vals.forEach(function (v) {
        html += '<div class="cmp-cell">';
        if (!v || v.value == null || v.value === "") {
          html += '<span style="color:var(--tx-2);font-family:var(--mono)">—</span>';
        } else {
          html += '<span style="font-family:var(--mono);font-size:13px">' +
            (v.confidence ? cdot(v.confidence) : "") + esc(v.value) +
            (v.unit ? ' <span style="font-size:10px;color:var(--tx-2)">' + esc(v.unit) + "</span>" : "") + "</span>";
          if (v && (v.conflicting_value || "").trim()) {
            html += '<div style="margin-top:5px"><span class="conflict">⚠ vs ' + esc(v.conflicting_value) + "</span></div>";
          }
        }
        html += "</div>";
      });
    });

    html += "</div>";

    if (macs.some(function (m) { return m.category !== macs[0].category; })) {
      html += '<div class="units-warn"><span aria-hidden="true">⚠</span><div>' +
        "You're comparing machines from different categories. Fields that don't apply to one show <b>—</b>. " +
        "Speed and duty-cycle units differ by machine class and are flagged <span class=\"badge-units\">≠ units</span> — not a like-for-like race.</div></div>";
    }

    html += '<div class="btnrow"><button class="btn" onclick="GDPPEApp.clearCompare()">clear all</button></div>';
    html += pickerGrid(macs);
    return html;
  }

  // small add-more picker used on the compare page
  function pickerGrid(current) {
    var have = {};
    (current || []).forEach(function (m) { have[m.ueid] = true; });
    var html = '<div class="section-label" style="margin-top:24px"><h2>Add a machine</h2><span>tap to add · max 3</span></div>';
    html += '<div class="chips">';
    G.state.order.forEach(function (id) {
      G.state.categories[id].machines.forEach(function (m) {
        if (have[m.ueid]) return;
        html += '<button class="btn mini" onclick="GDPPEApp.addCompare(\'' + esc(m.ueid) + '\')">' +
          esc(m.model) + "</button>";
      });
    });
    html += "</div>";
    return html;
  }

  function errorView(msg) {
    return '<div class="err">' + esc(msg) + "</div>";
  }

  window.GDPPEViews = {
    dashboard: dashboard,
    category: category,
    machine: machine,
    compare: compare,
    error: errorView
  };
})();
