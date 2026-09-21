<script setup>
const props = defineProps({ cardIndex: { type: Number, default: null }, compact: { type: Boolean, default: false }, showValues: { type: Boolean, default: false } });
const angles = [
  { deg: 0, rad: "0", sin: "0", cos: "1" }, { deg: 30, rad: "π/6", sin: "1/2", cos: "√3/2" },
  { deg: 45, rad: "π/4", sin: "1/√2", cos: "1/√2" }, { deg: 60, rad: "π/3", sin: "√3/2", cos: "1/2" },
  { deg: 90, rad: "π/2", sin: "1", cos: "0" }, { deg: 120, rad: "2π/3", sin: "√3/2", cos: "−1/2" },
  { deg: 135, rad: "3π/4", sin: "1/√2", cos: "−1/√2" }, { deg: 150, rad: "5π/6", sin: "1/2", cos: "−√3/2" },
  { deg: 180, rad: "π", sin: "0", cos: "−1" }, { deg: 270, rad: "3π/2", sin: "−1", cos: "0" },
  { deg: 360, rad: "2π", sin: "0", cos: "1" },
];
const selected = computed(() => props.cardIndex === null ? null : angles[Math.floor(props.cardIndex / 2)]);
const selectedFunction = computed(() => props.cardIndex === null ? null : (props.cardIndex % 2 === 0 ? "sin" : "cos"));
const point = (angle, radius = 112) => ({ x: 170 + Math.cos(angle.deg * Math.PI / 180) * radius, y: 150 - Math.sin(angle.deg * Math.PI / 180) * radius });
const activePoint = computed(() => selected.value ? point(selected.value) : null);
const referenceAngle = computed(() => {
  if (!selected.value) return null;
  const angle = selected.value.deg % 180;
  const reference = Math.min(angle, 180 - angle);
  return [30, 45, 60].includes(reference) ? reference : null;
});
</script>

<template>
  <figure class="unit-circle" :class="{ compact }">
    <svg viewBox="0 0 500 300" role="img" aria-labelledby="unit-title unit-desc">
      <title id="unit-title">Unit circle exact values</title>
      <desc id="unit-desc">The horizontal coordinate is cosine and the vertical coordinate is sine.</desc>
      <line class="axis" x1="25" y1="150" x2="315" y2="150" /><line class="axis" x1="170" y1="12" x2="170" y2="288" />
      <circle class="circle" cx="170" cy="150" r="112" />
      <template v-if="selected">
        <line class="radius" x1="170" y1="150" :x2="activePoint.x" :y2="activePoint.y" />
        <line class="cos-leg" x1="170" y1="150" :x2="activePoint.x" y2="150" />
        <line class="sin-leg" :x1="activePoint.x" y1="150" :x2="activePoint.x" :y2="activePoint.y" />
        <path class="angle-arc" :d="`M 206 150 A 36 36 0 ${selected.deg > 180 ? 1 : 0} 0 ${170 + Math.cos(selected.deg * Math.PI / 180) * 36} ${150 - Math.sin(selected.deg * Math.PI / 180) * 36}`" />
        <circle class="active-point" :cx="activePoint.x" :cy="activePoint.y" r="6" />
        <text class="theta" x="211" y="137">θ = {{ selected.rad }}</text>
      </template>
      <template v-else>
        <g v-for="angle in angles.slice(0, -1)" :key="angle.deg">
          <circle class="standard-point" :cx="point(angle).x" :cy="point(angle).y" r="4" />
          <text class="angle-label" :x="point(angle, 137).x" :y="point(angle, 137).y + 4">{{ angle.rad }}</text>
        </g>
      </template>
      <g class="legend" transform="translate(335 83)">
        <text class="legend-title" x="0" y="0">POINT ON THE CIRCLE</text>
        <text class="ordered-pair" x="0" y="40">(cos θ, sin θ)</text>
        <template v-if="selected">
          <text v-if="showValues" class="value cos-value" x="0" y="83">cos θ = {{ selected.cos }}</text>
          <text v-if="showValues" class="value sin-value" x="0" y="116">sin θ = {{ selected.sin }}</text>
          <text class="focus" x="0" y="158">{{ selectedFunction }} is highlighted</text>
        </template>
        <template v-else><text class="guide" x="0" y="82">horizontal → cosine</text><text class="guide" x="0" y="112">vertical → sine</text></template>
      </g>
    </svg>
    <div v-if="referenceAngle" class="special-triangles">
      <TrigSpecialTriangle :angle="referenceAngle" show-values />
      <p v-if="selected.deg > 90">Use the {{ referenceAngle }}° reference angle; the quadrant determines the sign.</p>
    </div>
    <div v-else-if="!selected" class="special-triangles overview">
      <TrigSpecialTriangle :angle="45" show-values />
      <TrigSpecialTriangle :angle="30" show-values />
    </div>
    <figcaption v-if="!compact">Every point is <b>(cos θ, sin θ)</b>. Read horizontally for cosine and vertically for sine.</figcaption>
  </figure>
</template>

<style scoped>
.unit-circle{margin:0 0 18px;padding:18px 22px;border:1px solid rgba(7,27,32,.13);border-radius:14px;background:#fffdf7}.unit-circle svg{display:block;width:100%;max-height:330px}.axis{stroke:#8c9895;stroke-width:1.5}.circle{fill:none;stroke:#071b20;stroke-width:2}.radius{stroke:#071b20;stroke-width:2.5}.cos-leg{stroke:#278e6e;stroke-width:5;stroke-linecap:round}.sin-leg{stroke:#e85c49;stroke-width:5;stroke-linecap:round}.angle-arc{fill:none;stroke:#71807d;stroke-width:1.5}.active-point{fill:#071b20}.standard-point{fill:#278e6e}.angle-label{fill:#53625f;font:15px Georgia,serif;text-anchor:middle}.theta{fill:#53625f;font:italic 14px Georgia,serif}.legend-title{fill:#278e6e;font:500 9px DM Mono,monospace;letter-spacing:.12em}.ordered-pair{fill:#071b20;font:italic 22px Georgia,serif}.value{font:18px Georgia,serif}.cos-value{fill:#278e6e}.sin-value{fill:#e85c49}.focus,.guide{fill:#71807d;font:11px DM Mono,monospace}.unit-circle figcaption{text-align:center;color:#596865;line-height:1.5}.unit-circle.compact{max-width:610px;margin:12px auto 0;padding:5px 12px}.unit-circle.compact svg{max-height:210px}.unit-circle.compact .legend-title{font-size:10px}@media(max-width:650px){.unit-circle{padding:8px}.unit-circle svg{min-height:240px}.angle-label{font-size:12px}.legend{transform:translate(320px,83px)}}
</style>

<style scoped>
.special-triangles{border-top:1px solid #dce4df;margin-top:8px;padding:10px 0}.special-triangles.overview{display:grid;grid-template-columns:1fr 1fr}.special-triangles p{text-align:center;color:#596865;font-size:12px;margin-top:8px}
</style>
