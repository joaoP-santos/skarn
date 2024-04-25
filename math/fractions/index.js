const canvas = document.querySelector("canvas");

var rectWidth;
var rectHeight;
var rectX;
var rectY;

function resizeWindow() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  rectWidth = (innerWidth * 6) / 8;
  rectHeight = (innerHeight * 3) / 5;
  rectX = innerWidth / 8;
  rectY = (innerHeight * 3) / 10;
}

resizeWindow();

window.addEventListener("resize", resizeWindow);

const c = canvas.getContext("2d");

const numerator = document.querySelector("input#numeratorInput");
const denominator = document.querySelector("input#denominatorInput");

function animate() {
  requestAnimationFrame(animate);
  numerator.max = denominator.value;
  c.clearRect(0, 0, innerWidth, innerHeight);
  c.fill();
  c.lineWidth = 5;
  c.beginPath();
  c.rect(rectX, rectY, rectWidth, rectHeight);
  c.strokeStyle = "#001B24";
  c.stroke();
  c.fillStyle = "#45C4B0";
  c.fill();

  for (var i = 0; i < denominator.value; i++) {
    if (numerator.value > i) {
      c.fillStyle = "#8FF7A7";
    } else {
      c.fillStyle = "#035E7B";
    }
    c.beginPath();
    c.rect(
      rectX + (i * rectWidth) / denominator.value,
      rectY,
      rectWidth / denominator.value,
      rectHeight
    );
    c.lineWidth = 2;
    c.stroke();
    c.fill();
  }
  c.font = `bold ${0.1 * innerHeight}px Itim`;
  c.fillStyle = "#8FF7A7";
  c.textAlign = "center";
  c.fillText(numerator.value, innerWidth / 2, (innerHeight * 2) / 20);

  c.beginPath();
  c.moveTo(innerWidth / 2 - innerHeight * 0.1, (innerHeight * 7) / 50);
  c.lineTo(innerWidth / 2 + innerHeight * 0.1, (innerHeight * 7) / 50);
  c.stroke();

  c.fillStyle = "#035E7B";
  c.fillText(denominator.value, innerWidth / 2, (innerHeight * 5) / 20);
}

animate();
