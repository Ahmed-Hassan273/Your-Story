import { gameState } from "./src/state/gameState.js";
import { eventDefinitions } from "./src/data/events/eventsData.js";
import { addLog } from "./src/utils/logger.js";
import * as timeSystem from "./src/systems/timeSystem.js";
import * as eventSystem from "./src/systems/eventSystem.js";
import * as statsSystem from "./src/systems/statsSystem.js";
import * as navigationSystem from "./src/systems/navigationSystem.js";
import * as combatSystem from "./src/systems/combatSystem.js";
import * as saveSystem from "./src/systems/saveSystem.js";
import * as uiSystem from "./src/ui/uiSystem.js";

const tickRate = 1000 / 10;

let lastTime = 0;
let timer = 0;
let isRunning = false;

export const engine = {
  start,
};

function start() {
  if (isRunning) return;

  isRunning = true;
  lastTime = performance.now();

  initializeGame();
  bindInput();
  render();
  requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  timer += deltaTime;

  while (timer >= tickRate) {
    updateGameLogic(tickRate);
    timer -= tickRate;
  }

  render();
  requestAnimationFrame(gameLoop);
}

function updateGameLogic(deltaMs) {
  const gameMinutes = deltaMs / 1000;

  timeSystem.update(gameState, gameMinutes);
  eventSystem.update(gameState, eventDefinitions, gameMinutes, addLog);
  statsSystem.update(gameState);
  navigationSystem.update(gameState, eventDefinitions, addLog);
  combatSystem.update(gameState, eventDefinitions, addLog);
  saveSystem.update(gameState, deltaMs);
}

function initializeGame() {
  if (gameState._initialized) return;

  eventSystem.initialize(gameState, eventDefinitions, addLog);
  statsSystem.update(gameState);
  gameState._initialized = true;
}

function bindInput() {
  uiSystem.bindUIEvents((eventId, choiceId) => {
    eventSystem.processEventChoice(gameState, eventDefinitions, eventId, choiceId, addLog);
    render();
  });
}

function render() {
  uiSystem.update(gameState, {
    timeText: timeSystem.getTimeString(gameState),
    placeEvent: eventSystem.getCurrentPlaceEvent(gameState, eventDefinitions),
    globalEvents: eventSystem.getActiveGlobalEvents(gameState, eventDefinitions),
    interactionEvents: eventSystem.getActiveInteractionEvents(gameState, eventDefinitions),
  });
}
