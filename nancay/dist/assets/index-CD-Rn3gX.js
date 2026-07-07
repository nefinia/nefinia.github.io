(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=``+new URL(`decametric_array-D5u3V09t.jpg`,import.meta.url).href,t=``+new URL(`custom_interferometry_delay_diagram-CYri1haU.png`,import.meta.url).href,n=``+new URL(`lofar-O-QUSJjM.jpg`,import.meta.url).href,r=``+new URL(`nenufar-si8VLvHU.jpg`,import.meta.url).href,i=``+new URL(`nrt-BR47miRG.jpg`,import.meta.url).href,a=``+new URL(`radioheliograph-DOiCapEI.jpg`,import.meta.url).href,o=document.querySelector(`#app`);if(!o)throw Error(`App root was not found.`);var s={eyebrow:{en:`Nançay Radio Observatory`,fr:`Observatoire radioastronomique de Nançay`},title:{en:`The Universe is not only seen. It is timed, filtered, and listened to.`,fr:`L’Univers ne se regarde pas seulement. Il se chronomètre, se filtre et s’écoute.`},intro:{en:`Radio astronomy at Nançay connects long-wavelength light to gas, magnetic fields, plasma, pulsars, planetary magnetospheres, and the early Universe.`,fr:`À Nançay, la radioastronomie relie la lumière de grande longueur d’onde au gaz, aux champs magnétiques, aux plasmas, aux pulsars, aux magnétosphères planétaires et à l’Univers jeune.`},coreLine:{en:`If optical astronomy shows what the Universe looks like, radio astronomy often reveals how it works.`,fr:`Si l’astronomie optique montre à quoi ressemble l’Univers, la radioastronomie révèle souvent comment il fonctionne.`}},c=[{id:`nrt`,name:`Radiotélescope décimétrique`,bandsMHz:[[1060,3500]],bandLabel:`1.06-3.5 GHz`,wavelengths:`8.6-28 cm`,facts:[{en:`Large single-dish radio telescope with a fixed spherical mirror and moving flat reflector.`,fr:`Grand radiotélescope avec miroir sphérique fixe et miroir plan mobile.`},{en:`Key band: 1.06-3.5 GHz, including H I at 1420 MHz.`,fr:`Bande clé : 1,06-3,5 GHz, incluant H I à 1420 MHz.`},{en:`Strength: deep spectra and precise timing rather than panoramic imaging.`,fr:`Force : spectres profonds et chronométrage précis plutôt qu’imagerie panoramique.`}],image:i,alt:`Large fixed spherical reflector of the Nançay decimetric radio telescope`,tagline:{en:`The galaxy gas and pulsar timing instrument.`,fr:`L’instrument du gaz galactique et du chronométrage des pulsars.`},works:{en:`The NRT is not a steerable dish in the usual sense. A movable flat reflector redirects radiation from the sky onto a large fixed spherical mirror; the focused signal reaches a receiver carriage. Cooled receivers and spectrometers then separate the signal by frequency, while pulsar backends record precise arrival times. Its decimetric band includes the 21 cm hyperfine line of neutral hydrogen, where Doppler shifts directly encode gas velocity.`,fr:`Le NRT n’est pas une parabole orientable classique. Un miroir plan mobile redirige le rayonnement du ciel vers un grand miroir sphérique fixe ; le signal focalisé arrive sur un chariot de réception. Des récepteurs refroidis et des spectromètres séparent ensuite le signal par fréquence, tandis que les chaînes pulsars enregistrent des temps d’arrivée très précis. Sa bande décimétrique inclut la raie hyperfine à 21 cm de l’hydrogène neutre, dont le décalage Doppler code directement la vitesse du gaz.`},finds:[{en:`Neutral hydrogen in galaxies: spectra measure gas mass, rotation, turbulence, and large-scale dynamics.`,fr:`Hydrogène neutre des galaxies : les spectres mesurent la masse de gaz, la rotation, la turbulence et la dynamique globale.`},{en:`Pulsar timing: pulse arrival times test neutron-star physics, binary dynamics, relativity, and nanohertz gravitational-wave backgrounds.`,fr:`Chronométrage des pulsars : les temps d’arrivée testent la physique des étoiles à neutrons, la dynamique binaire, la relativité et les fonds d’ondes gravitationnelles nanohertz.`},{en:`Narrow spectral lines: cometary OH traces water production; OH masers around evolved stars trace mass loss and circumstellar chemistry.`,fr:`Raies spectrales étroites : l’OH cométaire trace la production d’eau ; les masers OH autour des étoiles évoluées tracent la perte de masse et la chimie circumstellaire.`}],physics:[`21 cm hydrogen`,`pulsars`,`molecular radio lines`],link:`https://www.obs-nancay.fr/radiotelescope-decimetrique/`},{id:`lofar`,name:`LOFAR FR606`,bandsMHz:[[10,90],[110,270]],bandLabel:`10-90 MHz; 110-270 MHz`,wavelengths:`1.1-30 m, with a band gap`,facts:[{en:`French station FR606 in the European International LOFAR Telescope network.`,fr:`Station française FR606 du réseau européen International LOFAR Telescope.`},{en:`Two separate antenna systems: LBA 10-90 MHz and HBA 110-270 MHz; the 90-110 MHz interval is not an observing band.`,fr:`Deux systèmes d’antennes séparés : LBA 10-90 MHz et HBA 110-270 MHz ; l’intervalle 90-110 MHz n’est pas une bande d’observation.`},{en:`Signals are digitally delayed to form beams, then correlated with other LOFAR stations for imaging.`,fr:`Les signaux sont retardés numériquement pour former des faisceaux, puis corrélés avec les autres stations LOFAR pour l’imagerie.`}],image:n,alt:`LOFAR antenna field at Nançay`,tagline:{en:`A French station in a European software telescope, split into low and high bands.`,fr:`Une station française dans un télescope logiciel européen, séparée en bandes basse et haute.`},works:{en:`LOFAR is a distributed interferometer, not a single dish. At Nançay, FR606 has a low-band antenna field operating around 10-90 MHz and a high-band antenna field around 110-270 MHz, so LOFAR coverage is not continuous across 10-270 MHz. The gap matters operationally and scientifically: different antennas, receivers, calibration strategies, ionospheric effects, and radio-frequency-interference environments apply in the two bands. Digital delays form station beams; correlations between stations measure phase and amplitude on many baselines, converting timing information into angular structure.`,fr:`LOFAR est un interféromètre distribué, pas une parabole unique. À Nançay, FR606 possède un champ d’antennes basse bande autour de 10-90 MHz et un champ haute bande autour de 110-270 MHz : la couverture LOFAR n’est donc pas continue entre 10 et 270 MHz. Cette coupure compte techniquement et scientifiquement : antennes, récepteurs, calibration, effets ionosphériques et interférences radio diffèrent entre les deux bandes. Des retards numériques forment les faisceaux de station ; les corrélations entre stations mesurent phase et amplitude sur de nombreuses lignes de base, transformant le temps d’arrivée en structure angulaire.`},finds:[{en:`Diffuse synchrotron emission from relativistic electrons and magnetic fields in galaxies, jets, clusters, and supernova remnants.`,fr:`Émission synchrotron diffuse d’électrons relativistes et de champs magnétiques dans les galaxies, les jets, les amas et les restes de supernovae.`},{en:`Low-frequency time-domain science: pulsars, solar bursts, cosmic-ray air showers, radio transients, and propagation through ionized plasma.`,fr:`Science temporelle basse fréquence : pulsars, sursauts solaires, gerbes de rayons cosmiques, transitoires radio et propagation dans les plasmas ionisés.`},{en:`Cosmology targets: redshifted hydrogen from the Epoch of Reionization and large-scale cosmic magnetism.`,fr:`Cibles cosmologiques : hydrogène décalé vers le rouge de l’époque de réionisation et magnétisme cosmique à grande échelle.`}],physics:[`synchrotron`,`interferometry`,`pulsars`,`early 21 cm`],link:`https://www.obs-nancay.fr/lofar/`},{id:`nenufar`,name:`NenuFAR`,bandsMHz:[[10,85]],bandLabel:`10-85 MHz`,wavelengths:`3.5-30 m`,facts:[{en:`New Extension in Nançay Upgrading LOFAR, optimized for 10-85 MHz.`,fr:`New Extension in Nançay Upgrading LOFAR, optimisé pour 10-85 MHz.`},{en:`Not simply part of LOFAR: it is an autonomous telescope and can also act as a LOFAR super-station.`,fr:`Pas simplement une partie de LOFAR : c’est un télescope autonome qui peut aussi agir comme super-station LOFAR.`},{en:`Dense mini-array layout gives much higher low-band sensitivity at Nançay than a standard LOFAR station.`,fr:`Sa configuration dense en mini-réseaux donne à Nançay une sensibilité basse fréquence bien supérieure à celle d’une station LOFAR standard.`}],image:r,alt:`NenuFAR low-frequency antennas at Nançay`,tagline:{en:`A dense low-band array: autonomous telescope and LOFAR super-station.`,fr:`Un réseau basse bande dense : télescope autonome et super-station LOFAR.`},works:{en:`NenuFAR is a dense phased array built from many low-frequency antennas grouped into mini-arrays, optimized for 10-85 MHz. It overlaps LOFAR's low band, but its role is different: it can observe independently with multiple sensitive beams, produce low-frequency images on its own, and operate as a LOFAR super-station that greatly increases Nançay's collecting area in international LOFAR observations. In that super-station mode, NenuFAR is an extension/upgrading element for LOFAR; in autonomous mode, it is its own instrument.`,fr:`NenuFAR est un réseau phasé dense, construit avec de nombreuses antennes basse fréquence regroupées en mini-réseaux, optimisé pour 10-85 MHz. Il recouvre la basse bande de LOFAR, mais son rôle est différent : il peut observer de façon autonome avec plusieurs faisceaux sensibles, produire ses propres images basse fréquence et fonctionner comme super-station LOFAR en augmentant fortement la surface collectrice de Nançay dans les observations internationales LOFAR. Dans ce mode super-station, NenuFAR est une extension/amélioration de LOFAR ; en mode autonome, c’est un instrument à part entière.`},finds:[{en:`Cosmic Dawn: redshifted 21 cm hydrogen from the era when the first stars and galaxies changed the thermal and ionization state of the intergalactic medium.`,fr:`Aube cosmique : hydrogène à 21 cm décalé vers le rouge, provenant de l’époque où les premières étoiles et galaxies ont modifié l’état thermique et ionisé du milieu intergalactique.`},{en:`Planetary magnetism: coherent cyclotron-maser bursts from Jupiter-like planets and possible exoplanet magnetospheres.`,fr:`Magnétisme planétaire : sursauts cohérents de type maser cyclotron provenant de planètes de type Jupiter et de possibles magnétosphères d’exoplanètes.`},{en:`Low-frequency pulsars and transients, where dispersion and scattering reveal the plasma between the source and Earth.`,fr:`Pulsars et transitoires basse fréquence, où la dispersion et la diffusion révèlent le plasma entre la source et la Terre.`}],physics:[`early 21 cm`,`cyclotron maser`,`plasma emission`,`beamforming`],link:`https://nenufar.obs-nancay.fr/en/homepage-en/`},{id:`nrh`,name:`Radiohéliographe`,bandsMHz:[[150,450]],bandLabel:`150-450 MHz`,wavelengths:`0.67-2 m`,facts:[{en:`Dedicated solar radio interferometer.`,fr:`Interféromètre radio solaire dédié.`},{en:`Images the corona, not the visible solar surface.`,fr:`Image la couronne, pas la surface visible du Soleil.`},{en:`Measures where energetic electrons move during eruptions.`,fr:`Mesure où se déplacent les électrons énergétiques pendant les éruptions.`}],image:a,alt:`Nançay Radioheliograph solar radio array`,tagline:{en:`A radio camera for the solar corona.`,fr:`Une caméra radio pour la couronne solaire.`},works:{en:`The Radioheliograph is a specialized solar interferometer. Antennas distributed along a large T-shaped array observe the Sun simultaneously at several radio frequencies. Correlating the antennas produces radio images of the corona, where the emission is often generated by energetic electrons in magnetized plasma. Because the Sun changes quickly, the instrument is built for repeated, rapid imaging rather than deep static exposures.`,fr:`Le Radiohéliographe est un interféromètre solaire spécialisé. Des antennes réparties sur un grand réseau en T observent simultanément le Soleil à plusieurs fréquences radio. La corrélation des antennes produit des images radio de la couronne, où l’émission est souvent générée par des électrons énergétiques dans un plasma magnétisé. Comme le Soleil varie rapidement, l’instrument est conçu pour une imagerie répétée et rapide plutôt que pour des poses profondes et statiques.`},finds:[{en:`Solar flares and coronal mass ejections: radio maps locate particle acceleration and magnetic restructuring in the corona.`,fr:`Éruptions solaires et éjections de masse coronale : les cartes radio localisent l’accélération des particules et la restructuration magnétique dans la couronne.`},{en:`Space weather: radio bursts trace electron beams and shocks that can disturb satellites, GPS, communications, aviation, and power grids.`,fr:`Météo de l’espace : les sursauts radio tracent les faisceaux d’électrons et les chocs capables de perturber les satellites, le GPS, les communications, l’aviation et les réseaux électriques.`},{en:`Solar plasma physics: frequency maps correspond to different heights and plasma densities in the corona.`,fr:`Physique du plasma solaire : les cartes en fréquence correspondent à différentes hauteurs et densités de plasma dans la couronne.`}],physics:[`plasma emission`,`interferometry`,`space weather`],link:`https://www.obs-nancay.fr/radioheliographe/`},{id:`nda`,name:`Réseau décamétrique`,bandsMHz:[[10,100]],bandLabel:`10-100 MHz`,wavelengths:`3-30 m`,facts:[{en:`144 conical antennas observing decametric wavelengths.`,fr:`144 antennes coniques observant les longueurs d’onde décamétriques.`},{en:`Specialized in Jupiter and solar radio bursts.`,fr:`Spécialisé dans les sursauts radio de Jupiter et du Soleil.`},{en:`Long monitoring record since the late 1970s.`,fr:`Longue série de surveillance depuis la fin des années 1970.`}],image:e,alt:`Nançay Decameter Array conical antennas`,tagline:{en:`A long-running listener for Jupiter and the Sun.`,fr:`Une écoute longue durée de Jupiter et du Soleil.`},works:{en:`The Decameter Array is a phased array of 144 conical antennas. At 10-100 MHz, the wavelengths are so long that simple wire-like structures can act as efficient antennas. Electronic phasing selects directions on the sky, while spectrographs record intensity as a function of time and frequency. That time-frequency structure is central: Jupiter and the Sun produce bursts, arcs, drifts, and bands rather than quiet steady emission.`,fr:`Le Réseau décamétrique est un réseau phasé de 144 antennes coniques. À 10-100 MHz, les longueurs d’onde sont si grandes que des structures simples de type filaire peuvent servir d’antennes efficaces. Le phasage électronique sélectionne les directions du ciel, tandis que les spectrographes enregistrent l’intensité en fonction du temps et de la fréquence. Cette structure temps-fréquence est centrale : Jupiter et le Soleil produisent des sursauts, des arcs, des dérives et des bandes plutôt qu’une émission calme et constante.`},finds:[{en:`Jupiter’s decametric bursts: coherent emission from electrons moving in the planet’s strong magnetic field, often controlled by the moon Io.`,fr:`Sursauts décamétriques de Jupiter : émission cohérente d’électrons évoluant dans le champ magnétique intense de la planète, souvent contrôlée par la lune Io.`},{en:`Solar bursts: low-frequency signatures of electron beams, shocks, and coronal plasma structures.`,fr:`Sursauts solaires : signatures basse fréquence de faisceaux d’électrons, de chocs et de structures du plasma coronal.`},{en:`Monitoring: repeated observations build a long-term record of planetary and solar activity at frequencies strongly affected by Earth’s ionosphere.`,fr:`Surveillance : les observations répétées construisent une archive longue de l’activité planétaire et solaire à des fréquences fortement influencées par l’ionosphère terrestre.`}],physics:[`cyclotron emission`,`cyclotron maser`,`plasma emission`],link:`https://www.obs-nancay.fr/reseau-decametrique/`}],l=[{id:`thermal`,name:{en:`Thermal emission`,fr:`Émission thermique`},icon:`heat`,summary:{en:`Matter with a temperature radiates. In radio astronomy, this can trace warm ionized gas or hot plasma.`,fr:`Toute matière qui a une température rayonne. En radio, cela peut tracer du gaz ionisé chaud ou du plasma.`},science:{en:`Particles move randomly because they are hot. Charged particles that accelerate emit electromagnetic radiation. The emission tells us about temperature, density, and the state of the gas.`,fr:`Les particules bougent aléatoirement parce qu’elles sont chaudes. Les particules chargées accélérées émettent un rayonnement électromagnétique. L’émission renseigne sur la température, la densité et l’état du gaz.`},where:{en:`Young stellar environments, ionized nebulae, solar and astrophysical plasmas.`,fr:`Régions de formation stellaire, nébuleuses ionisées, plasmas solaires et astrophysiques.`},visual:{src:h(`Orion Nebula - Hubble 2006 mosaic 18000.jpg`),source:`https://commons.wikimedia.org/wiki/File:Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg`,label:`Orion Nebula, Hubble mosaic`,license:`NASA/ESA Hubble material, public-domain/copyright-free via Commons`}},{id:`freefree`,name:{en:`Free-free / Bremsstrahlung`,fr:`Libre-libre / Bremsstrahlung`},icon:`bend`,summary:{en:`An electron passes near an ion, gets deflected, and emits radiation because its motion changes.`,fr:`Un électron passe près d’un ion, sa trajectoire est déviée, et il émet parce que son mouvement change.`},science:{en:`The electron remains free before and after the encounter, hence free-free. The important physics is acceleration by an electric field.`,fr:`L’électron reste libre avant et après la rencontre, d’où le nom libre-libre. La physique clé est l’accélération par un champ électrique.`},where:{en:`H II regions around young stars, stellar winds, the solar corona.`,fr:`Régions H II autour des jeunes étoiles, vents stellaires, couronne solaire.`},visual:{src:h(`Bremsstrahlung.svg`),source:`https://commons.wikimedia.org/wiki/File:Bremsstrahlung.svg`,label:`Bremsstrahlung schematic`,license:`Wikimedia Commons free media`}},{id:`synchrotron`,name:{en:`Synchrotron emission`,fr:`Rayonnement synchrotron`},icon:`spiral`,summary:{en:`Relativistic electrons spiral around magnetic-field lines and radiate.`,fr:`Des électrons relativistes spiralent autour des lignes de champ magnétique et rayonnent.`},science:{en:`This is why radio images can reveal cosmic rays and magnetic fields across galaxies, jets, and galaxy clusters. It is one of radio astronomy’s most powerful hidden-process tracers.`,fr:`C’est pour cela que les images radio révèlent les rayons cosmiques et les champs magnétiques des galaxies, des jets et des amas. C’est un traceur majeur des processus invisibles.`},where:{en:`LOFAR observations of galaxies, clusters, supernova remnants, radio jets.`,fr:`Observations LOFAR de galaxies, d’amas, de restes de supernovae et de jets radio.`},visual:{src:h(`Crab Nebula Supernova Remnant (Spitzer IRAC-MIPS Image).jpg`),source:`https://commons.wikimedia.org/wiki/File:Crab_Nebula_Supernova_Remnant_(Spitzer_IRAC-MIPS_Image).jpg`,label:`Crab Nebula synchrotron radiation`,license:`NASA public domain via Wikimedia Commons`}},{id:`cyclotron`,name:{en:`Cyclotron emission`,fr:`Émission cyclotron`},icon:`orbit`,summary:{en:`Slower electrons orbit magnetic-field lines and emit at frequencies tied to magnetic-field strength.`,fr:`Des électrons plus lents orbitent autour des lignes de champ et émettent à des fréquences liées à l’intensité du champ magnétique.`},science:{en:`This process is especially useful for planets because it gives a direct radio handle on magnetospheres.`,fr:`Ce processus est particulièrement utile pour les planètes, car il donne un accès radio direct aux magnétosphères.`},where:{en:`Jupiter, planetary magnetospheres, possibly magnetized exoplanets.`,fr:`Jupiter, magnétosphères planétaires, possiblement exoplanètes magnétisées.`},visual:{src:h(`Hubble provides complete view of Jupiter's auroras (opo9804a).jpg`),source:`https://commons.wikimedia.org/wiki/File:Hubble_provides_complete_view_of_Jupiter%27s_auroras_(opo9804a).jpg`,label:`Jupiter aurorae, Hubble`,license:`NASA/ESA Hubble public-domain/copyright-free via Commons`}},{id:`maser`,name:{en:`Cyclotron maser`,fr:`Maser cyclotron`},icon:`burst`,summary:{en:`Electrons emit coherently, making a burst far stronger than independent particle emission.`,fr:`Les électrons émettent de façon cohérente, créant un sursaut beaucoup plus intense qu’une émission indépendante.`},science:{en:`It is laser-like in spirit, but at radio wavelengths. This explains why Jupiter can be such a powerful decametric radio source.`,fr:`L’idée ressemble à un laser, mais en ondes radio. Cela explique pourquoi Jupiter peut être une source radio décamétrique si puissante.`},where:{en:`Jupiter, auroral planets, searches for exoplanet magnetic fields with NenuFAR/LOFAR.`,fr:`Jupiter, planètes aurorales, recherches de champs magnétiques d’exoplanètes avec NenuFAR/LOFAR.`},visual:{src:h(`Jupiter magnetosphere schematic.jpg`),source:`https://commons.wikimedia.org/wiki/File:Jupiter_magnetosphere_schematic.jpg`,label:`Jupiter magnetosphere schematic`,license:`Wikimedia Commons free media`}},{id:`hydrogen`,name:{en:`21 cm hydrogen`,fr:`Hydrogène à 21 cm`},icon:`atom`,summary:{en:`Neutral hydrogen emits a weak but fundamental spectral line at 1420 MHz.`,fr:`L’hydrogène neutre émet une raie spectrale faible mais fondamentale à 1420 MHz.`},science:{en:`One atom emits rarely, but galaxies contain so much hydrogen that the signal becomes detectable. The Doppler shift maps gas velocity and galaxy rotation.`,fr:`Un atome émet rarement, mais les galaxies contiennent tellement d’hydrogène que le signal devient détectable. Le décalage Doppler cartographie la vitesse du gaz et la rotation des galaxies.`},where:{en:`NRT maps neutral gas in galaxies; NenuFAR/LOFAR search for the redshifted line from the early Universe.`,fr:`Le NRT cartographie le gaz neutre des galaxies ; NenuFAR/LOFAR cherchent la raie décalée vers le rouge de l’Univers jeune.`},visual:{src:h(`Hydrogen-SpinFlip.svg`),source:`https://commons.wikimedia.org/wiki/File:Hydrogen-SpinFlip.svg`,label:`Hydrogen spin-flip transition`,license:`Wikimedia Commons free media`}},{id:`molecules`,name:{en:`Molecular lines`,fr:`Raies moléculaires`},icon:`molecule`,summary:{en:`Molecules rotate and change rotational state, emitting photons at precise radio frequencies.`,fr:`Les molécules tournent et changent d’état rotationnel, en émettant des photons à des fréquences radio précises.`},science:{en:`Radio spectroscopy lets astronomers identify molecules such as carbon monoxide, ammonia, water, and OH. It is chemistry across interstellar space.`,fr:`La spectroscopie radio permet d’identifier des molécules comme le monoxyde de carbone, l’ammoniac, l’eau ou OH. C’est de la chimie à l’échelle interstellaire.`},where:{en:`Molecular clouds, comets, evolved-star envelopes, star-forming regions.`,fr:`Nuages moléculaires, comètes, enveloppes d’étoiles évoluées, régions de formation stellaire.`},visual:{src:h(`Molecular energy levels en.svg`),source:`https://commons.wikimedia.org/wiki/File:Molecular_energy_levels_en.svg`,label:`Molecular energy levels`,license:`Wikimedia Commons free media`}},{id:`pulsars`,name:{en:`Pulsars`,fr:`Pulsars`},icon:`pulse`,summary:{en:`Rotating neutron stars send beams of radio waves across space like lighthouse beams.`,fr:`Des étoiles à neutrons en rotation projettent des faisceaux radio comme des phares cosmiques.`},science:{en:`Each pulse arrival can be timed with extreme precision. Some pulsars rival atomic clocks, making them probes of gravity, dense matter, and the interstellar medium.`,fr:`Chaque impulsion peut être chronométrée avec une précision extrême. Certains pulsars rivalisent avec les horloges atomiques, ce qui en fait des sondes de la gravité, de la matière dense et du milieu interstellaire.`},where:{en:`Nançay’s decimetric telescope is a major European pulsar-timing facility.`,fr:`Le radiotélescope décimétrique de Nançay est un grand instrument européen de chronométrage de pulsars.`},visual:{src:h(`Vela pulsar - Chandra, animation.gif`),source:`https://commons.wikimedia.org/wiki/File:Vela_pulsar_-_Chandra,_animation.gif`,label:`Vela pulsar animation`,license:`NASA public domain via Wikimedia Commons`}},{id:`plasma`,name:{en:`Solar plasma emission`,fr:`Émission plasma solaire`},icon:`sun`,summary:{en:`Energetic electrons moving through plasma generate radio waves during flares and eruptions.`,fr:`Des électrons énergétiques traversant un plasma produisent des ondes radio lors des éruptions.`},science:{en:`Radio solar observations often show energetic particles and magnetic restructuring in the corona, not just the visible solar surface.`,fr:`Les observations solaires radio montrent souvent les particules énergétiques et la restructuration magnétique dans la couronne, pas seulement la surface visible.`},where:{en:`Radioheliograph, Decameter Array, NenuFAR solar observations.`,fr:`Radiohéliographe, Réseau décamétrique, observations solaires avec NenuFAR.`},visual:{src:h(`SDO first light.png`),source:`https://commons.wikimedia.org/wiki/File:SDO_first_light.png`,label:`Solar Dynamics Observatory EUV Sun`,license:`NASA public domain via Wikimedia Commons`}}],u={thermal:{src:h(`Blackbody radiation.svg`),source:`https://commons.wikimedia.org/wiki/File:Blackbody_radiation.svg`,label:`Blackbody radiation curve`,license:`CC0 public-domain dedication via Wikimedia Commons`},freefree:{src:h(`Bremsstrahlung.svg`),source:`https://commons.wikimedia.org/wiki/File:Bremsstrahlung.svg`,label:`Bremsstrahlung deflection schematic`,license:`Wikimedia Commons free media`},synchrotron:{src:h(`Undulator (english).svg`),source:`https://commons.wikimedia.org/wiki/File:Undulator_(english).svg`,label:`Electron radiation in a magnetic structure`,license:`Wikimedia Commons free media`},cyclotron:{src:h(`Cyclotron motion.jpg`),source:`https://commons.wikimedia.org/wiki/File:Cyclotron_motion.jpg`,label:`Electron cyclotron motion in a magnetic field`,license:`CC BY-SA / GFDL via Wikimedia Commons`},maser:{src:h(`Jupiter magnetosphere schematic.jpg`),source:`https://commons.wikimedia.org/wiki/File:Jupiter_magnetosphere_schematic.jpg`,label:`Jupiter magnetosphere schematic`,license:`Wikimedia Commons free media`},hydrogen:{src:h(`Hydrogen-SpinFlip.svg`),source:`https://commons.wikimedia.org/wiki/File:Hydrogen-SpinFlip.svg`,label:`Hydrogen spin-flip transition`,license:`Wikimedia Commons free media`},molecules:{src:h(`Molecular energy levels en.svg`),source:`https://commons.wikimedia.org/wiki/File:Molecular_energy_levels_en.svg`,label:`Molecular energy levels`,license:`Wikimedia Commons free media`},pulsars:{src:h(`Pulsar schematic transparent.svg`),source:`https://commons.wikimedia.org/wiki/File:Pulsar_schematic_transparent.svg`,label:`Pulsar beam schematic`,license:`Public domain via Wikimedia Commons`},plasma:{src:h(`Surface plasmon.gif`),source:`https://commons.wikimedia.org/wiki/File:Surface_plasmon.gif`,label:`Plasma oscillation animation`,license:`Wikimedia Commons free media`}},ee={thermal:{src:h(`Orion Nebula - Hubble 2006 mosaic 18000.jpg`),source:`https://commons.wikimedia.org/wiki/File:Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg`,label:`Orion Nebula, Hubble mosaic`,license:`NASA/ESA Hubble material, public-domain/copyright-free via Commons`},freefree:{src:h(`WHAM survey.png`),source:`https://commons.wikimedia.org/wiki/File:WHAM_survey.png`,label:`Milky Way ionized gas survey`,license:`Wikimedia Commons free media`},synchrotron:{src:h(`Crab Nebula Supernova Remnant (Spitzer IRAC-MIPS Image).jpg`),source:`https://commons.wikimedia.org/wiki/File:Crab_Nebula_Supernova_Remnant_(Spitzer_IRAC-MIPS_Image).jpg`,label:`Crab Nebula synchrotron source`,license:`NASA public domain via Wikimedia Commons`},cyclotron:{src:h(`Hubble provides complete view of Jupiter's auroras (opo9804a).jpg`),source:`https://commons.wikimedia.org/wiki/File:Hubble_provides_complete_view_of_Jupiter%27s_auroras_(opo9804a).jpg`,label:`Jupiter aurorae, Hubble`,license:`NASA/ESA Hubble public-domain/copyright-free via Commons`},maser:{src:h(`Hubble provides complete view of Jupiter's auroras (opo9804a).jpg`),source:`https://commons.wikimedia.org/wiki/File:Hubble_provides_complete_view_of_Jupiter%27s_auroras_(opo9804a).jpg`,label:`Jupiter aurorae, a cyclotron-maser environment`,license:`NASA/ESA Hubble public-domain/copyright-free via Commons`},hydrogen:{src:h(`Neutral hydrogen.gif`),source:`https://commons.wikimedia.org/wiki/File:Neutral_hydrogen.gif`,label:`Galactic neutral hydrogen map`,license:`NASA public domain via Wikimedia Commons`},molecules:{src:h(`Plank Molecular Clouds.jpg`),source:`https://commons.wikimedia.org/wiki/File:Plank_Molecular_Clouds.jpg`,label:`Planck carbon-monoxide molecular clouds`,license:`ESA/Planck material via Wikimedia Commons`},pulsars:{src:h(`Vela pulsar - Chandra, animation.gif`),source:`https://commons.wikimedia.org/wiki/File:Vela_pulsar_-_Chandra,_animation.gif`,label:`Vela pulsar Chandra animation`,license:`NASA public domain via Wikimedia Commons`},plasma:{src:h(`SDO first light.png`),source:`https://commons.wikimedia.org/wiki/File:SDO_first_light.png`,label:`Solar Dynamics Observatory EUV Sun`,license:`NASA public domain via Wikimedia Commons`}},te=[[`Observatoire de Nançay`,`https://www.obs-nancay.fr/`],[`Radiotélescope décimétrique`,`https://www.obs-nancay.fr/radiotelescope-decimetrique/`],[`LOFAR at Nançay`,`https://www.obs-nancay.fr/lofar/`],[`NenuFAR`,`https://nenufar.obs-nancay.fr/en/homepage-en/`],[`Radiohéliographe`,`https://www.obs-nancay.fr/radioheliographe/`],[`Réseau décamétrique`,`https://www.obs-nancay.fr/reseau-decametrique/`],[`NASA electromagnetic spectrum`,`https://science.nasa.gov/ems/05_radiowaves`]],d=`en`,f=`nenufar`,p=`synchrotron`;function m(e){return e[d]}function ne(e){return 299.792458/e}function re(e){return e>=1?`${e.toFixed(e>=10?1:2)} m`:`${(e*100).toFixed(1)} cm`}function h(e){return`https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(e.replaceAll(` `,`_`))}?width=900`}function ie(e){return c.filter(t=>t.bandsMHz.some(([t,n])=>e>=t&&e<=n))}function ae(e){return`${e.bandLabel} · ${e.wavelengths}`}o.innerHTML=`
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
    <section class="hero" style="--hero-image: url('${i}')">
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
        <p data-copy-en="Important distinction: LOFAR FR606 is a station of the European LOFAR interferometer with separate low and high bands. NenuFAR overlaps the LOFAR low band but is a distinct Nançay instrument that can run autonomously or as a LOFAR super-station."
          data-copy-fr="Distinction importante : LOFAR FR606 est une station de l’interféromètre européen LOFAR avec des bandes basse et haute séparées. NenuFAR recouvre la basse bande de LOFAR, mais c’est un instrument distinct de Nançay, capable de fonctionner seul ou comme super-station LOFAR."></p>
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
          <p class="fine-print" data-copy-en="λ = c / f · LOFAR is split into 10-90 and 110-270 MHz, so the slider intentionally shows a LOFAR gap."
            data-copy-fr="λ = c / f · LOFAR est séparé en 10-90 et 110-270 MHz ; le curseur montre donc volontairement une coupure LOFAR."></p>
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
                <strong>NenuFAR: <span data-copy-en="10-85 MHz" data-copy-fr="10-85 MHz"></span></strong>
                <span data-copy-en="Autonomous dense array and LOFAR super-station." data-copy-fr="Réseau dense autonome et super-station LOFAR."></span>
              </div>
              <div class="spectrum-callout visible-callout">
                <strong data-copy-en="LOFAR FR606: 10-90 + 110-270 MHz" data-copy-fr="LOFAR FR606 : 10-90 + 110-270 MHz"></strong>
                <span data-copy-en="Low and high antenna bands separated by a gap." data-copy-fr="Bandes d’antennes basse et haute séparées par une coupure."></span>
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
          <img src="${t}" alt="Static explanatory diagram of radio interferometry delays" />
        </article>
      </div>
    </section>

    <section class="section-block final-section">
      <div class="section-header">
        <span class="section-kicker" data-copy-en="Synthesis" data-copy-fr="Synthèse"></span>
        <h2 data-copy-en="Together, what do these instruments discover?" data-copy-fr="Ensemble, que permettent-ils de découvrir ?"></h2>
      </div>
      <div class="synthesis-grid">
        ${[[`Gas reservoir`,`Réservoir de gaz`,`Neutral hydrogen shows the raw material of future stars.`,`L’hydrogène neutre montre la matière première des futures étoiles.`],[`Magnetic Universe`,`Univers magnétique`,`Synchrotron and cyclotron emission reveal fields that optical light barely shows.`,`Le synchrotron et le cyclotron révèlent des champs que l’optique montre difficilement.`],[`Plasma weather`,`Météo des plasmas`,`Solar radio emission tracks energetic particles that affect space technology.`,`L’émission radio solaire suit les particules énergétiques qui affectent les technologies spatiales.`],[`Cosmic clocks`,`Horloges cosmiques`,`Pulsars test dense matter, gravity, and nanohertz gravitational-wave backgrounds.`,`Les pulsars testent la matière dense, la gravité et les fonds d’ondes gravitationnelles nanohertz.`],[`Planetary shields`,`Boucliers planétaires`,`Jupiter and possible exoplanet radio bursts probe magnetospheres.`,`Jupiter et les possibles sursauts d’exoplanètes sondent les magnétosphères.`],[`Cosmic Dawn`,`Aube cosmique`,`Redshifted hydrogen may reveal the first stars and galaxies switching on.`,`L’hydrogène décalé vers le rouge peut révéler l’allumage des premières étoiles et galaxies.`]].map(([e,t,n,r])=>`
              <article class="panel synthesis-card">
                <h3 data-copy-en="${e}" data-copy-fr="${t}"></h3>
                <p data-copy-en="${n}" data-copy-fr="${r}"></p>
              </article>
            `).join(``)}
      </div>
    </section>

    <section class="section-block sources-section">
      <div class="section-header">
        <span class="section-kicker" data-copy-en="Links" data-copy-fr="Liens"></span>
        <h2 data-copy-en="Sources and further reading" data-copy-fr="Sources et lectures utiles"></h2>
      </div>
      <ul class="source-list">
        ${te.map(([e,t])=>`<li><a href="${t}" target="_blank" rel="noreferrer">${e}</a></li>`).join(``)}
      </ul>
    </section>

    <footer class="site-footer">
      <p>© Nefinia</p>
      <a href="../index.html" aria-label="Home">
        <img src="../assets/images/cosmovision.png" alt="" />
      </a>
    </footer>
  </main>
`;var g=document.querySelectorAll(`.lang-button`),_=document.querySelector(`#frequency-slider`),v=document.querySelector(`#frequency-readout`),y=document.querySelector(`#wavelength-readout`),b=document.querySelector(`#instrument-readout-card`),x=document.querySelector(`#instrument-readout`),S=document.querySelector(`#frequency-explanation`),oe=document.querySelector(`#spectrum-marker`),C=document.querySelector(`#mechanism-buttons`),w=document.querySelector(`#mechanism-process-image`),T=document.querySelector(`#mechanism-process-label`),E=document.querySelector(`#mechanism-process-license`),D=document.querySelector(`#mechanism-process-link`),O=document.querySelector(`#mechanism-source-image`),k=document.querySelector(`#mechanism-source-label`),A=document.querySelector(`#mechanism-source-license`),j=document.querySelector(`#mechanism-source-link`),M=document.querySelector(`#mechanism-tag`),N=document.querySelector(`#mechanism-name`),P=document.querySelector(`#mechanism-summary`),F=document.querySelector(`#mechanism-science`),I=document.querySelector(`#mechanism-where`),L=document.querySelector(`#instrument-tabs`),R=document.querySelector(`#instrument-image`),z=document.querySelector(`#instrument-band`),B=document.querySelector(`#instrument-name`),V=document.querySelector(`#instrument-tagline`),H=document.querySelector(`#instrument-facts`),se=document.querySelector(`#instrument-works`),U=document.querySelector(`#instrument-finds`),W=document.querySelector(`#instrument-link`),G=document.querySelector(`#baseline-slider`),K=document.querySelector(`#lambda-slider`),q=document.querySelector(`#angle-slider`),J=document.querySelector(`#baseline-readout`),Y=document.querySelector(`#lambda-readout`),ce=document.querySelector(`#angle-readout`),le=document.querySelector(`#delay-readout`),ue=document.querySelector(`#resolution-readout`),X=document.querySelector(`#interferometry-canvas`);if(!_||!v||!y||!b||!x||!S||!oe||!C||!w||!T||!E||!D||!O||!k||!A||!j||!M||!N||!P||!F||!I||!L||!R||!z||!B||!V||!H||!se||!U||!W||!G||!K||!q||!J||!Y||!ce||!le||!ue||!X)throw Error(`UI initialization failed.`);function de(){document.documentElement.lang=d,document.title=d===`en`?`Nançay Radio Observatory`:`Observatoire radioastronomique de Nançay`,document.querySelectorAll(`[data-i18n]`).forEach(e=>{e.textContent=s[e.dataset.i18n]?.[d]??``}),document.querySelectorAll(`[data-copy-en]`).forEach(e=>{e.textContent=e.dataset[d===`en`?`copyEn`:`copyFr`]??``}),g.forEach(e=>{e.classList.toggle(`is-active`,e.dataset.lang===d)})}function Z(){C.innerHTML=``,l.forEach(e=>{let t=document.createElement(`button`);t.type=`button`,t.className=`mechanism-button ${e.id===p?`is-active`:``}`,t.textContent=m(e.name),t.setAttribute(`role`,`tab`),t.setAttribute(`aria-selected`,`${e.id===p}`),t.addEventListener(`click`,()=>{p=e.id,fe(),Z()}),C.appendChild(t)})}function fe(){let e=l.find(e=>e.id===p)??l[0],t=u[e.id],n=ee[e.id]??e.visual;M.textContent=d===`en`?`Emission mechanism`:`Mécanisme d’émission`,N.textContent=m(e.name),P.textContent=m(e.summary),F.textContent=m(e.science),I.textContent=m(e.where),w.src=t.src,w.alt=t.label,T.textContent=t.label,E.textContent=t.license,D.href=t.source,O.src=n.src,O.alt=n.label,k.textContent=n.label,A.textContent=n.license,j.href=n.source}function pe(){L.innerHTML=``,c.forEach(e=>{let t=document.createElement(`button`);t.type=`button`,t.className=`instrument-tab ${e.id===f?`is-active`:``}`,t.innerHTML=`<strong>${e.name}</strong><span>${e.bandLabel}</span>`,t.addEventListener(`click`,()=>{f=e.id,me(),pe()}),L.appendChild(t)})}function me(){let e=c.find(e=>e.id===f)??c[0];R.src=e.image,R.alt=e.alt,z.textContent=ae(e),B.textContent=e.name,V.textContent=m(e.tagline),H.innerHTML=e.facts.map(e=>`<p>${m(e)}</p>`).join(``),se.textContent=m(e.works),U.innerHTML=e.finds.map(e=>`<li>${m(e)}</li>`).join(``),W.href=e.link}function he(){let e=Number(_.value),t=ne(e),n=ie(e),r=(Math.log10(e)-Math.log10(10))/(Math.log10(3500)-Math.log10(10))*36;if(v.textContent=e>=1e3?`${(e/1e3).toFixed(2)} GHz`:`${e.toFixed(0)} MHz`,y.textContent=re(t),oe.style.left=`${Math.max(0,Math.min(100,r))}%`,n.length){let e=[...new Set(n.flatMap(e=>e.physics))];b.hidden=!1,x.textContent=n.map(e=>e.name).join(`, `),S.textContent=d===`en`?`At this frequency, these Nançay instruments can observe: ${n.map(e=>`${e.name} (${e.bandLabel})`).join(`, `)}. The science shifts toward: ${e.join(`, `)}.`:`À cette fréquence, ces instruments de Nançay peuvent observer : ${n.map(e=>`${e.name} (${e.bandLabel})`).join(`, `)}. La science se déplace vers : ${e.join(`, `)}.`,S.hidden=!1}else b.hidden=!0,x.textContent=``,S.textContent=``,S.hidden=!0}function ge(e){return e*206264.806}function Q(){let e=Number(G.value),t=Number(K.value),n=Number(q.value),r=n*Math.PI/180,i=e*1e3,a=i*Math.sin(r)/299792458,o=ge(t/i);J.textContent=`${e.toFixed(0)} km`,Y.textContent=re(t),ce.textContent=`${n.toFixed(0)}°`,le.textContent=`${(a*1e6).toFixed(2)} µs`,ue.textContent=o>=1?`${o.toFixed(2)} arcsec`:`${(o*1e3).toFixed(1)} mas`,_e(r)}function _e(e){let t=X.getContext(`2d`);if(!t)return;let n=window.devicePixelRatio||1,r=Math.max(320,Math.floor(X.getBoundingClientRect().width)),i=Math.round(r*.62);X.width=r*n,X.height=i*n,X.style.height=`${i}px`,t.setTransform(n,0,0,n,0,0),t.clearRect(0,0,r,i),t.fillStyle=`#f7f3ea`,t.fillRect(0,0,r,i);let a=i*.76,o=r*.32,s=r*.68,c=-Math.PI/2+e,l=Math.cos(c),u=Math.sin(c);t.strokeStyle=`#b8cad0`,t.lineWidth=2;for(let n=-4;n<=8;n+=1){let a=r*.5+n*54+Math.sin(e)*35,o=i*.08;t.beginPath(),t.moveTo(a-u*360,o+l*360),t.lineTo(a+u*360,o-l*360),t.stroke()}t.strokeStyle=`#263b42`,t.lineWidth=4,t.beginPath(),t.moveTo(40,a),t.lineTo(r-40,a),t.stroke(),[o,s].forEach(e=>{t.strokeStyle=`#24526a`,t.lineWidth=8,t.beginPath(),t.moveTo(e,a),t.lineTo(e,a-80),t.moveTo(e,a-78),t.lineTo(e-48,a-128),t.moveTo(e,a-78),t.lineTo(e+48,a-128),t.stroke(),t.fillStyle=`#2f6f73`,t.beginPath(),t.arc(e,a-82,12,0,Math.PI*2),t.fill()}),t.strokeStyle=`#be6a2f`,t.lineWidth=5,t.beginPath(),t.moveTo(r*.16,i*.16),t.lineTo(r*.16+l*135,i*.16+u*135),t.stroke(),t.fillStyle=`#be6a2f`,t.beginPath(),t.arc(r*.16+l*135,i*.16+u*135,8,0,Math.PI*2),t.fill(),t.fillStyle=`#123143`,t.font=`600 14px Inter, system-ui, sans-serif`,t.fillText(d===`en`?`incoming wavefronts`:`fronts d’onde entrants`,24,34),t.fillText(d===`en`?`baseline B`:`ligne de base B`,r*.45,a+30)}function $(){de(),Z(),fe(),pe(),me(),he(),Q()}g.forEach(e=>{e.addEventListener(`click`,()=>{d=e.dataset.lang===`fr`?`fr`:`en`,$()})}),_.addEventListener(`input`,he),G.addEventListener(`input`,Q),K.addEventListener(`input`,Q),q.addEventListener(`input`,Q),window.addEventListener(`resize`,()=>{Q()}),$();