export function update() {}

export function getCurrentPlaceId(state) {
  return state.world.currentPlace;
}

export function travelToPlace(state, eventDefinitions, placeId, addLog) {
  if (!eventDefinitions.placeEvents[placeId]) return false;

  state.world.currentPlace = placeId;
  state.activeEvents.placeEvent = null;
  state.activeEvents.interactionEvents = [];

  if (!state.world.discoveredPlaces.includes(placeId)) {
    state.world.discoveredPlaces.push(placeId);
  }

  addLog(state, `You travel to ${eventDefinitions.placeEvents[placeId].title}.`, "travel");
  return true;
}
