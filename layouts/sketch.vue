<script setup>
const portrait = ref(null);
onMounted(() => {
  function checkPortrait() {
    portrait.value = window.matchMedia("(orientation: portrait)").matches;
  }
  addEventListener("resize", checkPortrait);
  checkPortrait();
});
</script>

<template>
  <Body style="overflow-x: hidden; overflow-y: hidden">
    <slot v-if="!portrait"></slot>
    <NoPortrait v-else />
  </Body>
</template>
