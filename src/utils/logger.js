function addLog(message, type = "system") {
  const entry = {
    message,
    type,
    time: {
      day: gameState.time.day,
      hour: gameState.time.hour,
      minute: Math.floor(gameState.time.minute),
    },
  };

  gameState.log.push(entry);

  if (gameState.log.length > 100) {
    gameState.log.shift();
  }
}
