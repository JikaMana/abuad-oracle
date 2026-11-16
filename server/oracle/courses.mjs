// @ts-nocheck
const GENERIC_RULES = `No past-question PDF has been loaded for this course yet. Write questions from the standard first-year (100-level) university syllabus for the course and topics named. Keep them at the difficulty of Nigerian university CBT exams, especially ABUAD 100-level papers. Do not claim they are past questions.`;

export const COURSES = {
  "MTH 101": {
    label: "MTH 101",
    name: "Mathematics",
    grounded: true,
    topics: [
      "Complex numbers",
      "Sequences and series",
      "Quadratic equations",
      "Sets",
      "Number systems",
    ],
    source: `ABUAD MTH 101 practice drawn from the supplied assignment (PDFs/final_pq.pdf).

Use these patterns and difficulty, and write fresh numbers unless you are explicitly returning a known item:
- Complex numbers: z1 = 7 + 3i, z2 = 4 - 2i, sums, products, real and imaginary parts.
- Sequences: a six-term GP with first term 192 and ratio 1.5; arithmetic series with a stated difference.
- Quadratics: x^2 - 4x - 6 = 0 has roots 2 ± sqrt(10); roots of x^2 - x + 1 = 0 satisfy x^3 = -1.
- Sets: symmetric difference, unions and intersections.
- Number systems: five consecutive integers summing to 100 start at 18; the even numbers from 100 to 998 sum to 247050.

Do not claim a newly invented question is a verbatim past question. Matrices are not on this topic list.`,
  },
  "MTH 103": {
    label: "MTH 103",
    name: "Mathematics",
    grounded: false,
    topics: [
      "Functions and graphs",
      "Limits and continuity",
      "Differentiation",
      "Integration",
      "Trigonometry",
      "Coordinate geometry",
    ],
    source: GENERIC_RULES,
  },
  "PHY 101": {
    label: "PHY 101",
    name: "Mechanics",
    grounded: true,
    topics: [
      "Measurement in Physics",
      "Space and Time",
      "Units and Dimension",
      "Kinematics",
      "Fundamental Laws of Mechanics",
      "Statics and Dynamics",
      "Work and Energy",
      "Conservation laws",
    ],
    source: `ABUAD PHY 101 General Physics I (Mechanics), Ajiboye and Badmus lecture notes. Course outline only.

- Measurement in Physics: a fundamental quantity is not defined from other quantities. In mechanics the base quantities are length, mass and time. Unit systems: CGS, FPS, MKS and SI. SI has seven base units: metre, kilogram, second, ampere, kelvin, mole, candela.
- Space and Time: scalars have magnitude only (mass, time, speed). Vectors have magnitude and direction (force, velocity, acceleration). Ax = A cos θ, Ay = A sin θ. Magnitude is sqrt(Ax² + Ay²). A unit vector has magnitude 1. Dot product AB cos θ is a scalar. Cross product has magnitude AB sin θ.
- Units and Dimension: in mechanics the base dimensions are [L], [M] and [T]. A dimensional formula relates a derived unit to those. Use it to check homogeneity and to derive a relation. It cannot find a dimensionless constant, it fails if more than M, L and T are involved, and it does not apply to trig, exponential or log functions.
- Kinematics: motion without the cause. Displacement Δx = x2 − x1. Average velocity = Δx/Δt. v = u + at, s = ut + ½at², v² = u² + 2as. Projectile range is maximum at 45° to the horizontal.
- Fundamental Laws of Mechanics: Newton's first law (zero net force means zero acceleration), second law F = ma, third law (equal and opposite forces on two different bodies).
- Statics and Dynamics: dynamics is motion caused by force. Force types include contact force, tension, normal force (perpendicular to the surface), weight W = mg, and friction opposing sliding. Net force is the vector sum. Equilibrium means zero net force.
- Work and Energy: work is force times displacement in the direction of the force. Mechanical energy is kinetic plus potential.
- Conservation laws: mechanical energy is conserved when only conservative forces do work. In a closed isolated system, total linear momentum stays constant.

Do not claim a newly invented question is a verbatim past question.`,
  },
  "PHY 103": {
    label: "PHY 103",
    name: "Properties of Matter",
    grounded: true,
    topics: [
      "Elasticity",
      "Hydrostatics",
      "Temperature and heat",
      "Heat transfer",
      "Laws of thermodynamics",
      "Kinetic theory of gases",
    ],
    source: `ABUAD PHY 103 Properties of Matter lecture notes. Not electricity or magnetism.

- Elasticity: a material regains shape after the distorting force is removed, up to the elastic limit. Beyond that is the yield point, then the breaking point. Hooke's law: within the elastic limit, F = ke. Stress = F/A. Strain = extension / original length. Elastic modulus = stress / strain. Young's modulus is for change of length, shear modulus for change of shape, bulk modulus for change of volume.
- Hydrostatics: density = mass/volume. Specific gravity is density relative to water. Pressure in a liquid increases with depth, P = ρgh. Archimedes: upthrust equals the weight of fluid displaced. Surface tension, adhesion, cohesion and capillarity.
- Temperature and heat: temperature scales, including 0°C = 273 K. Thermal expansion. Heat capacity and phase change. Q = mcΔT when there is no change of state.
- Heat transfer: conduction through a material without bulk flow, convection by movement of a fluid, radiation with no material medium required. The notes spell convection as "convention"; use convection.
- Laws of thermodynamics: zeroth law (bodies in thermal equilibrium with a third are in equilibrium with each other). First law in these notes: ΔQ = ΔU + ΔW. Constant volume: ΔW = 0 so ΔQ = ΔU. Ideal-gas isothermal change: ΔU = 0 so ΔQ = ΔW. Adiabatic: ΔQ = 0 so 0 = ΔU + ΔW.
- Kinetic theory of gases: gas laws (Boyle, Charles) and the kinetic model. Pressure comes from molecular collisions. For an ideal gas, PV = nRT and average kinetic energy rises with temperature.

Do not claim a newly invented question is a verbatim past question.`,
  },
  STAT: {
    label: "STAT",
    name: "Statistics",
    grounded: false,
    topics: [
      "Descriptive statistics",
      "Probability",
      "Random variables",
      "Binomial and Poisson",
      "Normal distribution",
      "Correlation and regression",
    ],
    source: GENERIC_RULES,
  },
  "CHM 101": {
    label: "CHM 101",
    name: "Chemistry",
    grounded: true,
    topics: [
      "Gases",
      "Atomic structure",
      "Chemical kinetics",
      "Atoms, molecules and ions",
      "Periodic table",
      "Stoichiometry",
      "Radioactivity",
      "Chemical bonding",
      "Thermochemistry",
      "Acids, bases and pH",
    ],
    source: `ABUAD CHM 101 lecture notes. Use these chapter topics only.

- Gases: compressibility, Boyle, Charles, the ideal-gas equation, STP, kinetic theory, Maxwell–Boltzmann distribution.
- Atomic structure: waves and wave-particle duality, atomic spectra, quantum theory, photoelectric effect, Bohr atom and its limits, uncertainty principle, quantum numbers and electron configurations.
- Chemical kinetics: rate of reaction, rate laws, order with respect to a reactant. Order is not read off the balanced equation.
- Atoms, molecules and ions: particulate matter, atomic theory, isotopes, molecules and chemical formulas.
- Periodic table: arrangement by atomic number, electronic configuration, periodic trends, electron affinity.
- Stoichiometry: atomic mass, the mole, chemical equations and reacting masses.
- Radioactivity: nuclear decay, alpha (helium nucleus), beta and gamma, half-life, binding energy.
- Chemical bonding: Lewis and Kossel, ionic, covalent, dative (coordinate) and hydrogen bonding.
- Thermochemistry: exothermic and endothermic changes, the first law, standard enthalpy, Hess's law, Born–Haber cycle, mean bond energy.
- Acids, bases and pH: Arrhenius, Brønsted–Lowry, pH, buffers and indicators.

Do not claim a newly invented question is a verbatim past question.`,
  },
  "BIO 101": {
    label: "BIO 101",
    name: "Biology",
    grounded: true,
    topics: [
      "Cell structure and organization",
      "Classification of living things",
      "Cell division",
      "Genetics",
      "Tissues",
      "Reproduction",
    ],
    source: `ABUAD BIO 101 lecture notes. Stay inside these sections.

- Cell structure and organization: the cell is the basic unit of structure and function. Cell biology covers structure, function and molecules of the cell. Compare prokaryotic and eukaryotic cells. Organelles include the nucleus, membrane, ribosomes, mitochondria and lysosomes.
- Classification of living things: characteristics remembered as MR.NIGER D (movement, respiration, nutrition, irritability, growth, excretion, reproduction, death). Five kingdoms. Binomial nomenclature. Hierarchy: kingdom, phylum, class, order, family, genus, species. Parasites live on or in a host; predation is a different feeding relationship.
- Cell division: binary fission, mitosis and meiosis. The cell cycle has G1, S and G2. Mitosis (prophase, metaphase, anaphase, telophase) keeps the chromosome number the same and is used for growth and repair. Meiosis halves the chromosome number and produces genetic variation.
- Genetics: Mendel's pea experiments. Law of segregation and law of independent assortment. Dominant and recessive alleles. Chromosomal theory of inheritance. X-linkage.
- Tissues: a tissue is a group of similar cells with one function. Four types: epithelial, connective, muscle and nervous. Connective tissue includes proper (loose and dense), fluid (blood and lymph) and supporting (bone and cartilage). Muscle is skeletal (voluntary, striated), smooth (involuntary) or cardiac.
- Reproduction: gametogenesis. Spermatogonia divide by mitosis, then meiosis forms haploid sperm. Oogonia divide by mitosis in the foetal ovary. Meiosis occurs in sex cells, not ordinary body cells.

Do not claim a newly invented question is a verbatim past question.`,
  },
};

export const FREE_DAILY = 10;
export const FREE_COURSES_DAILY = 3;
export const CHUNK_MAX = 3;
export const PAID_TEST_MAX = 60;
