<template>
  <Body :style="getBodyStyle"> <slot></slot></Body>
</template>

<script>
export default {
  computed: {
    getBodyStyle() {
      return "overflow-x: hidden; overflow-y: hidden";
    },
  },
};
</script>
