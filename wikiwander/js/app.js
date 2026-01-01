const I18N = window.I18N || {};

const LS_LANG   = "wikiwander_lang_v1";
const LS_SAVED  = "wikiwander_saved_v2";
const LS_RECENT = "wikiwander_recent_v2";
const LS_CHOICE = "wikiwander_choice_v2";

const TOPICS = [
  { key:"random",  label:{en:"Random", es:"Aleatorio", fr:"Aléatoire", de:"Zufällig"}, query:null },
  { key:"space",   label:{en:"Astronomy", es:"Astronomía", fr:"Astronomie", de:"Astronomie"}, query:"astronomy OR astrophysics OR galaxy OR cosmology -astrology" },
  { key:"mind",    label:{en:"Mind", es:"Mente", fr:"Esprit", de:"Geist"}, query:"psychology OR neuroscience OR cognition" },
  { key:"history", label:{en:"History", es:"Historia", fr:"Histoire", de:"Geschichte"}, query:"history OR ancient OR medieval OR revolution" },
  { key:"philo",   label:{en:"Philosophy", es:"Filosofía", fr:"Philosophie", de:"Philosophie"}, query:"philosophy OR ethics OR metaphysics OR epistemology" },
  { key:"bio",     label:{en:"Biology", es:"Biología", fr:"Biologie", de:"Biologie"}, query:"biology OR evolution OR genetics OR ecology" },
  { key:"tech",    label:{en:"Tech", es:"Tecnología", fr:"Tech", de:"Technik"}, query:"computer science OR software OR algorithm OR engineering" },
  { key:"art",     label:{en:"Arts", es:"Artes", fr:"Arts", de:"Kunst"}, query:"art OR music OR literature OR cinema" },
  { key:"geo",     label:{en:"Earth", es:"Tierra", fr:"Terre", de:"Erde"}, query:"geology OR climate OR ocean OR volcano" }
];

const FETCH_TIMEOUT_MS = 9000;
const RECENT_LIMIT = 500;

const el = id => document.getElementById(id);

const state = {
  lang:"en",
  choice:"random",
  current:null,
  history:[],
  saved:[],
  recentTitles:[],
  queue:[],
  isLoading:false
};

/* ---------- Language ---------- */
function applyLanguage(lang){
  if (!I18N[lang]) lang = "en";
  state.lang = lang;
  localStorage.setItem(LS_LANG, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(n=>{
    const k = n.dataset.i18n;
    if (I18N[lang][k]) n.textContent = I18N[lang][k];
  });

  document.querySelectorAll(".lang-btn").forEach(b=>{
    b.classList.toggle("active", b.dataset.lang === lang);
  });

  renderChips();
  state.queue = [];
  state.history = [];
  next();
}

/* ---------- Wikipedia base ---------- */
function wikiBase(){
  return `https://${["en","es","fr","de"].includes(state.lang) ? state.lang : "en"}.wikipedia.org`;
}

/* ---------- Topics ---------- */
function topicLabel(t){
  return t.label[state.lang] || t.label.en;
}

function renderChips(){
  const row = el("chipRow");
  row.innerHTML = "";
  for (const t of TOPICS){
    const d = document.createElement("div");
    d.className = "chip" + (t.key===state.choice?" active":"");
    d.innerHTML = `<span class="dot"></span><span class="name">${topicLabel(t)}</span>`;
    d.onclick = ()=>changeTopic(t.key);
    row.appendChild(d);
  }
  const cur = TOPICS.find(t=>t.key===state.choice);
  el("tag").textContent = topicLabel(cur);
  el("metaTopic").textContent = `· ${topicLabel(cur)}`;
}

/* ---------- Fetch ---------- */
async function fetchJSON(url){
  const c = new AbortController();
  setTimeout(()=>c.abort(), FETCH_TIMEOUT_MS);
  const r = await fetch(url,{signal:c.signal});
  if(!r.ok) throw Error(r.status);
  return r.json();
}

async function randomTitle(){
  const u = `${wikiBase()}/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`;
  const j = await fetchJSON(u);
  return j.query.random[0].title;
}

async function summary(title){
  return fetchJSON(`${wikiBase()}/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
}

/* ---------- Cards ---------- */
async function next(){
  if(state.isLoading) return;
  state.isLoading = true;

  try{
    const title = await randomTitle();
    const s = await summary(title);

    if(state.current) state.history.push(state.current);

    state.current = {
      title:s.title,
      extract:s.extract,
      url:s.content_urls.desktop.page,
      img:s.thumbnail?.source
    };

    el("title").textContent = s.title;
    el("concept").textContent = s.extract;
    el("openLink").href = state.current.url;

    if(state.current.img){
      el("img").src = state.current.img;
      el("img").style.display="block";
    } else {
      el("img").style.display="none";
    }

  } catch {
    el("title").textContent="Error";
    el("concept").textContent="Wikipedia fetch failed.";
  }

  state.isLoading = false;
}

function changeTopic(k){
  state.choice = k;
  localStorage.setItem(LS_CHOICE,k);
  state.history=[];
  next();
}

/* ---------- Init ---------- */
(function(){
  const l = localStorage.getItem(LS_LANG);
  if(l && I18N[l]) state.lang = l;

  document.querySelectorAll(".lang-btn").forEach(b=>{
    b.onclick=()=>applyLanguage(b.dataset.lang);
  });

  applyLanguage(state.lang);
})();