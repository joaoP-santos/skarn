<script setup>
import { supplies, solveKnapsack } from '~/utils/knapsack.js';

definePageMeta({ layout: 'sketch' });
useHead({ title: 'Knapsack' });

const table = solveKnapsack(supplies, 9);
const tick = ref(0);
const playing = ref(true);
const speed = ref(1);
const cell = computed(() => Math.floor(tick.value / 3));
const phase = computed(() => tick.value % 3);
const row = computed(() => Math.floor(cell.value / 10));
const column = computed(() => cell.value % 10);
const item = computed(() => supplies[row.value - 1]);
const branches = computed(() => row.value > 0 && item.value.weight <= column.value);
const skip = computed(() => row.value > 0 ? table[row.value - 1][column.value] : 0);
const pick = computed(() => branches.value ? table[row.value - 1][column.value - item.value.weight] : 0);
const operation = computed(() => {
  if (row.value === 0) return 'i ≤ 0  →  0';
  if (!branches.value) return `${item.value.weight} > ${column.value}  →  T[${row.value - 1}][${column.value}]${phase.value > 0 ? ` = ${skip.value}` : ''}`;
  if (phase.value === 0) return `max(T[${row.value - 1}][${column.value}], ${item.value.value} + T[${row.value - 1}][${column.value - item.value.weight}])`;
  return `max(${skip.value}, ${item.value.value} + ${pick.value})${phase.value === 2 ? ` = ${table[row.value][column.value]}` : ''}`;
});
const x = c => 280 + c * 70;
const y = r => 150 + r * 65;
let timer;
function schedule() {
  clearTimeout(timer);
  if (playing.value && tick.value < 179) timer = setTimeout(() => { tick.value++; schedule(); }, 650 / speed.value);
  else if (tick.value === 179) playing.value = false;
}
function step() { playing.value = false; tick.value = Math.min(179, tick.value + 1); }
function selectCell(r, c) {
  clearTimeout(timer);
  playing.value = false;
  tick.value = (r * 10 + c) * 3;
}
function restart() { tick.value = 0; playing.value = true; schedule(); }
watch([playing, speed], schedule);
onMounted(() => { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) playing.value = false; schedule(); });
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <main class="animation">
    <div class="controls">
      <button :disabled="tick === 179" @click="playing = !playing">{{ playing ? 'Pause' : 'Play' }}</button>
      <button :disabled="tick === 179" @click="step">Step</button>
      <button @click="restart">Restart</button>
      <label>Speed <input v-model.number="speed" type="range" min="0.5" max="3" step="0.5" /> {{ speed }}×</label>
    </div>
    <svg viewBox="0 0 1020 680" role="group" aria-label="Script 1 knapsack table animation. Select a cell to pause at its operation.">
      <defs><marker id="knapsack-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" /></marker></defs>
      <text x="40" y="62" class="metadata">i = {{ row }}　 c = {{ column }}</text>
      <text v-if="item" x="980" y="62" text-anchor="end" class="metadata">weight = {{ item.weight }}　 value = {{ item.value }}</text>
      <text x="40" y="110" class="label">items (weight, value)</text>
      <text x="630" y="95" text-anchor="middle" class="label">capacity</text>
      <text v-for="c in 10" :key="`col-${c}`" :x="x(c - 1) + 35" y="132" text-anchor="middle">{{ c - 1 }}</text>
      <g v-for="(values, r) in table" :key="r">
        <text x="258" :y="y(r) + 39" text-anchor="end" class="label" :class="{ activeLabel: r === row }">{{ r === 0 ? '∅' : `${supplies[r - 1].name} (${supplies[r - 1].weight}, ${supplies[r - 1].value})` }}</text>
        <g v-for="(value, c) in values" :key="c" class="selectable-cell" role="button" tabindex="0" :aria-label="`Pause at row ${r}, capacity ${c}`" :aria-pressed="r === row && c === column" @click="selectCell(r, c)" @keydown.enter.prevent="selectCell(r, c)" @keydown.space.prevent="selectCell(r, c)">
          <rect :x="x(c)" :y="y(r)" width="70" height="65" class="cell" :class="{ dependency: row > 0 && r === row - 1 && c === column, picked: branches && r === row - 1 && c === column - item.weight }" />
          <text :x="x(c) + 35" :y="y(r) + 41" text-anchor="middle" :class="{ pending: r * 10 + c > cell || (r * 10 + c === cell && phase < 2) }">{{ r * 10 + c < cell || (r * 10 + c === cell && phase === 2) ? value : '−1' }}</text>
        </g>
      </g>
      <rect :x="x(column) + 3" :y="y(row) + 3" width="64" height="59" class="cursor" />
      <g v-if="row > 0" class="connections">
        <path :d="`M ${x(column) + 46} ${y(row - 1) + 48} L ${x(column) + 46} ${y(row) + 13}`" marker-end="url(#knapsack-arrow)" />
        <path v-if="branches" :d="`M ${x(column - item.weight) + 35} ${y(row - 1) + 51} Q ${x(column - item.weight) + 35} ${y(row) + 6} ${x(column) + 15} ${y(row) + 16}`" marker-end="url(#knapsack-arrow)" />
      </g>
      <text x="510" y="594" text-anchor="middle" class="operation">{{ operation }}</text>
      <text x="510" y="645" text-anchor="middle" class="assignment">T[{{ row }}][{{ column }}] ← {{ phase === 2 ? table[row][column] : '…' }}</text>
    </svg>
  </main>
</template>

<style scoped>
.animation { width: 100vw; height: 100dvh; background: var(--light-yellow); color: var(--dark-blue); display: flex; flex-direction: column; font-family: var(--itim); }
.controls { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; padding: 12px 18px; }
button { font: inherit; color: var(--dark-blue); background: transparent; border: 2px solid var(--dark-blue); border-radius: 8px; padding: 6px 14px; cursor: pointer; }
button:hover { background: var(--dark-blue); color: var(--light-yellow); }
button:disabled { opacity: .4; cursor: default; }
label { display: flex; align-items: center; gap: 8px; } input { accent-color: var(--dark-blue); width: 110px; }
svg { width: 100%; flex: 1; min-height: 0; }
text { fill: var(--dark-blue); font-family: var(--itim); font-size: 24px; }
.label { font-size: 18px; } .metadata { font-size: 23px; } .activeLabel { font-weight: bold; }
.cell { fill: transparent; stroke: var(--dark-blue); stroke-width: 1; }
.dependency { fill: #51bbfe; } .picked { fill: var(--darker-yellow); }
.pending { opacity: .25; }
.selectable-cell { cursor: pointer; }
.selectable-cell:focus-visible { outline: 3px solid var(--dark-blue); outline-offset: 2px; }
.cursor { fill: none; stroke: var(--dark-blue); stroke-width: 4; transition: x .18s, y .18s; pointer-events: none; }
.connections { color: var(--dark-blue); fill: none; stroke: var(--dark-blue); stroke-width: 2; pointer-events: none; }
.operation { font-size: 30px; } .assignment { font-size: 25px; }
@media (prefers-reduced-motion: reduce) { .cursor { transition: none; } }
</style>
