import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { ref, reactive, computed } from "vue";
import katex from "katex";
import * as curriculum from "../utils/trigSprint.js";

const { levels, allCards, buildRound, restoreProgress } = curriculum;
const cards = allCards();
assert.equal(new Set(cards.map(entry => entry.id)).size, cards.length);
for (const [index, level] of levels.slice(0, -1).entries()) {
  assert.ok(level.cards.length >= 1 && level.cards.length <= 2, level.name);
  assert.ok(level.name);
  const freshIds = new Set(level.entries.map(entry => entry.id));
  const earlierIds = new Set(levels.slice(0, index).flatMap(item => item.entries.map(entry => entry.id)));
  const round = buildRound(index, "practice");
  assert.ok(round.length <= 10);
  for (const id of freshIds) assert.equal(round.filter(entry => entry.id === id).length, 3);
  for (const entry of round) assert.ok(freshIds.has(entry.id) || earlierIds.has(entry.id));
  assert.equal(buildRound(index, "learn").length, level.cards.length);
}
assert.equal(buildRound(levels.length - 1, "practice").length, 12);
const skippedTo = levels.length - 2;
assert.deepEqual(new Set(buildRound(skippedTo, "practice").map(entry => entry.id)), new Set(levels[skippedTo].entries.map(entry => entry.id)), "Skipping ahead introduces only that level's facts");
assert.ok(!cards.some(({ card }) => card[0].includes("P(x,y)") || card[3].some(answer => /opp|hyp|adj|^[xyr]\/[xyr]$/.test(answer))));

// Every identity in the supplied chart, including all ± and double-angle forms.
const chart = [
  ["sin(-theta)", "-sin"], ["cos(-theta)", "cos"], ["tan(-theta)", "-tan"],
  ["sin^2(x)+cos^2(x)", "1"], ["1+tan^2(x)", "sec^2(x)"], ["1+cot^2(x)", "csc^2(x)"],
  ["sin(pi/2-x)", "cos"], ["cos(pi/2-x)", "sin"], ["tan(pi/2-x)", "cot"],
  ["sin(x+y)", "sin(x)cos(y)+cos(x)sin(y)"], ["sin(x-y)", "sin(x)cos(y)-cos(x)sin(y)"],
  ["cos(x+y)", "cos(x)cos(y)-sin(x)sin(y)"], ["cos(x-y)", "cos(x)cos(y)+sin(x)sin(y)"],
  ["tan(x+y)", "(tan(x)+tan(y))/(1-tan(x)tan(y))"], ["tan(x-y)", "(tan(x)-tan(y))/(1+tan(x)tan(y))"],
  ["sin(2x)", "2sin(x)cos(x)"], ["cos(2x)", "cos^2(x)-sin^2(x)"],
  ["cos(2x)", "2cos^2(x)-1"], ["cos(2x)", "1-2sin^2(x)"],
  ["sin(x)sin(y)", "(cos(x-y)-cos(x+y))/2"],
  ["cos(x)cos(y)", "(cos(x+y)+cos(x-y))/2"],
  ["sin(x)cos(y)", "(sin(x+y)+sin(x-y))/2"],
  ["sin(x)+sin(y)", "2sin((x+y)/2)cos((x-y)/2)"],
  ["cos(x)+cos(y)", "2cos((x+y)/2)cos((x-y)/2)"],
];
for (const [prompt, answer] of chart) assert.ok(cards.some(({ card }) => card[2] === prompt && card[3].includes(answer)), prompt);
for (const { card } of cards) for (const formula of card.slice(0, 2)) katex.renderToString(formula, { throwOnError: true });

const memories = Object.fromEntries(cards.map(entry => [entry.id, { strength: 100 }]));
memories["1-0"] = { strength: 10 };
memories["1-1"] = { strength: 90, due: 1 };
const reviewed = buildRound(5, "practice", memories, () => .5, 10);
assert.ok(reviewed.some(entry => entry.id === "1-0"));
assert.ok(reviewed.some(entry => entry.id === "1-1"));
const migrated = restoreProgress(null, { levels: Array(10).fill(90), cards: { "1-0": { strength: 70 }, "0-0": { strength: 100 } } });
assert.equal(migrated.cards["1-0"].strength, 70);
assert.ok(!migrated.cards["0-0"]);
assert.equal(migrated.levels[0], 90);
assert.ok(levels.every((level, index) => level.legacyLevel !== null || migrated.levels[index] === 0));
assert.deepEqual(restoreProgress(migrated), migrated);

// Exercise the page's actual round lifecycle with Vue reactivity and a controlled clock.
const source = readFileSync(new URL("../pages/math/trig-sprint.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;$/gm, "");
const pending = new Map();
const intervals = new Map();
let elapsedClock = 0;
let unmount;
let timerId = 0;
const sandbox = vm.createContext({
  ...curriculum, ref, reactive, computed,
  definePageMeta() {}, useHead() {}, onMounted() {}, onBeforeUnmount(callback) { unmount = callback; }, nextTick() {},
  localStorage: { setItem() {} },
  performance: { now: () => elapsedClock },
  setTimeout(callback) { pending.set(++timerId, callback); return timerId; },
  clearTimeout(id) { pending.delete(id); },
  setInterval(callback) { intervals.set(++timerId, callback); return timerId; },
  clearInterval(id) { intervals.delete(id); },
});
vm.runInContext(script, sandbox);
const run = code => vm.runInContext(code, sandbox);
const advance = () => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(callback => callback()); };
const answer = (wrong = false) => { run(`input.value = ${wrong ? '"wrong"' : 'current.value.answers[0]'}; submit()`); advance(); };
run('start(0)');
assert.equal(run('roundSize.value'), 6);
assert.equal(pending.size, 0, "No time limit");
assert.equal(run('elapsedTime.value'), "0:00");
elapsedClock = 125000;
intervals.forEach(callback => callback());
assert.equal(run('elapsedTime.value'), "2:05");
assert.equal(run('screen.value'), "game", "Passing 60 seconds cannot end a round");
assert.equal(run('completed.value'), 0);
assert.equal(run('score.value'), 0, "Elapsed time does not affect scoring");
run('input.value = "wrong"; submit()');
assert.equal(run('locked.value && !good.value'), true);
assert.equal(run('correctionLatex.value'), run('current.value.displayAnswer'));
assert.equal(run('completed.value'), 0);
run('insert("sin")');
assert.equal(run('input.value'), "wrong", "Feedback preserves the submitted answer");
advance();
assert.equal(run('locked.value'), false);
assert.equal(run('correctionLatex.value'), "");
run('input.value = current.value.answers[0]; submit()');
assert.equal(run('locked.value && good.value'), true);
assert.equal(run('completed.value'), 1);
advance();
while (run('screen.value') === "game") answer();
assert.equal(run('completed.value'), 6);
assert.equal(run('screen.value'), "results");
assert.equal(intervals.size, 0, "Completion stops the elapsed timer");
assert.equal(run('elapsedTime.value'), "2:05");
run('start(1)');
assert.equal(run('elapsedTime.value'), "0:00", "A new round resets elapsed time");
run('start(1); input.value = current.value.answers[0]; submit(); exit()');
assert.equal(pending.size, 0, "Leaving cancels pending next-card work");
assert.equal(intervals.size, 0, "Leaving stops the elapsed timer");
advance();
assert.equal(run('screen.value'), "levels");
assert.equal(run('progress.levels[1]'), 0, "An abandoned round cannot record completion");
run('start(1, "learn")');
while (run('screen.value') === "game") answer();
assert.equal(run('progress.levels[1]'), 0, "Copying answers does not pass practice");
run('start(1)');
for (let i = 0; i < 4; i++) answer(true);
while (run('screen.value') === "game") answer();
assert.ok(run('progress.levels[1]') < 80, "Low accuracy is recorded without restricting level access");
run(`start(${skippedTo})`);
assert.equal(run('level.value'), skippedTo, "An uncompleted level can be started directly");
assert.equal(run('screen.value'), "game");
run(`start(${skippedTo})`);
assert.equal(intervals.size, 1, "Restarting cannot leave duplicate timers");
unmount();
assert.equal(intervals.size, 0, "Unmounting cleans up the elapsed timer");

console.log(`trig sprint: ${levels.length - 1} small levels, chart coverage, adaptive review, saved progress, open level access, and elapsed timer lifecycle passed`);
