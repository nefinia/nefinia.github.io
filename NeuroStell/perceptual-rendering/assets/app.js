// assets/app.js
(() => {
  const STORE_KEY = "pr.prefs.v2"; // bump version since schema changed

  const skins = {
    skimmer: {
      label: "Skimmer",
      css: {"--maxw":"92ch","--paraGap":"8px","--sectionGap":"10px","--pad":"14px"}
    },
    stepper: {
      label: "Stepper",
      css: {"--maxw":"78ch","--paraGap":"10px","--sectionGap":"16px","--pad":"18px"}
    },
    deep: {
      label: "Deep Reader",
      css: {"--maxw":"70ch","--paraGap":"14px","--sectionGap":"14px","--pad":"20px"}
    },
    visual: {
      label: "Visual Chunker",
      css: {"--maxw":"1100px","--paraGap":"10px","--sectionGap":"14px","--pad":"16px"}
    },
    socratic: {
      label: "Socratic",
      css: {"--maxw":"78ch","--paraGap":"10px","--sectionGap":"14px","--pad":"18px"}
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
  // ---------------------- Persistence ----------------------
  function savePrefs(){
    const prefs = {
      skin: currentSkin,
      topic: currentTopicId,
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

    // wire mode buttons
    document.querySelectorAll(".mode-btn").forEach(btn => {
      btn.addEventListener("click", () => applySkin(btn.dataset.skin));
    });

    // load prefs + URL topic
    const prefs = loadPrefs();
    const urlTopic = getTopicIdFromURL();

    // topic precedence: URL > saved > default
    currentTopicId = urlTopic || prefs?.topic || "blackhole";
    $("topicSel").value = currentTopicId;

    // apply skin first (sets some defaults)
    applySkin(prefs?.skin || "skimmer");

    // initial render
    renderForCurrentTopic();
  }

  init();
})();
