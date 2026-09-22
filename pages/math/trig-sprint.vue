<script setup>
import katex from "katex";
import "katex/dist/katex.min.css";
import { mathInputToLatex } from "~/utils/mathInput.js";
import { levels, allCards, buildRound, restoreProgress, PASS_ACCURACY, STORAGE_KEY } from "~/utils/trigSprint.js";

definePageMeta({ layout: false });
useHead({ title: "Trig Sprint - Skarn" });

const screen = ref("levels"); const level = ref(0); const referenceLevel = ref(0); const mode = ref("practice"); const input = ref(""); const inputEl = ref(); const symbolsOpen = ref(false);
const roundSize = ref(0); const completed = ref(0); const correct = ref(0); const attempts = ref(0); const streak = ref(0); const bestStreak = ref(0); const score = ref(0);
const current = ref(null); const queue = ref([]); const locked = ref(false); const message = ref(""); const correctionLatex = ref(""); const good = ref(false);
const elapsedSeconds = ref(0);
const elapsedTime = computed(() => `${Math.floor(elapsedSeconds.value / 60)}:${String(elapsedSeconds.value % 60).padStart(2, "0")}`);
let nextCardTimeout;
let elapsedTicker;
let roundStartedAt;
const progress = reactive({ levels: Array(levels.length).fill(0), cards: {} });

const latex = (value) => katex.renderToString(value || "", { throwOnError: false, displayMode: true });
const totalMastery = computed(() => { const values = allCards().map(entry => progress.cards[entry.id] || {}); return values.length ? Math.round(values.reduce((sum, c) => sum + (c.strength || 0), 0) / values.length) : 0; });
const renderedInput = computed(() => input.value ? katex.renderToString(mathInputToLatex(input.value), { throwOnError: false }) : "");
const referenceGroups = computed(() => referenceLevel.value === levels.length - 1
  ? levels.slice(0, -1).map((item) => ({ name: item.name, cards: item.cards }))
  : [{ name: levels[referenceLevel.value].name, cards: levels[referenceLevel.value].cards }]);

function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
function updateElapsed() { elapsedSeconds.value = Math.floor((performance.now() - roundStartedAt) / 1000); }
function stopElapsed() {
  if (elapsedTicker !== undefined) updateElapsed();
  clearInterval(elapsedTicker);
  elapsedTicker = undefined;
}
function start(li, selectedMode = "practice") {
  clearTimeout(nextCardTimeout);
  stopElapsed();
  elapsedSeconds.value = 0;
  roundStartedAt = performance.now();
  elapsedTicker = setInterval(updateElapsed, 250);
  mode.value = selectedMode;
  level.value = li; correct.value = attempts.value = streak.value = bestStreak.value = score.value = completed.value = 0;
  queue.value = buildRound(li, selectedMode, progress.cards);
  roundSize.value = queue.value.length;
  screen.value = "game";
  next();
}
function review(li) { referenceLevel.value = li; screen.value = "reference"; }
function next() {
  if (screen.value !== "game") return;
  if (!queue.value.length) return finish();
  const base = queue.value.shift();
  current.value = { ...base, shown: base.card[0], displayAnswer: base.card[1], answers: base.card[3] };
  input.value = ""; message.value = ""; correctionLatex.value = ""; locked.value = false; good.value = false; nextTick(() => inputEl.value?.focus());
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
  if (screen.value !== "game" || locked.value || !input.value.trim()) return; locked.value = true; attempts.value++; const ok = current.value.answers.some(a => normalize(a) === normalize(input.value)); const memory = progress.cards[current.value.id] || { strength: 0 };
  if (ok) {
    correct.value++; streak.value++; bestStreak.value = Math.max(bestStreak.value, streak.value); score.value += 100 + streak.value * 8;
    completed.value++;
    memory.strength = Math.min(100, memory.strength + 14); memory.due = Date.now() + Math.max(1, memory.strength / 12) * 86400000; message.value = "Correct!"; good.value = true;
  } else {
    streak.value = 0; memory.strength = Math.max(0, memory.strength - 8); memory.due = Date.now(); queue.value.splice(mode.value === "learn" ? 0 : Math.min(2, queue.value.length), 0, { card: current.value.card, id: current.value.id, cue: current.value.cue }); message.value = "Not quite"; correctionLatex.value = current.value.displayAnswer;
  }
  progress.cards[current.value.id] = memory; persist(); nextCardTimeout = setTimeout(next, ok ? 850 : 2400);
}
function finish() {
  clearTimeout(nextCardTimeout);
  stopElapsed();
  if (mode.value === "practice") progress.levels[level.value] = Math.max(progress.levels[level.value] || 0, accuracy.value);
  persist(); screen.value = "results";
}
function exit() { clearTimeout(nextCardTimeout); stopElapsed(); screen.value = "levels"; }
function insert(text) { if (locked.value) return; const el = inputEl.value; const start = el.selectionStart; const end = el.selectionEnd; input.value = input.value.slice(0, start) + text + input.value.slice(end); nextTick(() => { el.focus(); el.setSelectionRange(start + text.length, start + text.length); }); }
function keydown(event) {
  if (locked.value) { if (event.key !== 'Tab') event.preventDefault(); return; }
  if (event.key === "Enter") return submit(); if (event.key === "Tab") { event.preventDefault(); symbolsOpen.value = !symbolsOpen.value; return; }
  if (event.key === "ArrowRight" && inputEl.value.selectionStart === input.value.length) {
    const open = (input.value.match(/\(/g) || []).length; const closed = (input.value.match(/\)/g) || []).length;
    if (open > closed) { event.preventDefault(); input.value += ")"; }
  }
}
const accuracy = computed(() => attempts.value ? Math.round(correct.value / attempts.value * 100) : 0);
const resultTitle = computed(() => accuracy.value >= 90 ? "Reflexes unlocked." : accuracy.value >= 70 ? "Getting sharper." : "One more pass.");

const resultNote = computed(() => {
  if (mode.value === "learn") return "You have seen each new fact. Practice next to recall it without the answer.";
  if (accuracy.value < PASS_ACCURACY) return "Missed facts will come back for review. Repeat this step or choose any other level.";
  return level.value === levels.length - 1 ? "Review complete. Come back whenever you want to refresh these facts." : "Step complete. The next small set is ready.";
});

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    const legacy = saved ? null : JSON.parse(localStorage.getItem("skarn-trig-sprint-v3") || "null");
    Object.assign(progress, restoreProgress(saved, legacy));
  } catch { /* A damaged save should not prevent practice. */ }
});
onBeforeUnmount(() => { clearTimeout(nextCardTimeout); stopElapsed(); });
</script>

<template>
  <main class="sprint">
    <header>
      <NuxtLink to="/" class="brand"><span>△</span><b>SKARN<br><i>TRIG SPRINT</i></b></NuxtLink>
      <div class="top-stats"><p>STREAK <strong>{{ streak }}</strong></p><p>MASTERY <strong>{{ totalMastery }}%</strong></p></div>
    </header>

    <section v-if="screen === 'levels'" class="levels-screen">
      <div class="hero"><p class="eyebrow">BUILD MUSCLE MEMORY</p><h1>Make identities<br><em>instinctive.</em></h1><p class="intro">Learn one or two new facts at a time. Repeat them and mix in earlier facts. Every level is available—start anywhere and take as long as you need.</p></div>
      <div class="levels">
        <article v-for="(item, i) in levels" :key="item.name" class="level">
          <small>LEVEL {{ String(i + 1).padStart(2, '0') }}</small><span>{{ progress.levels[i] ? `${progress.levels[i]}%` : 'READY' }}</span>
          <h2>{{ item.name }}</h2><p>{{ item.blurb }}</p><i><b :style="{ width: `${progress.levels[i]}%` }"></b></i>
          <div class="level-actions"><button @click="review(i)">Reference</button><button @click="start(i, 'learn')">Learn</button><button @click="start(i)">Practice →</button></div>
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
          <div class="reference-grid">
            <div v-for="(card, i) in group.cards" :key="i" class="reference-card">
              <div v-html="latex(card[0])"></div><span>=</span><div v-html="latex(card[1])"></div>
            </div>
          </div>
        </section>
      </div>
      <div class="reference-footer"><p>Recall each new fact three times, with a little review. There is no time limit.</p><div class="reference-actions"><button @click="start(referenceLevel, 'learn')">Learn first</button><button class="start-button" @click="start(referenceLevel)">Start practice →</button></div></div>
    </section>

    <section v-else-if="screen === 'game'" class="game-screen">
      <div class="game-head"><button @click="exit">← Levels</button><b>{{ mode === 'learn' ? 'LEARN · ' : '' }}{{ levels[level].name }}</b><div class="round-stats"><div><span>RECALLS</span><strong>{{ completed }} / {{ roundSize }}</strong></div><div><span>ELAPSED</span><strong role="timer" aria-label="Elapsed time">{{ elapsedTime }}</strong></div></div></div>
      <div class="round-progress" role="progressbar" aria-label="Round progress" :aria-valuenow="completed" :aria-valuemax="roundSize" :aria-valuemin="0"><i :style="{ width: `${roundSize ? completed / roundSize * 100 : 0}%` }"></i></div>
      <article v-if="current" class="question-card" :class="{ 'answer-correct': locked && good, 'answer-incorrect': locked && !good }">
        <div class="meta"><span>{{ current.id.startsWith('1-') ? 'EXACT VALUE' : 'IDENTITY' }}</span><span>{{ mode === 'learn' ? 'LEARN' : 'RECALL' }}</span></div>
        <p>{{ mode === 'learn' ? 'Type the answer shown below' : (current.cue || 'Type the equivalent form') }}</p>
        <div class="formula" v-html="latex(current.shown)"></div>
        <TrigUnitCircleDiagram v-if="mode === 'learn' && current.id.startsWith('1-')" :card-index="Number(current.id.split('-')[1])" show-values compact />
        <div v-if="mode === 'learn'" class="learn-target"><span>COPY THIS</span><div v-html="latex(current.displayAnswer)"></div></div>
        <div class="math-editor" :class="{ right: good, wrong: locked && !good }" @click="inputEl?.focus()">
          <div class="rendered-answer"><span v-if="input" v-html="renderedInput"></span><span v-else class="placeholder">Type your answer</span><i class="math-caret"></i></div>
          <input ref="inputEl" v-model="input" class="math-capture" :readonly="locked" :aria-invalid="locked && !good" aria-describedby="answer-feedback" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer" @keydown="keydown">
          <small v-if="!locked">ENTER ↵</small>
        </div>
        <div id="answer-feedback" class="answer-feedback" :class="{ success: locked && good, error: locked && !good }" role="status" aria-live="polite" aria-atomic="true">
          <template v-if="locked">
            <span class="feedback-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path v-if="good" d="m5 12 4 4L19 6" />
                <path v-else d="m7 7 10 10M17 7 7 17" />
              </svg>
            </span>
            <div class="feedback-content">
              <div class="feedback-heading"><strong>{{ message }}</strong><span v-if="good && streak > 1" class="streak-badge">{{ streak }} in a row</span></div>
              <p v-if="good">Nice work. Keep going.</p>
              <template v-else><p>Correct answer</p><div class="feedback-answer" v-html="latex(correctionLatex)"></div><p class="retry-note">You’ll see this one again.</p></template>
            </div>
          </template>
        </div>
        <div class="symbols" :class="{ open: symbolsOpen }"><button v-for="symbol in ['sin', 'cos', 'tan', 'sec', 'csc', 'cot', '(', ')', '^2', 'π', '√']" :key="symbol" :disabled="locked" @click="insert(symbol)">{{ symbol }}</button></div>
      </article>
      <footer><span><kbd>Enter</kbd> submit</span><span><kbd>Tab</kbd> symbols</span><span>θ is optional · aliases: <code>s(</code>, <code>c(</code>, <code>t(</code></span></footer>
    </section>

    <section v-else class="results">
      <p class="eyebrow">ROUND COMPLETE</p><h1>{{ resultTitle }}</h1><div class="score"><strong>{{ score }}</strong><span>POINTS</span></div>
      <div class="result-stats"><p><strong>{{ accuracy }}%</strong><span>ACCURACY</span></p><p><strong>{{ correct }}</strong><span>CORRECT ANSWERS</span></p><p><strong>{{ bestStreak }}</strong><span>BEST STREAK</span></p></div>
      <p class="elapsed-summary">Time elapsed <strong>{{ elapsedTime }}</strong></p>
      <p class="note">{{ resultNote }}</p>
      <div class="actions"><button @click="start(level, mode)">Try again</button><button v-if="mode === 'learn'" @click="start(level)">Practice →</button><button v-else-if="level < levels.length - 1" @click="review(level + 1)">Next level →</button><button @click="screen = 'levels'">Levels</button></div>
    </section>
  </main>
</template>

<style scoped>
:global(body){background:#f7f5ef;color:#172b42}.sprint{min-height:100vh;font-family:var(--font-sans);padding:28px max(24px,calc((100vw - 1120px)/2)) 60px;background-image:radial-gradient(rgba(23,43,66,.045) .7px,transparent .7px);background-size:5px 5px}.sprint header{display:flex;justify-content:space-between;align-items:center;padding-bottom:22px;border-bottom:1px solid rgba(23,43,66,.14)}.brand{display:flex;gap:11px;align-items:center;color:inherit;text-decoration:none;font:11px var(--font-mono);letter-spacing:.12em}.brand>span{display:grid;place-items:center;width:43px;height:43px;background:#172b42;color:#91adc7;border-radius:50%;font-size:20px}.brand i{font-style:normal;color:#245fa8}.top-stats{display:flex;gap:30px}.top-stats p{font:10px var(--font-mono);color:#7b8987;letter-spacing:.12em}.top-stats strong{display:block;text-align:right;color:#172b42;font-size:18px;margin-top:3px}.hero{display:grid;grid-template-columns:1.25fr .75fr;gap:30px;align-items:end;padding:65px 0 45px}.eyebrow{grid-column:1/-1;color:#245fa8;font:500 11px var(--font-mono);letter-spacing:.15em}.hero h1,.results h1{font-size:clamp(48px,7vw,84px);line-height:.92;letter-spacing:-.055em}.hero em{font-family:var(--font-sans);color:#a06444}.intro{color:#586562;line-height:1.7;font-size:16px}.levels{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.level{position:relative;min-height:205px;padding:24px;text-align:left;border:1px solid rgba(23,43,66,.14);border-radius: 8px;background:rgba(255,253,247,.75);color:#172b42;cursor:pointer;transition:.2s}.level:nth-child(2),.level:nth-child(5){background:#e8f0e9}.level:nth-child(3),.level:nth-child(6){background:#f3ebdb}.level:hover:not(:disabled){transform:translateY(-4px);border-color:#172b42;box-shadow:0 15px 40px rgba(23,43,66,.08)}.level:disabled{opacity:.48;cursor:not-allowed}.level small,.level>span,.meta,.game-head>b,.result-stats span{font:500 10px var(--font-mono);letter-spacing:.13em;color:#245fa8}.level>span{position:absolute;right:22px;top:24px;color:#63706e}.level h2{margin:38px 0 8px;font-size:22px}.level p{color:#64716f;line-height:1.5}.level>i{position:absolute;left:24px;right:24px;bottom:20px;height:3px;background:rgba(23,43,66,.1)}.level>i b{display:block;height:100%;background:#172b42}.levels-screen aside{display:flex;gap:16px;align-items:center;margin-top:18px;padding:18px 22px;border:1px dashed rgba(23,43,66,.25);border-radius: 8px;font-size:13px}.levels-screen aside span{color:#677471}.sprint kbd{padding:2px 6px;border:1px solid #b9c0bb;border-radius:4px;background:#ffffff;box-shadow:0 1px #a5aba7;font:11px var(--font-mono)}.game-head{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;margin-top:36px}.game-head button{border:0;background:none;text-align:left;font-weight:700;cursor:pointer}.game-head strong{justify-self:end;font:600 21px var(--font-mono)}.round-progress{height:3px;margin:15px 0 48px;background:rgba(23,43,66,.12)}.round-progress i{display:block;height:100%;background:#a06444}.question-card{max-width:800px;min-height:450px;margin:auto;padding:32px 46px;background:#ffffff;border:1px solid rgba(23,43,66,.13);border-radius: 8px;box-shadow:0 24px 65px rgba(23,43,66,.08)}.meta{display:flex;justify-content:space-between}.question-card>p{text-align:center;color:#7a8785;margin:57px 0 12px}.formula{min-height:80px;font-size:28px}.question-card label{display:flex;align-items:center;gap:14px;max-width:560px;margin:28px auto 0;padding:8px 0;border-bottom:2px solid #172b42;font:30px Georgia,serif}.question-card label.right{border-color:#26745d}.question-card label.wrong{border-color:#a06444;animation:shake .25s}.question-card input{min-width:0;width:100%;border:0;outline:0;background:transparent;color:#172b42;font:25px var(--font-mono)}.question-card label small{color:#9aa3a1;font:10px var(--font-mono);white-space:nowrap}.feedback{height:38px;padding-top:10px;text-align:center;color:#a04e46;font:12px var(--font-mono)}.feedback.good{color:#26745d}.symbols{display:flex;justify-content:center;gap:6px;opacity:0;pointer-events:none;transition:.15s}.symbols.open{opacity:1;pointer-events:auto}.symbols button{border:0;border-radius: 8px;background:#edf0ea;padding:7px 10px;font:12px var(--font-mono);cursor:pointer}.game-screen footer{display:flex;justify-content:center;gap:24px;max-width:800px;margin:24px auto;color:#6d7b78;font-size:12px}.results{max-width:760px;margin:auto;padding-top:68px;text-align:center}.results .eyebrow{margin-bottom:8px}.results h1{font-size:52px}.score{display:flex;flex-direction:column;justify-content:center;width:180px;height:180px;margin:30px auto;border:2px solid #172b42;border-radius:50%;box-shadow:inset 0 0 0 8px #f7f5ef,inset 0 0 0 10px #91adc7}.score strong{font:700 45px var(--font-mono)}.score span{font:10px var(--font-mono);letter-spacing:.15em}.result-stats{display:grid;grid-template-columns:repeat(3,1fr);margin-top:38px;border-block:1px solid rgba(23,43,66,.14)}.result-stats p{display:flex;flex-direction:column;gap:5px;padding:22px}.result-stats p+p{border-left:1px solid rgba(23,43,66,.14)}.result-stats strong{font:700 24px var(--font-mono)}.note{margin:25px;color:#63706e}.actions{display:flex;justify-content:center;gap:10px}.actions button{padding:14px 24px;border:1px solid #172b42;border-radius: 8px;background:transparent;font-weight:700;cursor:pointer}.actions button:last-child{background:#172b42;color:white}@keyframes shake{30%{transform:translateX(-5px)}70%{transform:translateX(5px)}}
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
.round-progress { background: #dce3eb; }
.round-progress i { background: var(--accent); }
.round-stats { display: flex; justify-self: end; gap: 22px; text-align: right; }
.round-stats span { display: block; margin-bottom: 4px; font: 9px var(--font-mono); color: #63706e; letter-spacing: .08em; }
.round-stats strong { display: block; font-variant-numeric: tabular-nums; }
.elapsed-summary { margin-top: 18px; color: #63706e; font-size: 13px; }
.elapsed-summary strong { margin-left: 8px; color: #172b42; font-family: var(--font-mono); }

.question-card { transition: background-color .18s, border-color .18s, box-shadow .18s; }
.question-card.answer-correct { background: #f3fbf5; border-color: #2c8054; box-shadow: 0 0 0 3px #2c80541a; }
.question-card.answer-incorrect { background: #fff7f5; border-color: #bd4b3e; box-shadow: 0 0 0 3px #bd4b3e1a; }
.math-editor.right, .math-editor.right:focus-within { border-color: #267346; color: #21653e; background: #e4f4e8; }
.math-editor.wrong, .math-editor.wrong:focus-within { border-color: #b34135; color: #9b352c; background: #fce7e2; }
.math-editor.right, .math-editor.wrong { border-radius: 8px 8px 0 0; }
.question-card .math-editor.right .math-caret, .question-card .math-editor.wrong .math-caret { display: none; }
.answer-feedback { display: flex; align-items: center; gap: 16px; min-height: 156px; max-width: 560px; box-sizing: border-box; margin: 18px auto; padding: 18px 20px; border: 1px solid transparent; border-radius: 12px; }
.answer-feedback.success { color: #21653e; background: #e4f4e8; border-color: #afd5ba; }
.answer-feedback.error { color: #9b352c; background: #fce7e2; border-color: #edb6ac; }
.feedback-icon { display: grid; place-items: center; flex: 0 0 44px; height: 44px; border-radius: 50%; background: #267346; color: white; animation: feedback-pop .3s ease-out; }
.error .feedback-icon { background: #b34135; }
.feedback-icon svg { width: 26px; height: 26px; }
.feedback-content { flex: 1; min-width: 0; }
.feedback-heading { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
.feedback-heading strong { font-size: 23px; line-height: 1.2; font-weight: 650; }
.streak-badge { padding: 4px 9px; border-radius: 20px; background: #267346; color: white; font: 11px var(--font-mono); }
.feedback-content p { margin: 7px 0 0; font-size: 13px; line-height: 1.4; }
.feedback-answer { overflow-x: auto; font-size: 21px; }
.feedback-answer :deep(.katex-display) { margin: .4em 0; text-align: left; }
.feedback-content .retry-note { font-size: 12px; }
.symbols button:disabled { opacity: .45; cursor: default; }
@keyframes feedback-pop { from { transform: scale(.7); opacity: .4; } to { transform: scale(1); opacity: 1; } }
@media(max-width:600px) { .answer-feedback { padding: 16px 12px; gap: 12px; }.feedback-heading strong { font-size: 21px; }.feedback-answer { font-size: 17px; }.feedback-icon { flex-basis: 36px; height: 36px; }.feedback-icon svg { width: 22px; height: 22px; } }
@media (prefers-reduced-motion: reduce) { .level, .symbols, .question-card { transition: none; } .math-caret, .feedback-icon { animation: none; } .math-editor.wrong { animation: none; } }

</style>
