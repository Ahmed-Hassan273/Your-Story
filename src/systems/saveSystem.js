const SAVE_KEY = "your_story_save";
const RUN_HISTORY_KEY = "your_story_run_history";
const AUTOSAVE_INTERVAL_MS = 5000;

let timeSinceLastSave = 0;

export function update(state, deltaMs) {
  timeSinceLastSave += deltaMs;

  if (timeSinceLastSave < AUTOSAVE_INTERVAL_MS) return;

  save(state);
  timeSinceLastSave = 0;
}

export function save(state) {
  if (!isStorageAvailable()) return;

  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function load() {
  if (!isStorageAvailable()) return null;

  const savedState = localStorage.getItem(SAVE_KEY);
  if (!savedState) return null;

  return JSON.parse(savedState);
}

export function applyLoadedState(targetState, loadedState) {
  if (!loadedState) return;

  mergeState(targetState, loadedState);
}

export function saveRunHistory(runSummary) {
  if (!isStorageAvailable()) return;

  const runHistory = loadRunHistory();
  runHistory.push(runSummary);
  localStorage.setItem(RUN_HISTORY_KEY, JSON.stringify(runHistory));
}

export function loadRunHistory() {
  if (!isStorageAvailable()) return [];

  const savedHistory = localStorage.getItem(RUN_HISTORY_KEY);
  if (!savedHistory) return [];

  return JSON.parse(savedHistory);
}

function isStorageAvailable() {
  return typeof localStorage !== "undefined";
}

function mergeState(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key])) {
      mergeState(target[key], value);
    } else {
      target[key] = value;
    }
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
