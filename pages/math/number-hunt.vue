<script setup>
definePageMeta({
  layout: "sketch",
});
useHead({
  title: "Caça aos números",
});
const canvas = ref(null);

var originNumber = 0;
var targets = [];
function resizeWindow() {
  canvas.value.width = innerWidth;
  canvas.value.height = innerHeight;
}

// Dividir a tela em um grid em um array e cada número vai ocupar uma posição nesse array

function generateOrigin() {
  originNumber = Math.round(Math.random() * 100);
}

function generateTarget() {
  targets.push(new Target());
}

const mouse = {
  x: 0,
  y: 0,
};

function updateMouse(x, y) {
  mouse.x = x;
  mouse.y = y;
}

class Target {
  constructor() {
    this.x = Math.random() * 0.8 * innerWidth + 0.1 * innerWidth;
    this.y = Math.random() * 0.9 * innerHeight + 0.1 * innerHeight;
    this.correct = Math.random() > 0.5 ? true : false;
    const difference = Math.round(Math.random() * originNumber) - 50;
    this.value = `${
      originNumber -
      difference +
      (this.correct ? 0 : Math.round(Math.random() * difference) + 1)
    } ${difference > 0 ? "+" : "-"} ${
      Math.abs(difference) +
      (this.correct ? 0 : Math.round(Math.random() * difference) + 1)
    }`;
    this.radius = this.value.length;
    this.clicked = false;
    this.startedDeletion = false;
  }
  checkClick() {
    const distanceX = Math.abs(this.x - mouse.x);
    const distanceY = Math.abs(this.y - mouse.y);
    if (
      Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2)) <=
      this.radius * 0.005 * innerWidth
    )
      this.clicked = true;
  }
  draw(c) {
    if (this.clicked) {
      if (this.correct) {
        c.beginPath();
        c.strokeStyle = "#8FF7A7";
        c.moveTo(this.x - 10, this.y);
        c.lineTo(this.x, this.y + 10);
        c.lineTo(this.x + 10, this.y - 20);
      } else {
        c.beginPath();
        c.strokeStyle = "red";

        c.moveTo(this.x - 10, this.y - 10);
        c.lineTo(this.x + 10, this.y + 10);
        c.moveTo(this.x - 10, this.y + 10);
        c.lineTo(this.x + 10, this.y - 10);
      }
      c.stroke();
      c.closePath();

      if (!this.startedDeletion) {
        this.startedDeletion = true;
        setTimeout(
          () =>
            (targets = targets.filter((target) => target.value != this.value)),
          2000
        );
      }
    } else {
      c.beginPath();
      c.arc(this.x, this.y, this.radius * 0.005 * innerWidth, 0, Math.PI * 2);
      c.stroke();
      c.closePath();

      c.fillStyle = this.correct ? "#8FF7A7" : "#FF0000";
      c.font = `bold ${0.02 * innerWidth}px Itim`;
      c.fillText(this.value, this.x, this.y);
    }
  }
}

onMounted(() => {
  addEventListener("resize", resizeWindow);
  resizeWindow();
  addEventListener("mousemove", (e) => updateMouse(e.clientX, e.clientY));
  addEventListener("click", () =>
    targets.forEach((target) => target.checkClick())
  );
  const c = canvas.value.getContext("2d");
  generateOrigin();
  setInterval(() => {
    generateTarget();
  }, 3000);
  function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "#FFFFFF";
    c.fillRect(0, 0, innerWidth, innerHeight);

    c.lineWidth = 5;
    c.beginPath();
    c.arc(innerWidth / 2, innerHeight * 0.8, 100, 0, 2 * Math.PI);
    c.stroke();

    c.fillStyle = "#000000";
    c.textAlign = "center";
    c.font = `bold ${0.05 * innerWidth}px Itim`;
    c.fillText(
      originNumber,
      innerWidth / 2,
      innerHeight * 0.8 + innerWidth * 0.015
    );
    console.log(mouse);
    c.beginPath();
    c.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
    c.stroke();

    targets.forEach((target) => target.draw(c));
  }
  animate();
});
</script>
<template>
  <canvas ref="canvas"></canvas>
</template>
