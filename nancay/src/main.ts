import "./style.css";

import decametricArrayUrl from "../nancay_doc_assets/decametric_array.jpg";
import interferometryDiagramUrl from "../nancay_doc_assets/custom_interferometry_delay_diagram.png";
import lofarUrl from "../nancay_doc_assets/lofar.jpg";
import nenufarUrl from "../nancay_doc_assets/nenufar.jpg";
import nrtUrl from "../nancay_doc_assets/nrt.jpg";
import radioheliographUrl from "../nancay_doc_assets/radioheliograph.jpg";

type Language = "en" | "fr";

type Localized = Record<Language, string>;

type Instrument = {
  id: string;
  name: string;
  rangeMHz: [number, number];
  wavelengths: string;
  facts: Localized[];
  image: string;
  alt: string;
  tagline: Localized;
  works: Localized;
  finds: Localized[];
  physics: string[];
  link: string;
};

type Mechanism = {
  id: string;
  name: Localized;
  icon: string;
  summary: Localized;
  science: Localized;
  where: Localized;
  visual: {
    src: string;
    source: string;
    label: string;
    license: string;
  };
};

type MediaVisual = {
  src: string;
  source: string;
  label: string;
  license: string;
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

const copy = {
  eyebrow: {
    en: "Nançay Radio Observatory",
    fr: "Observatoire radioastronomique de Nançay",
  },
  title: {
    en: "The Universe is not only seen. It is timed, filtered, and listened to.",
    fr: "L’Univers ne se regarde pas seulement. Il se chronomètre, se filtre et s’écoute.",
  },
  intro: {
    en: "Radio astronomy at Nançay connects long-wavelength light to gas, magnetic fields, plasma, pulsars, planetary magnetospheres, and the early Universe.",
    fr: "À Nançay, la radioastronomie relie la lumière de grande longueur d’onde au gaz, aux champs magnétiques, aux plasmas, aux pulsars, aux magnétosphères planétaires et à l’Univers jeune.",
  },
  coreLine: {
    en: "If optical astronomy shows what the Universe looks like, radio astronomy often reveals how it works.",
    fr: "Si l’astronomie optique montre à quoi ressemble l’Univers, la radioastronomie révèle souvent comment il fonctionne.",
  },
};

const instruments: Instrument[] = [
  {
    id: "nrt",
    name: "Radiotélescope décimétrique",
    rangeMHz: [1060, 3500],
    wavelengths: "8.6-28 cm",
    facts: [
      { en: "Large single-dish radio telescope with a fixed spherical mirror and moving flat reflector.", fr: "Grand radiotélescope avec miroir sphérique fixe et miroir plan mobile." },
      { en: "Key band: 1.06-3.5 GHz, including H I at 1420 MHz.", fr: "Bande clé : 1,06-3,5 GHz, incluant H I à 1420 MHz." },
      { en: "Strength: deep spectra and precise timing rather than panoramic imaging.", fr: "Force : spectres profonds et chronométrage précis plutôt qu’imagerie panoramique." },
    ],
    image: nrtUrl,
    alt: "Large fixed spherical reflector of the Nançay decimetric radio telescope",
    tagline: {
      en: "The galaxy gas and pulsar timing instrument.",
      fr: "L’instrument du gaz galactique et du chronométrage des pulsars.",
    },
    works: {
      en: "The NRT is not a steerable dish in the usual sense. A movable flat reflector redirects radiation from the sky onto a large fixed spherical mirror; the focused signal reaches a receiver carriage. Cooled receivers and spectrometers then separate the signal by frequency, while pulsar backends record precise arrival times. Its decimetric band includes the 21 cm hyperfine line of neutral hydrogen, where Doppler shifts directly encode gas velocity.",
      fr: "Le NRT n’est pas une parabole orientable classique. Un miroir plan mobile redirige le rayonnement du ciel vers un grand miroir sphérique fixe ; le signal focalisé arrive sur un chariot de réception. Des récepteurs refroidis et des spectromètres séparent ensuite le signal par fréquence, tandis que les chaînes pulsars enregistrent des temps d’arrivée très précis. Sa bande décimétrique inclut la raie hyperfine à 21 cm de l’hydrogène neutre, dont le décalage Doppler code directement la vitesse du gaz.",
    },
    finds: [
      {
        en: "Neutral hydrogen in galaxies: spectra measure gas mass, rotation, turbulence, and large-scale dynamics.",
        fr: "Hydrogène neutre des galaxies : les spectres mesurent la masse de gaz, la rotation, la turbulence et la dynamique globale.",
      },
      {
        en: "Pulsar timing: pulse arrival times test neutron-star physics, binary dynamics, relativity, and nanohertz gravitational-wave backgrounds.",
        fr: "Chronométrage des pulsars : les temps d’arrivée testent la physique des étoiles à neutrons, la dynamique binaire, la relativité et les fonds d’ondes gravitationnelles nanohertz.",
      },
      {
        en: "Narrow spectral lines: cometary OH traces water production; OH masers around evolved stars trace mass loss and circumstellar chemistry.",
        fr: "Raies spectrales étroites : l’OH cométaire trace la production d’eau ; les masers OH autour des étoiles évoluées tracent la perte de masse et la chimie circumstellaire.",
      },
    ],
    physics: ["21 cm hydrogen", "pulsars", "molecular radio lines"],
    link: "https://www.obs-nancay.fr/radiotelescope-decimetrique/",
  },
  {
    id: "lofar",
    name: "LOFAR FR606",
    rangeMHz: [10, 240],
    wavelengths: "1.25-30 m",
    facts: [
      { en: "French station in a European low-frequency interferometer.", fr: "Station française d’un interféromètre européen basse fréquence." },
      { en: "Low-band and high-band antenna fields; pointing is digital.", fr: "Champs d’antennes basse et haute bande ; pointage numérique." },
      { en: "Long baselines give angular resolution; many antennas give sensitivity.", fr: "Les longues lignes de base donnent la résolution ; les nombreuses antennes donnent la sensibilité." },
    ],
    image: lofarUrl,
    alt: "LOFAR antenna field at Nançay",
    tagline: {
      en: "A French station in a European software telescope.",
      fr: "Une station française dans un télescope logiciel européen.",
    },
    works: {
      en: "LOFAR is a distributed telescope. Each station records low-frequency electric fields with many simple antennas. Digital delays form station beams, and correlations between station pairs measure phase and amplitude on many baselines. Those baselines sample spatial frequencies of the sky; Earth rotation improves the coverage. Nançay’s FR606 station adds collecting area and international baselines to the European network.",
      fr: "LOFAR est un télescope distribué. Chaque station enregistre les champs électriques basse fréquence avec de nombreuses antennes simples. Des retards numériques forment les faisceaux de station, puis les corrélations entre paires de stations mesurent la phase et l’amplitude sur de nombreuses lignes de base. Ces lignes de base échantillonnent les fréquences spatiales du ciel ; la rotation terrestre améliore la couverture. La station FR606 de Nançay ajoute de la surface collectrice et des lignes de base internationales au réseau européen.",
    },
    finds: [
      {
        en: "Diffuse synchrotron emission from relativistic electrons and magnetic fields in galaxies, jets, clusters, and supernova remnants.",
        fr: "Émission synchrotron diffuse d’électrons relativistes et de champs magnétiques dans les galaxies, les jets, les amas et les restes de supernovae.",
      },
      {
        en: "Low-frequency time-domain science: pulsars, solar bursts, cosmic-ray air showers, radio transients, and propagation through ionized plasma.",
        fr: "Science temporelle basse fréquence : pulsars, sursauts solaires, gerbes de rayons cosmiques, transitoires radio et propagation dans les plasmas ionisés.",
      },
      {
        en: "Cosmology targets: redshifted hydrogen from the Epoch of Reionization and large-scale cosmic magnetism.",
        fr: "Cibles cosmologiques : hydrogène décalé vers le rouge de l’époque de réionisation et magnétisme cosmique à grande échelle.",
      },
    ],
    physics: ["synchrotron", "interferometry", "pulsars", "early 21 cm"],
    link: "https://www.obs-nancay.fr/lofar/",
  },
  {
    id: "nenufar",
    name: "NenuFAR",
    rangeMHz: [10, 90],
    wavelengths: "3.3-30 m",
    facts: [
      { en: "New Extension in Nançay Upgrading LOFAR.", fr: "New Extension in Nançay Upgrading LOFAR." },
      { en: "Dense low-frequency phased array; autonomous telescope and LOFAR super-station.", fr: "Réseau phasé basse fréquence dense ; télescope autonome et super-station LOFAR." },
      { en: "Very long wavelengths: meters to tens of meters.", fr: "Très grandes longueurs d’onde : du mètre à plusieurs dizaines de mètres." },
    ],
    image: nenufarUrl,
    alt: "NenuFAR low-frequency antennas at Nançay",
    tagline: {
      en: "A field of synchronized antennas for the very low-frequency sky.",
      fr: "Un champ d’antennes synchronisées pour le ciel très basse fréquence.",
    },
    works: {
      en: "NenuFAR is built from many low-frequency antennas grouped into mini-arrays. The signal from each antenna is delayed and summed so one direction of the sky adds coherently; several digital beams can be formed without moving metal. As a stand-alone telescope, NenuFAR is sensitive to faint, broad low-frequency emission. As a LOFAR super-station, it boosts the French contribution to international imaging and long-baseline measurements.",
      fr: "NenuFAR est construit à partir de nombreuses antennes basse fréquence regroupées en mini-réseaux. Le signal de chaque antenne est retardé puis additionné pour qu’une direction du ciel s’ajoute de manière cohérente ; plusieurs faisceaux numériques peuvent être formés sans déplacer de structure métallique. Comme télescope autonome, NenuFAR est sensible aux émissions basses fréquences faibles et larges. Comme super-station LOFAR, il renforce la contribution française à l’imagerie internationale et aux mesures à longues lignes de base.",
    },
    finds: [
      {
        en: "Cosmic Dawn: redshifted 21 cm hydrogen from the era when the first stars and galaxies changed the thermal and ionization state of the intergalactic medium.",
        fr: "Aube cosmique : hydrogène à 21 cm décalé vers le rouge, provenant de l’époque où les premières étoiles et galaxies ont modifié l’état thermique et ionisé du milieu intergalactique.",
      },
      {
        en: "Planetary magnetism: coherent cyclotron-maser bursts from Jupiter-like planets and possible exoplanet magnetospheres.",
        fr: "Magnétisme planétaire : sursauts cohérents de type maser cyclotron provenant de planètes de type Jupiter et de possibles magnétosphères d’exoplanètes.",
      },
      {
        en: "Low-frequency pulsars and transients, where dispersion and scattering reveal the plasma between the source and Earth.",
        fr: "Pulsars et transitoires basse fréquence, où la dispersion et la diffusion révèlent le plasma entre la source et la Terre.",
      },
    ],
    physics: ["early 21 cm", "cyclotron maser", "plasma emission", "beamforming"],
    link: "https://nenufar.obs-nancay.fr/en/homepage-en/",
  },
  {
    id: "nrh",
    name: "Radiohéliographe",
    rangeMHz: [150, 450],
    wavelengths: "0.67-2 m",
    facts: [
      { en: "Dedicated solar radio interferometer.", fr: "Interféromètre radio solaire dédié." },
      { en: "Images the corona, not the visible solar surface.", fr: "Image la couronne, pas la surface visible du Soleil." },
      { en: "Measures where energetic electrons move during eruptions.", fr: "Mesure où se déplacent les électrons énergétiques pendant les éruptions." },
    ],
    image: radioheliographUrl,
    alt: "Nançay Radioheliograph solar radio array",
    tagline: {
      en: "A radio camera for the solar corona.",
      fr: "Une caméra radio pour la couronne solaire.",
    },
    works: {
      en: "The Radioheliograph is a specialized solar interferometer. Antennas distributed along a large T-shaped array observe the Sun simultaneously at several radio frequencies. Correlating the antennas produces radio images of the corona, where the emission is often generated by energetic electrons in magnetized plasma. Because the Sun changes quickly, the instrument is built for repeated, rapid imaging rather than deep static exposures.",
      fr: "Le Radiohéliographe est un interféromètre solaire spécialisé. Des antennes réparties sur un grand réseau en T observent simultanément le Soleil à plusieurs fréquences radio. La corrélation des antennes produit des images radio de la couronne, où l’émission est souvent générée par des électrons énergétiques dans un plasma magnétisé. Comme le Soleil varie rapidement, l’instrument est conçu pour une imagerie répétée et rapide plutôt que pour des poses profondes et statiques.",
    },
    finds: [
      {
        en: "Solar flares and coronal mass ejections: radio maps locate particle acceleration and magnetic restructuring in the corona.",
        fr: "Éruptions solaires et éjections de masse coronale : les cartes radio localisent l’accélération des particules et la restructuration magnétique dans la couronne.",
      },
      {
        en: "Space weather: radio bursts trace electron beams and shocks that can disturb satellites, GPS, communications, aviation, and power grids.",
        fr: "Météo de l’espace : les sursauts radio tracent les faisceaux d’électrons et les chocs capables de perturber les satellites, le GPS, les communications, l’aviation et les réseaux électriques.",
      },
      {
        en: "Solar plasma physics: frequency maps correspond to different heights and plasma densities in the corona.",
        fr: "Physique du plasma solaire : les cartes en fréquence correspondent à différentes hauteurs et densités de plasma dans la couronne.",
      },
    ],
    physics: ["plasma emission", "interferometry", "space weather"],
    link: "https://www.obs-nancay.fr/radioheliographe/",
  },
  {
    id: "nda",
    name: "Réseau décamétrique",
    rangeMHz: [10, 100],
    wavelengths: "3-30 m",
    facts: [
      { en: "144 conical antennas observing decametric wavelengths.", fr: "144 antennes coniques observant les longueurs d’onde décamétriques." },
      { en: "Specialized in Jupiter and solar radio bursts.", fr: "Spécialisé dans les sursauts radio de Jupiter et du Soleil." },
      { en: "Long monitoring record since the late 1970s.", fr: "Longue série de surveillance depuis la fin des années 1970." },
    ],
    image: decametricArrayUrl,
    alt: "Nançay Decameter Array conical antennas",
    tagline: {
      en: "A long-running listener for Jupiter and the Sun.",
      fr: "Une écoute longue durée de Jupiter et du Soleil.",
    },
    works: {
      en: "The Decameter Array is a phased array of 144 conical antennas. At 10-100 MHz, the wavelengths are so long that simple wire-like structures can act as efficient antennas. Electronic phasing selects directions on the sky, while spectrographs record intensity as a function of time and frequency. That time-frequency structure is central: Jupiter and the Sun produce bursts, arcs, drifts, and bands rather than quiet steady emission.",
      fr: "Le Réseau décamétrique est un réseau phasé de 144 antennes coniques. À 10-100 MHz, les longueurs d’onde sont si grandes que des structures simples de type filaire peuvent servir d’antennes efficaces. Le phasage électronique sélectionne les directions du ciel, tandis que les spectrographes enregistrent l’intensité en fonction du temps et de la fréquence. Cette structure temps-fréquence est centrale : Jupiter et le Soleil produisent des sursauts, des arcs, des dérives et des bandes plutôt qu’une émission calme et constante.",
    },
    finds: [
      {
        en: "Jupiter’s decametric bursts: coherent emission from electrons moving in the planet’s strong magnetic field, often controlled by the moon Io.",
        fr: "Sursauts décamétriques de Jupiter : émission cohérente d’électrons évoluant dans le champ magnétique intense de la planète, souvent contrôlée par la lune Io.",
      },
      {
        en: "Solar bursts: low-frequency signatures of electron beams, shocks, and coronal plasma structures.",
        fr: "Sursauts solaires : signatures basse fréquence de faisceaux d’électrons, de chocs et de structures du plasma coronal.",
      },
      {
        en: "Monitoring: repeated observations build a long-term record of planetary and solar activity at frequencies strongly affected by Earth’s ionosphere.",
        fr: "Surveillance : les observations répétées construisent une archive longue de l’activité planétaire et solaire à des fréquences fortement influencées par l’ionosphère terrestre.",
      },
    ],
    physics: ["cyclotron emission", "cyclotron maser", "plasma emission"],
    link: "https://www.obs-nancay.fr/reseau-decametrique/",
  },
];

const mechanisms: Mechanism[] = [
  {
    id: "thermal",
    name: { en: "Thermal emission", fr: "Émission thermique" },
    icon: "heat",
    summary: {
      en: "Matter with a temperature radiates. In radio astronomy, this can trace warm ionized gas or hot plasma.",
      fr: "Toute matière qui a une température rayonne. En radio, cela peut tracer du gaz ionisé chaud ou du plasma.",
    },
    science: {
      en: "Particles move randomly because they are hot. Charged particles that accelerate emit electromagnetic radiation. The emission tells us about temperature, density, and the state of the gas.",
      fr: "Les particules bougent aléatoirement parce qu’elles sont chaudes. Les particules chargées accélérées émettent un rayonnement électromagnétique. L’émission renseigne sur la température, la densité et l’état du gaz.",
    },
    where: {
      en: "Young stellar environments, ionized nebulae, solar and astrophysical plasmas.",
      fr: "Régions de formation stellaire, nébuleuses ionisées, plasmas solaires et astrophysiques.",
    },
    visual: {
      src: commonsFile("Orion Nebula - Hubble 2006 mosaic 18000.jpg"),
      source: "https://commons.wikimedia.org/wiki/File:Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
      label: "Orion Nebula, Hubble mosaic",
      license: "NASA/ESA Hubble material, public-domain/copyright-free via Commons",
    },
  },
  {
    id: "freefree",
    name: { en: "Free-free / Bremsstrahlung", fr: "Libre-libre / Bremsstrahlung" },
    icon: "bend",
    summary: {
      en: "An electron passes near an ion, gets deflected, and emits radiation because its motion changes.",
      fr: "Un électron passe près d’un ion, sa trajectoire est déviée, et il émet parce que son mouvement change.",
    },
    science: {
      en: "The electron remains free before and after the encounter, hence free-free. The important physics is acceleration by an electric field.",
      fr: "L’électron reste libre avant et après la rencontre, d’où le nom libre-libre. La physique clé est l’accélération par un champ électrique.",
    },
    where: {
      en: "H II regions around young stars, stellar winds, the solar corona.",
      fr: "Régions H II autour des jeunes étoiles, vents stellaires, couronne solaire.",
    },
    visual: {
      src: commonsFile("Bremsstrahlung.svg"),
      source: "https://commons.wikimedia.org/wiki/File:Bremsstrahlung.svg",
      label: "Bremsstrahlung schematic",
      license: "Wikimedia Commons free media",
    },
  },
  {
    id: "synchrotron",
    name: { en: "Synchrotron emission", fr: "Rayonnement synchrotron" },
    icon: "spiral",
    summary: {
      en: "Relativistic electrons spiral around magnetic-field lines and radiate.",
      fr: "Des électrons relativistes spiralent autour des lignes de champ magnétique et rayonnent.",
    },
    science: {
      en: "This is why radio images can reveal cosmic rays and magnetic fields across galaxies, jets, and galaxy clusters. It is one of radio astronomy’s most powerful hidden-process tracers.",
      fr: "C’est pour cela que les images radio révèlent les rayons cosmiques et les champs magnétiques des galaxies, des jets et des amas. C’est un traceur majeur des processus invisibles.",
    },
    where: {
      en: "LOFAR observations of galaxies, clusters, supernova remnants, radio jets.",
      fr: "Observations LOFAR de galaxies, d’amas, de restes de supernovae et de jets radio.",
    },
    visual: {
      src: commonsFile("Crab Nebula Supernova Remnant (Spitzer IRAC-MIPS Image).jpg"),
      source: "https://commons.wikimedia.org/wiki/File:Crab_Nebula_Supernova_Remnant_(Spitzer_IRAC-MIPS_Image).jpg",
      label: "Crab Nebula synchrotron radiation",
      license: "NASA public domain via Wikimedia Commons",
    },
  },
  {
    id: "cyclotron",
    name: { en: "Cyclotron emission", fr: "Émission cyclotron" },
    icon: "orbit",
    summary: {
      en: "Slower electrons orbit magnetic-field lines and emit at frequencies tied to magnetic-field strength.",
      fr: "Des électrons plus lents orbitent autour des lignes de champ et émettent à des fréquences liées à l’intensité du champ magnétique.",
    },
    science: {
      en: "This process is especially useful for planets because it gives a direct radio handle on magnetospheres.",
      fr: "Ce processus est particulièrement utile pour les planètes, car il donne un accès radio direct aux magnétosphères.",
    },
    where: {
      en: "Jupiter, planetary magnetospheres, possibly magnetized exoplanets.",
      fr: "Jupiter, magnétosphères planétaires, possiblement exoplanètes magnétisées.",
    },
    visual: {
      src: commonsFile("Hubble provides complete view of Jupiter's auroras (opo9804a).jpg"),
      source: "https://commons.wikimedia.org/wiki/File:Hubble_provides_complete_view_of_Jupiter%27s_auroras_(opo9804a).jpg",
      label: "Jupiter aurorae, Hubble",
      license: "NASA/ESA Hubble public-domain/copyright-free via Commons",
    },
  },
  {
    id: "maser",
    name: { en: "Cyclotron maser", fr: "Maser cyclotron" },
    icon: "burst",
    summary: {
      en: "Electrons emit coherently, making a burst far stronger than independent particle emission.",
      fr: "Les électrons émettent de façon cohérente, créant un sursaut beaucoup plus intense qu’une émission indépendante.",
    },
    science: {
      en: "It is laser-like in spirit, but at radio wavelengths. This explains why Jupiter can be such a powerful decametric radio source.",
      fr: "L’idée ressemble à un laser, mais en ondes radio. Cela explique pourquoi Jupiter peut être une source radio décamétrique si puissante.",
    },
    where: {
      en: "Jupiter, auroral planets, searches for exoplanet magnetic fields with NenuFAR/LOFAR.",
      fr: "Jupiter, planètes aurorales, recherches de champs magnétiques d’exoplanètes avec NenuFAR/LOFAR.",
    },
    visual: {
      src: commonsFile("Jupiter magnetosphere schematic.jpg"),
      source: "https://commons.wikimedia.org/wiki/File:Jupiter_magnetosphere_schematic.jpg",
      label: "Jupiter magnetosphere schematic",
      license: "Wikimedia Commons free media",
    },
  },
  {
    id: "hydrogen",
    name: { en: "21 cm hydrogen", fr: "Hydrogène à 21 cm" },
    icon: "atom",
    summary: {
      en: "Neutral hydrogen emits a weak but fundamental spectral line at 1420 MHz.",
      fr: "L’hydrogène neutre émet une raie spectrale faible mais fondamentale à 1420 MHz.",
    },
    science: {
      en: "One atom emits rarely, but galaxies contain so much hydrogen that the signal becomes detectable. The Doppler shift maps gas velocity and galaxy rotation.",
      fr: "Un atome émet rarement, mais les galaxies contiennent tellement d’hydrogène que le signal devient détectable. Le décalage Doppler cartographie la vitesse du gaz et la rotation des galaxies.",
    },
    where: {
      en: "NRT maps neutral gas in galaxies; NenuFAR/LOFAR search for the redshifted line from the early Universe.",
      fr: "Le NRT cartographie le gaz neutre des galaxies ; NenuFAR/LOFAR cherchent la raie décalée vers le rouge de l’Univers jeune.",
    },
    visual: {
      src: commonsFile("Hydrogen-SpinFlip.svg"),
      source: "https://commons.wikimedia.org/wiki/File:Hydrogen-SpinFlip.svg",
      label: "Hydrogen spin-flip transition",
      license: "Wikimedia Commons free media",
    },
  },
  {
    id: "molecules",
    name: { en: "Molecular lines", fr: "Raies moléculaires" },
    icon: "molecule",
    summary: {
      en: "Molecules rotate and change rotational state, emitting photons at precise radio frequencies.",
      fr: "Les molécules tournent et changent d’état rotationnel, en émettant des photons à des fréquences radio précises.",
    },
    science: {
      en: "Radio spectroscopy lets astronomers identify molecules such as carbon monoxide, ammonia, water, and OH. It is chemistry across interstellar space.",
      fr: "La spectroscopie radio permet d’identifier des molécules comme le monoxyde de carbone, l’ammoniac, l’eau ou OH. C’est de la chimie à l’échelle interstellaire.",
    },
    where: {
      en: "Molecular clouds, comets, evolved-star envelopes, star-forming regions.",
      fr: "Nuages moléculaires, comètes, enveloppes d’étoiles évoluées, régions de formation stellaire.",
    },
    visual: {
      src: commonsFile("Molecular energy levels en.svg"),
      source: "https://commons.wikimedia.org/wiki/File:Molecular_energy_levels_en.svg",
      label: "Molecular energy levels",
      license: "Wikimedia Commons free media",
    },
  },
  {
    id: "pulsars",
    name: { en: "Pulsars", fr: "Pulsars" },
    icon: "pulse",
    summary: {
      en: "Rotating neutron stars send beams of radio waves across space like lighthouse beams.",
      fr: "Des étoiles à neutrons en rotation projettent des faisceaux radio comme des phares cosmiques.",
    },
    science: {
      en: "Each pulse arrival can be timed with extreme precision. Some pulsars rival atomic clocks, making them probes of gravity, dense matter, and the interstellar medium.",
      fr: "Chaque impulsion peut être chronométrée avec une précision extrême. Certains pulsars rivalisent avec les horloges atomiques, ce qui en fait des sondes de la gravité, de la matière dense et du milieu interstellaire.",
    },
    where: {
      en: "Nançay’s decimetric telescope is a major European pulsar-timing facility.",
      fr: "Le radiotélescope décimétrique de Nançay est un grand instrument européen de chronométrage de pulsars.",
    },
    visual: {
      src: commonsFile("Vela pulsar - Chandra, animation.gif"),
      source: "https://commons.wikimedia.org/wiki/File:Vela_pulsar_-_Chandra,_animation.gif",
      label: "Vela pulsar animation",
      license: "NASA public domain via Wikimedia Commons",
    },
  },
  {
    id: "plasma",
    name: { en: "Solar plasma emission", fr: "Émission plasma solaire" },
    icon: "sun",
    summary: {
      en: "Energetic electrons moving through plasma generate radio waves during flares and eruptions.",
      fr: "Des électrons énergétiques traversant un plasma produisent des ondes radio lors des éruptions.",
    },
    science: {
      en: "Radio solar observations often show energetic particles and magnetic restructuring in the corona, not just the visible solar surface.",
      fr: "Les observations solaires radio montrent souvent les particules énergétiques et la restructuration magnétique dans la couronne, pas seulement la surface visible.",
    },
    where: {
      en: "Radioheliograph, Decameter Array, NenuFAR solar observations.",
      fr: "Radiohéliographe, Réseau décamétrique, observations solaires avec NenuFAR.",
    },
    visual: {
      src: commonsFile("SDO first light.png"),
      source: "https://commons.wikimedia.org/wiki/File:SDO_first_light.png",
      label: "Solar Dynamics Observatory EUV Sun",
      license: "NASA public domain via Wikimedia Commons",
    },
  },
];

const mechanismProcessVisuals: Record<string, MediaVisual> = {
  thermal: {
    src: commonsFile("Blackbody radiation.svg"),
    source: "https://commons.wikimedia.org/wiki/File:Blackbody_radiation.svg",
    label: "Blackbody radiation curve",
    license: "CC0 public-domain dedication via Wikimedia Commons",
  },
  freefree: {
    src: commonsFile("Bremsstrahlung.svg"),
    source: "https://commons.wikimedia.org/wiki/File:Bremsstrahlung.svg",
    label: "Bremsstrahlung deflection schematic",
    license: "Wikimedia Commons free media",
  },
  synchrotron: {
    src: commonsFile("Undulator (english).svg"),
    source: "https://commons.wikimedia.org/wiki/File:Undulator_(english).svg",
    label: "Electron radiation in a magnetic structure",
    license: "Wikimedia Commons free media",
  },
  cyclotron: {
    src: commonsFile("Cyclotron motion.jpg"),
    source: "https://commons.wikimedia.org/wiki/File:Cyclotron_motion.jpg",
    label: "Electron cyclotron motion in a magnetic field",
    license: "CC BY-SA / GFDL via Wikimedia Commons",
  },
  maser: {
    src: commonsFile("Jupiter magnetosphere schematic.jpg"),
    source: "https://commons.wikimedia.org/wiki/File:Jupiter_magnetosphere_schematic.jpg",
    label: "Jupiter magnetosphere schematic",
    license: "Wikimedia Commons free media",
  },
  hydrogen: {
    src: commonsFile("Hydrogen-SpinFlip.svg"),
    source: "https://commons.wikimedia.org/wiki/File:Hydrogen-SpinFlip.svg",
    label: "Hydrogen spin-flip transition",
    license: "Wikimedia Commons free media",
  },
  molecules: {
    src: commonsFile("Molecular energy levels en.svg"),
    source: "https://commons.wikimedia.org/wiki/File:Molecular_energy_levels_en.svg",
    label: "Molecular energy levels",
    license: "Wikimedia Commons free media",
  },
  pulsars: {
    src: commonsFile("Pulsar schematic transparent.svg"),
    source: "https://commons.wikimedia.org/wiki/File:Pulsar_schematic_transparent.svg",
    label: "Pulsar beam schematic",
    license: "Public domain via Wikimedia Commons",
  },
  plasma: {
    src: commonsFile("Surface plasmon.gif"),
    source: "https://commons.wikimedia.org/wiki/File:Surface_plasmon.gif",
    label: "Plasma oscillation animation",
    license: "Wikimedia Commons free media",
  },
};

const mechanismSourceVisuals: Record<string, MediaVisual> = {
  thermal: {
    src: commonsFile("Orion Nebula - Hubble 2006 mosaic 18000.jpg"),
    source: "https://commons.wikimedia.org/wiki/File:Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg",
    label: "Orion Nebula, Hubble mosaic",
    license: "NASA/ESA Hubble material, public-domain/copyright-free via Commons",
  },
  freefree: {
    src: commonsFile("WHAM survey.png"),
    source: "https://commons.wikimedia.org/wiki/File:WHAM_survey.png",
    label: "Milky Way ionized gas survey",
    license: "Wikimedia Commons free media",
  },
  synchrotron: {
    src: commonsFile("Crab Nebula Supernova Remnant (Spitzer IRAC-MIPS Image).jpg"),
    source: "https://commons.wikimedia.org/wiki/File:Crab_Nebula_Supernova_Remnant_(Spitzer_IRAC-MIPS_Image).jpg",
    label: "Crab Nebula synchrotron source",
    license: "NASA public domain via Wikimedia Commons",
  },
  cyclotron: {
    src: commonsFile("Hubble provides complete view of Jupiter's auroras (opo9804a).jpg"),
    source: "https://commons.wikimedia.org/wiki/File:Hubble_provides_complete_view_of_Jupiter%27s_auroras_(opo9804a).jpg",
    label: "Jupiter aurorae, Hubble",
    license: "NASA/ESA Hubble public-domain/copyright-free via Commons",
  },
  maser: {
    src: commonsFile("Hubble provides complete view of Jupiter's auroras (opo9804a).jpg"),
    source: "https://commons.wikimedia.org/wiki/File:Hubble_provides_complete_view_of_Jupiter%27s_auroras_(opo9804a).jpg",
    label: "Jupiter aurorae, a cyclotron-maser environment",
    license: "NASA/ESA Hubble public-domain/copyright-free via Commons",
  },
  hydrogen: {
    src: commonsFile("Neutral hydrogen.gif"),
    source: "https://commons.wikimedia.org/wiki/File:Neutral_hydrogen.gif",
    label: "Galactic neutral hydrogen map",
    license: "NASA public domain via Wikimedia Commons",
  },
  molecules: {
    src: commonsFile("Plank Molecular Clouds.jpg"),
    source: "https://commons.wikimedia.org/wiki/File:Plank_Molecular_Clouds.jpg",
    label: "Planck carbon-monoxide molecular clouds",
    license: "ESA/Planck material via Wikimedia Commons",
  },
  pulsars: {
    src: commonsFile("Vela pulsar - Chandra, animation.gif"),
    source: "https://commons.wikimedia.org/wiki/File:Vela_pulsar_-_Chandra,_animation.gif",
    label: "Vela pulsar Chandra animation",
    license: "NASA public domain via Wikimedia Commons",
  },
  plasma: {
    src: commonsFile("SDO first light.png"),
    source: "https://commons.wikimedia.org/wiki/File:SDO_first_light.png",
    label: "Solar Dynamics Observatory EUV Sun",
    license: "NASA public domain via Wikimedia Commons",
  },
};

const sources = [
  ["Observatoire de Nançay", "https://www.obs-nancay.fr/"],
  ["Radiotélescope décimétrique", "https://www.obs-nancay.fr/radiotelescope-decimetrique/"],
  ["LOFAR at Nançay", "https://www.obs-nancay.fr/lofar/"],
  ["NenuFAR", "https://nenufar.obs-nancay.fr/en/homepage-en/"],
  ["Radiohéliographe", "https://www.obs-nancay.fr/radioheliographe/"],
  ["Réseau décamétrique", "https://www.obs-nancay.fr/reseau-decametrique/"],
  ["NASA electromagnetic spectrum", "https://science.nasa.gov/ems/05_radiowaves"],
] as const;

let language: Language = "en";
let activeInstrumentId = "nenufar";
let activeMechanismId = "synchrotron";

function t(text: Localized): string {
  return text[language];
}

function wavelengthMeters(freqMHz: number): number {
  return 299.792458 / freqMHz;
}

function formatWavelength(meters: number): string {
  if (meters >= 1) {
    return `${meters.toFixed(meters >= 10 ? 1 : 2)} m`;
  }

  return `${(meters * 100).toFixed(1)} cm`;
}

function commonsFile(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename.replaceAll(" ", "_"))}?width=900`;
}

function instrumentsForFrequency(freqMHz: number): Instrument[] {
  return instruments.filter((instrument) => freqMHz >= instrument.rangeMHz[0] && freqMHz <= instrument.rangeMHz[1]);
}

app.innerHTML = `
  <div id="site-border-left"></div>
  <div id="site-border-right"></div>
  <div id="site-border-top"></div>
  <div id="site-border-bottom"></div>

  <header class="site-header">
    <nav class="site-nav" aria-label="Main navigation">
      <a href="../index.html">01 : Home</a>
      <a href="../science.html">02 : Research</a>
      <a href="../outreach.html">03 : Outreach</a>
      <a href="../ventures.html">04 : Ventures</a>
      <a href="../games/index.html">05 : Games</a>
      <a href="../art.html">06 : Art</a>
      <a href="../about.html">07 : About</a>
      <a href="../contact.html">08 : Contact</a>
    </nav>
  </header>

  <main class="site-shell">
    <section class="hero" style="--hero-image: url('${nrtUrl}')">
      <nav class="topbar" aria-label="Page controls">
        <a class="brand" href="../outreach.html">CosmoSofia · Nançay</a>
        <div class="nav-actions" role="group" aria-label="Language">
          <button class="lang-button is-active" type="button" data-lang="en">EN</button>
          <button class="lang-button" type="button" data-lang="fr">FR</button>
        </div>
      </nav>
      <div id="top" class="hero-content">
        <p class="eyebrow" data-i18n="eyebrow"></p>
        <h1 data-i18n="title"></h1>
        <p class="lede" data-i18n="intro"></p>
        <p class="core-line" data-i18n="coreLine"></p>
      </div>
    </section>

    <section class="section-grid quick-grid" aria-label="Core questions">
      <article class="panel answer-panel">
        <span class="section-kicker" data-copy-en="Radio astronomy" data-copy-fr="Radioastronomie"></span>
        <h2 data-copy-en="Long-wavelength light, hidden physics" data-copy-fr="Lumière longue, physique cachée"></h2>
        <p data-copy-en="It is astronomy with radio waves: the same electromagnetic family as visible light, but at longer wavelengths. Because radio waves are produced by moving charges, atoms, molecules, and magnetized plasma, they reveal gas, magnetic fields, cosmic rays, pulsars, planetary magnetospheres, solar eruptions, and the early Universe."
          data-copy-fr="C’est l’astronomie faite avec les ondes radio : la même famille électromagnétique que la lumière visible, mais à des longueurs d’onde plus grandes. Comme les ondes radio sont produites par des charges en mouvement, des atomes, des molécules et des plasmas magnétisés, elles révèlent le gaz, les champs magnétiques, les rayons cosmiques, les pulsars, les magnétosphères planétaires, les éruptions solaires et l’Univers jeune."></p>
      </article>
      <article class="panel answer-panel">
        <span class="section-kicker" data-copy-en="Nançay" data-copy-fr="Nançay"></span>
        <h2 data-copy-en="A campus of complementary radio windows" data-copy-fr="Un campus de fenêtres radio complémentaires"></h2>
        <p data-copy-en="Nançay is not one telescope. It is a set of complementary radio instruments: each frequency band isolates different physics, from Jupiter’s magnetosphere and solar plasma to pulsar timing, neutral hydrogen in galaxies, and low-frequency searches for the Cosmic Dawn."
          data-copy-fr="Nançay n’est pas un seul télescope. C’est un ensemble d’instruments radio complémentaires : chaque bande de fréquence isole une physique différente, de la magnétosphère de Jupiter et du plasma solaire au chronométrage des pulsars, à l’hydrogène neutre des galaxies et aux recherches basse fréquence sur l’Aube cosmique."></p>
      </article>
    </section>

    <section class="section-block" id="spectrum">
      <div class="section-header">
        <span class="section-kicker" data-copy-en="Radio bands" data-copy-fr="Bandes radio"></span>
        <h2 data-copy-en="Nançay across frequency" data-copy-fr="Nançay à travers les fréquences"></h2>
        <p data-copy-en="Frequency selects a physical regime: atomic transitions, coherent plasma bursts, synchrotron radiation, pulsar timing, or solar-coronal activity."
          data-copy-fr="La fréquence sélectionne un régime physique : transitions atomiques, sursauts cohérents de plasma, rayonnement synchrotron, chronométrage des pulsars ou activité de la couronne solaire."></p>
      </div>

      <div class="interactive-layout">
        <article class="panel control-panel">
          <label class="slider-label" for="frequency-slider">
            <span data-copy-en="Frequency" data-copy-fr="Fréquence"></span>
            <strong id="frequency-readout">60 MHz</strong>
          </label>
          <input id="frequency-slider" type="range" min="10" max="3500" value="60" step="1" />
          <div class="frequency-scale" aria-hidden="true">
            <span>10 MHz</span>
            <span>3.5 GHz</span>
          </div>
          <div class="readout-grid">
            <div>
              <span data-copy-en="Wavelength" data-copy-fr="Longueur d’onde"></span>
              <strong id="wavelength-readout"></strong>
            </div>
            <div id="instrument-readout-card">
              <span data-copy-en="Nançay instruments" data-copy-fr="Instruments de Nançay"></span>
              <strong id="instrument-readout"></strong>
            </div>
          </div>
          <p class="fine-print" data-copy-en="λ = c / f · radio range shown: 10 MHz–3.5 GHz"
            data-copy-fr="λ = c / f · domaine radio affiché : 10 MHz–3,5 GHz"></p>
        </article>

        <article class="panel spectrum-card">
          <div class="spectrum-visual" aria-label="Electromagnetic spectrum diagram with NenuFAR on the long-wavelength radio side">
            <h3 data-copy-en="Radio astronomy observes the same light, but at longer wavelengths"
              data-copy-fr="La radioastronomie observe la même lumière, mais à de plus grandes longueurs d’onde"></h3>
            <div class="atmosphere-row" aria-label="Atmospheric transmission across the electromagnetic spectrum">
              <span class="atmosphere-label" data-copy-en="Atmosphere" data-copy-fr="Atmosphère"></span>
              <div class="atmosphere-band" aria-hidden="true">
                <span class="atm-open" data-copy-en="open radio window" data-copy-fr="fenêtre radio ouverte"></span>
                <span class="atm-partial" data-copy-en="partial" data-copy-fr="partiel"></span>
                <span class="atm-partial" data-copy-en="partial" data-copy-fr="partiel"></span>
                <span class="atm-open" data-copy-en="visible window" data-copy-fr="fenêtre visible"></span>
                <span class="atm-blocked" data-copy-en="mostly blocked" data-copy-fr="surtout bloqué"></span>
                <span class="atm-blocked" data-copy-en="blocked" data-copy-fr="bloqué"></span>
                <span class="atm-blocked" data-copy-en="blocked" data-copy-fr="bloqué"></span>
              </div>
            </div>
            <div class="spectrum-band" aria-hidden="true">
              <span class="band-radio">Radio</span>
              <span class="band-micro">Microwave</span>
              <span class="band-ir">Infrared</span>
              <span class="band-visible">Visible</span>
              <span class="band-uv">UV</span>
              <span class="band-xray">X-ray</span>
              <span class="band-gamma">Gamma ray</span>
            </div>
            <div class="spectrum-axis" aria-hidden="true">
              <span data-copy-en="long wavelength / low frequency" data-copy-fr="grande longueur d’onde / basse fréquence"></span>
              <span data-copy-en="short wavelength / high frequency" data-copy-fr="petite longueur d’onde / haute fréquence"></span>
            </div>
            <div class="spectrum-callouts">
              <div class="spectrum-callout nenufar-callout">
                <strong>NenuFAR: <span data-copy-en="about 4-30 m" data-copy-fr="environ 4-30 m"></span></strong>
                <span data-copy-en="Low-frequency radio light." data-copy-fr="Lumière radio basse fréquence."></span>
              </div>
              <div class="spectrum-callout visible-callout">
                <strong data-copy-en="Visible light: about 400-700 nm" data-copy-fr="Lumière visible : environ 400-700 nm"></strong>
                <span data-copy-en="The narrow band seen by human eyes." data-copy-fr="La bande étroite visible par nos yeux."></span>
              </div>
            </div>
          </div>
          <div id="spectrum-marker" class="spectrum-marker" aria-hidden="true"></div>
          <p id="frequency-explanation"></p>
        </article>
      </div>

      <div class="diagnostic-grid" aria-label="Radio diagnostics">
        <article class="panel diagnostic-card">
          <h3 data-copy-en="Frequency is a physical clue" data-copy-fr="La fréquence est un indice physique"></h3>
          <p data-copy-en="A radio frequency is not just a color label. It can point to a transition, a plasma condition, a magnetic-field strength, or a propagation effect through the interstellar medium."
            data-copy-fr="Une fréquence radio n’est pas seulement une couleur. Elle peut indiquer une transition, une condition de plasma, l’intensité d’un champ magnétique ou un effet de propagation dans le milieu interstellaire."></p>
        </article>
        <article class="panel diagnostic-card">
          <h3 data-copy-en="Time structure matters" data-copy-fr="La structure temporelle compte"></h3>
          <p data-copy-en="Radio telescopes do not only make images. They measure pulses, bursts, spectra, polarization, and delays. That is why the same observatory can study pulsar clocks, Jupiter bursts, solar eruptions, and galaxy gas."
            data-copy-fr="Les radiotélescopes ne font pas seulement des images. Ils mesurent des impulsions, des sursauts, des spectres, la polarisation et des retards. C’est pour cela qu’un même observatoire peut étudier les horloges pulsars, les sursauts de Jupiter, les éruptions solaires et le gaz des galaxies."></p>
        </article>
        <article class="panel diagnostic-card">
          <h3 data-copy-en="The signal is fragile" data-copy-fr="Le signal est fragile"></h3>
          <p data-copy-en="Cosmic radio signals are usually much weaker than human radio interference. A radio observatory is therefore also a protected listening environment and a signal-processing machine."
            data-copy-fr="Les signaux radio cosmiques sont souvent beaucoup plus faibles que les interférences humaines. Un observatoire radio est donc aussi un environnement d’écoute protégé et une machine de traitement du signal."></p>
        </article>
      </div>
    </section>

    <section class="section-block" id="mechanisms">
      <div class="section-header">
        <span class="section-kicker" data-copy-en="Physical processes" data-copy-fr="Processus physiques"></span>
        <h2 data-copy-en="Radio astronomy is not just objects. It is mechanisms." data-copy-fr="La radioastronomie ne regarde pas seulement des objets. Elle révèle des mécanismes."></h2>
        <p data-copy-en="The same galaxy, star, planet, or plasma can emit radio waves through several mechanisms at once. The mechanism determines what the signal actually diagnoses."
          data-copy-fr="Une même galaxie, étoile, planète ou région de plasma peut émettre en radio par plusieurs mécanismes à la fois. Le mécanisme détermine ce que le signal diagnostique réellement."></p>
      </div>
      <div class="mechanism-shell">
        <div id="mechanism-buttons" class="mechanism-buttons" role="tablist"></div>
        <article class="panel mechanism-detail">
          <div class="mechanism-visual-stack">
            <figure class="mechanism-source-card">
              <img id="mechanism-process-image" alt="" referrerpolicy="no-referrer" />
              <figcaption>
                <span class="visual-role" data-copy-en="Mechanism" data-copy-fr="Mécanisme"></span>
                <strong id="mechanism-process-label"></strong>
                <span id="mechanism-process-license"></span>
                <a id="mechanism-process-link" target="_blank" rel="noreferrer"
                  data-copy-en="Source" data-copy-fr="Source"></a>
              </figcaption>
            </figure>
            <figure class="mechanism-source-card">
              <img id="mechanism-source-image" alt="" referrerpolicy="no-referrer" />
              <figcaption>
                <span class="visual-role" data-copy-en="Astrophysical source" data-copy-fr="Source astrophysique"></span>
                <strong id="mechanism-source-label"></strong>
                <span id="mechanism-source-license"></span>
                <a id="mechanism-source-link" target="_blank" rel="noreferrer"
                  data-copy-en="Source" data-copy-fr="Source"></a>
              </figcaption>
            </figure>
          </div>
          <div>
            <span id="mechanism-tag" class="section-kicker"></span>
            <h3 id="mechanism-name"></h3>
            <p id="mechanism-summary"></p>
            <p id="mechanism-science"></p>
            <p class="where-line"><strong data-copy-en="Where it appears:" data-copy-fr="Où on le voit :"></strong> <span id="mechanism-where"></span></p>
          </div>
        </article>
      </div>
    </section>

    <section class="section-block" id="instruments">
      <div class="section-header">
        <span class="section-kicker" data-copy-en="Instrument map" data-copy-fr="Carte des instruments"></span>
        <h2 data-copy-en="Five instruments, five windows into hidden physics" data-copy-fr="Cinq instruments, cinq fenêtres sur une physique invisible"></h2>
      </div>
      <div id="instrument-tabs" class="instrument-tabs" role="tablist"></div>
      <article class="instrument-detail">
        <img id="instrument-image" alt="" />
        <div class="panel">
          <span id="instrument-band" class="section-kicker"></span>
          <h3 id="instrument-name"></h3>
          <p id="instrument-tagline"></p>
          <div id="instrument-facts" class="instrument-facts"></div>
          <h4 data-copy-en="How it works" data-copy-fr="Comment il fonctionne"></h4>
          <p id="instrument-works"></p>
          <h4 data-copy-en="What it finds" data-copy-fr="Ce qu’il trouve"></h4>
          <ul id="instrument-finds"></ul>
          <a id="instrument-link" class="source-link" target="_blank" rel="noreferrer"
            data-copy-en="Official instrument page" data-copy-fr="Page officielle de l’instrument"></a>
        </div>
      </article>
    </section>

    <section class="section-block" id="interferometry">
      <div class="section-header">
        <span class="section-kicker" data-copy-en="Delay, not magic" data-copy-fr="Des retards, pas de magie"></span>
        <h2 data-copy-en="Interferometry turns timing into direction" data-copy-fr="L’interférométrie transforme le temps en direction"></h2>
        <p data-copy-en="Phase is delay inside an oscillating wave. Long baselines turn small arrival-time differences into angular structure."
          data-copy-fr="La phase est un retard inscrit dans une onde oscillante. Les longues lignes de base transforment de petites différences de temps d’arrivée en structure angulaire."></p>
      </div>
      <div class="interactive-layout">
        <article class="panel control-panel">
          <label class="slider-label" for="baseline-slider">
            <span data-copy-en="Baseline B" data-copy-fr="Ligne de base B"></span>
            <strong id="baseline-readout">1000 km</strong>
          </label>
          <input id="baseline-slider" type="range" min="100" max="2000" value="1000" step="25" />
          <label class="slider-label" for="lambda-slider">
            <span data-copy-en="Wavelength λ" data-copy-fr="Longueur d’onde λ"></span>
            <strong id="lambda-readout">4.00 m</strong>
          </label>
          <input id="lambda-slider" type="range" min="0.2" max="30" value="4" step="0.1" />
          <label class="slider-label" for="angle-slider">
            <span data-copy-en="Source angle" data-copy-fr="Angle de la source"></span>
            <strong id="angle-readout">28°</strong>
          </label>
          <input id="angle-slider" type="range" min="-70" max="70" value="28" step="1" />
          <div class="readout-grid two-up">
            <div>
              <span data-copy-en="Delay across array" data-copy-fr="Retard dans le réseau"></span>
              <strong id="delay-readout"></strong>
            </div>
            <div>
              <span data-copy-en="Resolution θ ≈ λ/B" data-copy-fr="Résolution θ ≈ λ/B"></span>
              <strong id="resolution-readout"></strong>
            </div>
          </div>
        </article>
        <article class="panel interferometry-card">
          <canvas id="interferometry-canvas" aria-label="Interactive interferometry delay diagram"></canvas>
          <img src="${interferometryDiagramUrl}" alt="Static explanatory diagram of radio interferometry delays" />
        </article>
      </div>
    </section>

    <section class="section-block final-section">
      <div class="section-header">
        <span class="section-kicker" data-copy-en="Synthesis" data-copy-fr="Synthèse"></span>
        <h2 data-copy-en="Together, what do these instruments discover?" data-copy-fr="Ensemble, que permettent-ils de découvrir ?"></h2>
      </div>
      <div class="synthesis-grid">
        ${[
          ["Gas reservoir", "Réservoir de gaz", "Neutral hydrogen shows the raw material of future stars.", "L’hydrogène neutre montre la matière première des futures étoiles."],
          ["Magnetic Universe", "Univers magnétique", "Synchrotron and cyclotron emission reveal fields that optical light barely shows.", "Le synchrotron et le cyclotron révèlent des champs que l’optique montre difficilement."],
          ["Plasma weather", "Météo des plasmas", "Solar radio emission tracks energetic particles that affect space technology.", "L’émission radio solaire suit les particules énergétiques qui affectent les technologies spatiales."],
          ["Cosmic clocks", "Horloges cosmiques", "Pulsars test dense matter, gravity, and nanohertz gravitational-wave backgrounds.", "Les pulsars testent la matière dense, la gravité et les fonds d’ondes gravitationnelles nanohertz."],
          ["Planetary shields", "Boucliers planétaires", "Jupiter and possible exoplanet radio bursts probe magnetospheres.", "Jupiter et les possibles sursauts d’exoplanètes sondent les magnétosphères."],
          ["Cosmic Dawn", "Aube cosmique", "Redshifted hydrogen may reveal the first stars and galaxies switching on.", "L’hydrogène décalé vers le rouge peut révéler l’allumage des premières étoiles et galaxies."],
        ]
          .map(
            ([enTitle, frTitle, enBody, frBody]) => `
              <article class="panel synthesis-card">
                <h3 data-copy-en="${enTitle}" data-copy-fr="${frTitle}"></h3>
                <p data-copy-en="${enBody}" data-copy-fr="${frBody}"></p>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="section-block sources-section">
      <div class="section-header">
        <span class="section-kicker" data-copy-en="Links" data-copy-fr="Liens"></span>
        <h2 data-copy-en="Sources and further reading" data-copy-fr="Sources et lectures utiles"></h2>
      </div>
      <ul class="source-list">
        ${sources.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noreferrer">${label}</a></li>`).join("")}
      </ul>
    </section>

    <footer class="site-footer">
      <p>© Nefinia</p>
      <a href="../index.html" aria-label="Home">
        <img src="../assets/images/cosmovision.png" alt="" />
      </a>
    </footer>
  </main>
`;

const languageButtons = document.querySelectorAll<HTMLButtonElement>(".lang-button");
const frequencySlider = document.querySelector<HTMLInputElement>("#frequency-slider");
const frequencyReadout = document.querySelector<HTMLElement>("#frequency-readout");
const wavelengthReadout = document.querySelector<HTMLElement>("#wavelength-readout");
const instrumentReadoutCard = document.querySelector<HTMLElement>("#instrument-readout-card");
const instrumentReadout = document.querySelector<HTMLElement>("#instrument-readout");
const frequencyExplanation = document.querySelector<HTMLElement>("#frequency-explanation");
const spectrumMarker = document.querySelector<HTMLElement>("#spectrum-marker");
const mechanismButtons = document.querySelector<HTMLElement>("#mechanism-buttons");
const mechanismProcessImage = document.querySelector<HTMLImageElement>("#mechanism-process-image");
const mechanismProcessLabel = document.querySelector<HTMLElement>("#mechanism-process-label");
const mechanismProcessLicense = document.querySelector<HTMLElement>("#mechanism-process-license");
const mechanismProcessLink = document.querySelector<HTMLAnchorElement>("#mechanism-process-link");
const mechanismSourceImage = document.querySelector<HTMLImageElement>("#mechanism-source-image");
const mechanismSourceLabel = document.querySelector<HTMLElement>("#mechanism-source-label");
const mechanismSourceLicense = document.querySelector<HTMLElement>("#mechanism-source-license");
const mechanismSourceLink = document.querySelector<HTMLAnchorElement>("#mechanism-source-link");
const mechanismTag = document.querySelector<HTMLElement>("#mechanism-tag");
const mechanismName = document.querySelector<HTMLElement>("#mechanism-name");
const mechanismSummary = document.querySelector<HTMLElement>("#mechanism-summary");
const mechanismScience = document.querySelector<HTMLElement>("#mechanism-science");
const mechanismWhere = document.querySelector<HTMLElement>("#mechanism-where");
const instrumentTabs = document.querySelector<HTMLElement>("#instrument-tabs");
const instrumentImage = document.querySelector<HTMLImageElement>("#instrument-image");
const instrumentBand = document.querySelector<HTMLElement>("#instrument-band");
const instrumentName = document.querySelector<HTMLElement>("#instrument-name");
const instrumentTagline = document.querySelector<HTMLElement>("#instrument-tagline");
const instrumentFacts = document.querySelector<HTMLElement>("#instrument-facts");
const instrumentWorks = document.querySelector<HTMLElement>("#instrument-works");
const instrumentFinds = document.querySelector<HTMLUListElement>("#instrument-finds");
const instrumentLink = document.querySelector<HTMLAnchorElement>("#instrument-link");
const baselineSlider = document.querySelector<HTMLInputElement>("#baseline-slider");
const lambdaSlider = document.querySelector<HTMLInputElement>("#lambda-slider");
const angleSlider = document.querySelector<HTMLInputElement>("#angle-slider");
const baselineReadout = document.querySelector<HTMLElement>("#baseline-readout");
const lambdaReadout = document.querySelector<HTMLElement>("#lambda-readout");
const angleReadout = document.querySelector<HTMLElement>("#angle-readout");
const delayReadout = document.querySelector<HTMLElement>("#delay-readout");
const resolutionReadout = document.querySelector<HTMLElement>("#resolution-readout");
const interferometryCanvas = document.querySelector<HTMLCanvasElement>("#interferometry-canvas");

if (
  !frequencySlider ||
  !frequencyReadout ||
  !wavelengthReadout ||
  !instrumentReadoutCard ||
  !instrumentReadout ||
  !frequencyExplanation ||
  !spectrumMarker ||
  !mechanismButtons ||
  !mechanismProcessImage ||
  !mechanismProcessLabel ||
  !mechanismProcessLicense ||
  !mechanismProcessLink ||
  !mechanismSourceImage ||
  !mechanismSourceLabel ||
  !mechanismSourceLicense ||
  !mechanismSourceLink ||
  !mechanismTag ||
  !mechanismName ||
  !mechanismSummary ||
  !mechanismScience ||
  !mechanismWhere ||
  !instrumentTabs ||
  !instrumentImage ||
  !instrumentBand ||
  !instrumentName ||
  !instrumentTagline ||
  !instrumentFacts ||
  !instrumentWorks ||
  !instrumentFinds ||
  !instrumentLink ||
  !baselineSlider ||
  !lambdaSlider ||
  !angleSlider ||
  !baselineReadout ||
  !lambdaReadout ||
  !angleReadout ||
  !delayReadout ||
  !resolutionReadout ||
  !interferometryCanvas
) {
  throw new Error("UI initialization failed.");
}

function updateStaticCopy(): void {
  document.documentElement.lang = language;
  document.title = language === "en" ? "Nançay Radio Observatory" : "Observatoire radioastronomique de Nançay";

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n as keyof typeof copy;
    node.textContent = copy[key]?.[language] ?? "";
  });

  document.querySelectorAll<HTMLElement>("[data-copy-en]").forEach((node) => {
    node.textContent = node.dataset[language === "en" ? "copyEn" : "copyFr"] ?? "";
  });

  languageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === language);
  });
}

function renderMechanismButtons(): void {
  mechanismButtons.innerHTML = "";
  mechanisms.forEach((mechanism) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mechanism-button ${mechanism.id === activeMechanismId ? "is-active" : ""}`;
    button.textContent = t(mechanism.name);
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", `${mechanism.id === activeMechanismId}`);
    button.addEventListener("click", () => {
      activeMechanismId = mechanism.id;
      renderMechanism();
      renderMechanismButtons();
    });
    mechanismButtons.appendChild(button);
  });
}

function renderMechanism(): void {
  const mechanism = mechanisms.find((item) => item.id === activeMechanismId) ?? mechanisms[0];
  const processVisual = mechanismProcessVisuals[mechanism.id];
  const sourceVisual = mechanismSourceVisuals[mechanism.id] ?? mechanism.visual;
  mechanismTag.textContent = language === "en" ? "Emission mechanism" : "Mécanisme d’émission";
  mechanismName.textContent = t(mechanism.name);
  mechanismSummary.textContent = t(mechanism.summary);
  mechanismScience.textContent = t(mechanism.science);
  mechanismWhere.textContent = t(mechanism.where);
  mechanismProcessImage.src = processVisual.src;
  mechanismProcessImage.alt = processVisual.label;
  mechanismProcessLabel.textContent = processVisual.label;
  mechanismProcessLicense.textContent = processVisual.license;
  mechanismProcessLink.href = processVisual.source;
  mechanismSourceImage.src = sourceVisual.src;
  mechanismSourceImage.alt = sourceVisual.label;
  mechanismSourceLabel.textContent = sourceVisual.label;
  mechanismSourceLicense.textContent = sourceVisual.license;
  mechanismSourceLink.href = sourceVisual.source;
}

function renderInstrumentTabs(): void {
  instrumentTabs.innerHTML = "";
  instruments.forEach((instrument) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `instrument-tab ${instrument.id === activeInstrumentId ? "is-active" : ""}`;
    button.innerHTML = `<strong>${instrument.name}</strong><span>${instrument.wavelengths}</span>`;
    button.addEventListener("click", () => {
      activeInstrumentId = instrument.id;
      renderInstrument();
      renderInstrumentTabs();
    });
    instrumentTabs.appendChild(button);
  });
}

function renderInstrument(): void {
  const instrument = instruments.find((item) => item.id === activeInstrumentId) ?? instruments[0];
  instrumentImage.src = instrument.image;
  instrumentImage.alt = instrument.alt;
  instrumentBand.textContent = `${instrument.rangeMHz[0]}-${instrument.rangeMHz[1]} MHz · ${instrument.wavelengths}`;
  instrumentName.textContent = instrument.name;
  instrumentTagline.textContent = t(instrument.tagline);
  instrumentFacts.innerHTML = instrument.facts.map((fact) => `<p>${t(fact)}</p>`).join("");
  instrumentWorks.textContent = t(instrument.works);
  instrumentFinds.innerHTML = instrument.finds.map((item) => `<li>${t(item)}</li>`).join("");
  instrumentLink.href = instrument.link;
}

function updateFrequency(): void {
  const freq = Number(frequencySlider.value);
  const wavelength = wavelengthMeters(freq);
  const activeInstruments = instrumentsForFrequency(freq);
  const radioBandWidthPercent = 36;
  const markerPosition =
    ((Math.log10(freq) - Math.log10(10)) / (Math.log10(3500) - Math.log10(10))) * radioBandWidthPercent;

  frequencyReadout.textContent = freq >= 1000 ? `${(freq / 1000).toFixed(2)} GHz` : `${freq.toFixed(0)} MHz`;
  wavelengthReadout.textContent = formatWavelength(wavelength);
  spectrumMarker.style.left = `${Math.max(0, Math.min(100, markerPosition))}%`;

  if (activeInstruments.length) {
    const physics = [...new Set(activeInstruments.flatMap((instrument) => instrument.physics))];
    instrumentReadoutCard.hidden = false;
    instrumentReadout.textContent = activeInstruments.map((instrument) => instrument.name).join(", ");
    frequencyExplanation.textContent =
      language === "en"
        ? `At this frequency, these Nançay instruments can observe: ${activeInstruments.map((instrument) => instrument.name).join(", ")}. The science shifts toward: ${physics.join(", ")}.`
        : `À cette fréquence, ces instruments de Nançay peuvent observer : ${activeInstruments.map((instrument) => instrument.name).join(", ")}. La science se déplace vers : ${physics.join(", ")}.`;
    frequencyExplanation.hidden = false;
  } else {
    instrumentReadoutCard.hidden = true;
    instrumentReadout.textContent = "";
    frequencyExplanation.textContent = "";
    frequencyExplanation.hidden = true;
  }
}

function arcsecondsFromRadians(radians: number): number {
  return radians * 206264.806;
}

function updateInterferometry(): void {
  const baselineKm = Number(baselineSlider.value);
  const lambdaM = Number(lambdaSlider.value);
  const angleDeg = Number(angleSlider.value);
  const angleRad = (angleDeg * Math.PI) / 180;
  const baselineM = baselineKm * 1000;
  const delaySeconds = (baselineM * Math.sin(angleRad)) / 299792458;
  const resolutionArcsec = arcsecondsFromRadians(lambdaM / baselineM);

  baselineReadout.textContent = `${baselineKm.toFixed(0)} km`;
  lambdaReadout.textContent = formatWavelength(lambdaM);
  angleReadout.textContent = `${angleDeg.toFixed(0)}°`;
  delayReadout.textContent = `${(delaySeconds * 1e6).toFixed(2)} µs`;
  resolutionReadout.textContent = resolutionArcsec >= 1 ? `${resolutionArcsec.toFixed(2)} arcsec` : `${(resolutionArcsec * 1000).toFixed(1)} mas`;
  drawInterferometry(angleRad);
}

function drawInterferometry(angleRad: number): void {
  const context = interferometryCanvas.getContext("2d");
  if (!context) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(320, Math.floor(interferometryCanvas.getBoundingClientRect().width));
  const height = Math.round(width * 0.62);
  interferometryCanvas.width = width * dpr;
  interferometryCanvas.height = height * dpr;
  interferometryCanvas.style.height = `${height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#f7f3ea";
  context.fillRect(0, 0, width, height);

  const ground = height * 0.76;
  const a1 = width * 0.32;
  const a2 = width * 0.68;
  const waveAngle = -Math.PI / 2 + angleRad;
  const nx = Math.cos(waveAngle);
  const ny = Math.sin(waveAngle);

  context.strokeStyle = "#b8cad0";
  context.lineWidth = 2;
  for (let i = -4; i <= 8; i += 1) {
    const x = width * 0.5 + i * 54 + Math.sin(angleRad) * 35;
    const y = height * 0.08;
    context.beginPath();
    context.moveTo(x - ny * 360, y + nx * 360);
    context.lineTo(x + ny * 360, y - nx * 360);
    context.stroke();
  }

  context.strokeStyle = "#263b42";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(40, ground);
  context.lineTo(width - 40, ground);
  context.stroke();

  [a1, a2].forEach((x) => {
    context.strokeStyle = "#24526a";
    context.lineWidth = 8;
    context.beginPath();
    context.moveTo(x, ground);
    context.lineTo(x, ground - 80);
    context.moveTo(x, ground - 78);
    context.lineTo(x - 48, ground - 128);
    context.moveTo(x, ground - 78);
    context.lineTo(x + 48, ground - 128);
    context.stroke();
    context.fillStyle = "#2f6f73";
    context.beginPath();
    context.arc(x, ground - 82, 12, 0, Math.PI * 2);
    context.fill();
  });

  context.strokeStyle = "#be6a2f";
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(width * 0.16, height * 0.16);
  context.lineTo(width * 0.16 + nx * 135, height * 0.16 + ny * 135);
  context.stroke();
  context.fillStyle = "#be6a2f";
  context.beginPath();
  context.arc(width * 0.16 + nx * 135, height * 0.16 + ny * 135, 8, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#123143";
  context.font = "600 14px Inter, system-ui, sans-serif";
  context.fillText(language === "en" ? "incoming wavefronts" : "fronts d’onde entrants", 24, 34);
  context.fillText(language === "en" ? "baseline B" : "ligne de base B", width * 0.45, ground + 30);
}

function renderAll(): void {
  updateStaticCopy();
  renderMechanismButtons();
  renderMechanism();
  renderInstrumentTabs();
  renderInstrument();
  updateFrequency();
  updateInterferometry();
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    language = button.dataset.lang === "fr" ? "fr" : "en";
    renderAll();
  });
});

frequencySlider.addEventListener("input", updateFrequency);
baselineSlider.addEventListener("input", updateInterferometry);
lambdaSlider.addEventListener("input", updateInterferometry);
angleSlider.addEventListener("input", updateInterferometry);

window.addEventListener("resize", () => {
  updateInterferometry();
});

renderAll();
