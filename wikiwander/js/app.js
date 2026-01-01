/* ============================================================
   WikiWander — app.js (split version)
   Requires: window.I18N loaded first
   ============================================================ */

const I18N = window.I18N || {};

const LS_LANG   = "wikiwander_lang_v1";
const LS_SAVED  = "wikiwander_saved_v2";
const LS_RECENT = "wikiwander_recent_v2";
const LS_CHOICE = "wikiwander_choice_v2";

const TOPICS = [
  { key:"random",  label:{en:"Random", es:"Aleatorio", fr:"Aléatoire"}, query:null },
  { key:"space",   label:{en:"Astronomy", es:"Astronomía", fr:"Astronomie"}, query:"astronomy OR astrophysics OR galaxy OR cosmology -astrology" },
  { key:"mind",    label:{en:"Mind", es:"Mente", fr:"Esprit"}, query:"psychology OR neuroscience OR cognition" },
  { key:"history", label:{en:"History", es:"Historia", fr:"Histoire"}, query:"history OR ancient OR medieval OR revolution" },
  { key:"philo",   label:{en:"Philosophy", es:"Filosofía", fr:"Philosophie"}, query:"philosophy OR ethics OR metaphysics OR epistemology" },
  { key:"bio",     label:{en:"Biology", es:"Biología", fr:"Biologie"}, query:"biology OR evolution OR genetics OR ecology" },
  { key:"tech",    label:{en:"Tech", es:"Tecnología", fr:"Tech"}, query:"computer science OR software OR algorithm OR engineering" },
  { key:"art",     label:{en:"Arts", es:"Artes", fr:"Arts"}, query:"art OR music OR literature OR cinema" },
  { key:"geo",     label:{en:"Earth", es:"Tierra", fr:"Terre"}, query:"geology OR climate OR ocean OR volcano" },
];

const FETCH_TIMEOUT_MS = 9000;
const RECENT_LIMIT = 500;
const MAX_ATTEMPTS = 60;
const BACKOFF_BASE_MS = 120;

const el = (id) => document.getElementById(id);

const state = {
  lang: "en",
  choice: "random",
  current: null,
  history: [],
  saved: [],
  recentTitles: [],
  isLoading: false,

  // Prefetch
  queue: [],
  prefetching: false,
  targetQueue: 4,
};

/* ---------- Language + UI ---------- */
function applyLanguage(lang){
  if (!I18N[lang]) lang = "en";
  state.lang = lang;
  localStorage.setItem(LS_LANG, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(node=>{
    const key = node.getAttribute("data-i18n");
    const v = I18N[lang]?.[key];
    if (typeof v === "string") node.textContent = v;
  });

  document.querySelectorAll(".lang-btn").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Refresh topic labels + tag/meta
  renderChips();

  // Switch wiki language for next cards
  state.queue = [];
  state.history = [];
  next();
}

function wikiBase(){
  const lang = (state.lang === "es" || state.lang === "fr") ? state.lang : "en";
  return `https://${lang}.wikipedia.org`;
}

/* ---------- Helpers ---------- */
function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function loadLocal(){
  try { state.saved = JSON.parse(localStorage.getItem(LS_SAVED) || "[]"); } catch { state.saved = []; }
  try { state.recentTitles = JSON.parse(localStorage.getItem(LS_RECENT) || "[]"); } catch { state.recentTitles = []; }
  const c = localStorage.getItem(LS_CHOICE);
  if (c && TOPICS.some(t => t.key === c)) state.choice = c;

  const lang = localStorage.getItem(LS_LANG);
  if (lang && I18N[lang]) state.lang = lang;
}

function saveLocal(){
  localStorage.setItem(LS_SAVED, JSON.stringify(state.saved.slice(0, 1000)));
  localStorage.setItem(LS_RECENT, JSON.stringify(state.recentTitles.slice(0, RECENT_LIMIT)));
  localStorage.setItem(LS_CHOICE, state.choice);
}

function setStatus(text, isErr=false){
  el("statusText").innerHTML = isErr ? `<span class="err">${escapeHtml(text)}</span>` : escapeHtml(text);
  el("savedCount").textContent = String(state.saved.length);
}

function setButtonsEnabled(enabled){
  el("back").disabled = !(enabled && state.history.length > 0);
  el("next").disabled = !enabled;
  el("open").disabled = !enabled;
  el("save").disabled = !enabled;
}

function setImage(url){
  const img = el("img");
  if (url){
    img.src = url;
    img.style.display = "block";
  } else {
    img.removeAttribute("src");
    img.style.display = "none";
  }
}

/* ---------- Saved list ---------- */
function renderSaved(){
  const list = el("savedList");
  const empty = el("savedEmpty");

  if (!state.saved.length){
    empty.style.display = "block";
    list.style.display = "none";
    list.innerHTML = "";
    return;
  }

  empty.style.display = "none";
  list.style.display = "block";
  list.innerHTML = state.saved
    .slice(0, 40)
    .map(item => `<li><a href="${item.url}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a></li>`)
    .join("");
}

function updateSaveButtonState(){
  const btn = el("save");
  const c = state.current;
  if (!c){ btn.classList.remove("saved"); return; }
  const isSaved = state.saved.some(x => x.url === c.url);
  btn.classList.toggle("saved", isSaved);
}

/* ---------- Excerpt length ---------- */
function leadParagraph(text){
  if (!text) return "";
  return text
    .split(/\n{2,}/g)
    .map(p => p.trim())
    .filter(Boolean)[0] || text.trim();
}

function clampWords(text, maxWords){
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return (text || "").trim();
  return words.slice(0, maxWords).join(" ") + "…";
}

function adaptiveMaxWords(){
  const w = window.innerWidth;
  if (w < 420) return 120;
  if (w < 600) return 150;
  if (w < 900) return 180;
  return 210;
}

function adaptiveExcerpt(text){
  return clampWords(leadParagraph(text), adaptiveMaxWords());
}

window.addEventListener("resize", () => {
  if (state.current) el("concept").textContent = adaptiveExcerpt(state.current.extract);
});

/* ---------- De-dupe ---------- */
function rememberTitle(title){
  if (!title) return;
  state.recentTitles.unshift(title);
  state.recentTitles = [...new Set(state.recentTitles)].slice(0, RECENT_LIMIT);
  saveLocal();
}

/* ---------- Topics UI ---------- */
function topicLabel(t){
  const L = t.label || {};
  return L[state.lang] || L.en || "Random";
}

function renderChips(){
  const row = el("chipRow");
  row.innerHTML = "";

  for (const t of TOPICS){
    const chip = document.createElement("div");
    chip.className = "chip" + (state.choice === t.key ? " active" : "");
    chip.innerHTML = `<span class="dot"></span><span class="name">${escapeHtml(topicLabel(t))}</span>`;
    chip.onclick = () => onTopicChange(t.key);
    row.appendChild(chip);
  }

  const current = TOPICS.find(t => t.key === state.choice) || TOPICS[0];
  const label = topicLabel(current);
  el("tag").textContent = label;
  el("metaTopic").textContent = `· ${label}`;
}

/* ---------- Networking ---------- */
async function fetchWithTimeout(url, options={}){
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try{
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

async function jsonOrThrow(res){
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.json();
}

function isBadSummary(s){
  if (!s) return true;
  if (s.type === "disambiguation") return true;
  const t = s.title || "";
  if (/^(Category:|Help:|Wikipedia:|Template:|File:|Portal:|Draft:|Special:)/i.test(t)) return true;
  if (!s.extract) return true;
  return false;
}

async function fetchRandomTitle(){
  const url = new URL(`${wikiBase()}/w/api.php`);
  url.searchParams.set("action","query");
  url.searchParams.set("list","random");
  url.searchParams.set("rnnamespace","0");
  url.searchParams.set("rnlimit","1");
  url.searchParams.set("format","json");
  url.searchParams.set("origin","*");
  const res = await fetchWithTimeout(url.toString());
  const j = await jsonOrThrow(res);
  return j?.query?.random?.[0]?.title || null;
}

async function fetchSummaryByTitle(title){
  const url = `${wikiBase()}/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const res = await fetchWithTimeout(url, { headers: { "accept":"application/json" }});
  return await jsonOrThrow(res);
}

async function searchTotalHits(query){
  const url = new URL(`${wikiBase()}/w/api.php`);
  url.searchParams.set("action","query");
  url.searchParams.set("list","search");
  url.searchParams.set("srsearch", query);
  url.searchParams.set("srnamespace","0");
  url.searchParams.set("srlimit","1");
  url.searchParams.set("format","json");
  url.searchParams.set("origin","*");
  const res = await fetchWithTimeout(url.toString());
  const j = await jsonOrThrow(res);
  return j?.query?.searchinfo?.totalhits || 0;
}

async function searchTitles(query, offset, limit=30){
  const url = new URL(`${wikiBase()}/w/api.php`);
  url.searchParams.set("action","query");
  url.searchParams.set("list","search");
  url.searchParams.set("srsearch", query);
  url.searchParams.set("srnamespace","0");
  url.searchParams.set("srlimit", String(limit));
  url.searchParams.set("sroffset", String(offset));
  url.searchParams.set("format","json");
  url.searchParams.set("origin","*");
  const res = await fetchWithTimeout(url.toString());
  const j = await jsonOrThrow(res);
  return (j?.query?.search || []).map(x => x.title);
}

async function makeCardFromSummary(summary){
  const title = summary.title;
  const url = summary?.content_urls?.desktop?.page || `${wikiBase()}/wiki/${encodeURIComponent(title)}`;
  const imageUrl = summary?.thumbnail?.source || summary?.originalimage?.source || null;
  return { title, extract: summary.extract, url, imageUrl, ts:new Date().toISOString() };
}

async function getNextCard(){
  const topic = TOPICS.find(t => t.key === state.choice) || TOPICS[0];

  for (let attempt=0; attempt<MAX_ATTEMPTS; attempt++){
    try{
      let title = null;

      if (topic.key === "random" || !topic.query){
        title = await fetchRandomTitle();
      } else {
        const total = await searchTotalHits(topic.query);
        const cap = Math.min(total, 5000);
        const offset = cap > 0 ? Math.floor(Math.random() * cap) : 0;
        const titles = await searchTitles(topic.query, offset, 30);
        title = titles.length ? titles[Math.floor(Math.random() * titles.length)] : await fetchRandomTitle();
      }

      if (!title) continue;
      if (state.recentTitles.includes(title)) continue;

      const s = await fetchSummaryByTitle(title);
      if (isBadSummary(s)) continue;

      const card = await makeCardFromSummary(s);
      rememberTitle(card.title);
      return card;

    } catch {
      await new Promise(r => setTimeout(r, BACKOFF_BASE_MS + attempt * 18));
      continue;
    }
  }
  throw new Error("Wikipedia is slow / rate-limiting. Try Next again.");
}

/* ---------- Prefetch queue ---------- */
function prefetchImage(url){
  if (!url) return;
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = url;
}

async function fillQueue(){
  if (state.prefetching) return;
  state.prefetching = true;
  try{
    while (state.queue.length < state.targetQueue){
      const card = await getNextCard();
      state.queue.push(card);
      if (state.queue.length <= 2) prefetchImage(card.imageUrl);
    }
  } finally {
    state.prefetching = false;
  }
}

function refillQueueSoon(){
  setTimeout(() => fillQueue().catch(()=>{}), 0);
}

/* ---------- Render ---------- */
function renderCard(){
  const c = state.current;
  if (!c) return;

  el("title").textContent = c.title;
  el("concept").textContent = adaptiveExcerpt(c.extract);
  el("openLink").href = c.url;
  setImage(c.imageUrl);

  el("errorText").textContent = "";
  setButtonsEnabled(!state.isLoading);
  updateSaveButtonState();
  setStatus("Ready");
  refillQueueSoon();
}

/* ---------- Actions ---------- */
async function next(){
  if (state.isLoading) return;
  state.isLoading = true;
  setButtonsEnabled(false);
  setStatus("Loading…");

  el("title").textContent = "Loading…";
  el("concept").textContent = "Fetching…";
  setImage(null);

  try{
    let card = state.queue.shift();
    if (!card) card = await getNextCard();

    if (state.current) state.history.push(state.current);
    state.current = card;

    renderCard();
  } catch (e){
    el("title").textContent = "Error";
    el("concept").textContent = String(e?.message || e);
    el("errorText").textContent = "Fetch error. Try again.";
    setStatus("Error", true);
  } finally {
    state.isLoading = false;
    setButtonsEnabled(true);
  }
}

function back(){
  if (state.isLoading) return;
  if (!state.history.length) return;
  state.current = state.history.pop();
  renderCard();
}

function openArticle(){
  const c = state.current;
  if (!c) return;
  window.open(c.url, "_blank", "noopener");
}

function saveCurrent(){
  const c = state.current;
  if (!c) return;

  const key = c.url;
  if (state.saved.some(x => x.url === key)){
    setStatus("Already saved");
    updateSaveButtonState();
    return;
  }

  state.saved.unshift({
    title: c.title,
    url: c.url,
    savedAt: new Date().toISOString(),
    topic: state.choice,
    lang: state.lang
  });

  saveLocal();
  renderSaved();
  updateSaveButtonState();
  setStatus("Saved");
}

function clearSaved(){
  state.saved = [];
  saveLocal();
  renderSaved();
  updateSaveButtonState();
  setStatus("Cleared");
}

async function onTopicChange(key){
  if (!TOPICS.some(t => t.key === key)) return;
  state.choice = key;
  saveLocal();

  state.queue = [];
  state.history = [];

  renderChips();
  setStatus("Loading…");
  await next();
}

/* ---------- Wire UI ---------- */
function wireLanguageButtons(){
  document.querySelectorAll(".lang-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      applyLanguage(btn.dataset.lang);
    });
  });
}

function wireControls(){
  el("next").onclick = next;
  el("back").onclick = back;
  el("open").onclick = openArticle;
  el("save").onclick = saveCurrent;
  el("clearSaved").onclick = clearSaved;
}

/* ---------- Init ---------- */
(function init(){
  loadLocal();

  wireLanguageButtons();
  wireControls();

  applyLanguage(state.lang);  // sets active button + translates UI + triggers load
  renderSaved();
  renderChips();

  setStatus("Loading…");
  el("savedCount").textContent = String(state.saved.length);

  next().then(() => refillQueueSoon());
})();