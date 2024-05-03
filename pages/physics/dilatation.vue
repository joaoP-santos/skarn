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

  document.body.appendChild(renderer.domElement);

  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cylinderGeometry = new THREE.CylinderGeometry(1.8, 2, 0.5);
  const material = new THREE.MeshPhongMaterial({
    color: 0x90ff00,
  });

  const initialCube = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshPhongMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 1,
      depthTest: false,
      depthWrite: false,
    })
  );
  const variationCube = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
      depthTest: false,
      depthWrite: false,
    })
  );
  const cylinder = new THREE.Mesh(cylinderGeometry, material);

  const light = new THREE.HemisphereLight(0xffffff, 10);
  light.position.set(0, 5, 10);

  scene.add(light);
  scene.add(initialCube);
  scene.add(variationCube);
  scene.add(cylinder);

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
  window.addEventListener("wheel", (event) => {
    camera.position.z -= event.wheelDeltaY * 0.005;
  });

  window.addEventListener("mousemove", (event) => {
    if (mouseDown && !inputDown) {
      initialCube.rotation.y -= event.movementX * 0.007;
      initialCube.rotation.x -= event.movementY * 0.007;
      variationCube.rotation.y -= event.movementX * 0.007;
      variationCube.rotation.x -= event.movementY * 0.007;
    }
  });
  initialCube.position.y = 3;
  variationCube.position.y = 3;
  cylinder.position.y = -3;

  camera.position.y = -2;
  camera.position.z = 10;
  camera.rotation.x = 0.3;
  function animate() {
    requestAnimationFrame(animate);
    const temperature = inputs[0].value;
    const coefficient = Math.round(inputs[1].value * 100) / 10000;
    const initialVolume = inputs[2].value;
    const volumeVariation =
      Math.round(temperature * coefficient * initialVolume * 1000) / 1000;

    renderer.setClearColor(
      new THREE.Color(
        `hsl(${temperature > 0 ? 0 : 180}, 100%, ${
          100 - Math.abs(temperature) * 1.5
        }%)`
      )
    );
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
      var output = katex.render(
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

    renderer.render(scene, camera);
    if (!mouseDown || inputDown) {
      initialCube.rotation.y -= 0.005;
      initialCube.rotation.x -= 0.005;
      variationCube.rotation.y -= 0.005;
      variationCube.rotation.x -= 0.005;
    }
    cancelAnimationFrame(animate);
  }

  animate();
});
</script>
<template>
  <div id="inputs">
    <div>
      <p>
        Variação de temperatura:
        <strong></strong>
      </p>
      <input min="-30" max="30" type="range" name="temperature" />
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
