<script setup>
const { t } = useLanguage();
definePageMeta({
  layout: "sketch",
});
useHead({
  title: t("Raiz quadrada"),
});

onMounted(() => {
  const canvas = document.querySelector("canvas");

  var rectLength;
  var rectX;
  var rectY;
  var side;

  const sideInput = document.querySelector("input#side-input");
  const sideText = document.querySelector("p");
  function updateValues(redraw) {
    if (side == sideInput.value && redraw == false) {
      return;
    } else {
      side = sideInput.value;
      sideText.innerHTML = t("Comprimento do lado: ") + side;
      if (innerHeight > innerWidth) {
        rectLength = (side * innerHeight) / 60;
      } else {
        rectLength = (side * innerWidth) / 90;
      }
      rectX = innerWidth / 2 - rectLength / 2;
      rectY = innerHeight / 2 - rectLength / 2;
    }
  }

  function resizeWindow() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    updateValues(true);
  }

  resizeWindow();

  window.addEventListener("resize", resizeWindow);

  const c = canvas.getContext("2d");

  function animate() {
    updateValues();
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    c.rect(0, 0, innerWidth, innerHeight);

    c.fillStyle = "#eef2f5";
    c.fill();
    c.lineWidth = 2;
    c.beginPath();
    c.rect(rectX, rectY, rectLength, rectLength);
    c.fillStyle = "#f7f5ef";
    c.fill();
    for (let x = 0; x < side; x++) {
      for (let y = 0; y < side; y++) {
        c.beginPath();
        c.strokeStyle = "#9aafc1";

        c.moveTo(
          (innerWidth - rectLength) / 2 + (x * rectLength) / side,
          (innerHeight - rectLength) / 2
        );
        c.lineTo(
          (innerWidth - rectLength) / 2 + (x * rectLength) / side,
          (innerHeight + rectLength) / 2
        );

        c.moveTo(
          (innerWidth - rectLength) / 2,
          (innerHeight - rectLength) / 2 + (y * rectLength) / side
        );
        c.lineTo(
          (innerWidth + rectLength) / 2,
          (innerHeight - rectLength) / 2 + (y * rectLength) / side
        );
        c.lineWidth = "1";
        c.stroke();
      }
    }
    c.lineWidth = 2;
    c.beginPath();
    c.rect(rectX, rectY, rectLength, rectLength);
    c.strokeStyle = "#243f5d";
    c.stroke();

    c.font = `500 ${0.05 * innerHeight}px "DM Sans", Arial`;
    c.textAlign = "center";
    c.fillStyle = "#243f5d";
    c.fillText(
      t("Área total: {0}", [Math.pow(side, 2)]),
      innerWidth / 2,
      rectY + rectLength + 0.1 * innerHeight
    );
  }

  animate();
});
</script>
<template>
  <div>
    <p>{{ t('Comprimento do lado:') }}</p>
    <input type="range" name="numerator" id="side-input" min="0" max="30" />
    <br />
  </div>
  <canvas></canvas>
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

p {
  color: var(--dark-blue);
  font-weight: bolder;
  font-size: calc(1em + 0.5vw);
  font-family: var(--itim);
}

input {
  width: 100%;
  accent-color: var(--accent);
}

input::-webkit-slider-thumb {
  background-color: var(--accent);
}

div { top: 20px; left: 20px; padding: 18px 20px; background: #fffffff5; border: 1px solid var(--line); border-radius: 8px; }
p, strong { color: var(--ink); font: 500 14px/1.6 var(--font-sans); }

</style>
