<script setup>
definePageMeta({
  layout: "default",
});

useHead({
  title: "Doar",
});
</script>
<template>
  <div id="blue-trapezium">
    <div id="text">
      <h1>Seja o impacto.</h1>
      <div>
        <p>
          Cada doação é um passo adiante ao sonho de mudar a educação. Sua
          contribuição é mais que bem-vinda.
        </p>
        <p>
          <strong>Chave PIX:</strong> c34916be-39b4-432c-9176-ac2b6c3890ea<br />
          <strong>Recipiente:</strong> João Pedro Marques Santos
        </p>
      </div>
    </div>
  </div>
  <div id="yellow-trapezium"></div>
</template>

<style scoped>
div#text {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;

  align-self: center;
  justify-self: center;

  margin-left: 32px;
  width: 45vw;
  height: 50vh;
}

div#text p {
  font-family: var(--fred);
  font-size: 1.25em;
  color: white;
}

div#text div {
  display: flex;
  flex-direction: column;

  margin-top: 16px;
  gap: 24px;
}

div#text strong {
  font-family: var(--fred);
  font-size: 1em;
  color: white;
  font-weight: 600;
}

h1 {
  color: white;
}

div#blue-trapezium {
  display: flex;

  z-index: -1;
  position: absolute;
  left: 0;
  width: 60vw;
  height: 100vh;
  background-color: var(--dark-blue);
  -webkit-clip-path: polygon(0 0, 75% 0, 100% 100%, 0 100%);
  clip-path: polygon(0 0, 75% 0, 100% 100%, 0 100%);
}

div#yellow-trapezium {
  z-index: -2;
  position: absolute;
  right: 0;
  width: 60vw;
  height: 100vh;
  background-color: var(--darker-yellow);
}
</style>
