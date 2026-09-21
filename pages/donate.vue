<script setup>
const { t } = useLanguage();
definePageMeta({
  layout: "default",
});

useHead({
  title: t("Doar"),
});
</script>
<template>
  <div id="blue-trapezium">
    <div id="text">
      <h1>{{ t('Seja o impacto.') }}</h1>
      <div>
        <p>
          {{ t('Cada doação é um passo adiante ao sonho de mudar a educação. Sua contribuição é mais que bem-vinda.') }}
        </p>
        <p>
          <strong>{{ t('Chave PIX:') }}</strong> c34916be-39b4-432c-9176-ac2b6c3890ea<br />
          <strong>{{ t('Recipiente:') }}</strong> João Pedro Marques Santos
        </p>
      </div>
    </div>
  </div>
  <div id="yellow-trapezium"></div>
</template>

<style scoped>
#blue-trapezium { min-height: calc(100dvh - 80px); display: flex; align-items: center; position: relative; box-sizing: border-box; padding: 80px max(6vw, calc((100vw - 1180px) / 2)); background: var(--paper); }
#text { position: relative; z-index: 1; max-width: 720px; padding-left: 40px; border-left: 2px solid var(--accent); }
h1 { margin-bottom: 30px; color: var(--ink); }
#text > div { display: flex; flex-direction: column; gap: 32px; }
p { max-width: 600px; color: var(--muted); font: 400 18px/1.8 var(--font-sans); }
p + p { padding: 24px; border-radius: 10px; background: #e8f0e9; border: 1px solid var(--line); font: 400 14px/2 var(--font-mono); overflow-wrap: anywhere; }
strong { color: var(--ink); font-weight: 500; }
#yellow-trapezium { position: fixed; right: 0; top: 80px; bottom: 0; width: 24vw; pointer-events: none; opacity: .35; background-image: linear-gradient(#b8c6d333 1px, transparent 1px), linear-gradient(90deg, #b8c6d333 1px, transparent 1px); background-size: 32px 32px; }
@media (max-width: 700px) { #blue-trapezium { padding: 50px 6vw 80px; } #text { padding-left: 22px; } }
</style>
