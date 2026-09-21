<script setup>
const { t } = useLanguage();
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "sketch",
});

useHead({
  title: t("1º Lei de Newton: Inércia"),
});

const cacti = [];
const vehicles = [];
const mass1 = ref(3500);
const mass2 = ref(3500);
var stopedX = 0;
var lineCount = 0;

var running = ref(true);
class Cactus {
  constructor(x) {
    this.x = x;
    this.y = innerHeight / 2;
    this.width = innerWidth * 0.1;
    this.height = this.width * 0.3;
    this.radius = 30;
    this.color = "#bcc9d6";
    cacti.push(this);
  }

  draw(ctx, plane) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    if (this.x < plane.x - this.width) {
      cacti.splice(cacti.indexOf(this), 1);
    }
  }
}

class Vehicle {
  constructor(y, width, height, mass) {
    this.x = 100;
    this.y = y;
    this.width = width;
    this.height = 30;
    this.mass = computed(() => mass.value);
    this.dx = 3;
    this.Ecin = computed(() => (mass.value * Math.pow(this.dx, 2)) / 2);
    vehicles.push(this);
  }
}

const canvas = ref(null);
let plane = {
  dx: 0,
};

function resizeWindow() {
  canvas.value.width = innerWidth;
  canvas.value.height = innerHeight;
}

function stopVehicles() {
  running.value = false;
  vehicles.forEach((veh) => (veh.Ecin = veh.Ecin.value));
  stopedX = plane.dx;
}

onMounted(() => {
  window.addEventListener("resize", resizeWindow);
  resizeWindow();

  const ctx = canvas.value.getContext("2d");

  new Vehicle(innerHeight / 3, 50, 30, mass1);
  new Vehicle((innerHeight * 2) / 3, 70, 30, mass2);

  for (var i = 0; i < innerWidth * 1.1; i += innerWidth * 0.2) {
    new Cactus(i);
    lineCount++;
  }
  function animate() {
    ctx.fillStyle = "#f7f5ef";
    ctx.fillRect(plane.dx, 0, innerWidth, innerHeight);

    ctx.fillStyle = "#243f5d";
    ctx.fillRect(100, 100, 100, 100);

    if (running.value) {
      ctx.translate(-3, 0);
      plane.dx += 3;
    }

    if (plane.dx + innerWidth > innerWidth * 0.2 * lineCount) {
      new Cactus(plane.dx + innerWidth);
      lineCount++;
    }

    ctx.fillStyle = "#e0e6ed";
    ctx.fillRect(
      plane.dx,
      (innerHeight * 3) / 12,
      innerWidth,
      (innerHeight * 7) / 12
    );

    cacti.forEach((cac) => {
      cac.draw(ctx, plane);
    });

    ctx.fillStyle = "#243f5d";

    vehicles.forEach((veh) => {
      var x = running.value ? plane.dx : stopedX;
      ctx.fillRect(veh.x + x, veh.y, veh.width, veh.height);
      ctx.font = `500 ${0.03 * innerHeight}px "DM Sans", Arial`;
      ctx.fillText(`${veh.mass.value}kg`, veh.x + x, veh.y + veh.height * 1.7);
      ctx.fillText(
        `${Math.round(veh.dx * 10)} km/h`,
        veh.x + x,
        veh.y - veh.height * 0.5
      );
      ctx.fillText(
        `${Math.round(veh.Ecin.value || veh.Ecin)} J`,
        veh.x + x + veh.width * 1.2,
        veh.y + veh.height * 0.6
      );

      if (!running.value) {
        if (veh.Ecin - 20 <= 0) {
          veh.Ecin = 0;
          veh.dx = 0;
        } else {
          veh.Ecin -= 20;
          veh.dx = Math.sqrt((2 * veh.Ecin) / veh.mass.value);
          veh.x += veh.dx;
        }

        if (veh.x + x > plane.dx + innerWidth * 0.9) {
          ctx.translate(-veh.dx, 0);
          plane.dx += veh.dx;
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
});
</script>

<template>
  <div id="controls">
    <div>
      <strong>{{ t('Massa 1:') }}</strong>
      <input min="2000" max="5000" v-model="mass1" type="range" name="mass1" />
    </div>
    <div>
      <strong>{{ t('Massa 2:') }}</strong>
      <input min="2000" max="5000" v-model="mass2" type="range" name="mass2" />
    </div>
    <button @click="stopVehicles">{{ t('Parar') }}</button>
  </div>
  <canvas ref="canvas"></canvas>
</template>

<style>
* {
  font-family: var(--font-sans);
}
div#controls {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 20vw;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input {
  width: 100%;
}

button {
  padding: 10px 20px;
  background-color: #a04e46;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
}

button:hover {
  background-color: #853e37;
}

div#controls { border: 1px solid var(--line); border-radius: 8px; padding: 18px 20px; background: #fffffff5; }
strong { font: 500 14px/1.6 var(--font-sans); }
button { border-radius: 8px; font: 500 13px var(--font-sans); }

</style>
