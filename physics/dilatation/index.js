//import * as THREE from "three/src/Three.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

import katex from "katex";
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
console.log(camera);
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

  renderer.render(scene, camera);
  if (!mouseDown || inputDown) {
    initialCube.rotation.y -= 0.005;
    initialCube.rotation.x -= 0.005;
    variationCube.rotation.y -= 0.005;
    variationCube.rotation.x -= 0.005;
  }
}

animate();
