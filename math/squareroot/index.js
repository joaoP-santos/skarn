const canvas = document.querySelector("canvas");

var rectLength;
var rectX;
var rectY;
var side;

const sideInput = document.querySelector("input#side-input");
const sideText = document.querySelector("p");
function updateValues(redraw) {
  if (side == sideInput.value && redraw == false) {
    return;
  } else {
    side = sideInput.value;
    sideText.innerHTML = "Comprimento do lado: " + side;
    if (innerHeight > innerWidth) {
      rectLength = (side * innerHeight) / 50;
    } else {
      rectLength = (side * innerWidth) / 90;
    }
    rectX = innerWidth / 2 - rectLength / 2;
    rectY = innerHeight / 2 - rectLength / 2;
  }
}

function resizeWindow() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  updateValues(true);
}

resizeWindow();

window.addEventListener("resize", resizeWindow);

const c = canvas.getContext("2d");

function animate() {
  updateValues();
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  c.rect(0, 0, innerWidth, innerHeight);

  c.fillStyle = "#8FF7A7";
  c.fill();
  c.lineWidth = 5;
  c.beginPath();
  c.rect(rectX, rectY, rectLength, rectLength);
  c.fillStyle = "#FCFFBE";
  c.fill();
  for (let x = 0; x < side; x++) {
    for (let y = 0; y < side; y++) {
      c.beginPath();
      c.strokeStyle = "#45C4B0";

      c.moveTo(
        (innerWidth - rectLength) / 2 + (x * rectLength) / side,
        (innerHeight - rectLength) / 2
      );
      c.lineTo(
        (innerWidth - rectLength) / 2 + (x * rectLength) / side,
        (innerHeight + rectLength) / 2
      );

      c.moveTo(
        (innerWidth - rectLength) / 2,
        (innerHeight - rectLength) / 2 + (y * rectLength) / side
      );
      c.lineTo(
        (innerWidth + rectLength) / 2,
        (innerHeight - rectLength) / 2 + (y * rectLength) / side
      );
      c.lineWidth = "1";
      c.stroke();
    }
  }
  c.lineWidth = 5;
  c.beginPath();
  c.rect(rectX, rectY, rectLength, rectLength);
  c.strokeStyle = "#035E7B";
  c.stroke();

  c.font = `bold ${0.05 * innerHeight}px Itim`;
  c.textAlign = "center";
  c.fillStyle = "#035E7B";
  c.fillText(
    `Área total: ${Math.pow(side, 2)}`,
    innerWidth / 2,
    rectY + rectLength + 50
  );
}

animate();
