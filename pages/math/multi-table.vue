<script setup>
definePageMeta({
  layout: "sketch",
});

useHead({
  title: "Tabuada",
});

const canvas = ref(null);
const answer = ref("");
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
  nums[0] = Math.round(Math.random() * 10);
  nums[1] = Math.round(Math.random() * 10);
  nums[2] = nums[0] * nums[1];
  hiddenKey = Math.round(Math.random() * 2);
  hidden = nums[hiddenKey];
  nums[hiddenKey] = "?";
}

function buttonPress() {
  if (buttonMessage.value == "Próximo") {
    generatePhase();
    displayResult = "";
    answer.value = "";
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
  constructor(x, y, width, height, content, col, row, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.content = content;
    this.col = col;
    this.row = row;
    this.type = type;
  }
  resize() {
    switch (this.type) {
      case "del":
        this.width = innerWidth * 0.05 + innerWidth * 0.065;
        break;

      case "num":
        this.width = innerWidth * 0.05;
        break;

      case "verify":
        this.width = 2 * innerWidth * 0.065 + innerWidth * 0.05;
        break;
    }
    this.x = innerWidth * 0.7 + this.col * innerWidth * 0.065;
    this.y = innerHeight * 0.3 + this.row * innerWidth * 0.065;
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
    c.fillText(
      this.type == "verify" ? this.content.value : this.content,
      this.x + this.width / 2,
      this.type == "num"
        ? this.y + this.width * 0.71
        : this.y + this.height / 2 + 0.009 * innerWidth
    );
  }
}

const buttonsEvents = {
  move: (e) => {
    buttons.forEach((button) => {
      button.checkHover(e.clientX, e.clientY);
    });
  },
  click: () => {
    buttons.forEach((button) => {
      if (button.hover) {
        answerChanged();

        switch (button.type) {
          case "num":
            if (answer.value.length < 3)
              answer.value = `${answer.value ? answer.value : ""}${
                button.content
              }`;
            break;
          case "del":
            if (answer.value.length >= 0)
              answer.value = answer.value.slice(0, -1);
            break;
          case "verify":
            buttonPress();
        }
      }
    });
    console.log(answer.value);
  },
};

onMounted(() => {
  addEventListener("resize", resizeWindow);
  resizeWindow();
  generatePhase();

  window.addEventListener("mousemove", (e) => buttonsEvents.move(e));
  window.addEventListener("click", (e) => buttonsEvents.click());

  buttons.push(
    new Button(
      innerWidth * 0.7,
      innerHeight * 0.3 - innerWidth * 0.065,
      innerWidth * 0.05,
      innerWidth * 0.05,
      "0",
      0,
      -1,
      "num"
    )
  );
  buttons.push(
    new Button(
      innerWidth * 0.7 + innerWidth * 0.065,
      innerHeight * 0.3 - innerWidth * 0.065,
      innerWidth * 0.05 + innerWidth * 0.065,
      innerWidth * 0.05,
      "DEL",
      1,
      -1,
      "del"
    )
  );
  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      buttons.push(
        new Button(
          innerWidth * 0.7 + col * innerWidth * 0.065,
          innerHeight * 0.3 + row * innerWidth * 0.065,
          innerWidth * 0.05,
          innerWidth * 0.05,
          buttons.length - 1,
          col,
          row,
          "num"
        )
      );
    }
  }

  buttons.push(
    new Button(
      innerWidth * 0.7,
      innerHeight * 0.3 + 3 * innerWidth * 0.065,
      2 * innerWidth * 0.065 + innerWidth * 0.05,
      innerWidth * 0.05,
      computed(() => buttonMessage.value),
      0,
      3,
      "verify"
    )
  );

  console.log(buttons);
  const c = canvas.value.getContext("2d");
  function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = "#fcffbe";
    c.fillRect(0, 0, innerWidth, innerHeight);

    nums[hiddenKey] = answer.value == "" ? "?" : answer.value;

    c.fillStyle = "#035E7B";
    c.font = `bold ${0.2 * innerHeight}px Itim`;
    c.textAlign = "center";
    c.fillText(
      `${nums[0]} X ${nums[1]} = ${nums[2]}`,
      innerWidth * 0.3,
      innerHeight * 0.5
    );

    if (displayResult) {
      c.fillStyle = answer.value == hidden ? "#51BBFE" : "#035E7B!";
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
