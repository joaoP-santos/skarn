<script setup>
const props = defineProps({
  graph: { type: Object, required: true },
  state: { type: Object, required: true },
  algorithm: { type: String, required: true },
});
const host = ref(null);
const following = ref(!props.graph.grid);
const reducedMotion = ref(false);
const motionKey = ref(0);
const points = Object.fromEntries(props.graph.nodes.map(node => [node.id, props.graph.grid
  ? { x: 70 + node.x * 62, y: 45 + node.y * 62 } : node]));
const current = computed(() => points[props.state.current?.node || props.graph.start]);
const goal = points[props.graph.goal];
const solved = computed(() => props.state.phase === 'found');
const pathPoints = computed(() => props.state.path.map(id => `${points[id].x},${points[id].y}`).join(' '));
function nodeStatus(id) {
  if (solved.value && props.state.path.includes(id)) return 'solution';
  if (props.state.current?.node === id) return 'current';
  if (props.state.frontier.some(item => item.node === id)) return 'frontier';
  if (props.state.expanded.includes(id)) return 'expanded';
  return 'unseen';
}
function edgeShape(edge) {
  const a = points[edge.from], b = points[edge.to];
  const control = edge.via || { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const trim = (point, toward, distance) => {
    const length = Math.hypot(toward.x - point.x, toward.y - point.y);
    return { x: point.x + (toward.x - point.x) * distance / length, y: point.y + (toward.y - point.y) * distance / length };
  };
  const from = trim(a, control, 28), to = trim(b, control, 34);
  const at = t => ({
    x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * control.x + t ** 2 * to.x,
    y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * control.y + t ** 2 * to.y,
  });
  return { ...edge, d: `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`, label: at(0.5), samples: Array.from({ length: 13 }, (_, i) => at(i / 12)) };
}
const edges = props.graph.grid ? [] : props.graph.edges.map(edgeShape);
const activeEdge = computed(() => edges.find(edge => props.state.edge?.from === edge.from && props.state.edge?.to === edge.to));
function edgeStatus(edge) {
  if (solved.value && props.state.path.some((id, i, path) => id === edge.from && path[i + 1] === edge.to)) return 'solution';
  return edge === activeEdge.value ? 'inspecting' : '';
}
function bounds(items, padding) {
  const xs = items.map(item => item.x), ys = items.map(item => item.y);
  const x = Math.min(...xs) - padding, y = Math.min(...ys) - padding;
  return { x, y, width: Math.max(...xs) + padding - x, height: Math.max(...ys) + padding - y };
}
const full = props.graph.grid
  ? { x: 15, y: -5, width: props.graph.grid.columns * 62 + 40, height: props.graph.grid.rows * 62 + 35 }
  : bounds([...Object.values(points), ...edges.flatMap(edge => edge.samples)], 70);
const view = ref({ ...full });
const viewBox = computed(() => `${view.value.x} ${view.value.y} ${view.value.width} ${view.value.height}`);
let destination = { ...full }, observer, frame, lastTime, drag, media;
function fit(rect) {
  const aspect = host.value ? host.value.clientWidth / host.value.clientHeight : full.width / full.height;
  if (!Number.isFinite(aspect) || !aspect) return rect;
  const width = Math.max(rect.width, rect.height * aspect);
  const height = Math.max(rect.height, rect.width / aspect);
  return { x: rect.x - (width - rect.width) / 2, y: rect.y - (height - rect.height) / 2, width, height };
}
function moveTo(rect) {
  destination = fit(rect);
  if (reducedMotion.value) { cancelAnimationFrame(frame); frame = null; view.value = { ...destination }; return; }
  if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(animate); }
}
function animate(time) {
  const amount = 1 - Math.exp(-Math.min(time - lastTime, 50) / 120);
  lastTime = time;
  const next = {};
  let remaining = 0;
  for (const key of ['x', 'y', 'width', 'height']) {
    next[key] = view.value[key] + (destination[key] - view.value[key]) * amount;
    remaining += Math.abs(next[key] - destination[key]);
  }
  view.value = remaining < 0.1 ? { ...destination } : next;
  frame = remaining < 0.1 ? null : requestAnimationFrame(animate);
}
function focusOperation() {
  if (!following.value || ['ready', 'found', 'failed'].includes(props.state.phase)) { moveTo(full); return; }
  const relevant = activeEdge.value ? activeEdge.value.samples : [current.value];
  const rect = bounds(relevant, props.graph.grid ? 115 : 125);
  const width = Math.max(rect.width, props.graph.grid ? 370 : 580);
  const height = Math.max(rect.height, props.graph.grid ? 310 : 340);
  moveTo({ x: rect.x - (width - rect.width) / 2, y: rect.y - (height - rect.height) / 2, width, height });
}
function toggleFollowing() { following.value = !following.value; focusOperation(); }
function showAll() { following.value = false; moveTo(full); }
function beginDrag(event) {
  if (event.button !== 0) return;
  following.value = false;
  cancelAnimationFrame(frame); frame = null;
  drag = { x: event.clientX, y: event.clientY, view: { ...view.value } };
  event.currentTarget.setPointerCapture(event.pointerId);
}
function pan(event) {
  if (!drag) return;
  const scale = view.value.width / host.value.clientWidth;
  view.value = { ...drag.view, x: drag.view.x - (event.clientX - drag.x) * scale, y: drag.view.y - (event.clientY - drag.y) * scale };
}
function zoom(factor) {
  following.value = false;
  const width = Math.min(full.width * 2, Math.max(props.graph.grid ? 250 : 360, view.value.width * factor));
  const height = view.value.height * width / view.value.width;
  moveTo({ x: view.value.x + (view.value.width - width) / 2, y: view.value.y + (view.value.height - height) / 2, width, height });
}
function keyboard(event) {
  if (['+', '=', '-'].includes(event.key)) { event.preventDefault(); zoom(event.key === '-' ? 1.15 : 0.85); return; }
  const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
  if (!direction) return;
  event.preventDefault(); following.value = false;
  moveTo({ ...view.value, x: view.value.x + direction[0] * view.value.width * 0.1, y: view.value.y + direction[1] * view.value.height * 0.1 });
}
function motionPreference() { reducedMotion.value = media.matches; if (media.matches) moveTo(destination); }
watch(() => [props.state, props.algorithm], () => {
  motionKey.value++;
  if (following.value) focusOperation();
});
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionPreference();
  media.addEventListener('change', motionPreference);
  observer = new ResizeObserver(() => following.value ? focusOperation() : moveTo(view.value));
  observer.observe(host.value);
  view.value = fit(full);
  focusOperation();
});
onBeforeUnmount(() => { cancelAnimationFrame(frame); observer?.disconnect(); media?.removeEventListener('change', motionPreference); });
</script>

<template>
  <div ref="host" class="scene-container">
    <svg :viewBox="viewBox" tabindex="0" role="img" :aria-label="`2D ${algorithm.toUpperCase()} search. Current node: ${state.current?.node || graph.start}. Drag to pan; scroll to zoom. Arrow keys pan; plus and minus zoom.`" @pointerdown="beginDrag" @pointermove="pan" @pointerup="drag = null" @pointercancel="drag = null" @wheel.prevent="zoom($event.deltaY > 0 ? 1.1 : 0.9)" @keydown="keyboard">
      <defs><marker id="search-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" /></marker></defs>
      <template v-if="graph.grid">
        <text v-for="x in graph.grid.columns" :key="`x${x}`" :x="70 + (x - 1) * 62" y="4" class="coordinate" text-anchor="middle">{{ x - 1 }}</text>
        <text v-for="y in graph.grid.rows" :key="`y${y}`" x="27" :y="49 + (y - 1) * 62" class="coordinate" text-anchor="middle">{{ y - 1 }}</text>
        <g v-for="cell in graph.grid.cells" :key="cell.id" :class="['tile', cell.wall ? 'wall' : nodeStatus(cell.id)]">
          <rect :x="41 + cell.x * 62" :y="16 + cell.y * 62" width="58" height="58" rx="5" />
        </g>
        <path v-if="!solved" :d="`M ${current.x} ${current.y} H ${goal.x} V ${goal.y}`" class="heuristic-guide" />
        <polyline v-if="state.path.length > 1" :points="pathPoints" :class="['grid-path', { solved }]" />
        <g v-for="node in graph.nodes" :key="`label-${node.id}`" class="tile-values">
          <text :x="points[node.id].x + 24" :y="points[node.id].y - 17" text-anchor="end" class="tile-small">h{{ node.heuristic }}</text>
          <text v-if="state.reached[node.id]" :x="points[node.id].x - 24" :y="points[node.id].y - 17" class="tile-small">g{{ state.reached[node.id].cost }}</text>
          <text :x="points[node.id].x" :y="points[node.id].y + 6" text-anchor="middle" class="tile-marker">{{ node.id === graph.start ? 'S' : node.id === graph.goal ? 'G' : '' }}</text>
          <text v-if="state.reached[node.id]" :x="points[node.id].x" :y="points[node.id].y + 23" text-anchor="middle" class="tile-score">f{{ state.reached[node.id].priority }}</text>
        </g>
        <circle v-if="state.current && !solved" :key="motionKey" :cx="current.x" :cy="current.y" r="24" class="current-ring" />
      </template>
      <template v-else>
        <g v-for="edge in edges" :key="`${edge.from}-${edge.to}`" :class="['edge', edgeStatus(edge)]">
          <path :d="edge.d" marker-end="url(#search-arrow)" />
          <rect :x="edge.label.x - 14" :y="edge.label.y - 13" width="28" height="26" rx="6" />
          <text :x="edge.label.x" :y="edge.label.y + 6" text-anchor="middle">{{ edge.cost }}</text>
        </g>
        <circle v-if="activeEdge && !reducedMotion" :key="motionKey" r="6" class="tracer"><animateMotion :path="activeEdge.d" dur="0.65s" fill="freeze" /></circle>
        <g v-for="node in graph.nodes" :key="node.id" :class="['node', nodeStatus(node.id)]">
          <circle :cx="node.x" :cy="node.y" r="26" />
          <circle v-if="node.id === graph.goal" :cx="node.x" :cy="node.y" r="21" class="goal-ring" />
          <text :x="node.x" :y="node.y + 7" text-anchor="middle" class="node-id">{{ node.id }}</text>
          <text v-if="state.reached[node.id]" :x="node.x" :y="node.y + 46" text-anchor="middle" class="node-cost">g{{ state.reached[node.id].cost }} · d{{ state.reached[node.id].depth }}</text>
        </g>
        <circle v-if="state.current && !solved" :key="`pulse-${motionKey}`" :cx="current.x" :cy="current.y" r="32" class="current-ring" />
      </template>
    </svg>
    <div class="view-controls">
      <button :aria-pressed="following" aria-label="Follow search camera" @click="toggleFollowing">{{ following ? 'Following search' : 'Follow search' }}</button>
      <button @click="showAll">Show all</button>
    </div>
  </div>
</template>

<style scoped>
.scene-container { position: absolute; inset: 0; overflow: hidden; }
svg { display: block; width: 100%; height: 100%; touch-action: none; cursor: grab; }
svg:active { cursor: grabbing; }
svg:focus-visible { outline: 2px solid #ba662c; outline-offset: -3px; }
text { fill: #035e7b; font-family: var(--itim); }
.edge path { fill: none; stroke: #94a6a0; stroke-width: 2; transition: stroke .25s; }
.edge rect { fill: var(--light-yellow); }
.edge text { font-size: 18px; }
.edge.inspecting path { stroke: #bb6329; stroke-width: 3.5; }
.edge.solution path { stroke: #267f56; stroke-width: 3.5; }
.node > circle, .tile rect { fill: #fffedc; stroke: #8ca4aa; stroke-width: 1.5; transition: fill .25s, stroke .25s; }
.current > circle, .current rect { fill: #f4c87c; stroke: #ac6b22; stroke-width: 2.5; }
.frontier > circle, .frontier rect { fill: #bce6f7; stroke: #327d9b; }
.expanded > circle, .expanded rect { fill: #dfe4d8; stroke: #7a8b76; }
.solution > circle, .solution rect { fill: #b9dfbd; stroke: #267f56; }
.wall rect { fill: #346170; stroke: #346170; }
.node .goal-ring { fill: none; stroke-width: 1; }
.node-id { font-size: 25px; }.node-cost { font-size: 16px; paint-order: stroke; stroke: var(--light-yellow); stroke-width: 5px; stroke-linejoin: round; }
.coordinate { font-size: 12px; }.tile-small { font-size: 11px; }.tile-score { font-size: 13px; }.tile-marker { font-size: 21px; }
.heuristic-guide { fill: none; stroke: #af5585; stroke-width: 2; stroke-dasharray: 5 5; }
.grid-path { fill: none; stroke: #bb6329; stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; opacity: .65; }.grid-path.solved { stroke: #267f56; }
.tracer { fill: #bb6329; pointer-events: none; }.current-ring { fill: none; stroke: #ac6b22; stroke-width: 2; pointer-events: none; animation: pulse .65s ease-out; }
@keyframes pulse { from { opacity: 1; stroke-width: 5; } to { opacity: .45; stroke-width: 2; } }
.view-controls { position: absolute; right: 6px; bottom: 6px; display: flex; gap: 6px; }
button { padding: 6px 10px; border: 1px solid #035e7b55; border-radius: 8px; background: #fcffbee6; color: #035e7b; font: inherit; font-size: 13px; cursor: pointer; }
button:focus-visible { outline: 2px solid #ba662c; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .node > circle, .tile rect, .edge path { transition: none; }.current-ring { animation: none; } }
</style>
