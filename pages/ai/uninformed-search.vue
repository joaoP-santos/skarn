<script setup>
import { searchGraph, searchAlgorithms, traceSearch } from '~/utils/uninformedSearch.js';

definePageMeta({ layout: false });
useHead({ title: 'DFS, BFS & UCS', htmlAttrs: { lang: 'en' } });
const traces = Object.fromEntries(Object.keys(searchAlgorithms).map(key => [key, traceSearch(searchGraph, key)]));
</script>

<template>
  <SearchAnimation :graph="searchGraph" :algorithms="searchAlgorithms" :traces="traces" />
</template>
