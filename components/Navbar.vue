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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  left: 50%;
  transform: translateX(-50%);

  position: absolute;
  width: 40vw;
  height: 15vh;

  background-color: #036584;
  box-shadow: 0 0 250px rgba(0, 0, 0, 0.5);
}
a {
  font-family: var(--itim);
  font-size: 1.25em;
  color: white;
  text-decoration: none;
}
</style>
