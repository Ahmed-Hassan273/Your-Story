let lastPlaceSignature = "";
let lastInteractionSignature = "";
let lastPlayerSignature = "";
let lastGlobalSignature = "";

function updateTimeUI() {
  const timeDisplay = document.getElementById("time-display");
  if (!timeDisplay) return;

  timeDisplay.innerText = getTimeString();
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

function updatePlaceUI() {
  const placePanel = document.getElementById("location-panel");
  if (!placePanel) return;

  const placeEvent = getCurrentPlaceEvent();
  const globalSignature = getActiveGlobalEvents().map((event) => event.id).join("|");
  const signature = `${placeEvent ? placeEvent.id : "none"}:${globalSignature}`;
  if (signature === lastPlaceSignature) return;

  lastPlaceSignature = signature;

  if (!placeEvent) {
    placePanel.innerHTML = "";
    return;
  }

  const globalEventsHtml = getActiveGlobalEvents()
    .map((event) => `<p><strong>${event.title}</strong>: ${event.description}</p>`)
    .join("");

  placePanel.innerHTML = `
    <h2>${placeEvent.title}</h2>
    <p>${placeEvent.description}</p>
    ${globalEventsHtml}
  `;
}

function updateInteractionUI() {
  const interactionPanel = document.getElementById("interaction-panel");
  if (!interactionPanel) return;

  const interactionEvents = getActiveInteractionEvents();
  const signature = interactionEvents.map((eventInstance) => eventInstance.id).join("|");
  if (signature === lastInteractionSignature) return;

  lastInteractionSignature = signature;

  const eventHtml = interactionEvents
    .map((eventInstance) => {
      const event = eventInstance.definition;
      const choices = event.choices
        .map(
          (choice) =>
            `<button data-event-id="${event.id}" data-choice-id="${choice.id}">${choice.label}</button>`
        )
        .join("");

      return `
        <section class="interaction-event">
          <h2>${event.title}</h2>
          <p>${event.description}</p>
          <div class="choice-list">${choices}</div>
        </section>
      `;
    })
    .join("");

  interactionPanel.innerHTML = `
    <div id="time-display">${getTimeString()}</div>
    ${eventHtml}
  `;
}

function updatePlayerUI() {
  const playerPanel = document.getElementById("player-panel");
  if (!playerPanel) return;

  const resources = gameState.player.resources;
  const signature = JSON.stringify(resources);
  if (signature === lastPlayerSignature) return;

  lastPlayerSignature = signature;

  playerPanel.innerHTML = `
    <span>Health: ${resources.health}</span>
    <span>Stamina: ${resources.stamina}</span>
    <span>Hunger: ${resources.hunger}</span>
    <span>Focus: ${resources.focus}</span>
    <span>Aether: ${resources.aether}</span>
  `;
}

function updateGlobalUI() {
  const signature = gameState.activeEvents.globalEvents.join("|");
  if (signature === lastGlobalSignature) return;

  lastGlobalSignature = signature;
  updatePlaceUI();
}

function updateAllUI() {
  updateTimeUI();
  updateGlobalUI();
  updatePlaceUI();
  updateInteractionUI();
  updatePlayerUI();
  updateLogUI();
}

document.addEventListener("click", (event) => {
  const choiceButton = event.target.closest("[data-event-id][data-choice-id]");
  if (!choiceButton) return;

  processEventChoice(choiceButton.dataset.eventId, choiceButton.dataset.choiceId);
  updateAllUI();
});

function uiLoop() {
  updateAllUI();
  requestAnimationFrame(uiLoop);
}

requestAnimationFrame(uiLoop);
