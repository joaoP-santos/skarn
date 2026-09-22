const families = [
  { name: "Exact unit-circle values", blurb: "Sine and cosine at the standard angles.", cards: [
    [String.raw`\sin 0`, "0", "sin(0)", ["0"], false], [String.raw`\cos 0`, "1", "cos(0)", ["1"], false],
    [String.raw`\sin\frac\pi6`, String.raw`\frac12`, "sin(pi/6)", ["1/2"], false], [String.raw`\cos\frac\pi6`, String.raw`\frac{\sqrt3}{2}`, "cos(pi/6)", ["sqrt(3)/2", "√3/2"], false],
    [String.raw`\sin\frac\pi4`, String.raw`\frac1{\sqrt2}`, "sin(pi/4)", ["1/sqrt(2)", "sqrt(2)/2", "1/√2"], false], [String.raw`\cos\frac\pi4`, String.raw`\frac1{\sqrt2}`, "cos(pi/4)", ["1/sqrt(2)", "sqrt(2)/2", "1/√2"], false],
    [String.raw`\sin\frac\pi3`, String.raw`\frac{\sqrt3}{2}`, "sin(pi/3)", ["sqrt(3)/2", "√3/2"], false], [String.raw`\cos\frac\pi3`, String.raw`\frac12`, "cos(pi/3)", ["1/2"], false],
    [String.raw`\sin\frac\pi2`, "1", "sin(pi/2)", ["1"], false], [String.raw`\cos\frac\pi2`, "0", "cos(pi/2)", ["0"], false],
    [String.raw`\sin\frac{2\pi}3`, String.raw`\frac{\sqrt3}{2}`, "sin(2pi/3)", ["sqrt(3)/2", "√3/2"], false], [String.raw`\cos\frac{2\pi}3`, String.raw`-\frac12`, "cos(2pi/3)", ["-1/2"], false],
    [String.raw`\sin\frac{3\pi}4`, String.raw`\frac1{\sqrt2}`, "sin(3pi/4)", ["1/sqrt(2)", "sqrt(2)/2", "1/√2"], false], [String.raw`\cos\frac{3\pi}4`, String.raw`-\frac1{\sqrt2}`, "cos(3pi/4)", ["-1/sqrt(2)", "-sqrt(2)/2", "-1/√2"], false],
    [String.raw`\sin\frac{5\pi}6`, String.raw`\frac12`, "sin(5pi/6)", ["1/2"], false], [String.raw`\cos\frac{5\pi}6`, String.raw`-\frac{\sqrt3}{2}`, "cos(5pi/6)", ["-sqrt(3)/2", "-√3/2"], false],
    [String.raw`\sin\pi`, "0", "sin(pi)", ["0"], false], [String.raw`\cos\pi`, "-1", "cos(pi)", ["-1"], false],
    [String.raw`\sin\frac{3\pi}2`, "-1", "sin(3pi/2)", ["-1"], false], [String.raw`\cos\frac{3\pi}2`, "0", "cos(3pi/2)", ["0"], false],
    [String.raw`\sin 2\pi`, "0", "sin(2pi)", ["0"], false], [String.raw`\cos 2\pi`, "1", "cos(2pi)", ["1"], false],
  ]},
  { name: "Reciprocal & quotient", blurb: "Flip functions and connect tan and cot.", cards: [
    [String.raw`\csc\theta`, String.raw`\frac1{\sin\theta}`, "csc", ["1/sin"]], [String.raw`\sec\theta`, String.raw`\frac1{\cos\theta}`, "sec", ["1/cos"]],
    [String.raw`\cot\theta`, String.raw`\frac1{\tan\theta}`, "cot", ["1/tan"]], [String.raw`\tan\theta`, String.raw`\frac{\sin\theta}{\cos\theta}`, "tan", ["sin/cos"]],
    [String.raw`\cot\theta`, String.raw`\frac{\cos\theta}{\sin\theta}`, "cot", ["cos/sin"]],
  ]},
  { name: "Pythagorean core", blurb: "The three identities everything builds on.", cards: [
    [String.raw`\sin^2x+\cos^2x`, "1", "sin^2(x)+cos^2(x)", ["1"]], [String.raw`1+\tan^2x`, String.raw`\sec^2x`, "1+tan^2(x)", ["sec^2(x)"]],
    [String.raw`1+\cot^2x`, String.raw`\csc^2x`, "1+cot^2(x)", ["csc^2(x)"]], [String.raw`1-\sin^2x`, String.raw`\cos^2x`, "1-sin^2(x)", ["cos^2(x)"]],
    [String.raw`\sec^2x-\tan^2x`, "1", "sec^2(x)-tan^2(x)", ["1"]],
  ]},
  { name: "Signs & periods", blurb: "Odd, even, and periodic behavior.", cards: [
    [String.raw`\sin(-\theta)`, String.raw`-\sin\theta`, "sin(-theta)", ["-sin"]], [String.raw`\cos(-\theta)`, String.raw`\cos\theta`, "cos(-theta)", ["cos"]],
    [String.raw`\sin(\theta+2\pi)`, String.raw`\sin\theta`, "sin(theta+2pi)", ["sin"]], [String.raw`\cos(\theta+2\pi)`, String.raw`\cos\theta`, "cos(theta+2pi)", ["cos"]],
    [String.raw`\tan(-\theta)`, String.raw`-\tan\theta`, "tan(-theta)", ["-tan"]],
  ]},
  { name: "Addition & subtraction", blurb: "Sine and cosine of x ± y.", cards: [
    [String.raw`\sin(x+y)`, String.raw`\sin x\cos y+\cos x\sin y`, "sin(x+y)", ["sin(x)cos(y)+cos(x)sin(y)"]],
    [String.raw`\sin(x-y)`, String.raw`\sin x\cos y-\cos x\sin y`, "sin(x-y)", ["sin(x)cos(y)-cos(x)sin(y)"]],
    [String.raw`\cos(x+y)`, String.raw`\cos x\cos y-\sin x\sin y`, "cos(x+y)", ["cos(x)cos(y)-sin(x)sin(y)"]],
    [String.raw`\cos(x-y)`, String.raw`\cos x\cos y+\sin x\sin y`, "cos(x-y)", ["cos(x)cos(y)+sin(x)sin(y)"]],
  ]},
  { name: "Tangent & double angles", blurb: "Tangent sums and double-angle forms.", cards: [
    [String.raw`\tan(x+y)`, String.raw`\frac{\tan x+\tan y}{1-\tan x\tan y}`, "tan(x+y)", ["(tan(x)+tan(y))/(1-tan(x)tan(y))"]],
    [String.raw`\tan(x-y)`, String.raw`\frac{\tan x-\tan y}{1+\tan x\tan y}`, "tan(x-y)", ["(tan(x)-tan(y))/(1+tan(x)tan(y))"]],
    [String.raw`\sin 2x`, String.raw`2\sin x\cos x`, "sin(2x)", ["2sin(x)cos(x)"]], [String.raw`\cos 2x`, String.raw`\cos^2x-\sin^2x`, "cos(2x)", ["cos^2(x)-sin^2(x)"]],
    [String.raw`\cos 2x`, String.raw`2\cos^2x-1`, "cos(2x)", ["2cos^2(x)-1"]], [String.raw`\cos 2x`, String.raw`1-2\sin^2x`, "cos(2x)", ["1-2sin^2(x)"]],
  ]},
  { name: "Half-angle & products", blurb: "Power reduction and product identities.", cards: [
    [String.raw`\cos^2x`, String.raw`\frac{1+\cos2x}{2}`, "cos^2(x)", ["(1+cos(2x))/2"]], [String.raw`\sin^2x`, String.raw`\frac{1-\cos2x}{2}`, "sin^2(x)", ["(1-cos(2x))/2"]],
    [String.raw`\sin x\cos y`, String.raw`\frac12[\sin(x+y)+\sin(x-y)]`, "sin(x)cos(y)", ["1/2(sin(x+y)+sin(x-y))", "(sin(x+y)+sin(x-y))/2"]],
    [String.raw`\cos x\cos y`, String.raw`\frac12[\cos(x+y)+\cos(x-y)]`, "cos(x)cos(y)", ["1/2(cos(x+y)+cos(x-y))", "(cos(x+y)+cos(x-y))/2"]],
    [String.raw`\sin x\sin y`, String.raw`\frac12[\cos(x-y)-\cos(x+y)]`, "sin(x)sin(y)", ["1/2(cos(x-y)-cos(x+y))", "(cos(x-y)-cos(x+y))/2"]],
  ]},
  { name: "Triangle laws", blurb: "Laws of sines and cosines, plus Heron's formula.", cards: [
    [String.raw`\frac{\sin A}{a}`, String.raw`\frac{\sin B}{b}=\frac{\sin C}{c}`, "sin(A)/a", ["sin(B)/b=sin(C)/c"]],
    [String.raw`a^2`, String.raw`b^2+c^2-2bc\cos A`, "a^2", ["b^2+c^2-2bccos(A)"]], [String.raw`b^2`, String.raw`a^2+c^2-2ac\cos B`, "b^2", ["a^2+c^2-2accos(B)"]],
    [String.raw`c^2`, String.raw`a^2+b^2-2ab\cos C`, "c^2", ["a^2+b^2-2abcos(C)"]],
    [String.raw`\mathcal A`, String.raw`\sqrt{s(s-a)(s-b)(s-c)}`, "A", ["sqrt(s(s-a)(s-b)(s-c))"]], [String.raw`s`, String.raw`\frac12(a+b+c)`, "s", ["(a+b+c)/2", "1/2(a+b+c)"]],
  ]},
  { name: "Cofunction identities", cards: [
    [String.raw`\sin(\frac\pi2-x)`, String.raw`\cos x`, "sin(pi/2-x)", ["cos"]],
    [String.raw`\cos(\frac\pi2-x)`, String.raw`\sin x`, "cos(pi/2-x)", ["sin"]],
    [String.raw`\tan(\frac\pi2-x)`, String.raw`\cot x`, "tan(pi/2-x)", ["cot"]],
  ]},
  { name: "Sum-to-product identities", cards: [
    [String.raw`\sin x+\sin y`, String.raw`2\sin\frac{x+y}{2}\cos\frac{x-y}{2}`, "sin(x)+sin(y)", ["2sin((x+y)/2)cos((x-y)/2)"]],
    [String.raw`\cos x+\cos y`, String.raw`2\cos\frac{x+y}{2}\cos\frac{x-y}{2}`, "cos(x)+cos(y)", ["2cos((x+y)/2)cos((x-y)/2)"]],
  ]},
];

const stepNames = [
  ["0", "π/6", "π/4", "π/3", "π/2", "2π/3", "3π/4", "5π/6", "π", "3π/2", "2π"].map(angle => `Sine & cosine · ${angle}`),
  ["Cosecant & secant", "Cotangent & tangent", "Cotangent quotient"],
  ["Pythagorean foundations", "Pythagorean rearrangements", "Secant minus tangent"],
  ["Negative angles", "Full-turn periods", "Negative tangent"],
  ["Sine sums & differences", "Cosine sums & differences"],
  ["Tangent sums & differences", "Sine & cosine double angles", "More cosine double angles"],
  ["Power reduction", "Sine–cosine & cosine products", "Sine products"],
  ["Sine law & cosine law", "Cosine law variations", "Heron's formula"],
  ["Sine & cosine cofunctions", "Tangent cofunction"],
  ["Sums into products"],
];

const formCues = {
  "2-2": "Use the reciprocal of tangent",
  "2-4": "Use sine and cosine",
  "6-3": "Use both sine and cosine",
  "6-4": "Use cosine only",
  "6-5": "Use sine only",
};

export const PASS_ACCURACY = 80;
export const RECALL_REPETITIONS = 3;
export const STORAGE_KEY = "skarn-trig-sprint-v4";

// Retain the original family/card IDs so existing card history still applies.
export const levels = families.flatMap((family, familyIndex) => {
  const steps = [];
  const familyId = familyIndex < 8 ? familyIndex + 1 : familyIndex + 2;
  for (let offset = 0; offset < family.cards.length; offset += 2) {
    const cards = family.cards.slice(offset, offset + 2);
    steps.push({
      name: stepNames[familyIndex][offset / 2],
      family: family.name,
      legacyLevel: familyIndex < 8 && !(familyIndex === 3 && offset === 4) ? familyId : null,
      cards,
      entries: cards.map((card, index) => {
        const id = `${familyId}-${offset + index}`;
        return { card, id, cue: formCues[id] };
      }),
      blurb: `${cards.length} new ${cards.length === 1 ? "fact" : "facts"}. Recall them, then revisit earlier ones.`,
    });
  }
  return steps;
});
levels.push({ name: "Fluency circuit", family: "Mixed review", legacyLevel: 9, cards: [], entries: [], blurb: "No new facts. Review everything you have learned, at your own pace." });

export const allCards = () => levels.flatMap(level => level.entries);
export const pool = index => index === levels.length - 1 ? allCards() : levels[index].entries;

function shuffle(entries, random) {
  const result = [...entries];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function reviewCards(entries, memories, count, random, now) {
  return shuffle(entries, random).sort((a, b) => {
    const priority = entry => {
      const memory = memories[entry.id] || {};
      return (memory.strength || 0) - (memory.due && memory.due <= now ? 100 : 0);
    };
    return priority(a) - priority(b);
  }).slice(0, count);
}

export function buildRound(index, mode, memories = {}, random = Math.random, now = Date.now()) {
  if (mode === "learn") return [...pool(index)];
  if (index === levels.length - 1) return reviewCards(allCards(), memories, 12, random, now);
  const fresh = pool(index);
  const earlier = levels.slice(0, index).flatMap(level => level.entries)
    .filter(entry => (memories[entry.id]?.strength || 0) > 0);
  const review = reviewCards(earlier, memories, 4, random, now);
  // Start with the new pair, then repeat it among a small sample of older facts.
  return [...shuffle(fresh, random), ...shuffle([
    ...Array.from({ length: RECALL_REPETITIONS - 1 }, () => fresh).flat(),
    ...review,
  ], random)];
}

export function restoreProgress(saved, legacy) {
  const source = saved || legacy || {};
  const cards = Object.fromEntries(allCards().filter(entry => source.cards?.[entry.id])
    .map(entry => [entry.id, source.cards[entry.id]]));
  return {
    levels: levels.map((level, index) => saved
      ? saved.levels?.[index] || 0
      : level.legacyLevel === null ? 0 : legacy?.levels?.[level.legacyLevel] || 0),
    cards,
  };
}
