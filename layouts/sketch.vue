<template>
  <Body :style="getBodyStyle"> <slot></slot></Body>
</template>

<script setup>
const getBodyStyle = computed(() => "overflow-x: hidden; overflow-y: hidden");
</script>
