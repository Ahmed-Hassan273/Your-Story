import { initialPlayerState } from "./playerState.js";
import { initialTimeState } from "./timeState.js";
import { initialWorldState } from "./worldState.js";

export const gameState = {
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
