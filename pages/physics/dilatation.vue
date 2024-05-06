<script setup>
import * as THREE from "three";

import katex from "katex";

definePageMeta({
  layout: "sketch",
});
useHead({
  title: "Dilatação",
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css",
      integrity:
        "sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww",
      crossorigin: "anonymous",
    },
  ],
});

const temperatureModel = ref(0);
const tempColor = computed(() => {
  return new THREE.Color(
    `hsl(${temperatureModel.value > 0 ? 0 : 180}, 100%, ${
      100 - Math.abs(temperatureModel.value) * 1.5
    }%)`
  );
});

onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setClearColor(0xfcffbe);

  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeometry = new THREE.CylinderGeometry(1.8, 2, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0x035e7b,
  });

  const initialCube = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshPhongMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    })
  );
  const variationCube = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    })
  );
  const cylinder = new THREE.Mesh(cylinderGeometry, material);

  const light = new THREE.HemisphereLight(0xffffff, 10);

  const cubes = new THREE.Group();
  cubes.add(initialCube, variationCube);
  cubes.renderOrder = 0;
  scene.add(light);
  scene.add(cylinder);
  scene.add(variationCube);

  scene.add(initialCube);

  const inputs = document.querySelectorAll("input");
  const outputs = document.querySelectorAll("strong");
  var inputDown = false;

  inputs.forEach((input) => {
    input.addEventListener("mousedown", () => {
      inputDown = true;
    });
    input.addEventListener("input", () => {
      inputDown = true;
    });
  });

  var mouseDown = false;
  var tempInputDown = false;

  document.body.onmousedown = () => {
    mouseDown = true;
  };

  document.body.onmouseup = () => {
    mouseDown = false;
    inputDown = false;
  };

  initialCube.position.y = 2;
  variationCube.position.y = 2;
  cylinder.position.y = -5;

  camera.position.y = -2;
  camera.position.z = 10;
  camera.rotation.x = 0.3;
  class Spark {
    x;
    y;
    z;
    radius;
    dx;
    dy;
    dz;
    Object3D;
    dead = false;
    constructor() {
      this.x = cylinder.position.x + 0.9 - Math.random() * 1.8;
      this.y = cylinder.position.y;
      this.z = cylinder.position.z + 0.9 - Math.random() * 1.8;
      this.dx = Math.random() * 0.01 - 0.005;
      this.dy = Math.random() * 0.05 + 0.1;
      this.dz = Math.random() * 0.01 - 0.005;
      this.radius = Math.random() * 0.1 + 0.2;
      this.Object3D = new THREE.Mesh(
        new THREE.SphereGeometry(this.radius),
        new THREE.MeshPhongMaterial({ color: tempColor.value })
      );
      scene.add(this.Object3D);
      setTimeout(() => {
        scene.remove(this.Object3D);
        this.Object3D.geometry.dispose();
        this.Object3D.material.dispose();
        this.dead = true;
      }, 2000);
    }

    render() {
      (this.x += this.dx), (this.y += this.dy), (this.z += this.dz);
      this.Object3D.position.set(this.x, this.y, this.z);
    }
  }
  var sparks = [];
  function loop() {
    setTimeout(() => {
      if (temperatureModel.value == 0) {
        loop();
        return;
      }
      const spark = new Spark();
      sparks.push(spark);
      loop();
    }, 1000 - Math.abs(temperatureModel.value) * 30);
  }
  loop();
  function animate() {
    requestAnimationFrame(animate);
    const temperature = inputs[0].value;
    const coefficient = Math.round(inputs[1].value * 100) / 10000;
    const initialVolume = inputs[2].value;
    const volumeVariation =
      Math.round(temperature * coefficient * initialVolume * 1000) / 1000;

    sparks = sparks.filter((spark) => !spark.dead);
    sparks.forEach((spark) => {
      spark.render();
    });
    outputs.forEach((o, key) => {
      var sufix = "";
      switch (key) {
        case 0:
          sufix = "°C";
          break;
        case 1:
          sufix = "°C^{-1}";
          break;
        case 2:
          sufix = "m^3";
          break;
        case 3:
          sufix = "m^3";
          break;
      }
      katex.render(
        `${
          [temperature, coefficient, initialVolume, volumeVariation][key]
        } ${sufix}`,
        o
      );
    });
    initialCube.scale.set(
      initialVolume / 50,
      initialVolume / 50,
      initialVolume / 50
    );

    const visualVolumeVariation =
      ((temperature * 0.05 * initialVolume) / 50) * coefficient;

    if (visualVolumeVariation < 0) {
      initialCube.material.opacity = 0.5;
      variationCube.material.opacity = 1;
    } else {
      initialCube.material.opacity = 1;
      variationCube.material.opacity = 0.5;
    }

    variationCube.scale.set(
      initialCube.scale.x + visualVolumeVariation,
      initialCube.scale.y + visualVolumeVariation,
      initialCube.scale.z + visualVolumeVariation
    );

    if (!mouseDown || inputDown) {
      initialCube.rotation.y -= 0.005;
      variationCube.rotation.y -= 0.005;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
});
onBeforeRouteLeave((to, from, next) => {
  document.body.removeChild(renderer.domElement);
  next();
});
</script>
<template>
  <div id="inputs">
    <div>
      <p>
        Variação de temperatura:
        <strong></strong>
      </p>
      <input
        v-model="temperatureModel"
        min="-30"
        max="30"
        type="range"
        name="temperature"
      />
    </div>
    <div>
      <p>Coeficiente de dilatação: <strong></strong></p>
      <input min="1" max="75" type="range" name="coefficient" />
    </div>
    <div>
      <p>Volume inicial: <strong></strong></p>
      <input min="0" max="100" type="range" name="initialVolume" />
    </div>
    <div>
      <p>Variação de volume: <strong></strong></p>
    </div>
  </div>
</template>
<style scoped>
div#inputs {
  position: absolute;
  display: flex;
  flex-direction: column;

  width: 30vw;

  padding: 20px;
  gap: 10px;
}

div#inputs div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  box-sizing: border-box;

  gap: 40px;
}

p {
  font-family: var(--itim);
  font-size: 1.25em;
}

span.katex {
  font-size: 2em;
  font-family: var(--itim);
}
</style>
