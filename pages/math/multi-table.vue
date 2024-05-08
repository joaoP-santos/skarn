<script setup>
definePageMeta({
  layout: "sketch",
});

useHead({
  title: "Tabuada",
});

const canvas = ref(null);
const answer = ref(0);
const buttonMessage = ref("Verificar");
var nums = [0, 0, 0];
var hidden = 0;
var hiddenKey = 0;
var displayResult = "";
function resizeWindow() {
  canvas.value.width = innerWidth;
  canvas.value.height = innerHeight;
}

function generatePhase() {
  nums[0] = Math.round(Math.random() * 8) + 2;
  nums[1] = Math.round(Math.random() * 8) + 2;
  nums[2] = nums[0] * nums[1];
  hiddenKey = Math.round(Math.random() * 2);
  hidden = nums[hiddenKey];
  nums[hiddenKey] = "?";
}

function buttonPress() {
  if (buttonMessage.value == "Próximo") {
    generatePhase();
    displayResult = "";
    answer.value = 0;
    buttonMessage.value = "Verificar";
    return;
  }
  displayResult = answer.value == hidden ? "Isso aí!" : "Não é bem isso!";
  if (answer.value == hidden) buttonMessage.value = "Próximo";
}

function answerChanged() {
  displayResult = "";
}
onMounted(() => {
  addEventListener("resize", resizeWindow);
  resizeWindow();
  generatePhase();

  const c = canvas.value.getContext("2d");
  function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "#fcffbe";
    c.fillRect(0, 0, innerWidth, innerHeight);

    nums[hiddenKey] = answer.value == 0 ? "?" : answer.value;

    c.fillStyle = "#035E7B";
    c.font = `bold ${0.2 * innerHeight}px Itim`;
    c.textAlign = "center";
    c.fillText(
      `${nums[0]} X ${nums[1]} = ${nums[2]}`,
      innerWidth * 0.5,
      innerHeight * 0.5
    );

    if (displayResult) {
      c.fillStyle = answer.value == hidden ? "#8FF7A7" : "#035E7B!";
      c.font = `bold ${0.1 * innerHeight}px Itim`;
      c.fillText(displayResult, innerWidth * 0.5, innerHeight * 0.6);
    }
  }
  animate();
});
</script>

<template>
  <div>
    <strong>Digite a resposta:</strong>
    <input
      @click="answerChanged"
      v-model="answer"
      type="number"
      name="answer"
      id="answerInput"
      min="0"
      max="10"
    />
    <button @click="buttonPress">{{ buttonMessage }}</button>
  </div>
  <canvas ref="canvas"></canvas>
</template>
<style scoped>
div {
  position: absolute;
  display: block;
  padding: 30px;
  max-width: 30vw;
  min-width: 220px;
  max-height: 30vh;
}

strong {
  color: var(--dark-blue);
  font-weight: bolder;
  font-size: calc(1em + 0.5vw);
  font-family: var(--itim);
}

input {
  width: 100%;
}
</style>
