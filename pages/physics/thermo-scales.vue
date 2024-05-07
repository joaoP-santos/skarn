<script setup>
definePageMeta({
  layout: "sketch",
});
useHead({
  title: "Escalas termométricas",
});

const canvas = ref(null);
const scales = [];

function resizeWindow() {
  canvas.value.width = innerWidth;
  canvas.value.height = innerHeight;
  scales.forEach((scale) => scale.update());
}

const temperature = ref(0);
class Termometer {
  key;
  x;
  y;
  width;
  height;
  fill;
  sufix;
  factor;
  base;
  constructor(_key, _sufix, _factor, _base) {
    this.key = _key;
    this.x = (innerWidth / 4) * (_key + 1);
    this.y = innerHeight * 0.8;
    this.width = innerWidth * 0.025;
    this.height = innerHeight * 0.7;
    this.fill = computed(() => temperature.value);
    this.sufix = _sufix;
    this.factor = _factor;
    this.base = _base;
  }

  update() {
    this.x = (innerWidth / 4) * (this.key + 1);
    this.y = innerHeight * 0.8;
    this.width = innerWidth * 0.025;
    this.height = innerHeight * 0.7;
  }
  draw(c) {
    console.log(this.fill.value);
    c.fillStyle = "#FFFFFF";
    c.lineWidth = 5;

    c.beginPath();
    c.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
    c.stroke();

    c.roundRect(
      this.x - this.width / 2,
      this.y - this.height,
      this.width,
      this.height,
      this.width
    );
    c.stroke();

    c.fill();
    c.beginPath();
    c.fillStyle = "red";
    c.roundRect(
      this.x - this.width / 4,
      this.y + this.width * 0.15,
      this.width / 2,
      (-this.height * this.fill.value) / 100,
      this.width / 10
    );
    c.fill();

    c.font = `bold ${0.05 * innerHeight}px Itim`;
    c.textAlign = "center";
    c.fillStyle = "#035E7B";
    c.fillText(
      `${Math.round(this.fill.value * this.factor * 100) / 100 + this.base} ${
        this.sufix
      }`,
      this.x,
      this.y + this.width * 2
    );
  }
}
onMounted(() => {
  addEventListener("resize", resizeWindow);

  const c = canvas.value.getContext("2d");

  for (var i = 0; i < 3; i++) {
    scales.push(
      new Termometer(
        i,
        ["°C", "°F", "K"][i],
        [1, 1.8, 1][i],
        [0, 32, 273.15][i]
      )
    );
  }
  resizeWindow();

  function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = `hsl(${temperature.value > 30 ? 0 : 180}, 100%, ${
      temperature.value > 30
        ? 120 - (temperature.value * 60) / 120
        : (temperature.value * 100) / 30 + 50
    }%)`;
    c.fillRect(0, 0, innerWidth, innerHeight);
    scales.forEach((scale) => scale.draw(c));
  }
  animate();
});
</script>

<template>
  <div>
    <strong>Temperatura:</strong>
    <input
      min="0"
      max="100"
      v-model="temperature"
      type="range"
      name="temperature"
    />
  </div>
  <canvas ref="canvas"></canvas>
</template>

<style scoped>
div {
  position: absolute;
  padding: 10px;
  max-width: 30vw;
  max-height: 30vh;
}

strong {
  font-family: var(--itim);
  font-size: calc(1em + 0.5vw);
  color: var(--dark-blue);
}

input {
  width: 100%;
}
</style>
