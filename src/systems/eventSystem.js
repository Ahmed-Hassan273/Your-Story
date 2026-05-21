function initializePlaceEvent() {
  const placeId = gameState.world.currentPlace;
  const placeEvent = eventDefinitions.placeEvents[placeId];

  if (!placeEvent) {
    gameState.activeEvents.placeEvent = null;
    return;
  }

  gameState.activeEvents.placeEvent = placeEvent.id;
}

function getCurrentPlaceEvent() {
  const eventId = gameState.activeEvents.placeEvent;
  if (!eventId) return null;

  return eventDefinitions.placeEvents[eventId] || null;
}

function getActiveGlobalEvents() {
  return gameState.activeEvents.globalEvents
    .map((eventId) => eventDefinitions.globalEvents[eventId])
    .filter(Boolean);
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
      day: gameState.time.day,
      hour: gameState.time.hour,
      minute: Math.floor(gameState.time.minute),
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
    type: "interaction",
    reason,
    endedAt: {
      day: gameState.time.day,
      hour: gameState.time.hour,
      minute: Math.floor(gameState.time.minute),
    },
  });
}

function applyEventEffects(effects = {}) {
  for (const [resourceName, value] of Object.entries(effects)) {
    if (!(resourceName in gameState.player.resources)) continue;

    gameState.player.resources[resourceName] = clamp(
      gameState.player.resources[resourceName] + value,
      0,
      100
    );
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
  initializePlaceEvent();
  updateGlobalEvents();
  updateInteractionEvents(deltaMinutes);
  maybeStartPlaceInteraction();
}

function updateGlobalEvents() {
  const currentMinutes = getTotalGameMinutes();

  gameState.activeEvents.globalEvents = Object.values(eventDefinitions.globalEvents)
    .filter((event) => {
      const startsAt = getTotalGameMinutes(event.startsAt);
      const endsAt = getTotalGameMinutes(event.endsAt);
      return currentMinutes >= startsAt && currentMinutes < endsAt;
    })
    .map((event) => event.id);
}

function updateInteractionEvents(deltaMinutes) {
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
}

function maybeStartPlaceInteraction() {
  const placeEvent = getCurrentPlaceEvent();
  if (!placeEvent) return;

  const hasInteraction = gameState.activeEvents.interactionEvents.length > 0;
  const shouldStart = gameState.eventHistory.length === 0 && !hasInteraction;
  if (!shouldStart) return;

  const firstInteraction = placeEvent.possibleInteractions[0];
  startInteractionEvent(firstInteraction, "place");
}
