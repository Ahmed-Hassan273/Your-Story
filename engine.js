import { gameState } from "./src/state/gameState.js";
import { eventDefinitions } from "./src/data/events/eventsData.js";
import { addLog } from "./src/utils/logger.js";
import * as timeSystem from "./src/systems/timeSystem.js";
import * as eventSystem from "./src/systems/eventSystem.js";
import * as statsSystem from "./src/systems/statsSystem.js";
import * as navigationSystem from "./src/systems/navigationSystem.js";
import * as combatSystem from "./src/systems/combatSystem.js";
import * as lifecycleSystem from "./src/systems/lifecycleSystem.js";
import * as lifeStorySystem from "./src/systems/lifeStorySystem.js";
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

  loadGame();
  initializeGame();
  bindInput();
  render();

  if (!gameState.lifecycle.isAlive) return;

  isRunning = true;
  lastTime = performance.now();

  requestAnimationFrame(gameLoop);
}

function gameLoop(currentTime) {
  if (!isRunning) return;

  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  timer += deltaTime;

  while (timer >= tickRate) {
    updateGameLogic(tickRate);
    timer -= tickRate;
  }

  render();

  if (!isRunning) return;

  requestAnimationFrame(gameLoop);
}

function updateGameLogic(deltaMs) {
  const baseGameMinutes = deltaMs / 1000;

  const scaledGameMinutes = timeSystem.update(gameState, baseGameMinutes);
  eventSystem.update(gameState, eventDefinitions, scaledGameMinutes, addLog);
  statsSystem.update(gameState);
  navigationSystem.update(gameState, eventDefinitions, addLog);
  combatSystem.update(gameState, eventDefinitions, addLog);
  handleLifecycle();
  saveSystem.update(gameState, deltaMs);
}

function initializeGame() {
  if (gameState._initialized) return;

  eventSystem.initialize(gameState, eventDefinitions, addLog);
  statsSystem.update(gameState);
  gameState._initialized = true;
}

function loadGame() {
  const loadedState = saveSystem.load();
  saveSystem.applyLoadedState(gameState, loadedState);
}

function bindInput() {
  uiSystem.bindUIEvents((eventId, choiceId) => {
    if (!gameState.lifecycle.isAlive) return;

    eventSystem.processEventChoice(gameState, eventDefinitions, eventId, choiceId, addLog);
    handleLifecycle();
    render();
  });
}

function handleLifecycle() {
  const result = lifecycleSystem.update(gameState);
  if (!result.died) return;

  gameState.lifecycle.lifeSummary = lifeStorySystem.generateLifeSummary(gameState);
  gameState.runHistory.push(gameState.lifecycle.lifeSummary);
  saveSystem.saveRunHistory(gameState.lifecycle.lifeSummary);
  saveSystem.save(gameState);
  isRunning = false;
}

function render() {
  uiSystem.update(gameState, {
    timeText: timeSystem.getTimeString(gameState),
    placeEvent: eventSystem.getCurrentPlaceEvent(gameState, eventDefinitions),
    globalEvents: eventSystem.getActiveGlobalEvents(gameState, eventDefinitions),
    interactionEvents: eventSystem.getActiveInteractionEvents(gameState, eventDefinitions),
  });
}
