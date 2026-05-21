let lastLocationSignature = "";
let lastInteractionSignature = "";
let lastPlayerSignature = "";

function updateTimeUI() {
  const timeDisplay = document.getElementById("time-display");
  if (!timeDisplay) return;

  timeDisplay.innerText = getTimeString();
}

function updateLocationUI() {
  const locationPanel = document.getElementById("location-panel");
  if (!locationPanel) return;

  const locationEvent = getCurrentLocationEvent();
  const signature = locationEvent ? locationEvent.id : "none";
  if (signature === lastLocationSignature) return;

  lastLocationSignature = signature;

  if (!locationEvent) {
    locationPanel.innerHTML = "";
    return;
  }

  locationPanel.innerHTML = `
    <h2>${locationEvent.title}</h2>
    <p>${locationEvent.description}</p>
  `;
}

function updateInteractionUI() {
  const interactionPanel = document.getElementById("interaction-panel");
  if (!interactionPanel) return;

  const interactionEvents = getActiveInteractionEvents();
  const signature = interactionEvents
    .map((eventInstance) => eventInstance.id)
    .join("|");
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

function updateAllUI() {
  updateTimeUI();
  updateLocationUI();
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
