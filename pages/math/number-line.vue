<script setup>
import { ref, onMounted, computed } from "vue";

definePageMeta({
  layout: "sketch",
});
useHead({
  title: "Números inteiros",
});

const canvas = ref(null);
const numberInput = ref(0);
const isRational = ref(false);

const inputStep = computed(() => (isRational.value ? 0.1 : 1));
const formatNumber = (num) => (isRational.value ? Number(num).toFixed(1) : num);

function resizeWindow() {
  canvas.value.width = innerWidth;
  canvas.value.height = innerHeight;
}

onMounted(() => {
  addEventListener("resize", resizeWindow);
  resizeWindow();

  function animate() {
    requestAnimationFrame(animate);
    const c = canvas.value.getContext("2d");

    // Clear canvas
    c.fillStyle = "#FCFFBE";
    c.fillRect(0, 0, innerWidth, innerHeight);

    // Draw number line
    c.strokeStyle = "#035E7B";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(innerWidth * 0.1, innerHeight / 2);
    c.lineTo(innerWidth * 0.9, innerHeight / 2);
    c.stroke();

    // Draw ticks and numbers
    c.font = `bold ${0.03 * innerHeight}px Itim`;
    c.textAlign = "center";
    const range = 10;
    const spacing = (innerWidth * 0.8) / (range * 2);

    for (let i = -range; i <= range; i++) {
      const x = innerWidth / 2 + i * spacing;

      // Draw tick
      c.beginPath();
      c.moveTo(x, innerHeight / 2 - 10);
      c.lineTo(x, innerHeight / 2 + 10);
      c.stroke();

      // Draw number
      c.fillStyle = "#035E7B";
      c.fillText(i, x, innerHeight / 2 + 35);
    }

    // Draw pointer at selected number
    const pointerX = innerWidth / 2 + numberInput.value * spacing;

    // Draw arrow
    c.beginPath();
    c.moveTo(pointerX, innerHeight / 2 - 40);
    c.lineTo(pointerX - 15, innerHeight / 2 - 60);
    c.lineTo(pointerX + 15, innerHeight / 2 - 60);
    c.closePath();
    c.fillStyle = "#035E7B";
    c.fill();

    // Show selected number properties
    c.font = `bold ${0.05 * innerHeight}px Itim`;
    c.fillStyle = "#035E7B";

    const properties = [
      `Número selecionado: ${formatNumber(numberInput.value)}`,
      `Tipo: ${
        numberInput.value > 0
          ? "Positivo"
          : numberInput.value < 0
          ? "Negativo"
          : "Zero"
      }`,
      `Distância até zero: ${formatNumber(Math.abs(numberInput.value))}`,
    ];

    properties.forEach((text, index) => {
      c.fillText(text, innerWidth / 2, innerHeight * 0.2 + index * 40);
    });
  }
  animate();
});
</script>

<template>
  <div id="inputs">
    <div class="input-group">
      <strong>Selecione um número:</strong>
      <input
        v-model="numberInput"
        type="range"
        min="-10"
        max="10"
        :step="inputStep"
      />
    </div>
    <div class="input-group">
      <strong>Tipo de número:</strong>
      <label class="toggle">
        <input type="checkbox" v-model="isRational" />
        <span>{{ isRational ? "Racionais" : "Inteiros" }}</span>
      </label>
    </div>
  </div>
  <canvas ref="canvas"></canvas>
</template>

<style scoped>
div#inputs {
  position: absolute;
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
  accent-color: var(--dark-blue);
}

input::-webkit-slider-thumb {
  background-color: var(--dark-blue);
}

.input-group {
  margin-bottom: 20px;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--dark-blue);
  font-family: var(--itim);
  cursor: pointer;
}

.toggle input {
  width: auto;
  margin-right: 8px;
}

.toggle span {
  font-size: calc(0.8em + 0.5vw);
}
</style>
