<script setup>
import { traceAStar } from '~/utils/aStar.js';
import { manhattanGraph } from '~/utils/manhattanGrid.js';

definePageMeta({ layout: false });
useHead({ title: 'A* · Manhattan', htmlAttrs: { lang: 'en' } });
const algorithms = { astar: { name: 'A* · Manhattan', label: 'A* · Manhattan' } };
// One frame per completed expansion keeps the grid animation readable.
const traces = { astar: traceAStar(manhattanGraph).filter(state => ['ready', 'expand', 'found', 'failed'].includes(state.phase)) };
</script>

<template>
  <SearchAnimation :graph="manhattanGraph" :algorithms="algorithms" :traces="traces" />
</template>
