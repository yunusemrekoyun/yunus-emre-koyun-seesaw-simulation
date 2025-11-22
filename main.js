const startButton = document.getElementById("start-button");
const gameScene = document.getElementById("game-scene");
const dropArea = document.getElementById("drop");
const stand = document.getElementById("stand");
const angleSpan = document.getElementById("angle");

const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const colors = [
  "red",
  "blue",
  "green",
  "olive",
  "orange",
  "purple",
  "brown",
  "pink",
  "cyan",
  "black",
];
const sizes = [18, 22, 26, 30, 34, 38, 42, 46, 50, 55];

let currentAngle = 0;
let angleAnimationId = null;
let gameStarted = false;

startButton.addEventListener("click", () => {
  if (!gameStarted) {
    gameScene.style.display = "block";
    gameScene.style.pointerEvents = "auto";
    startButton.textContent = "Reset";
    gameStarted = true;
  } else {
    resetGame();
  }
});

const leftWeightSpan = document.getElementById("left-weight");
const rightWeightSpan = document.getElementById("right-weight");
const leftTorqueSpan = document.getElementById("left-torque");
const rightTorqueSpan = document.getElementById("right-torque");

let leftWeight = 0;
let rightWeight = 0;
let leftTorque = 0;
let rightTorque = 0;

dropArea.addEventListener("click", (event) => {
  const xLocal = event.offsetX;
  const yLocal = event.offsetY;

  const idx = Math.floor(Math.random() * weights.length);
  const w = weights[idx];
  const col = colors[idx];
  const sz = sizes[idx];

  const item = document.createElement("div");
  item.classList.add("weight-object");
  item.style.width = `${sz}px`;
  item.style.height = `${sz}px`;
  item.style.backgroundColor = col;
  item.dataset.weight = w;
  item.textContent = w;
  item.style.left = `${xLocal}px`;
  item.style.top = `${yLocal}px`;

  dropArea.appendChild(item);
  animateFall(item, yLocal, sz);

  const areaWidth = dropArea.clientWidth;
  const pivotPos = areaWidth / 2; 
  const signedDist = xLocal - pivotPos;

  const torqueValue = w * Math.abs(signedDist);

  if (signedDist < 0) {
    leftWeight += w;
    leftWeightSpan.textContent = leftWeight;

    leftTorque += torqueValue;
    leftTorqueSpan.textContent = Math.round(leftTorque);
  } else if (signedDist > 0) {
    rightWeight += w;
    rightWeightSpan.textContent = rightWeight;

    rightTorque += torqueValue;
    rightTorqueSpan.textContent = Math.round(rightTorque);
  }

  updateAngle();
});

function animateFall(element, startY, size) {
  const maxY = dropArea.clientHeight - size / 2;
  let currentY = Math.min(startY, maxY);
  const speed = 12;

  function fall() {
    currentY += speed;

    if (currentY >= maxY) {
      currentY = maxY;
      element.style.top = `${currentY}px`;
      return;
    }

    element.style.top = `${currentY}px`;
    requestAnimationFrame(fall);
  }

  requestAnimationFrame(fall);
}

function updateAngle() {
  const calcAngle = Math.max(
    -30,
    Math.min(30, (rightTorque - leftTorque) / 10)
  );

  const startAngle = currentAngle;
  const duration = 300;
  const startTime = performance.now();

  if (angleAnimationId) cancelAnimationFrame(angleAnimationId);

  function animate(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    currentAngle = startAngle + (calcAngle - startAngle) * eased;

    stand.style.transform = `translateX(-50%) rotate(${currentAngle}deg)`;
    angleSpan.textContent = Math.round(currentAngle);

    if (t < 1) {
      angleAnimationId = requestAnimationFrame(animate);
    }
  }

  angleAnimationId = requestAnimationFrame(animate);
}

function resetGame() {
  dropArea.querySelectorAll(".weight-object").forEach((el) => el.remove());

  leftWeight = rightWeight = 0;
  leftTorque = rightTorque = 0;

  leftWeightSpan.textContent = "0";
  rightWeightSpan.textContent = "0";
  leftTorqueSpan.textContent = "0";
  rightTorqueSpan.textContent = "0";
  angleSpan.textContent = "0";

  if (angleAnimationId) cancelAnimationFrame(angleAnimationId);
  currentAngle = 0;

  stand.style.transform = `translateX(-50%) rotate(0deg)`;

  gameScene.style.display = "none";
  gameScene.style.pointerEvents = "none";

  startButton.textContent = "Start";
  gameStarted = false;
}
