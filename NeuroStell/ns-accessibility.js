(() => {
  const init = () => {
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

    container.innerHTML = `
      <div class="ns-sheet-backdrop" data-comfort-backdrop></div>
      <button
        class="ns-comfort-trigger"
        type="button"
        aria-expanded="false"
        aria-controls="comfort-panel"
        aria-label="Open comfort settings"
        data-comfort-trigger
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"></circle>
        </svg>
        <span data-comfort-label="toggle">Display</span>
      </button>
      <aside class="ns-sheet" id="comfort-panel" aria-label="Comfort options" data-comfort-sheet>
        <div class="ns-sheet__top">
          <strong class="ns-sheet__title" data-comfort-label="title">Display Settings</strong>
          <button class="ns-sheet__close" type="button" aria-label="Close" data-comfort-close>×</button>
        </div>
        <div class="ns-sheet__body">
          <div class="ns-sheet__grid">
            <div class="ns-control ns-control--theme">
              <span class="ns-control__label ns-control__label--section" data-comfort-label="theme">Theme</span>
              <div class="ns-option-group ns-option-group--theme" role="group" aria-label="Theme" data-comfort-theme-group>
                <button class="ns-option-btn ns-option-btn--icon" type="button" data-theme-option="light">
                  <span class="ns-option-btn__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 4.2v2.1M12 17.7v2.1M5.2 12h2.1M16.7 12h2.1M6.8 6.8l1.5 1.5M15.7 15.7l1.5 1.5M17.2 6.8l-1.5 1.5M8.3 15.7l-1.5 1.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>
                      <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"></circle>
                    </svg>
                  </span>
                  <span data-comfort-label="themeLight">Light</span>
                </button>
                <button class="ns-option-btn ns-option-btn--icon" type="button" data-theme-option="dark">
                  <span class="ns-option-btn__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M15.8 4.8a7.6 7.6 0 1 0 3.4 13.9 7 7 0 0 1-3.4-13.9z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </span>
                  <span data-comfort-label="themeDark">Dark</span>
                </button>
                <button class="ns-option-btn ns-option-btn--icon" type="button" data-theme-option="system">
                  <span class="ns-option-btn__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <rect x="4" y="5.5" width="16" height="11" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.6"></rect>
                      <path d="M9 19h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path>
                    </svg>
                  </span>
                  <span data-comfort-label="themeSystem">System</span>
                </button>
              </div>
            </div>

            <div class="ns-control ns-control--font">
              <span class="ns-control__label ns-control__label--section" data-comfort-label="font">Typography</span>
              <div class="ns-option-group ns-option-group--font" role="group" aria-label="Font" data-comfort-font-group>
                <button class="ns-option-btn ns-option-btn--font" type="button" data-font-option="system" data-font-preview="system-ui, -apple-system, 'Segoe UI', sans-serif">
                  <span data-comfort-label="fontSystem">System</span>
                </button>
                <button class="ns-option-btn ns-option-btn--font" type="button" data-font-option="serif" data-font-preview="'Fraunces', Georgia, 'Times New Roman', serif">
                  <span data-comfort-label="fontSerif">Serif</span>
                </button>
                <button class="ns-option-btn ns-option-btn--font" type="button" data-font-option="mono" data-font-preview="ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">
                  <span data-comfort-label="fontMono">Mono</span>
                </button>
                <button class="ns-option-btn ns-option-btn--font" type="button" data-font-option="dys" data-font-preview="'OpenDyslexic', 'Lexend', sans-serif">
                  <span data-comfort-label="fontDyslexic">OpenDyslexic</span>
                </button>
              </div>
            </div>

            <label class="ns-control ns-control--range">
              <span class="ns-control__label" data-comfort-label="fontSize">Font size</span>
              <span class="ns-control__value" data-comfort-value="fontSize">16px</span>
              <input class="ns-control__range" data-comfort-size type="range" min="14" max="22" step="1" />
            </label>

            <label class="ns-control ns-control--range">
              <span class="ns-control__label" data-comfort-label="lineHeight">Line height</span>
              <span class="ns-control__value" data-comfort-value="lineHeight">1.65</span>
              <input class="ns-control__range" data-comfort-line-height type="range" min="1.3" max="2.1" step="0.05" />
            </label>

            <label class="ns-control ns-control--range">
              <span class="ns-control__label" data-comfort-label="letterSpacing">Letter spacing</span>
              <span class="ns-control__value" data-comfort-value="letterSpacing">0px</span>
              <input class="ns-control__range" data-comfort-letter-spacing type="range" min="0" max="1.2" step="0.05" />
            </label>
          </div>

          <button class="ns-sheet__reset" type="button" data-comfort-reset data-comfort-label="reset">Reset</button>
        </div>
      </aside>
    `;

    const sheet = container.querySelector("[data-comfort-sheet]");
    const backdrop = container.querySelector("[data-comfort-backdrop]");
    const triggers = Array.from(container.querySelectorAll("[data-comfort-trigger]"));
    const closeBtn = container.querySelector("[data-comfort-close]");
    const themeGroup = container.querySelector("[data-comfort-theme-group]");
    const fontGroup = container.querySelector("[data-comfort-font-group]");
    const sizeInput = container.querySelector("[data-comfort-size]");
    const lineHeightInput = container.querySelector("[data-comfort-line-height]");
    const letterSpacingInput = container.querySelector("[data-comfort-letter-spacing]");
    const sizeValue = container.querySelector('[data-comfort-value="fontSize"]');
    const lineHeightValue = container.querySelector('[data-comfort-value="lineHeight"]');
    const letterSpacingValue = container.querySelector('[data-comfort-value="letterSpacing"]');
    const resetButton = container.querySelector("[data-comfort-reset]");

    if (
      !sheet || !backdrop || triggers.length === 0 ||
      !themeGroup || !fontGroup || !sizeInput || !lineHeightInput || !letterSpacingInput ||
      !sizeValue || !lineHeightValue || !letterSpacingValue || !resetButton
    ) {
      return;
    }

    const LOCALE_KEY = "neurostell-locale";
    const locale = localStorage.getItem(LOCALE_KEY) || "en";
    const labels = {
      en: {
        toggle: "Display",
        title: "Display Settings",
        theme: "Theme",
        font: "Typography",
        fontSize: "Font size",
        lineHeight: "Line height",
        letterSpacing: "Letter spacing",
        reset: "Reset",
        themeLight: "Light",
        themeDark: "Dark",
        themeSystem: "System",
        fontSystem: "System",
        fontSerif: "Serif",
        fontMono: "Mono",
        fontDyslexic: "OpenDyslexic"
      },
      fr: {
        toggle: "Affichage",
        title: "Paramètres d'affichage",
        theme: "Thème",
        font: "Typographie",
        fontSize: "Taille",
        lineHeight: "Interligne",
        letterSpacing: "Espacement",
        reset: "Réinitialiser",
        themeLight: "Clair",
        themeDark: "Sombre",
        themeSystem: "Système",
        fontSystem: "Système",
        fontSerif: "Serif",
        fontMono: "Mono",
        fontDyslexic: "OpenDyslexic"
      }
    };
    const dict = labels[locale] || labels.en;

    container.querySelectorAll("[data-comfort-label]").forEach((el) => {
      const key = el.getAttribute("data-comfort-label");
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });

    const root = document.documentElement;
    const body = document.body;
    const themeOptions = Array.from(themeGroup.querySelectorAll("[data-theme-option]"));
    const fontOptions = Array.from(fontGroup.querySelectorAll("[data-font-option]"));
    const STORAGE_KEY = "neurostell-comfort-v1";
    const LEGACY_KEY = "nsAccess";
    const OPEN_KEY = "neurostell-comfort-open";
    const defaults = {
      theme: "system",
      font: "system",
      fontSize: 16,
      lineHeight: 1.65,
      letterSpacing: 0
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const normalizeState = (state) => ({
      theme: ["light", "dark", "system"].includes(state.theme) ? state.theme : defaults.theme,
      font: ["system", "serif", "mono", "dys"].includes(state.font) ? state.font : defaults.font,
      fontSize: clamp(Number(state.fontSize) || defaults.fontSize, 14, 22),
      lineHeight: clamp(Number(state.lineHeight) || defaults.lineHeight, 1.3, 2.1),
      letterSpacing: clamp(Number(state.letterSpacing) || defaults.letterSpacing, 0, 1.2)
    });

    const loadState = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          return normalizeState({ ...defaults, ...JSON.parse(raw) });
        }
        const legacyRaw = localStorage.getItem(LEGACY_KEY);
        if (legacyRaw) {
          return normalizeState({ ...defaults, ...JSON.parse(legacyRaw) });
        }
      } catch {
        return { ...defaults };
      }
      return { ...defaults };
    };

    const saveState = (next) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const syncOptionButtons = (options, value) => {
      options.forEach((option) => {
        const optionValue = option.getAttribute("data-theme-option") || option.getAttribute("data-font-option");
        const isActive = optionValue === value;
        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-pressed", String(isActive));
      });
    };

    const resolveTheme = (mode) => {
      if (mode !== "system") {
        return mode;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const applyTheme = (mode) => {
      const effective = resolveTheme(mode);
      root.dataset.theme = effective;
      body.classList.toggle("ns-theme-light", effective === "light");
      body.classList.toggle("ns-theme-dark", effective === "dark");
      body.classList.toggle("theme-light", effective === "light");
      body.classList.toggle("theme-dark", effective === "dark");
      root.style.colorScheme = effective;
    };

    const applyFont = (font) => {
      root.dataset.font = font;
      body.classList.remove("ns-font-system", "ns-font-serif", "ns-font-mono", "ns-font-dys");
      if (font === "serif") body.classList.add("ns-font-serif");
      else if (font === "mono") body.classList.add("ns-font-mono");
      else if (font === "dys") body.classList.add("ns-font-dys");
      else body.classList.add("ns-font-system");
    };

    const applyValues = (state) => {
      root.style.setProperty("--user-font-size", `${state.fontSize}px`);
      root.style.setProperty("--user-line-height", String(state.lineHeight));
      root.style.setProperty("--user-letter-spacing", `${state.letterSpacing}px`);
      root.style.setProperty("--ns-font-size", `${state.fontSize}px`);
      root.style.setProperty("--ns-line-height", String(state.lineHeight));
      root.style.setProperty("--ns-letter-spacing", `${state.letterSpacing}px`);
      applyTheme(state.theme);
      applyFont(state.font);
      syncOptionButtons(themeOptions, state.theme);
      syncOptionButtons(fontOptions, state.font);
      sizeValue.textContent = `${state.fontSize}px`;
      lineHeightValue.textContent = state.lineHeight.toFixed(2).replace(/\.00$/, "");
      letterSpacingValue.textContent = `${state.letterSpacing.toFixed(2).replace(/\.00$/, "")}px`;
      sizeInput.value = String(state.fontSize);
      lineHeightInput.value = String(state.lineHeight);
      letterSpacingInput.value = String(state.letterSpacing);
    };

    let comfortState = loadState();
    applyValues(comfortState);

    const update = (next) => {
      comfortState = normalizeState({ ...comfortState, ...next });
      applyValues(comfortState);
      saveState(comfortState);
    };

    let isOpen = false;

    const openSheet = () => {
      isOpen = true;
      sheet.classList.add("is-open");
      backdrop.classList.add("is-visible");
      body.classList.add("comfort-panel-open");
      triggers.forEach((button) => button.setAttribute("aria-expanded", "true"));
      localStorage.setItem(OPEN_KEY, "true");
    };

    const closeSheet = () => {
      isOpen = false;
      sheet.classList.remove("is-open");
      backdrop.classList.remove("is-visible");
      body.classList.remove("comfort-panel-open");
      triggers.forEach((button) => button.setAttribute("aria-expanded", "false"));
      localStorage.setItem(OPEN_KEY, "false");
    };

    triggers.forEach((button) => {
      button.addEventListener("click", () => {
        if (isOpen) closeSheet();
        else openSheet();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeSheet);
    }

    backdrop.addEventListener("click", closeSheet);

    document.addEventListener("click", (event) => {
      if (!isOpen) return;
      const target = event.target;
      const clickedTrigger = triggers.some((button) => button.contains(target));
      if (target instanceof Node && !sheet.contains(target) && !clickedTrigger) {
        closeSheet();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        closeSheet();
      }
    });

    sizeInput.addEventListener("input", (event) => update({ fontSize: Number(event.target.value) }));
    lineHeightInput.addEventListener("input", (event) => update({ lineHeight: Number(event.target.value) }));
    letterSpacingInput.addEventListener("input", (event) => update({ letterSpacing: Number(event.target.value) }));

    resetButton.addEventListener("click", () => {
      update({ ...defaults });
    });

    fontOptions.forEach((option) => {
      const preview = option.getAttribute("data-font-preview");
      if (preview) {
        option.style.fontFamily = preview;
      }
      option.addEventListener("click", () => {
        const value = option.getAttribute("data-font-option");
        if (!value) return;
        update({ font: value });
      });
    });

    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.getAttribute("data-theme-option");
        if (!value) return;
        update({ theme: value });
      });
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (mediaQuery && typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", () => {
        if (comfortState.theme === "system") {
          applyTheme("system");
        }
      });
    }

    if (localStorage.getItem(OPEN_KEY) === "true") {
      openSheet();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
