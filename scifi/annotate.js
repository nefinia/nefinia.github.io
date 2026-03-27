const ANNOTATION_STORAGE_KEY = "scifi-prediction-benchmark-annotations";

function loadStoredAnnotations() {
  try {
    return JSON.parse(window.localStorage.getItem(ANNOTATION_STORAGE_KEY) || "{}");
  } catch (_error) {
    return {};
  }
}

function saveStoredAnnotations(payload) {
  window.localStorage.setItem(ANNOTATION_STORAGE_KEY, JSON.stringify(payload, null, 2));
}

function renderStatus(status) {
  const normalized = status || "pending";
  return `<span class="status-pill ${normalized}">${normalized.replaceAll("_", " ")}</span>`;
}

function saveAnnotation(predictionId, container) {
  const status = container.querySelector("select").value;
  const notes = container.querySelector("textarea").value;
  const annotations = loadStoredAnnotations();
  annotations[predictionId] = {
    prediction_id: predictionId,
    status,
    notes,
    annotator: "local-ui",
  };
  saveStoredAnnotations(annotations);
  init();
}

function exportAnnotations() {
  const content = JSON.stringify(Object.values(loadStoredAnnotations()), null, 2);
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "manual_annotations.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function init() {
  const predictions = window.BENCHMARK_DATA.predictions;
  const baseAnnotations = new Map(
    (window.BENCHMARK_DATA.annotations || []).map((annotation) => [annotation.prediction_id, annotation]),
  );
  const localAnnotations = loadStoredAnnotations();
  const list = document.getElementById("annotationList");
  list.innerHTML = predictions.map((prediction) => {
    const annotation = localAnnotations[prediction.id] || baseAnnotations.get(prediction.id) || {};
    const status = annotation.status || "pending";
    const notes = annotation.notes || "";
    return `
      <article class="annotation-card" data-id="${prediction.id}">
        <div class="card-topline">
          <h3>${prediction.author} • ${prediction.work}</h3>
          ${renderStatus(status)}
        </div>
        <p>${prediction.excerpt}</p>
        <div class="meta-row">
          <span class="meta-chip">${prediction.technology_domain}</span>
          <span class="meta-chip">${prediction.matched_technology_name}</span>
        </div>
        <div class="annotation-actions">
          <select>
            <option value="pending" ${status === "pending" ? "selected" : ""}>pending</option>
            <option value="accepted" ${status === "accepted" ? "selected" : ""}>accepted</option>
            <option value="accepted_with_note" ${status === "accepted_with_note" ? "selected" : ""}>accepted_with_note</option>
            <option value="needs_review" ${status === "needs_review" ? "selected" : ""}>needs_review</option>
          </select>
        </div>
        <textarea placeholder="Annotation notes">${notes}</textarea>
        <div class="annotation-actions">
          <button>Save annotation</button>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll(".annotation-card").forEach((card) => {
    card.querySelector("button").addEventListener("click", () => saveAnnotation(card.dataset.id, card));
  });

  document.getElementById("exportAnnotations").onclick = exportAnnotations;
  document.getElementById("resetAnnotations").onclick = () => {
    window.localStorage.removeItem(ANNOTATION_STORAGE_KEY);
    init();
  };
}

try {
  init();
} catch (error) {
  document.body.innerHTML = `<div class="page-shell"><div class="panel"><h2>Annotation error</h2><p>${error.message}</p></div></div>`;
}
