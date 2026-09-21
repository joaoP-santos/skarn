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
  position: relative; isolation: isolate; overflow: hidden; box-sizing: border-box;
  min-height: 430px; padding: 88px max(6vw, calc((100vw - 1280px) / 2)) 94px;
  display: flex; flex-direction: column; align-items: flex-start; justify-content: center;
  background: radial-gradient(ellipse at 80% 40%, #285452 0%, #183c40 65%); color: #f5f7fa;
}
main::after { content: ""; position: absolute; z-index: -1; inset: 0 0 0 42%;
  background: url('/identity-field.svg') center / cover no-repeat; opacity: .9; }
main h1 { font: 550 clamp(80px, 10vw, 144px)/1 var(--font-sans); letter-spacing: -.065em; margin-left: -6px; }
main h6 { max-width: 330px; margin-top: 28px; color: #c5d8d0;
  font: 400 17px/1.65 var(--font-sans); letter-spacing: .01em; }
section { max-width: 1280px; margin: auto; padding: 24px 6vw 80px; }
.subject-section { display: grid; grid-template-columns: minmax(180px, .8fr) 2.2fr; gap: 40px; padding: 34px 0; border-bottom: 1px solid var(--line); }
section h3 { padding-top: 15px; color: var(--ink); font: 500 17px/1.5 var(--font-mono); letter-spacing: -.04em; }
.subject-section > div { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.subject-section a { position: relative; display: flex; align-items: center; min-height: 72px;
  padding: 16px 34px 16px 18px; box-sizing: border-box; border: 1px solid #d9dfdc; border-radius: 10px; background: var(--mint);
  color: #2e4949; text-decoration: none; font: 500 15px/1.5 var(--font-sans); transition: color .15s, border-color .15s, background .15s, box-shadow .15s; }
.subject-section a::after { content: ""; position: absolute; right: 17px; top: calc(50% - 3px);
  width: 5px; height: 5px; border-top: 1px solid currentColor; border-right: 1px solid currentColor; transform: rotate(45deg); }
.subject-section a:hover { color: var(--accent); border-color: #94b3a8; background: #fff; box-shadow: 0 4px 14px #183c4008; }
.subject-section:first-child a { background: var(--lavender); border-color: #dce0ed; }
.subject-section:last-child a { background: var(--sand); border-color: #e7ddc9; }
.subject-section a:hover { background: #fff; }
@media (prefers-reduced-motion: reduce) { .subject-section a { transition: none; } }
@media (min-width: 1500px) { section { padding-inline: 0; } }
@media (max-width: 1000px) { .subject-section { grid-template-columns: 170px 1fr; gap: 24px; } .subject-section > div { grid-template-columns: repeat(2, minmax(0, 1fr)); } main { min-height: 360px; padding-block: 65px; } }
@media (max-width: 650px) { main::after { left: 25%; opacity: .35; } .subject-section { grid-template-columns: 1fr; gap: 8px; } .subject-section > div { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
