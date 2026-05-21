function initializeLocationEvent() {
  const locationId = gameState.world.location;
  const locationEvent = eventDefinitions.locationEvents[locationId];

  if (!locationEvent) {
    gameState.activeEvents.locationEvent = null;
    return;
  }

  gameState.activeEvents.locationEvent = locationEvent.id;
}

function getCurrentLocationEvent() {
  const eventId = gameState.activeEvents.locationEvent;
  if (!eventId) return null;

  return eventDefinitions.locationEvents[eventId] || null;
}

function getActiveInteractionEvents() {
  return gameState.activeEvents.interactionEvents
    .map((eventInstance) => ({
      ...eventInstance,
      definition: eventDefinitions.interactionEvents[eventInstance.id],
    }))
    .filter((eventInstance) => eventInstance.definition);
}

function createInteractionEvent(eventId, source = "system") {
  const definition = eventDefinitions.interactionEvents[eventId];
  if (!definition) return null;

  return {
    id: definition.id,
    source,
    startedAt: {
      day: gameState.world.day,
      hour: gameState.world.hour,
      minute: Math.floor(gameState.world.minute),
    },
    remainingMinutes: definition.durationMinutes || 0,
  };
}

function startInteractionEvent(eventId, source = "system") {
  const alreadyActive = gameState.activeEvents.interactionEvents.some(
    (eventInstance) => eventInstance.id === eventId
  );
  if (alreadyActive) return;

  const eventInstance = createInteractionEvent(eventId, source);
  if (!eventInstance) return;

  gameState.activeEvents.interactionEvents.push(eventInstance);
  addLog(`Event started: ${eventDefinitions.interactionEvents[eventId].title}`, "event");
}

function finishInteractionEvent(eventId, reason = "finished") {
  const index = gameState.activeEvents.interactionEvents.findIndex(
    (eventInstance) => eventInstance.id === eventId
  );
  if (index === -1) return;

  const [eventInstance] = gameState.activeEvents.interactionEvents.splice(index, 1);
  gameState.eventHistory.push({
    id: eventInstance.id,
    reason,
    endedAt: {
      day: gameState.world.day,
      hour: gameState.world.hour,
      minute: Math.floor(gameState.world.minute),
    },
  });
}

function applyEventEffects(effects = {}) {
  for (const [resourceName, value] of Object.entries(effects)) {
    if (!(resourceName in gameState.player.resources)) continue;

    gameState.player.resources[resourceName] += value;
  }
}

function processEventChoice(eventId, choiceId) {
  const definition = eventDefinitions.interactionEvents[eventId];
  if (!definition) return;

  const choice = definition.choices.find((item) => item.id === choiceId);
  if (!choice) return;

  applyEventEffects(choice.effects);
  addLog(choice.log, "choice");
  finishInteractionEvent(eventId, `choice:${choiceId}`);
}

function updateEventSystem(deltaMinutes) {
  initializeLocationEvent();

  for (const eventInstance of gameState.activeEvents.interactionEvents) {
    eventInstance.remainingMinutes -= deltaMinutes;
  }

  const expiredEvents = gameState.activeEvents.interactionEvents.filter(
    (eventInstance) => eventInstance.remainingMinutes <= 0
  );

  for (const eventInstance of expiredEvents) {
    addLog(`Event ended: ${eventDefinitions.interactionEvents[eventInstance.id].title}`, "event");
    finishInteractionEvent(eventInstance.id, "expired");
  }

  maybeStartLocationInteraction();
}

function maybeStartLocationInteraction() {
  const locationEvent = getCurrentLocationEvent();
  if (!locationEvent) return;

  const hasInteraction = gameState.activeEvents.interactionEvents.length > 0;
  const shouldStart = gameState.eventHistory.length === 0 && !hasInteraction;
  if (!shouldStart) return;

  const firstInteraction = locationEvent.possibleInteractions[0];
  startInteractionEvent(firstInteraction, "location");
}
