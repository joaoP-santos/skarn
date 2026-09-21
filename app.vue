<script setup>
import "~/assets/css/root.css";

const { locale } = useLanguage();

useHead(() => ({
  htmlAttrs: { lang: locale.value === "pt" ? "pt-BR" : "en" },
  titleTemplate: (title) => {
    return title ? `${title} - Skarn` : "Skarn";
  },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "crossorigin" },
    {
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@400;450;500;550;600;700&display=swap",
      rel: "stylesheet",
    },
  ],
}));
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <LanguageSwitcher />
</template>

<style>
* {
  margin: 0;
  padding: 0;
}

body {
  overflow-x: visible;
  overflow-y: visible;
}
</style>
