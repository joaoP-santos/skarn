<script setup>
const props = defineProps({ angle: { type: Number, default: 45 }, showValues: Boolean });
const width = computed(() => props.angle === 30 ? 190 : props.angle === 60 ? 110 : 150);
const height = computed(() => props.angle === 30 ? 110 : props.angle === 60 ? 190 : 150);
const label = computed(() => props.angle === 45 ? 'π/4' : props.angle === 30 ? 'π/6' : 'π/3');
</script>

<template>
  <figure class="special-triangle">
    <svg viewBox="0 0 300 260" role="img" :aria-label="`${angle} degree reference triangle${showValues ? ' with side lengths' : ''}`">
      <path :d="`M 40 215 H ${40 + width} V ${215 - height} Z`" fill="none" stroke="#278e6e" stroke-width="2" />
      <path :d="`M ${26 + width} 215 v -14 h 14`" fill="none" stroke="#278e6e" />
      <path :d="`M 70 215 A 30 30 0 0 0 ${40 + 30 * Math.cos(angle * Math.PI / 180)} ${215 - 30 * Math.sin(angle * Math.PI / 180)}`" fill="none" stroke="#278e6e" />
      <text x="77" y="203">{{ label }}</text>
      <text :x="27 + width" :y="245 - height" text-anchor="end">{{ angle === 45 ? 'π/4' : angle === 30 ? 'π/3' : 'π/6' }}</text>
      <template v-if="showValues">
        <text :x="40 + width / 2" y="240" text-anchor="middle">{{ angle === 30 ? '√3' : '1' }}</text>
        <text :x="52 + width" :y="215 - height / 2">{{ angle === 60 ? '√3' : '1' }}</text>
        <text :x="24 + width / 2" :y="202 - height / 2" text-anchor="end">{{ angle === 45 ? '√2' : '2' }}</text>
      </template>
    </svg>
    <figcaption>{{ angle }}° reference triangle</figcaption>
  </figure>
</template>

<style scoped>
.special-triangle{margin:0;text-align:center}.special-triangle svg{width:100%;max-height:210px;display:block}.special-triangle text{font:18px Georgia,serif;fill:#071b20}.special-triangle figcaption{font-size:12px;color:#596865}
</style>
