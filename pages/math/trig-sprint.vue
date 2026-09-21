<script setup>
import katex from "katex";
import "katex/dist/katex.min.css";
import { mathInputToLatex } from "~/utils/mathInput.js";

definePageMeta({ layout: false });
useHead({ title: "Trig Sprint - Skarn" });

const levels = [
  { name: "Function definitions", blurb: "Triangle ratios and coordinate definitions.", gate: 0, cards: [
    [String.raw`\sin\theta`, String.raw`\frac{\mathrm{opp}}{\mathrm{hyp}}`, "sin", ["opp/hyp", "opposite/hypotenuse"]],
    [String.raw`\cos\theta`, String.raw`\frac{\mathrm{adj}}{\mathrm{hyp}}`, "cos", ["adj/hyp", "adjacent/hypotenuse"]],
    [String.raw`\tan\theta`, String.raw`\frac{\mathrm{opp}}{\mathrm{adj}}`, "tan", ["opp/adj", "opposite/adjacent"]],
    [String.raw`\csc\theta`, String.raw`\frac{\mathrm{hyp}}{\mathrm{opp}}`, "csc", ["hyp/opp", "hypotenuse/opposite"]],
    [String.raw`\sec\theta`, String.raw`\frac{\mathrm{hyp}}{\mathrm{adj}}`, "sec", ["hyp/adj", "hypotenuse/adjacent"]],
    [String.raw`\cot\theta`, String.raw`\frac{\mathrm{adj}}{\mathrm{opp}}`, "cot", ["adj/opp", "adjacent/opposite"]],
    [String.raw`\sin\theta\;(P(x,y))`, String.raw`\frac yr`, "sin", ["y/r"]], [String.raw`\cos\theta\;(P(x,y))`, String.raw`\frac xr`, "cos", ["x/r"]],
    [String.raw`\tan\theta\;(P(x,y))`, String.raw`\frac yx`, "tan", ["y/x"]], [String.raw`\csc\theta\;(P(x,y))`, String.raw`\frac ry`, "csc", ["r/y"]],
    [String.raw`\sec\theta\;(P(x,y))`, String.raw`\frac rx`, "sec", ["r/x"]], [String.raw`\cot\theta\;(P(x,y))`, String.raw`\frac xy`, "cot", ["x/y"]],
  ]},
  { name: "Exact unit-circle values", blurb: "Sine and cosine at the standard angles.", gate: 60, cards: [
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
  { name: "Reciprocal & quotient", blurb: "Flip functions and connect tan and cot.", gate: 60, cards: [
    [String.raw`\csc\theta`, String.raw`\frac1{\sin\theta}`, "csc", ["1/sin"]], [String.raw`\sec\theta`, String.raw`\frac1{\cos\theta}`, "sec", ["1/cos"]],
    [String.raw`\cot\theta`, String.raw`\frac1{\tan\theta}`, "cot", ["1/tan"]], [String.raw`\tan\theta`, String.raw`\frac{\sin\theta}{\cos\theta}`, "tan", ["sin/cos"]],
    [String.raw`\cot\theta`, String.raw`\frac{\cos\theta}{\sin\theta}`, "cot", ["cos/sin"]],
  ]},
  { name: "Pythagorean core", blurb: "The three identities everything builds on.", gate: 65, cards: [
    [String.raw`\sin^2x+\cos^2x`, "1", "sin^2(x)+cos^2(x)", ["1"]], [String.raw`1+\tan^2x`, String.raw`\sec^2x`, "1+tan^2(x)", ["sec^2(x)"]],
    [String.raw`1+\cot^2x`, String.raw`\csc^2x`, "1+cot^2(x)", ["csc^2(x)"]], [String.raw`1-\sin^2x`, String.raw`\cos^2x`, "1-sin^2(x)", ["cos^2(x)"]],
    [String.raw`\sec^2x-\tan^2x`, "1", "sec^2(x)-tan^2(x)", ["1"]],
  ]},
  { name: "Signs & periods", blurb: "Odd, even, and periodic behavior.", gate: 70, cards: [
    [String.raw`\sin(-\theta)`, String.raw`-\sin\theta`, "sin(-theta)", ["-sin"]], [String.raw`\cos(-\theta)`, String.raw`\cos\theta`, "cos(-theta)", ["cos"]],
    [String.raw`\sin(\theta+2\pi)`, String.raw`\sin\theta`, "sin(theta+2pi)", ["sin"]], [String.raw`\cos(\theta+2\pi)`, String.raw`\cos\theta`, "cos(theta+2pi)", ["cos"]],
  ]},
  { name: "Addition & subtraction", blurb: "Sine and cosine of x ± y.", gate: 75, cards: [
    [String.raw`\sin(x+y)`, String.raw`\sin x\cos y+\cos x\sin y`, "sin(x+y)", ["sin(x)cos(y)+cos(x)sin(y)"]],
    [String.raw`\sin(x-y)`, String.raw`\sin x\cos y-\cos x\sin y`, "sin(x-y)", ["sin(x)cos(y)-cos(x)sin(y)"]],
    [String.raw`\cos(x+y)`, String.raw`\cos x\cos y-\sin x\sin y`, "cos(x+y)", ["cos(x)cos(y)-sin(x)sin(y)"]],
    [String.raw`\cos(x-y)`, String.raw`\cos x\cos y+\sin x\sin y`, "cos(x-y)", ["cos(x)cos(y)+sin(x)sin(y)"]],
  ]},
  { name: "Tangent & double angles", blurb: "Tangent sums and double-angle forms.", gate: 78, cards: [
    [String.raw`\tan(x+y)`, String.raw`\frac{\tan x+\tan y}{1-\tan x\tan y}`, "tan(x+y)", ["(tan(x)+tan(y))/(1-tan(x)tan(y))"]],
    [String.raw`\tan(x-y)`, String.raw`\frac{\tan x-\tan y}{1+\tan x\tan y}`, "tan(x-y)", ["(tan(x)-tan(y))/(1+tan(x)tan(y))"]],
    [String.raw`\sin 2x`, String.raw`2\sin x\cos x`, "sin(2x)", ["2sin(x)cos(x)"]], [String.raw`\cos 2x`, String.raw`\cos^2x-\sin^2x`, "cos(2x)", ["cos^2(x)-sin^2(x)"]],
    [String.raw`\cos 2x`, String.raw`2\cos^2x-1`, "cos(2x)", ["2cos^2(x)-1"]], [String.raw`\cos 2x`, String.raw`1-2\sin^2x`, "cos(2x)", ["1-2sin^2(x)"]],
  ]},
  { name: "Half-angle & products", blurb: "Power reduction and product identities.", gate: 80, cards: [
    [String.raw`\cos^2x`, String.raw`\frac{1+\cos2x}{2}`, "cos^2(x)", ["(1+cos(2x))/2"]], [String.raw`\sin^2x`, String.raw`\frac{1-\cos2x}{2}`, "sin^2(x)", ["(1-cos(2x))/2"]],
    [String.raw`\sin x\cos y`, String.raw`\frac12[\sin(x+y)+\sin(x-y)]`, "sin(x)cos(y)", ["1/2(sin(x+y)+sin(x-y))", "(sin(x+y)+sin(x-y))/2"]],
    [String.raw`\cos x\cos y`, String.raw`\frac12[\cos(x+y)+\cos(x-y)]`, "cos(x)cos(y)", ["1/2(cos(x+y)+cos(x-y))", "(cos(x+y)+cos(x-y))/2"]],
    [String.raw`\sin x\sin y`, String.raw`\frac12[\cos(x-y)-\cos(x+y)]`, "sin(x)sin(y)", ["1/2(cos(x-y)-cos(x+y))", "(cos(x-y)-cos(x+y))/2"]],
  ]},
  { name: "Triangle laws", blurb: "Laws of sines and cosines, plus Heron's formula.", gate: 82, cards: [
    [String.raw`\frac{\sin A}{a}`, String.raw`\frac{\sin B}{b}=\frac{\sin C}{c}`, "sin(A)/a", ["sin(B)/b=sin(C)/c"]],
    [String.raw`a^2`, String.raw`b^2+c^2-2bc\cos A`, "a^2", ["b^2+c^2-2bccos(A)"]], [String.raw`b^2`, String.raw`a^2+c^2-2ac\cos B`, "b^2", ["a^2+c^2-2accos(B)"]],
    [String.raw`c^2`, String.raw`a^2+b^2-2ab\cos C`, "c^2", ["a^2+b^2-2abcos(C)"]],
    [String.raw`\mathcal A`, String.raw`\sqrt{s(s-a)(s-b)(s-c)}`, "A", ["sqrt(s(s-a)(s-b)(s-c))"]], [String.raw`s`, String.raw`\frac12(a+b+c)`, "s", ["(a+b+c)/2", "1/2(a+b+c)"]],
  ]},
  { name: "Fluency circuit", blurb: "Every family, both directions, under pressure.", gate: 85, cards: [] },
];

const screen = ref("levels"); const level = ref(0); const referenceLevel = ref(0); const mode = ref("practice"); const input = ref(""); const inputEl = ref(); const symbolsOpen = ref(false);
const seconds = ref(60); const correct = ref(0); const attempts = ref(0); const streak = ref(0); const bestStreak = ref(0); const score = ref(0);
const current = ref(null); const queue = ref([]); const locked = ref(false); const message = ref(""); const correctionLatex = ref(""); const good = ref(false); const usedHint = ref(false);
let ticker; let startedAt; let cardStartedAt;
const progress = reactive({ levels: Array(levels.length).fill(0), cards: {} });

const allCards = () => levels.slice(0, -1).flatMap((l, li) => l.cards.map((card, ci) => ({ card, id: `${li}-${ci}` })));
const pool = (li) => li === levels.length - 1 ? allCards() : levels[li].cards.map((card, ci) => ({ card, id: `${li}-${ci}` }));
const latex = (value) => katex.renderToString(value || "", { throwOnError: false, displayMode: true });
const unlocked = (i) => i === 0 || progress.levels[i - 1] >= levels[i].gate;
const totalMastery = computed(() => { const values = Object.values(progress.cards); return values.length ? Math.round(values.reduce((sum, c) => sum + (c.strength || 0), 0) / values.length) : 0; });
const renderedInput = computed(() => input.value ? katex.renderToString(mathInputToLatex(input.value), { throwOnError: false }) : "");
const referenceGroups = computed(() => referenceLevel.value === levels.length - 1
  ? levels.slice(0, -1).map((item) => ({ name: item.name, cards: item.cards }))
  : [{ name: levels[referenceLevel.value].name, cards: levels[referenceLevel.value].cards }]);

function persist() { localStorage.setItem("skarn-trig-sprint-v3", JSON.stringify(progress)); }
function buildQueue() {
  if (mode.value === "learn") { queue.value = [...pool(level.value)]; return; }
  const now = Date.now();
  queue.value = pool(level.value).flatMap((entry) => {
    const saved = progress.cards[entry.id] || {}; const weight = saved.due && saved.due < now ? 3 : Math.max(1, 3 - Math.floor((saved.strength || 0) / 40));
    return Array(weight).fill(entry);
  }).sort(() => Math.random() - .5);
}
function start(li, selectedMode = "practice") {
  mode.value = selectedMode;
  level.value = li; seconds.value = 60; correct.value = attempts.value = streak.value = bestStreak.value = score.value = 0; screen.value = "game";
  startedAt = Date.now(); buildQueue(); next(); clearInterval(ticker);
  if (mode.value === "practice") ticker = setInterval(() => { seconds.value = Math.max(0, 60 - (Date.now() - startedAt) / 1000); if (!seconds.value) finish(); }, 100);
}
function review(li) { referenceLevel.value = li; screen.value = "reference"; }
function next() {
  if (!queue.value.length) { if (mode.value === "learn") return finish(); buildQueue(); }
  const base = queue.value.shift(); const reverse = mode.value === "practice" && base.card[4] !== false && Math.random() < .35;
  current.value = { ...base, reverse, shown: reverse ? base.card[1] : base.card[0], displayAnswer: reverse ? base.card[0] : base.card[1], answers: reverse ? [base.card[2]] : base.card[3] };
  input.value = ""; message.value = ""; correctionLatex.value = ""; locked.value = false; good.value = false; usedHint.value = false; cardStartedAt = Date.now(); nextTick(() => inputEl.value?.focus());
}
function normalize(value) {
  return value.replaceAll("θ", "x").replace(/theta/gi, "x").replaceAll("π", "pi").replaceAll("²", "^2").toLowerCase()
    .replace(/\bs\(/g, "sin(").replace(/\bc\(/g, "cos(").replace(/\bt\(/g, "tan(")
    .replace(/\bsc\(/g, "sec(").replace(/\bcs\(/g, "csc(").replace(/\bct\(/g, "cot(")
    .replace(/√/g, "sqrt").replace(/sqrt([a-z0-9]+)/g, "sqrt($1)").replace(/\s+/g, "").replace(/[\[\{]/g, "(").replace(/[\]\}]/g, ")").replace(/[·*]/g, "")
    .replace(/(sin|cos|tan|sec|csc|cot)\^2\(([^)]+)\)/g, "$1($2)^2")
    .replace(/\b(sin|cos|tan|sec|csc|cot)\(x\)/g, "$1");
}
function submit() {
  if (locked.value || !input.value.trim()) return; locked.value = true; attempts.value++; const ok = current.value.answers.some(a => normalize(a) === normalize(input.value)); const memory = progress.cards[current.value.id] || { strength: 0 };
  if (ok) {
    correct.value++; streak.value++; bestStreak.value = Math.max(bestStreak.value, streak.value); score.value += Math.round(100 + streak.value * 8 + Math.max(0, 50 - (Date.now() - cardStartedAt) / 100));
    memory.strength = Math.min(100, memory.strength + (usedHint.value ? 5 : 14)); memory.due = Date.now() + Math.max(1, memory.strength / 12) * 86400000; message.value = streak.value > 2 ? `Correct · ${streak.value} streak` : "Correct"; good.value = true;
  } else {
    streak.value = 0; memory.strength = Math.max(0, memory.strength - 8); memory.due = Date.now(); queue.value.splice(mode.value === "learn" ? 0 : Math.min(2, queue.value.length), 0, { card: current.value.card, id: current.value.id }); message.value = "Correct answer"; correctionLatex.value = current.value.displayAnswer;
  }
  progress.cards[current.value.id] = memory; persist(); setTimeout(next, ok ? 450 : 1300);
}
function hint() { if (!current.value || locked.value) return; usedHint.value = true; const answer = current.value.answers[0]; message.value = `Hint: ${answer.slice(0, Math.max(1, Math.ceil(answer.length * .3)))}… (${answer.length} characters)`; inputEl.value?.focus(); }
function finish() { clearInterval(ticker); ticker = null; const accuracy = attempts.value ? Math.round(correct.value / attempts.value * 100) : 0; if (mode.value === "practice") progress.levels[level.value] = Math.max(progress.levels[level.value] || 0, accuracy); persist(); screen.value = "results"; }
function exit() { clearInterval(ticker); ticker = null; screen.value = "levels"; }
function insert(text) { const el = inputEl.value; const start = el.selectionStart; const end = el.selectionEnd; input.value = input.value.slice(0, start) + text + input.value.slice(end); nextTick(() => { el.focus(); el.setSelectionRange(start + text.length, start + text.length); }); }
function keydown(event) {
  if (event.key === "Enter") return submit(); if (event.key === "Tab") { event.preventDefault(); symbolsOpen.value = !symbolsOpen.value; return; }
  if (event.key.toLowerCase() === "h" && !input.value) return hint();
  if (event.key === "ArrowRight" && inputEl.value.selectionStart === input.value.length) {
    const open = (input.value.match(/\(/g) || []).length; const closed = (input.value.match(/\)/g) || []).length;
    if (open > closed) { event.preventDefault(); input.value += ")"; }
  }
}
const accuracy = computed(() => attempts.value ? Math.round(correct.value / attempts.value * 100) : 0);
const resultTitle = computed(() => accuracy.value >= 90 ? "Reflexes unlocked." : accuracy.value >= 70 ? "Getting sharper." : "One more pass.");

onMounted(() => { const saved = JSON.parse(localStorage.getItem("skarn-trig-sprint-v3") || "null"); if (saved) { progress.levels = [...progress.levels.map((v, i) => saved.levels?.[i] || v)]; progress.cards = saved.cards || {}; } });
onBeforeUnmount(() => clearInterval(ticker));
</script>

<template>
  <main class="sprint">
    <header>
      <NuxtLink to="/" class="brand"><span>△</span><b>SKARN<br><i>TRIG SPRINT</i></b></NuxtLink>
      <div class="top-stats"><p>STREAK <strong>{{ streak }}</strong></p><p>MASTERY <strong>{{ totalMastery }}%</strong></p></div>
    </header>

    <section v-if="screen === 'levels'" class="levels-screen">
      <div class="hero"><p class="eyebrow">BUILD MUSCLE MEMORY</p><h1>Make identities<br><em>instinctive.</em></h1><p class="intro">Short, adaptive typing rounds. Recall both directions, revisit mistakes, and unlock harder identity families as your accuracy climbs.</p></div>
      <div class="levels">
        <article v-for="(item, i) in levels" :key="item.name" class="level" :class="{ locked: !unlocked(i) }">
          <small>LEVEL {{ String(i + 1).padStart(2, '0') }}</small><span>{{ unlocked(i) ? (progress.levels[i] ? `${progress.levels[i]}%` : 'READY') : `LOCKED · ${item.gate}%` }}</span>
          <h2>{{ item.name }}</h2><p>{{ item.blurb }}</p><i><b :style="{ width: `${progress.levels[i]}%` }"></b></i>
          <div v-if="unlocked(i)" class="level-actions"><button @click="review(i)">Reference</button><button @click="start(i, 'learn')">Learn</button><button @click="start(i)">Practice →</button></div>
        </article>
      </div>
      <aside><b>⌨ Fast notation</b><span>Angles are optional: type <kbd>sin</kbd>, not sin(θ). In longer formulas use <kbd>s(</kbd> sin · <kbd>c(</kbd> cos · <kbd>t(</kbd> tan · <kbd>sc(</kbd> sec · <kbd>cs(</kbd> csc · <kbd>ct(</kbd> cot.</span></aside>
    </section>

    <section v-else-if="screen === 'reference'" class="reference-screen">
      <div class="reference-head">
        <button class="back-button" @click="screen = 'levels'">← Levels</button>
        <div><p class="eyebrow">OPTIONAL REVIEW</p><h1>{{ levels[referenceLevel].name }}</h1><p>Read through once, then recall each identity without looking.</p></div>
        <div class="reference-actions"><button @click="start(referenceLevel, 'learn')">Learn first</button><button class="start-button" @click="start(referenceLevel)">Start practice →</button></div>
      </div>
      <div class="reference-groups">
        <section v-for="group in referenceGroups" :key="group.name" class="reference-group">
          <h2 v-if="referenceGroups.length > 1">{{ group.name }}</h2>
          <TrigCoordinateDiagram v-if="group.name === levels[0].name" />
          <TrigUnitCircleDiagram v-if="group.name === levels[1].name" />
          <div class="reference-grid">
            <div v-for="(card, i) in group.cards" :key="i" class="reference-card">
              <div v-html="latex(card[0])"></div><span>=</span><div v-html="latex(card[1])"></div>
            </div>
          </div>
        </section>
      </div>
      <div class="reference-footer"><p>The timer starts only when you are ready.</p><div class="reference-actions"><button @click="start(referenceLevel, 'learn')">Learn first</button><button class="start-button" @click="start(referenceLevel)">Start practice →</button></div></div>
    </section>

    <section v-else-if="screen === 'game'" class="game-screen">
      <div class="game-head"><button @click="exit">← Levels</button><b>{{ mode === 'learn' ? 'LEARN · ' : '' }}{{ levels[level].name }}</b><strong>{{ mode === 'learn' ? 'UNTIMED' : seconds.toFixed(1) }}</strong></div>
      <div class="timebar"><i :style="{ width: mode === 'learn' ? `${Math.min(100, attempts / pool(level).length * 100)}%` : `${seconds / 60 * 100}%` }"></i></div>
      <article v-if="current" class="question-card">
        <div class="meta"><span>{{ current.card[4] || (level === 0 ? 'DEFINITION' : 'IDENTITY') }}</span><span>{{ current.reverse ? 'REVERSE RECALL' : 'RECALL' }}</span></div>
        <p>{{ mode === 'learn' ? 'Type the answer shown below' : (current.reverse ? 'Name the equivalent expression' : 'Type the equivalent form') }}</p>
        <div class="formula" v-html="latex(current.shown)"></div>
        <TrigUnitCircleDiagram v-if="current.id.startsWith('1-')" :card-index="Number(current.id.split('-')[1])" :show-values="mode === 'learn'" compact />
        <div v-if="mode === 'learn'" class="learn-target"><span>COPY THIS</span><div v-html="latex(current.displayAnswer)"></div></div>
        <TrigCoordinateDiagram v-if="current.card[0].includes('P(x,y)')" compact />
        <div class="math-editor" :class="{ right: good, wrong: locked && !good }" @click="inputEl?.focus()">
          <div class="rendered-answer"><span v-if="input" v-html="renderedInput"></span><span v-else class="placeholder">Type your answer</span><i class="math-caret"></i></div>
          <input ref="inputEl" v-model="input" class="math-capture" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer" @keydown="keydown">
          <small>ENTER ↵</small>
        </div>
        <div class="feedback" :class="{ good, correction: correctionLatex }"><span>{{ message }}</span><div v-if="correctionLatex" v-html="latex(correctionLatex)"></div></div>
        <div class="symbols" :class="{ open: symbolsOpen }"><button v-for="symbol in ['sin', 'cos', 'tan', 'sec', 'csc', 'cot', '(', ')', '^2', 'π', '√']" :key="symbol" @click="insert(symbol)">{{ symbol }}</button></div>
      </article>
      <footer><span><kbd>Enter</kbd> submit</span><span><kbd>H</kbd> hint</span><span><kbd>Tab</kbd> symbols</span><span>θ is optional · aliases: <code>s(</code>, <code>c(</code>, <code>t(</code></span></footer>
    </section>

    <section v-else class="results">
      <p class="eyebrow">ROUND COMPLETE</p><h1>{{ resultTitle }}</h1><div class="score"><strong>{{ score }}</strong><span>POINTS</span></div>
      <div class="result-stats"><p><strong>{{ accuracy }}%</strong><span>ACCURACY</span></p><p><strong>{{ correct }}</strong><span>ANSWERS / MIN</span></p><p><strong>{{ bestStreak }}</strong><span>BEST STREAK</span></p></div>
      <p class="note">{{ mode === 'learn' ? 'You have typed every answer in this section. Practice mode will now test recall without showing it.' : (accuracy >= 80 ? 'That level is mastered. The next set is ready.' : 'Missed cards are scheduled sooner next round—retrieval is where the learning happens.') }}</p>
      <div class="actions"><button @click="start(level, mode)">Try again</button><button @click="screen = 'levels'">Continue →</button></div>
    </section>
  </main>
</template>

<style scoped>
:global(body){background:#f7f5ef;color:#172b42}.sprint{min-height:100vh;font-family:var(--font-sans);padding:28px max(24px,calc((100vw - 1120px)/2)) 60px;background-image:radial-gradient(rgba(23,43,66,.045) .7px,transparent .7px);background-size:5px 5px}.sprint header{display:flex;justify-content:space-between;align-items:center;padding-bottom:22px;border-bottom:1px solid rgba(23,43,66,.14)}.brand{display:flex;gap:11px;align-items:center;color:inherit;text-decoration:none;font:11px var(--font-mono);letter-spacing:.12em}.brand>span{display:grid;place-items:center;width:43px;height:43px;background:#172b42;color:#91adc7;border-radius:50%;font-size:20px}.brand i{font-style:normal;color:#245fa8}.top-stats{display:flex;gap:30px}.top-stats p{font:10px var(--font-mono);color:#7b8987;letter-spacing:.12em}.top-stats strong{display:block;text-align:right;color:#172b42;font-size:18px;margin-top:3px}.hero{display:grid;grid-template-columns:1.25fr .75fr;gap:30px;align-items:end;padding:65px 0 45px}.eyebrow{grid-column:1/-1;color:#245fa8;font:500 11px var(--font-mono);letter-spacing:.15em}.hero h1,.results h1{font-size:clamp(48px,7vw,84px);line-height:.92;letter-spacing:-.055em}.hero em{font-family:var(--font-sans);color:#a06444}.intro{color:#586562;line-height:1.7;font-size:16px}.levels{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.level{position:relative;min-height:205px;padding:24px;text-align:left;border:1px solid rgba(23,43,66,.14);border-radius: 8px;background:rgba(255,253,247,.75);color:#172b42;cursor:pointer;transition:.2s}.level:nth-child(2),.level:nth-child(5){background:#e8f0e9}.level:nth-child(3),.level:nth-child(6){background:#f3ebdb}.level:hover:not(:disabled){transform:translateY(-4px);border-color:#172b42;box-shadow:0 15px 40px rgba(23,43,66,.08)}.level:disabled{opacity:.48;cursor:not-allowed}.level small,.level>span,.meta,.game-head>b,.result-stats span{font:500 10px var(--font-mono);letter-spacing:.13em;color:#245fa8}.level>span{position:absolute;right:22px;top:24px;color:#63706e}.level h2{margin:38px 0 8px;font-size:22px}.level p{color:#64716f;line-height:1.5}.level>i{position:absolute;left:24px;right:24px;bottom:20px;height:3px;background:rgba(23,43,66,.1)}.level>i b{display:block;height:100%;background:#172b42}.levels-screen aside{display:flex;gap:16px;align-items:center;margin-top:18px;padding:18px 22px;border:1px dashed rgba(23,43,66,.25);border-radius: 8px;font-size:13px}.levels-screen aside span{color:#677471}.sprint kbd{padding:2px 6px;border:1px solid #b9c0bb;border-radius:4px;background:#ffffff;box-shadow:0 1px #a5aba7;font:11px var(--font-mono)}.game-head{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin-top:36px}.game-head button{border:0;background:none;text-align:left;font-weight:700;cursor:pointer}.game-head strong{justify-self:end;font:600 21px var(--font-mono)}.timebar{height:3px;margin:15px 0 48px;background:rgba(23,43,66,.12)}.timebar i{display:block;height:100%;background:#a06444}.question-card{max-width:800px;min-height:450px;margin:auto;padding:32px 46px;background:#ffffff;border:1px solid rgba(23,43,66,.13);border-radius: 8px;box-shadow:0 24px 65px rgba(23,43,66,.08)}.meta{display:flex;justify-content:space-between}.question-card>p{text-align:center;color:#7a8785;margin:57px 0 12px}.formula{min-height:80px;font-size:28px}.question-card label{display:flex;align-items:center;gap:14px;max-width:560px;margin:28px auto 0;padding:8px 0;border-bottom:2px solid #172b42;font:30px Georgia,serif}.question-card label.right{border-color:#26745d}.question-card label.wrong{border-color:#a06444;animation:shake .25s}.question-card input{min-width:0;width:100%;border:0;outline:0;background:transparent;color:#172b42;font:25px var(--font-mono)}.question-card label small{color:#9aa3a1;font:10px var(--font-mono);white-space:nowrap}.feedback{height:38px;padding-top:10px;text-align:center;color:#a04e46;font:12px var(--font-mono)}.feedback.good{color:#26745d}.symbols{display:flex;justify-content:center;gap:6px;opacity:0;pointer-events:none;transition:.15s}.symbols.open{opacity:1;pointer-events:auto}.symbols button{border:0;border-radius: 8px;background:#edf0ea;padding:7px 10px;font:12px var(--font-mono);cursor:pointer}.game-screen footer{display:flex;justify-content:center;gap:24px;max-width:800px;margin:24px auto;color:#6d7b78;font-size:12px}.results{max-width:760px;margin:auto;padding-top:68px;text-align:center}.results .eyebrow{margin-bottom:8px}.results h1{font-size:52px}.score{display:flex;flex-direction:column;justify-content:center;width:180px;height:180px;margin:30px auto;border:2px solid #172b42;border-radius:50%;box-shadow:inset 0 0 0 8px #f7f5ef,inset 0 0 0 10px #91adc7}.score strong{font:700 45px var(--font-mono)}.score span{font:10px var(--font-mono);letter-spacing:.15em}.result-stats{display:grid;grid-template-columns:repeat(3,1fr);margin-top:38px;border-block:1px solid rgba(23,43,66,.14)}.result-stats p{display:flex;flex-direction:column;gap:5px;padding:22px}.result-stats p+p{border-left:1px solid rgba(23,43,66,.14)}.result-stats strong{font:700 24px var(--font-mono)}.note{margin:25px;color:#63706e}.actions{display:flex;justify-content:center;gap:10px}.actions button{padding:14px 24px;border:1px solid #172b42;border-radius: 8px;background:transparent;font-weight:700;cursor:pointer}.actions button:last-child{background:#172b42;color:white}@keyframes shake{30%{transform:translateX(-5px)}70%{transform:translateX(5px)}}
.level{min-height:225px;padding-bottom:65px;cursor:default}.level.locked{opacity:.48}.level:hover:not(.locked){transform:translateY(-4px);border-color:#172b42;box-shadow:0 15px 40px rgba(23,43,66,.08)}.level-actions{position:absolute;left:24px;right:24px;bottom:29px;display:flex;gap:7px}.level-actions button{flex:1;padding:8px;border:1px solid rgba(23,43,66,.3);border-radius: 8px;background:transparent;color:#172b42;font-weight:700;cursor:pointer}.level-actions button:last-child{background:#172b42;color:#fff}.level>i{bottom:17px}.reference-screen{padding-top:50px}.reference-head{display:grid;grid-template-columns:150px 1fr 180px;gap:30px;align-items:start;margin-bottom:38px}.back-button{border:0;background:none;text-align:left;padding:12px 0;font-weight:700;cursor:pointer}.reference-head .eyebrow{margin-bottom:8px}.reference-head h1{font-size:clamp(38px,6vw,65px);line-height:1;letter-spacing:-.04em}.reference-head div>p:last-child{margin-top:15px;color:#667370}.start-button{padding:13px 18px;border:1px solid #172b42;border-radius: 8px;background:#172b42;color:#fff;font-weight:700;cursor:pointer}.reference-groups{display:flex;flex-direction:column;gap:34px}.reference-group>h2{margin-bottom:13px;font-size:19px}.reference-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.reference-card{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;min-height:96px;padding:14px 18px;border:1px solid rgba(23,43,66,.13);border-radius: 8px;background:#ffffff}.reference-card>span{color:#7b8987;font:20px Georgia,serif}.reference-card :deep(.katex-display){margin:.4em 0;font-size:.94em}.reference-footer{display:flex;justify-content:space-between;align-items:center;margin-top:30px;padding-top:22px;border-top:1px solid rgba(23,43,66,.14);color:#667370}
@media(max-width:760px){.sprint{padding-inline:14px}.hero{grid-template-columns:1fr;padding:42px 0 32px}.eyebrow{grid-column:auto}.levels{grid-template-columns:1fr}.level{min-height:205px}.top-stats p:first-child{display:none}.reference-head{grid-template-columns:1fr}.reference-head>.start-button{display:none}.reference-grid{grid-template-columns:1fr}.reference-card{font-size:12px}.reference-footer{align-items:flex-start;gap:15px}.question-card{padding:24px 18px}.game-head{grid-template-columns:1fr 1fr}.game-head>b{display:none}.question-card input{font-size:18px}.game-screen footer{flex-wrap:wrap;gap:12px}.symbols{flex-wrap:wrap}.results h1{font-size:42px}}
.level.locked:hover{transform:none;border-color:rgba(23,43,66,.14);box-shadow:none}
.math-editor{position:relative;display:flex;align-items:center;gap:14px;max-width:560px;min-height:58px;margin:28px auto 0;padding:8px 0;border-bottom:2px solid #172b42;cursor:text;font:30px Georgia,serif}.math-editor.right{border-color:#26745d}.math-editor.wrong{border-color:#a06444;animation:shake .25s}.math-editor>small{margin-left:auto;color:#9aa3a1;font:10px var(--font-mono);white-space:nowrap}.rendered-answer{display:flex;align-items:center;min-width:0;overflow-x:auto;overflow-y:hidden;padding:5px 2px;font-size:25px;white-space:nowrap}.rendered-answer :deep(.katex){font-size:1.1em}.placeholder{color:#9aa3a1;font:18px var(--font-mono)}.math-caret{display:inline-block;width:2px;height:31px;margin-left:3px;background:#172b42;animation:caret-blink 1s step-end infinite}.math-capture{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none;border:0!important;padding:0!important}.math-editor:focus-within{border-bottom-color:#245fa8}.math-editor:focus-within .math-caret{display:inline-block}@keyframes caret-blink{50%{opacity:0}}
.feedback.correction{display:flex;align-items:center;justify-content:center;gap:12px;height:auto;min-height:58px;padding-top:6px}.feedback.correction>span{white-space:nowrap}.feedback.correction :deep(.katex-display){margin:.25em 0;font-size:1.15em}
.rendered-answer{flex:1;justify-content:center;text-align:center}.math-editor>small{position:absolute;right:0}.feedback.correction{min-height:76px;font-size:13px}.feedback.correction :deep(.katex-display){font-size:1.55em}.learn-target{display:grid;grid-template-columns:90px 1fr;align-items:center;max-width:560px;min-height:74px;margin:12px auto 6px;padding:10px 18px;border:1px solid rgba(39,142,110,.28);border-radius: 8px;background:#e8f0e9}.learn-target>span{font:500 9px var(--font-mono);letter-spacing:.13em;color:#245fa8}.learn-target :deep(.katex-display){margin:.25em 0;font-size:1.25em}.reference-actions{display:flex;justify-content:flex-end;gap:8px}.reference-actions>button{padding:13px 18px;border:1px solid #172b42;border-radius: 8px;background:transparent;color:#172b42;font-weight:700;cursor:pointer}.reference-actions>.start-button{background:#172b42;color:#fff}.level-actions button{padding-inline:5px;font-size:12px}

/* Clear structure with warmer surfaces and color accents. */
.sprint { background: var(--paper); padding-bottom: 84px; }
.sprint header { border-bottom-color: var(--line); }
.brand { letter-spacing: .06em; }
.brand > span { border-radius: 10px; background: #183c40; color: #e6c385; }
.brand i { color: var(--muted); }
.hero { padding-block: 58px 42px; }
.hero h1, .results h1 { font-weight: 500; line-height: 1.04; letter-spacing: -.055em; }
.hero em { font-family: var(--font-sans); font-style: normal; font-weight: 500; color: var(--accent); }
.level, .level:nth-child(2), .level:nth-child(3), .level:nth-child(5), .level:nth-child(6) { background: var(--surface); border-color: var(--line); border-radius: 12px; box-shadow: 0 3px 12px #183c4004; }
.level:nth-child(3n + 1) { background: #fdfcf8; }
.level:nth-child(3n + 2) { background: var(--mint); }
.level:nth-child(3n) { background: var(--lavender); }
.level h2 { font-weight: 500; font-size: 21px; line-height: 1.25; letter-spacing: -.025em; }
.level p { font-size: 14px; }
.level:hover:not(:disabled), .level:hover:not(.locked) { transform: none; box-shadow: 0 5px 18px #183c400a; border-color: #94b3a8; }
.level small, .level > span, .meta { letter-spacing: .06em; }
.level.locked { opacity: .65; }
.level-actions button, .actions button, .reference-actions > button, .start-button { font-family: var(--font-sans); font-weight: 500; border-radius: 8px; }
.levels-screen aside { border-style: solid; border-color: var(--line); border-radius: 8px; background: #e8f0e9; }
.question-card { border-radius: 8px; box-shadow: none; border-color: var(--line); }
.reference-card, .learn-target { border-radius: 8px; }
.reference-head h1 { font-weight: 450; line-height: 1.08; }
.score { border-width: 1px; box-shadow: none; }
.timebar { background: #dce3eb; }
.timebar i { background: var(--accent); }
@media (prefers-reduced-motion: reduce) { .level, .symbols { transition: none; } .math-caret { animation: none; } .math-editor.wrong { animation: none; } }

</style>
