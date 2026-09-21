<script setup>
const props = defineProps({
  graph: { type: Object, required: true },
  algorithms: { type: Object, required: true },
  traces: { type: Object, required: true },
});

const algorithm = ref(Object.keys(props.algorithms)[0]);
const tick = ref(0);
const playing = ref(true);
const speed = ref(1);
const graph = props.graph;
const trace = computed(() => props.traces[algorithm.value]);
const state = computed(() => trace.value[tick.value]);
const finished = computed(() => tick.value === trace.value.length - 1);
const nodes = Object.fromEntries(graph.nodes.map(node => [node.id, node]));
const gridCurrent = computed(() => nodes[state.value.current?.node || graph.start]);
const gridGoal = computed(() => nodes[graph.goal]);

function seek(index) {
  playing.value = false;
  tick.value = Math.max(0, Math.min(trace.value.length - 1, Number(index)));
}
function restart() { tick.value = 0; playing.value = true; schedule(); }
let timer;
function schedule() {
  clearTimeout(timer);
  if (!playing.value) return;
  if (finished.value) { playing.value = false; return; }
  timer = setTimeout(() => { tick.value++; schedule(); }, (graph.grid ? 700 : 1500) / speed.value);
}
watch(algorithm, restart, { flush: 'sync' });
watch([playing, speed], schedule);
onMounted(() => {
  playing.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  schedule();
});
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <main class="animation" :class="{ 'grid-animation': graph.grid }">
    <header class="toolbar">
      <NuxtLink to="/" class="back" aria-label="Back to Skarn">←</NuxtLink>
      <div class="algorithms" role="group" aria-label="Search algorithm">
        <button v-for="(item, key) in algorithms" :key="key" :aria-label="item.name" :aria-pressed="algorithm === key" :class="{ selected: algorithm === key }" @click="algorithm = key">{{ item.label || key.toUpperCase() }}</button>
      </div>
      <span v-if="algorithm === 'astar'" class="formula">f = g + h</span>
      <span v-if="graph.grid" class="formula">h = |{{ gridCurrent.x }} − {{ gridGoal.x }}| + |{{ gridCurrent.y }} − {{ gridGoal.y }}| = {{ gridCurrent.heuristic }}</span>
      <div class="playback">
        <button :disabled="finished" @click="playing = !playing">{{ playing ? 'Pause' : 'Play' }}</button>
        <button :disabled="tick === 0" aria-label="Previous step" @click="seek(tick - 1)">←</button>
        <button :disabled="finished" aria-label="Next step" @click="seek(tick + 1)">→</button>
        <button @click="restart">Restart</button>
        <select v-model.number="speed" aria-label="Playback speed"><option :value="0.5">0.5×</option><option :value="1">1×</option><option :value="2">2×</option><option :value="3">3×</option></select>
      </div>
    </header>
    <div class="diagram">
      <ClientOnly>
        <SearchScene :graph="graph" :state="state" :algorithm="algorithm" />
      </ClientOnly>
    </div>
    <section class="reading-guide" aria-label="How to read the search visualization">
      <ul class="legend" aria-label="Color legend">
        <li><i class="swatch unseen" aria-hidden="true"></i>Unseen</li>
        <li><i class="swatch current" aria-hidden="true"></i>Current</li>
        <li><i class="swatch frontier" aria-hidden="true"></i>Reached · waiting</li>
        <li><i class="swatch expanded" aria-hidden="true"></i>Expanded · checked</li>
        <li><i class="swatch solution" aria-hidden="true"></i>Solution</li>
        <li v-if="graph.grid"><i class="swatch wall" aria-hidden="true"></i>Wall</li>
      </ul>
      <p class="letter-legend">
        <span><strong>S</strong> · start</span>
        <span><strong>G</strong> · goal</span>
        <span v-if="!graph.grid"><strong>A–F, H–M</strong> · node names</span>
        <span><strong>g</strong> · cost from start</span>
        <template v-if="algorithm === 'astar'">
          <span><strong>h</strong> · estimated cost to goal</span>
          <span><strong>f = g + h</strong> · estimated total cost</span>
        </template>
        <span v-else><strong>d</strong> · depth (moves from start)</span>
      </p>
    </section>
    <div class="state-strip">
      <span class="structure">{{ algorithm === 'dfs' ? 'Stack' : algorithm === 'bfs' ? 'Queue' : 'Priority queue' }}</span>
      <TransitionGroup name="frontier" tag="ol" class="frontier-list" aria-label="Frontier, next out first">
        <li v-for="(entry, index) in state.frontier" :key="entry.node" :class="{ next: index === 0 }"><strong>{{ entry.node }}</strong><span v-if="algorithm === 'astar'">f = {{ entry.priority }}</span><span v-else-if="algorithm === 'ucs'">g = {{ entry.cost }}</span></li>
      </TransitionGroup>
      <span v-if="!state.frontier.length" class="empty">∅</span>
      <output v-if="state.phase === 'found'" class="result"><template v-if="graph.grid">S → G · {{ state.current.cost }} steps</template><template v-else>{{ state.path.join(' → ') }} <span>· cost {{ state.current.cost }}</span></template></output>
    </div>
    <label class="timeline"><span>Step {{ tick }} / {{ trace.length - 1 }}</span><input type="range" min="0" :max="trace.length - 1" :value="tick" aria-label="Search step" @input="seek($event.target.value)" /></label>
  </main>
</template>

<style scoped>
.animation { --ink: #035e7b; --diagram-min: clamp(180px, 42vw, 300px); min-height: 100dvh; box-sizing: border-box; padding: clamp(12px, 2dvh, 20px) clamp(12px, 2vw, 32px); background: var(--light-yellow); color: var(--ink); display: grid; grid-template-rows: auto minmax(var(--diagram-min), 1fr) auto auto auto; gap: 10px; font-family: var(--itim); }
.grid-animation { --diagram-min: clamp(240px, 60vw, 360px); }
.animation > * { min-width: 0; }
.toolbar, .algorithms, .playback { display: flex; align-items: center; gap: 8px; }
.toolbar { flex-wrap: wrap; gap: 16px; }.back { color: inherit; text-decoration: none; font-size: 25px; padding: 4px 10px; }.playback { margin-left: auto; }
button, select { font: inherit; font-size: 16px; color: inherit; border: 1px solid var(--ink); background: transparent; border-radius: 8px; padding: 7px 13px; cursor: pointer; }
button.selected { color: var(--light-yellow); background: var(--ink); }button:hover:not(:disabled) { background: #035e7b18; }button.selected:hover { background: #064c61; }button:disabled { opacity: .35; cursor: default; }
button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 3px solid #ba662c; outline-offset: 3px; }
.diagram { position: relative; min-height: 0; }
.reading-guide { border-top: 1px solid #035e7b30; padding-top: 10px; font-size: 14px; line-height: 1.4; }
.letter-legend { display: flex; flex-wrap: wrap; gap: 4px 18px; margin: 6px 0 0; }
.legend { display: flex; flex-wrap: wrap; gap: 4px 18px; list-style: none; margin: 0; padding: 0; }
.legend li { display: flex; align-items: center; gap: 7px; }
.swatch { display: inline-block; width: 13px; height: 13px; flex-shrink: 0; border: 1px solid #8ca4aa; border-radius: 3px; background: var(--light-yellow); }
.swatch.current { background: #f4c87c; border-color: #ac6b22; }.swatch.frontier { background: #bce6f7; border-color: #327d9b; }.swatch.expanded { background: #dfe4d8; border-color: #7a8b76; }.swatch.solution { background: #b9dfbd; border-color: #267f56; }.swatch.wall { background: #346170; border-color: #346170; }
.state-strip { display: flex; align-items: center; gap: 12px; min-height: 44px; flex-wrap: wrap; }.structure { font-size: 15px; flex-shrink: 0; }.frontier-list { list-style: none; display: flex; gap: 6px; position: relative; flex: 1; }.frontier-list li { display: flex; align-items: center; gap: 8px; box-sizing: border-box; border: 1px solid #6b9fb2; border-radius: 8px; background: #d9eff5; padding: 6px 10px; min-width: 38px; justify-content: center; }.frontier-list li.next { border: 2px solid var(--ink); }.frontier-list strong { font-size: 18px; font-weight: 400; }.frontier-list span { font-size: 13px; }.empty { opacity: .5; }.result { margin-left: auto; color: #267f56; font-size: 17px; }.result span { margin-left: 10px; }
.frontier-move, .frontier-enter-active, .frontier-leave-active { transition: transform .25s, opacity .25s; }.frontier-enter-from, .frontier-leave-to { opacity: 0; transform: translateY(12px); }.frontier-leave-active { position: absolute; }
.frontier-list { margin: 0; padding: 3px; min-width: 0; overflow-x: auto; }.frontier-list li { flex-shrink: 0; }
.frontier-list:empty { display: none; }
.grid-animation .frontier-list { flex: 1; }.grid-animation .structure, .grid-animation .result { flex-shrink: 0; }
.timeline { display: flex; align-items: center; gap: 12px; font-size: 13px; }.timeline span { white-space: nowrap; }.timeline input { flex: 1; min-width: 0; margin: 0; accent-color: var(--ink); }
@media (max-width: 600px) { .animation { padding: 12px; gap: 8px; }.toolbar { gap: 8px; }.playback { margin-left: 0; flex-wrap: wrap; gap: 6px; }button, select { padding: 6px 10px; }.reading-guide { font-size: 13px; }.legend, .letter-legend { column-gap: 12px; }.state-strip { gap: 8px; }.result { width: 100%; margin-left: 0; } }
@media (prefers-reduced-motion: reduce) { .frontier-move, .frontier-enter-active, .frontier-leave-active { transition: none; } }
</style>
