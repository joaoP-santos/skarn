<script setup>
const { t } = useLanguage();
definePageMeta({
  layout: "default",
});

useHead({
  title: "Home",
});

// Data structure for organizing educational content
const subjects = [
  {
    name: t("Inteligência artificial"),
    class: "math",
    items: [
      { name: "Script 1 · Knapsack", link: "/ai/knapsack" },
      { name: "DFS · BFS · UCS", link: "/ai/uninformed-search" },
      { name: "A* · Manhattan", link: "/ai/a-star-manhattan" },
    ],
  },
  {
    name: t("Matemática"),
    class: "math",
    items: [
      { name: t("Frações"), link: "/math/fractions" },
      { name: t("Raiz quadrada"), link: "/math/squareroot" },
      { name: t("Tabuada"), link: "/math/multi-table" },
      { name: t("Círculo unitário"), link: "/math/unit-circle" },
      { name: "Trig Sprint", link: "/math/trig-sprint" },
      { name: t("Números inteiros"), link: "/math/number-line" },
    ],
  },
  {
    name: t("Física"),
    class: "physics",
    items: [
      { name: t("Dilatação"), link: "/physics/dilatation" },
      { name: t("Escalas termométricas"), link: "/physics/thermo-scales" },
      { name: t("1ª Lei de Newton"), link: "/physics/newton-f" },
    ],
  },
];
</script>

<template>
  <main>
    <h1>Skarn</h1>
    <h6>{{ t('recursos pedagógicos interativos para todos') }}</h6>
  </main>
  <section>
    <div
      v-for="subject in subjects"
      :key="subject.name"
      class="subject-section"
    >
      <h3>{{ subject.name }}</h3>
      <div>
        <NuxtLink
          v-for="item in subject.items"
          :key="item.link"
          :to="item.link"
          :class="subject.class"
        >
          <p>{{ item.name }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
main {
  height: 75vh;

  background-color: var(--dark-blue);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

main h1 {
  font-family: "Lemon", serif;
  color: var(--light-yellow);
  font-size: 7em;
  font-weight: 300;
}

main h6 {
  font-family: Itim, serif;
  color: #ffffff;
  font-size: 1.2em;
  font-weight: 200;
}

section {
  padding: 2vw;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  box-sizing: border-box;
}

.subject-section {
  min-height: 25vh;

  font-family: Itim, serif;

  display: flex;
  flex-direction: column;
}

section h3 {
  font-size: 2em;
  color: #005773;

  margin-bottom: 12px;
}

.subject-section > div {
  display: flex;

  gap: 18px;
}

.subject-section > div > a {
  text-decoration: none;
  color: #004960;
  font-size: 1.5em;

  border-width: 3px;
  border-style: solid;
  border-radius: 12px;

  height: 5vh;

  padding: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: rgba(0, 0, 0, 0.1) 5px 5px;

  transition-duration: 0.2s;
}

.subject-section > div > a:hover {
  transform: scale(1.1);
  transition-duration: 0.2s;
}

.math {
  border-color: #51bbfe;
}

.physics {
  border-color: #f4e76e;
}
</style>
