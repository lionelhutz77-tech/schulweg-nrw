/* Schulweg NRW - Winkel-Grafik & Interaktiv-Modul (SVG, reines JS) */
window.WINKEL = (function () {
  "use strict";

  function winkelart(g) {
    if (g <= 0) return { name: "—", farbe: "#6c6a63" };
    if (g < 90) return { name: "spitzer", farbe: "#1d9e75" };
    if (g === 90) return { name: "rechter", farbe: "#534ab7" };
    if (g < 180) return { name: "stumpfer", farbe: "#c2651c" };
    if (g === 180) return { name: "gestreckter", farbe: "#378add" };
    if (g < 360) return { name: "überstumpfer", farbe: "#d4537e" };
    return { name: "Voll", farbe: "#2b2a27" };
  }
  function rad(d) { return d * Math.PI / 180; }
  function pt(cx, cy, r, deg) { return [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))]; }
  function f(n) { return n.toFixed(1); }

  // --- ein Winkel als Figur ---
  function svgWinkel(grad, opts) {
    opts = opts || {};
    var vx = 140, vy = 100, L = 92, rr = 40;
    var a = winkelart(grad);
    var farbe = opts.farbe || a.farbe;
    var e2 = pt(vx, vy, L, grad);
    var s = pt(vx, vy, rr, 0), e = pt(vx, vy, rr, grad);
    var large = grad > 180 ? 1 : 0;
    var sektor = "M" + vx + "," + vy + " L" + f(s[0]) + "," + f(s[1]) +
      " A" + rr + "," + rr + " 0 " + large + " 0 " + f(e[0]) + "," + f(e[1]) + " Z";
    var lbl = pt(vx, vy, rr + 22, grad / 2);
    var txt = opts.zeigeGrad === false ? "" :
      '<text x="' + f(lbl[0]) + '" y="' + f(lbl[1]) + '" font-size="18" font-weight="600" fill="' +
      farbe + '" text-anchor="middle" dominant-baseline="middle">' + grad + "°</text>";
    return '<svg viewBox="0 0 280 200" width="100%" style="max-height:190px" role="img" aria-label="Winkel ' + grad + ' Grad">' +
      '<path d="' + sektor + '" fill="' + farbe + '" fill-opacity="0.15"/>' +
      '<line x1="' + vx + '" y1="' + vy + '" x2="' + (vx + L) + '" y2="' + vy + '" stroke="#2b2a27" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="' + vx + '" y1="' + vy + '" x2="' + f(e2[0]) + '" y2="' + f(e2[1]) + '" stroke="#2b2a27" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="' + vx + '" cy="' + vy + '" r="4.5" fill="#2b2a27"/>' + txt + "</svg>";
  }

  // --- Uhr mit Zeigern ---
  function svgUhr(stunde) {
    var cx = 100, cy = 100, R = 84, ticks = "";
    for (var i = 0; i < 12; i++) {
      var p1 = pt(cx, cy, R, 90 - i * 30), p2 = pt(cx, cy, R - 10, 90 - i * 30);
      ticks += '<line x1="' + f(p1[0]) + '" y1="' + f(p1[1]) + '" x2="' + f(p2[0]) + '" y2="' + f(p2[1]) + '" stroke="#9b988f" stroke-width="3"/>';
    }
    var hh = pt(cx, cy, 46, 90 - stunde * 30), mm = pt(cx, cy, 66, 90);
    var as = pt(cx, cy, 28, 90), ae = pt(cx, cy, 28, 90 - stunde * 30);
    var ang = (stunde % 12) * 30, large = ang > 180 ? 1 : 0;
    var arc = "M" + cx + "," + cy + " L" + f(as[0]) + "," + f(as[1]) +
      " A28,28 0 " + large + " 1 " + f(ae[0]) + "," + f(ae[1]) + " Z";
    return '<svg viewBox="0 0 200 200" width="100%" style="max-height:190px" role="img" aria-label="Uhr ' + stunde + ' Uhr">' +
      '<circle cx="100" cy="100" r="84" fill="#ffffff" stroke="#2b2a27" stroke-width="3"/>' + ticks +
      '<path d="' + arc + '" fill="#1d9e75" fill-opacity="0.18"/>' +
      '<line x1="100" y1="100" x2="' + f(mm[0]) + '" y2="' + f(mm[1]) + '" stroke="#2b2a27" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="100" y1="100" x2="' + f(hh[0]) + '" y2="' + f(hh[1]) + '" stroke="#534ab7" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="100" cy="100" r="5" fill="#2b2a27"/></svg>';
  }

  // --- Geodreieck (Halbkreis-Winkelmesser) ---
  function svgGeodreieck(grad) {
    var vx = 150, vy = 150, R = 118, ticks = "";
    for (var d = 0; d <= 180; d += 15) {
      var o = pt(vx, vy, R, d), inn = pt(vx, vy, R - 11, d);
      ticks += '<line x1="' + f(o[0]) + '" y1="' + f(o[1]) + '" x2="' + f(inn[0]) + '" y2="' + f(inn[1]) + '" stroke="#9b988f" stroke-width="1.5"/>';
    }
    var lft = pt(vx, vy, R, 180), rgt = pt(vx, vy, R, 0), e2 = pt(vx, vy, R, grad);
    var halb = "M" + f(rgt[0]) + "," + f(rgt[1]) + " A" + R + "," + R + " 0 0 0 " + f(lft[0]) + "," + f(lft[1]);
    function lab(deg, dr, col, t) {
      var p = pt(vx, vy, R + dr, deg);
      return '<text x="' + f(p[0]) + '" y="' + f(p[1]) + '" font-size="11" fill="' + col +
        '" text-anchor="middle" dominant-baseline="middle">' + t + "</text>";
    }
    return '<svg viewBox="0 0 300 178" width="100%" style="max-height:190px" role="img" aria-label="Geodreieck ' + grad + ' Grad">' +
      '<path d="' + halb + '" fill="#e6f1fb" fill-opacity="0.55" stroke="#378add" stroke-width="1.5"/>' + ticks +
      '<line x1="' + (vx - R) + '" y1="' + vy + '" x2="' + (vx + R) + '" y2="' + vy + '" stroke="#378add" stroke-width="2"/>' +
      lab(0, 15, "#2b2a27", "0") + lab(90, 15, "#2b2a27", "90") + lab(180, 15, "#2b2a27", "180") +
      lab(0, -16, "#9b988f", "180") + lab(180, -16, "#9b988f", "0") +
      '<line x1="' + vx + '" y1="' + vy + '" x2="' + (vx + R) + '" y2="' + vy + '" stroke="#2b2a27" stroke-width="3.5" stroke-linecap="round"/>' +
      '<line x1="' + vx + '" y1="' + vy + '" x2="' + f(e2[0]) + '" y2="' + f(e2[1]) + '" stroke="#2b2a27" stroke-width="3.5" stroke-linecap="round"/>' +
      '<circle cx="' + vx + '" cy="' + vy + '" r="4" fill="#2b2a27"/></svg>';
  }

  // --- Bild fuer eine Aufgabe ---
  function bildHTML(b) {
    if (!b) return "";
    var inner = b.art === "uhr" ? svgUhr(b.stunde)
      : b.art === "geodreieck" ? svgGeodreieck(b.grad)
      : svgWinkel(b.grad, b.opts);
    return '<div style="margin:0 0 18px">' + inner + "</div>";
  }

  // --- Interaktiver Explorer ---
  function matchesType(g, ziel) { return winkelart(g).name.indexOf(ziel) === 0; }

  function initExplorer(box, cfg) {
    if (!box) return;
    if (cfg && cfg.modus === "geodreieck") return initGeo(box);
    return initWinkelarten(box);
  }

  function initWinkelarten(box) {
    var ziele = ["spitzer", "rechter", "stumpfer", "gestreckter", "überstumpfer"], zi = 0;
    box.innerHTML =
      '<div style="background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:14px;padding:14px">' +
      '<div id="wk-svg"></div>' +
      '<div style="text-align:center;margin:4px 0 12px"><span id="wk-name" style="font-size:19px;font-weight:600"></span></div>' +
      '<input type="range" id="wk-slider" min="0" max="360" value="50" step="1" style="width:100%">' +
      '<div id="wk-ziel" style="margin-top:14px;background:#eeedfe;color:#26215c;border-radius:12px;padding:12px;text-align:center;font-size:15px"></div></div>';
    var svg = box.querySelector("#wk-svg"), name = box.querySelector("#wk-name"),
      sl = box.querySelector("#wk-slider"), ziel = box.querySelector("#wk-ziel");
    function neu() { ziel.innerHTML = '🎯 Stelle einen <b>' + ziele[zi] + " Winkel</b> ein"; }
    function upd() {
      var g = +sl.value, a = winkelart(g);
      svg.innerHTML = svgWinkel(g);
      name.textContent = a.name + " Winkel · " + g + "°"; name.style.color = a.farbe;
      if (matchesType(g, ziele[zi])) {
        ziel.innerHTML = "✓ Super, das ist ein " + ziele[zi] + " Winkel! " +
          '<button class="btn btn-soft" id="wk-next" style="margin-top:10px;padding:9px">Nächste Aufgabe</button>';
        var nb = box.querySelector("#wk-next");
        if (nb) nb.onclick = function () { zi = (zi + 1) % ziele.length; neu(); };
      }
    }
    neu(); upd(); sl.oninput = upd;
  }

  function initGeo(box) {
    box.innerHTML =
      '<div style="background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:14px;padding:14px">' +
      '<div id="g-svg"></div>' +
      '<input type="range" id="g-slider" min="0" max="180" value="40" step="1" style="width:100%;margin-top:6px">' +
      '<div style="display:flex;gap:10px;margin-top:12px">' +
      '<div id="g-richtig" style="flex:1;text-align:center;border-radius:12px;padding:10px;background:#e1f5ee;color:#085041;font-weight:600"></div>' +
      '<div id="g-falle" style="flex:1;text-align:center;border-radius:12px;padding:10px;background:#fbeede;color:#7a3e0f"></div></div>' +
      '<p style="font-size:14px;color:#6c6a63;margin:12px 0 0;text-align:center">Lies die Skala, die am angelegten Schenkel bei 0° beginnt.</p></div>';
    var svg = box.querySelector("#g-svg"), sl = box.querySelector("#g-slider"),
      r = box.querySelector("#g-richtig"), fa = box.querySelector("#g-falle");
    function upd() {
      var g = +sl.value;
      svg.innerHTML = svgGeodreieck(g);
      r.innerHTML = "Richtig: " + g + "°"; fa.innerHTML = "Falle: " + (180 - g) + "°";
    }
    upd(); sl.oninput = upd;
  }

  return { svgWinkel: svgWinkel, svgUhr: svgUhr, svgGeodreieck: svgGeodreieck,
    winkelart: winkelart, bildHTML: bildHTML, initExplorer: initExplorer };
})();
