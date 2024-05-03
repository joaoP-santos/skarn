<script setup>
import "~/assets/css/root.css";

useHead({
  titleTemplate: (title) => {
    return title ? `${title} - Skarn` : "Skarn";
  },
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  ],
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "crossorigin",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Lemon&display=swap",
      rel: "stylesheet",
    },
    {
      href: "https://fonts.googleapis.com/css2?family=Itim&family=Lemon&display=swap",
      rel: "stylesheet",
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
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
