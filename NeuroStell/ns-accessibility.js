(() => {
  const isPerceptual = window.location.pathname.includes("/perceptual-rendering/");
  const homePrefix = isPerceptual ? "../" : "";

  if (!document.querySelector(".ns-home-logo")) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<a class="ns-home-logo" href="${homePrefix}index.html" aria-label="NeuroStell home">\n` +
      `  <img src="${homePrefix}neurostell.png" alt="NeuroStell logo"/>\n` +
      `</a>`
    );
  }
  const container = document.querySelector(".ns-accessibility");
  if (!container) return;
  document.body.classList.add("ns-offset");

  container.innerHTML = `
    <button class="ns-handle" type="button" aria-label="Toggle NeuroStell comfort options">NeuroStell Comfort</button>
    <div class="ns-drawer" role="dialog" aria-label="NeuroStell comfort options">
      <button class="ns-close" type="button" aria-label="Close display options">×</button>
      <div class="ns-title">Comfort options</div>
      <div class="ns-row">
        <span>Theme</span>
        <select id="nsTheme" class="ns-select">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      <div class="ns-row">
        <span>Font</span>
        <select id="nsFont" class="ns-select">
          <option value="system">System</option>
          <option value="serif">Serif</option>
          <option value="mono">Mono</option>
          <option value="dys">Dyslexic</option>
        </select>
      </div>
      <div class="ns-row">
        <span>Font size</span>
        <input id="nsFontSize" type="range" min="14" max="22" step="1" />
      </div>
      <div class="ns-row">
        <span>Line height</span>
        <input id="nsLineHeight" type="range" min="1.3" max="2.1" step="0.05" />
      </div>
      <div class="ns-row">
        <span>Letter spacing</span>
        <input id="nsLetterSpacing" type="range" min="0" max="1.2" step="0.05" />
      </div>
      <button class="ns-btn" id="nsReset" type="button">Reset</button>
    </div>
  `;

  const root = document.documentElement;
  const body = document.body;
  const handle = container.querySelector(".ns-handle");
  const closeBtn = container.querySelector(".ns-close");
  const fontSize = container.querySelector("#nsFontSize");
  const lineHeight = container.querySelector("#nsLineHeight");
  const letterSpacing = container.querySelector("#nsLetterSpacing");
  const themeSel = container.querySelector("#nsTheme");
  const fontSel = container.querySelector("#nsFont");
  const reset = container.querySelector("#nsReset");
  const setOptionFonts = () => {
    if (!fontSel) return;
    const options = Array.from(fontSel.options);
    options.forEach((opt) => {
      if (opt.value === "serif") opt.style.fontFamily = '"Fraunces","Times New Roman",serif';
      else if (opt.value === "mono") opt.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace';
      else if (opt.value === "dys") opt.style.fontFamily = '"OpenDyslexic", system-ui, sans-serif';
      else opt.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", sans-serif';
    });
  };

  const defaults = {
    fontSize: 16,
    lineHeight: 1.7,
    letterSpacing: 0,
    theme: "light",
    font: "system",
    open: false
  };

  const load = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("nsAccess")) || {};
      return { ...defaults, ...saved };
    } catch {
      return { ...defaults };
    }
  };

  const applyTheme = (mode) => {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const actual = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
    body.classList.toggle("ns-theme-light", actual === "light");
    body.classList.toggle("ns-theme-dark", actual === "dark");
    body.classList.toggle("theme-light", actual === "light");
    body.classList.toggle("theme-dark", actual === "dark");
  };

  const applyFont = (mode) => {
    body.classList.remove("ns-font-system","ns-font-serif","ns-font-mono","ns-font-dys");
    if(mode === "serif") body.classList.add("ns-font-serif");
    else if(mode === "mono") body.classList.add("ns-font-mono");
    else if(mode === "dys") body.classList.add("ns-font-dys");
    else body.classList.add("ns-font-system");
  };

  const apply = (state) => {
    root.style.setProperty("--ns-font-size", `${state.fontSize}px`);
    root.style.setProperty("--ns-line-height", `${state.lineHeight}`);
    root.style.setProperty("--ns-letter-spacing", `${state.letterSpacing}px`);
    applyTheme(state.theme);
    applyFont(state.font);
    container.classList.toggle("open", !!state.open);
    fontSize.value = state.fontSize;
    lineHeight.value = state.lineHeight;
    letterSpacing.value = state.letterSpacing;
    themeSel.value = state.theme;
    fontSel.value = state.font;
  };

  const save = (state) => {
    localStorage.setItem("nsAccess", JSON.stringify(state));
  };

  let state = load();
  apply(state);
  setOptionFonts();

  const update = (next) => {
    state = { ...state, ...next };
    apply(state);
    save(state);
  };

  handle.addEventListener("click", () => update({ open: !state.open }));
  closeBtn.addEventListener("click", () => update({ open: false }));

  themeSel.addEventListener("change", (e) => update({ theme: e.target.value }));
  fontSel.addEventListener("change", (e) => update({ font: e.target.value }));
  fontSize.addEventListener("input", (e) => update({ fontSize: Number(e.target.value) }));
  lineHeight.addEventListener("input", (e) => update({ lineHeight: Number(e.target.value) }));
  letterSpacing.addEventListener("input", (e) => update({ letterSpacing: Number(e.target.value) }));

  reset.addEventListener("click", () => update({ ...defaults }));

  if(window.matchMedia){
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if(state.theme === "system") applyTheme("system");
    });
  }
})();
