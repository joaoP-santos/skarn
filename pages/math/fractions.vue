<script setup>
const { t } = useLanguage();
definePageMeta({
  layout: "sketch",
});
useHead({
  title: t("Frações"),
});

onMounted(() => {
  const canvas = document.querySelector("canvas");

  var rectWidth;
  var rectHeight;
  var rectX;
  var rectY;

  function resizeWindow() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    rectWidth = (innerWidth * 6) / 8;
    rectHeight = (innerHeight * 3) / 5;
    rectX = innerWidth / 8;
    rectY = (innerHeight * 3) / 10;
  }

  resizeWindow();

  window.addEventListener("resize", resizeWindow);

  const c = canvas.getContext("2d");

  const numerator = document.querySelector("input#numeratorInput");
  const denominator = document.querySelector("input#denominatorInput");

  function animate() {
    requestAnimationFrame(animate);
    numerator.max = denominator.value;
    c.clearRect(0, 0, innerWidth, innerHeight);
    c.fill();
    c.lineWidth = 2;
    c.beginPath();
    c.rect(rectX, rectY, rectWidth, rectHeight);
    c.strokeStyle = "#183c40";
    c.stroke();
    c.fillStyle = "#9aafc1";
    c.fill();

    for (var i = 0; i < denominator.value; i++) {
      if (numerator.value > i) {
        c.fillStyle = "#eef2f5";
      } else {
        c.fillStyle = "#243f5d";
      }
      c.beginPath();
      c.rect(
        rectX + (i * rectWidth) / denominator.value,
        rectY,
        rectWidth / denominator.value,
        rectHeight
      );
      c.lineWidth = 2;
      c.stroke();
      c.fill();
    }
    c.font = `500 ${0.1 * innerHeight}px "DM Sans", Arial`;
    c.fillStyle = "#eef2f5";
    c.textAlign = "center";
    c.fillText(numerator.value, innerWidth / 2, (innerHeight * 2) / 20);

    c.beginPath();
    c.moveTo(innerWidth / 2 - innerHeight * 0.1, (innerHeight * 7) / 50);
    c.lineTo(innerWidth / 2 + innerHeight * 0.1, (innerHeight * 7) / 50);
    c.stroke();

    c.fillStyle = "#243f5d";
    c.fillText(denominator.value, innerWidth / 2, (innerHeight * 5) / 20);
  }

  animate();
});
</script>

<template>
  <div style="position: absolute; display: block; padding: 10px">
    <strong>{{ t('Numerador:') }} </strong>
    <input type="range" name="numerator" id="numeratorInput" min="0" max="30" />
    <br />
    <strong>{{ t('Denominador:') }} </strong>
    <input
      type="range"
      name="denominator"
      id="denominatorInput"
      min="1"
      max="30"
    />
  </div>
  <canvas></canvas>
</template>

<style scoped>
div {
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

div { top: 20px; left: 20px; padding: 18px 20px; background: #fffffff5; border: 1px solid var(--line); border-radius: 8px; }
p, strong { color: var(--ink); font: 500 14px/1.6 var(--font-sans); }

</style>
