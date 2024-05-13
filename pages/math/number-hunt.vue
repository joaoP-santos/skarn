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

function generateOrigin() {
  originNumber = Math.round(Math.random() * 100);
}

function generateTarget() {
  if (targets.length > 15) return;
  const target = new Target();
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
    var freeSlots = [];
    for (var i = 0; i < 15; i++) {
      if (targets[i] == undefined) {
        freeSlots.push(i);
      } else console.log(targets[i]);
      if (i == 6) i += 2;
    }
    this.slot = freeSlots[Math.round(Math.random() * (freeSlots.length - 1))];

    this.x = ((this.slot * innerWidth) / 15) * 0.8 + 0.1 * innerWidth;
    this.correct = Math.random() > 0.5 ? true : false;
    const difference = Math.round(Math.random() * originNumber) - 50;
    this.value = `${
      originNumber -
      difference +
      (this.correct ? 0 : Math.round(Math.random() * difference) + 1)
    } ${difference > 0 ? "+" : "-"} ${Math.abs(difference)}`;
    this.radius = this.value.length;
    this.y = -this.radius * 0.005 * innerWidth;

    this.clicked = false;
    this.startedDeletion = false;
    targets[this.slot] = this;
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
    c.lineWidth = 3;
    if (this.y > innerHeight + this.radius * 2) delete targets[this.slot];
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

        setTimeout(() => delete targets[this.slot], 5000);
      }
    } else {
      c.beginPath();
      c.strokeStyle = "#000000";
      c.arc(this.x, this.y, this.radius * 0.005 * innerWidth, 0, Math.PI * 2);
      c.stroke();
      c.closePath();

      c.font = `bold ${0.02 * innerWidth}px Itim`;
      c.fillText(this.value, this.x, this.y);
      this.y += 0.5;
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
  }, 5000);
  generateTarget();
  function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "#FFFFFF";
    c.fillRect(0, 0, innerWidth, innerHeight);

    //Origin Number
    c.lineWidth = 5;
    c.beginPath();
    c.strokeStyle = "#000000";
    c.arc(innerWidth / 2, innerHeight * 0.8, innerWidth * 0.05, 0, 2 * Math.PI);
    c.stroke();

    c.fillStyle = "#000000";
    c.textAlign = "center";
    c.font = `bold ${0.05 * innerWidth}px Itim`;
    c.fillText(
      originNumber,
      innerWidth / 2,
      innerHeight * 0.8 + innerWidth * 0.015
    );

    //Mouse
    c.lineWidth = 1;
    c.beginPath();
    c.strokeStyle = "#000000";
    c.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
    c.stroke();

    c.beginPath();
    c.strokeStyle = "#000000";
    c.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
    c.stroke();

    c.beginPath();
    c.moveTo(mouse.x - 60, mouse.y);
    c.lineTo(mouse.x + 60, mouse.y);
    c.moveTo(mouse.x, mouse.y - 60);
    c.lineTo(mouse.x, mouse.y + 60);
    c.stroke();

    targets.forEach((target) => target.draw(c));
  }
  animate();
});
</script>
<template>
  <canvas ref="canvas"></canvas>
</template>
