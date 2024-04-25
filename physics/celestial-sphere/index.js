/*
This is a Earth's Celestial Sphere simulation. It uses THREE.JS.

The Celestial Shere is an imaginary sphere that surrounds the Earth and contains everything
that we see in the sky from a geocentrical perspective. It shows two lines: the equator line and the ecliptic line
(the line of the plane of the Solar System).

I'm also going to make the sun which orbit axis travels through the ecliptic line it's parallel to the equator line.

*/

//This is a default three.js scene
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

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

//This is the Earth
const earthGeometry = new THREE.SphereGeometry(1, 50, 50);
const earthMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x0000ff,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

//This is the Celestial Sphere
const sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.1,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

//This is the Equator Line
const equatorGeometry = new THREE.RingGeometry(4.9, 5, 100);
const equatorMaterial = new THREE.MeshPhongMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
});
const equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
equator.rotation.x = Math.PI / 2;

//This is the Ecliptic Line
const eclipticGeometry = new THREE.RingGeometry(4.9, 5, 50000);
const eclipticMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});
const ecliptic = new THREE.Mesh(eclipticGeometry, eclipticMaterial);
ecliptic.rotation.x = Math.PI / 2;
ecliptic.rotation.y = (Math.PI * 47) / 360;

// This is the Sun's orbit. It's a ring that goes up and down according to the ecliptic line
const sunOrbitGeometry = new THREE.RingGeometry(4.9, 5, 2000);
const sunOrbitMaterial = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const sunOrbit = new THREE.Mesh(sunOrbitGeometry, sunOrbitMaterial);
sunOrbit.rotation.x = Math.PI / 2;
sunOrbit.position.y = 2;
// This is the Sun
const sunGeometry = new THREE.SphereGeometry(1, 50, 50);
const sunMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffff00,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

//I'm going to make a "snapshot" sun that is going to travel through the ecliptic line
const yearSun = new THREE.Mesh(
  sunGeometry,
  new THREE.MeshPhysicalMaterial({
    color: 0x999900,
    transparent: true,
    opacity: 0.3,
  })
);

renderer.setClearColor(new THREE.Color().setHex(0x000000));

const sunLight = new THREE.DirectionalLight(0xffffff, 10);
const lightSun = new THREE.DirectionalLight(0xffffff, 10);

console.log(eclipticGeometry.attributes.position.array);

var yearSunSpeed = 9000;
var daySunSpeed = 300;
const { array } = eclipticGeometry.attributes.position;
const daySunArray = sunOrbitGeometry.attributes.position.array;

setInterval(() => {
  sun.position.z = daySunArray[daySunSpeed];
  sun.position.x = daySunArray[daySunSpeed + 1];
  sun.position.y = sunOrbit.position.y;
  sunLight.position.set(sun.position.x, sun.position.y, sun.position.z);
  lightSun.position.set(
    sun.position.x * 0.9,
    sun.position.y * 0.9,
    sun.position.z * 0.9
  );

  yearSun.position.z = array[yearSunSpeed];
  yearSun.position.x = array[yearSunSpeed + 1];
  yearSun.position.y = yearSun.position.x * Math.sin((Math.PI * 47) / 360);

  sunOrbit.position.y = yearSun.position.y;
  if (yearSunSpeed >= array.length / 2 - 3) yearSunSpeed = 0;
  if (daySunSpeed >= daySunArray.length / 2 - 3) daySunSpeed = 0;

  yearSunSpeed += 3;
  daySunSpeed += 3;
  const r = sphereGeometry.parameters.radius;
  const h = 5 - Math.abs(sunOrbit.position.y);

  const radius = Math.sqrt(r * r - (r - h) * (r - h));

  const updatedSunOrbitG = new THREE.RingGeometry(radius - 0.1, radius, 2000);
  sunOrbitGeometry.attributes = updatedSunOrbitG.attributes;
}, 10);

scene.add(sunOrbit);
scene.add(sun);
scene.add(yearSun);
scene.add(ecliptic);
scene.add(equator);
scene.add(earth);
scene.add(sunLight);
lightSun.target = sun;
window.addEventListener("click", () => {
  console.log(sunOrbit.position.y);
});
sunLight.target = earth;

window.addEventListener("wheel", (event) => {
  camera.position.z -= event.wheelDeltaY * 0.005;
});
scene.position.y = 1;
camera.position.z = 10;
camera.position.y = 2;

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

animate();
