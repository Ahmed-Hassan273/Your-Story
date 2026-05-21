function advanceTime(minutes = 1) {
  gameState.time.minute += minutes;

  while (gameState.time.minute >= 60) {
    gameState.time.minute -= 60;
    gameState.time.hour += 1;
  }

  while (gameState.time.hour >= 24) {
    gameState.time.hour -= 24;
    gameState.time.day += 1;
  }
}

function getTimeString() {
  const hour = String(gameState.time.hour).padStart(2, "0");
  const minute = String(Math.floor(gameState.time.minute)).padStart(2, "0");

  return `Day ${gameState.time.day} - ${hour}:${minute}`;
}

function getTotalGameMinutes(time = gameState.time) {
  return (time.day - 1) * 24 * 60 + time.hour * 60 + Math.floor(time.minute);
}
