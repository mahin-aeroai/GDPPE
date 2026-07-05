/* GDPPE app controller — hash router + compare state.
   Views are linkable: #/  #/c/<catId>  #/m/<ueid>  #/compare  */
(function () {
  "use strict";

  var G = window.GDPPE;
  var V = window.GDPPEViews;
  var viewEl = document.getElementById("view");
  var navEl = document.getElementById("topnav");
  var compareBtn = document.getElementById("compareBtn");

  var compareList = []; // ueids, max 3

  // ---- render helpers ------------------------------------------------------
  function setView(html) {
    viewEl.innerHTML = html;
    viewEl.focus && viewEl.focus();
    window.scrollTo(0, 0);
  }

  function buildNav() {
    var html = "";
    G.state.order.forEach(function (id) {
      var m = G.state.categories[id].meta;
      html += '<a href="#/c/' + id + '" data-cat="' + id + '">' + m.code + "</a>";
    });
    navEl.innerHTML = html;
  }

  function markActiveNav(catId) {
    var links = navEl.querySelectorAll("a");
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-cat") === catId);
    });
  }

  function refreshCompareBtn() {
    if (compareList.length) {
      compareBtn.hidden = false;
      compareBtn.textContent = "⇄ compare (" + compareList.length + ")";
      compareBtn.onclick = function () { location.hash = "#/compare"; };
    } else {
      compareBtn.hidden = true;
    }
  }

  // ---- compare state (exposed for inline onclick handlers) -----------------
  window.GDPPEApp = {
    addCompare: function (ueid) {
      if (compareList.indexOf(ueid) === -1) {
        if (compareList.length >= 3) compareList.shift();
        compareList.push(ueid);
      }
      refreshCompareBtn();
      // If already on the compare route, setting the same hash won't fire
      // hashchange — re-render directly. Otherwise navigate (which routes).
      if (location.hash.replace(/^#\/?/, "").split("/")[0] === "compare") {
        route();
      } else {
        location.hash = "#/compare";
      }
    },
    removeCompare: function (ueid) {
      compareList = compareList.filter(function (u) { return u !== ueid; });
      refreshCompareBtn();
      route();
    },
    clearCompare: function () {
      compareList = [];
      refreshCompareBtn();
      route();
    }
  };

  // ---- router --------------------------------------------------------------
  function route() {
    var hash = location.hash.replace(/^#\/?/, ""); // strip "#/" or "#"
    var parts = hash.split("/").filter(Boolean);

    if (!parts.length) {
      markActiveNav(null);
      return setView(V.dashboard());
    }
    if (parts[0] === "c" && parts[1]) {
      markActiveNav(parts[1]);
      return setView(V.category(parts[1]));
    }
    if (parts[0] === "m" && parts[1]) {
      var ueid = decodeURIComponent(parts.slice(1).join("/"));
      var mac = G.findMachine(ueid);
      markActiveNav(mac ? mac.category : null);
      return setView(V.machine(ueid));
    }
    if (parts[0] === "compare") {
      markActiveNav(null);
      return setView(V.compare(compareList));
    }
    // unknown route
    markActiveNav(null);
    setView(V.error("Page not found: " + hash));
  }

  // ---- boot ----------------------------------------------------------------
  G.load().then(function () {
    buildNav();
    refreshCompareBtn();
    window.addEventListener("hashchange", route);
    route();
  }).catch(function (err) {
    viewEl.innerHTML = '<div class="err">Could not load the database.<br>' +
      String(err && err.message ? err.message : err) +
      '<br><br>If you opened this file directly (file://), the browser blocks loading the CSVs. ' +
      'Serve the folder over HTTP instead — e.g. from the repo root run: ' +
      '<code style="font-family:var(--mono)">python3 -m http.server</code> then open ' +
      '<code style="font-family:var(--mono)">http://localhost:8000/frontend/</code></div>';
    console.error(err);
  });
})();
