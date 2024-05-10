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
  <Navbar v-if="!portrait" />
  <slot v-if="!portrait"></slot>
  <NoPortrait v-else />
</template>
