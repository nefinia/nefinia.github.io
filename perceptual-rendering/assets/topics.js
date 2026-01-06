// assets/topics.js
// Perceptual Rendering PoC — canonical facts with mode-specific encodings.
//
// Design rule (information equivalence):
// - Each topic defines a set of canonical facts (atomic propositions).
// - Every mode must cover ALL facts.
// - Modes differ in phrasing/structure, not in which information is included.
//
// Rendering expectation (app.js should render from facts[].render):
// - skimmer: bullet list of render.skimmer
// - stepper: numbered list of render.stepper (or {title/body} split if you prefer)
// - deep: paragraphs of render.deep
// - visual: cards using render.visualTitle + render.visualBody
// - socratic: Q/A accordion using render.socraticQ + render.socraticA

window.PR_TOPICS = {
  blackhole: {
    id: "blackhole",
    title: "What is a black hole — really?",
    subtitle:
      "A region where spacetime geometry changes what ‘future’ paths are possible. Same facts, different renderings.",
    summary:
      "A black hole is defined by an event horizon: beyond it, escape to infinity becomes impossible. Most observables come from nearby matter (orbits, accretion, gravitational waves), not from the hole itself.",
    facts: [
      {
        id: "bh_01_horizon_definition",
        meaning:
          "A black hole is defined by an event horizon; beyond it, escape to infinity is impossible for future-directed paths.",
        render: {
          skimmer:
            "A black hole is defined by an event horizon: beyond it, escape to infinity is impossible.",
          stepper:
            "Define the boundary first: an event horizon is where future paths can’t lead back out to distant observers.",
          deep:
            "A black hole is defined by the presence of an event horizon. Past that boundary, the structure of spacetime is such that no future-directed trajectory reaches distant observers, so ‘escape to infinity’ is impossible.",
          visualTitle: "Event horizon defines it",
          visualBody:
            "Past the horizon, future-directed paths don’t reach infinity: signals can’t get out to distant observers.",
          socraticQ:
            "What feature defines a black hole (independent of pop-culture imagery)?",
          socraticA:
            "The event horizon: a boundary beyond which escape to infinity is impossible for future-directed paths."
        }
      },
      {
        id: "bh_02_horizon_not_surface",
        meaning:
          "The horizon is not a solid surface; it is a causal boundary in spacetime.",
        render: {
          skimmer:
            "The event horizon is not a solid surface; it’s a causal boundary in spacetime.",
          stepper:
            "Don’t imagine a wall: treat the horizon as a boundary in what trajectories can do, not a physical membrane.",
          deep:
            "The event horizon is not a tangible surface you could ‘hit’. It is a causal boundary: a feature of spacetime that changes which directions count as ‘future’ for signals and matter.",
          visualTitle: "Horizon ≠ wall",
          visualBody:
            "It’s not a surface. It’s a spacetime boundary that changes what futures are possible.",
          socraticQ:
            "Is the event horizon a physical surface you could collide with?",
          socraticA:
            "No. It’s a causal boundary in spacetime, not a material wall."
        }
      },
      {
        id: "bh_03_outside_gravity_mass_distance",
        meaning:
          "Outside the horizon, gravitational influence depends mainly on mass and distance (to a good approximation), not on ‘black-hole-ness’.",
        render: {
          skimmer:
            "Outside the horizon, gravity depends mainly on mass and distance—not on ‘being a black hole’.",
          stepper:
            "Separate ‘outside’ from ‘inside’: far from the horizon, gravity looks like gravity from any object with the same mass.",
          deep:
            "At distances well outside the horizon, the gravitational influence is set primarily by mass (and distance). A black hole doesn’t pull harder just because it’s a black hole; what changes is how close you can get before spacetime geometry becomes extreme.",
          visualTitle: "Mass sets the pull (outside)",
          visualBody:
            "Far from the horizon, gravity behaves mainly like any object with the same mass at that distance.",
          socraticQ:
            "Does a black hole pull harder than a star of the same mass at the same distance?",
          socraticA:
            "Not in any dramatic way. Outside, gravity depends mainly on mass and distance; the key differences show up very close in."
        }
      },
      {
        id: "bh_04_not_vacuum_cleaner_orbits_possible",
        meaning:
          "Black holes don’t automatically ‘suck’ everything in; stable orbits can exist if angular momentum is sufficient.",
        render: {
          skimmer:
            "A black hole isn’t a vacuum cleaner: objects can orbit if they have enough angular momentum.",
          stepper:
            "Check the trajectory: capture happens when paths cross the horizon—otherwise orbits can persist.",
          deep:
            "Black holes do not automatically swallow nearby objects. Matter and stars can orbit if their trajectories avoid the horizon. Capture typically requires a trajectory that crosses the horizon, often after losing energy or angular momentum via interactions, friction, or radiation.",
          visualTitle: "Not automatic capture",
          visualBody:
            "Orbits exist. Capture happens when trajectories intersect the horizon (often after angular-momentum loss).",
          socraticQ:
            "Why doesn’t a nearby black hole inevitably swallow everything around it?",
          socraticA:
            "Because objects can orbit. Capture requires a trajectory that crosses the horizon, often after losing angular momentum."
        }
      },
      {
        id: "bh_05_same_mass_sun_swap_orbit",
        meaning:
          "Replacing the Sun with a same-mass black hole would leave Earth’s orbit largely similar (ignoring formation effects and loss of sunlight).",
        render: {
          skimmer:
            "If the Sun were replaced by a same-mass black hole, Earth’s orbit would be nearly unchanged (gravity-wise).",
          stepper:
            "Use the same-mass thought experiment: at the same distance, gravity is similar—so the orbit doesn’t suddenly collapse.",
          deep:
            "At Earth’s distance, the gravitational field depends mainly on enclosed mass. If the Sun were replaced by a black hole of the same mass, Earth’s orbit would remain broadly similar in gravitational terms. The real catastrophe would be the loss of sunlight and the implausible formation process, not ‘extra sucking’.",
          visualTitle: "Same mass → similar orbit",
          visualBody:
            "At the same distance, gravity is similar. The big change would be losing sunlight—not an instant orbital plunge.",
          socraticQ:
            "Would Earth fall in if the Sun became a same-mass black hole overnight?",
          socraticA:
            "Not due to gravity at the same distance—Earth’s orbit would be similar. The disaster is loss of sunlight and formation chaos."
        }
      },
      {
        id: "bh_06_light_from_accretion",
        meaning:
          "Black holes themselves don’t shine classically; observed light typically comes from accreting matter heating up before crossing the horizon.",
        render: {
          skimmer:
            "Black holes don’t emit light classically; the glow comes from hot accreting matter nearby.",
          stepper:
            "Ask ‘what’s glowing?’: it’s usually the infalling gas converting gravitational energy into heat and radiation.",
          deep:
            "In classical general relativity, black holes emit no light of their own. The bright emission we associate with them is typically from accretion: gas and dust heat up as gravitational energy is converted into thermal energy and radiation before crossing the horizon.",
          visualTitle: "Accretion is the lamp",
          visualBody:
            "The bright stuff is usually hot infalling matter radiating before it crosses the horizon.",
          socraticQ:
            "If a black hole is ‘black’, where does the bright emission come from?",
          socraticA:
            "From accreting material: gas heats up and radiates strongly before crossing the horizon."
        }
      },
      {
        id: "bh_07_how_we_detect",
        meaning:
          "We infer black holes indirectly via orbits/dynamics, accretion signatures, and gravitational waves from mergers.",
        render: {
          skimmer:
            "We detect black holes indirectly: orbits/dynamics, accretion emission, and gravitational waves.",
          stepper:
            "List observables: measure motions (mass), measure radiation from accretion, measure spacetime ripples from mergers.",
          deep:
            "Black holes are inferred through their effects: the dynamics of nearby stars or gas (mass inference), electromagnetic signatures from accretion (spectra and variability), and gravitational waves from mergers (constraints on mass and spin).",
          visualTitle: "Indirect evidence",
          visualBody:
            "Orbits tell mass; accretion tells environment; gravitational waves reveal mergers and compact-object properties.",
          socraticQ:
            "What are the main ways we infer a black hole exists?",
          socraticA:
            "Through effects: dynamics/orbits, accretion emission signatures, and gravitational waves from mergers."
        }
      },
      {
        id: "bh_08_spin_matters",
        meaning:
          "Spin changes spacetime geometry (Kerr black holes), affecting stable orbits and accretion efficiency; it can relate to jet behavior.",
        render: {
          skimmer:
            "Spin matters: rotation changes spacetime geometry and affects orbits and accretion behavior.",
          stepper:
            "Add rotation as a parameter: spin shifts where stable orbits exist and how efficiently accretion can radiate.",
          deep:
            "Rotation (spin) changes the spacetime geometry around a black hole (Kerr geometry). Spin affects where stable orbits are possible, how close matter can orbit before plunging, and the efficiency with which accretion can convert gravitational energy into radiation; it is also implicated in jet phenomenology in many systems.",
          visualTitle: "Spin reshapes the rules",
          visualBody:
            "Rotation alters spacetime, shifting stable orbits and affecting accretion efficiency (and often jet behavior).",
          socraticQ:
            "Why do astronomers care about black hole spin?",
          socraticA:
            "Spin changes spacetime structure, affecting stable orbits and accretion efficiency; it’s also linked to jet behavior in many systems."
        }
      },
      {
        id: "bh_09_singularity_model_limit",
        meaning:
          "The ‘singularity’ is best treated as a sign classical GR breaks down; quantum gravity likely matters in that regime.",
        render: {
          skimmer:
            "The ‘singularity’ signals model limits: classical GR likely breaks down; quantum gravity may be needed.",
          stepper:
            "Treat singularities as warning lights: when curvature diverges, the model is being pushed beyond its domain.",
          deep:
            "In classical general relativity, continued collapse leads to a singularity (divergent curvature). Many physicists interpret this as an indication that classical GR is incomplete in that regime and that quantum-gravity effects should modify the description at extreme scales.",
          visualTitle: "Singularity = warning label",
          visualBody:
            "Divergent curvature usually means the theory is being pushed beyond its valid regime; new physics likely enters.",
          socraticQ:
            "Is the singularity a literal ‘point object’ we should picture?",
          socraticA:
            "Better to treat it as a sign classical GR breaks down there; a more complete theory (likely involving quantum gravity) is expected."
        }
      }
    ]
  },

  entropy: {
    id: "entropy",
    title: "What is entropy (without equations)?",
    subtitle:
      "A concept that ties observable states to the number of microscopic possibilities—and explains why ‘mixing’ is overwhelmingly likely.",
    summary:
      "Entropy tracks how many microstates correspond to a macrostate. Systems drift toward macrostates with vastly more compatible microstates, making entropy increase overwhelmingly likely for isolated macroscopic systems.",
    facts: [
      {
        id: "en_01_macro_micro",
        meaning:
          "Macrostates are coarse observable descriptions; microstates are detailed configurations compatible with them.",
        render: {
          skimmer:
            "Macrostate = what you measure; microstate = the detailed hidden configuration consistent with it.",
          stepper:
            "Define levels: macro is the coarse description; micro is the specific underlying arrangement that produces it.",
          deep:
            "A macrostate is a coarse description you can observe or measure (like temperature and pressure). A microstate is a specific detailed configuration of the system’s constituents that is consistent with that macrostate.",
          visualTitle: "Two levels of description",
          visualBody:
            "Macro: observable summary. Micro: detailed configuration consistent with that summary.",
          socraticQ:
            "What’s the difference between a macrostate and a microstate?",
          socraticA:
            "A macrostate is the coarse, observable description; a microstate is a specific detailed configuration that produces it."
        }
      },
      {
        id: "en_02_entropy_multiplicity",
        meaning:
          "Higher entropy corresponds to a macrostate compatible with more microstates (greater multiplicity).",
        render: {
          skimmer:
            "Higher entropy means more microstates can produce the same observed macrostate.",
          stepper:
            "Connect entropy to counting: more compatible microstates → higher entropy.",
          deep:
            "Entropy is tied to multiplicity: how many microstates correspond to the same macrostate. A macrostate that can be realized in many microscopic ways is higher-entropy than one that requires very special microscopic arrangements.",
          visualTitle: "Entropy = multiplicity",
          visualBody:
            "More microscopic possibilities consistent with the same observable situation → higher entropy.",
          socraticQ:
            "What does ‘higher entropy’ mean in microstate terms?",
          socraticA:
            "It means the observed macrostate can be realized by more microstates (greater multiplicity)."
        }
      },
      {
        id: "en_03_second_law_statistical",
        meaning:
          "For isolated macroscopic systems, entropy tends to increase; this is a statistical statement, not a logical impossibility of decrease.",
        render: {
          skimmer:
            "In isolated macroscopic systems, entropy tends to increase—overwhelmingly likely, not logically absolute.",
          stepper:
            "State the law carefully: for isolated systems, entropy increases with near-certainty at large scales (statistical, not magical).",
          deep:
            "The second law says that for isolated macroscopic systems, entropy tends to increase. Crucially, this is statistical: decreases are not logically forbidden, but become extraordinarily unlikely as the number of particles grows.",
          visualTitle: "Second law (statistical)",
          visualBody:
            "Entropy increase is overwhelmingly likely for isolated macroscopic systems; strict decreases are possible in principle but extremely improbable.",
          socraticQ:
            "Is entropy increase an absolute rule or a statistical one?",
          socraticA:
            "Statistical. Large decreases in isolated macroscopic systems are possible in principle but fantastically unlikely."
        }
      },
      {
        id: "en_04_typicality_drift",
        meaning:
          "Systems drift toward macrostates with vastly more microstates because those states are overwhelmingly more probable (typicality).",
        render: {
          skimmer:
            "Systems drift toward ‘typical’ macrostates with far more microstates because they’re overwhelmingly more probable.",
          stepper:
            "Explain why: most microstates correspond to typical high-entropy macrostates, so evolution lands there almost always.",
          deep:
            "The intuitive reason entropy increases is typicality: there are vastly more microstates corresponding to high-entropy macrostates than to special low-entropy ones. Under generic evolution, the system almost always moves into those overwhelmingly larger regions of state space.",
          visualTitle: "Why increase happens",
          visualBody:
            "High-entropy macrostates occupy far more microstate volume; evolution almost always ends up there.",
          socraticQ:
            "Why does a system ‘prefer’ higher entropy without any intention?",
          socraticA:
            "Because there are vastly more microstates corresponding to high-entropy macrostates, making them overwhelmingly more likely."
        }
      },
      {
        id: "en_05_disorder_metaphor_limit",
        meaning:
          "‘Disorder’ is an imperfect metaphor; a better intuition is counting compatible microstates.",
        render: {
          skimmer:
            "‘Disorder’ is a shaky metaphor; better: entropy tracks how many microstates fit what you observe.",
          stepper:
            "Replace the metaphor: think ‘counting microstates’, not ‘messiness’.",
          deep:
            "People often say entropy is ‘disorder’, which can mislead because it smuggles in human judgment. The more reliable intuition is counting: how many microscopic arrangements are compatible with the macroscopic state you describe.",
          visualTitle: "Don’t trust ‘disorder’",
          visualBody:
            "Better intuition: entropy tracks the number of microstates compatible with a macrostate.",
          socraticQ:
            "Why can ‘entropy = disorder’ be misleading?",
          socraticA:
            "Because ‘disorder’ is subjective; the cleaner concept is the number of microstates compatible with the macrostate."
        }
      },
      {
        id: "en_06_local_decrease_export",
        meaning:
          "Local entropy can decrease if entropy is exported (e.g., with energy input); total entropy of the combined system still tends to increase.",
        render: {
          skimmer:
            "Local entropy can decrease if you export entropy elsewhere (often with energy input).",
          stepper:
            "Check the bookkeeping: you can lower entropy here by raising it more somewhere else.",
          deep:
            "Entropy can decrease locally when a process exports entropy to the surroundings (often via heat) and is driven by energy input. The second law applies to the combined isolated system: total entropy tends to increase.",
          visualTitle: "Local vs total",
          visualBody:
            "You can reduce entropy locally by exporting it; total entropy for the combined system still tends to increase.",
          socraticQ:
            "Can entropy ever go down?",
          socraticA:
            "Locally, yes—if the process exports entropy to the environment (often powered by external energy). Total entropy still tends to increase for the combined system."
        }
      },
      {
        id: "en_07_fluctuations_small",
        meaning:
          "Fluctuations exist; small entropy decreases can happen, but large macroscopic decreases are extraordinarily unlikely.",
        render: {
          skimmer:
            "Fluctuations happen: tiny decreases are possible, but large macroscopic decreases are extraordinarily unlikely.",
          stepper:
            "Scale matters: microscopic randomness allows fluctuations, but macroscopic reversals are essentially never seen.",
          deep:
            "Because the second law is statistical, fluctuations can produce small temporary decreases in entropy. However, for macroscopic systems with enormous numbers of particles, large-scale decreases are so unlikely that they are effectively never observed.",
          visualTitle: "Fluctuations exist",
          visualBody:
            "Small deviations can occur, but large macroscopic entropy decreases are astronomically improbable.",
          socraticQ:
            "If it’s statistical, why don’t we see big entropy decreases all the time?",
          socraticA:
            "Because for macroscopic systems, large decreases are astronomically unlikely even if not logically impossible."
        }
      },
      {
        id: "en_08_arrow_of_time_initial_condition",
        meaning:
          "The arrow of time is linked to low-entropy initial conditions plus statistical drift toward typical (higher entropy) states.",
        render: {
          skimmer:
            "Time’s arrow links to starting in a low-entropy state, then drifting toward typical higher-entropy states.",
          stepper:
            "To get direction, you need asymmetry: start special (low entropy), then typical evolution pushes toward higher entropy.",
          deep:
            "Entropy connects to the arrow of time because direction arises when you start from a special low-entropy condition. From there, generic evolution overwhelmingly moves toward more typical higher-entropy macrostates, creating an apparent temporal direction.",
          visualTitle: "Why time feels one-way",
          visualBody:
            "A low-entropy start plus statistical drift toward typical states yields a macroscopic arrow of time.",
          socraticQ:
            "Why does entropy have anything to do with the direction of time?",
          socraticA:
            "Because if you start in a special low-entropy state, evolution overwhelmingly drifts toward more typical higher-entropy states, giving a macroscopic direction."
        }
      },
      {
        id: "en_09_quantitative_concept",
        meaning:
          "Entropy is a quantitative concept used in thermodynamics/stat mech; the non-equation story is the same concept.",
        render: {
          skimmer:
            "Entropy is quantitative; we’re avoiding equations, but the concept is the same one used in physics.",
          stepper:
            "Keep it grounded: this intuition maps onto the formal quantity used in thermodynamics and statistical mechanics.",
          deep:
            "Entropy is a quantitative concept in thermodynamics and statistical mechanics. Even without equations, the story is the same: entropy formalizes the relationship between macrostates and how many microstates realize them.",
          visualTitle: "Not just a metaphor",
          visualBody:
            "This idea maps onto a formal quantity in thermodynamics/stat mech; we’re just explaining it without equations.",
          socraticQ:
            "Are we losing the real meaning by avoiding equations?",
          socraticA:
            "No—the equations formalize the same concept: a quantitative link between macrostates and the multiplicity of microstates."
        }
      }
    ]
  },

  cheeseboard: {
    id: "cheeseboard",
    title: "How to design a great cheese board",
    subtitle:
      "A low-stakes systems problem: balance, contrast, sequencing, and a few reliable constraints that make it work.",
    summary:
      "A good cheese board is structured: contrast in texture and intensity, palate resets (acid), a little sweetness, and correct serving temperature. The ‘design’ is sequencing and balance, not random cheese on wood.",
    facts: [
      {
        id: "cb_01_not_random",
        meaning:
          "A cheese board is a small design problem (balance/contrast/sequence), not random selection.",
        render: {
          skimmer:
            "A good cheese board is designed: balance, contrast, and sequence—not random cheeses on wood.",
          stepper:
            "Start with intent: treat it as a composition problem (balance/contrast/sequence), not a pile of ingredients.",
          deep:
            "A cheese board works best when treated as a small design problem: you’re balancing textures and intensities and creating a sequence that keeps flavors distinct. Random selection often produces a flat, repetitive experience.",
          visualTitle: "It’s a composition",
          visualBody:
            "Balance + contrast + sequence. Random boards often feel repetitive.",
          socraticQ:
            "What’s the biggest conceptual mistake people make with cheese boards?",
          socraticA:
            "Treating them as random assortments instead of designed compositions with balance, contrast, and sequencing."
        }
      },
      {
        id: "cb_02_three_cheese_template",
        meaning:
          "A simple robust template is 3 cheeses: one soft, one hard/aged, one blue or funky (optional).",
        render: {
          skimmer:
            "Reliable template: 3 cheeses—one soft, one hard/aged, one blue/funky (optional).",
          stepper:
            "Pick a stable base: choose soft + hard/aged + (optional) blue/funky for contrast.",
          deep:
            "If you want a board that rarely fails, use a simple template: one soft cheese, one hard or aged cheese, and optionally one blue or funky cheese. This creates contrast without demanding expertise.",
          visualTitle: "3-cheese backbone",
          visualBody:
            "Soft + hard/aged + (optional) blue/funky gives reliable contrast with minimal complexity.",
          socraticQ:
            "What’s a minimal cheese set that still feels varied?",
          socraticA:
            "Soft + hard/aged + optionally blue/funky. It reliably produces contrast."
        }
      },
      {
        id: "cb_03_contrast_dimensions",
        meaning:
          "Contrast should be intentional: texture (soft/hard), intensity (mild/strong), milk type or style if desired.",
        render: {
          skimmer:
            "Design for contrast: texture (soft/hard) and intensity (mild/strong) are the main levers.",
          stepper:
            "Create contrast on purpose: vary texture and intensity so bites don’t blur together.",
          deep:
            "Contrast is the main lever: mix textures (soft vs hard) and intensities (mild vs strong). Without contrast, bites collapse into the same flavor experience, and the board feels flat.",
          visualTitle: "Contrast is the engine",
          visualBody:
            "Vary texture and intensity so each bite feels distinct.",
          socraticQ:
            "Why do some boards taste ‘flat’ even with expensive cheese?",
          socraticA:
            "Because there isn’t enough contrast—textures and intensities are too similar, so bites blur together."
        }
      },
      {
        id: "cb_04_temperature_matters",
        meaning:
          "Serving temperature changes flavor perception: cold cheese is muted; letting it warm reveals aroma and texture.",
        render: {
          skimmer:
            "Temperature matters: cold cheese is muted; room-temp cheese shows more aroma and flavor.",
          stepper:
            "Fix the baseline: let cheese warm up so aroma and texture are available to the palate.",
          deep:
            "Cold suppresses aroma and softens perception of flavor. Letting cheese warm closer to room temperature makes aromatic compounds more apparent and improves texture, so the same cheese tastes more ‘alive’.",
          visualTitle: "Warm it up",
          visualBody:
            "Cold mutes flavor. Slight warming reveals aroma and improves texture.",
          socraticQ:
            "What’s a simple mistake that makes good cheese taste boring?",
          socraticA:
            "Serving it too cold—cold mutes aroma and flavor; warming it slightly improves both."
        }
      },
      {
        id: "cb_05_crunch",
        meaning:
          "Crunch is a structural element: crackers/nuts/crisp fruit add texture contrast and pacing.",
        render: {
          skimmer:
            "Add crunch (crackers, nuts, crisp fruit): texture contrast is half the experience.",
          stepper:
            "Insert crunch deliberately: it creates texture contrast and stops everything feeling creamy and slow.",
          deep:
            "Crunch creates structure: crackers, toasted nuts, and crisp fruit add contrast and pacing. Without crunch, boards can feel uniformly soft and become monotonous even if flavors vary.",
          visualTitle: "Crunch creates pacing",
          visualBody:
            "Crackers/nuts/crisp fruit add texture contrast and keep bites from blending into one creamy note.",
          socraticQ:
            "Why does adding a crunchy element upgrade a board so much?",
          socraticA:
            "Because it adds texture contrast and pacing; it prevents everything feeling uniformly soft and monotonous."
        }
      },
      {
        id: "cb_06_acid_reset",
        meaning:
          "Acidic elements reset the palate (pickles, grapes, berries) and keep strong cheeses from dominating.",
        render: {
          skimmer:
            "Include an acid ‘reset’ (pickles, grapes, berries): it refreshes the palate between bites.",
          stepper:
            "Plan palate resets: add acidic items that cut richness and restore contrast between cheeses.",
          deep:
            "Acid functions as a palate reset: pickles, grapes, and berries cut through fat and richness, helping each cheese taste like itself rather than blending into a single heavy flavor profile.",
          visualTitle: "Acid resets the palate",
          visualBody:
            "Pickles/fruit cut richness so strong flavors don’t flatten everything.",
          socraticQ:
            "What keeps a board from becoming ‘heavy’ after a few bites?",
          socraticA:
            "Acidic resets (pickles/fruit) cut richness and refresh the palate so contrast stays intact."
        }
      },
      {
        id: "cb_07_sweet_amplifies",
        meaning:
          "A controlled sweet element (jam/honey) can amplify aromatics and balance salty/funky notes.",
        render: {
          skimmer:
            "A little sweetness (jam/honey) amplifies aromatics and balances salty/funky notes.",
          stepper:
            "Add sweet intentionally: it’s not dessert—it’s a contrast tool that can lift aroma and balance intensity.",
          deep:
            "A small sweet element like jam or honey can lift aromatics and balance salty or funky notes. The point isn’t to make the board sugary, but to create contrast that makes certain cheeses pop.",
          visualTitle: "Sweet as contrast",
          visualBody:
            "Jam/honey can lift aromatics and balance intensity when used sparingly.",
          socraticQ:
            "Why do jam or honey pair so well with some cheeses?",
          socraticA:
            "They add contrast that can lift aromatics and balance salty/funky notes—when used sparingly."
        }
      },
      {
        id: "cb_08_sequence_mild_to_strong",
        meaning:
          "Sequence matters: moving mild→strong preserves distinctness; strong cheeses early can dominate perception.",
        render: {
          skimmer:
            "Sequence matters: go mild → strong so intense flavors don’t dominate everything.",
          stepper:
            "Order the experience: serve/taste from mild to intense to preserve distinctness across cheeses.",
          deep:
            "If intense cheeses come first, they can dominate perception and make milder cheeses taste bland by comparison. A mild-to-strong sequence preserves distinctness and reduces palate fatigue.",
          visualTitle: "Order protects contrast",
          visualBody:
            "Taste mild → intense so strong flavors don’t flatten the rest.",
          socraticQ:
            "Why does tasting order change how the board feels?",
          socraticA:
            "Strong flavors early can dominate and make mild cheeses seem bland; mild→strong preserves contrast."
        }
      },
      {
        id: "cb_09_labeling_social_friction",
        meaning:
          "Labeling reduces social friction and cognitive load; it helps people choose confidently and compare.",
        render: {
          skimmer:
            "Labeling helps: it reduces social awkwardness and lets people choose and compare confidently.",
          stepper:
            "Lower the friction: add simple labels so people can navigate without guessing or asking.",
          deep:
            "Labels reduce cognitive and social friction: people don’t need to guess what they’re eating, and they can compare preferences more easily. This increases engagement without changing the food.",
          visualTitle: "Labels reduce friction",
          visualBody:
            "Simple labels lower cognitive/social load and make exploration easier.",
          socraticQ:
            "Why do labels matter if the cheese tastes the same?",
          socraticA:
            "They reduce cognitive and social friction, helping people navigate, choose, and compare more confidently."
        }
      },
      {
        id: "cb_10_less_but_better",
        meaning:
          "Fewer, better-chosen items often beat a crowded board; too many similar items reduce clarity and contrast.",
        render: {
          skimmer:
            "Less can be better: a few well-chosen items with contrast beat a crowded, repetitive board.",
          stepper:
            "Avoid overload: choose fewer items with clear contrast rather than many similar options.",
          deep:
            "Overcrowding often reduces clarity: too many cheeses with similar texture/intensity blur together. A smaller set with intentional contrast typically produces a stronger experience and clearer comparisons.",
          visualTitle: "Avoid crowded sameness",
          visualBody:
            "Fewer items with clearer contrast usually outperform many similar options.",
          socraticQ:
            "Why can a bigger board feel less satisfying?",
          socraticA:
            "Because overload and similarity blur contrast; fewer items chosen for clear differences often feel richer and clearer."
        }
      }
    ]
  }
};