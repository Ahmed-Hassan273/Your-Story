import { clamp } from "../utils/math.js";

export function initialize(state, eventDefinitions, addLog) {
  initializePlaceEvent(state, eventDefinitions);
  addLog(state, "Your journey begins in an unknown village.", "event");
  addLog(state, "You are eighteen years old. Your life is still unwritten.", "system");
}

export function update(state, eventDefinitions, deltaMinutes, addLog) {
  initializePlaceEvent(state, eventDefinitions);
  updateGlobalEvents(state, eventDefinitions);
  updateInteractionEvents(state, eventDefinitions, deltaMinutes, addLog);
  maybeStartPlaceInteraction(state, eventDefinitions, addLog);
}

export function getCurrentPlaceEvent(state, eventDefinitions) {
  const eventId = state.activeEvents.placeEvent;
  if (!eventId) return null;

  return eventDefinitions.placeEvents[eventId] || null;
}

export function getActiveGlobalEvents(state, eventDefinitions) {
  return state.activeEvents.globalEvents
    .map((eventId) => eventDefinitions.globalEvents[eventId])
    .filter(Boolean);
}

export function getActiveInteractionEvents(state, eventDefinitions) {
  return state.activeEvents.interactionEvents
    .map((eventInstance) => ({
      ...eventInstance,
      definition: eventDefinitions.interactionEvents[eventInstance.id],
    }))
    .filter((eventInstance) => eventInstance.definition);
}

export function processEventChoice(state, eventDefinitions, eventId, choiceId, addLog) {
  const definition = eventDefinitions.interactionEvents[eventId];
  if (!definition) return;

  const choice = definition.choices.find((item) => item.id === choiceId);
  if (!choice) return;

  applyEventEffects(state, choice.effects);
  addLog(state, choice.log, "choice");
  finishInteractionEvent(state, eventId, `choice:${choiceId}`);
}

function initializePlaceEvent(state, eventDefinitions) {
  const placeId = state.world.currentPlace;
  const placeEvent = eventDefinitions.placeEvents[placeId];

  if (!placeEvent) {
    state.activeEvents.placeEvent = null;
    return;
  }

  state.activeEvents.placeEvent = placeEvent.id;
}

function createInteractionEvent(state, eventDefinitions, eventId, source = "system") {
  const definition = eventDefinitions.interactionEvents[eventId];
  if (!definition) return null;
  if (!eventMeetsConditions(state, definition)) return null;

  return {
    id: definition.id,
    source,
    startedAt: {
      day: state.time.day,
      hour: state.time.hour,
      minute: Math.floor(state.time.minute),
    },
    remainingMinutes: definition.durationMinutes || 0,
  };
}

function startInteractionEvent(state, eventDefinitions, eventId, source, addLog) {
  const alreadyActive = state.activeEvents.interactionEvents.some(
    (eventInstance) => eventInstance.id === eventId
  );
  if (alreadyActive) return;

  const eventInstance = createInteractionEvent(state, eventDefinitions, eventId, source);
  if (!eventInstance) return;

  state.activeEvents.interactionEvents.push(eventInstance);
  addLog(state, `Event started: ${eventDefinitions.interactionEvents[eventId].title}`, "event");
}

function finishInteractionEvent(state, eventId, reason = "finished") {
  const index = state.activeEvents.interactionEvents.findIndex(
    (eventInstance) => eventInstance.id === eventId
  );
  if (index === -1) return;

  const [eventInstance] = state.activeEvents.interactionEvents.splice(index, 1);
  state.eventHistory.push({
    id: eventInstance.id,
    type: "interaction",
    reason,
    endedAt: {
      day: state.time.day,
      hour: state.time.hour,
      minute: Math.floor(state.time.minute),
    },
  });
}

function applyEventEffects(state, effects = {}) {
  const resourceEffects = effects.resources || effects;

  for (const [resourceName, value] of Object.entries(resourceEffects)) {
    if (!(resourceName in state.player.resources)) continue;

    state.player.resources[resourceName] = clamp(
      state.player.resources[resourceName] + value,
      0,
      100
    );
  }
}

function updateGlobalEvents(state, eventDefinitions) {
  const currentMinutes = getTotalGameMinutes(state.time);

  state.activeEvents.globalEvents = Object.values(eventDefinitions.globalEvents)
    .filter((event) => {
      const startsAt = getTotalGameMinutes(event.startsAt);
      const endsAt = getTotalGameMinutes(event.endsAt);
      return currentMinutes >= startsAt && currentMinutes < endsAt;
    })
    .map((event) => event.id);
}

function updateInteractionEvents(state, eventDefinitions, deltaMinutes, addLog) {
  if (deltaMinutes <= 0) return;

  for (const eventInstance of state.activeEvents.interactionEvents) {
    eventInstance.remainingMinutes -= deltaMinutes;
  }

  const expiredEvents = state.activeEvents.interactionEvents.filter(
    (eventInstance) => eventInstance.remainingMinutes <= 0
  );

  for (const eventInstance of expiredEvents) {
    addLog(state, `Event ended: ${eventDefinitions.interactionEvents[eventInstance.id].title}`, "event");
    finishInteractionEvent(state, eventInstance.id, "expired");
  }
}

function maybeStartPlaceInteraction(state, eventDefinitions, addLog) {
  const placeEvent = getCurrentPlaceEvent(state, eventDefinitions);
  if (!placeEvent) return;

  const hasInteraction = state.activeEvents.interactionEvents.length > 0;
  const shouldStart = state.eventHistory.length === 0 && !hasInteraction;
  if (!shouldStart) return;

  const firstInteraction = placeEvent.possibleInteractions.find((eventId) =>
    eventMeetsConditions(state, eventDefinitions.interactionEvents[eventId])
  );
  if (!firstInteraction) return;

  startInteractionEvent(state, eventDefinitions, firstInteraction, "place", addLog);
}

function getTotalGameMinutes(time) {
  return (time.day - 1) * 24 * 60 + time.hour * 60 + Math.floor(time.minute);
}

function eventMeetsConditions(state, eventDefinition) {
  if (!eventDefinition) return false;
  if (!eventDefinition.conditions) return true;

  const conditions = eventDefinition.conditions;

  if (conditions.place && state.world.currentPlace !== conditions.place) {
    return false;
  }

  if (conditions.minAge && state.player.age < conditions.minAge) {
    return false;
  }

  if (conditions.maxAge && state.player.age > conditions.maxAge) {
    return false;
  }

  return true;
}
