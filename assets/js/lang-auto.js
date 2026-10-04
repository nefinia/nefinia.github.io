/* Language by default: a visitor arriving on an English page whose browser prefers French or Spanish
   is sent to the same page in that language. A language picked with EN · FR · ES is remembered
   and always wins. Moving around inside the site never redirects. Crawlers stay where they are. */
(function () {
  var KEY = "sg-lang", LANGS = ["en", "fr", "es"];
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".langs a[hreflang]");
    if (a) set(a.getAttribute("hreflang"));
  }, true);

  try {
    if (/bot|crawl|spider|slurp|lighthouse|preview/i.test(navigator.userAgent)) return;
    if (/[?&]lang=/.test(location.search)) return;
    var ref = document.referrer;
    if (ref && ref.indexOf(location.origin) === 0) return;

    var cur = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    var want = get();
    if (LANGS.indexOf(want) < 0) {
      if (cur !== "en") return;              // a shared FR/ES link stays as it is
      want = null;
      var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
      for (var i = 0; i < list.length; i++) {
        var l = String(list[i]).slice(0, 2).toLowerCase();
        if (LANGS.indexOf(l) >= 0) { want = l; break; }
      }
    }
    if (!want || want === cur) return;
    // every page carrying this script exists at /x, /fr/x and /es/x
    var base = location.pathname.replace(/^\/(fr|es)(?=\/)/, "");
    var target = (want === "en" ? "" : "/" + want) + base;
    if (target !== location.pathname) location.replace(target + location.hash);
  } catch (e) {}
})();
