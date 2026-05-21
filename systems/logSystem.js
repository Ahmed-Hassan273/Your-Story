function addLog(message, type = "system") {
  const entry = {
    message,
    type,
    time: {
      day: gameState.world.day,
      hour: gameState.world.hour,
      minute: Math.floor(gameState.world.minute),
    },
  };

  gameState.log.push(entry);

  if (gameState.log.length > 100) {
    gameState.log.shift();
  }
}

function updateLogUI() {
  const logContainer = document.getElementById("game-log");
  if (!logContainer) return;

  const recentLogs = [...gameState.log].reverse().slice(0, 10);

  logContainer.innerHTML = recentLogs
    .map((entry) => {
      const hour = String(entry.time.hour).padStart(2, "0");
      const minute = String(entry.time.minute).padStart(2, "0");
      const timeStr = `Day ${entry.time.day} - ${hour}:${minute}`;

      return `<div class="log-entry ${entry.type}">
        <span class="log-time">[${timeStr}]</span> ${entry.message}
      </div>`;
    })
    .join("");
}
