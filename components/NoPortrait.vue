<script setup>
const { t } = useLanguage();
</script>

<template>
  <div>{{ t('Rotacione a tela para utilizar o site!') }}</div>
</template>
<style scoped>
div { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-sizing: border-box; width: min(85vw, 420px); background: var(--surface); border: 1px solid var(--line); border-top: 3px solid var(--accent); color: var(--ink); font: 400 18px/1.6 var(--font-sans); padding: 32px; text-align: center; }
</style>
