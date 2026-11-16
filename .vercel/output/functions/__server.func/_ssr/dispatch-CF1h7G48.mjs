import { t as OpenAI } from "../_libs/openai.mjs";
import { createHmac, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/dispatch-CF1h7G48.js
var PAST_QUESTIONS = { "MTH 101": [
	{
		id: "mth101-z-sum",
		topic: "Complex numbers",
		prompt: "If z1 = 7 + 3i and z2 = 4 - 2i, what is z1 + z2?",
		options: [
			"11 + i",
			"11 + 5i",
			"3 + 5i",
			"11 - i"
		],
		answer: 0,
		steps: [
			"Add the real parts: 7 + 4 = 11.",
			"Add the imaginary parts: 3 + (−2) = 1.",
			"So z1 + z2 = 11 + i."
		]
	},
	{
		id: "mth101-z-product",
		topic: "Complex numbers",
		prompt: "If z1 = 7 + 3i and z2 = 4 − 2i, what is z1 × z2?",
		options: [
			"34 − 2i",
			"22 − 2i",
			"34 + 2i",
			"28 − 6i"
		],
		answer: 0,
		steps: [
			"(7 + 3i)(4 − 2i) = 28 − 14i + 12i − 6i².",
			"i² = −1, so −6i² = 6.",
			"Real part 28 + 6 = 34. Imaginary part −14 + 12 = −2.",
			"The product is 34 − 2i."
		]
	},
	{
		id: "mth101-quad-roots",
		topic: "Quadratic equations",
		prompt: "The roots of x² − 4x − 6 = 0 are",
		options: [
			"2 ± √10",
			"4 ± √10",
			"−2 ± √10",
			"2 ± √6"
		],
		answer: 0,
		steps: [
			"Use the quadratic formula with a = 1, b = −4, c = −6.",
			"Discriminant = 16 + 24 = 40 = 4 × 10.",
			"x = [4 ± √40] / 2 = [4 ± 2√10] / 2 = 2 ± √10."
		]
	},
	{
		id: "mth101-cube-roots",
		topic: "Quadratic equations",
		prompt: "The roots of x² − x + 1 = 0 satisfy which equation?",
		options: [
			"x³ = −1",
			"x³ = 1",
			"x² = −1",
			"x³ = 0"
		],
		answer: 0,
		steps: [
			"x³ + 1 = (x + 1)(x² − x + 1).",
			"On the roots of x² − x + 1 = 0, the second factor is 0.",
			"Therefore x³ + 1 = 0, so x³ = −1."
		]
	},
	{
		id: "mth101-gp",
		topic: "Sequences and series",
		prompt: "A geometric series has first term 192 and common ratio 1.5. The sum of the first 6 terms is",
		options: [
			"3990",
			"2880",
			"1920",
			"4320"
		],
		answer: 0,
		steps: [
			"Sₙ = a(rⁿ − 1) / (r − 1).",
			"1.5⁶ = 11.390625, so rⁿ − 1 = 10.390625.",
			"Divide by 0.5 to get 20.78125, then multiply by 192.",
			"S₆ = 3990."
		]
	},
	{
		id: "mth101-consecutive",
		topic: "Number systems",
		prompt: "Five consecutive integers add up to 100. The smallest is",
		options: [
			"18",
			"16",
			"20",
			"15"
		],
		answer: 0,
		steps: [
			"Let the integers be n, n+1, n+2, n+3, n+4.",
			"Their sum is 5n + 10 = 100.",
			"5n = 90, so n = 18.",
			"Check: 18 + 19 + 20 + 21 + 22 = 100."
		]
	},
	{
		id: "mth101-evens",
		topic: "Number systems",
		prompt: "The sum of the even numbers between 99 and 999 is",
		options: [
			"247050",
			"249500",
			"245000",
			"198000"
		],
		answer: 0,
		steps: [
			"The evens run from 100 to 998.",
			"This is an AP with difference 2 and 450 terms.",
			"Sum = (450 / 2) × (100 + 998) = 225 × 1098.",
			"225 × 1098 = 247050."
		]
	},
	{
		id: "mth101-sets",
		topic: "Sets",
		prompt: "If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, the symmetric difference A Δ B is",
		options: [
			"{1, 2, 5, 6}",
			"{3, 4}",
			"{1, 2, 3, 4, 5, 6}",
			"{1, 2}"
		],
		answer: 0,
		steps: [
			"A Δ B contains elements in A or B, but not both.",
			"The overlap is {3, 4}.",
			"Removing the overlap leaves {1, 2, 5, 6}."
		]
	}
] };
var CURATED = {
	"MTH 103": {
		"Functions and graphs": [q("Functions and graphs", "If f(x) = 2x − 5, what is f(4)?", "3", [
			"8",
			"13",
			"−3"
		], ["f(4) = 2(4) − 5.", "8 − 5 = 3."]), q("Functions and graphs", "The graph of y = (x − 2)² + 1 has its vertex at", "(2, 1)", [
			"(−2, 1)",
			"(2, −1)",
			"(1, 2)"
		], ["y = (x − h)² + k has vertex (h, k).", "Here h = 2 and k = 1."])],
		"Limits and continuity": [q("Limits and continuity", "lim (x → 2) of (x² − 4) / (x − 2) equals", "4", [
			"0",
			"2",
			"undefined"
		], [
			"x² − 4 = (x − 2)(x + 2).",
			"For x ≠ 2 the expression is x + 2.",
			"The limit is 2 + 2 = 4."
		])],
		Differentiation: [q("Differentiation", "If y = 3x² − 4x + 1, then dy/dx equals", "6x − 4", [
			"3x − 4",
			"6x − 4x",
			"6x + 1"
		], ["Differentiate term by term.", "d/dx (3x²) = 6x and d/dx (−4x) = −4."])],
		Integration: [q("Integration", "∫ 2x dx equals", "x² + C", [
			"2x² + C",
			"x + C",
			"2 + C"
		], ["The antiderivative of xⁿ is xⁿ⁺¹ / (n + 1).", "∫ 2x dx = 2 × x² / 2 + C = x² + C."])],
		Trigonometry: [q("Trigonometry", "sin 30° equals", "1/2", [
			"√3/2",
			"1",
			"√2/2"
		], ["This is a standard angle.", "sin 30° = 1/2."])],
		"Coordinate geometry": [q("Coordinate geometry", "The midpoint of (2, 4) and (8, 10) is", "(5, 7)", [
			"(6, 14)",
			"(3, 3)",
			"(10, 14)"
		], ["Midpoint = ((x1 + x2) / 2, (y1 + y2) / 2).", "((2 + 8) / 2, (4 + 10) / 2) = (5, 7)."])]
	},
	"PHY 101": {
		"Measurement in Physics": [q("Measurement in Physics", "In mechanics, the three quantities chosen as fundamental are", "length, mass and time", [
			"force, energy and time",
			"speed, mass and length",
			"work, power and time"
		], ["A fundamental quantity is not defined from other quantities.", "Mechanics uses length, mass and time."])],
		"Space and Time": [q("Space and Time", "A quantity that has magnitude but no direction is called a", "scalar", [
			"vector",
			"unit vector",
			"component"
		], ["Mass, time and speed are scalars.", "Force and velocity are vectors."])],
		"Units and Dimension": [q("Units and Dimension", "The SI unit of force is", "newton", [
			"joule",
			"watt",
			"pascal"
		], ["Force is mass × acceleration.", "The SI unit is the newton, N = kg m/s²."])],
		Kinematics: [q("Kinematics", "A car starts from rest and accelerates at 2 m/s² for 5 s. Its speed is", "10 m/s", [
			"2.5 m/s",
			"7 m/s",
			"25 m/s"
		], ["v = u + at.", "v = 0 + 2 × 5 = 10 m/s."])],
		"Fundamental Laws of Mechanics": [q("Fundamental Laws of Mechanics", "A 4 kg body is acted on by a resultant force of 20 N. Its acceleration is", "5 m/s²", [
			"80 m/s²",
			"0.2 m/s²",
			"16 m/s²"
		], ["F = ma, so a = F / m.", "a = 20 / 4 = 5 m/s²."])],
		"Statics and Dynamics": [q("Statics and Dynamics", "The normal force on a body resting on a surface acts", "perpendicular to the surface", [
			"parallel to the surface",
			"always opposite the weight in size only",
			"along the direction of motion"
		], ["The normal force is the support force from the surface.", "It is perpendicular to that surface."])],
		"Work and Energy": [q("Work and Energy", "A force of 10 N moves a body 3 m in the direction of the force. The work done is", "30 J", [
			"3.3 J",
			"13 J",
			"300 J"
		], ["W = Fs when force and displacement are parallel.", "W = 10 × 3 = 30 J."])],
		"Conservation laws": [q("Conservation laws", "A 2 kg body moves at 4 m/s. Its momentum is", "8 kg m/s", [
			"2 kg m/s",
			"6 kg m/s",
			"16 kg m/s"
		], ["p = mv.", "p = 2 × 4 = 8 kg m/s."])]
	},
	"PHY 103": {
		Elasticity: [q("Elasticity", "Hooke's law says that, within the elastic limit,", "extension is proportional to the applied force", [
			"stress is always zero",
			"extension is proportional to the square of the force",
			"the material never returns to its original length"
		], ["Hooke's law is F = ke.", "It holds only up to the elastic limit."])],
		Hydrostatics: [q("Hydrostatics", "Archimedes' principle says the upthrust on a body equals", "the weight of fluid displaced", [
			"the mass of the body",
			"the density of the body only",
			"the volume of the container"
		], ["The fluid pushes up on the submerged body.", "That upthrust equals the weight of fluid displaced."])],
		"Temperature and heat": [q("Temperature and heat", "A temperature of 0°C is the same as", "273 K", [
			"0 K",
			"100 K",
			"373 K"
		], ["The kelvin scale starts at absolute zero.", "0°C = 273 K."])],
		"Heat transfer": [q("Heat transfer", "Heat transfer by the movement of a hot fluid is called", "convection", [
			"conduction",
			"radiation",
			"diffraction"
		], ["Conduction passes heat through a material without bulk flow.", "Convection needs the fluid itself to move."])],
		"Laws of thermodynamics": [q("Laws of thermodynamics", "In these notes the first law is written", "ΔQ = ΔU + ΔW", [
			"ΔQ = 0 for every process",
			"ΔU = 0 for every process",
			"PV = nRT"
		], ["Heat added goes into internal energy and work.", "At constant volume, ΔW = 0, so ΔQ = ΔU."])],
		"Kinetic theory of gases": [q("Kinetic theory of gases", "Boyle's law says that, at constant temperature, pressure of a fixed mass of gas is", "inversely proportional to volume", [
			"directly proportional to volume",
			"independent of volume",
			"proportional to the square of volume"
		], ["P1V1 = P2V2 when temperature is fixed.", "Halving the volume doubles the pressure."])]
	},
	STAT: {
		"Descriptive statistics": [q("Descriptive statistics", "The mean of 4, 6, 8 and 10 is", "7", [
			"6",
			"8",
			"28"
		], ["Add the values: 4 + 6 + 8 + 10 = 28.", "Divide by 4: 28 / 4 = 7."])],
		Probability: [q("Probability", "A fair die is rolled once. The probability of a number greater than 4 is", "1/3", [
			"1/6",
			"1/2",
			"2/3"
		], ["The favourable outcomes are 5 and 6.", "Probability = 2 / 6 = 1/3."])],
		"Random variables": [q("Random variables", "A random variable assigns", "a number to each outcome of an experiment", [
			"a probability of 1 to every outcome",
			"only the mean of a sample",
			"a unit to a physical quantity"
		], ["A random variable is a numerical function on the sample space.", "Probabilities are then attached to those numbers."])],
		"Binomial and Poisson": [q("Binomial and Poisson", "A binomial experiment requires", "a fixed number of independent trials with two outcomes", [
			"a continuous time interval and rare events only",
			"normally distributed data",
			"a sample larger than 30"
		], ["Each trial is success or failure.", "The number of trials is fixed and the trials are independent."])],
		"Normal distribution": [q("Normal distribution", "In a normal distribution, the mean, median and mode are", "equal", [
			"in the ratio 1 : 2 : 3",
			"always different",
			"undefined"
		], ["A normal curve is symmetric about its centre.", "Mean, median and mode coincide."])],
		"Correlation and regression": [q("Correlation and regression", "A correlation coefficient of −0.9 indicates", "a strong negative linear relationship", [
			"no relationship",
			"a strong positive linear relationship",
			"a perfect positive relationship"
		], ["r is close to −1, so the linear association is strong.", "The sign is negative, so the variables move in opposite directions."])]
	},
	"CHM 101": {
		"Atomic structure": [q("Atomic structure", "The number of protons in the nucleus of an atom is its", "atomic number", [
			"mass number",
			"neutron number",
			"valency"
		], ["Atomic number Z counts protons.", "Mass number A counts protons and neutrons."])],
		"Periodic table": [q("Periodic table", "Elements in the same group of the periodic table have the same", "number of valence electrons", [
			"mass number",
			"number of neutrons",
			"number of electron shells"
		], ["Group number tracks the valence shell for the main groups.", "That is why elements in a group react in similar ways."])],
		"Chemical bonding": [q("Chemical bonding", "Sodium chloride is held together mainly by", "ionic bonds", [
			"covalent bonds",
			"metallic bonds",
			"hydrogen bonds"
		], ["Sodium loses an electron and chlorine gains it.", "The resulting ions attract: Na⁺ and Cl⁻."])],
		Stoichiometry: [q("Stoichiometry", "The number of moles in 44 g of CO₂ (molar mass 44 g/mol) is", "1 mol", [
			"0.5 mol",
			"2 mol",
			"44 mol"
		], ["n = mass / molar mass.", "n = 44 / 44 = 1 mol."])],
		Gases: [q("Gases", "At constant temperature, if the volume of a fixed mass of gas is halved, the pressure", "doubles", [
			"is halved",
			"stays the same",
			"is quartered"
		], ["Boyle’s law: P₁V₁ = P₂V₂.", "If V₂ = V₁ / 2, then P₂ = 2P₁."])],
		"Acids, bases and pH": [q("Acids, bases and pH", "A solution with pH 3 is", "acidic", [
			"neutral",
			"basic",
			"neither acidic nor basic"
		], ["pH below 7 is acidic.", "pH 7 is neutral and pH above 7 is basic."])],
		"Chemical kinetics": [q("Chemical kinetics", "The order of a reaction with respect to a reactant is", "the power of that reactant's concentration in the rate law", [
			"always the balancing coefficient in the equation",
			"the time taken for the reaction to finish",
			"the enthalpy change of the reaction"
		], ["Order comes from the rate law, not from the balanced equation.", "It may be a whole number or a fraction."])],
		"Atoms, molecules and ions": [q("Atoms, molecules and ions", "A molecule is", "two or more atoms chemically bonded", [
			"a single proton",
			"only a charged atom",
			"a mixture that can be filtered"
		], ["An atom is the smallest particle of an element.", "A molecule contains atoms bonded together."])],
		Radioactivity: [q("Radioactivity", "An alpha particle is", "a helium nucleus", [
			"a high-energy electron",
			"a neutron only",
			"electromagnetic radiation"
		], ["An alpha particle has two protons and two neutrons.", "Beta is an electron and gamma is radiation."])],
		Thermochemistry: [q("Thermochemistry", "Hess's law says that the enthalpy change of a reaction", "depends only on the initial and final states", [
			"depends on the path taken",
			"is always zero",
			"equals the activation energy"
		], ["Enthalpy is a state function.", "The route between the same states does not change ΔH."])]
	},
	"BIO 101": {
		"Cell structure and organization": [q("Cell structure and organization", "Which structure controls what enters and leaves a cell?", "cell membrane", [
			"cell wall only",
			"ribosome",
			"nucleus only"
		], ["The cell membrane is selectively permeable.", "It regulates the passage of substances."])],
		Genetics: [q("Genetics", "In a monohybrid cross of two heterozygotes (Aa × Aa), the expected genotype ratio is", "1 : 2 : 1", [
			"3 : 1",
			"1 : 1",
			"9 : 3 : 3 : 1"
		], ["The Punnett square gives AA, Aa, Aa and aa.", "That is 1 AA : 2 Aa : 1 aa. The phenotype ratio is 3 : 1 if A is dominant."])],
		"Classification of living things": [q("Classification of living things", "The correct order of biological classification, from largest to smallest, begins", "kingdom, phylum, class", [
			"species, genus, family",
			"class, kingdom, phylum",
			"genus, kingdom, order"
		], ["The usual sequence starts kingdom, phylum, class, order, family, genus, species."])],
		"Cell division": [q("Cell division", "The four stages of mitosis, in order, are", "prophase, metaphase, anaphase, telophase", [
			"metaphase, prophase, telophase, anaphase",
			"interphase, prophase, meiosis, telophase",
			"anaphase, telophase, metaphase, prophase"
		], ["Interphase is not a stage of mitosis.", "The nucleus divides in that order, then the cytoplasm divides."])],
		Tissues: [q("Tissues", "The four basic tissue types in the body are", "epithelial, connective, muscle and nervous", [
			"blood, bone, skin and hair",
			"xylem, phloem, cortex and pith",
			"enzyme, hormone, antibody and gene"
		], ["A tissue is a group of similar cells with one function.", "Blood and bone are kinds of connective tissue, not separate basic types."])],
		Reproduction: [q("Reproduction", "Sperm are formed from diploid cells by", "meiosis", [
			"mitosis only",
			"binary fission",
			"budding"
		], ["Spermatogonia first increase in number by mitosis.", "Meiosis then halves the chromosome number to form gametes."])]
	}
};
function q(topic, prompt, correct, wrong, steps) {
	return {
		topic,
		prompt,
		options: [correct, ...wrong],
		answer: 0,
		steps,
		origin: "oracle"
	};
}
function numericWrongs(correct, extras) {
	const wrong = [];
	const push = (value) => {
		const text = String(value);
		if (text === String(correct) || wrong.includes(text)) return;
		wrong.push(text);
	};
	for (const extra of extras) push(extra);
	let bump = 1;
	while (wrong.length < 3 && bump < 20) {
		push(Number(correct) + bump);
		push(Number(correct) - bump);
		bump++;
	}
	return wrong.slice(0, 3);
}
function withUnit(correct, unit, extras) {
	return numericWrongs(correct, extras).map((value) => `${value} ${unit}`);
}
var ALT = {
	"MTH 103|Limits and continuity": [q("Limits and continuity", "lim (x → 4) of 9 equals", "9", [
		"4",
		"0",
		"36"
	], ["The limit of a constant is the constant.", "The limit is 9."]), q("Limits and continuity", "A function is continuous at x = a when", "the limit at a equals the function value at a", [
		"the function is a polynomial only",
		"the limit is always zero",
		"a is negative"
	], ["Continuity needs the limit and the function value to agree.", "They must be equal at x = a."])],
	"MTH 103|Differentiation": [q("Differentiation", "The derivative of a constant is", "0", [
		"1",
		"the constant itself",
		"undefined"
	], ["A constant does not change.", "Its rate of change is 0."]), q("Differentiation", "d/dx (x³) equals", "3x²", [
		"x²",
		"3x",
		"x³ / 3"
	], ["Use the power rule.", "Bring down 3 and reduce the power to 2."])],
	"MTH 103|Integration": [q("Integration", "∫ 6 dx equals", "6x + C", [
		"6 + C",
		"x + C",
		"6x² + C"
	], ["The antiderivative of a constant k is kx.", "Do not forget + C."]), q("Integration", "∫ x² dx equals", "x³/3 + C", [
		"2x + C",
		"x³ + C",
		"x²/2 + C"
	], ["Increase the power by 1 and divide by the new power.", "∫ x² dx = x³/3 + C."])],
	"MTH 103|Coordinate geometry": [q("Coordinate geometry", "The distance between (0, 0) and (3, 4) is", "5", [
		"7",
		"12",
		"1"
	], ["Distance = sqrt((x2 − x1)² + (y2 − y1)²).", "sqrt(9 + 16) = sqrt(25) = 5."]), q("Coordinate geometry", "The gradient of the line through (1, 2) and (3, 8) is", "3", [
		"2",
		"6",
		"1/3"
	], ["Gradient = (y2 − y1) / (x2 − x1).", "(8 − 2) / (3 − 1) = 3."])],
	"PHY 101|Units and Dimension": [q("Units and Dimension", "The SI unit of force is the", "newton", [
		"joule",
		"watt",
		"pascal"
	], ["Force is measured in newtons.", "1 N = 1 kg m/s²."])],
	"PHY 101|Kinematics": [q("Kinematics", "A car starts from rest and accelerates at 2 m/s² for 5 s. Its speed is", "10 m/s", [
		"2 m/s",
		"7 m/s",
		"25 m/s"
	], ["v = u + at and u = 0.", "v = 2 × 5 = 10 m/s."])],
	"PHY 101|Fundamental Laws of Mechanics": [q("Fundamental Laws of Mechanics", "A 4 kg body is acted on by a resultant force of 20 N. Its acceleration is", "5 m/s²", [
		"80 m/s²",
		"16 m/s²",
		"4 m/s²"
	], ["a = F / m.", "a = 20 / 4 = 5 m/s²."])],
	"PHY 101|Work and Energy": [q("Work and Energy", "A force of 10 N moves a body 3 m in the direction of the force. The work done is", "30 J", [
		"13 J",
		"3.3 J",
		"7 J"
	], ["W = Fd.", "W = 10 × 3 = 30 J."])],
	"PHY 101|Conservation laws": [q("Conservation laws", "A 2 kg body moves at 4 m/s. Its momentum is", "8 kg m/s", [
		"6 kg m/s",
		"2 kg m/s",
		"16 kg m/s"
	], ["p = mv.", "p = 2 × 4 = 8 kg m/s."])],
	"PHY 101|Circular motion and gravitation": [q("Circular motion and gravitation", "Weight is best described as", "the gravitational force on a body", [
		"the mass of a body",
		"the volume of a body",
		"the speed of a body"
	], ["Weight is a force, mass is not.", "Near Earth, W = mg."])],
	"PHY 103|Electric charge and fields": [q("Electric charge and fields", "Like charges", "repel", [
		"attract",
		"cancel only in metals",
		"have no force"
	], ["Coulomb's law gives repulsion for the same sign.", "Unlike charges attract."])],
	"PHY 103|Electric potential": [q("Electric potential", "Electric potential is measured in", "volts", [
		"ohms",
		"farads",
		"tesla"
	], ["Potential difference is energy per unit charge.", "The unit is the volt."])],
	"PHY 103|Capacitors": [q("Capacitors", "Capacitance is the ratio", "charge / potential difference", [
		"potential difference / charge",
		"current / resistance",
		"force / charge"
	], ["C = Q / V.", "A larger capacitance stores more charge at the same voltage."])],
	"PHY 103|Current and resistance": [q("Current and resistance", "A 12 V supply drives 2 A through a resistor. The resistance is", "6 Ω", [
		"24 Ω",
		"10 Ω",
		"2 Ω"
	], ["R = V / I.", "R = 12 / 2 = 6 Ω."])],
	"PHY 103|Magnetism": [q("Magnetism", "The SI unit of magnetic flux density is the", "tesla", [
		"weber",
		"henry",
		"volt"
	], ["Flux density is measured in tesla.", "1 T = 1 N/(A m)."])],
	"PHY 103|Waves and optics": [q("Waves and optics", "The speed of a wave is frequency multiplied by", "wavelength", [
		"amplitude",
		"period only",
		"mass"
	], ["v = fλ.", "Wavelength is the length of one complete wave."]), q("Waves and optics", "A wave of frequency 4 Hz and wavelength 3 m has speed", "12 m/s", [
		"7 m/s",
		"1.3 m/s",
		"4 m/s"
	], ["v = fλ.", "v = 4 × 3 = 12 m/s."])],
	"STAT|Descriptive statistics": [q("Descriptive statistics", "The mean of 4, 6, 8 and 10 is", "7", [
		"6",
		"8",
		"28"
	], ["Add the values and divide by how many there are.", "(4 + 6 + 8 + 10) / 4 = 7."]), q("Descriptive statistics", "The median of 3, 9, 4, 7 and 5 is", "5", [
		"3",
		"9",
		"7"
	], ["Arrange the scores: 3, 4, 5, 7, 9.", "The middle value is 5."])],
	"STAT|Probability": [q("Probability", "A fair die is rolled once. The probability of a number greater than 4 is", "1/3", [
		"1/6",
		"1/2",
		"2/3"
	], ["The favourable outcomes are 5 and 6.", "2/6 = 1/3."])],
	"STAT|Random variables": [q("Random variables", "A random variable assigns", "a number to each outcome", [
		"a probability greater than 1",
		"only names, never numbers",
		"the sample size"
	], ["A random variable is a numerical outcome.", "Each outcome gets a number."])],
	"STAT|Binomial and Poisson": [q("Binomial and Poisson", "A binomial experiment requires", "a fixed number of independent trials with two outcomes", [
		"a changing number of trials",
		"more than two outcomes on every trial",
		"dependent trials only"
	], ["Each trial is success or failure.", "The number of trials is fixed and the trials are independent."])],
	"STAT|Normal distribution": [q("Normal distribution", "In a normal distribution, the mean, median and mode are", "equal", [
		"always different",
		"in the ratio 1 : 2 : 3",
		"undefined"
	], ["A normal curve is symmetric about the centre.", "The three averages coincide."])],
	"STAT|Correlation and regression": [q("Correlation and regression", "A correlation coefficient of −0.9 indicates", "a strong negative linear relationship", [
		"no relationship",
		"a strong positive relationship",
		"a weak positive relationship"
	], ["The sign shows the direction.", "A value close to −1 is a strong negative relationship."])],
	"CHM 101|Atomic structure": [q("Atomic structure", "The number of protons in the nucleus of an atom is its", "atomic number", [
		"mass number",
		"neutron number",
		"valency"
	], ["Atomic number counts protons.", "It identifies the element."])],
	"CHM 101|Periodic table": [q("Periodic table", "Elements in the same group of the periodic table have the same", "number of valence electrons", [
		"mass number",
		"number of neutrons",
		"number of shells only"
	], ["Group number tracks the valence electrons for the main groups.", "That is why they react in similar ways."])],
	"CHM 101|Stoichiometry": [q("Stoichiometry", "The number of moles in 44 g of CO₂ (molar mass 44 g/mol) is", "1 mol", [
		"44 mol",
		"2 mol",
		"0.5 mol"
	], ["n = mass / molar mass.", "44 / 44 = 1 mol."])],
	"CHM 101|Gases": [q("Gases", "At constant temperature, if the volume of a fixed mass of gas is halved, the pressure", "doubles", [
		"is halved",
		"stays the same",
		"becomes zero"
	], ["Boyle's law: pressure and volume are inversely proportional.", "Halving the volume doubles the pressure."])],
	"CHM 101|Acids, bases and pH": [q("Acids, bases and pH", "A solution with pH 3 is", "acidic", [
		"neutral",
		"basic",
		"neither acidic nor basic"
	], ["pH below 7 is acidic.", "pH 3 is acidic."])],
	"BIO 101|Cell structure and organization": [q("Cell structure and organization", "Which structure controls what enters and leaves a cell?", "the cell membrane", [
		"the nucleus only",
		"the cell wall only",
		"a ribosome"
	], ["The membrane is selectively permeable.", "It controls movement into and out of the cell."])],
	"BIO 101|Genetics": [q("Genetics", "In a monohybrid cross of two heterozygotes (Aa × Aa), the expected genotype ratio is", "1 : 2 : 1", [
		"3 : 1",
		"1 : 1",
		"9 : 3 : 3 : 1"
	], ["The Punnett square gives AA, Aa, Aa and aa.", "That is 1 : 2 : 1."])],
	"BIO 101|Ecology": [q("Ecology", "A group of the same species living in one area is a", "population", [
		"community",
		"ecosystem",
		"biosphere"
	], ["A population is one species.", "A community includes several species."])],
	"BIO 101|Reproduction": [q("Reproduction", "Spermatogonia first increase their number by", "mitosis", [
		"meiosis only",
		"binary fission",
		"budding"
	], ["The notes say spermatogonia divide by mitosis.", "Meiosis follows when sperm are formed."])]
};
function mulberry32(seed) {
	let a = seed >>> 0;
	return function rand() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hashString(value) {
	let h = 2166136261;
	const text = String(value);
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function normalisePrompt(prompt) {
	return String(prompt || "").toLowerCase().replace(/×/g, " times ").replace(/[−–]/g, " minus ").replace(/\+/g, " plus ").replace(/∫/g, " integral ").replace(/²/g, " squared ").replace(/³/g, " cubed ").replace(/√/g, " sqrt ").replace(/\d+/g, "#").replace(/[^a-z# ]+/g, " ").replace(/\s+/g, " ").trim();
}
var SIMILAR_STOP = /* @__PURE__ */ new Set([
	"the",
	"and",
	"what",
	"with",
	"for",
	"from",
	"that",
	"this",
	"equals",
	"equal",
	"into",
	"over",
	"then",
	"its",
	"has",
	"have",
	"are",
	"was",
	"when",
	"which",
	"than",
	"their",
	"them",
	"your",
	"about",
	"how",
	"many",
	"does",
	"each",
	"per",
	"only",
	"after",
	"before",
	"there",
	"these",
	"those",
	"will",
	"would",
	"can"
]);
function similarPrompt(a, b) {
	const left = normalisePrompt(a);
	const right = normalisePrompt(b);
	if (!left || !right) return false;
	if (left === right) return true;
	const toSet = (text) => new Set(text.split(" ").filter((word) => word.length > 2 && word !== "#" && !SIMILAR_STOP.has(word)));
	const A = toSet(left);
	const B = toSet(right);
	if (A.size < 3 || B.size < 3) return false;
	let intersection = 0;
	for (const word of A) if (B.has(word)) intersection++;
	const union = A.size + B.size - intersection;
	return union > 0 && intersection / union >= .72;
}
function isFresh(prompt, avoid) {
	return !(avoid || []).some((item) => similarPrompt(prompt, item));
}
function formatComplex(real, imag) {
	if (imag === 0) return String(real);
	const sign = imag < 0 ? " − " : " + ";
	const mag = Math.abs(imag);
	const imagText = mag === 1 ? "i" : mag + "i";
	if (real === 0) return (imag < 0 ? "−" : "") + imagText;
	return real + sign + imagText;
}
function intBetween(rand, min, max) {
	return min + Math.floor(rand() * (max - min + 1));
}
var MORE = {
	"PHY 101|Kinematics": [q("Kinematics", "A body starts from rest and accelerates at 3 m/s² for 4 s. The distance travelled is", "24 m", [
		"12 m",
		"7 m",
		"48 m"
	], ["s = ut + ½at² and u = 0.", "s = ½ × 3 × 16 = 24 m."])],
	"PHY 101|Fundamental Laws of Mechanics": [q("Fundamental Laws of Mechanics", "Newton's third law says that action and reaction forces are", "equal in size and opposite in direction", [
		"equal and in the same direction",
		"always unequal",
		"acting on the same body"
	], ["The forces are on two different bodies.", "They are equal and opposite."])],
	"PHY 101|Work and Energy": [q("Work and Energy", "Power is best described as", "the rate of doing work", [
		"the force times mass",
		"stored energy only",
		"distance divided by time"
	], ["P = W / t.", "A higher power does the same work in less time."])],
	"PHY 101|Conservation laws": [q("Conservation laws", "With no external force, the total momentum of a system", "stays constant", [
		"always increases",
		"always becomes zero",
		"equals the total mass"
	], ["This is conservation of momentum.", "Internal forces cancel in pairs."])],
	"PHY 101|Circular motion and gravitation": [q("Circular motion and gravitation", "Acceleration directed towards the centre of a circular path is called", "centripetal acceleration", [
		"tangential weight",
		"terminal velocity",
		"linear momentum"
	], ["The direction of the acceleration is inward.", "It is centripetal acceleration."])],
	"PHY 103|Electric charge and fields": [q("Electric charge and fields", "The SI unit of electric charge is the", "coulomb", [
		"ampere",
		"volt",
		"ohm"
	], ["Current is charge per second.", "Charge itself is measured in coulombs."])],
	"PHY 103|Electric potential": [q("Electric potential", "One volt is equal to one", "joule per coulomb", [
		"newton per coulomb",
		"ampere per ohm",
		"coulomb per second"
	], ["V = W / Q.", "1 V = 1 J/C."])],
	"PHY 103|Capacitors": [q("Capacitors", "Inserting a dielectric between capacitor plates usually", "increases the capacitance", [
		"reduces the charge to zero",
		"removes the potential difference permanently",
		"changes the plates into resistors"
	], ["A dielectric lets the capacitor store more charge at the same voltage.", "Capacitance increases."])],
	"PHY 103|Current and resistance": [q("Current and resistance", "A current of 3 A flows for 4 s. The charge transferred is", "12 C", [
		"7 C",
		"0.75 C",
		"1 C"
	], ["Q = It.", "Q = 3 × 4 = 12 C."])],
	"PHY 103|Magnetism": [q("Magnetism", "A magnetic field can exert a force on", "a moving charge", [
		"a stationary neutral atom only",
		"a mass at rest with no charge",
		"light in a vacuum only"
	], ["The magnetic force on a charge is qvB sin θ.", "A stationary charge feels no magnetic force."])],
	"PHY 103|Waves and optics": [q("Waves and optics", "The time taken for one complete wave to pass a point is the", "period", [
		"amplitude",
		"wavelength",
		"speed"
	], ["Period and frequency are reciprocals.", "T = 1/f."])],
	"STAT|Descriptive statistics": [q("Descriptive statistics", "The range of the scores 2, 9 and 5 is", "7", [
		"5",
		"9",
		"16"
	], ["Range = highest − lowest.", "9 − 2 = 7."])],
	"STAT|Probability": [q("Probability", "The probability of an impossible event is", "0", [
		"1",
		"1/2",
		"2"
	], ["Probability lies from 0 to 1.", "An impossible event has probability 0."])],
	"STAT|Random variables": [q("Random variables", "If a random variable is certain to be 6, its expected value is", "6", [
		"0",
		"1",
		"36"
	], ["A constant has expectation equal to that constant.", "E(6) = 6."])],
	"STAT|Binomial and Poisson": [q("Binomial and Poisson", "For 8 independent trials with success probability 1/2, the binomial variance is", "2", [
		"4",
		"8",
		"1"
	], ["Variance = np(1 − p).", "8 × 1/2 × 1/2 = 2."])],
	"STAT|Normal distribution": [q("Normal distribution", "About 95% of observations in a normal distribution lie within", "2 standard deviations of the mean", [
		"1 standard deviation of the mean",
		"4 standard deviations of the mean",
		"the interquartile range only"
	], ["The empirical rule gives about 95% within 2 standard deviations.", "About 68% lie within 1 standard deviation."])],
	"STAT|Correlation and regression": [q("Correlation and regression", "A correlation coefficient of 0 means", "no linear relationship", [
		"a perfect positive line",
		"a perfect negative line",
		"a causal relationship"
	], ["r = 0 means the linear association is absent.", "It does not by itself prove anything about a curve."])],
	"CHM 101|Atomic structure": [q("Atomic structure", "Isotopes of an element have the same", "atomic number", [
		"mass number",
		"number of neutrons",
		"number of nucleons"
	], ["Isotopes are the same element.", "They share a proton number and differ in neutrons."])],
	"CHM 101|Periodic table": [q("Periodic table", "The modern periodic table arranges the elements in order of", "atomic number", [
		"atomic mass only",
		"date of discovery",
		"density"
	], ["Moseley's work uses nuclear charge.", "The order is increasing atomic number."])],
	"CHM 101|Stoichiometry": [q("Stoichiometry", "One mole of any substance contains", "Avogadro's number of particles", [
		"18 grams only",
		"one atom only",
		"22.4 molecules only"
	], ["Avogadro's number is about 6.02 × 10²³.", "That quantity is one mole of particles."])],
	"CHM 101|Gases": [q("Gases", "In the ideal-gas calculations used at this level, 0°C is the same as", "273 K", [
		"0 K",
		"100 K",
		"373 K"
	], ["Kelvin = Celsius + 273.", "0°C = 273 K."])],
	"CHM 101|Acids, bases and pH": [q("Acids, bases and pH", "A neutral aqueous solution at room temperature has pH", "7", [
		"0",
		"1",
		"14"
	], ["pH 7 is neutral.", "Below 7 is acidic and above 7 is alkaline."])],
	"BIO 101|Cell structure and organization": [q("Cell structure and organization", "Ribosomes are the site of", "protein synthesis", [
		"photosynthesis",
		"lipid storage only",
		"cell division"
	], ["Ribosomes read mRNA.", "They assemble amino acids into proteins."])],
	"BIO 101|Genetics": [q("Genetics", "In DNA, adenine pairs with", "thymine", [
		"cytosine",
		"guanine",
		"uracil"
	], ["A pairs with T and G pairs with C.", "Uracil replaces thymine in RNA."])],
	"BIO 101|Ecology": [q("Ecology", "The role an organism plays in its habitat is its", "niche", [
		"population",
		"biome",
		"species"
	], ["A habitat is where it lives.", "A niche is how it lives there."])],
	"BIO 101|Reproduction": [q("Reproduction", "Meiosis produces daughter cells that are", "haploid", [
		"identical body cells",
		"always diploid clones",
		"unable to form gametes"
	], ["Meiosis halves the chromosome number.", "The daughter cells are haploid."])]
};
function generatedFor(course, topic, rand) {
	const alts = [...ALT[`${course}|${topic}`] || [], ...MORE[`${course}|${topic}`] || []];
	if (alts.length && rand() < .75) return alts[Math.floor(rand() * alts.length)];
	if (course === "MTH 101" && topic === "Complex numbers") {
		const a = intBetween(rand, 2, 8);
		const b = intBetween(rand, 1, 6);
		const c = intBetween(rand, 1, 7);
		const d = intBetween(rand, -5, 5) || 2;
		const mode = Math.floor(rand() * 4);
		if (mode === 1) {
			const real = a - c;
			const imag = b - d;
			return q(topic, `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 − z2?`, formatComplex(real, imag), [
				formatComplex(a + c, b + d),
				formatComplex(real, b + d),
				formatComplex(a * c, b * d)
			], [
				`Subtract the real parts: ${a} − ${c} = ${real}.`,
				`Subtract the imaginary parts: ${b} − (${d}) = ${imag}.`,
				`So z1 − z2 = ${formatComplex(real, imag)}.`
			]);
		}
		if (mode === 2) {
			const real = a * c - b * d;
			const imag = a * d + b * c;
			return q(topic, `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 × z2?`, formatComplex(real, imag), [
				formatComplex(a * c, b * d),
				formatComplex(a + c, b + d),
				formatComplex(real, a * d - b * c)
			], [
				`(${a} + ${b}i)(${formatComplex(c, d)}) = ${a * c} + (${a}*${d})i + (${b}*${c})i + (${b}*${d})i².`,
				"Replace i² with −1 and collect real and imaginary parts.",
				`The product is ${formatComplex(real, imag)}.`
			]);
		}
		if (mode === 3) return q(topic, `The real part of z = ${formatComplex(a, b)} is`, String(a), numericWrongs(a, [
			b,
			a + b,
			-b || b + 1
		]), ["A complex number a + bi has real part a.", `The real part is ${a}.`]);
		const real = a + c;
		const imag = b + d;
		return q(topic, `If z1 = ${a} + ${b}i and z2 = ${formatComplex(c, d)}, what is z1 + z2?`, formatComplex(real, imag), [
			formatComplex(a - c, b - d),
			formatComplex(real, b - d),
			formatComplex(a * c, b * d)
		], [
			`Add the real parts: ${a} + ${c} = ${real}.`,
			`Add the imaginary parts: ${b} + (${d}) = ${imag}.`,
			`So z1 + z2 = ${formatComplex(real, imag)}.`
		]);
	}
	if (course === "MTH 101" && topic === "Quadratic equations") {
		const r1 = intBetween(rand, 1, 6);
		const r2 = intBetween(rand, -4, 5);
		const sum = r1 + r2;
		const product = r1 * r2;
		const mode = Math.floor(rand() * 3);
		if (mode === 1) {
			const b = intBetween(rand, 1, 6);
			const c = intBetween(rand, -5, 5) || 2;
			const discriminant = b * b - 4 * c;
			return q(topic, `The discriminant of x² + ${b}x ${c < 0 ? "− " + -c : "+ " + c} = 0 is`, String(discriminant), numericWrongs(discriminant, [
				b * b,
				b * b + 4 * c,
				4 * c
			]), ["Discriminant = b² − 4ac.", `Here a = 1, so ${b}² − 4(${c}) = ${discriminant}.`]);
		}
		if (mode === 2) return q(topic, `The sum of the roots of x² − ${Math.abs(sum) || 3}x + ${Math.abs(product) || 2} = 0 is`, String(Math.abs(sum) || 3), numericWrongs(Math.abs(sum) || 3, [
			Math.abs(product) || 2,
			-(Math.abs(sum) || 3),
			0
		]), ["For x² − (sum)x + (product) = 0, the roots add to the coefficient of x.", `The sum of the roots is ${Math.abs(sum) || 3}.`]);
		const b = -sum;
		const prompt = `One root of x² ${b < 0 ? "− " + -b : "+ " + b}x ${product < 0 ? "− " + -product : "+ " + product} = 0 is ${r1}. The other root is`;
		const wrong = numericWrongs(r2, [
			sum,
			product,
			-r2 || r2 + 1
		]);
		return q(topic, prompt, String(r2), wrong, [
			"For x² − (sum)x + (product) = 0, the roots add to the sum and multiply to the product.",
			`The known root is ${r1}, and the roots add to ${sum}.`,
			`The other root is ${sum} − ${r1} = ${r2}.`
		]);
	}
	if (course === "MTH 101" && topic === "Sequences and series") {
		const a = intBetween(rand, 3, 12);
		const d = intBetween(rand, 2, 5);
		const n = intBetween(rand, 6, 10);
		const mode = Math.floor(rand() * 3);
		if (mode === 1) {
			const term = a + (n - 1) * d;
			return q(topic, `The ${n}th term of an arithmetic progression with first term ${a} and common difference ${d} is`, String(term), numericWrongs(term, [
				a + n * d,
				n * d,
				a * n
			]), ["The nth term is a + (n − 1)d.", `${a} + ${n - 1} × ${d} = ${term}.`]);
		}
		if (mode === 2) {
			const ratio = intBetween(rand, 2, 3);
			const sum = a * (ratio ** 3 - 1) / (ratio - 1);
			return q(topic, `A geometric progression has first term ${a} and common ratio ${ratio}. The sum of its first 3 terms is`, String(sum), numericWrongs(sum, [
				a * ratio,
				a * 3,
				a * ratio ** 3
			]), ["Sₙ = a(rⁿ − 1) / (r − 1).", `S₃ = ${a}(${ratio}³ − 1) / ${ratio - 1} = ${sum}.`]);
		}
		const sum = n / 2 * (2 * a + (n - 1) * d);
		return q(topic, `An arithmetic series has first term ${a} and common difference ${d}. The sum of the first ${n} terms is`, String(sum), numericWrongs(sum, [
			sum + d,
			a + (n - 1) * d,
			n * a
		]), ["Sₙ = n/2 × [2a + (n − 1)d].", `Sₙ = ${n}/2 × [2(${a}) + ${n - 1}(${d})] = ${sum}.`]);
	}
	if (course === "MTH 101" && topic === "Sets") {
		const universe = 30;
		const a = intBetween(rand, 8, 14);
		const b = intBetween(rand, 6, 12);
		const both = intBetween(rand, 2, 5);
		const union = a + b - both;
		const mode = Math.floor(rand() * 3);
		if (mode === 1) {
			const onlyA = a - both;
			return q(topic, `In a class of ${universe}, ${a} take algebra and ${b} take sets. If ${both} take both, how many take algebra only?`, String(onlyA), numericWrongs(onlyA, [
				a,
				union,
				b - both
			]), ["Algebra only = |A| − |A ∩ B|.", `${a} − ${both} = ${onlyA}.`]);
		}
		if (mode === 2) {
			const neither = universe - union;
			return q(topic, `If |A ∪ B| = ${union} in a class of ${universe}, how many students are outside both sets?`, String(neither), numericWrongs(neither, [
				universe - a,
				universe - b,
				union
			]), ["Students outside both sets = class size − |A ∪ B|.", `${universe} − ${union} = ${neither}.`]);
		}
		return q(topic, `In a class of ${universe}, ${a} students take algebra and ${b} take sets. If ${both} take both, how many take at least one of the two?`, String(union), numericWrongs(union, [
			a + b,
			a - both,
			universe - union
		]), ["|A ∪ B| = |A| + |B| − |A ∩ B|.", `${a} + ${b} − ${both} = ${union}.`]);
	}
	if (course === "MTH 101" && topic === "Number systems") {
		const n = intBetween(rand, 8, 20);
		const mode = Math.floor(rand() * 3);
		if (mode === 1) {
			const count = intBetween(rand, 8, 16);
			const sum = count * (count + 1) / 2;
			return q(topic, `The sum of the first ${count} positive integers is`, String(sum), numericWrongs(sum, [
				count * count,
				count * (count - 1),
				sum + count
			]), ["The sum 1 + 2 + … + n is n(n + 1)/2.", `${count} × ${count + 1} / 2 = ${sum}.`]);
		}
		if (mode === 2) {
			const last = n * 2;
			const count = n;
			return q(topic, `How many even positive integers are there from 2 to ${last}?`, String(count), numericWrongs(count, [
				last,
				count - 1,
				count + 1
			]), ["The evens are 2, 4, …, 2n.", `There are ${count} of them.`]);
		}
		const sum = 3 * n + 3;
		return q(topic, `Three consecutive integers add up to ${sum}. The middle integer is`, String(n + 1), numericWrongs(n + 1, [
			n,
			n + 2,
			n + 3
		]), ["Let the integers be m − 1, m and m + 1.", `Their sum is 3m = ${sum}, so m = ${n + 1}.`]);
	}
	if (course === "PHY 101" && topic === "Kinematics") {
		const u = intBetween(rand, 2, 12);
		const a = intBetween(rand, 1, 4);
		const t = intBetween(rand, 2, 6);
		const v = u + a * t;
		return q(topic, `A body moving at ${u} m/s accelerates at ${a} m/s² for ${t} s. Its final speed is`, `${v} m/s`, [
			`${u + a} m/s`,
			`${u * t} m/s`,
			`${a * t} m/s`
		], ["v = u + at.", `v = ${u} + ${a} × ${t} = ${v} m/s.`]);
	}
	if (course === "PHY 101" && topic === "Fundamental Laws of Mechanics") {
		const m = intBetween(rand, 2, 8);
		const a = intBetween(rand, 2, 6);
		return q(topic, `The resultant force on a ${m} kg body that accelerates at ${a} m/s² is`, `${m * a} N`, [
			`${m + a} N`,
			`${m} N`,
			`${a} N`
		], ["F = ma.", `F = ${m} × ${a} = ${m * a} N.`]);
	}
	if (course === "CHM 101" && topic === "Stoichiometry") {
		const moles = intBetween(rand, 2, 5);
		const m = moles * 18;
		return q(topic, `How many moles are in ${m} g of water? (H₂O = 18 g/mol)`, `${moles} mol`, [
			`${moles * 18} mol`,
			`${moles + 1} mol`,
			"18 mol"
		], ["n = mass / molar mass.", `n = ${m} / 18 = ${moles} mol.`]);
	}
	if (course === "STAT" && topic === "Descriptive statistics") {
		const a = intBetween(rand, 2, 9);
		const b = a + intBetween(rand, 1, 4);
		const c = b + intBetween(rand, 1, 4);
		const mean = (a + b + c) / 3;
		if (!Number.isInteger(mean)) return null;
		return q(topic, `The mean of ${a}, ${b} and ${c} is`, String(mean), [
			String(b),
			String(a + b + c),
			String(mean + 1)
		], [`Add the scores: ${a + b + c}.`, `Divide by 3 to get ${mean}.`]);
	}
	if (course === "MTH 103" && topic === "Functions and graphs") {
		const slope = intBetween(rand, 2, 6);
		const intercept = intBetween(rand, -5, 8) || 3;
		const x = intBetween(rand, 1, 7);
		const value = slope * x + intercept;
		return q(topic, `If f(x) = ${slope}x ${intercept < 0 ? "− " + -intercept : "+ " + intercept}, what is f(${x})?`, String(value), numericWrongs(value, [
			slope * x,
			value + slope,
			intercept
		]), [`f(${x}) = ${slope}(${x}) ${intercept < 0 ? "− " + -intercept : "+ " + intercept}.`, `${slope * x} ${intercept < 0 ? "− " + -intercept : "+ " + intercept} = ${value}.`]);
	}
	if (course === "MTH 103" && topic === "Limits and continuity") {
		const a = intBetween(rand, 2, 9);
		const limit = 2 * a;
		return q(topic, `lim (x → ${a}) of (x² − ${a * a}) / (x − ${a}) equals`, String(limit), numericWrongs(limit, [
			a,
			a * a,
			0
		]), [
			`x² − ${a * a} = (x − ${a})(x + ${a}).`,
			`For x ≠ ${a} the quotient is x + ${a}.`,
			`The limit is ${a} + ${a} = ${limit}.`
		]);
	}
	if (course === "MTH 103" && topic === "Differentiation") {
		const a = intBetween(rand, 2, 5);
		const b = intBetween(rand, 1, 7);
		const correct = `${2 * a}x + ${b}`;
		return q(topic, `If y = ${a}x² + ${b}x, then dy/dx equals`, correct, [
			`${a}x + ${b}`,
			`${2 * a}x`,
			`${a}x² + ${b}`
		], ["Differentiate term by term.", `d/dx (${a}x²) = ${2 * a}x and d/dx (${b}x) = ${b}.`]);
	}
	if (course === "MTH 103" && topic === "Integration") {
		const k = intBetween(rand, 1, 6) * 2;
		return q(topic, `∫ ${k}x dx equals`, `${k / 2}x² + C`, [
			`${k}x² + C`,
			`${k}x + C`,
			`${k / 2}x + C`
		], ["∫ x dx = x² / 2.", `∫ ${k}x dx = ${k} × x² / 2 + C = ${k / 2}x² + C.`]);
	}
	if (course === "MTH 103" && topic === "Trigonometry") {
		const rows = [
			[
				"sin 30°",
				"1/2",
				[
					"√3/2",
					"√2/2",
					"0"
				]
			],
			[
				"sin 60°",
				"√3/2",
				[
					"1/2",
					"√2/2",
					"1"
				]
			],
			[
				"cos 60°",
				"1/2",
				[
					"√3/2",
					"0",
					"1"
				]
			],
			[
				"cos 45°",
				"√2/2",
				[
					"1/2",
					"√3/2",
					"1"
				]
			],
			[
				"tan 45°",
				"1",
				[
					"0",
					"√3",
					"1/2"
				]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, `${row[0]} equals`, row[1], row[2], ["Use the standard-angle values.", `${row[0]} = ${row[1]}.`]);
	}
	if (course === "MTH 103" && topic === "Coordinate geometry") {
		const x1 = intBetween(rand, 0, 8);
		const y1 = intBetween(rand, 0, 8);
		const x2 = x1 + intBetween(rand, 2, 8) * 2;
		const y2 = y1 + intBetween(rand, 2, 6) * 2;
		const mx = (x1 + x2) / 2;
		const my = (y1 + y2) / 2;
		return q(topic, `The midpoint of (${x1}, ${y1}) and (${x2}, ${y2}) is`, `(${mx}, ${my})`, [
			`(${x1 + x2}, ${y1 + y2})`,
			`(${mx}, ${y1})`,
			`(${x2}, ${my})`
		], ["Midpoint = ((x1 + x2) / 2, (y1 + y2) / 2).", `((${x1} + ${x2}) / 2, (${y1} + ${y2}) / 2) = (${mx}, ${my}).`]);
	}
	if (course === "PHY 101" && topic === "Units and Dimension") {
		const n = intBetween(rand, 2, 15);
		const ms = n * 5;
		return q(topic, `A speed of ${n * 18} km/h is equal to`, `${ms} m/s`, withUnit(ms, "m/s", [
			n * 18,
			n,
			ms * 2
		]), ["1 km/h = 1000/3600 m/s = 5/18 m/s.", `${n * 18} × 5/18 = ${ms} m/s.`]);
	}
	if (course === "PHY 101" && topic === "Work and Energy") {
		const force = intBetween(rand, 2, 12);
		const distance = intBetween(rand, 2, 9);
		const work = force * distance;
		return q(topic, `The work done by a ${force} N force through ${distance} m, in its own direction, is`, `${work} J`, withUnit(work, "J", [
			force + distance,
			force,
			distance
		]), ["W = Fd when force and displacement are in the same direction.", `W = ${force} × ${distance} = ${work} J.`]);
	}
	if (course === "PHY 101" && topic === "Conservation laws") {
		const mass = intBetween(rand, 2, 8);
		const speed = intBetween(rand, 2, 9);
		const momentum = mass * speed;
		return q(topic, `The momentum of a ${mass} kg body moving at ${speed} m/s is`, `${momentum} kg m/s`, withUnit(momentum, "kg m/s", [
			mass + speed,
			mass,
			speed
		]), ["p = mv.", `p = ${mass} × ${speed} = ${momentum} kg m/s.`]);
	}
	if (course === "PHY 101" && topic === "Measurement in Physics") {
		const rows = [
			[
				"In mechanics, length, mass and time are treated as",
				"fundamental quantities",
				[
					"derived quantities",
					"dimensionless constants",
					"vector components"
				],
				["They are not defined from other mechanical quantities.", "Force and energy are derived from them."]
			],
			[
				"How many base units does the SI system have?",
				"7",
				[
					"3",
					"5",
					"10"
				],
				["SI has seven base units.", "They include the metre, kilogram, second, ampere, kelvin, mole and candela."]
			],
			[
				"The SI base unit of mass is the",
				"kilogram",
				[
					"gram",
					"newton",
					"pound"
				],
				["The gram is a submultiple, not the base unit.", "Mass is measured in kilograms."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "PHY 101" && topic === "Space and Time") {
		const rows = [
			[
				"A unit vector has magnitude",
				"1",
				[
					"0",
					"10",
					"equal to the vector it came from"
				],
				["A unit vector only shows direction.", "Its magnitude is exactly 1."]
			],
			[
				"The dot product of two perpendicular vectors is",
				"0",
				[
					"1",
					"their cross product",
					"the product of their magnitudes"
				],
				["Dot product = AB cos θ.", "cos 90° = 0, so the product is 0."]
			],
			[
				"Displacement is best described as",
				"the change in position",
				[
					"the distance along the path",
					"a scalar with no direction",
					"speed divided by time"
				],
				["Displacement is a vector from the start position to the end.", "Distance travelled can be longer than the displacement."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "PHY 101" && topic === "Statics and Dynamics") {
		const rows = [
			[
				"A body is in equilibrium when the net force on it is",
				"zero",
				[
					"equal to its mass",
					"equal to its weight only",
					"increasing"
				],
				["Net force is the vector sum of all forces.", "Zero net force means no acceleration."]
			],
			[
				"Friction on a sliding body acts",
				"opposite the motion",
				[
					"in the direction of motion",
					"perpendicular to the surface",
					"straight down"
				],
				["Friction opposes sliding.", "It is parallel to the surface."]
			],
			[
				"Near the Earth, the weight of a body of mass m is",
				"mg",
				[
					"m/g",
					"m + g",
					"g/m"
				],
				["Weight is the gravitational force.", "W = mg."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "PHY 103" && topic === "Elasticity") {
		const rows = [
			[
				"Stress is defined as",
				"force per unit area",
				[
					"extension per original length",
					"force times area",
					"energy per unit volume only"
				],
				["Stress = F / A.", "Strain is the extension divided by the original length."]
			],
			[
				"Young modulus is the ratio",
				"tensile stress / tensile strain",
				[
					"shear stress / shear strain",
					"force times extension",
					"mass / volume"
				],
				["Young modulus describes elasticity in length.", "It is stress divided by strain."]
			],
			[
				"Beyond the elastic limit, a stretched material",
				"does not regain its original length",
				[
					"always obeys Hooke's law",
					"has zero stress",
					"cannot break"
				],
				["The elastic limit is the end of recoverable stretch.", "The yield point comes after that."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "PHY 103" && topic === "Hydrostatics") {
		const rows = [
			[
				"Density is",
				"mass divided by volume",
				[
					"volume divided by mass",
					"weight divided by area",
					"pressure times height"
				],
				["ρ = m / V.", "A denser material has more mass in the same volume."]
			],
			[
				"Pressure in a liquid at a greater depth is",
				"higher",
				[
					"lower",
					"zero",
					"independent of depth"
				],
				["P = ρgh.", "A deeper point supports a taller column of liquid."]
			],
			[
				"Water rising in a narrow glass tube is an example of",
				"capillarity",
				[
					"diffusion",
					"viscosity only",
					"Archimedes' principle"
				],
				["Capillarity comes from surface tension, adhesion and cohesion.", "The liquid climbs a narrow tube."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "PHY 103" && topic === "Temperature and heat") {
		const rows = [
			[
				"When temperature changes but the state does not, the heat absorbed is",
				"mcΔT",
				[
					"mL only",
					"ΔT / c",
					"mc / ΔT"
				],
				["c is the specific heat capacity.", "Q = mcΔT."]
			],
			[
				"Linear expansion of a solid depends on",
				"original length and temperature rise",
				[
					"mass only",
					"the colour of the solid",
					"pressure only"
				],
				["ΔL = αLΔT.", "A longer rod expands more for the same temperature rise."]
			],
			[
				"Absolute zero is",
				"0 K",
				[
					"0°C",
					"100°C",
					"273°C"
				],
				["The kelvin scale starts at absolute zero.", "0°C is 273 K, not absolute zero."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "PHY 103" && topic === "Heat transfer") {
		const rows = [
			[
				"Heat moving through a metal rod, with no bulk flow of the metal, is",
				"conduction",
				[
					"convection",
					"radiation",
					"evaporation"
				],
				["The particles pass energy to their neighbours.", "The rod itself does not flow."]
			],
			[
				"Heat from the Sun reaches the Earth mainly by",
				"radiation",
				[
					"conduction through space",
					"convection through empty space",
					"diffusion of air only"
				],
				["Radiation needs no material medium.", "Space between the Sun and the Earth is not a conducting rod."]
			],
			[
				"The three modes of heat transfer in these notes are",
				"conduction, convection and radiation",
				[
					"reflection, refraction and diffraction",
					"fusion, vaporisation and sublimation",
					"stress, strain and modulus"
				],
				["Conduction, convection and radiation move heat.", "The notes spell convection as convention."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "PHY 103" && topic === "Laws of thermodynamics") {
		const rows = [
			[
				"The zeroth law of thermodynamics is about",
				"thermal equilibrium",
				[
					"the speed of light",
					"electric charge",
					"nuclear binding energy"
				],
				["If A and B are each in equilibrium with C, then A and B are in equilibrium.", "That makes temperature meaningful."]
			],
			[
				"For an ideal gas taken through an isothermal change, ΔU is",
				"0",
				[
					"equal to the pressure",
					"always positive and large",
					"equal to nRT only"
				],
				["Internal energy of an ideal gas depends on temperature.", "Temperature is constant, so ΔU = 0 and ΔQ = ΔW."]
			],
			[
				"In an adiabatic process in these notes, ΔQ is",
				"0",
				[
					"equal to PV",
					"always equal to ΔU",
					"the heat rejected by a fridge"
				],
				["No heat enters or leaves.", "The first law then gives 0 = ΔU + ΔW."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "PHY 103" && topic === "Kinetic theory of gases") {
		const rows = [
			[
				"Charles's law says that, at constant pressure, volume is proportional to",
				"absolute temperature",
				[
					"Celsius temperature only",
					"pressure",
					"the mass of the container"
				],
				["Temperature must be in kelvin.", "V / T is constant when pressure is fixed."]
			],
			[
				"The ideal-gas equation used at this level is",
				"PV = nRT",
				[
					"F = ma",
					"V = IR",
					"Q = mcΔT"
				],
				["P, V and T are linked for a fixed amount of ideal gas.", "n is the number of moles."]
			],
			[
				"In kinetic theory, the average kinetic energy of gas molecules increases when",
				"temperature increases",
				[
					"volume is doubled at the same temperature",
					"the container is painted black",
					"pressure is the only quantity mentioned"
				],
				["Temperature measures the average molecular kinetic energy.", "A hotter gas has faster molecules."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "STAT" && topic === "Probability") {
		const red = intBetween(rand, 2, 7);
		const blue = intBetween(rand, 2, 7);
		const total = red + blue;
		return q(topic, `A bag has ${red} red beads and ${blue} blue beads. The probability of picking a red bead is`, `${red}/${total}`, [
			`${blue}/${total}`,
			`${red}/${blue}`,
			`${total}/${red}`
		], ["Probability = favourable outcomes / total outcomes.", `${red} red beads out of ${total} gives ${red}/${total}.`]);
	}
	if (course === "STAT" && topic === "Random variables") {
		const a = intBetween(rand, 1, 6);
		const b = intBetween(rand, 2, 8);
		const expected = (a + b) / 2;
		if (!Number.isInteger(expected)) return null;
		return q(topic, `A variable is equally likely to be ${a} or ${b}. Its expected value is`, String(expected), numericWrongs(expected, [
			a + b,
			a,
			b
		]), ["E(X) = Σ xP(x).", `Each outcome has probability 1/2, so E(X) = (${a} + ${b}) / 2 = ${expected}.`]);
	}
	if (course === "STAT" && topic === "Binomial and Poisson") {
		const n = intBetween(rand, 4, 12) * 2;
		const mean = n / 2;
		return q(topic, `A binomial experiment has ${n} trials and success probability 1/2. The mean number of successes is`, String(mean), numericWrongs(mean, [
			n,
			n / 4,
			1
		]), ["For a binomial distribution, mean = np.", `Mean = ${n} × 1/2 = ${mean}.`]);
	}
	if (course === "STAT" && topic === "Normal distribution") {
		const mean = intBetween(rand, 40, 70);
		const sd = intBetween(rand, 2, 8);
		const value = mean + sd;
		return q(topic, `A normal score has mean ${mean} and standard deviation ${sd}. The z-score of ${value} is`, "1", [
			"0",
			"2",
			String(sd)
		], ["z = (x − mean) / standard deviation.", `z = (${value} − ${mean}) / ${sd} = 1.`]);
	}
	if (course === "STAT" && topic === "Correlation and regression") {
		const slope = intBetween(rand, 2, 6);
		const intercept = intBetween(rand, 1, 9);
		return q(topic, `For the line y = ${slope}x + ${intercept}, y increases by how much when x increases by 1?`, String(slope), numericWrongs(slope, [
			intercept,
			slope + intercept,
			1
		]), ["The slope is the change in y for a one-unit increase in x.", `The slope is ${slope}.`]);
	}
	if (course === "CHM 101" && topic === "Atomic structure") {
		const protons = intBetween(rand, 6, 20);
		const neutrons = intBetween(rand, 6, 22);
		const mass = protons + neutrons;
		return q(topic, `An atom has atomic number ${protons} and mass number ${mass}. It has`, `${neutrons} neutrons`, [
			`${protons} neutrons`,
			`${mass} neutrons`,
			`${protons + mass} neutrons`
		], ["Mass number = protons + neutrons.", `Neutrons = ${mass} − ${protons} = ${neutrons}.`]);
	}
	if (course === "CHM 101" && topic === "Periodic table") {
		const group = intBetween(rand, 1, 2);
		return q(topic, `An element in group ${group} of the periodic table has how many valence electrons?`, String(group), numericWrongs(group, [
			group + 8,
			8,
			group + 1
		]), ["Groups 1 and 2 have that many valence electrons.", `Group ${group} has ${group} valence electron${group === 1 ? "" : "s"}.`]);
	}
	if (course === "CHM 101" && topic === "Chemical bonding") {
		const rows = [
			[
				"NaCl is best described as",
				"ionic",
				[
					"covalent",
					"metallic",
					"van der Waals"
				]
			],
			[
				"The bond in a chlorine molecule, Cl₂, is",
				"covalent",
				[
					"ionic",
					"metallic",
					"hydrogen"
				]
			],
			[
				"A bond formed by sharing a pair of electrons is",
				"covalent",
				[
					"ionic",
					"metallic",
					"hydrogen"
				]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], ["Match the bond type to how the electrons are held.", `The answer is ${row[1]}.`]);
	}
	if (course === "CHM 101" && topic === "Gases") {
		const p1 = intBetween(rand, 2, 5);
		const v1 = intBetween(rand, 3, 8);
		const p2 = intBetween(rand, 2, 5);
		const product = p1 * v1;
		if (product % p2 !== 0) return null;
		const v2 = product / p2;
		return q(topic, `A gas at ${p1} atm occupies ${v1} L. At constant temperature, its volume at ${p2} atm is`, `${v2} L`, withUnit(v2, "L", [
			p1 * v1,
			v1,
			p2
		]), ["Boyle's law: P1V1 = P2V2.", `V2 = (${p1} × ${v1}) / ${p2} = ${v2} L.`]);
	}
	if (course === "CHM 101" && topic === "Acids, bases and pH") {
		const power = intBetween(rand, 1, 3);
		const zeros = "0." + "0".repeat(power - 1) + "1";
		return q(topic, `The pH of a ${zeros} M HCl solution is`, String(power), numericWrongs(power, [
			power + 1,
			7,
			14 - power
		]), ["HCl is a strong acid, so [H⁺] equals the concentration.", `pH = −log(${zeros}) = ${power}.`]);
	}
	if (course === "CHM 101" && topic === "Chemical kinetics") {
		const rows = [
			[
				"A catalyst changes the rate of a reaction and is",
				"not used up",
				[
					"always written as a product",
					"the solvent only",
					"a form of radioactivity"
				],
				["A catalyst provides another path.", "It is still present at the end."]
			],
			[
				"The rate of a chemical reaction measures",
				"how fast reactants are used or products form",
				[
					"the enthalpy of the reaction",
					"the equilibrium constant only",
					"the mass of the flask"
				],
				["Kinetics is about speed, not about how far the reaction can go.", "Rate can be followed from concentration against time."]
			],
			[
				"Molecularity counts",
				"the particles that collide in the rate-determining step",
				[
					"the enthalpy change",
					"the pH of the mixture",
					"only the coefficients of the overall equation"
				],
				["Molecularity is a count of reacting particles in that step.", "It is not always the same as the order."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "CHM 101" && topic === "Atoms, molecules and ions") {
		const rows = [
			[
				"An ion is",
				"a charged atom or group of atoms",
				[
					"a neutral molecule only",
					"a proton and nothing else",
					"a mixture"
				],
				["Atoms become ions by losing or gaining electrons.", "A positive ion is a cation and a negative ion is an anion."]
			],
			[
				"Isotopes of one element have the same",
				"atomic number but different mass numbers",
				[
					"mass number but different atomic numbers",
					"number of neutrons only and different proton numbers",
					"chemical symbol but must be different elements"
				],
				["The proton number fixes the element.", "Neutrons can differ."]
			],
			[
				"A chemical formula shows",
				"which atoms are present and in what ratio",
				[
					"only the melting point",
					"the rate of the reaction",
					"the colour of the compound"
				],
				["H2O means two hydrogen atoms and one oxygen atom.", "The formula is not a balanced equation by itself."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "CHM 101" && topic === "Radioactivity") {
		const rows = [
			[
				"The half-life of a radioisotope is the time for",
				"half of the nuclei to decay",
				[
					"all of the nuclei to decay",
					"the mass number to double",
					"one alpha particle to be created from nothing"
				],
				["After one half-life, half of the original sample remains.", "After two half-lives, a quarter remains."]
			],
			[
				"A beta particle is",
				"an electron",
				[
					"a helium nucleus",
					"a photon",
					"a proton"
				],
				["Beta emission comes from the nucleus.", "Gamma radiation is a photon, not a beta particle."]
			],
			[
				"Gamma radiation is",
				"electromagnetic radiation",
				[
					"a helium nucleus",
					"a slow neutron only",
					"a molecule of the element"
				],
				["Gamma rays have no charge and no rest mass.", "They are more penetrating than alpha particles."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "CHM 101" && topic === "Thermochemistry") {
		const rows = [
			[
				"An exothermic reaction",
				"releases heat to the surroundings",
				[
					"absorbs heat from the surroundings",
					"has no enthalpy change",
					"must be a nuclear reaction"
				],
				["The surroundings warm up.", "ΔH for an exothermic change is negative."]
			],
			[
				"An endothermic reaction",
				"absorbs heat from the surroundings",
				[
					"releases heat",
					"has ΔH less than zero",
					"cannot be written as a chemical equation"
				],
				["The surroundings cool down.", "ΔH is positive."]
			],
			[
				"A Born–Haber cycle is used to find",
				"the lattice enthalpy of an ionic compound",
				[
					"the pH of a buffer",
					"the order of a reaction",
					"the half-life of a radioisotope"
				],
				["It is an enthalpy cycle.", "Hess's law lets the lattice step be calculated from the other steps."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "BIO 101" && topic === "Cell structure and organization") {
		const eye = intBetween(rand, 5, 15);
		const objective = [
			4,
			10,
			40
		][Math.floor(rand() * 3)];
		const total = eye * objective;
		return q(topic, `A microscope has a ×${eye} eyepiece and a ×${objective} objective. The total magnification is`, `×${total}`, [
			`×${eye + objective}`,
			`×${eye}`,
			`×${objective}`
		], ["Total magnification = eyepiece × objective.", `${eye} × ${objective} = ${total}.`]);
	}
	if (course === "BIO 101" && topic === "Genetics") {
		const groups = intBetween(rand, 2, 6);
		const total = groups * 4;
		const dominant = groups * 3;
		return q(topic, `In a monohybrid cross of two heterozygotes, about how many of ${total} offspring show the dominant phenotype?`, String(dominant), numericWrongs(dominant, [
			total / 2,
			total,
			groups
		]), ["The expected phenotype ratio is 3 dominant : 1 recessive.", `${total} × 3/4 = ${dominant}.`]);
	}
	if (course === "BIO 101" && topic === "Classification of living things") {
		const rows = [
			[
				"An organism with a cellulose cell wall, chloroplasts and no nervous system belongs to kingdom",
				"Plantae",
				[
					"Animalia",
					"Fungi",
					"Monera"
				]
			],
			[
				"A unicellular organism with no true nucleus belongs to kingdom",
				"Monera",
				[
					"Plantae",
					"Animalia",
					"Fungi"
				]
			],
			[
				"A multicellular organism that feeds on organic matter and has chitin in its cell wall belongs to kingdom",
				"Fungi",
				[
					"Plantae",
					"Animalia",
					"Monera"
				]
			],
			[
				"An organism that is multicellular, moves and has no cell wall belongs to kingdom",
				"Animalia",
				[
					"Plantae",
					"Fungi",
					"Monera"
				]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], ["Use the kingdom features, not a single shared trait.", `The kingdom is ${row[1]}.`]);
	}
	if (course === "BIO 101" && topic === "Cell division") {
		const rows = [
			[
				"Mitosis of a body cell produces daughter cells that are",
				"genetically identical to the parent cell",
				[
					"haploid gametes",
					"always different species",
					"unable to grow"
				],
				["Mitosis is equational division.", "It is used for growth, repair and replacement."]
			],
			[
				"Meiosis produces",
				"haploid cells",
				[
					"two identical body cells",
					"a new species in one step",
					"cells with twice the parent chromosome number"
				],
				["The chromosome number is halved.", "The products can become gametes."]
			],
			[
				"Binary fission is the division used by",
				"prokaryotes",
				[
					"flowering plants only",
					"human body cells",
					"viruses with a nucleus"
				],
				["One cell becomes two identical cells.", "Bacteria have no mitosis spindle of the eukaryotic kind."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "BIO 101" && topic === "Tissues") {
		const rows = [
			[
				"Blood is classified as",
				"a fluid connective tissue",
				[
					"epithelial tissue",
					"nervous tissue",
					"skeletal muscle"
				],
				["Connective tissue includes proper, fluid and supporting types.", "Blood and lymph are the fluid type."]
			],
			[
				"Skeletal muscle is",
				"voluntary and striated",
				[
					"involuntary and smooth",
					"a connective tissue",
					"used only to transmit nerve impulses"
				],
				["Skeletal muscle is under conscious control.", "Smooth muscle is involuntary."]
			],
			[
				"Epithelial tissue typically",
				"lines surfaces and covers organs",
				[
					"contracts to move bones",
					"stores calcium as bone",
					"carries action potentials as its main job"
				],
				["Epithelia sit on a basement membrane.", "Nervous tissue carries signals and muscle contracts."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	if (course === "BIO 101" && topic === "Reproduction") {
		const rows = [
			[
				"Oogonia increase in number by",
				"mitosis",
				[
					"meiosis only",
					"binary fission of the ovary",
					"budding"
				],
				["The notes describe mitotic division of oogonia in the foetal ovary.", "Meiosis comes later, when gametes are formed."]
			],
			[
				"Meiosis in animals takes place in",
				"the sex cells",
				[
					"every body cell",
					"red blood cells only",
					"epithelial tissue only"
				],
				["Body cells divide by mitosis.", "Sex cells are the site of meiosis."]
			],
			[
				"A human gamete is",
				"haploid",
				[
					"diploid",
					"a somatic cell",
					"produced by binary fission"
				],
				["Gametes carry one set of chromosomes.", "Fertilisation restores the diploid number."]
			]
		];
		const row = rows[Math.floor(rand() * rows.length)];
		return q(topic, row[0], row[1], row[2], row[3]);
	}
	return null;
}
function curatedPool(course, topics) {
	const bank = CURATED[course] || {};
	return (topics.length ? topics : Object.keys(bank)).flatMap((topic) => bank[topic] || []);
}
function pqPool(course, topics) {
	return (PAST_QUESTIONS[course] || []).filter((item) => !topics.length || topics.includes(item.topic)).map((item) => ({
		...item,
		origin: "pq"
	}));
}
function clone(item) {
	return {
		topic: item.topic,
		prompt: item.prompt,
		options: item.options.slice(),
		answer: item.answer,
		steps: item.steps.slice(),
		origin: item.origin === "pq" ? "pq" : "oracle",
		id: item.id
	};
}
function pickLocalQuestions({ course, topics, count, avoid, batch = 0, salt = "" }) {
	const blocked = [...avoid || []];
	const picked = [];
	const pqs = pqPool(course, topics).filter((item) => isFresh(item.prompt, blocked));
	if (pqs.length > 0 && (count >= 2 || batch % 2 === 0) ? 1 : 0) {
		const item = pqs[batch % pqs.length];
		picked.push(clone(item));
		blocked.push(item.prompt);
	}
	const curated = curatedPool(course, topics).filter((item) => isFresh(item.prompt, blocked));
	let guard = 0;
	while (picked.length < count && guard < 40) {
		guard++;
		const rand = mulberry32(hashString(`${course}|${topics.join(",")}|${batch}|${salt}|${guard}|${picked.length}`));
		const topic = topics[guard % Math.max(topics.length, 1)] || topics[0];
		let made = topic ? generatedFor(course, topic, rand) : null;
		if (!made && curated.length) made = curated.find((item) => isFresh(item.prompt, blocked));
		if (!made || !isFresh(made.prompt, blocked)) continue;
		if (new Set(made.options).size !== 4) continue;
		picked.push(clone(made));
		blocked.push(made.prompt);
	}
	if (picked.length < count) for (const item of curated) {
		if (picked.length >= count) break;
		if (!isFresh(item.prompt, blocked)) continue;
		picked.push(clone(item));
		blocked.push(item.prompt);
	}
	return picked.slice(0, count);
}
var DOUBT = /\b(wait|re-?calc\w*|option index|answer index|we listed|none match|none of the options|most plausible|correction)\b|\bactually\b/i;
function normalizeAnswer(value) {
	return String(value).toLowerCase().replace(/√/g, "sqrt").replace(/sqrt\(([^)]+)\)/g, "sqrt$1").replace(/±/g, "+-").replace(/×/g, "*").replace(/[−–]/g, "-").replace(/\s+/g, "");
}
function bareNumber(value) {
	let text = String(value).trim();
	if (/[±√]|sqrt|\+\/-/.test(text)) return null;
	text = text.replace(/\s*[a-z][a-z0-9/.^]*$/i, "");
	if (!/^-?\d+(?:\.\d+)?$/.test(text)) return null;
	const number = Number(text);
	return Number.isFinite(number) ? number : null;
}
function sameAnswer(left, right) {
	const a = normalizeAnswer(left);
	const b = normalizeAnswer(right);
	if (!a || !b) return false;
	if (a === b) return true;
	const leftNumber = bareNumber(left);
	const rightNumber = bareNumber(right);
	return leftNumber != null && rightNumber != null && leftNumber === rightNumber;
}
function mentionsResult(text, result) {
	if (sameAnswer(text, result)) return true;
	const normText = normalizeAnswer(text);
	const normResult = normalizeAnswer(result);
	if (normResult.length >= 3 && normText.includes(normResult)) return true;
	const number = bareNumber(result);
	if (number == null) return false;
	return new RegExp(`(?<![\\d.])${String(number).replace(".", "\\.")}(?![\\d.])`).test(String(text));
}
function looksLikeAnswer(value) {
	const text = String(value).trim();
	if (!text || text.length > 48) return false;
	if (/^(the|a|an|not|because|when|this|that|which|where)\b/i.test(text)) return false;
	return /\d|√|sqrt|±/.test(text);
}
function claimValue(claim) {
	const trimmed = String(claim).trim();
	return (trimmed.match(/^(.+?)(?:,|\s+so\b|\s+which\b|$)/i)?.[1] || trimmed).trim();
}
function isFinalResult(value) {
	const text = String(value).trim();
	if (!looksLikeAnswer(text)) return false;
	if (/[±√]|sqrt/.test(text)) return true;
	return bareNumber(text) != null;
}
function workedValues(text) {
	const body = String(text).replace(/(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is|choose option|the most plausible answer is)\s+(?!not\b)(?![^.]*?=)[^.]*(?:\.|$)/gi, " ");
	const found = [];
	for (const match of body.matchAll(/=\s*((?:(?!\.\s|\.$)[^\n]){1,80})|\b(?:is|equals)\s+((?:(?!\.\s|\.$)[^\n]){1,40})/gi)) {
		const rhs = (match[1] || match[2] || "").split("=").pop().trim().replace(/[,;].*$/, "").trim();
		if (isFinalResult(rhs)) found.push(rhs);
	}
	return found.length ? [found[found.length - 1]] : [];
}
function ensureOption(options, result, preset) {
	const hit = options.findIndex((option) => sameAnswer(option, result));
	if (hit >= 0) return {
		options,
		answer: hit
	};
	const next = options.slice();
	const slot = Number.isInteger(preset) && preset >= 0 && preset < next.length ? preset : 0;
	next[slot] = String(result).trim();
	return {
		options: next,
		answer: slot
	};
}
function cleanSteps(steps, result) {
	const kept = [];
	for (const step of steps) {
		const safe = step.split(/(?<=[.?!])\s+/).map((sentence) => sentence.trim()).filter(Boolean).filter((sentence) => {
			if (DOUBT.test(sentence)) return false;
			return claimsIn(sentence).every((claim) => sameAnswer(claim, result));
		});
		if (safe.length) kept.push(safe.join(" "));
	}
	if (!kept.length) kept.push(`The correct answer is ${result}.`);
	if (!mentionsResult(kept[kept.length - 1], result)) kept.push(`The correct answer is ${result}.`);
	return kept;
}
function claimsIn(text) {
	const lead = /(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is|choose option|the most plausible answer is)\s+(?!not\b)/gi;
	const claims = [];
	for (const match of String(text).matchAll(lead)) {
		const rest = String(text).slice(match.index + match[0].length);
		const end = rest.search(/\.(?!\d)/);
		const claim = rest.slice(0, end === -1 ? void 0 : end).trim();
		if (claim) claims.push(claim);
	}
	return claims;
}
/**
* The explanation is solved first. Whatever result that working reaches
* is placed in the options and marked correct. A different option is
* never written onto the end of the explanation.
* Returns null only when the working names two different results.
*/
function answerFromExplanation(question) {
	const options = Array.isArray(question?.options) ? question.options.map((option) => String(option).trim()) : [];
	if (options.length !== 4 || new Set(options.map((option) => option.toLowerCase())).size !== 4) return null;
	const steps = Array.isArray(question?.steps) ? question.steps.map((step) => String(step).trim()).filter(Boolean) : [];
	if (!steps.length) return null;
	const text = steps.join("\n");
	const worked = workedValues(text);
	const claims = claimsIn(text).map(claimValue).filter((claim) => isFinalResult(claim));
	const verdict = claims[claims.length - 1];
	const calculated = worked[0];
	if (!calculated && verdict && claims.some((item) => !sameAnswer(item, verdict))) return null;
	const result = calculated && verdict && !sameAnswer(calculated, verdict) ? calculated : verdict || calculated;
	if (!result) return null;
	const placed = ensureOption(options, result, Number(question?.answer));
	if (new Set(placed.options.map((option) => option.toLowerCase())).size !== 4) return null;
	return {
		answer: placed.answer,
		options: placed.options,
		steps: cleanSteps(steps, placed.options[placed.answer])
	};
}
/**
* Every question that leaves the server uses the explanation's result.
* A stated result that is missing or disagrees with itself is dropped.
* A handwritten item that never names an option keeps its saved answer.
*/
function alignQuestion(question) {
	const verified = answerFromExplanation(question);
	if (verified) return {
		...question,
		answer: verified.answer,
		options: verified.options,
		steps: verified.steps
	};
	const steps = Array.isArray(question?.steps) ? question.steps.map((step) => String(step).trim()).filter(Boolean) : [];
	if (claimsIn(steps.join("\n")).length || workedValues(steps.join("\n")).length) return null;
	return question;
}
function labelQuestion(question) {
	const origin = question.origin === "pq" ? "pq" : "oracle";
	return {
		...question,
		origin,
		source: origin === "pq" ? "PQ" : "Oracle Question"
	};
}
var memory = /* @__PURE__ */ new Map();
var payments = /* @__PURE__ */ new Map();
function firebaseConfigured() {
	return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}
function authMode() {
	return firebaseConfigured() ? "firebase" : "local";
}
function promoUntilDate() {
	return process.env.ORACLE_FREE_UNTIL || "2026-11-20";
}
function promoActive(now = Date.now()) {
	const end = (/* @__PURE__ */ new Date(`${promoUntilDate()}T23:59:59+01:00`)).getTime();
	return Number.isFinite(end) && now <= end;
}
function lagosDay(now = Date.now()) {
	return new Date(now + 36e5).toISOString().slice(0, 10);
}
function originAllowed(req) {
	const origin = req.headers.get("origin");
	if (!origin) return false;
	let originHost;
	try {
		originHost = new URL(origin).host;
	} catch {
		return false;
	}
	const hosts = [
		req.headers.get("host"),
		req.headers.get("x-forwarded-host"),
		new URL(req.url).host
	].filter(Boolean).map((host) => host.split(",")[0].trim());
	const extra = (process.env.ALLOWED_ORIGINS || "").split(",").map((host) => host.trim()).filter(Boolean);
	return hosts.includes(originHost) || extra.includes(originHost);
}
var json = (status, body) => new Response(JSON.stringify(body), {
	status,
	headers: {
		"Content-Type": "application/json; charset=utf-8",
		"Cache-Control": "no-store",
		"X-Content-Type-Options": "nosniff"
	}
});
function memoryUser(uid) {
	if (!memory.has(uid)) memory.set(uid, {
		email: null,
		premiumUntil: null,
		usage: {},
		daily: {},
		tests: [],
		seen: [],
		payments: {}
	});
	return memory.get(uid);
}
function parseServiceAccount(raw) {
	let text = String(raw || "").trim().replace(/^\uFEFF/, "");
	if (!text) {
		const error = /* @__PURE__ */ new Error("FIREBASE_SERVICE_ACCOUNT is empty.");
		error.config = true;
		error.publicMessage = "FIREBASE_SERVICE_ACCOUNT is empty on the server.";
		throw error;
	}
	const candidates = [text];
	if (text.startsWith("\"") && text.endsWith("\"") || text.startsWith("'") && text.endsWith("'")) candidates.push(text.slice(1, -1));
	if (/[\r\n]/.test(text)) candidates.push(text.replace(/\r?\n/g, "\\n"));
	let parsed;
	for (const candidate of candidates) try {
		let value = JSON.parse(candidate);
		if (typeof value === "string") value = JSON.parse(value);
		if (value && typeof value === "object" && !Array.isArray(value)) {
			parsed = value;
			break;
		}
	} catch {
		parsed = void 0;
	}
	if (!parsed) {
		const error = /* @__PURE__ */ new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON.");
		error.config = true;
		error.publicMessage = "FIREBASE_SERVICE_ACCOUNT is not valid JSON. Paste the downloaded key as one line, with no extra quotes around it.";
		throw error;
	}
	const privateKey = String(parsed.private_key || "").replace(/\\n/g, "\n");
	if (!parsed.project_id || !parsed.client_email || !privateKey.includes("BEGIN PRIVATE KEY")) {
		const error = /* @__PURE__ */ new Error("FIREBASE_SERVICE_ACCOUNT is missing required fields.");
		error.config = true;
		error.publicMessage = "The service account is missing project_id, client_email, or the private key. Paste the whole downloaded file, not only the key text.";
		throw error;
	}
	return {
		projectId: parsed.project_id,
		clientEmail: parsed.client_email,
		privateKey
	};
}
var firebasePromise;
async function firebaseServices() {
	if (!firebasePromise) firebasePromise = (async () => {
		const { cert, getApps, initializeApp } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.r);
		const { getAuth } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.n);
		const { getFirestore } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.t);
		if (!getApps().length) {
			const account = parseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT);
			try {
				initializeApp({ credential: cert(account) });
			} catch (error) {
				console.error("Firebase admin init failed", String(error?.message || "").replace(/-----BEGIN[\s\S]*-----END PRIVATE KEY-----/g, "[key]").slice(0, 180));
				const wrapped = /* @__PURE__ */ new Error("Firebase rejected the service account.");
				wrapped.config = true;
				wrapped.publicMessage = "Firebase could not read the private key. Download a new key from project burhan-tutors-website and paste that whole file as one line.";
				throw wrapped;
			}
		}
		return {
			auth: getAuth(),
			db: getFirestore()
		};
	})().catch((error) => {
		firebasePromise = void 0;
		throw error;
	});
	return firebasePromise;
}
async function authenticatedUser(req, required = true) {
	const match = (req.headers.get("authorization") || "").match(/^Bearer\s+(.+)$/i);
	if (!firebaseConfigured()) {
		if (match && match[1].startsWith("local:")) {
			const id = match[1].slice(6);
			if (/^[a-zA-Z0-9_-]{8,80}$/.test(id)) return {
				uid: `local_${id}`,
				email: null,
				local: true
			};
		}
		if (!required) return null;
		return null;
	}
	if (!match) return required ? null : null;
	try {
		const { auth } = await firebaseServices();
		return await auth.verifyIdToken(match[1]);
	} catch (error) {
		const code = String(error?.code || "");
		const message = String(error?.message || "");
		if (!code.startsWith("auth/") || /credential|access token|initializeApp/i.test(message)) error.config = true;
		throw error;
	}
}
async function hasPremium(uid) {
	if (!uid) return false;
	if (promoActive()) return true;
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const until = memoryUser(uid).premiumUntil;
		return Boolean(until && new Date(until).getTime() > Date.now());
	}
	const { db } = await firebaseServices();
	const expiresAt = (await db.collection("oracleUsers").doc(uid).get()).get("premiumUntil");
	return Boolean(expiresAt && expiresAt.toMillis() > Date.now());
}
function paidAccessExpiry(start = /* @__PURE__ */ new Date()) {
	const expiry = new Date(start);
	const day = expiry.getUTCDate();
	expiry.setUTCDate(1);
	expiry.setUTCMonth(expiry.getUTCMonth() + 6);
	const lastDay = new Date(Date.UTC(expiry.getUTCFullYear(), expiry.getUTCMonth() + 1, 0)).getUTCDate();
	expiry.setUTCDate(Math.min(day, lastDay));
	return expiry;
}
function activeCourseIds(used) {
	return Object.keys(used || {}).filter((course) => used[course] > 0);
}
async function readDailyUsage(uid) {
	if (!uid) return {};
	const day = lagosDay();
	if (!firebaseConfigured() || String(uid).startsWith("local_")) return { ...memoryUser(uid).daily[day] || {} };
	const { db } = await firebaseServices();
	return (await db.collection("oracleUsers").doc(uid).collection("dailyUsage").doc(day).get()).get("courses") || {};
}
async function recordFreeUsage(uid, course, count, freeDaily, freeCourses) {
	const day = lagosDay();
	const apply = (used) => {
		const current = Number(used[course]) || 0;
		if (current + count > freeDaily) return {
			allowed: false,
			code: "quota",
			used: current
		};
		const active = activeCourseIds(used);
		if (!used[course] && active.length >= freeCourses) return {
			allowed: false,
			code: "subject_limit",
			subjectsUsed: active.length
		};
		const next = current + count;
		const courses = {
			...used,
			[course]: next
		};
		return {
			allowed: true,
			used: next,
			courses,
			subjectsUsed: activeCourseIds(courses).length
		};
	};
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const user = memoryUser(uid);
		const result = apply({ ...user.daily[day] || {} });
		if (result.allowed) user.daily[day] = result.courses;
		return result;
	}
	const { db, FieldValue } = await firebaseBundle();
	const dailyRef = db.collection("oracleUsers").doc(uid).collection("dailyUsage").doc(day);
	return db.runTransaction(async (transaction) => {
		const used = (await transaction.get(dailyRef)).get("courses") || {};
		const result = apply(used);
		if (!result.allowed) return result;
		transaction.set(dailyRef, {
			courses: result.courses,
			updatedAt: FieldValue.serverTimestamp()
		}, { merge: true });
		return result;
	});
}
async function firebaseBundle() {
	const services = await firebaseServices();
	const { FieldValue, Timestamp } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.t);
	return {
		...services,
		FieldValue,
		Timestamp
	};
}
async function recordPaidUsage(user, course, questionCount) {
	if (!user || questionCount < 1 || promoActive()) return;
	if (!firebaseConfigured() || user.local) {
		const row = memoryUser(user.uid);
		const day = lagosDay();
		row.usage.paidQuestionsTotal = Number(row.usage.paidQuestionsTotal || 0) + questionCount;
		row.usage.paidQuestionsByDay = row.usage.paidQuestionsByDay || {};
		row.usage.paidQuestionsByDay[day] = Number(row.usage.paidQuestionsByDay[day] || 0) + questionCount;
		row.usage.paidQuestionsByCourse = row.usage.paidQuestionsByCourse || {};
		row.usage.paidQuestionsByCourse[course] = Number(row.usage.paidQuestionsByCourse[course] || 0) + questionCount;
		return;
	}
	const { db, FieldValue } = await firebaseBundle();
	const day = lagosDay();
	await db.collection("oracleUsers").doc(user.uid).set({
		email: user.email || null,
		usage: {
			paidQuestionsTotal: FieldValue.increment(questionCount),
			paidQuestionsByDay: { [day]: FieldValue.increment(questionCount) },
			paidQuestionsByCourse: { [course]: FieldValue.increment(questionCount) },
			lastPaidPracticeAt: FieldValue.serverTimestamp()
		},
		updatedAt: FieldValue.serverTimestamp()
	}, { merge: true });
}
async function readSeen(uid) {
	if (!uid) return [];
	if (!firebaseConfigured() || String(uid).startsWith("local_")) return memoryUser(uid).seen.slice();
	const { db } = await firebaseServices();
	const seen = (await db.collection("oracleUsers").doc(uid).get()).get("seenPrompts");
	return Array.isArray(seen) ? seen.filter((item) => typeof item === "string") : [];
}
async function writeSeen(uid, prompts) {
	const next = [];
	for (const prompt of prompts || []) {
		const text = String(prompt || "").replace(/\s+/g, " ").trim().slice(0, 140);
		if (text && !next.includes(text)) next.push(text);
	}
	if (!next.length || !uid) return;
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const user = memoryUser(uid);
		user.seen = [...user.seen, ...next].slice(-80);
		return;
	}
	try {
		const { db } = await firebaseServices();
		const ref = db.collection("oracleUsers").doc(uid);
		const snapshot = await ref.get();
		const merged = [...Array.isArray(snapshot.get("seenPrompts")) ? snapshot.get("seenPrompts") : [], ...next].slice(-80);
		await ref.set({ seenPrompts: merged }, { merge: true });
	} catch (error) {
		console.error("Could not store seen prompts", error?.message);
	}
}
async function readProfile(uid) {
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const user = memoryUser(uid);
		return {
			premiumUntil: user.premiumUntil,
			usage: user.usage,
			tests: user.tests.filter((test) => test.status === "completed").slice(0, 20)
		};
	}
	const { db } = await firebaseServices();
	const userSnapshot = await db.collection("oracleUsers").doc(uid).get();
	const premiumUntil = userSnapshot.get("premiumUntil");
	const snapshot = await db.collection("oracleUsers").doc(uid).collection("tests").orderBy("completedAt", "desc").limit(20).get();
	return {
		premiumUntil: premiumUntil?.toDate?.().toISOString() || null,
		usage: userSnapshot.get("usage") || {},
		tests: snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}))
	};
}
async function saveActivity(user, input) {
	if (!firebaseConfigured() || user.local) return saveActivityMemory(user, input);
	return saveActivityFirebase(user, input);
}
function saveActivityMemory(user, input) {
	const row = memoryUser(user.uid);
	const id = String(input.id);
	let test = row.tests.find((item) => String(item.id) === id);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (input.action === "start") {
		if (!test) {
			test = {
				id,
				course: input.course,
				topics: input.topics,
				total: input.total,
				status: "in_progress",
				startedAt: now,
				answers: {}
			};
			row.tests.unshift(test);
		}
		return {
			saved: true,
			id,
			status: 201
		};
	}
	if (!test) {
		test = {
			id,
			course: input.course,
			topics: input.topics,
			status: "in_progress",
			answers: {}
		};
		row.tests.unshift(test);
	}
	if (input.action === "answer") {
		test.answers = test.answers || {};
		test.answers[input.index] = input.answer;
		return {
			saved: true,
			id,
			status: 200
		};
	}
	if (input.action === "solution" || input.action === "abandon") {
		if (input.action === "abandon" && test.status === "in_progress") {
			test.status = "abandoned";
			test.abandonedAt = now;
		}
		return {
			saved: true,
			id,
			status: 200
		};
	}
	test.course = input.course;
	test.topics = input.topics;
	test.total = input.total;
	test.correct = input.correct;
	test.score = Math.round(input.correct / input.total * 100);
	test.topicResults = input.topicResults;
	test.answers = input.answers;
	test.status = "completed";
	test.completedAt = now;
	test.date = Date.now();
	import("./leaderboard-DcFHLBgc.mjs").then(({ recordScore }) => recordScore({
		uid: user.uid,
		email: user.email,
		name: user.name
	}, {
		id: input.id,
		name: input.name,
		course: input.course,
		total: input.total,
		correct: input.correct
	})).catch((error) => {
		console.error("Could not add the score to the leaderboard", error?.message);
	});
	return {
		saved: true,
		id,
		status: 201
	};
}
async function saveActivityFirebase(user, input) {
	const { FieldValue } = await import("../_libs/firebase-admin+[...].mjs").then((n) => n.t);
	const { db } = await firebaseServices();
	const testId = String(input.id);
	const testRef = db.collection("oracleUsers").doc(user.uid).collection("tests").doc(testId);
	const accountRef = db.collection("oracleUsers").doc(user.uid);
	const activity = accountRef.collection("activity");
	const course = input.course;
	const topics = input.topics;
	const total = input.total;
	if (input.action === "start") {
		const timestamp = FieldValue.serverTimestamp();
		await db.runTransaction(async (transaction) => {
			if ((await transaction.get(testRef)).exists) return;
			transaction.set(testRef, {
				course,
				topics,
				total,
				status: "in_progress",
				startedAt: timestamp
			});
			transaction.set(activity.doc(`test_${testId}_started`), {
				type: "test_started",
				testId,
				course,
				total,
				occurredAt: timestamp
			});
			transaction.set(accountRef, {
				email: user.email || null,
				lastActivityAt: timestamp,
				updatedAt: timestamp
			}, { merge: true });
		});
		return {
			saved: true,
			id: testId,
			status: 201
		};
	}
	if (input.action === "answer") {
		const timestamp = FieldValue.serverTimestamp();
		await db.runTransaction(async (transaction) => {
			const existing = await transaction.get(testRef);
			if (!existing.exists || existing.get("status") !== "in_progress") return;
			transaction.set(testRef, { answers: { [input.index]: input.answer } }, { merge: true });
			transaction.set(activity.doc(`test_${testId}_answer_${input.index}`), {
				type: "question_answered",
				testId,
				course,
				index: input.index,
				...input.answer,
				occurredAt: timestamp
			});
			transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
		});
		return {
			saved: true,
			id: testId,
			status: 200
		};
	}
	if (input.action === "solution") {
		const timestamp = FieldValue.serverTimestamp();
		await db.runTransaction(async (transaction) => {
			const existing = await transaction.get(testRef);
			if (!existing.exists || existing.get("status") !== "in_progress") return;
			transaction.set(activity.doc(`test_${testId}_solution_${input.index}`), {
				type: "solution_viewed",
				testId,
				course,
				index: input.index,
				topic: input.topic,
				occurredAt: timestamp
			});
			transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
		});
		return {
			saved: true,
			id: testId,
			status: 200
		};
	}
	if (input.action === "abandon") {
		const timestamp = FieldValue.serverTimestamp();
		await db.runTransaction(async (transaction) => {
			const existing = await transaction.get(testRef);
			if (!existing.exists || existing.get("status") !== "in_progress") return;
			transaction.set(testRef, {
				status: "abandoned",
				abandonedAt: timestamp
			}, { merge: true });
			transaction.set(activity.doc(`test_${testId}_abandoned`), {
				type: "test_abandoned",
				testId,
				course,
				occurredAt: timestamp
			});
			transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
		});
		return {
			saved: true,
			id: testId,
			status: 200
		};
	}
	const correct = input.correct;
	const score = Math.round(correct / total * 100);
	const saved = await db.runTransaction(async (transaction) => {
		const existing = await transaction.get(testRef);
		if (existing.exists && existing.get("status") === "completed") return false;
		const timestamp = FieldValue.serverTimestamp();
		transaction.set(testRef, {
			course,
			topics,
			total,
			correct,
			score,
			topicResults: input.topicResults,
			answers: input.answers,
			status: "completed",
			completedAt: timestamp
		}, { merge: true });
		transaction.set(accountRef, {
			email: user.email || null,
			lastActivityAt: timestamp,
			updatedAt: timestamp
		}, { merge: true });
		transaction.set(activity.doc(`test_${testId}_completed`), {
			type: "test_completed",
			testId,
			course,
			total,
			correct,
			score,
			completedAt: timestamp
		});
		return true;
	});
	if (saved) try {
		const { recordScore } = await import("./leaderboard-DcFHLBgc.mjs");
		await recordScore(user, {
			id: input.id,
			name: input.name,
			course,
			total,
			correct
		});
	} catch (error) {
		console.error("Could not add the score to the leaderboard", error?.message);
	}
	return {
		saved: true,
		id: testRef.id,
		status: saved ? 201 : 200
	};
}
function siteOrigin(req) {
	const raw = process.env.SITE_URL;
	if (raw) try {
		const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
		return new URL(withProto).origin;
	} catch {}
	return new URL(req.url).origin;
}
var PRICE_KOBO = 1e5;
async function grantPremium({ uid, email, reference, amount, currency }) {
	if (!firebaseConfigured() || String(uid).startsWith("local_")) {
		const prior = payments.get(reference);
		if (prior && prior.uid !== uid) throw new Error("Payment reference already belongs to another account.");
		if (prior?.status === "success" && prior.premiumUntil) return new Date(prior.premiumUntil);
		const user = memoryUser(uid);
		const currentExpiry = user.premiumUntil ? new Date(user.premiumUntil) : null;
		const expiry = paidAccessExpiry(currentExpiry && currentExpiry.getTime() > Date.now() ? currentExpiry : /* @__PURE__ */ new Date());
		user.email = email || user.email;
		user.premiumUntil = expiry.toISOString();
		payments.set(reference, {
			uid,
			amount,
			currency,
			status: "success",
			premiumUntil: expiry.toISOString()
		});
		return expiry;
	}
	const { db, FieldValue, Timestamp } = await firebaseBundle();
	const userRef = db.collection("oracleUsers").doc(uid);
	const paymentRef = db.collection("oraclePayments").doc(reference);
	const activityRef = userRef.collection("activity").doc(`payment_${reference}_succeeded`);
	return db.runTransaction(async (transaction) => {
		const priorPayment = await transaction.get(paymentRef);
		if (priorPayment.exists && priorPayment.get("uid") !== uid) throw new Error("Payment reference already belongs to another account.");
		const existingExpiry = priorPayment.get("premiumUntil")?.toDate?.();
		if (priorPayment.get("status") === "success" && existingExpiry) return existingExpiry;
		const currentExpiry = (await transaction.get(userRef)).get("premiumUntil")?.toDate?.();
		const expiry = paidAccessExpiry(currentExpiry && currentExpiry.getTime() > Date.now() ? currentExpiry : /* @__PURE__ */ new Date());
		const timestamp = FieldValue.serverTimestamp();
		transaction.set(userRef, {
			email: email || null,
			premiumUntil: Timestamp.fromDate(expiry),
			lastPaymentReference: reference,
			lastActivityAt: timestamp,
			updatedAt: timestamp
		}, { merge: true });
		transaction.set(paymentRef, {
			uid,
			amount,
			currency,
			status: "success",
			plan: "oracle-semester",
			premiumUntil: Timestamp.fromDate(expiry),
			verifiedAt: timestamp
		}, { merge: true });
		transaction.set(activityRef, {
			type: "payment_succeeded",
			reference,
			amount,
			currency,
			plan: "oracle-semester",
			premiumUntil: Timestamp.fromDate(expiry),
			occurredAt: timestamp
		});
		return expiry;
	});
}
async function initializePayment(user, req) {
	if (!process.env.PAYSTACK_SECRET_KEY) return json(503, { error: "Payments are not configured yet." });
	if (!user.email) return json(400, { error: user.local ? "Paid checkout needs the email on your Exam Oracle account." : "Your account needs an email address." });
	let callbackUrl;
	try {
		callbackUrl = new URL("/exam-oracle.html", siteOrigin(req));
	} catch {
		return json(503, { error: "SITE_URL is not configured correctly." });
	}
	callbackUrl.searchParams.set("payment", "paystack");
	const response = await fetch("https://api.paystack.co/transaction/initialize", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: user.email,
			amount: PRICE_KOBO,
			currency: "NGN",
			callback_url: callbackUrl.toString(),
			metadata: {
				oracleUid: user.uid,
				plan: "oracle-semester"
			}
		})
	});
	const result = await response.json();
	if (!response.ok || !result.status || !result.data?.authorization_url) {
		console.error("Paystack initialization failed", result.message || response.status);
		return json(502, { error: "Could not start payment. Please try again." });
	}
	const reference = result.data.reference;
	if (!firebaseConfigured() || user.local) payments.set(reference, {
		uid: user.uid,
		amount: PRICE_KOBO,
		currency: "NGN",
		status: "pending"
	});
	else {
		const { db, FieldValue } = await firebaseBundle();
		const timestamp = FieldValue.serverTimestamp();
		const userRef = db.collection("oracleUsers").doc(user.uid);
		await db.runTransaction(async (transaction) => {
			transaction.set(db.collection("oraclePayments").doc(reference), {
				uid: user.uid,
				amount: PRICE_KOBO,
				currency: "NGN",
				status: "pending",
				plan: "oracle-semester",
				createdAt: timestamp
			});
			transaction.set(userRef.collection("activity").doc(`payment_${reference}_started`), {
				type: "payment_started",
				reference,
				amount: PRICE_KOBO,
				currency: "NGN",
				plan: "oracle-semester",
				occurredAt: timestamp
			});
			transaction.set(userRef, {
				email: user.email,
				lastActivityAt: timestamp,
				updatedAt: timestamp
			}, { merge: true });
		});
	}
	return json(200, { authorizationUrl: result.data.authorization_url });
}
async function verifyPayment(user, reference) {
	if (!process.env.PAYSTACK_SECRET_KEY) return json(503, { error: "Payments are not configured yet." });
	const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } });
	const result = await response.json();
	const payment = result.data;
	if (!response.ok || !result.status || payment?.status !== "success" || payment.amount !== PRICE_KOBO || payment.currency !== "NGN" || payment.metadata?.oracleUid !== user.uid || payment.metadata?.plan !== "oracle-semester") return json(402, { error: "This payment could not be verified for your account." });
	return json(200, {
		paid: true,
		premiumUntil: (await grantPremium({
			uid: user.uid,
			email: user.email,
			reference,
			amount: PRICE_KOBO,
			currency: "NGN"
		})).toISOString()
	});
}
async function handlePaystackWebhook(req) {
	const secret = process.env.PAYSTACK_SECRET_KEY;
	if (!secret) return new Response("Webhook is not configured.", { status: 503 });
	const rawBody = await req.text();
	const supplied = req.headers.get("x-paystack-signature") || "";
	const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
	const suppliedBuffer = Buffer.from(supplied, "utf8");
	const expectedBuffer = Buffer.from(expected, "utf8");
	if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) return new Response("Invalid signature.", { status: 401 });
	let event;
	try {
		event = JSON.parse(rawBody);
	} catch {
		return new Response("Invalid JSON.", { status: 400 });
	}
	if (event.event !== "charge.success") return new Response("OK", { status: 200 });
	const payment = event.data;
	if (payment?.status !== "success" || payment.amount !== PRICE_KOBO || payment.currency !== "NGN" || payment.metadata?.plan !== "oracle-semester" || typeof payment.metadata?.oracleUid !== "string" || typeof payment.reference !== "string") return new Response("Payment does not match an Oracle plan.", { status: 400 });
	try {
		await grantPremium({
			uid: payment.metadata.oracleUid,
			email: payment.customer?.email,
			reference: payment.reference,
			amount: payment.amount,
			currency: payment.currency
		});
		return new Response("OK", { status: 200 });
	} catch (error) {
		console.error("Paystack webhook processing failed", error?.message);
		return new Response("Could not process payment.", { status: 500 });
	}
}
var GENERIC_RULES = `No past-question PDF has been loaded for this course yet. Write questions from the standard first-year (100-level) university syllabus for the course and topics named. Keep them at the difficulty of Nigerian university CBT exams, especially ABUAD 100-level papers. Do not claim they are past questions.`;
var COURSES = {
	"MTH 101": {
		label: "MTH 101",
		name: "Mathematics",
		grounded: true,
		topics: [
			"Complex numbers",
			"Sequences and series",
			"Quadratic equations",
			"Sets",
			"Number systems"
		],
		source: `ABUAD MTH 101 practice drawn from the supplied assignment (PDFs/final_pq.pdf).

Use these patterns and difficulty, and write fresh numbers unless you are explicitly returning a known item:
- Complex numbers: z1 = 7 + 3i, z2 = 4 - 2i, sums, products, real and imaginary parts.
- Sequences: a six-term GP with first term 192 and ratio 1.5; arithmetic series with a stated difference.
- Quadratics: x^2 - 4x - 6 = 0 has roots 2 ± sqrt(10); roots of x^2 - x + 1 = 0 satisfy x^3 = -1.
- Sets: symmetric difference, unions and intersections.
- Number systems: five consecutive integers summing to 100 start at 18; the even numbers from 100 to 998 sum to 247050.

Do not claim a newly invented question is a verbatim past question. Matrices are not on this topic list.`
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
			"Coordinate geometry"
		],
		source: GENERIC_RULES
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
			"Conservation laws"
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

Do not claim a newly invented question is a verbatim past question.`
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
			"Kinetic theory of gases"
		],
		source: `ABUAD PHY 103 Properties of Matter lecture notes. Not electricity or magnetism.

- Elasticity: a material regains shape after the distorting force is removed, up to the elastic limit. Beyond that is the yield point, then the breaking point. Hooke's law: within the elastic limit, F = ke. Stress = F/A. Strain = extension / original length. Elastic modulus = stress / strain. Young's modulus is for change of length, shear modulus for change of shape, bulk modulus for change of volume.
- Hydrostatics: density = mass/volume. Specific gravity is density relative to water. Pressure in a liquid increases with depth, P = ρgh. Archimedes: upthrust equals the weight of fluid displaced. Surface tension, adhesion, cohesion and capillarity.
- Temperature and heat: temperature scales, including 0°C = 273 K. Thermal expansion. Heat capacity and phase change. Q = mcΔT when there is no change of state.
- Heat transfer: conduction through a material without bulk flow, convection by movement of a fluid, radiation with no material medium required. The notes spell convection as "convention"; use convection.
- Laws of thermodynamics: zeroth law (bodies in thermal equilibrium with a third are in equilibrium with each other). First law in these notes: ΔQ = ΔU + ΔW. Constant volume: ΔW = 0 so ΔQ = ΔU. Ideal-gas isothermal change: ΔU = 0 so ΔQ = ΔW. Adiabatic: ΔQ = 0 so 0 = ΔU + ΔW.
- Kinetic theory of gases: gas laws (Boyle, Charles) and the kinetic model. Pressure comes from molecular collisions. For an ideal gas, PV = nRT and average kinetic energy rises with temperature.

Do not claim a newly invented question is a verbatim past question.`
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
			"Correlation and regression"
		],
		source: GENERIC_RULES
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
			"Acids, bases and pH"
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

Do not claim a newly invented question is a verbatim past question.`
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
			"Reproduction"
		],
		source: `ABUAD BIO 101 lecture notes. Stay inside these sections.

- Cell structure and organization: the cell is the basic unit of structure and function. Cell biology covers structure, function and molecules of the cell. Compare prokaryotic and eukaryotic cells. Organelles include the nucleus, membrane, ribosomes, mitochondria and lysosomes.
- Classification of living things: characteristics remembered as MR.NIGER D (movement, respiration, nutrition, irritability, growth, excretion, reproduction, death). Five kingdoms. Binomial nomenclature. Hierarchy: kingdom, phylum, class, order, family, genus, species. Parasites live on or in a host; predation is a different feeding relationship.
- Cell division: binary fission, mitosis and meiosis. The cell cycle has G1, S and G2. Mitosis (prophase, metaphase, anaphase, telophase) keeps the chromosome number the same and is used for growth and repair. Meiosis halves the chromosome number and produces genetic variation.
- Genetics: Mendel's pea experiments. Law of segregation and law of independent assortment. Dominant and recessive alleles. Chromosomal theory of inheritance. X-linkage.
- Tissues: a tissue is a group of similar cells with one function. Four types: epithelial, connective, muscle and nervous. Connective tissue includes proper (loose and dense), fluid (blood and lymph) and supporting (bone and cartilage). Muscle is skeletal (voluntary, striated), smooth (involuntary) or cardiac.
- Reproduction: gametogenesis. Spermatogonia divide by mitosis, then meiosis forms haploid sperm. Oogonia divide by mitosis in the foetal ovary. Meiosis occurs in sex cells, not ordinary body cells.

Do not claim a newly invented question is a verbatim past question.`
	}
};
var RESPONSE_HINT = `Return JSON only, with this shape:
{"questions":[{"topic":"","prompt":"","options":["","","",""],"answer":0,"correct":"","steps":["",""]}]}`;
function groqModel() {
	return (process.env.GROQ_MODEL || "openai/gpt-oss-20b").split(",")[0].trim() || "openai/gpt-oss-20b";
}
function groqKeys() {
	const slots = /* @__PURE__ */ new Map();
	for (const [name, raw] of Object.entries(process.env)) {
		if (name === "GROQ_API_KEY") slots.set(1, raw);
		const match = /^GROQ_API_KEY_(\d+)$/.exec(name);
		if (match) slots.set(Number(match[1]), raw);
	}
	const numbered = [...slots.keys()].sort((a, b) => a - b).map((slot) => String(slots.get(slot) || "").trim()).filter(Boolean);
	const listed = String(process.env.GROQ_API_KEYS || "").split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
	return [.../* @__PURE__ */ new Set([...numbered, ...listed])];
}
function groqConfigured() {
	return groqKeys().length > 0;
}
function buildPrompt({ course, cfg, topics, count, avoid, batch }) {
	const avoidBlock = avoid.length ? `\nDo NOT repeat or closely paraphrase these questions already asked:\n${avoid.map((item) => `- ${item}`).join("\n")}\n` : "";
	return `You write practice questions for ABUAD (Afe Babalola University) ${course} (${cfg.name}), in the style of Nigerian university computer-based tests (CBT).

Write exactly ${count} multiple-choice questions on these topics only: ${topics.join("; ")}.
Rules:
- Exactly 4 options. One of them must be the result you are about to calculate. The other three are typical mistakes.
- Match the difficulty of ABUAD 100-level CBT papers: short stems, one idea each, a mix of recall and short working.
- This is set #${batch + 1}. Use fresh numbers and situations. Do not reuse a stem with only a number changed if the method is identical to an avoided question.
- Do not choose "answer" first. Solve the question in "steps" until you have one result.
- One of the 4 options must be exactly that result. The other three are typical mistakes.
- End "steps" with one sentence in this exact form: The correct answer is <the result you just calculated>.
- That result is what gets saved. If it is not already one of the options, it replaces the option you were going to mark, and it becomes the correct option.
- Never finish with a different value from the one the working reached. If the steps find 2 ± sqrt(10), the marked option is 2 ± sqrt(10), not another choice.
- If the steps reach two different results, the question is thrown away. Finish the arithmetic before you write the final sentence.
- "steps" is shown to the student word for word. Never write "wait", "recalculate", "actually", "correction", "option index", "none match", or "most plausible".
- Plain text only. No LaTeX, no markdown, no $ signs. Write maths as x^2, sqrt(x), a/b, 3 + 4i.
- A one-fact recall question needs 2 or 3 full sentences, then the final answer sentence.
- A calculation, derivation, or law question needs the formula, the substitution, the result with units, why the most tempting wrong option fails, then the final answer sentence.
- Each step is one or two complete sentences.
- "answer" must still be the index of the option named in the final sentence. "correct" must be that option copied exactly.
- "topic" must be copied exactly from the topic list above.
${avoidBlock}
SOURCE MATERIAL:
${cfg.source}

${RESPONSE_HINT}`;
}
function parseModelJson(text) {
	const cleaned = String(text || "").replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
	const start = cleaned.indexOf("{");
	const end = cleaned.lastIndexOf("}");
	if (start === -1 || end <= start) throw new Error("No JSON object");
	return JSON.parse(cleaned.slice(start, end + 1));
}
function groqClient(apiKey) {
	return new OpenAI({
		apiKey,
		baseURL: "https://api.groq.com/openai/v1",
		timeout: 2e4,
		maxRetries: 0
	});
}
function failure(error) {
	return {
		status: error?.status || error?.statusCode || 502,
		message: error?.error?.message || error?.message || "Groq request failed"
	};
}
var nextKey = 0;
async function callGroq(prompt) {
	const keys = groqKeys();
	const model = groqModel();
	if (!keys.length) return { error: {
		status: 503,
		message: "No Groq API key"
	} };
	const start = nextKey % keys.length;
	let last = {
		status: 502,
		message: "Groq did not respond"
	};
	for (let offset = 0; offset < keys.length; offset++) {
		const apiKey = keys[(start + offset) % keys.length];
		const client = groqClient(apiKey);
		const attempts = [{ reasoning_effort: "low" }, {}];
		let tryNextKey = false;
		for (const extras of attempts) try {
			const text = (await client.chat.completions.create({
				model,
				messages: [{
					role: "system",
					content: "You are Exam Oracle, writing verified ABUAD CBT practice questions. Reply with one JSON object and nothing else."
				}, {
					role: "user",
					content: prompt
				}],
				response_format: { type: "json_object" },
				temperature: .4,
				max_completion_tokens: 4e3,
				...extras
			})).choices?.[0]?.message?.content || "";
			if (!text.trim()) {
				last = {
					status: 502,
					message: "Empty response"
				};
				tryNextKey = true;
				break;
			}
			nextKey = (start + offset + 1) % keys.length;
			return {
				parsed: parseModelJson(text),
				model
			};
		} catch (error) {
			last = failure(error);
			console.error("Groq error", {
				model,
				status: last.status,
				message: String(last.message).slice(0, 400)
			});
			if (last.status === 400 && extras.reasoning_effort) continue;
			if (last.status === 400) return { error: last };
			tryNextKey = true;
			break;
		}
		if (tryNextKey) continue;
	}
	return { error: last };
}
function shuffleOptions(question) {
	const order = question.options.map((_, index) => index);
	for (let i = order.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[order[i], order[j]] = [order[j], order[i]];
	}
	return {
		...question,
		options: order.map((index) => question.options[index]),
		answer: order.indexOf(question.answer)
	};
}
function acceptQuestions(parsed, topics, avoid, limit) {
	const seen = new Set((avoid || []).map((item) => String(item).toLowerCase()));
	const accepted = [];
	for (const question of Array.isArray(parsed?.questions) ? parsed.questions : []) {
		if (!question || typeof question.prompt !== "string" || !question.prompt.trim()) continue;
		if (!topics.includes(question.topic)) continue;
		if (!Array.isArray(question.options) || question.options.length !== 4) continue;
		if (!question.options.every((option) => typeof option === "string" && option.trim())) continue;
		if (new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) continue;
		if (!Array.isArray(question.steps) || question.steps.length < 1 || !question.steps.every((step) => typeof step === "string" && step.trim())) continue;
		const verified = answerFromExplanation(question);
		if (!verified) continue;
		if (!isFresh(question.prompt, avoid) || seen.has(question.prompt.trim().toLowerCase())) continue;
		if ((avoid || []).some((item) => similarPrompt(question.prompt, item))) continue;
		seen.add(question.prompt.trim().toLowerCase());
		accepted.push(labelQuestion({
			topic: question.topic,
			prompt: question.prompt.trim(),
			options: verified.options,
			answer: verified.answer,
			steps: verified.steps,
			origin: "oracle"
		}));
		if (accepted.length >= limit) break;
	}
	return accepted;
}
function withSource(questions, course) {
	const published = [];
	for (const question of questions) {
		const aligned = alignQuestion(question);
		if (!aligned) continue;
		published.push({
			...shuffleOptions(labelQuestion(aligned)),
			course
		});
	}
	return published;
}
async function handleGenerate(req, user) {
	const paidByPromo = promoActive();
	let paid = paidByPromo;
	if (!paid && user && !user.local) try {
		paid = await hasPremium(user.uid);
	} catch (error) {
		console.error("Premium entitlement lookup failed", error?.message);
		return json(503, { error: "Account access could not be checked. Please try again." });
	}
	else if (!paid && user?.local) paid = await hasPremium(user.uid);
	if (req.method === "GET") {
		const used = user ? await readDailyUsage(user.uid) : {};
		return json(200, {
			paid: paid || paidByPromo,
			sitewidePremium: paidByPromo,
			promoUntil: promoUntilDate(),
			promoActive: paidByPromo,
			authMode: authMode(),
			freeDaily: 10,
			freeCoursesDaily: 3,
			subjectsUsed: activeCourseIds(used).length,
			maxPerTest: 60,
			welcomeTestAvailable: false,
			used,
			courses: Object.entries(COURSES).map(([id, course]) => ({
				id,
				label: course.label,
				name: course.name,
				topics: course.topics,
				grounded: course.grounded
			}))
		});
	}
	if (req.method !== "POST") return json(405, { error: "Use POST to request questions." });
	if (!user) return json(401, {
		code: "auth_required",
		error: "Sign in to your account before starting a test."
	});
	let input;
	try {
		input = await req.json();
	} catch {
		return json(400, { error: "Request body must be valid JSON." });
	}
	const cfg = COURSES[input.course];
	const topics = Array.isArray(input.topics) ? input.topics.filter((topic) => cfg?.topics.includes(topic)) : [];
	const count = Number(input.count);
	if (!cfg || !topics.length || !Number.isInteger(count) || count < 1 || count > 3) return json(400, { error: `Choose a course, at least one topic, and 1 to 3 questions per request.` });
	let dailyUsage = {};
	let used = 0;
	let allowed = count;
	if (!paid) {
		dailyUsage = await readDailyUsage(user.uid);
		used = dailyUsage[input.course] || 0;
		if (used >= 10) return json(429, {
			code: "quota",
			used,
			error: `You've used your 10 free ${input.course} questions for today. Come back tomorrow or upgrade for unlimited practice.`
		});
		if (!dailyUsage[input.course] && activeCourseIds(dailyUsage).length >= 3) return json(429, {
			code: "subject_limit",
			subjectsUsed: activeCourseIds(dailyUsage).length,
			error: `You've used all 3 free courses for today. Upgrade or come back tomorrow.`
		});
		allowed = Math.min(count, 10 - used);
	}
	const clientAvoid = Array.isArray(input.avoid) ? input.avoid.filter((item) => typeof item === "string").slice(0, 24).map((item) => item.slice(0, 140)) : [];
	const remembered = await readSeen(user.uid);
	const avoid = [...clientAvoid, ...remembered].slice(-40);
	const batch = Number.isInteger(input.batch) ? input.batch : 0;
	let questions = [];
	let fallback = false;
	if (groqConfigured()) try {
		const result = await callGroq(buildPrompt({
			course: input.course,
			cfg,
			topics,
			count: allowed,
			avoid,
			batch
		}));
		if (result.parsed) questions = acceptQuestions(result.parsed, topics, avoid, allowed);
		else {
			console.error("Groq unavailable", result.error);
			fallback = true;
		}
	} catch (error) {
		console.error("Question generation failed", error?.message);
		fallback = true;
	}
	else fallback = true;
	const usedPrompts = () => [...avoid, ...questions.map((question) => question.prompt)];
	if (questions.length < allowed) {
		fallback = questions.length === 0 || fallback;
		const local = pickLocalQuestions({
			course: input.course,
			topics,
			count: allowed - questions.length,
			avoid: usedPrompts(),
			batch,
			salt: `${user.uid}:${Date.now()}`
		});
		questions = questions.concat(local);
	}
	questions = withSource(questions, input.course).slice(0, allowed);
	let fill = 0;
	while (questions.length < allowed && fill < 3) {
		fill += 1;
		const extra = withSource(pickLocalQuestions({
			course: input.course,
			topics,
			count: allowed - questions.length,
			avoid: [...avoid, ...questions.map((question) => question.prompt)],
			batch: batch + fill,
			salt: `${user.uid}:${Date.now()}:${fill}`
		}), input.course);
		if (!extra.length) break;
		questions = questions.concat(extra).slice(0, allowed);
	}
	if (!questions.length) return json(502, {
		code: "empty",
		error: "Oracle couldn't write a usable set. Please try again."
	});
	await writeSeen(user.uid, questions.map((question) => question.prompt));
	if (!paid) {
		const usage = await recordFreeUsage(user.uid, input.course, questions.length, 10, 3);
		if (!usage.allowed) return json(429, {
			code: usage.code,
			used: usage.used,
			subjectsUsed: usage.subjectsUsed,
			error: usage.code === "quota" ? `You've used your 10 free ${input.course} questions for today. Come back tomorrow or upgrade for unlimited practice.` : `You've used all 3 free courses for today. Upgrade or come back tomorrow.`
		});
		used = usage.used;
		dailyUsage[input.course] = used;
	} else if (user && !paidByPromo) try {
		await recordPaidUsage(user, input.course, questions.length);
	} catch (error) {
		console.error("Paid usage record failed", error?.message);
	}
	return json(200, {
		questions,
		used,
		paid,
		fallback,
		subjectsUsed: paid ? void 0 : activeCourseIds(dailyUsage).length
	});
}
var DAY$1 = 864e5;
var LAGOS = 36e5;
var DAILY_CAP = 3;
var memoryScores = [];
function publicName(raw, email) {
	const cleaned = String(raw || "").replace(/<[^>]*>/g, " ").replace(/[^\p{L}\p{N} .'-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 28);
	if (cleaned) return cleaned;
	const local = String(email || "").split("@")[0].replace(/[._+-]+/g, " ").trim();
	return local ? local.slice(0, 28) : "Student";
}
function lagosStamp(ms) {
	return new Date(ms + LAGOS);
}
function startOfLagosDay(ms) {
	const d = lagosStamp(ms);
	return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - LAGOS;
}
function startOfLagosWeek(ms) {
	const start = startOfLagosDay(ms);
	return start - (lagosStamp(start).getUTCDay() + 6) % 7 * DAY$1;
}
function startOfLagosMonth(ms) {
	const d = lagosStamp(ms);
	return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - LAGOS;
}
function weekId(ms) {
	const d = lagosStamp(startOfLagosWeek(ms));
	const month = String(d.getUTCMonth() + 1).padStart(2, "0");
	const day = String(d.getUTCDate()).padStart(2, "0");
	return `W${d.getUTCFullYear()}${month}${day}`;
}
function monthId(ms) {
	const d = lagosStamp(startOfLagosMonth(ms));
	return `M${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function claimCode(periodId, uid) {
	const salt = process.env.QUOTA_SALT || "exam-oracle-prize";
	return `ORC-${periodId}-${createHmac("sha256", salt).update(`${periodId}:${uid}`).digest("hex").slice(0, 6).toUpperCase()}`;
}
function average(rows) {
	if (!rows.length) return 0;
	return rows.reduce((sum, row) => sum + row.score, 0) / rows.length;
}
function countedTests(rows) {
	const byDay = /* @__PURE__ */ new Map();
	const sorted = rows.slice().sort((a, b) => a.completedMs - b.completedMs);
	const kept = [];
	for (const row of sorted) {
		const day = startOfLagosDay(row.completedMs);
		const used = byDay.get(day) || 0;
		if (used >= DAILY_CAP) continue;
		byDay.set(day, used + 1);
		kept.push(row);
	}
	return kept;
}
function rankWindow(rows, from, to) {
	const grouped = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (row.completedMs < from || row.completedMs >= to) continue;
		if (!grouped.has(row.uid)) grouped.set(row.uid, []);
		grouped.get(row.uid).push(row);
	}
	const students = [];
	for (const [uid, tests] of grouped) {
		const counted = countedTests(tests);
		if (!counted.length) continue;
		const avg = average(counted);
		const half = Math.floor(counted.length / 2);
		const improvement = half >= 2 ? Math.round(average(counted.slice(half)) - average(counted.slice(0, half))) : 0;
		const days = new Set(counted.map((row) => startOfLagosDay(row.completedMs))).size;
		const latest = counted[counted.length - 1];
		students.push({
			uid,
			name: latest.name || "Student",
			average: Math.round(avg),
			improvement,
			tests: counted.length,
			days,
			points: Math.round(avg * 10 + Math.max(0, improvement) * 4 + days * 15)
		});
	}
	students.sort((a, b) => b.points - a.points || b.average - a.average || b.tests - a.tests);
	return students.map((student, index) => ({
		...student,
		rank: index + 1
	}));
}
function bucketSeries(rows, buckets) {
	return buckets.map((bucket) => {
		const inside = rows.filter((row) => row.completedMs >= bucket.from && row.completedMs < bucket.to);
		return {
			label: bucket.label,
			tests: inside.length,
			average: inside.length ? Math.round(average(inside)) : 0
		};
	});
}
function dayBuckets(now, count) {
	const end = startOfLagosDay(now) + DAY$1;
	const buckets = [];
	for (let i = count - 1; i >= 0; i--) {
		const from = end - (i + 1) * DAY$1;
		buckets.push({
			from,
			to: from + DAY$1,
			label: lagosStamp(from).toLocaleDateString("en-GB", {
				weekday: "short",
				timeZone: "UTC"
			})
		});
	}
	return buckets;
}
function weekBuckets(now, count) {
	const end = startOfLagosWeek(now) + 7 * DAY$1;
	const buckets = [];
	for (let i = count - 1; i >= 0; i--) {
		const from = end - (i + 1) * 7 * DAY$1;
		buckets.push({
			from,
			to: from + 7 * DAY$1,
			label: lagosStamp(from).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				timeZone: "UTC"
			})
		});
	}
	return buckets;
}
function monthBuckets(now, count) {
	const start = startOfLagosMonth(now);
	const buckets = [];
	for (let i = count - 1; i >= 0; i--) {
		const d = lagosStamp(start);
		const from = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1) - LAGOS;
		const next = lagosStamp(from);
		const to = Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 1) - LAGOS;
		buckets.push({
			from,
			to,
			label: lagosStamp(from).toLocaleDateString("en-GB", {
				month: "short",
				timeZone: "UTC"
			})
		});
	}
	return buckets;
}
function prizeView(leader, periodId, viewerUid) {
	if (!leader) return {
		leaderName: null,
		yours: false,
		locked: true,
		code: null
	};
	const yours = Boolean(viewerUid && viewerUid === leader.uid);
	return {
		leaderName: leader.name,
		yours,
		locked: !yours,
		code: yours ? claimCode(periodId, leader.uid) : null
	};
}
function weeklyPrize(rows, viewerUid, now) {
	const weekStart = startOfLagosWeek(now);
	const finishedFrom = weekStart - 7 * DAY$1;
	const winner = rankWindow(rows, finishedFrom, weekStart)[0] || null;
	const view = prizeView(winner, weekId(finishedFrom), viewerUid);
	const note = view.yours ? "You won the finished week. Message the admin with this code." : winner ? `Locked. ${winner.name} won the finished week. The code opens only for that student, from Monday 00:00.` : "Locked until Monday 00:00. Even this week's leader cannot claim until the week has ended.";
	return {
		...view,
		note
	};
}
function assembleBoard(rows, viewerUid, now = Date.now()) {
	const dayStart = startOfLagosDay(now);
	const weekStart = startOfLagosWeek(now);
	const monthStart = startOfLagosMonth(now);
	const periods = {
		daily: {
			label: "Today",
			from: dayStart,
			to: dayStart + DAY$1,
			rows: rankWindow(rows, dayStart, dayStart + DAY$1),
			chart: bucketSeries(rows, dayBuckets(now, 7))
		},
		weekly: {
			label: "This week",
			from: weekStart,
			to: weekStart + 7 * DAY$1,
			rows: rankWindow(rows, weekStart, weekStart + 7 * DAY$1),
			chart: bucketSeries(rows, weekBuckets(now, 8))
		},
		monthly: {
			label: "This month",
			from: monthStart,
			to: Date.UTC(lagosStamp(monthStart).getUTCFullYear(), lagosStamp(monthStart).getUTCMonth() + 1, 1) - LAGOS,
			rows: rankWindow(rows, monthStart, Date.UTC(lagosStamp(monthStart).getUTCFullYear(), lagosStamp(monthStart).getUTCMonth() + 1, 1) - LAGOS),
			chart: bucketSeries(rows, monthBuckets(now, 6))
		}
	};
	const present = (list) => list.slice(0, 20).map((row) => ({
		rank: row.rank,
		name: row.name,
		you: Boolean(viewerUid && row.uid === viewerUid),
		average: row.average,
		improvement: row.improvement,
		tests: row.tests,
		days: row.days,
		points: row.points
	}));
	return {
		updatedAt: new Date(now).toISOString(),
		ranking: "Average score, improvement across the period, and days practised. At most 3 tests a day count. Times are Lagos.",
		periods: {
			daily: {
				...periods.daily,
				rows: present(periods.daily.rows)
			},
			weekly: {
				...periods.weekly,
				rows: present(periods.weekly.rows)
			},
			monthly: {
				...periods.monthly,
				rows: present(periods.monthly.rows)
			}
		},
		prizes: {
			weekly: {
				title: "Weekly prize",
				reward: "",
				...weeklyPrize(rows, viewerUid, now)
			},
			monthly: {
				title: "Monthly prize",
				reward: "Next month free",
				...prizeView(periods.monthly.rows[0], monthId(now), viewerUid),
				note: periods.monthly.rows[0] && viewerUid === periods.monthly.rows[0].uid ? "Message the admin with this code to confirm you won." : "This code stays locked because you are not the winner."
			}
		},
		whatsapp: "2348165689362"
	};
}
function normaliseStored(data, id) {
	const completedMs = Number(data.completedMs || data.completedAt?.toMillis?.() || 0);
	const score = Number(data.score);
	if (!data.uid || !Number.isFinite(completedMs) || completedMs <= 0) return null;
	if (!Number.isFinite(score)) return null;
	return {
		id,
		uid: String(data.uid),
		name: publicName(data.name, data.email),
		score: Math.max(0, Math.min(100, Math.round(score))),
		completedMs
	};
}
async function readFirebaseScores() {
	const { db } = await firebaseServices();
	const snap = await db.collection("oracleBoard").limit(800).get();
	const rows = [];
	const seen = /* @__PURE__ */ new Set();
	for (const doc of snap.docs) {
		const row = normaliseStored(doc.data(), doc.id);
		if (!row || seen.has(row.id)) continue;
		seen.add(row.id);
		rows.push(row);
	}
	try {
		const legacy = await db.collectionGroup("tests").where("status", "==", "completed").limit(300).get();
		for (const doc of legacy.docs) {
			const uid = doc.ref.parent?.parent?.id;
			const id = `${uid}_${doc.id}`;
			if (!uid || seen.has(id)) continue;
			const data = doc.data();
			const row = normaliseStored({
				uid,
				name: data.displayName,
				score: data.score,
				completedMs: data.completedAt?.toMillis?.() || 0
			}, id);
			if (!row) continue;
			seen.add(id);
			rows.push(row);
		}
	} catch (error) {
		console.error("Older tests were not added to the leaderboard", error?.message);
	}
	return rows;
}
async function recordScore(user, input) {
	const score = Math.round(input.correct / input.total * 100);
	const row = {
		id: `${user.uid}_${input.id}`,
		uid: user.uid,
		name: publicName(input.name, user.email || user.name),
		score,
		completedMs: Date.now(),
		course: input.course || ""
	};
	if (!firebaseConfigured() || String(user.uid).startsWith("local_")) {
		const index = memoryScores.findIndex((item) => item.id === row.id);
		if (index >= 0) memoryScores[index] = row;
		else memoryScores.push(row);
		return;
	}
	try {
		const { db } = await firebaseServices();
		await db.collection("oracleBoard").doc(row.id).set({
			uid: row.uid,
			name: row.name,
			score: row.score,
			course: row.course,
			completedMs: row.completedMs
		});
	} catch (error) {
		console.error("Could not publish leaderboard score", error?.message);
	}
}
async function leaderboardFor(viewerUid) {
	const rows = memoryScores.slice();
	const seen = new Set(rows.map((row) => row.id));
	if (firebaseConfigured()) try {
		for (const row of await readFirebaseScores()) {
			if (seen.has(row.id)) continue;
			seen.add(row.id);
			rows.push(row);
		}
	} catch (error) {
		console.error("Leaderboard scores could not be read", error?.message);
	}
	return assembleBoard(rows, viewerUid || null);
}
var DAY = 864e5;
var ADMIN_EMAIL = "burhantutors@gmail.com";
function isAdmin(user) {
	if (!user || user.local) return false;
	return String(user.email || "").trim().toLowerCase() === ADMIN_EMAIL;
}
function nextMonthStart(ms) {
	const start = startOfLagosMonth(ms);
	const d = new Date(start + 36e5);
	return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - 36e5;
}
function winnerCard(rows, from, to, periodId, withCode) {
	const leader = rankWindow(rows, from, to)[0] || null;
	if (!leader) return null;
	return {
		name: leader.name,
		points: leader.points,
		average: leader.average,
		tests: leader.tests,
		code: withCode ? claimCode(periodId, leader.uid) : null
	};
}
function summariseAdmin({ authUsers = [], profiles = [], payments = [], scores = [], truncated = false, scoresTruncated = false, authNote = "", firebase = true, now = Date.now() } = {}) {
	const dayStart = startOfLagosDay(now);
	const weekStart = startOfLagosWeek(now);
	const monthStart = startOfLagosMonth(now);
	const profileByUid = new Map(profiles.map((profile) => [profile.uid, profile]));
	const authByUid = new Map(authUsers.map((user) => [user.uid, user]));
	const successful = payments.filter((payment) => payment.status === "success");
	const todayScores = scores.filter((row) => row.completedMs >= dayStart && row.completedMs < dayStart + DAY);
	const weekScores = scores.filter((row) => row.completedMs >= weekStart && row.completedMs < weekStart + 7 * DAY);
	const courses = /* @__PURE__ */ new Map();
	for (const row of scores) {
		const name = row.course || "Other";
		const current = courses.get(name) || {
			course: name,
			tests: 0,
			total: 0
		};
		current.tests += 1;
		current.total += row.score;
		courses.set(name, current);
	}
	const boardRows = scores.map((row) => ({
		id: `${row.uid}:${row.completedMs}`,
		uid: row.uid,
		name: row.name || "Student",
		score: row.score,
		completedMs: row.completedMs
	}));
	const emailFor = (uid) => profileByUid.get(uid)?.email || authByUid.get(uid)?.email || "Unknown";
	return {
		generatedAt: new Date(now).toISOString(),
		truncated,
		scoresTruncated,
		authNote,
		firebase,
		promo: {
			active: promoActive(now),
			until: promoUntilDate()
		},
		priceNaira: 1e3,
		groqKeys: groqKeys().length,
		accounts: authUsers.length,
		newThisWeek: authUsers.filter((user) => user.createdAt >= now - 7 * DAY).length,
		profiles: profiles.length,
		paidNow: profiles.filter((profile) => profile.premiumUntilMs > now).length,
		payments: successful.length,
		pendingPayments: payments.filter((payment) => payment.status === "pending").length,
		revenueNaira: Math.round(successful.reduce((sum, payment) => sum + (Number(payment.amountKobo) || 0), 0) / 100),
		tests: scores.length,
		testsToday: todayScores.length,
		testsThisWeek: weekScores.length,
		activeToday: new Set(todayScores.map((row) => row.uid)).size,
		average: scores.length ? Math.round(scores.reduce((sum, row) => sum + row.score, 0) / scores.length) : 0,
		courses: [...courses.values()].map((course) => ({
			course: course.course,
			tests: course.tests,
			average: Math.round(course.total / course.tests)
		})).sort((a, b) => b.tests - a.tests),
		recentAccounts: authUsers.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 8).map((user) => ({
			email: user.email || "No email",
			name: user.name || "",
			joined: user.createdAt ? new Date(user.createdAt).toISOString() : null,
			lastSignIn: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null,
			paid: Boolean(profileByUid.get(user.uid)?.premiumUntilMs > now)
		})),
		recentPayments: payments.slice().sort((a, b) => b.atMs - a.atMs).slice(0, 8).map((payment) => ({
			reference: payment.reference,
			email: emailFor(payment.uid),
			amount: Math.round((Number(payment.amountKobo) || 0) / 100),
			status: payment.status || "unknown",
			at: payment.atMs ? new Date(payment.atMs).toISOString() : null
		})),
		prize: {
			thisWeek: winnerCard(boardRows, weekStart, weekStart + 7 * DAY, weekId(weekStart), false),
			lastWeek: winnerCard(boardRows, weekStart - 7 * DAY, weekStart, weekId(weekStart - 7 * DAY), true),
			thisMonth: winnerCard(boardRows, monthStart, nextMonthStart(now), monthId(now), true)
		}
	};
}
async function readAuthUsers(auth) {
	const users = [];
	let pageToken;
	let truncated = false;
	do {
		const page = await auth.listUsers(1e3, pageToken);
		for (const user of page.users) users.push({
			uid: user.uid,
			email: user.email || "",
			name: user.displayName || "",
			createdAt: user.metadata?.creationTime ? Date.parse(user.metadata.creationTime) : 0,
			lastSignInAt: user.metadata?.lastSignInTime ? Date.parse(user.metadata.lastSignInTime) : 0
		});
		pageToken = page.pageToken;
		if (users.length >= 3e3 && pageToken) {
			truncated = true;
			break;
		}
	} while (pageToken);
	return {
		users,
		truncated
	};
}
async function adminDashboard() {
	if (!firebaseConfigured()) return summariseAdmin({
		firebase: false,
		authNote: "Firebase is not connected on this server."
	});
	const { auth, db } = await firebaseServices();
	let authUsers = [];
	let truncated = false;
	let authNote = "";
	try {
		const listed = await readAuthUsers(auth);
		authUsers = listed.users;
		truncated = listed.truncated;
	} catch (error) {
		authNote = "Sign-in accounts could not be listed. Profile and payment figures are still shown.";
		console.error("Admin account list failed", error?.message);
	}
	const profiles = [];
	let cursor = null;
	for (let page = 0; page < 4; page++) {
		let query = db.collection("oracleUsers").limit(500);
		if (cursor) query = query.startAfter(cursor);
		const snap = await query.get();
		if (snap.empty) break;
		for (const doc of snap.docs) {
			const data = doc.data() || {};
			profiles.push({
				uid: doc.id,
				email: data.email || "",
				premiumUntilMs: data.premiumUntil?.toMillis?.() || 0,
				updatedAtMs: data.updatedAt?.toMillis?.() || data.lastActivityAt?.toMillis?.() || 0
			});
		}
		cursor = snap.docs[snap.docs.length - 1];
		if (snap.size < 500) break;
	}
	const payments = [];
	const paySnap = await db.collection("oraclePayments").limit(200).get();
	for (const doc of paySnap.docs) {
		const data = doc.data() || {};
		payments.push({
			reference: doc.id,
			uid: data.uid || "",
			amountKobo: Number(data.amount) || 0,
			status: data.status || "",
			atMs: data.verifiedAt?.toMillis?.() || data.createdAt?.toMillis?.() || 0
		});
	}
	const scores = [];
	const board = await db.collection("oracleBoard").limit(800).get();
	for (const doc of board.docs) {
		const data = doc.data() || {};
		const score = Number(data.score);
		const completedMs = Number(data.completedMs) || 0;
		if (!data.uid || !Number.isFinite(score) || completedMs <= 0) continue;
		scores.push({
			uid: String(data.uid),
			name: String(data.name || ""),
			score: Math.max(0, Math.min(100, Math.round(score))),
			course: String(data.course || "Other"),
			completedMs
		});
	}
	return summariseAdmin({
		authUsers,
		profiles,
		payments,
		scores,
		truncated,
		scoresTruncated: board.size >= 800,
		authNote,
		firebase: true
	});
}
function cleanString(value, max) {
	return typeof value === "string" ? value.slice(0, max) : "";
}
function normaliseHistory(input) {
	return {
		course: cleanString(input.course, 40),
		topics: Array.isArray(input.topics) ? input.topics.filter((topic) => typeof topic === "string").slice(0, 20).map((topic) => topic.slice(0, 80)) : [],
		total: Number(input.total),
		correct: Number(input.correct),
		action: typeof input.action === "string" ? input.action : "complete",
		testId: typeof input.id === "number" && Number.isSafeInteger(input.id) ? String(input.id) : "",
		topicResults: Array.isArray(input.topicResults) ? input.topicResults.filter((topic) => topic && typeof topic.name === "string").slice(0, 20).map((topic) => ({
			name: topic.name.slice(0, 80),
			correct: Math.max(0, Math.min(Number(topic.correct) || 0, 60)),
			total: Math.max(0, Math.min(Number(topic.total) || 0, 60))
		})) : [],
		answers: Array.isArray(input.answers) ? input.answers.slice(0, 60).map((answer) => ({
			topic: cleanString(answer?.topic, 80),
			prompt: cleanString(answer?.prompt, 2e3),
			options: Array.isArray(answer?.options) ? answer.options.filter((option) => typeof option === "string").slice(0, 4).map((option) => option.slice(0, 500)) : [],
			selected: Math.max(0, Math.min(Number(answer?.selected) || 0, 3)),
			correctAnswer: Math.max(0, Math.min(Number(answer?.correctAnswer) || 0, 3)),
			correct: answer?.correct === true
		})) : [],
		raw: input
	};
}
async function history(req, user) {
	if (req.method === "GET") return json(200, await readProfile(user.uid));
	if (req.method !== "POST") return json(405, { error: "Use GET or POST." });
	let input;
	try {
		input = await req.json();
	} catch {
		return json(400, { error: "Request body must be valid JSON." });
	}
	const activity = normaliseHistory(input);
	if (!activity.course || !activity.testId) return json(400, { error: "Test activity is invalid." });
	if (activity.action === "start") {
		if (!Number.isInteger(activity.total) || activity.total < 1 || activity.total > 60) return json(400, { error: "Test setup is invalid." });
	} else if (activity.action === "answer") {
		const index = Number(input.index);
		const answer = input.answer && typeof input.answer === "object" ? input.answer : {};
		if (!Number.isInteger(index) || index < 0 || index >= 60) return json(400, { error: "Answer activity is invalid." });
		activity.index = index;
		activity.answer = {
			topic: cleanString(answer.topic, 80),
			prompt: cleanString(answer.prompt, 2e3),
			options: Array.isArray(answer.options) ? answer.options.filter((option) => typeof option === "string").slice(0, 4).map((option) => option.slice(0, 500)) : [],
			selected: Math.max(0, Math.min(Number(answer.selected) || 0, 3)),
			correctAnswer: Math.max(0, Math.min(Number(answer.correctAnswer) || 0, 3)),
			correct: answer.correct === true
		};
		if (!activity.answer.prompt || activity.answer.options.length !== 4) return json(400, { error: "Answer activity is invalid." });
	} else if (activity.action === "solution") {
		const index = Number(input.index);
		if (!Number.isInteger(index) || index < 0 || index >= 60) return json(400, { error: "Solution activity is invalid." });
		activity.index = index;
		activity.topic = cleanString(input.topic, 80);
	} else if (activity.action === "abandon") {} else if (activity.action === "complete") {
		if (!Number.isInteger(activity.total) || activity.total < 1 || activity.total > 60 || !Number.isInteger(activity.correct) || activity.correct < 0 || activity.correct > activity.total) return json(400, { error: "Test summary is invalid." });
	} else return json(400, { error: "Test activity is invalid." });
	const saved = await saveActivity(user, {
		id: activity.testId,
		course: activity.course,
		topics: activity.topics,
		total: activity.total,
		correct: activity.correct,
		action: activity.action,
		index: activity.index,
		answer: activity.answer,
		topic: activity.topic,
		topicResults: activity.topicResults,
		answers: activity.answers,
		name: cleanString(input.name, 40)
	});
	return json(saved.status, {
		saved: true,
		id: saved.id
	});
}
async function dispatchOracle(name, req) {
	if (name === "paystack-webhook") {
		if (req.method !== "POST") return new Response("Method not allowed.", { status: 405 });
		return handlePaystackWebhook(req);
	}
	if (req.method !== "GET" && !originAllowed(req)) return json(403, { error: "Request origin is not allowed." });
	if (name === "leaderboard") {
		if (req.method !== "GET") return json(405, { error: "Use GET." });
		let viewer = null;
		if (req.headers.has("authorization")) try {
			viewer = await authenticatedUser(req, false);
		} catch {
			viewer = null;
		}
		try {
			return json(200, await leaderboardFor(viewer?.uid || null));
		} catch (error) {
			console.error("Leaderboard failed", error?.message);
			return json(503, { error: "The leaderboard could not be loaded." });
		}
	}
	if (name === "admin") {
		if (req.method !== "GET") return json(405, { error: "Use GET." });
		let adminUser = null;
		try {
			adminUser = await authenticatedUser(req);
		} catch {
			return json(401, { error: "Please sign in again." });
		}
		if (!adminUser) return json(401, { error: "Sign in to continue." });
		if (!isAdmin(adminUser)) return json(403, { error: "This dashboard is only for the Exam Oracle admin." });
		try {
			return json(200, await adminDashboard());
		} catch (error) {
			console.error("Admin dashboard failed", error?.message);
			return json(503, { error: "The admin dashboard could not be loaded." });
		}
	}
	if (name === "generate-questions") {
		let user = null;
		if (req.headers.has("authorization")) try {
			user = await authenticatedUser(req, false);
		} catch (error) {
			const code = String(error?.code || "");
			console.error("Sign-in verification failed", code, String(error?.message || "").slice(0, 300));
			if (error?.config) return json(503, {
				code: "config",
				error: error.publicMessage || "Account verification is not set up correctly on the server."
			});
			return json(401, {
				code: "auth_required",
				error: code.includes("id-token-expired") ? "Your sign-in has expired. Please sign in again." : "Your sign-in could not be verified. Please sign in again."
			});
		}
		if (req.method !== "GET" && !originAllowed(req)) return json(403, { error: "Request origin is not allowed." });
		return handleGenerate(req, user);
	}
	let user;
	try {
		user = await authenticatedUser(req);
	} catch {
		return json(401, { error: "Please sign in again." });
	}
	if (!user) return json(401, { error: "Sign in to continue." });
	if (name === "test-history") return history(req, user);
	if (name === "paystack-initialize") {
		if (req.method !== "POST") return json(405, { error: "Use POST." });
		try {
			return await initializePayment(user, req);
		} catch (error) {
			console.error("Paystack initialization error", error?.message);
			return json(502, { error: "Could not reach Paystack. Please try again." });
		}
	}
	if (name === "paystack-verify") {
		if (req.method !== "POST") return json(405, { error: "Use POST." });
		let reference;
		try {
			reference = (await req.json()).reference;
		} catch {
			return json(400, { error: "Payment reference is missing." });
		}
		if (typeof reference !== "string" || !/^[\w-]{8,100}$/.test(reference)) return json(400, { error: "Payment reference is invalid." });
		try {
			return await verifyPayment(user, reference);
		} catch (error) {
			console.error("Paystack verification error", error?.message);
			return json(502, { error: "Could not verify payment right now." });
		}
	}
	return json(404, { error: "Unknown Exam Oracle endpoint." });
}
//#endregion
export { recordScore as c, dispatchOracle };
