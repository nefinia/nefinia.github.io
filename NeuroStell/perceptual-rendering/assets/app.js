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
  const feedbackToSkin = {
    clicked: "deep",
    guidance: "stepper",
    focus: "skimmer"
  };
  const feedbackCopy = {
    clicked: "Current lesson switched to Deep Reader.",
    guidance: "Current lesson switched to Stepper for more guidance.",
    focus: "Current lesson switched to Skimmer to reduce load."
  };
  const visualGlyphs = ["◉","◇","△","✦","⬢","◎","⬡","✳","▣","⟡","◌","⬣"];

  function escapeHtml(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;");
  }

  function cleanText(str){
    return String(str || "").replace(/\s+/g, " ").trim();
  }

  function stripTrailingPunctuation(str){
    return cleanText(str).replace(/[.?!:;,\s]+$/g, "");
  }

  function sentence(str){
    const value = cleanText(str);
    if(!value) return "";
    return /[.?!]$/.test(value) ? value : `${value}.`;
  }

  function joinSentences(...parts){
    return parts
      .map(sentence)
      .filter(Boolean)
      .join(" ");
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

  function chunk(list, size){
    const groups = [];
    for(let i = 0; i < list.length; i += size){
      groups.push(list.slice(i, i + size));
    }
    return groups;
  }

  function sectionTitle(index){
    return [
      "Core idea",
      "Mental model",
      "What changes",
      "How to apply it"
    ][index] || `Thread ${index + 1}`;
  }

  function sectionLead(group){
    return group.map((fact) => fact.render?.skimmer || fact.meaning || "").join(" ");
  }

  function factHeadline(fact){
    return cleanText(fact.render?.visualTitle || fact.render?.socraticQ || fact.render?.stepper || fact.meaning || "Core concept");
  }

  function sectionTheme(group){
    return cleanText(group[0]?.render?.visualTitle || group[0]?.meaning || "core idea");
  }

  function inferCoreQuestion(topic, facts){
    if(facts[0]?.render?.socraticQ) return facts[0].render.socraticQ;
    return `What is the real structure of ${topic.title || "this topic"}?`;
  }

  function sectionSynthesis(group){
    const first = group[0];
    const last = group[group.length - 1];
    if(!first || !last) return "";
    return `${first.meaning} ${last.meaning}`;
  }

  function buildRecallPrompts(facts){
    return facts.slice(0, 4).map((fact, index) => `
      <li>
        <strong>Prompt ${index + 1}.</strong>
        ${escapeHtml(fact.render?.socraticQ || fact.render?.skimmer || fact.meaning || "")}
      </li>
    `).join("");
  }

  function buildThreadMap(facts){
    return chunk(facts, 3).map((group, index) => `
      <article class="thread-card">
        <div class="thread-index">Thread ${index + 1}</div>
        <h3>${escapeHtml(sectionTitle(index))}</h3>
        <p>${escapeHtml(sectionLead(group))}</p>
      </article>
    `).join("");
  }

  function buildOrientation(topic, facts){
    const first = facts[0];
    const second = facts[1];
    return joinSentences(
      topic.summary,
      first?.meaning,
      second?.render?.deep || second?.meaning,
      `The lesson is easier to hold onto when you treat ${stripTrailingPunctuation(topic.title || "the topic")} as a sequence of linked distinctions rather than a pile of isolated facts`
    );
  }

  function buildStakes(topic, facts){
    const last = facts[facts.length - 1];
    return joinSentences(
      `What makes ${stripTrailingPunctuation(topic.title || "this topic")} difficult is that the language is simple while the structure underneath is not`,
      `If you blur the boundaries between the facts, the topic feels vague; if you keep the boundaries clear, the lesson becomes much easier to reason through`,
      last?.render?.deep || last?.meaning
    );
  }

  function buildSectionOverview(topic, group, index){
    const first = group[0];
    const last = group[group.length - 1];
    return joinSentences(
      `This section focuses on ${stripTrailingPunctuation(sectionTheme(group))}`,
      first?.render?.deep || first?.meaning,
      last?.render?.stepper || last?.meaning,
      `Read this section as one coherent move in the larger lesson rather than as disconnected notes`
    );
  }

  function buildSectionBridge(group, index, groups){
    const current = group[0];
    const next = groups[index + 1]?.[0];
    return joinSentences(
      `The key transition in this section is from ${stripTrailingPunctuation(current?.render?.visualTitle || current?.meaning || "the first idea")} toward ${stripTrailingPunctuation(next?.render?.visualTitle || next?.meaning || "the next idea")}`,
      current?.render?.skimmer || current?.meaning,
      next ? `That matters because the next part of the lesson assumes you already kept this distinction stable` : `That matters because the rest of the lesson keeps building on the distinction established here`
    );
  }

  function buildWhyItMatters(fact){
    return joinSentences(
      fact.render?.deep || fact.meaning,
      `In practical terms, this is one of the statements that prevents the whole topic from collapsing into a vague slogan`,
      `If you keep this point explicit, the later parts of the lesson become easier to connect and easier to recall`
    );
  }

  function buildCommonTrap(fact){
    return joinSentences(
      `A common mistake is to flatten this idea into something shorter but less accurate`,
      fact.render?.skimmer || fact.meaning,
      `The safer reading is the fuller one: ${stripTrailingPunctuation(fact.render?.socraticA || fact.render?.deep || fact.meaning)}`
    );
  }

  function buildConcreteFrame(fact){
    return joinSentences(
      `Use this as the working picture in your head`,
      fact.render?.visualBody || fact.render?.deep || fact.meaning,
      `That picture is not the whole theory, but it gives you a stable handle while the rest of the explanation gets more detailed`
    );
  }

  function buildConnection(fact, previousFact, nextFact){
    return joinSentences(
      previousFact ? `This clarifies the previous point: ${stripTrailingPunctuation(previousFact.meaning)}` : `This is one of the anchor points the rest of the lesson keeps returning to`,
      fact.meaning,
      nextFact ? `It also prepares you for the next step: ${stripTrailingPunctuation(nextFact.meaning)}` : `Because this is near the end of the lesson, it functions more like a boundary marker for what the earlier points were trying to build toward`
    );
  }

  function buildRetrievalAnswer(fact){
    return joinSentences(
      fact.render?.socraticA || fact.meaning,
      `If you can say that back in your own words without losing the distinction, you probably understand the fact rather than just recognizing it`
    );
  }

  function buildSkimmerContext(topic, group){
    return joinSentences(
      `This pass is here to help you get bearings quickly`,
      group[0]?.render?.deep || group[0]?.meaning,
      group[group.length - 1]?.render?.skimmer || group[group.length - 1]?.meaning,
      `You are not trying to master details yet; you are trying to see the shape of the section`
    );
  }

  function buildSkimmerTakeaway(group){
    return joinSentences(
      `If you only remember one thing from this pass, remember the connection between these ideas`,
      sectionSynthesis(group),
      `That connection will keep reappearing in the slower modes`
    );
  }

  function buildVisualCaption(fact){
    return joinSentences(
      fact.render?.deep || fact.meaning,
      `The visual frame is useful because it compresses the explanation without pretending the idea is simple`,
      `You can treat the title as the label, the body as the image, and the prompt as the test of whether the frame actually stuck`
    );
  }

  function buildStepBridge(fact, index, facts){
    return joinSentences(
      `Step ${index + 1} works best if you slow down long enough to say what changed from the previous sentence`,
      fact.render?.deep || fact.meaning,
      facts[index + 1] ? `The next step only makes sense once this distinction is stable: ${stripTrailingPunctuation(facts[index + 1].meaning)}` : `Because this is one of the final steps, it is better treated as a consolidation move than as a brand-new idea`
    );
  }

  function buildSocraticWhy(fact){
    return joinSentences(
      fact.render?.deep || fact.meaning,
      `This matters because question-based learning only works when the answer points back to a precise claim instead of a vague feeling of familiarity`
    );
  }

  function buildSocraticContrast(fact){
    return joinSentences(
      `What you are trying to avoid is a loose answer that sounds plausible but drops the critical constraint`,
      fact.render?.skimmer || fact.meaning,
      `The more exact answer is: ${stripTrailingPunctuation(fact.render?.socraticA || fact.meaning)}`
    );
  }

  function buildCapstoneLesson(topic, facts){
    return joinSentences(
      buildOrientation(topic, facts),
      buildStakes(topic, facts),
      `Taken together, the lesson says the same thing in multiple registers: definition, explanation, intuition, and recall`,
      `The point is not to memorize every sentence. The point is to build a mental structure stable enough that each fact has a clear place inside it`
    );
  }

  // ---------------------- Renderers (from facts) ----------------------
  function renderSummary(topic){
    const el = $("summary");
    const facts = ensureFacts(topic);
    el.innerHTML = `
      <div class="summary-grid">
        <div class="summary-block">
          <b>TL;DR</b>
          <p>${escapeHtml(topic.summary || "")}</p>
        </div>
        <div class="summary-block">
          <b>Core question</b>
          <p>${escapeHtml(inferCoreQuestion(topic, facts))}</p>
        </div>
        <div class="summary-block">
          <b>Orientation</b>
          <p>${escapeHtml(buildOrientation(topic, facts))}</p>
        </div>
        <div class="summary-block">
          <b>Why this takes time</b>
          <p>${escapeHtml(buildStakes(topic, facts))}</p>
        </div>
      </div>
    `;
  }

  function renderSkimmer(topic){
    const el = $("skim");
    const facts = ensureFacts(topic);
    if(!facts.length){
      el.innerHTML = `<p class="muted">No facts found for this topic.</p>`;
      return;
    }
    const groups = chunk(facts, 3);
    const cards = groups.map((group, index) => `
      <section class="skim-card">
        <div class="skim-card-top">
          <span class="mode-chip">Pass ${index + 1}</span>
          <h3>${escapeHtml(sectionTitle(index))}</h3>
        </div>
        <p class="skim-lead">${escapeHtml(sectionSynthesis(group))}</p>
        <p>${escapeHtml(buildSkimmerContext(topic, group))}</p>
        <ul class="skim-points">
          ${group.map((fact) => `<li>${escapeHtml(fact.render?.skimmer || "")}</li>`).join("")}
        </ul>
        <p>${escapeHtml(buildSkimmerTakeaway(group))}</p>
      </section>
    `).join("");
    el.innerHTML = `
      <section class="mode-head mode-head--skim">
        <span class="mode-tag">Skimmer</span>
        <h2>Fast orientation first</h2>
        <p>Short scan cards, but with enough supporting language that the topic still feels like a lesson instead of a checklist.</p>
      </section>
      <div class="skim-grid">${cards}</div>
      <section class="recall-strip">
        <h3>Quick recall</h3>
        <p>${escapeHtml(buildStakes(topic, facts))}</p>
        <ul>
          ${buildRecallPrompts(facts)}
        </ul>
      </section>
    `;
  }

  function renderDeep(topic){
    const el = $("deep");
    const facts = ensureFacts(topic);
    if(!facts.length){
      el.innerHTML = `<p class="muted">No facts found for this topic.</p>`;
      return;
    }
    const groups = chunk(facts, 3);
    const sections = groups.map((group, index) => `
      <section class="deep-section">
        <div class="deep-marker">${index + 1}</div>
        <div class="deep-section-copy">
          <h3>${escapeHtml(sectionTitle(index))}</h3>
          <p class="deep-section-lead">${escapeHtml(sectionLead(group))}</p>
          <p>${escapeHtml(buildSectionOverview(topic, group, index))}</p>
          <p>${escapeHtml(buildSectionBridge(group, index, groups))}</p>
          <div class="fact-stack">
            ${group.map((fact, factIndex) => `
              <article class="fact-card">
                <div class="fact-meta">Fact ${index * 3 + factIndex + 1}</div>
                <h4>${escapeHtml(factHeadline(fact))}</h4>
                <div class="fact-row">
                  <div class="fact-label">Canonical statement</div>
                  <p>${escapeHtml(fact.meaning || "")}</p>
                </div>
                <div class="fact-row">
                  <div class="fact-label">Expanded explanation</div>
                  <p>${escapeHtml(fact.render?.deep || "")}</p>
                </div>
                <div class="fact-row">
                  <div class="fact-label">Why this matters in the lesson</div>
                  <p>${escapeHtml(buildWhyItMatters(fact))}</p>
                </div>
                <div class="fact-row">
                  <div class="fact-label">Common trap</div>
                  <p>${escapeHtml(buildCommonTrap(fact))}</p>
                </div>
                <div class="fact-grid">
                  <div class="fact-note">
                    <div class="fact-label">Intuition</div>
                    <p>${escapeHtml(buildConcreteFrame(fact))}</p>
                  </div>
                  <div class="fact-note">
                    <div class="fact-label">Check yourself</div>
                    <p>${escapeHtml(fact.render?.socraticQ || "")}</p>
                    <p class="fact-answer">${escapeHtml(buildRetrievalAnswer(fact))}</p>
                  </div>
                </div>
                <div class="fact-grid">
                  <div class="fact-note">
                    <div class="fact-label">Connection</div>
                    <p>${escapeHtml(buildConnection(
                      fact,
                      group[factIndex - 1] || groups[index - 1]?.[groups[index - 1].length - 1],
                      group[factIndex + 1] || groups[index + 1]?.[0]
                    ))}</p>
                  </div>
                  <div class="fact-note">
                    <div class="fact-label">Restate it plainly</div>
                    <p>${escapeHtml(joinSentences(
                      fact.render?.stepper || fact.render?.skimmer || fact.meaning,
                      `If you had to explain this to someone else in one breath, that is the version you would start with before adding nuance`
                    ))}</p>
                  </div>
                </div>
              </article>
            `).join("")}
          </div>
          <div class="deep-synthesis">
            <div class="fact-label">Section synthesis</div>
            <p>${escapeHtml(sectionSynthesis(group))}</p>
            <p>${escapeHtml(buildSectionOverview(topic, group, index))}</p>
            <p>${escapeHtml(buildSectionBridge(group, index, groups))}</p>
          </div>
        </div>
      </section>
    `).join("");
    el.innerHTML = `
      <article class="deep-article">
        <header class="mode-head mode-head--deep">
          <span class="mode-tag">Deep Reader</span>
          <h2>Stay with the full explanation</h2>
          <p>Long-form lesson arcs, explicit canonical claims, intuition layers, misconceptions, connections, and retrieval checks.</p>
        </header>
        <div class="deep-pull">${escapeHtml(topic.summary || "")}</div>
        <section class="deep-synthesis">
          <div class="fact-label">Lesson orientation</div>
          <p>${escapeHtml(buildOrientation(topic, facts))}</p>
          <p>${escapeHtml(buildStakes(topic, facts))}</p>
        </section>
        <section class="lesson-map">
          <div class="fact-label">Lesson map</div>
          <div class="thread-grid">
            ${buildThreadMap(facts)}
          </div>
        </section>
        ${sections}
        <section class="capstone">
          <div class="fact-label">Capstone synthesis</div>
          <p>${escapeHtml(facts.map((fact) => fact.meaning).join(" "))}</p>
          <p>${escapeHtml(buildCapstoneLesson(topic, facts))}</p>
          <p>${escapeHtml(joinSentences(
            `A strong reading of the topic should now let you move in both directions`,
            `You should be able to start from the summary and unpack the details, or start from a single fact and explain how it fits the whole lesson`
          ))}</p>
        </section>
      </article>
    `;
  }

  function renderVisual(topic){
    const el = $("cards");
    const facts = ensureFacts(topic);
    if(!facts.length){
      el.innerHTML = `<p class="muted">No facts found for this topic.</p>`;
      return;
    }
    el.innerHTML = `
      <section class="mode-head mode-head--visual visual-hero">
        <span class="mode-tag">Visual Chunker</span>
        <h2>Think in panels, not paragraphs</h2>
        <p>Each fact becomes a self-contained visual frame with title, intuition, core statement, a deeper caption, and a prompt.</p>
      </section>
      ${facts.map((fact, index) => `
        <article class="cardx visual-card">
          <div class="visual-glyph">${visualGlyphs[index % visualGlyphs.length]}</div>
          <div class="visual-copy">
            <div class="visual-index">Frame ${index + 1}</div>
            <h3>${escapeHtml(fact.render?.visualTitle || "")}</h3>
            <p>${escapeHtml(fact.render?.visualBody || "")}</p>
            <div class="visual-band">
              <strong>Core statement</strong>
              <span>${escapeHtml(fact.meaning || "")}</span>
            </div>
            <div class="visual-band">
              <strong>Deeper read</strong>
              <span>${escapeHtml(buildVisualCaption(fact))}</span>
            </div>
            <div class="visual-band visual-band-soft">
              <strong>Prompt</strong>
              <span>${escapeHtml(fact.render?.socraticQ || "")}</span>
            </div>
          </div>
        </article>
      `).join("")}
    `;
  }

  function renderStepper(topic){
    const el = $("steps");
    const facts = ensureFacts(topic);
    if(!facts.length){
      el.innerHTML = `<p class="muted">No facts found for this topic.</p>`;
      return;
    }
    el.innerHTML = `
      <section class="mode-head mode-head--stepper">
        <span class="mode-tag">Stepper</span>
        <h2>Follow one move at a time</h2>
        <p>Same lesson, decomposed into a guided sequence with order, reason, pitfalls, transitions, and a self-check at every step.</p>
      </section>
      <div class="stepper-stack">
        ${facts.map((fact, index) => `
          <article class="step step-strong">
            <div class="step-count">${index + 1}</div>
            <div class="step-copy">
              <div class="step-label">Next move</div>
              <div class="step-main">${escapeHtml(fact.render?.stepper || "")}</div>
              <p class="step-note">${escapeHtml(fact.render?.skimmer || "")}</p>
              <div class="step-callout">
                <strong>Why this step matters</strong>
                <p>${escapeHtml(buildWhyItMatters(fact))}</p>
              </div>
              <div class="step-callout">
                <strong>What to watch for</strong>
                <p>${escapeHtml(buildCommonTrap(fact))}</p>
              </div>
              <div class="step-callout">
                <strong>How this connects forward</strong>
                <p>${escapeHtml(buildStepBridge(fact, index, facts))}</p>
              </div>
              <div class="step-check">
                <strong>Check</strong>
                <p>${escapeHtml(fact.render?.socraticQ || "")}</p>
                <p>${escapeHtml(buildRetrievalAnswer(fact))}</p>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderSocratic(topic){
    const el = $("qa");
    const facts = ensureFacts(topic);
    if(!facts.length){
      el.innerHTML = `<p class="muted">No facts found for this topic.</p>`;
      return;
    }
    el.innerHTML = `
      <section class="mode-head mode-head--socratic">
        <span class="mode-tag">Socratic</span>
        <h2>Answer first, reveal second</h2>
        <p>This mode slows the lesson down on purpose. Try the question first, then inspect the answer, anchor statement, contrast, and explanation.</p>
      </section>
      <div class="qa-prompt">Pause before expanding each answer.</div>
      ${facts.map((fact, index) => `
        <details class="qa-item">
          <summary><span class="qa-index">${index + 1}</span><span>${escapeHtml(fact.render?.socraticQ || "")}</span></summary>
          <div class="answer">
            <p>${escapeHtml(fact.render?.socraticA || "")}</p>
            <div class="qa-anchor">
              <strong>Anchor fact</strong>
              <p>${escapeHtml(fact.meaning || "")}</p>
            </div>
            <div class="qa-anchor qa-anchor-soft">
              <strong>Why it matters</strong>
              <p>${escapeHtml(buildSocraticWhy(fact))}</p>
            </div>
            <div class="qa-anchor">
              <strong>Do not flatten it into</strong>
              <p>${escapeHtml(buildSocraticContrast(fact))}</p>
            </div>
            <div class="qa-anchor qa-anchor-soft">
              <strong>Carry this forward</strong>
              <p>${escapeHtml(buildConnection(fact, facts[index - 1], facts[index + 1]))}</p>
            </div>
          </div>
        </details>
      `).join("")}
    `;
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
    document.body.dataset.skin = name;

    for(const [k,v] of Object.entries(skin.css)){
      setVar(k, v);
    }

    // Mode buttons
    document.querySelectorAll(".mode-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.skin === name);
    });
    syncFeedbackButtons(name);
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
    const summaryEl = $("summary");
    const summaryVisible = ["skimmer", "stepper", "visual"].includes(currentSkin);
    summaryEl.classList.toggle("show", summaryVisible);
    summaryEl.dataset.skin = currentSkin;

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

  function syncFeedbackButtons(activeSkin){
    document.querySelectorAll(".adjust-btn").forEach((button) => {
      const mapped = feedbackToSkin[button.dataset.feedback];
      button.classList.toggle("active", mapped === activeSkin);
    });
  }

  function applyFeedback(feedbackKey){
    const skin = feedbackToSkin[feedbackKey];
    if(!skin) return;
    applySkin(skin);
    const status = $("adjustStatus");
    if(status){
      status.textContent = feedbackCopy[feedbackKey] || "Current lesson updated.";
    }
    const viewer = $("lessonViewer");
    if(viewer){
      viewer.classList.remove("viewer-pulse");
      void viewer.offsetWidth;
      viewer.classList.add("viewer-pulse");
      clearTimeout(applyFeedback._pulseTimer);
      applyFeedback._pulseTimer = setTimeout(() => {
        viewer.classList.remove("viewer-pulse");
      }, 900);
      viewer.scrollIntoView({ behavior: "smooth", block: "start" });
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

    document.querySelectorAll(".adjust-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyFeedback(btn.dataset.feedback));
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
    syncFeedbackButtons(currentSkin);
  }

  init();
})();
