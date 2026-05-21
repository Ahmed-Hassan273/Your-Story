let lastTime = performance.now();
const tickRate = 1000 / 10;
let timer = 0;

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  timer += deltaTime;

  while (timer >= tickRate) {
    updateGameLogic(tickRate);
    timer -= tickRate;
  }

  requestAnimationFrame(gameLoop);
}

function updateGameLogic(deltaMs) {
  const gameMinutes = deltaMs / 1000;

  gametick();
  advanceTime(gameMinutes);
  updateDerivedStats();
  updateEventSystem(gameMinutes);
}

function gametick() {
  if (gameState._initialized) return;

  initializePlaceEvent();
  addLog("Your journey begins in an unknown village.", "event");
  addLog("You are eighteen years old. Your life is still unwritten.", "system");
  gameState._initialized = true;
}

requestAnimationFrame(gameLoop);
