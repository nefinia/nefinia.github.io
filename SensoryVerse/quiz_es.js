const questions = [
"1. Cuando empiezas algo nuevo, ¿tú…? A) Exploras múltiples ideas y posibilidades a la vez, B) Te centras en una dirección clara y la sigues hasta el final?",
"2. Al aprender o resolver un problema, ¿tú…? A) Piensas en analogías, imágenes o saltos intuitivos, B) Prefieres el análisis lógico paso a paso?",
"3. En entornos estimulantes, ¿tú…? A) Te sientes con energía y buscas más información, B) Te sientes sobreestimulado y prefieres espacios tranquilos?",
"4. Retienes la información con mayor facilidad cuando… A) Te mueves, haces, actúas o interactúas físicamente con ella, B) La reflexionas, imaginas o conceptualizas mentalmente.",
"5. Cuando algo te emociona o te conmueve, ¿tú…? A) Lo expresas libre y visiblemente, B) Lo guardas principalmente para ti y lo procesas con calma?",
"6. En una nueva situación social, ¿tú…? A) Te abres rápidamente e interactúas fácilmente con los demás, B) Te tomas tu tiempo, observando antes de participar?", 
"7. Tu atención tiende a ser…\nA) Rápida, espontánea, a veces dispersa pero intensa\nB) Rítmica, constante y estructurada a lo largo del tiempo.",
"8. Al finalizar un proyecto, ¿prefieres…\nA) Ser flexible y evolucionar sobre la marcha\nB) Ceñirte a un plan claro y un resultado definido?"
];

const examples = [
"A)\n- Esbozas muchas ideas antes de elegir una.\n- Te unes a varios clubes al empezar la escuela.\n- Haces una lluvia de ideas antes de delinear.\nB)\n- Te comprometes con una actividad y profundizas.\n- Investigas antes de actuar.\n- Sigues una lista de tareas cuidadosamente.",
"A)\n- Relacionas la ciencia con mitos o metáforas.\n- Conectas las ideas visualmente.\n- Usas atajos mentales o símbolos.\nB)\n- Prefieres las viñetas y la estructura.\n- Sigues un tutorial linealmente.\n- Te gusta resolver problemas paso a paso.",
"A)\n- Te gusta la música mientras estudias.\n- Exploras lugares concurridos en busca de inspiración.\n- Tocas materiales para aprenderlos.\nB)\n- Buscas habitaciones tranquilas.\n- No te gustan las luces brillantes ni el ruido.\n- Usas herramientas mínimas al aprender.",
"A)\n- Aprendes haciendo, no leyendo.\n- Retienes mejor a través del movimiento.\n- Gesticulas. mientras explicas.\nB)\n- Imaginas diagramas en tu cabeza.\n- Prefieres instrucciones escritas.\n- Te concentras mejor cuando estás quieto.",
"A)\n- Hablas de tu entusiasmo.\n- Sonríes o te expresas abiertamente.\n- Muestras tu frustración.\nB)\n- Registras tus emociones.\n- Reflexionas en silencio.\n- Mantienes una expresión neutral.",
"A)\n- Haces amigos rápidamente.\n- Disfrutas de las actividades en grupo.\n- Hablas con desconocidos con facilidad.\nB)\n- Observas antes de hablar.\n- Tardas más en compartir ideas.\n- Prefieres los entornos individuales.",
"A)\n- Haces todo a la vez.\n- Trabajas en oleadas creativas.\n- Cambias de tareas con frecuencia.\nB)\n- Te apegas a las rutinas.\n- Sigues un horario fijo.\n- Terminas antes de empezar de nuevo.",
"A)\n- Cambias de planes a mitad de camino.\n- Permites Flexibilidad en los objetivos.\n- Te adaptas a nuevos intereses.\nB)\n- Sigues tu esquema inicial.\n- Cumples los plazos.\n- Te gusta el cierre claro."
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