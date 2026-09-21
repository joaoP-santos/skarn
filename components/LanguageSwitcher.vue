<script setup>
const { locale, setLanguage } = useLanguage();
const selectedLanguage = computed({
  get: () => locale.value,
  set: (value) => setLanguage(value),
});
</script>

<template>
  <div class="language-switcher">
    <label for="site-language">{{ locale === 'pt' ? 'Idioma' : 'Language' }}</label>
    <select id="site-language" v-model="selectedLanguage">
      <option value="en">English</option>
      <option value="pt">Português</option>
    </select>
  </div>
</template>

<style scoped>
.language-switcher { position: fixed; right: 16px; bottom: 14px; z-index: 1000; display: flex; align-items: center; gap: 12px; padding: 7px 10px 7px 14px; border: 1px solid var(--line); border-radius: 9px; background: #fffffff5; color: var(--muted); box-shadow: 0 2px 10px #183c4008; font: 400 11px var(--font-mono); }
.language-switcher select { font: inherit; color: var(--ink); background: transparent; border: 0; border-left: 1px solid var(--line); padding: 4px 6px 4px 10px; cursor: pointer; }
</style>
