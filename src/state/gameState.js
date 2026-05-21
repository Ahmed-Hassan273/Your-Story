var gameState = {
  _initialized: false,

  player: initialPlayerState,
  time: initialTimeState,
  world: initialWorldState,

  activeEvents: {
    globalEvents: [],
    placeEvent: null,
    interactionEvents: [],
  },

  eventQueue: [],
  eventHistory: [],
  log: [],
};

globalThis.gameState = gameState;
