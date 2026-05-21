function getCurrentPlaceId() {
  return gameState.world.currentPlace;
}

function travelToPlace(placeId) {
  if (!eventDefinitions.placeEvents[placeId]) return false;

  gameState.world.currentPlace = placeId;
  gameState.activeEvents.placeEvent = null;
  gameState.activeEvents.interactionEvents = [];

  if (!gameState.world.discoveredPlaces.includes(placeId)) {
    gameState.world.discoveredPlaces.push(placeId);
  }

  addLog(`You travel to ${eventDefinitions.placeEvents[placeId].title}.`, "travel");
  return true;
}
