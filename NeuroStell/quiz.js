const questions = [
  "1. When you begin something new, do you…\nA) Explore multiple ideas and possibilities at once\nB) Lock in on one clear direction and follow it through",
  "2. When learning or solving a problem, do you…\nA) Think in analogies, images, or intuitive leaps\nB) Prefer logical, step-by-step analysis",
  "3. In stimulating environments, do you…\nA) Feel energized and seek more input\nB) Feel overstimulated and prefer calm spaces",
  "4. You retain information more easily when…\nA) You move, do, act, or physically engage with it\nB) You reflect, imagine, or conceptualize it in your mind",
  "5. When something excites or moves you, do you…\nA) Express it freely and visibly\nB) Keep it mostly inside and process it quietly",
  "6. In a new social situation, do you…\nA) Open up quickly and engage with others easily\nB) Take your time, observing before joining in",
  "7. Your attention tends to be…\nA) Bursty, spontaneous, sometimes scattered but intense\nB) Rhythmic, steady, and structured over time",
  "8. When finishing a project, do you prefer to…\nA) Stay flexible and evolve as you go\nB) Stick to a clear plan and defined outcome"
];

const examples = [
  "A)\n- You sketch out many ideas before choosing one.\n- You join multiple clubs when starting school.\n- You brainstorm before outlining.\nB)\n- You commit to one activity and go deep.\n- You research before taking action.\n- You follow a task list carefully.",
  "A)\n- You relate science to myths or metaphors.\n- You connect ideas visually.\n- You use mental shortcuts or symbols.\nB)\n- You prefer bullet points and structure.\n- You follow a tutorial linearly.\n- You like solving problems step by step.",
  "A)\n- You like music while studying.\n- You explore busy places for inspiration.\n- You touch materials to learn them.\nB)\n- You seek quiet rooms.\n- You dislike bright lights or noise.\n- You use minimal tools when learning.",
  "A)\n- You learn by doing, not reading.\n- You retain better through movement.\n- You gesture while explaining.\nB)\n- You imagine diagrams in your head.\n- You prefer written instructions.\n- You focus best when still.",
  "A)\n- You talk about your excitement.\n- You smile or emote openly.\n- You show your frustration.\nB)\n- You journal your emotions.\n- You reflect silently.\n- You keep a neutral expression.",
  "A)\n- You make friends quickly.\n- You enjoy group activities.\n- You talk to strangers easily.\nB)\n- You observe before speaking.\n- You take longer to share ideas.\n- You prefer one-on-one settings.",
  "A)\n- You do everything at once.\n- You work in creative waves.\n- You shift tasks frequently.\nB)\n- You stick to routines.\n- You follow a fixed schedule.\n- You finish before starting new.",
  "A)\n- You change plans mid-way.\n- You allow flexibility in goals.\n- You adapt to new interests.\nB)\n- You follow your initial outline.\n- You stick to deadlines.\n- You like clear closure."
];

const codeMap = [
  {"A": "Z", "B": "M"},
  {"A": "A", "B": "O"},
  {"A": "T", "B": "L"},
  {"A": "E", "B": "I"},
  {"A": "F", "B": "S"},
  {"A": "U", "B": "A"},
  {"A": "K", "B": "R"},
  {"A": "E", "B": "O"}
];

let current = 0;
let answers = [];
let ambiguous = [];

function startQuiz() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  showQuestion();
}

function showQuestion() {
  document.getElementById("question").innerText = questions[current];
  document.getElementById("exampleText").innerHTML = examples[current].replace(/\n/g, "<br>");
  document.getElementById("slider").value = 50;
  document.getElementById("progressBar").style.width = `${(current / questions.length) * 100}%`;
}

function answer() {
  const sliderValue = parseInt(document.getElementById("slider").value);
  const choice = sliderValue < 50 ? 'A' : 'B';

  if (codeMap[current] && codeMap[current][choice]) {
    answers[current] = codeMap[current][choice];
    ambiguous[current] = (sliderValue >= 40 && sliderValue <= 60)
      ? codeMap[current][choice === 'A' ? 'B' : 'A']
      : null;
  }

  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function goBack() {
  if (current > 0) {
    current--;
    answers.pop();
    ambiguous.pop();
    showQuestion();
    document.getElementById("progressBar").style.width = `${(current / questions.length) * 100}%`;
  } else {
    document.getElementById("quiz").style.display = "none";
    document.getElementById("intro").style.display = "block";
    document.getElementById("progressBar").style.width = "0%";
  }
}