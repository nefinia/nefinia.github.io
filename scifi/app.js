const ANNOTATION_STORAGE_KEY = "scifi-prediction-benchmark-annotations";
const state = {
  authors: window.BENCHMARK_DATA.authors,
  predictions: window.BENCHMARK_DATA.predictions,
  matches: window.BENCHMARK_DATA.matches,
  selectedAuthor: null,
  selectedPrediction: null,
  domain: "",
  yearMax: 2000,
};

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function scorePct(value) {
  return `${(value * 100).toFixed(1)}`;
}

function loadStoredAnnotations() {
  try {
    return JSON.parse(window.localStorage.getItem(ANNOTATION_STORAGE_KEY) || "{}");
  } catch (_error) {
    return {};
  }
}

function annotationFor(predictionId) {
  const localAnnotations = loadStoredAnnotations();
  return localAnnotations[predictionId] || state.matches[predictionId]?.annotation || null;
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboard");
  const filteredPredictions = state.predictions.filter((prediction) => {
    const matchesDomain = !state.domain || prediction.technology_domain === state.domain;
    const withinYear = prediction.year <= state.yearMax;
    return matchesDomain && withinYear;
  });

  const authorScores = state.authors
    .map((author) => {
      const authorPredictions = filteredPredictions.filter((prediction) => prediction.author === author.author);
      if (!authorPredictions.length) {
        return null;
      }
      const average = authorPredictions.reduce((sum, item) => sum + item.score, 0) / authorPredictions.length;
      return { ...author, filteredAverage: average };
    })
    .filter(Boolean)
    .sort((left, right) => right.filteredAverage - left.filteredAverage);

  container.innerHTML = authorScores.map((author, index) => `
    <article class="leaderboard-card ${state.selectedAuthor === author.author ? "active" : ""}" data-author="${author.author}">
      <div class="card-topline">
        <h3>${author.author}</h3>
        <span class="rank-pill">#${index + 1}</span>
      </div>
      <div class="meta-row">
        <span class="score-pill">${scorePct(author.filteredAverage)} score</span>
        <span class="meta-chip">${author.prediction_count} predictions</span>
        <span class="meta-chip">${author.domain_count} domains</span>
      </div>
    </article>
  `).join("");

  container.querySelectorAll(".leaderboard-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedAuthor = card.dataset.author;
      renderAuthorProfile();
      renderLeaderboard();
      renderPredictionList();
    });
  });
}

function renderSubscoreBar(label, value) {
  return `
    <div class="bar-row">
      <span>${label}</span>
      <div class="bar-track">
        <div class="bar-fill" style="width:${percent(value)}"></div>
      </div>
      <strong>${scorePct(value)}</strong>
    </div>
  `;
}

function renderAuthorProfile() {
  const container = document.getElementById("authorProfile");
  const author = state.authors.find((item) => item.author === state.selectedAuthor);
  if (!author) {
    container.className = "author-profile empty-state";
    container.textContent = "Select an author from the leaderboard.";
    return;
  }

  container.className = "author-profile";
  container.innerHTML = `
    <div class="detail-section">
      <h3>${author.author}</h3>
      <p>${author.prediction_count} seeded predictions spanning ${author.domain_count} domains.</p>
      <div class="metric-grid">
        <div class="metric-box"><span>Overall score</span><strong>${author.normalized_score.toFixed(1)}</strong></div>
        <div class="metric-box"><span>Mean prediction score</span><strong>${scorePct(author.mean_prediction_score)}</strong></div>
      </div>
    </div>
    <div class="detail-section">
      <h4>Average subscore breakdown</h4>
      <div class="subscore-bars">
        ${renderSubscoreBar("Existence", author.average_existence_match)}
        ${renderSubscoreBar("Functional", author.average_functional_match)}
        ${renderSubscoreBar("Mechanistic", author.average_mechanistic_match)}
        ${renderSubscoreBar("Societal", author.average_societal_match)}
      </div>
    </div>
    <div class="detail-section">
      <h4>Domain strengths</h4>
      <div class="meta-row">
        ${author.domains.map((domain) => `<span class="meta-chip">${domain}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderPredictionList() {
  const container = document.getElementById("predictionList");
  const predictions = state.predictions
    .filter((prediction) => !state.selectedAuthor || prediction.author === state.selectedAuthor)
    .filter((prediction) => !state.domain || prediction.technology_domain === state.domain)
    .filter((prediction) => prediction.year <= state.yearMax)
    .sort((left, right) => right.score - left.score);

  if (!predictions.length) {
    container.innerHTML = `<div class="empty-state">No predictions match the current filters.</div>`;
    return;
  }

  container.innerHTML = predictions.map((prediction) => {
    const annotation = annotationFor(prediction.id);
    return `
      <article class="prediction-card ${state.selectedPrediction === prediction.id ? "active" : ""}" data-id="${prediction.id}">
        <div class="card-topline">
          <h3>${prediction.work}</h3>
          <span class="score-pill">${scorePct(prediction.score)}</span>
        </div>
        <p>${prediction.author} • ${prediction.year}</p>
        <div class="meta-row">
          <span class="meta-chip">${prediction.technology_domain}</span>
          <span class="meta-chip">${prediction.matched_technology_name}</span>
          ${annotation ? `<span class="status-pill ${annotation.status}">${annotation.status.replaceAll("_", " ")}</span>` : ""}
        </div>
      </article>
    `;
  }).join("");

  container.querySelectorAll(".prediction-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedPrediction = card.dataset.id;
      renderPredictionList();
      renderMatchDetail(card.dataset.id);
    });
  });
}

function renderMatchDetail(predictionId) {
  const container = document.getElementById("matchDetail");
  const payload = state.matches[predictionId];
  const { prediction, score, top_match, candidates } = payload;
  const annotation = annotationFor(predictionId);
  container.className = "match-detail";
  container.innerHTML = `
    <div class="detail-section">
      <div class="card-topline">
        <h3>${prediction.work}</h3>
        <span class="score-pill">${scorePct(score.final_score)} final score</span>
      </div>
      <p><strong>${prediction.author}</strong> predicted a ${prediction.technology_domain} concept in ${prediction.year}.</p>
      <p>${prediction.excerpt}</p>
      <div class="meta-row">
        <span class="meta-chip">Type: ${prediction.prediction_type}</span>
        <span class="meta-chip">Specificity: ${prediction.specificity_score.toFixed(2)}</span>
        ${annotation ? `<span class="status-pill ${annotation.status}">${annotation.status.replaceAll("_", " ")}</span>` : ""}
      </div>
    </div>
    <div class="detail-section">
      <h4>Top matched technology</h4>
      <p><strong>${score.matched_technology_name}</strong> (${score.matched_technology_year}) with combined match score ${top_match.combined_score.toFixed(2)}.</p>
      <div class="subscore-bars">
        ${renderSubscoreBar("Existence", score.existence_match)}
        ${renderSubscoreBar("Functional", score.functional_match)}
        ${renderSubscoreBar("Mechanistic", score.mechanistic_match)}
        ${renderSubscoreBar("Societal", score.societal_match)}
      </div>
    </div>
    <div class="detail-section">
      <h4>Comparison details</h4>
      <ul>
        <li><strong>Description:</strong> ${prediction.description}</li>
        <li><strong>Mechanism:</strong> ${prediction.mechanism}</li>
        <li><strong>Societal role:</strong> ${prediction.societal_role}</li>
        <li><strong>Lead time:</strong> ${score.lead_time_years} years</li>
      </ul>
    </div>
    <div class="detail-section">
      <h4>Candidate matches</h4>
      <ul>
        ${candidates.map((candidate) => `<li>${candidate.rank}. ${candidate.technology_name} (${candidate.combined_score.toFixed(2)})</li>`).join("")}
      </ul>
    </div>
  `;
}

function hydrateFilters() {
  const domainSelect = document.getElementById("domainFilter");
  domainSelect.innerHTML = `<option value="">All domains</option>${window.BENCHMARK_DATA.domains.map((domain) => `<option value="${domain}">${domain}</option>`).join("")}`;
  domainSelect.addEventListener("change", () => {
    state.domain = domainSelect.value;
    renderLeaderboard();
    renderPredictionList();
  });

  const yearSlider = document.getElementById("yearSlider");
  const yearLabel = document.getElementById("yearLabel");
  yearSlider.addEventListener("input", () => {
    state.yearMax = Number(yearSlider.value);
    yearLabel.textContent = yearSlider.value;
    renderLeaderboard();
    renderPredictionList();
  });
}

function init() {
  hydrateFilters();
  state.selectedAuthor = state.authors[0]?.author ?? null;
  renderLeaderboard();
  renderAuthorProfile();
  renderPredictionList();
}

try {
  init();
} catch (error) {
  document.body.innerHTML = `<div class="page-shell"><div class="panel"><h2>Application error</h2><p>${error.message}</p></div></div>`;
}
