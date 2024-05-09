<script setup>
definePageMeta({
  layout: "sketch",
});
useHead({
  title: "Círculo unitário",
});

const canvas = ref(null);
const angleInput = ref(0);
const angle = computed(() => 360 - angleInput.value);

function resizeWindow() {
  canvas.value.width = innerWidth;
  canvas.value.height = innerHeight;
  circle.mount();
}

const circle = {
  x: undefined,
  y: undefined,
  radius: undefined,
  mount: () => {
    circle.x = innerWidth / 2;
    circle.y = innerHeight / 2;
    circle.radius = innerHeight / 3;
    circle.point = {
      x: circle.x + circle.radius * Math.cos((angle.value * Math.PI) / 180),
      y: circle.y + circle.radius * Math.sin((angle.value * Math.PI) / 180),
    };
  },
  updatePoint: () => {
    circle.point = {
      x: circle.x + circle.radius * Math.cos((angle.value * Math.PI) / 180),
      y: circle.y + circle.radius * Math.sin((angle.value * Math.PI) / 180),
    };
    circle.xLength = circle.point.x - circle.x;
    circle.yLength = circle.point.y - circle.y;
  },
};
onMounted(() => {
  addEventListener("resize", resizeWindow);
  resizeWindow();

  function animate() {
    requestAnimationFrame(animate);
    circle.updatePoint();
    const c = canvas.value.getContext("2d");

    const content = {
      sin: -Math.round(Math.sin((angle.value * Math.PI) / 180) * 1000) / 1000,
      cos: Math.round(Math.cos((angle.value * Math.PI) / 180) * 1000) / 1000,
    };
    c.fillStyle = "#FCFFBE";
    c.fillRect(0, 0, innerWidth, innerHeight);

    //x-axis
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(0, innerHeight / 2);
    c.lineTo(innerWidth, innerHeight / 2);
    c.stroke();

    //x-axis ticks
    for (var i = 0; i < innerWidth; i += circle.radius / 4) {
      c.beginPath();
      c.moveTo(circle.x + i, circle.y - 10);
      c.lineTo(circle.x + i, circle.y + 10);
      c.stroke();

      c.beginPath();
      c.moveTo(circle.x - i, circle.y - 10);
      c.lineTo(circle.x - i, circle.y + 10);
      c.stroke();
      c.closePath();
    }

    //y-axis ticks
    for (var i = 0; i < innerHeight; i += circle.radius / 4) {
      c.beginPath();
      c.moveTo(circle.x - 10, circle.y + i);
      c.lineTo(circle.x + 10, circle.y + i);
      c.stroke();

      c.beginPath();
      c.moveTo(circle.x - 10, circle.y - i);
      c.lineTo(circle.x + 10, circle.y - i);
      c.stroke();
      c.closePath();
    }

    //y-axis
    c.beginPath();
    c.moveTo(innerWidth / 2, 0);
    c.lineTo(innerWidth / 2, innerHeight);
    c.stroke();

    //Circle
    c.strokeStyle = "#035E7B";
    c.lineWidth = 5;
    c.beginPath();
    c.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    c.stroke();

    //Triangle
    c.lineWidth = 3;

    //Radius
    c.beginPath();
    c.fillStyle = "#035E7B";
    c.moveTo(circle.x, circle.y);
    c.lineTo(circle.point.x, circle.point.y);
    c.stroke();
    c.closePath();

    c.font = `bold ${0.05 * innerHeight}px Itim`;
    c.fillText(
      1,
      circle.x +
        circle.xLength * 0.5 +
        (circle.xLength > 0 ? -1 : 1) * innerWidth * 0.02,
      circle.y +
        circle.yLength * 0.5 +
        (circle.yLength > 0 ? 1 : -1) * innerWidth * 0.015
    );

    //Sine
    c.beginPath();
    c.strokeStyle = "#035E7B";
    c.moveTo(circle.point.x, circle.point.y);
    c.lineTo(circle.point.x, circle.y);
    c.stroke();
    c.closePath();

    c.textAlign = "center";
    c.fillStyle = "#035E7B";
    c.fillText(
      content.sin,
      circle.x +
        circle.xLength +
        (circle.xLength > 0 ? 1 : -1) * innerWidth * 0.05,
      circle.y + (circle.point.y - circle.y) / 2
    );
    //Cosine
    c.beginPath();
    c.strokeStyle = "#035E7B";
    c.moveTo(circle.point.x, circle.y);
    c.lineTo(circle.x, circle.y);
    c.stroke();
    c.closePath();

    c.fillStyle = "#035E7B";
    c.fillText(
      content.cos,
      circle.x + circle.xLength / 2,
      circle.y + (circle.yLength > 0 ? -1 : 1) * innerWidth * 0.02
    );

    //Angle
    c.beginPath();
    c.arc(
      circle.x,
      circle.y,
      circle.radius * 0.25,
      0,
      ((angle.value - 360) * Math.PI) / 180,
      true
    );
    c.stroke();

    c.font = `bold ${0.03 * innerHeight}px Itim`;

    c.fillText(
      `${360 - angle.value}°`,
      circle.x -
        Math.cos(((angle.value * Math.PI) / 180) * 0.5) * circle.radius * 0.15,
      circle.y -
        Math.sin((((angle.value - 30) * Math.PI) / 180) * 0.5) *
          circle.radius *
          0.1
    );

    //Points
    c.fillStyle = "#035E7B";

    c.beginPath();
    c.arc(circle.point.x, circle.point.y, 5, 0, 2 * Math.PI);
    c.fill();

    c.beginPath();
    c.arc(circle.x, circle.y, 5, 0, 2 * Math.PI);
    c.fill();

    c.beginPath();
    c.arc(circle.point.x, circle.y, 5, 0, 2 * Math.PI);
    c.fill();
    c.closePath();
  }
  animate();
});
</script>

<template>
  <div id="inputs">
    <strong>Ângulo (°):</strong>
    <input v-model="angleInput" type="range" name="angle" min="0" max="360" />
  </div>
  <canvas ref="canvas"></canvas>
</template>
<style>
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
</style>
