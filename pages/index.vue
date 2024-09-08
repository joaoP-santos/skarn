<script setup>
definePageMeta({
  layout: "default",
});

useHead({
  title: "Home",
});
</script>

<template>
  <main>
    <h1>Skarn</h1>
    <h6>recursos pedagógicos interativos para todos</h6>
  </main>
  <section>
    <div class="subject-section">
      <h3>Matemática</h3>
      <div>
        <NuxtLink to="/math/fractions" class="math">
          <p>Frações</p>
        </NuxtLink>
        <NuxtLink to="/math/squareroot" class="math">
          <p>Raiz quadrada</p>
        </NuxtLink>
        <NuxtLink to="/math/multi-table" class="math">
          <p>Tabuada</p>
        </NuxtLink>
        <NuxtLink to="/math/unit-circle" class="math">
          <p>Círculo unitário</p>
        </NuxtLink>
      </div>
    </div>
    <div class="subject-section">
      <h3>Física</h3>
      <div>
        <NuxtLink to="/physics/dilatation" class="physics">
          <p>Dilatação</p>
        </NuxtLink>
        <NuxtLink to="/physics/thermo-scales" class="physics">
          <p>Escalas termométricas</p>
        </NuxtLink>
        <NuxtLink to="/physics/newton-f" class="physics">
          <p>1ª Lei de Newton</p>
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
