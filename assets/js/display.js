/* Display settings for sofiagallego.com (same idea as NeuroStell and sofi.games):
   theme, font (including OpenDyslexic), text size, line and letter spacing, calm motion.
   Load it in <head>, not deferred:  <script src="assets/js/display.js"></script>  (../ in subfolders)
   The choice is kept in this browser (localStorage "sg-display"); nothing is sent anywhere.
   Pages can be dark (the space pages) or light: "Light" and "Dark" only change a page that is not already that way. */
(function () {
  "use strict";
  var KEY = "sg-display", root = document.documentElement;
  var me = document.currentScript && document.currentScript.src;
  var base = me ? me.replace(/js\/[^/]*$/, "") : "/assets/";
  var DEF = { theme: "site", font: "default", size: 100, lh: 0, ls: 0, motion: "full" };
  var S = {};
  function load() { var s = {}; try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {} S = {}; for (var k in DEF) S[k] = s[k] != null ? s[k] : DEF[k]; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var darkMQ = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;

  // is this page naturally dark? measured once the page has its colours, and remembered per page
  var NATKEY = "sg-display-dark:" + location.pathname, natDark = null;
  try { var c = localStorage.getItem(NATKEY); if (c != null) natDark = c === "1"; } catch (e) {}
  function measure() {
    var was = root.hasAttribute("data-ds-flip"); root.removeAttribute("data-ds-flip");
    var col = "", el = document.body;
    while (el && (!col || /rgba\(0, 0, 0, 0\)|transparent/.test(col))) { col = getComputedStyle(el).backgroundColor; el = el === document.body ? root : null; }
    var m = (col || "").match(/\d+(\.\d+)?/g), dark = false;
    if (m && m.length >= 3 && !(m.length > 3 && +m[3] === 0)) dark = (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) < 128;
    if (was) root.setAttribute("data-ds-flip", "");
    natDark = dark; try { localStorage.setItem(NATKEY, dark ? "1" : "0"); } catch (e) {}
  }
  function applyAll() {
    var want = S.theme === "system" ? (darkMQ && darkMQ.matches ? "dark" : "light") : S.theme;
    var flip = natDark != null && ((want === "dark" && !natDark) || (want === "light" && natDark));
    root.toggleAttribute("data-ds-flip", !!flip);
    root.setAttribute("data-ds-font", S.font);
    root.style.setProperty("--ds-zoom", String(S.size / 100)); root.toggleAttribute("data-ds-size", S.size !== 100);
    root.style.setProperty("--ds-lh", String(S.lh || 1.6)); root.toggleAttribute("data-ds-lh", !!S.lh);
    root.style.setProperty("--ds-ls", (S.ls || 0) + "em"); root.toggleAttribute("data-ds-ls", !!S.ls);
    root.toggleAttribute("data-ds-calm", S.motion === "calm");
    window.dispatchEvent(new Event("resize"));   // drawings like the cosmic web re-measure their labels
  }
  load(); applyAll();
  if (darkMQ && darkMQ.addEventListener) darkMQ.addEventListener("change", function () { if (S.theme === "system") applyAll(); });

  var css = document.createElement("style");
  css.textContent =
    "@font-face{font-family:'OpenDyslexic';src:url(" + base + "fonts/opendyslexic-latin-400-normal.woff2) format('woff2');font-weight:400;font-display:swap}" +
    "@font-face{font-family:'OpenDyslexic';src:url(" + base + "fonts/opendyslexic-latin-700-normal.woff2) format('woff2');font-weight:600 900;font-display:swap}" +
    "@font-face{font-family:'Atkinson Hyperlegible';src:url(" + base + "fonts/atkinson-hyperlegible-latin-400-normal.woff2) format('woff2');font-weight:400;font-display:swap}" +
    "@font-face{font-family:'Atkinson Hyperlegible';src:url(" + base + "fonts/atkinson-hyperlegible-latin-700-normal.woff2) format('woff2');font-weight:600 900;font-display:swap}" +
    // the other theme: turn the page's colours around; photos, videos, maps and canvases keep their real colours
    "html[data-ds-flip]{filter:invert(1) hue-rotate(180deg)}" +
    "html[data-ds-flip] img,html[data-ds-flip] video,html[data-ds-flip] canvas,html[data-ds-flip] picture,html[data-ds-flip] iframe,html[data-ds-flip] svg image,html[data-ds-flip] [data-ds-keep]{filter:invert(1) hue-rotate(180deg)}" +
    "html[data-ds-flip] picture img{filter:none}" +
    // the cosmic web is drawn in page colours (dark sky, dark fade behind the title): let it turn with the page
    "html[data-ds-flip] .web canvas,html[data-ds-flip] canvas[data-ds-turn]{filter:none}" +
    "html[data-ds-flip] *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}" +
    "html[data-ds-flip] body:not(.inner):not(:has(#web)),html[data-ds-flip] .hero:not(:has(#web)),html[data-ds-flip] header{background-image:none!important}" +
    // starry pages: in the other theme the sky itself turns around too (dark stars and web on a light page)
    "html[data-ds-flip] #cv{filter:none}" +
    "html[data-ds-font=readable] body,html[data-ds-font=readable] body *:not(svg *){font-family:'Atkinson Hyperlegible',system-ui,sans-serif!important}" +
    "html[data-ds-font=dyslexic] body,html[data-ds-font=dyslexic] body *:not(svg *){font-family:'OpenDyslexic',system-ui,sans-serif!important}" +
    "html[data-ds-font=serif] body,html[data-ds-font=serif] body *:not(svg *){font-family:Georgia,'Times New Roman',serif!important}" +
    "html[data-ds-font=mono] body,html[data-ds-font=mono] body *:not(svg *){font-family:ui-monospace,Menlo,Consolas,monospace!important}" +
    // bigger text: zoom the page, but never a canvas (interactive drawings read clicks in unzoomed pixels)
    "html[data-ds-size] body:not(:has(canvas)){zoom:var(--ds-zoom)}" +
    "html[data-ds-size] body:has(canvas) > :not(:has(canvas)):not(canvas):not(script):not(style):not([style*=transform]):not(.node):not(.mini)," +
    "html[data-ds-size] body:has(canvas) :has(canvas) > :not(:has(canvas)):not(canvas):not([style*=transform]):not(.node):not(.mini)," +
    // labels that a script places over a canvas (like the cosmic web nodes) keep their spot: only their text grows
    "html[data-ds-size] body:has(canvas) :has(canvas) > :is([style*=transform],.node,.mini):not(:has(canvas)) > *{zoom:var(--ds-zoom)}" +
    "html[data-ds-lh] body *{line-height:var(--ds-lh)!important}" +
    "html[data-ds-ls] body *{letter-spacing:var(--ds-ls)!important}" +
    "html[data-ds-calm] *,html[data-ds-calm] *::before,html[data-ds-calm] *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}" +
    // button and panel (they stay readable on dark and light pages)
    ".sgd-btn{font:700 13px/1 system-ui,sans-serif;color:#fff;background:rgba(20,22,40,.72);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:6px 10px;cursor:pointer;letter-spacing:0}" +
    ".sgd-btn:hover{background:rgba(20,22,40,.9)}.sgd-btn:focus-visible,.sgd button:focus-visible{outline:3px solid #ffb86b;outline-offset:2px}" +
    ".sgd-float{position:fixed;left:14px;bottom:14px;z-index:2147483000;box-shadow:0 4px 14px rgba(0,0,0,.25)}" +
    ".navin .sgd-btn{margin-left:8px}" +
    ".top-right .sgd-btn{margin:0 4px;flex:none}" +
    ".sgd{position:fixed;top:64px;right:14px;z-index:2147483001;width:min(340px,calc(100vw - 28px));max-height:calc(100vh - 80px);overflow:auto;background:#fdfbf7;color:#1d1b2c;border:1px solid #d9d3c7;border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,.28);padding:14px 16px;font:500 14px system-ui,sans-serif;text-align:left}" +
    ".sgd.low{top:auto;bottom:60px;left:14px;right:auto}" +
    ".sgd[hidden]{display:none}.sgd h2{font:700 18px system-ui,sans-serif;margin:0;color:#1d1b2c}" +
    ".sgd .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}" +
    ".sgd .lb{display:block;font-weight:700;font-size:13px;margin:12px 0 6px;color:#5b576b}" +
    ".sgd .seg{display:flex;flex-wrap:wrap;gap:6px}" +
    ".sgd .seg button{font:600 13px system-ui,sans-serif;padding:6px 10px;border-radius:999px;border:1px solid #d9d3c7;background:#fff;color:#1d1b2c;cursor:pointer}" +
    ".sgd .seg button[aria-pressed=true]{background:#1d1b2c;border-color:#1d1b2c;color:#fff}" +
    ".sgd .rng{display:flex;align-items:center;gap:10px}.sgd input[type=range]{flex:1;accent-color:#c85a48}.sgd .val{min-width:3.4em;text-align:right;font-weight:700}" +
    ".sgd .x{font:700 18px system-ui;width:30px;height:30px;border-radius:999px;border:1px solid #d9d3c7;background:#fff;color:#1d1b2c;cursor:pointer;line-height:1}" +
    ".sgd .ft{display:flex;justify-content:space-between;align-items:center;margin-top:14px;gap:8px}" +
    ".sgd .reset{font:600 13px system-ui,sans-serif;padding:7px 12px;border-radius:999px;border:1px solid #d9d3c7;background:#fff;color:#1d1b2c;cursor:pointer}" +
    ".sgd .note{font-size:12px;color:#5b576b}" +
    ".sgd .f-readable{font-family:'Atkinson Hyperlegible',sans-serif!important}.sgd .f-dyslexic{font-family:'OpenDyslexic',sans-serif!important}.sgd .f-serif{font-family:Georgia,serif!important}.sgd .f-mono{font-family:ui-monospace,Menlo,monospace!important}";
  (document.head || root).appendChild(css);

  var L = (root.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
  var TX = {
    en: { btn: "Display settings", title: "Display", theme: "Theme", site: "As designed", light: "Light", dark: "Dark", system: "Like my device",
      font: "Font", fDefault: "Standard", fReadable: "Easy to read", fDyslexic: "OpenDyslexic", fSerif: "Serif", fMono: "Mono",
      size: "Text size", lh: "Line spacing", ls: "Letter spacing", normal: "normal", motion: "Movement", full: "Normal", calm: "Calm",
      reset: "Reset", close: "Close", note: "Saved in this browser." },
    fr: { btn: "Réglages d’affichage", title: "Affichage", theme: "Thème", site: "D’origine", light: "Clair", dark: "Sombre", system: "Comme mon appareil",
      font: "Police", fDefault: "Standard", fReadable: "Facile à lire", fDyslexic: "OpenDyslexic", fSerif: "Avec empattements", fMono: "Mono",
      size: "Taille du texte", lh: "Interligne", ls: "Espacement des lettres", normal: "normal", motion: "Mouvement", full: "Normal", calm: "Calme",
      reset: "Réinitialiser", close: "Fermer", note: "Enregistré dans ce navigateur." },
    es: { btn: "Ajustes de visualización", title: "Visualización", theme: "Tema", site: "Original", light: "Claro", dark: "Oscuro", system: "Como mi dispositivo",
      font: "Letra", fDefault: "Estándar", fReadable: "Fácil de leer", fDyslexic: "OpenDyslexic", fSerif: "Con serifa", fMono: "Mono",
      size: "Tamaño del texto", lh: "Interlineado", ls: "Espacio entre letras", normal: "normal", motion: "Movimiento", full: "Normal", calm: "Calmado",
      reset: "Restablecer", close: "Cerrar", note: "Se guarda en este navegador." }
  };
  var tx = function (k) { return (TX[L] && TX[L][k]) || TX.en[k]; };
  var FMT = { size: function (v) { return v + "%"; }, lh: function (v) { return +v > 1 ? (+v).toFixed(1) : tx("normal"); }, ls: function (v) { return +v ? "+" + Math.round(v * 100) + "%" : tx("normal"); } };
  var panel, btn;
  function seg(key, opts) {
    return '<div class="seg" role="group" data-k="' + key + '">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '" class="' + (o[2] || "") + '" aria-pressed="' + (String(S[key]) === String(o[0])) + '">' + o[1] + "</button>"; }).join("") + "</div>";
  }
  function rng(key, min, max, step) {
    var v = key === "lh" ? (S.lh || 1) : S[key];
    return '<div class="rng"><input type="range" data-k="' + key + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + v + '" aria-label="' + tx(key) + '"><span class="val" data-val="' + key + '">' + FMT[key](S[key]) + "</span></div>";
  }
  function draw() {
    panel.innerHTML = '<div class="hd"><h2 id="sgdT">' + tx("title") + '</h2><button type="button" class="x" aria-label="' + tx("close") + '">×</button></div>' +
      '<span class="lb">' + tx("theme") + "</span>" + seg("theme", [["site", tx("site")], ["light", tx("light")], ["dark", tx("dark")], ["system", tx("system")]]) +
      '<span class="lb">' + tx("font") + "</span>" + seg("font", [["default", tx("fDefault")], ["readable", tx("fReadable"), "f-readable"], ["dyslexic", tx("fDyslexic"), "f-dyslexic"], ["serif", tx("fSerif"), "f-serif"], ["mono", tx("fMono"), "f-mono"]]) +
      '<span class="lb">' + tx("size") + "</span>" + rng("size", 80, 150, 10) +
      '<span class="lb">' + tx("lh") + "</span>" + rng("lh", 1, 2.4, 0.2) +
      '<span class="lb">' + tx("ls") + "</span>" + rng("ls", 0, 0.2, 0.02) +
      '<span class="lb">' + tx("motion") + "</span>" + seg("motion", [["full", tx("full")], ["calm", tx("calm")]]) +
      '<div class="ft"><span class="note">' + tx("note") + '</span><button type="button" class="reset">' + tx("reset") + "</button></div>";
  }
  function open(v) {
    if (!panel) return;
    panel.hidden = !v; btn.setAttribute("aria-expanded", String(!!v));
    if (v) { draw(); var f = panel.querySelector(".x"); if (f) f.focus(); } else btn.focus();
  }
  function mount() {
    measure(); applyAll();
    if (document.querySelector(".sgd-btn") || document.querySelector("[data-no-display-settings]")) return;
    btn = document.createElement("button"); btn.type = "button"; btn.className = "sgd-btn"; btn.textContent = "Aa";
    btn.setAttribute("aria-label", tx("btn")); btn.title = tx("btn"); btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false");
    var langs = document.querySelector("nav .langs"), navin = document.querySelector("nav .navin");
    panel = document.createElement("div"); panel.className = "sgd"; panel.hidden = true;
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-labelledby", "sgdT");
    var slot = document.querySelector("[data-display-settings-slot]") || document.querySelector("header .top-right .lang");
    if (slot && slot.parentNode) slot.parentNode.insertBefore(btn, slot);
    else if (langs && langs.parentNode) langs.parentNode.insertBefore(btn, langs);
    else if (navin) navin.appendChild(btn);
    else { btn.classList.add("sgd-float"); panel.classList.add("low"); document.body.appendChild(btn); }
    document.body.appendChild(panel);
    btn.addEventListener("click", function () { open(panel.hidden); });
    panel.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.classList.contains("x")) return open(false);
      if (b.classList.contains("reset")) { for (var k in DEF) S[k] = DEF[k]; save(); applyAll(); draw(); return; }
      var g = b.closest(".seg"); if (g) { S[g.getAttribute("data-k")] = b.getAttribute("data-v"); save(); applyAll(); draw(); }
    });
    panel.addEventListener("input", function (e) {
      var k = e.target.getAttribute("data-k"); if (!k) return;
      S[k] = +e.target.value; if (k === "lh" && S.lh <= 1) S.lh = 0; save(); applyAll();
      var v = panel.querySelector('[data-val="' + k + '"]'); if (v) v.textContent = FMT[k](S[k]);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel && !panel.hidden) open(false); });
    document.addEventListener("click", function (e) { if (panel && !panel.hidden && e.target.isConnected && !panel.contains(e.target) && e.target !== btn) open(false); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
  window.SGDisplay = { get: function () { return Object.assign({}, S); }, open: function () { open(true); } };
})();
