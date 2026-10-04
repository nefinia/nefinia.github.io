/* Opens the page in the visitor's language.
   1. If the visitor picked EN / FR / ES on this site before, that choice wins.
   2. Otherwise we read the browser's language list (in order of preference)
      and take the first one this site has.
   Only pages with an EN/FR/ES switcher are affected. Add ?stay to a link to turn it off. */
(function () {
  var KEY = "sg-lang", LANGS = ["en", "fr", "es"];
  function saved() { try { var s = localStorage.getItem(KEY); return LANGS.indexOf(s) >= 0 ? s : null; } catch (e) { return null; } }
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }
  function fromBrowser() {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i] || "").slice(0, 2).toLowerCase();
      if (LANGS.indexOf(l) >= 0) return l;
    }
    return "en";
  }
  function go() {
    var box = document.querySelector(".langs");
    if (!box) return;
    // remember a choice made with the switcher
    box.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[hreflang]");
      if (a) save(a.getAttribute("hreflang"));
    });
    if (/[?&]stay\b/.test(location.search) || navigator.webdriver) return;
    var here = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
    var want = saved() || fromBrowser();
    if (want === here) return;
    var a = box.querySelector('a[hreflang="' + want + '"]');
    if (!a || a.getAttribute("aria-current") === "true") return;
    location.replace(a.href + location.hash);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
