function advanceTime(minutes = 1) {
  gameState.world.minute += minutes;

  while (gameState.world.minute >= 60) {
    gameState.world.minute -= 60;
    gameState.world.hour += 1;
  }

  while (gameState.world.hour >= 24) {
    gameState.world.hour -= 24;
    gameState.world.day += 1;
  }
}

function getTimeString() {
  const hour = String(gameState.world.hour).padStart(2, "0");
  const minute = String(Math.floor(gameState.world.minute)).padStart(2, "0");

  return `Day ${gameState.world.day} - ${hour}:${minute}`;
}
