// assets/app.js
(() => {
  const STORE_KEY = "pr.prefs.v2"; // bump version since schema changed

  const skins = {
    skimmer: {
      label: "Skimmer",
      css: {"--maxw":"92ch","--fs":"15px","--lh":"1.45","--paraGap":"8px","--sectionGap":"10px","--pad":"14px"}
    },
    stepper: {
      label: "Stepper",
      css: {"--maxw":"78ch","--fs":"16px","--lh":"1.6","--paraGap":"10px","--sectionGap":"16px","--pad":"18px"}
    },
    deep: {
      label: "Deep Reader",
      css: {"--maxw":"70ch","--fs":"17px","--lh":"1.75","--paraGap":"14px","--sectionGap":"14px","--pad":"20px"}
    },
    visual: {
      label: "Visual Chunker",
      css: {"--maxw":"1100px","--fs":"15px","--lh":"1.55","--paraGap":"10px","--sectionGap":"14px","--pad":"16px"}
    },
    socratic: {
      label: "Socratic",
      css: {"--maxw":"78ch","--fs":"16px","--lh":"1.6","--paraGap":"10px","--sectionGap":"14px","--pad":"18px"}
    }
  };

  const $ = (id) => document.getElementById(id);

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;");
  }

  function setVar(name, value){
    document.documentElement.style.setProperty(name, value);
  }

  function cssVar(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function setTheme(mode){
    document.body.classList.remove("theme-light","theme-dark");
    if(mode === "light") document.body.classList.add("theme-light");
    if(mode === "dark") document.body.classList.add("theme-dark");
    if(mode === "system"){
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.classList.add(prefersDark ? "theme-dark" : "theme-light");
    }
  }

  function setFont(which){
    let val = "var(--font-system)";
    if(which === "serif") val = "var(--font-serif)";
    if(which === "mono")  val = "var(--font-mono)";
    if(which === "dys")   val = "var(--font-dys)";
    setVar("--font", val);
  }

  function setLeftCollapsed(collapsed){
    document.body.classList.toggle("left-collapsed", collapsed);
    savePrefs();
  }

  function getTopicIdFromURL(){
    const u = new URL(window.location.href);
    return u.searchParams.get("t") || "blackhole";
  }

  function setTopicInURL(id){
    const u = new URL(window.location.href);
    u.searchParams.set("t", id);
    history.replaceState({}, "", u.toString());
  }

  // ---------------------- Canonical access ----------------------
  function getTopic(){
    return window.PR_TOPICS?.[currentTopicId] || null;
  }

  function ensureFacts(topic){
    if(!topic) return [];
    if(!Array.isArray(topic.facts)) return [];
    return topic.facts;
  }

  // ---------------------- Renderers (from facts) ----------------------
  function renderSummary(topic){
    const el = $("summary");
    el.innerHTML = `<b>TL;DR</b> ${escapeHtml(topic.summary || "")}`;
  }

  function renderSkimmer(topic){
    const el = $("skim");
    const facts = ensureFacts(topic);
    if(!facts.length){
      el.innerHTML = `<p class="muted">No facts found for this topic.</p>`;
      return;
    }
    const items = facts.map(f => `<li>${escapeHtml(f.render?.skimmer || "")}</li>`).join("");
    el.innerHTML = `
      <h2>Skim view</h2>
      <ul class="dense">${items}</ul>
    `;
  }

  function renderDeep(topic){
    const el = $("deep");
    const facts = ensureFacts(topic);
    if(!facts.length){
      el.innerHTML = `<p class="muted">No facts found for this topic.</p>`;
      return;
    }
    const paras = facts.map(f => `<p>${escapeHtml(f.render?.deep || "")}</p>`).join("");
    el.innerHTML = `
      <h2>Deep view</h2>
      ${paras}
    `;
  }

  function renderVisual(topic){
    const el = $("cards");
    const facts = ensureFacts(topic);
    el.innerHTML = "";
    facts.forEach(f => {
      const title = f.render?.visualTitle || "";
      const body  = f.render?.visualBody || "";
      const card = document.createElement("div");
      card.className = "cardx";
      card.innerHTML = `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p>`;
      el.appendChild(card);
    });
  }

  function renderStepper(topic){
    const el = $("steps");
    const facts = ensureFacts(topic);
    el.innerHTML = "";
    facts.forEach((f, i) => {
      const text = f.render?.stepper || "";
      const div = document.createElement("div");
      div.className = "step";
      div.innerHTML = `<b>Step ${i+1}</b><div style="margin-top:6px;">${escapeHtml(text)}</div>`;
      el.appendChild(div);
    });
  }

  function renderSocratic(topic){
    const el = $("qa");
    const facts = ensureFacts(topic);
    el.innerHTML = "";
    facts.forEach(f => {
      const q = f.render?.socraticQ || "";
      const a = f.render?.socraticA || "";
      const d = document.createElement("details");
      d.open = false;
      d.innerHTML = `<summary>${escapeHtml(q)}</summary><div class="answer">${escapeHtml(a)}</div>`;
      el.appendChild(d);
    });
  }

  function showOnly(view){
    const views = ["skim","deep","cards","steps","qa"];
    views.forEach(id => {
      const el = $(id);
      if(!el) return;
      const on = id === view;
      // For cards/steps/qa we rely on CSS .show for layout, but also toggle display for safety.
      el.style.display = on ? "block" : "none";
      el.setAttribute("aria-hidden", on ? "false" : "true");
      if(id === "cards") el.classList.toggle("show", on);
      if(id === "steps") el.classList.toggle("show", on);
      if(id === "qa")    el.classList.toggle("show", on);
    });
  }

  // ---------------------- Mode application ----------------------
  let currentSkin = "skimmer";
  let currentTopicId = null;

  function applySkin(name){
    const skin = skins[name];
    if(!skin) return;
    currentSkin = name;

    for(const [k,v] of Object.entries(skin.css)){
      setVar(k, v);
    }

    // Mode buttons
    document.querySelectorAll(".mode-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.skin === name);
    });
    $("activeChip").textContent = `Active: ${skin.label}`;

    // Render the current topic in the selected view
    renderForCurrentTopic();

    // Sync sliders after mode changes (mode sets some vars)
    syncSlidersFromCSS();
    savePrefs();
  }

  function renderForCurrentTopic(){
    const topic = getTopic();
    if(!topic) return;

    $("topicTitle").textContent = topic.title || "—";
    $("topicSubtitle").textContent = topic.subtitle || "—";

    renderSummary(topic);

    if(currentSkin === "skimmer"){
      renderSkimmer(topic);
      showOnly("skim");
    } else if(currentSkin === "deep"){
      renderDeep(topic);
      showOnly("deep");
    } else if(currentSkin === "visual"){
      renderVisual(topic);
      showOnly("cards");
    } else if(currentSkin === "stepper"){
      renderStepper(topic);
      showOnly("steps");
    } else if(currentSkin === "socratic"){
      renderSocratic(topic);
      showOnly("qa");
    }
  }

  // ---------------------- Sliders ----------------------
  function syncSlidersFromCSS(){
    const fs = parseFloat(cssVar("--fs")) || 16;
    const lh = parseFloat(cssVar("--lh")) || 1.6;
    const lsRaw = cssVar("--ls");
    const ls = lsRaw.endsWith("px") ? parseFloat(lsRaw) : (parseFloat(lsRaw) || 0);
    const pgRaw = cssVar("--paraGap");
    const pg = pgRaw.endsWith("px") ? parseFloat(pgRaw) : (parseFloat(pgRaw) || 12);
    const mwRaw = cssVar("--maxw");
    const mw = mwRaw.endsWith("ch") ? parseFloat(mwRaw) : 74;

    $("fs").value = fs; $("fsVal").textContent = String(fs);
    $("lh").value = lh; $("lhVal").textContent = lh.toFixed(2);
    $("ls").value = ls; $("lsVal").textContent = ls.toFixed(2);
    $("pg").value = pg; $("pgVal").textContent = String(pg);
    $("mw").value = mw; $("mwVal").textContent = `${mw}ch`;
  }

  // ---------------------- Persistence ----------------------
  function savePrefs(){
    const prefs = {
      skin: currentSkin,
      topic: currentTopicId,
      theme: $("themeSel")?.value ?? "system",
      contrast: $("contrastTog")?.checked ?? false,
      motion: $("motionTog")?.checked ?? false,
      fontSel: $("fontSel")?.value ?? "system",
      fs: $("fs")?.value ?? "16",
      lh: $("lh")?.value ?? "1.6",
      ls: $("ls")?.value ?? "0",
      pg: $("pg")?.value ?? "12",
      mw: $("mw")?.value ?? "74",
      leftCollapsed: document.body.classList.contains("left-collapsed"),
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(prefs));
  }

  function loadPrefs(){
    try{
      const raw = localStorage.getItem(STORE_KEY);
      if(!raw) return null;
      return JSON.parse(raw);
    }catch{ return null; }
  }

  function resetControls(){
    $("themeSel").value = "system";
    setTheme("system");

    $("contrastTog").checked = false;
    document.body.classList.remove("contrast");

    $("motionTog").checked = false;
    document.body.classList.remove("reduce-motion");

    $("fontSel").value = "system";
    setFont("system");

    // reset comfort vars
    setVar("--fs", "16px");
    setVar("--lh", "1.6");
    setVar("--ls", "0px");
    setVar("--paraGap", "12px");
    setVar("--maxw", "74ch");

    syncSlidersFromCSS();
    savePrefs();
  }

  // ---------------------- Topic selector ----------------------
  function initTopicSelector(){
    const sel = $("topicSel");
    sel.innerHTML = "";
    const topics = Object.values(window.PR_TOPICS || {});
    topics.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.title;
      sel.appendChild(opt);
    });

    sel.addEventListener("change", () => {
      const id = sel.value;
      currentTopicId = id;
      setTopicInURL(id);
      renderForCurrentTopic();
      savePrefs();
    });
  }

  // ---------------------- Init ----------------------
  function init(){
    // If we're on index.html, do nothing
    if(!$("topicSel")) return;

    initTopicSelector();

    // wire panel arrow + peek button
    $("leftArrow").addEventListener("click", () => setLeftCollapsed(!document.body.classList.contains("left-collapsed")));
    $("leftPeekBtn").addEventListener("click", () => setLeftCollapsed(false));

    // wire mode buttons
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => applySkin(btn.dataset.skin));
    });

    // wire theme & toggles
    $("themeSel").addEventListener("change", (e)=>{ setTheme(e.target.value); savePrefs(); });
    $("contrastTog").addEventListener("change", (e)=>{ document.body.classList.toggle("contrast", e.target.checked); savePrefs(); });
    $("motionTog").addEventListener("change", (e)=>{ document.body.classList.toggle("reduce-motion", e.target.checked); savePrefs(); });

    // font
    $("fontSel").addEventListener("change", (e)=>{ setFont(e.target.value); savePrefs(); });

    // sliders
    const bind = (id, fn, outId, fmt=(x)=>x) => {
      const el = $(id);
      el.addEventListener("input", () => {
        fn(el.value);
        $(outId).textContent = fmt(el.value);
      });
      el.addEventListener("change", savePrefs);
    };
    bind("fs", v => setVar("--fs", `${v}px`), "fsVal", v => v);
    bind("lh", v => setVar("--lh", `${v}`), "lhVal", v => Number(v).toFixed(2));
    bind("ls", v => setVar("--ls", `${v}px`), "lsVal", v => Number(v).toFixed(2));
    bind("pg", v => setVar("--paraGap", `${v}px`), "pgVal", v => v);
    bind("mw", v => setVar("--maxw", `${v}ch`), "mwVal", v => `${v}ch`);

    $("resetBtn").addEventListener("click", resetControls);

    // load prefs + URL topic
    const prefs = loadPrefs();
    const urlTopic = getTopicIdFromURL();

    // topic precedence: URL > saved > default
    currentTopicId = urlTopic || prefs?.topic || "blackhole";
    $("topicSel").value = currentTopicId;

    // theme
    $("themeSel").value = prefs?.theme || "system";
    setTheme($("themeSel").value);

    // toggles
    $("contrastTog").checked = !!prefs?.contrast;
    document.body.classList.toggle("contrast", !!prefs?.contrast);
    $("motionTog").checked = !!prefs?.motion;
    document.body.classList.toggle("reduce-motion", !!prefs?.motion);

    // font
    $("fontSel").value = prefs?.fontSel || "system";
    setFont($("fontSel").value);

    // apply skin first (sets some defaults)
    applySkin(prefs?.skin || "skimmer");

    // apply comfort overrides after skin
    if(prefs){
      setVar("--fs", `${prefs.fs || 16}px`);
      setVar("--lh", `${prefs.lh || 1.6}`);
      setVar("--ls", `${(prefs.ls || 0)}px`);
      setVar("--paraGap", `${prefs.pg || 12}px`);
      setVar("--maxw", `${prefs.mw || 74}ch`);
    }

    // left collapsed
    document.body.classList.toggle("left-collapsed", !!prefs?.leftCollapsed);

    // initial render
    renderForCurrentTopic();

    // sync sliders
    syncSlidersFromCSS();

    // keep system theme in sync
    if(window.matchMedia){
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ()=>{
        if($("themeSel").value === "system") setTheme("system");
      });
    }
  }

  init();
})();