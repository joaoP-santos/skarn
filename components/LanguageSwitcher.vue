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
.language-switcher {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #035e7b;
  border-radius: 8px;
  background: #fff;
  color: #001b24;
  font: 14px system-ui, sans-serif;
}
.language-switcher select {
  font: inherit;
  color: inherit;
  background: #fff;
  border: 1px solid #035e7b;
  border-radius: 4px;
  padding: 4px;
}
</style>
