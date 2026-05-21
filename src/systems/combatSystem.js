export function update() {}

export function queueCombatEvent(state, enemyEventId) {
  state.eventQueue.push({
    type: "combat",
    eventId: enemyEventId,
  });
}
