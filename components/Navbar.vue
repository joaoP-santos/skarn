<script setup>
const { t } = useLanguage();
</script>

<template>
  <div>
    <NuxtLink to="/">{{ t('Aprender') }}</NuxtLink>
    <NuxtLink to="/contact">{{ t('Contato') }}</NuxtLink>
    <NuxtLink to="/donate">{{ t('Doar') }}</NuxtLink>
  </div>
</template>
<style scoped>
div {
  position: relative; z-index: 20;
  display: flex; align-items: center; justify-content: flex-end; gap: 38px;
  min-height: 80px; padding: 0 max(6vw, calc((100vw - 1280px) / 2));
  border-bottom: 1px solid #ffffff20; background: #183c40;
}
a { position: relative; display: flex; align-items: center; min-height: 80px;
  color: #bdd2ce; text-decoration: none; font: 500 13px var(--font-mono); letter-spacing: .02em; }
a:hover, a.router-link-exact-active { color: #fff; }
a.router-link-exact-active::after { content: ""; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #deb978; }
a:focus-visible { outline-color: #9abce2; }
@media (max-width: 700px) { div { min-height: 64px; gap: 28px; } a { min-height: 64px; } }
</style>
