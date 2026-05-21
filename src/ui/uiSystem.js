let lastPlaceSignature = "";
let lastInteractionSignature = "";
let lastPlayerSignature = "";
let lastGlobalSignature = "";

export function bindUIEvents(onChoiceSelected) {
  document.addEventListener("click", (event) => {
    const choiceButton = event.target.closest("[data-event-id][data-choice-id]");
    if (!choiceButton) return;

    onChoiceSelected(choiceButton.dataset.eventId, choiceButton.dataset.choiceId);
  });
}

export function update(state, viewModel) {
  updateTimeUI(viewModel.timeText);
  updateGlobalUI(state);
  updatePlaceUI(viewModel.placeEvent, viewModel.globalEvents);
  updateInteractionUI(viewModel.interactionEvents, viewModel.timeText);
  updatePlayerUI(state);
  updateLifeSummaryUI(state);
  updateLogUI(state);
}

function updateTimeUI(timeText) {
  const timeDisplay = document.getElementById("time-display");
  if (!timeDisplay) return;

  timeDisplay.innerText = timeText;
}

function updateLogUI(state) {
  const logContainer = document.getElementById("game-log");
  if (!logContainer) return;

  const recentLogs = [...state.log].reverse().slice(0, 10);

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

function updatePlaceUI(placeEvent, globalEvents) {
  const placePanel = document.getElementById("location-panel");
  if (!placePanel) return;

  const globalSignature = globalEvents.map((event) => event.id).join("|");
  const signature = `${placeEvent ? placeEvent.id : "none"}:${globalSignature}`;
  if (signature === lastPlaceSignature) return;

  lastPlaceSignature = signature;

  if (!placeEvent) {
    placePanel.innerHTML = "";
    return;
  }

  const globalEventsHtml = globalEvents
    .map((event) => `<p><strong>${event.title}</strong>: ${event.description}</p>`)
    .join("");

  placePanel.innerHTML = `
    <h2>${placeEvent.title}</h2>
    <p>${placeEvent.description}</p>
    ${globalEventsHtml}
  `;
}

function updateInteractionUI(interactionEvents, timeText) {
  const interactionPanel = document.getElementById("interaction-panel");
  if (!interactionPanel) return;

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
    <div id="time-display">${timeText}</div>
    ${eventHtml}
  `;
}

function updatePlayerUI(state) {
  const playerPanel = document.getElementById("player-panel");
  if (!playerPanel) return;

  const resources = state.player.resources;
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

function updateGlobalUI(state) {
  const signature = state.activeEvents.globalEvents.join("|");
  if (signature === lastGlobalSignature) return;

  lastGlobalSignature = signature;
  lastPlaceSignature = "";
}

function updateLifeSummaryUI(state) {
  if (state.lifecycle.isAlive || !state.lifecycle.lifeSummary) return;

  const interactionPanel = document.getElementById("interaction-panel");
  if (!interactionPanel) return;

  interactionPanel.innerHTML = `
    <div id="time-display">${interactionPanel.querySelector("#time-display")?.innerText || ""}</div>
    <section class="life-summary">
      <h2>${state.lifecycle.lifeSummary.title}</h2>
      <p>${state.lifecycle.lifeSummary.narrative}</p>
    </section>
  `;
}
