<script setup>
import { ref, onMounted, watch, computed } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { randFloat, randInt } from "three/src/math/MathUtils.js";

definePageMeta({
  layout: "sketch",
});
useHead({
  title: "3D Magnetic Intensity",
});

const container = ref(null);
let scene, camera, renderer, controls;
let wire, fieldArrows, initialAngles, currentArrows;

const current = ref(5); // Initial current value in Amperes
const radius = ref(1); // Initial radius value in meters
const angle = ref(45); // Initial angle value in degrees
const frames = ref(0);

const currentDirection = ref("down");

const magneticIntensity = computed(() => {
  const mu0 = 4 * Math.PI * 1e-7; // Magnetic permeability of free space
  return (mu0 * current.value) / (2 * Math.PI * radius.value);
});

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 5, 5);
  controls.update();

  createWire();
  createArrows();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 1, 0);
  scene.add(directionalLight);

  renderer.setClearColor(0xfcffbe);
}

function createWire() {
  const wireGeometry = new THREE.CylinderGeometry(0.05, 0.05, 40, 32);
  const wireMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5,
  }); // Green color for visibility
  wire = new THREE.Mesh(wireGeometry, wireMaterial);
  scene.add(wire);
}

function createArrows() {
  const arrowLength = 0.5;
  const arrowHeadLength = 0.2;
  const arrowHeadWidth = 0.1;

  const direction = new THREE.Vector3(0, 1, 0);
  const origin = new THREE.Vector3(0, 0, 0);

  // Field arrows
  fieldArrows = [];
  initialAngles = [];
  currentArrows = [];

  for (let i = 0; i < 600; i++) {
    const fieldArrow = new THREE.ArrowHelper(
      direction,
      origin,
      arrowLength,
      0xff0000,
      arrowHeadLength,
      arrowHeadWidth
    );
    fieldArrow.position.setY(randFloat(-20, 20));
    scene.add(fieldArrow);
    fieldArrows.push(fieldArrow);
    initialAngles.push(randFloat(0, 360));
  }

  // Current arrows
  for (let i = 0; i < 20; i++) {
    let cDirection = new THREE.Vector3(0, -1, 0);
    let cOrigin = new THREE.Vector3(0, 10 - i, 0);

    let cArrow = new THREE.ArrowHelper(
      cDirection,
      cOrigin,
      arrowLength,
      0x0000ff,
      arrowHeadLength,
      arrowHeadWidth
    );
    scene.add(cArrow);
    currentArrows.push(cArrow);
  }
}

function updateFieldArrows() {
  const distance = radius.value;

  // Scale arrow length based on magnetic intensity
  const arrowLength = Math.log(magneticIntensity.value * 1e7 + 1) * 0.2; // Adjust scaling as needed

  // Field arrows
  fieldArrows.forEach((fArrow, index) => {
    const fieldRadians =
      ((initialAngles[index] + angle.value) % 360) * (Math.PI / 180);
    let xF = Math.cos(fieldRadians) * distance;
    let zF = Math.sin(fieldRadians) * distance;

    if (currentDirection.value == "down") {
      const fieldDirection = new THREE.Vector3(-zF, 0, xF).normalize();
      fArrow.setLength(arrowLength, arrowLength * 0.4, arrowLength * 0.2);
      fArrow.position.setX(xF);
      fArrow.position.setZ(zF);
      fArrow.setDirection(fieldDirection);
    } else {
      const fieldDirection = new THREE.Vector3(zF, 0, -xF).normalize();
      fArrow.setLength(arrowLength, arrowLength * 0.4, arrowLength * 0.2);
      fArrow.position.setX(xF);
      fArrow.position.setZ(zF);
      fArrow.setDirection(fieldDirection);
    }
  });
}

function updateCurrentArrows() {
  currentArrows.forEach((cArrow) => {
    if (currentDirection.value == "down") {
      if (cArrow.position.y <= -10) cArrow.position.setY(10);
      else cArrow.position.setY(cArrow.position.y - 0.1);
    } else {
      if (cArrow.position.y >= 10) cArrow.position.setY(-10);
      else cArrow.position.setY(cArrow.position.y + 0.1);
    }
    const cArrowLength = Math.log(current.value * 0.5 + 1) * 0.3;
    cArrow.setLength(cArrowLength, cArrowLength * 0.4, cArrowLength * 0.2);
  });
}

function animate() {
  requestAnimationFrame(animate);
  frames.value++;
  currentDirection.value == "up" ? angle.value-- : angle.value++;
  controls.update();
  renderer.render(scene, camera);
}

function updateScene() {
  updateFieldArrows();
  updateCurrentArrows();
}

function updateOnChange() {
  const direction = currentDirection.value == "up" ? 1 : -1;

  currentArrows.forEach((cArrow) => {
    cArrow.setDirection(new THREE.Vector3(0, direction, 0));
  });
}

onMounted(() => {
  init();
  animate();
  updateScene();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

watch([current, radius, angle, magneticIntensity], updateScene);
watch([currentDirection], updateOnChange);
</script>

<template>
  <div class="controls">
    <div>
      <strong>Current (A):</strong>
      <input
        min="0"
        max="10"
        step="0.1"
        v-model="current"
        type="range"
        name="current"
      />
      {{ current }} A
    </div>
    <div>
      <strong>Radius (m):</strong>
      <input
        min="0.1"
        max="5"
        step="0.1"
        v-model="radius"
        type="range"
        name="radius"
      />
      {{ radius }} m
    </div>

    <div>
      <strong>Campo (T):</strong>
      {{ magneticIntensity.toExponential(2) }}
    </div>
    <div>
      <strong> Sentido </strong>
      <div class="switch">
        <input
          name="up"
          type="radio"
          :checked="currentDirection == 'up'"
          v-on:click="() => (currentDirection = 'up')"
        />
        <span>Para cima</span>
      </div>
      <div class="switch">
        <input
          name="down"
          type="radio"
          :checked="currentDirection == 'down'"
          v-on:click="() => (currentDirection = 'down')"
        />
        <span>Para baixo</span>
      </div>
    </div>
  </div>

  <div ref="container"></div>
</template>

<style scoped>
.controls {
  position: absolute;
  padding: 10px;
  max-width: 30vw;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  z-index: 10;
}

strong {
  font-family: var(--itim);
  font-size: calc(1em + 0.5vw);
  color: var(--dark-blue);
}

input {
  width: 100%;
}

.switch {
  display: flex;
}
</style>
