<script setup>
import { ref, onMounted, computed } from "vue";

definePageMeta({
  layout: "sketch",
});
useHead({
  title: "Jogo da Reta Numérica",
});

const canvas = ref(null);

// Game state
const gameState = ref("waiting"); // waiting, checking, result
const targetNumber = ref(0);
const points = ref([]);
const selectedPoint = ref(null);
const resultMessage = ref("");
const score = ref(0);

// Animation properties
const animationProgress = ref(0);
const animationSpeed = 0.02; // Animation speed (0-1)
const showSelectedNumber = ref(false); // Flag to show selected number after submission

// Add lives system
const lives = ref(3);

// Format numbers without trailing zeros
const formatNumber = (num) => {
  return Number(parseFloat(num).toFixed(3)).toString();
};

function resizeWindow() {
  canvas.value.width = innerWidth;
  canvas.value.height = innerHeight;
}

function generateGame() {
  // Generate a new target number (only positive) with up to 3 decimal places
  const precision = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 decimal places
  const multiplier = Math.pow(10, precision);
  targetNumber.value = Math.round(Math.random() * 10 * multiplier) / multiplier;

  // Ensure proper formatting for target number
  targetNumber.value = parseFloat(targetNumber.value.toFixed(precision));

  // Generate points with minimum spacing
  const newPoints = [targetNumber.value];
  const numPoints = 10; // Total points to display
  const minDistance = 0.2; // Minimum distance between points

  let attempts = 0;
  while (newPoints.length < numPoints && attempts < 100) {
    attempts++;

    // Generate potential new point
    const precision = Math.floor(Math.random() * 3) + 1;
    const multiplier = Math.pow(10, precision);
    let randomPoint = Math.round(Math.random() * 10 * multiplier) / multiplier;
    randomPoint = parseFloat(randomPoint.toFixed(precision)); // Fix precision

    // Check if this point is far enough from all existing points
    const isFarEnough = newPoints.every(
      (point) => Math.abs(point - randomPoint) >= minDistance
    );

    // Make sure we don't add duplicates and points are far enough apart
    if (
      isFarEnough &&
      !newPoints.includes(randomPoint) &&
      randomPoint <= 10 &&
      randomPoint >= 0
    ) {
      newPoints.push(randomPoint);
    }
  }

  // If we couldn't get enough points with spacing, fill with evenly distributed points
  if (newPoints.length < numPoints) {
    const existingPositions = new Set(newPoints.map((p) => Math.round(p * 10)));
    for (let i = 0; newPoints.length < numPoints; i++) {
      const position = i % 101; // 0-100 positions (0-10 with 0.1 increment)
      if (!existingPositions.has(position)) {
        const newPoint = position / 10;
        newPoints.push(newPoint);
        existingPositions.add(position);
      }
    }
  }

  // Shuffle the points array
  points.value = newPoints.sort(() => Math.random() - 0.5);

  // Reset game state
  selectedPoint.value = null;
  gameState.value = "waiting";
  resultMessage.value = "";
  animationProgress.value = 0;
}

function selectPoint(point) {
  if (gameState.value === "waiting") {
    selectedPoint.value = point;
  }
}

function submitAnswer() {
  if (selectedPoint.value === null || gameState.value !== "waiting") return;

  gameState.value = "checking";
  const isCorrect = selectedPoint.value === targetNumber.value;
  showSelectedNumber.value = true;

  if (isCorrect) {
    resultMessage.value = "Correto!";
    score.value += 1;
  } else {
    lives.value -= 1;
    if (lives.value <= 0) {
      resultMessage.value = `Game Over! Sua pontuação final: ${score.value}`;
      lives.value = 3;
      score.value = 0;
    } else {
      resultMessage.value = `Incorreto! O número correto era ${formatNumber(
        targetNumber.value
      )}`;
    }
  }

  animateArrow();
}

function animateArrow() {
  animationProgress.value = 0;

  function step() {
    animationProgress.value += animationSpeed;

    if (animationProgress.value < 1) {
      requestAnimationFrame(step);
    } else {
      // Animation finished
      animationProgress.value = 1;
      setTimeout(() => {
        gameState.value = "result";
      }, 500);
    }
  }

  requestAnimationFrame(step);
}

function nextRound() {
  generateGame();
  showSelectedNumber.value = false;
}

function handlePointClick(e) {
  if (gameState.value !== "waiting") return;

  const rect = canvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const ratio = (x - innerWidth * 0.1) / (innerWidth * 0.8);

  if (ratio >= 0 && ratio <= 1) {
    const clickValue = ratio * 10;
    const closest = points.value.reduce((prev, curr) =>
      Math.abs(curr - clickValue) < Math.abs(prev - clickValue) ? curr : prev
    );
    selectPoint(closest);
  }
}

onMounted(() => {
  addEventListener("resize", resizeWindow);
  resizeWindow();
  generateGame();

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
    const spacing = (innerWidth * 0.8) / range; // Modified to show only 0-10 range

    for (let i = 0; i <= range; i++) {
      // Changed to start from 0 instead of -range
      const x = innerWidth * 0.1 + i * spacing;

      // Draw tick
      c.beginPath();
      c.moveTo(x, innerHeight / 2 - 10);
      c.lineTo(x, innerHeight / 2 + 10);
      c.stroke();

      // Draw number
      c.fillStyle = "#035E7B";
      c.fillText(i, x, innerHeight / 2 + 35);
    }

    // Draw points for selection (modified to be smaller and spaced)
    points.value.forEach((point) => {
      const pointX = innerWidth * 0.1 + (point / 10) * (innerWidth * 0.8);
      const isSelected = point === selectedPoint.value;
      const isCorrect = selectedPoint.value === targetNumber.value;

      c.beginPath();
      c.arc(pointX, innerHeight / 2 - 40, 7, 0, Math.PI * 2);
      c.fillStyle = isSelected ? "#51BBFE" : "#035E7B";
      c.fill();

      // Show selected number above the point after submission
      if (showSelectedNumber.value && isSelected) {
        c.font = `bold ${0.04 * innerHeight}px Itim`;
        c.textAlign = "center";
        c.fillStyle = isCorrect ? "#4CAF50" : "#F44336"; // Fixed color logic
        c.fillText(formatNumber(point), pointX, innerHeight / 2 - 60);

        // Highlight the point with matching color
        c.beginPath();
        c.arc(pointX, innerHeight / 2 - 40, 10, 0, Math.PI * 2);
        c.strokeStyle = isCorrect ? "#4CAF50" : "#F44336"; // Fixed color logic
        c.lineWidth = 3;
        c.stroke();
      }
    });

    // Draw target prompt
    c.font = `bold ${0.05 * innerHeight}px Itim`;
    c.fillStyle = "#035E7B";
    c.textAlign = "center";
    c.fillText(
      `Encontre o número: ${formatNumber(targetNumber.value)}`,
      innerWidth / 2,
      innerHeight * 0.15
    );

    // Draw score
    c.font = `bold ${0.03 * innerHeight}px Itim`;
    c.fillText(
      `Pontuação: ${score.value}`,
      innerWidth * 0.85,
      innerHeight * 0.08
    );

    // Draw lives
    c.font = `bold ${0.03 * innerHeight}px Itim`;
    c.fillStyle = "#035E7B";
    const heartSize = innerHeight * 0.03;
    for (let i = 0; i < lives.value; i++) {
      c.fillText(
        "❤️",
        innerWidth * 0.5 + heartSize * 2 * (i - 1),
        innerHeight * 0.1
      );
    }

    // Modified arrow drawing code with length indicator
    if (gameState.value === "checking" || gameState.value === "result") {
      const startX = innerWidth * 0.1;
      const targetX = startX + (targetNumber.value / 10) * (innerWidth * 0.8);
      const progressX = startX + animationProgress.value * (targetX - startX);
      const currentLength = progressX - startX;

      // Draw arrow shaft
      c.beginPath();
      c.moveTo(startX, innerHeight / 2 + 40);
      c.lineTo(progressX - 15, innerHeight / 2 + 40); // Stop before the arrowhead
      c.strokeStyle = "#51BBFE";
      c.lineWidth = 5;
      c.stroke();

      // Draw arrowhead
      if (animationProgress.value > 0.05) {
        c.beginPath();
        c.moveTo(progressX, innerHeight / 2 + 40);
        c.lineTo(progressX - 15, innerHeight / 2 + 30);
        c.lineTo(progressX - 15, innerHeight / 2 + 50);
        c.closePath();
        c.fillStyle = "#51BBFE";
        c.fill();

        // Show length at the tip of the arrow with proper formatting
        c.font = `bold ${0.03 * innerHeight}px Itim`;
        c.textAlign = "center";
        c.fillStyle = "#035E7B";

        // Calculate current value based on progress and format it properly
        const currentValue = targetNumber.value * animationProgress.value;
        c.fillText(formatNumber(currentValue), progressX, innerHeight / 2 + 65);
      }

      // When animation completes, highlight the correct target point
      if (animationProgress.value >= 0.99) {
        const targetX =
          innerWidth * 0.1 + (targetNumber.value / 10) * (innerWidth * 0.8);
        c.beginPath();
        c.arc(targetX, innerHeight / 2 - 40, 10, 0, Math.PI * 2);
        c.strokeStyle = "#4CAF50"; // Green for the correct target
        c.lineWidth = 3;
        c.stroke();
      }
    }

    // Draw result message
    if (gameState.value === "checking" || gameState.value === "result") {
      c.font = `bold ${0.05 * innerHeight}px Itim`;
      c.fillStyle = resultMessage.value.includes("Correto")
        ? "#4CAF50"
        : "#F44336";
      c.fillText(resultMessage.value, innerWidth / 2, innerHeight * 0.8);
    }
  }
  animate();
});
</script>

<template>
  <div id="inputs">
    <div class="input-group">
      <strong>{{
        gameState === "waiting"
          ? "Clique em um ponto na reta"
          : "Veja o resultado"
      }}</strong>

      <div class="button-container">
        <button
          v-if="gameState === 'waiting'"
          @click="submitAnswer"
          :disabled="selectedPoint === null"
          class="action-button"
        >
          Confirmar
        </button>

        <button
          v-if="gameState === 'result'"
          @click="nextRound"
          class="action-button"
        >
          Próxima Rodada
        </button>
      </div>
    </div>
  </div>

  <!-- Click overlay -->
  <div
    v-if="gameState === 'waiting'"
    class="click-overlay"
    @click="handlePointClick"
  ></div>

  <canvas ref="canvas"></canvas>
</template>

<style scoped>
div#inputs {
  position: absolute;
  padding: 20px;
  max-width: 30vw;
  min-width: 220px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  top: 20px;
  left: 20px;
  z-index: 10;
}

strong {
  color: var(--dark-blue);
  font-weight: bolder;
  font-size: calc(1em + 0.3vw);
  font-family: var(--itim);
  display: block;
  margin-bottom: 10px;
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
  font-size: calc(0.8em + 0.3vw);
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.action-button {
  padding: 10px 20px;
  background-color: var(--dark-blue);
  color: white;
  border: none;
  border-radius: 5px;
  font-family: var(--itim);
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: var(--darkest-blue);
}

.action-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.click-overlay {
  position: fixed; /* Changed from absolute to fixed */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 5;
}
</style>
