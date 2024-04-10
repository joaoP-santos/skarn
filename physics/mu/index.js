const canvas = document.querySelector("canvas");

function resizeWindow() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

resizeWindow();

window.addEventListener("resize", resizeWindow);

const c = canvas.getContext("2d");

const velocity = document.querySelector("input#velocity");
class Ship {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width * innerWidth;
    this.height = height * innerHeight;
  }
  draw() {
    this.move();
    c.fillStyle = "#FFFFFF";
    c.fillRect(this.x, this.y, this.width, this.height);
  }
  move() {
    var v = velocity.value;
    this.x += v * 0.9;
    console.log(c.getTransform().e);
    c.translate(-v, 0);
    stars.forEach((star) => {
      star.x -= -v * 0.9;
    });
  }
}

class Star {
  constructor() {
    this.x = Math.random() * innerWidth;
    this.y = Math.random() * innerHeight;
    this.radius = Math.random() * 2 + 1;
  }
  draw() {
    c.fillStyle = "#FFFFFF";

    c.fillRect(this.x, this.y, this.radius, this.radius);
    c.fill();
  }
}

const stars = [];

for (var i = 0; i < 100; i++) {
  stars.push(new Star());
}

const ship = new Ship(100, 100, 0.05, 0.08);

function animate() {
  requestAnimationFrame(animate);

  c.fillStyle = "#000000";
  c.fillRect(
    -c.getTransform().e,
    0,
    Math.abs(c.getTransform().e) + innerWidth,
    innerHeight
  );

  ship.draw();

  stars.forEach((star) => {
    star.draw();
  });

  c.fillStyle = "#ffffff";
  c.fillRect(innerWidth / 2, innerHeight / 2, 200, 200);
}

animate();
