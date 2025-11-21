const startButton = document.getElementById("start-button");
const gamescene = document.getElementById("game-scene");
startButton.addEventListener("click", () => {
  console.log("game started");

  gamescene.style.display = "block";
  gamescene.style.pointerEvents = "auto";
});
