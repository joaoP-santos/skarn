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
var buttons = [];
function resizeWindow() {
  canvas.value.width = innerWidth;
  canvas.value.height = innerHeight;

  buttons.forEach((button) => button.resize());
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
class Button {
  constructor(x, y, width, height, num, col, row) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.num = num;
    this.col = col;
    this.row = row;
  }
  resize() {
    this.x = innerWidth * 0.6 + this.col * innerWidth * 0.065;
    this.y = innerHeight * 0.3 + this.row * innerWidth * 0.065;
    this.width = innerWidth * 0.05;
    this.height = innerWidth * 0.05;
  }
  checkHover(x, y) {
    if (
      this.x < x &&
      this.x + this.width > x &&
      this.y < y &&
      this.y + this.height > y
    ) {
      this.hover = true;
    } else {
      this.hover = false;
    }
  }
  draw(c) {
    if (!this.hover) {
      c.fillStyle = "#fcffbe";
    } else {
      c.fillStyle = "#035E7B";
    }

    c.strokeStyle = "#035E7B";
    c.beginPath();
    c.roundRect(this.x, this.y, this.width, this.height, this.width * 0.1);
    c.fill();
    c.stroke();

    c.font = `bold ${0.03 * innerWidth}px Itim`;
    c.textAlign = "center";
    c.fillStyle = this.hover ? "#fcffbe" : "#035E7B";
    c.fillText(this.num, this.x + this.width / 2, this.y + this.width * 0.71);
  }
}

const buttonsEvents = {
  move: (e) => {
    buttons.forEach((button) => {
      button.checkHover(e.clientX, e.clientY);
    });
  },
  click: (e) => {
    buttons.forEach((button) => {
      if (button.hover) answer.value = button.num;
    });
  },
};

onMounted(() => {
  addEventListener("resize", resizeWindow);
  resizeWindow();
  generatePhase();

  window.addEventListener("mousemove", (e) => buttonsEvents.move(e));
  window.addEventListener("click", (e) => buttonsEvents.click(e));

  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      buttons.push(
        new Button(
          innerWidth * 0.6 + col * innerWidth * 0.065,
          innerHeight * 0.3 + row * innerWidth * 0.065,
          innerHeight * 0.1,
          innerHeight * 0.1,
          buttons.length + 2,
          col,
          row
        )
      );
    }
  }

  const verifyButton = {
    x: innerWidth * 0.6,
    y: innerHeight * 0.8,
  };

  console.log(buttons);
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
      innerWidth * 0.3,
      innerHeight * 0.5
    );

    if (displayResult) {
      c.fillStyle = answer.value == hidden ? "#8FF7A7" : "#035E7B!";
      c.font = `bold ${0.1 * innerHeight}px Itim`;
      c.fillText(displayResult, innerWidth * 0.3, innerHeight * 0.6);
    }

    buttons.forEach((button) => {
      button.draw(c);
    });
  }
  animate();
});
</script>

<template>
  <div>
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
