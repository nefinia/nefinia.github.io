const CONDITION_KEY = "astronomy-ab-condition";
const RESULT_KEY = "astronomy-ab-result";
const HISTORY_KEY = "astronomy-ab-history";

const app = document.getElementById("app");
const statusBadge = document.getElementById("statusBadge");

const experimentState = {
  condition: null,
  readingTime: 0,
  answersImmediate: [],
  answersDelayed: [],
  responseTimeImmediate: [],
  responseTimeDelayed: [],
  scoreImmediate: 0,
  scoreDelayed: 0,
  timestamp: null,
  distractionClicks: 0,
};

const timers = {};

const lessonLowLoad = [
  {
    heading: "1. The Celestial Sphere as a Useful Model",
    paragraphs: [
      "When people look at the night sky, the stars, planets, and constellations appear to be arranged on a giant dome over Earth. Astronomers know that the objects are not actually attached to a dome, and they know the stars are at enormously different distances. Even so, it is often useful to pretend that every visible object is projected onto one imaginary sphere surrounding the observer. That conceptual shell is called the celestial sphere.",
      "The power of the model is that it turns a three-dimensional universe into a two-dimensional map of directions. If you want to say where Sirius appears in the sky, or how the Sun moves relative to the celestial equator, you usually do not begin by stating the true distance to those objects. You begin by stating where they appear on the sky. The celestial sphere lets astronomers describe those apparent directions cleanly.",
      "This is similar to how a globe can help with geography even though Earth is not perfectly smooth at every small scale. The model is not reality itself. It is a simplified framework that preserves the information needed for many observational questions. In astronomy, the first practical question is often not \"How far away is it?\" but \"In what direction do I need to point the telescope?\"",
    ],
  },
  {
    heading: "2. Why Distance Is Usually Ignored",
    paragraphs: [
      "The celestial sphere is based on angles, not on depth. Two stars may appear close together in a constellation even if one is much farther away than the other. From the observer's point of view, what matters first is the angle separating them on the sky. Because the sky map is angular, the distance information can be temporarily set aside without ruining the positional description.",
      "This is why astronomers talk about angular distance, angular diameter, and angular separation. Suppose the Moon and a bright planet appear near each other in the evening sky. The statement that they are five degrees apart tells you something immediately useful about what you see. It does not tell you how far either object is from Earth, but it does tell you how close they appear against the background sky.",
      "Ignoring distance does not mean distance is unimportant in astronomy. It means that for the specific task of locating objects, apparent direction comes first. The celestial sphere deliberately compresses deep space into a directional surface. That compression is exactly what makes coordinate systems possible.",
    ],
  },
  {
    heading: "3. The Celestial Equator and Celestial Poles",
    paragraphs: [
      "Once you imagine the celestial sphere, the next step is to extend Earth's own geometry outward. Earth's equator can be projected into space until it meets the celestial sphere. The resulting great circle is called the celestial equator. In the same way, Earth's rotation axis can be extended outward in both directions until it intersects the sphere. Those two intersection points are the north and south celestial poles.",
      "These features are important because they anchor the sky to Earth's rotation. The celestial sphere is not a random dome with arbitrary markings. Its most important reference lines come directly from Earth itself. If Earth did not rotate, the poles and equator would still be definable, but their observational importance comes from the fact that the entire apparent daily motion of the sky is organized around that axis.",
      "For an observer in the northern hemisphere, the north celestial pole appears above the northern horizon. For an observer in the southern hemisphere, the south celestial pole appears above the southern horizon. Polaris is useful because it lies close to the north celestial pole, which makes it appear almost fixed while the rest of the northern sky circles around it.",
    ],
  },
  {
    heading: "4. Declination: Sky Latitude",
    paragraphs: [
      "Declination tells you how far north or south an object lies relative to the celestial equator. It is measured in degrees, just as latitude is measured on Earth. An object on the celestial equator has a declination of 0 degrees. Objects north of the celestial equator have positive declinations, and objects south of it have negative declinations.",
      "A helpful intuition is to think of declination as sky latitude. If a star has a declination of +20 degrees, it lies twenty degrees north of the celestial equator. If another star has a declination of -35 degrees, it lies thirty-five degrees south of that same reference circle. Because declination is tied to the celestial equator, it does not depend on where a particular observer is standing. The observer's view of the horizon changes, but the object's declination does not.",
      "This stability makes declination part of a fixed coordinate system. When astronomers catalog stars, they want coordinates that remain attached to the sky rather than to one observer's local horizon. Declination provides the north-south component of that fixed system.",
    ],
  },
  {
    heading: "5. Right Ascension: Sky Longitude Measured by Time",
    paragraphs: [
      "Right ascension is the east-west coordinate that pairs with declination. It plays a role similar to longitude on Earth, but it is measured differently. Instead of using degrees in most practical contexts, astronomers often express right ascension in hours, minutes, and seconds. The full circle around the celestial equator is divided into 24 hours of right ascension.",
      "This time-based measurement is not arbitrary. Earth rotates once in about twenty-four hours, so the sky appears to drift by at a rate that naturally links angular position to time. If two stars differ by one hour in right ascension, they cross a given meridian about one hour apart. That is why right ascension is so useful for predicting when an object will be highest in the sky.",
      "The zero point of right ascension is defined by the vernal equinox direction, and values increase eastward along the celestial equator. You do not need that detail to grasp the core idea. The essential point is that right ascension tells you where an object lies around the celestial equator, just as declination tells you how far above or below it lies.",
    ],
  },
  {
    heading: "6. Earth’s Rotation and Apparent Motion",
    paragraphs: [
      "The stars appear to rise in the east and set in the west because Earth rotates eastward. This is a classic example of apparent motion. The sky is not literally spinning around Earth once every day. Instead, Earth turns underneath the sky, and that makes celestial objects seem to sweep westward across the celestial sphere.",
      "If you imagine standing on a rotating platform and looking outward, objects around you can appear to move even when they are relatively fixed in the distance. The same principle applies here. The daily motion is produced by the observer's rotating frame. That is why the sky seems to turn around the celestial poles. Objects close to a pole trace small circles. Objects farther away trace larger arcs.",
      "This apparent motion explains why right ascension connects naturally to time and why local horizon coordinates constantly change during the night. A star may be low in the east at one moment, high in the south later, and near the western horizon after that. Yet its right ascension and declination remain essentially the same during that single night.",
    ],
  },
  {
    heading: "7. Altitude and Azimuth Versus Equatorial Coordinates",
    paragraphs: [
      "There are two common ways to describe position on the sky. One is the local horizon system, which uses altitude and azimuth. Altitude tells you how high an object is above the horizon. Azimuth tells you the direction along the horizon, usually measured from north through east. These coordinates are immediate and practical for an observer at a specific place and time.",
      "The other common system is the equatorial system, which uses declination and right ascension. This system is tied to the celestial equator and celestial poles rather than to the observer's personal horizon. Because of that, it is much better for star charts and catalogs. A star's altitude and azimuth change as Earth rotates and also differ from one location to another. Its declination and right ascension are comparatively fixed.",
      "A useful comparison is this: altitude and azimuth answer, \"Where do I look right now from here?\" Right ascension and declination answer, \"Where is the object on the celestial sphere itself?\" Both systems are valuable, but they serve different purposes.",
    ],
  },
  {
    heading: "8. Observer Dependence and Fixed Coordinates",
    paragraphs: [
      "Observer dependence is the key difference between local and equatorial descriptions. If two people stand at different latitudes on Earth, they do not share the same horizon. Some stars visible to one observer may never rise for the other. The altitude and azimuth of the same object can therefore be very different for those two observers, especially at different times of night.",
      "Equatorial coordinates reduce that problem by attaching the grid to the celestial sphere rather than to the observer's horizon. The celestial equator, celestial poles, declination, and right ascension stay with the sky map. That is why astronomers can communicate about the position of an object in a way that remains meaningful across locations.",
      "Putting all of this together, the celestial sphere is a directional model of the sky. It ignores real depth so that angular relationships become easy to track. On that sphere, the celestial equator and poles define a stable framework. Declination measures north-south position, right ascension measures east-west position in time-based units, Earth's rotation causes apparent westward motion, and the observer's local horizon creates a separate coordinate system that changes with place and time.",
    ],
  },
];

const lessonHighLoad = [
  {
    heading: "The Celestial Sphere and Sky Coordinates",
    paragraphs: [
      "Astronomers often begin by treating the sky as though every visible object were projected onto an imaginary sphere centered on the observer, not because they think the stars are all attached to a shell at one distance, but because the first practical problem in observation is usually directional rather than spatial depth: where does an object appear, how far apart do two objects look, what direction should a telescope point, and what path does an object trace across the sky. In that model, the true three-dimensional structure of space is compressed into angular position, so two stars that are physically separated by immense distances can still appear adjacent in a constellation, and two objects at radically different depths can still be described as close together if their angular separation is small. This is why distance is temporarily ignored in the celestial sphere model. The model is not claiming that distance does not exist; it is selecting the information that matters for sky mapping. Angular separation, angular diameter, and apparent direction can all be handled on this projected surface, which is what makes the system useful.",
      "Once that sphere is imagined, Earth's own geometry is extended onto it. The equator projected outward becomes the celestial equator, and Earth's rotational axis extended outward meets the sphere at the celestial poles. Those reference features matter because the apparent daily motion of the sky is organized around the axis of Earth's rotation, so the sky seems to turn around the poles even though the motion is produced by Earth rotating eastward and making celestial objects appear to move westward. Observers in different hemispheres see different poles elevated above their horizons, and a star near a pole, such as Polaris near the north celestial pole, appears comparatively fixed while other stars seem to circle around it. This means the celestial sphere is not just a visual metaphor but a coordinate framework tied directly to the rotating Earth.",
      "The abstraction becomes especially powerful when you compare it with ordinary experience of the horizon. A local horizon divides visible from invisible sky for one observer, but the celestial sphere supplies a wider reference system that does not disappear when the observer moves. The same star can be hidden below the horizon for one person and high overhead for another, yet both observers can still imagine it lying at the same place on the sphere. That is the key tradeoff built into the model: it discards real depth in exchange for a stable angular map, and by doing so it permits cataloging, comparison, and prediction. The model therefore works not because it is literally true in a geometric sense, but because the questions astronomers often ask at the start of an observation concern placement, direction, timing, and relationships on the sky rather than the fully reconstructed three-dimensional structure of the universe.",
    ],
  },
  {
    heading: "Declination, Right Ascension, and Apparent Motion",
    paragraphs: [
      "To specify location on that framework, astronomers use declination and right ascension. Declination is analogous to latitude and measures how far north or south an object lies from the celestial equator, with positive values north of it, negative values south of it, and zero degrees on it; in practice, that means a star at positive declination lies north of the sky's equatorial reference circle no matter who is observing. Right ascension is the complementary east-west coordinate, analogous to longitude, but in most observational practice it is measured in hours, minutes, and seconds rather than ordinary degrees because the celestial sphere appears to rotate once in roughly twenty-four hours. A complete circle corresponds to twenty-four hours of right ascension, which makes the coordinate immediately useful for timing: if two objects differ by one hour in right ascension, they culminate roughly one hour apart. Right ascension therefore encodes position around the celestial equator in a way that is naturally connected to the daily motion produced by Earth's rotation.",
      "That apparent daily motion is the central observational effect behind the whole system. Stars appear to rise in the east and set in the west not because the sphere itself is actually revolving around Earth each day, but because Earth turns eastward, carrying the observer with it and causing the sky to seem to drift westward. The circle size traced by a star depends on its distance from the celestial pole, and because of this, some stars are circumpolar for particular latitudes and never set while others rise and set in large arcs. During all of this, a star's altitude and azimuth can change continuously over the course of a night, while its right ascension and declination remain effectively fixed in the equatorial system. This contrast is one of the main reasons astronomers distinguish between local and global sky coordinates.",
      "A useful but conceptually compressed way to keep the two equatorial coordinates straight is to remember that declination answers the question of how far above or below the celestial equator an object lies, while right ascension answers where the object lies around that equator, although the latter is stated in time units because the daily rotation makes angular displacement and elapsed sidereal time operationally connected. If an object has a larger declination, it is farther north on the sky map; if it has a later right ascension, it reaches the meridian later. These statements are easy to separate once learned, but in use they are intertwined with apparent motion, because the fixed coordinate position must be mentally distinguished from the changing local appearance. That distinction is exactly what the equatorial system is built to preserve.",
    ],
  },
  {
    heading: "Local Horizon Coordinates and Observer Dependence",
    paragraphs: [
      "The local horizon system uses altitude and azimuth, which are excellent for describing where an object is for a specific observer at a specific time. Altitude measures how high the object is above the horizon, while azimuth identifies the object's direction along the horizon, typically measured from north through east. These coordinates answer an immediately practical question, namely where to look right now, but they are inherently observer dependent because the horizon changes with geographic location and because the sky appears to turn as Earth rotates. The same star can have one altitude and azimuth for an observer in Paris and a completely different pair of values for an observer in Cape Town, and even for the same observer those values change hour by hour. By contrast, the equatorial system is attached to the celestial sphere itself, so right ascension and declination remain the stable reference for catalogs, star charts, and communication between observers.",
      "The consequence is that the same object can be described in two very different but equally legitimate ways depending on the task. If the goal is immediate viewing, altitude and azimuth are the direct coordinates to use because they tell the observer how high to look and in what compass direction. If the goal is to identify the object on a map of the sky, compare it with catalog data, or describe it in a way that is not tied to one local horizon, right ascension and declination are the better coordinates. The celestial sphere therefore acts as a shared angular map, ignoring actual depth so that direction becomes easy to describe, while Earth's rotation explains why the sky seems to move and why local coordinates vary so strongly with both time and observer location even when equatorial coordinates remain fixed.",
      "Seen together, these systems solve different problems rather than competing to be the single correct one. Horizon coordinates tell an observer what to do now, equatorial coordinates tell observers what object they are talking about regardless of where they are, the celestial equator and poles provide the sky-fixed scaffolding for that shared description, and the daily westward sweep of the stars is interpreted not as literal motion of the entire universe around Earth but as an apparent consequence of Earth's rotation. Once those pieces are joined, the central logic of the lesson becomes clearer even if it must be inferred from several linked ideas at once: the sky is modeled as a sphere in order to represent apparent direction, angular coordinates replace depth for mapping, declination and right ascension define a relatively fixed grid on that sphere, altitude and azimuth define a local moving view, and observer location determines the local view without altering the underlying equatorial position of the object.",
      "That final contrast between local appearance and fixed sky position is the practical reason the lesson contains both coordinate systems instead of just one. If an instructor tells students that a star has a certain altitude and azimuth, the statement is incomplete unless time and location are also supplied, because those quantities change continuously with Earth's rotation and differ across observers. If the same instructor gives the star's right ascension and declination, the description becomes transportable: another observer can use those values with a chart or telescope mount and then translate them into a local viewing direction. In other words, observer dependence belongs mainly to horizon coordinates, while observer independence belongs mainly to equatorial coordinates, and that distinction only makes sense because the celestial sphere treats the sky as an angular surface whose apparent motion is produced by the turning Earth rather than by changes in the stars' mapped positions.",
    ],
  },
];

const questions = [
  {
    id: "q1",
    prompt: "What is the main purpose of the celestial sphere model?",
    options: [
      "To calculate the true distances to stars from Earth",
      "To describe apparent positions on the sky using direction rather than depth",
      "To show that all stars lie on a single physical shell around Earth",
      "To replace all coordinate systems with horizon measurements only",
    ],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: "Why can astronomers ignore distance when using the celestial sphere for mapping?",
    options: [
      "Because objects in space are all nearly the same distance away",
      "Because angular position is often enough to describe where something appears in the sky",
      "Because distance cannot be measured in astronomy",
      "Because the celestial sphere only applies to planets, not stars",
    ],
    correctIndex: 1,
  },
  {
    id: "q3",
    prompt: "Which statement best defines declination?",
    options: [
      "The angular distance of an object above the horizon",
      "The north-south position of an object measured from the celestial equator",
      "The east-west position of an object measured in compass degrees",
      "The time it takes for an object to cross the meridian",
    ],
    correctIndex: 1,
  },
  {
    id: "q4",
    prompt: "Why is right ascension commonly measured in hours rather than only in degrees?",
    options: [
      "Because it is based on the Moon's monthly orbit",
      "Because right ascension measures true time since sunset",
      "Because the apparent daily rotation of the sky links angular position to a 24-hour cycle",
      "Because declination already uses all the degree values",
    ],
    correctIndex: 2,
  },
  {
    id: "q5",
    prompt: "The stars appear to move westward across the sky mainly because:",
    options: [
      "The celestial sphere physically rotates westward every day",
      "Earth rotates eastward, creating an apparent westward motion of the sky",
      "The stars are pulled westward by Earth's gravity",
      "The Sun pushes stars across the sky with reflected light",
    ],
    correctIndex: 1,
  },
  {
    id: "q6",
    prompt: "Which coordinate pair is most tied to an observer's local horizon?",
    options: [
      "Right ascension and declination",
      "Declination and celestial longitude",
      "Altitude and azimuth",
      "Right ascension and hour angle",
    ],
    correctIndex: 2,
  },
  {
    id: "q7",
    prompt: "What stays comparatively fixed for a star during one night of observation?",
    options: [
      "Its altitude and azimuth",
      "Its right ascension and declination",
      "Its compass direction only",
      "Its horizon distance and meridian time",
    ],
    correctIndex: 1,
  },
  {
    id: "q8",
    prompt: "What changes if two observers at different latitudes watch the same star at the same moment?",
    options: [
      "The star's declination",
      "The star's right ascension",
      "The star's altitude and azimuth",
      "The position of the celestial equator on the sky map",
    ],
    correctIndex: 2,
  },
  {
    id: "q9",
    prompt: "How is declination most similar to a terrestrial coordinate?",
    options: [
      "It works like latitude by measuring north or south from an equator",
      "It works like longitude by measuring east or west in hours",
      "It works like altitude by measuring height above the horizon",
      "It works like azimuth by measuring around the compass",
    ],
    correctIndex: 0,
  },
  {
    id: "q10",
    prompt: "Which statement best contrasts equatorial coordinates with horizon coordinates?",
    options: [
      "Equatorial coordinates depend strongly on the observer, while horizon coordinates do not",
      "Horizon coordinates are fixed to the celestial sphere, while equatorial coordinates change hourly",
      "Equatorial coordinates provide a more observer-independent sky map than altitude and azimuth",
      "Both systems are equally fixed and never change with time or location",
    ],
    correctIndex: 2,
  },
];

let currentTest = null;
let distractionInterval = null;
let distractionCountdown = 60;

function assignCondition() {
  const savedCondition = localStorage.getItem(CONDITION_KEY);
  if (savedCondition === "A" || savedCondition === "B") {
    experimentState.condition = savedCondition;
    return savedCondition;
  }

  const assigned = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(CONDITION_KEY, assigned);
  experimentState.condition = assigned;
  return assigned;
}

function startTimer(label) {
  timers[label] = performance.now();
}

function stopTimer(label) {
  const start = timers[label];
  if (!start) {
    return 0;
  }
  const elapsed = Math.round(performance.now() - start);
  delete timers[label];
  return elapsed;
}

function formatMs(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function mean(values) {
  if (!values.length) {
    return 0;
  }
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function shuffleArray(input) {
  const array = [...input];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
}

function getLessonVersion() {
  return experimentState.condition === "A"
    ? { type: "low-load", sections: lessonLowLoad }
    : { type: "high-load", sections: lessonHighLoad };
}

function setStatus(text) {
  statusBadge.textContent = text;
}

function renderIntro() {
  setStatus("Intro");
  app.innerHTML = `
    <div class="stack">
      <div>
        <h2>Welcome</h2>
        <p class="lede">This is a short astronomy lesson followed by questions.</p>
        <p class="lede">Please read the lesson carefully in one sitting. Afterward, you will answer a short multiple-choice test, complete a brief 60-second distraction task, and then answer a second set of questions.</p>
      </div>

      <div class="meta-row">
        <div class="meta-card">
          <span class="meta-label">Topic</span>
          <div class="meta-value">Celestial Sphere, Coordinates, and Apparent Motion</div>
        </div>
        <div class="meta-card">
          <span class="meta-label">Format</span>
          <div class="meta-value">Lesson → Test → Distraction → Test</div>
        </div>
      </div>

      <div class="button-row">
        <button class="primary" id="startExperiment">Start</button>
      </div>
    </div>
  `;

  document.getElementById("startExperiment").addEventListener("click", renderLesson);
}

function renderLesson() {
  setStatus("Lesson");
  const lesson = getLessonVersion();
  startTimer("reading");

  const lessonHtml = lesson.sections
    .map(
      (section) => `
        <article class="lesson-section">
          <h3>${section.heading}</h3>
          ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </article>
      `
    )
    .join("");

  app.innerHTML = `
    <div class="stack">
      <div>
        <h2>Lesson</h2>
        <p class="lede">Read the lesson below, then continue when you are finished.</p>
      </div>

      <div class="meta-row">
        <div class="meta-card">
          <span class="meta-label">Topic</span>
          <div class="meta-value">The Celestial Sphere and Sky Coordinates</div>
        </div>
        <div class="meta-card">
          <span class="meta-label">Estimated Reading</span>
          <div class="meta-value">8–12 minutes</div>
        </div>
      </div>

      <section class="lesson ${lesson.type}">
        ${lessonHtml}
      </section>

      <div class="button-row">
        <button class="primary" id="continueToImmediate">Continue</button>
      </div>
    </div>
  `;

  document.getElementById("continueToImmediate").addEventListener("click", () => {
    experimentState.readingTime = stopTimer("reading");
    renderTest("immediate");
  });
}

function buildTestSession(stage) {
  const sourceQuestions = stage === "delayed" ? shuffleArray(questions) : [...questions];
  return {
    stage,
    index: 0,
    items: sourceQuestions.map((question) => {
      const shuffledOptions = shuffleArray(
        question.options.map((option, optionIndex) => ({
          text: option,
          isCorrect: optionIndex === question.correctIndex,
          originalIndex: optionIndex,
        }))
      );

      return {
        id: question.id,
        prompt: question.prompt,
        options: shuffledOptions,
      };
    }),
    answers: [],
    responseTimes: [],
  };
}

function renderTest(stage) {
  currentTest = buildTestSession(stage);
  setStatus(stage === "immediate" ? "Immediate Test" : "Delayed Test");
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const { stage, index, items } = currentTest;
  const item = items[index];
  startTimer(`question-${stage}-${item.id}`);

  const progressPercent = ((index + 1) / items.length) * 100;

  app.innerHTML = `
    <div class="stack">
      <div>
        <h2>${stage === "immediate" ? "Immediate Test" : "Delayed Test"}</h2>
        <p class="lede">Choose the best answer for each question.</p>
      </div>

      <div class="question-progress">
        <div>
          <span class="small-label">Question</span>
          <strong>${index + 1} of ${items.length}</strong>
        </div>
        <div class="timer">Response time starts when the question appears.</div>
      </div>

      <div class="progress-track" aria-hidden="true">
        <div class="progress-bar" style="width: ${progressPercent}%"></div>
      </div>

      <div class="question-wrap">
        <article class="question-card">
          <span class="small-label">${stage === "immediate" ? "Immediate Recall" : "Delayed Recall"}</span>
          <h3>${item.prompt}</h3>
          <form id="questionForm">
            <div class="option-list">
              ${item.options
                .map(
                  (option, optionIndex) => `
                    <label class="option">
                      <input type="radio" name="answer" value="${optionIndex}" />
                      <span>${option.text}</span>
                    </label>
                  `
                )
                .join("")}
            </div>
            <div class="button-row">
              <button class="primary" type="submit">Next</button>
            </div>
          </form>
        </article>
      </div>
    </div>
  `;

  document.getElementById("questionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const nextAction = collectAnswers();
    if (nextAction) {
      nextAction();
    }
  });
}

function collectAnswers() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    window.alert("Please choose an answer before continuing.");
    return null;
  }

  const item = currentTest.items[currentTest.index];
  const chosenIndex = Number(selected.value);
  const chosenOption = item.options[chosenIndex];
  const responseTime = stopTimer(`question-${currentTest.stage}-${item.id}`);

  currentTest.answers.push({
    id: item.id,
    selectedOriginalIndex: chosenOption.originalIndex,
    selectedText: chosenOption.text,
    correct: chosenOption.isCorrect,
  });
  currentTest.responseTimes.push(responseTime);

  if (currentTest.index < currentTest.items.length - 1) {
    currentTest.index += 1;
    return renderCurrentQuestion;
  }

  const score = calculateScore(currentTest.answers);

  if (currentTest.stage === "immediate") {
    experimentState.answersImmediate = currentTest.answers;
    experimentState.responseTimeImmediate = currentTest.responseTimes;
    experimentState.scoreImmediate = score;
    return renderDistraction;
  }

  experimentState.answersDelayed = currentTest.answers;
  experimentState.responseTimeDelayed = currentTest.responseTimes;
  experimentState.scoreDelayed = score;
  experimentState.timestamp = new Date().toISOString();
  saveResults();
  return renderResults;
}

function calculateScore(answerSet) {
  return answerSet.reduce((total, answer) => total + (answer.correct ? 1 : 0), 0);
}

function renderDistraction() {
  setStatus("Distractor");
  distractionCountdown = 60;
  experimentState.distractionClicks = 0;

  app.innerHTML = `
    <div class="stack">
      <div>
        <h2>Short Activity</h2>
        <p class="lede">For the next 60 seconds, click the moving star each time it appears. This is only a short break before the next questions.</p>
      </div>

      <div class="distraction-meta">
        <div class="meta-card">
          <span class="meta-label">Time Remaining</span>
          <div class="meta-value" id="distractionTime">60s</div>
        </div>
        <div class="meta-card">
          <span class="meta-label">Clicks</span>
          <div class="meta-value" id="distractionClicks">0</div>
        </div>
      </div>

      <div class="distraction-board" id="distractionBoard">
        <button class="click-target" id="clickTarget" type="button">★</button>
      </div>

      <div class="button-row">
        <button class="primary" id="continueToDelayed" disabled>Continue</button>
      </div>
    </div>
  `;

  const board = document.getElementById("distractionBoard");
  const target = document.getElementById("clickTarget");
  const timeLabel = document.getElementById("distractionTime");
  const clickLabel = document.getElementById("distractionClicks");
  const continueButton = document.getElementById("continueToDelayed");

  const moveTarget = () => {
    const boardRect = board.getBoundingClientRect();
    const maxX = Math.max(8, boardRect.width - target.offsetWidth - 8);
    const maxY = Math.max(8, boardRect.height - target.offsetHeight - 8);
    target.style.left = `${Math.floor(Math.random() * maxX)}px`;
    target.style.top = `${Math.floor(Math.random() * maxY)}px`;
  };

  target.addEventListener("click", () => {
    experimentState.distractionClicks += 1;
    clickLabel.textContent = String(experimentState.distractionClicks);
    moveTarget();
  });

  moveTarget();

  distractionInterval = window.setInterval(() => {
    distractionCountdown -= 1;
    timeLabel.textContent = `${distractionCountdown}s`;

    if (distractionCountdown <= 0) {
      window.clearInterval(distractionInterval);
      continueButton.disabled = false;
      target.disabled = true;
      continueButton.addEventListener("click", () => renderTest("delayed"), { once: true });
    }
  }, 1000);
}

function saveResults() {
  const payload = {
    condition: experimentState.condition,
    readingTime: experimentState.readingTime,
    answersImmediate: experimentState.answersImmediate,
    answersDelayed: experimentState.answersDelayed,
    scoreImmediate: experimentState.scoreImmediate,
    scoreDelayed: experimentState.scoreDelayed,
    responseTimeImmediate: experimentState.responseTimeImmediate,
    responseTimeDelayed: experimentState.responseTimeDelayed,
    timestamp: experimentState.timestamp,
  };

  localStorage.setItem(RESULT_KEY, JSON.stringify(payload));

  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  history.push(payload);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderResults() {
  setStatus("Results");

  const immediateAverage = mean(experimentState.responseTimeImmediate);
  const delayedAverage = mean(experimentState.responseTimeDelayed);

  app.innerHTML = `
    <div class="stack">
      <div>
        <h2>Results</h2>
        <p class="lede">Your responses have been saved locally on this device.</p>
      </div>

      <div class="results-grid">
        <div class="result-card good">
          <span class="result-label">Immediate Score</span>
          <div class="result-value">${experimentState.scoreImmediate}/${questions.length}</div>
        </div>
        <div class="result-card good">
          <span class="result-label">Delayed Score</span>
          <div class="result-value">${experimentState.scoreDelayed}/${questions.length}</div>
        </div>
        <div class="result-card">
          <span class="result-label">Reading Time</span>
          <div class="result-value">${formatMs(experimentState.readingTime)}</div>
        </div>
        <div class="result-card">
          <span class="result-label">Condition</span>
          <div class="result-value">${experimentState.condition}</div>
        </div>
      </div>

      <div class="results-grid">
        <div class="result-card">
          <span class="result-label">Immediate Response Times</span>
          <div class="result-value">${formatMs(experimentState.responseTimeImmediate.reduce((sum, value) => sum + value, 0))}</div>
          <p class="fine-print">Average per question: ${formatMs(immediateAverage)}</p>
        </div>
        <div class="result-card">
          <span class="result-label">Delayed Response Times</span>
          <div class="result-value">${formatMs(experimentState.responseTimeDelayed.reduce((sum, value) => sum + value, 0))}</div>
          <p class="fine-print">Average per question: ${formatMs(delayedAverage)}</p>
        </div>
      </div>

      <div class="summary-card">
        <span class="small-label">Saved Data</span>
        <p class="fine-print">Latest result key: <span class="inline-code">${RESULT_KEY}</span></p>
        <p class="fine-print">Timestamp: ${experimentState.timestamp}</p>
        <p class="fine-print">Immediate answers recorded: ${experimentState.answersImmediate.length}. Delayed answers recorded: ${experimentState.answersDelayed.length}.</p>
      </div>

      <div class="button-row">
        <button class="secondary" id="restartStudy">Run Again</button>
        <button class="ghost" id="viewRawData">Show Stored JSON</button>
      </div>

      <pre class="meta-card" id="rawData" hidden></pre>
    </div>
  `;

  document.getElementById("restartStudy").addEventListener("click", () => {
    resetSession();
    renderIntro();
  });

  document.getElementById("viewRawData").addEventListener("click", () => {
    const raw = document.getElementById("rawData");
    raw.hidden = !raw.hidden;
    raw.textContent = localStorage.getItem(RESULT_KEY) || "{}";
  });
}

function resetSession() {
  if (distractionInterval) {
    window.clearInterval(distractionInterval);
  }

  experimentState.readingTime = 0;
  experimentState.answersImmediate = [];
  experimentState.answersDelayed = [];
  experimentState.responseTimeImmediate = [];
  experimentState.responseTimeDelayed = [];
  experimentState.scoreImmediate = 0;
  experimentState.scoreDelayed = 0;
  experimentState.timestamp = null;
  experimentState.distractionClicks = 0;
  currentTest = null;
  distractionCountdown = 60;
}

assignCondition();
renderIntro();
