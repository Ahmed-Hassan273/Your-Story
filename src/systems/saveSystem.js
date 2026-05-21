const SAVE_KEY = "your_story_save";
const AUTOSAVE_INTERVAL_MS = 5000;

let timeSinceLastSave = 0;

export function update(state, deltaMs) {
  timeSinceLastSave += deltaMs;

  if (timeSinceLastSave < AUTOSAVE_INTERVAL_MS) return;

  save(state);
  timeSinceLastSave = 0;
}

export function save(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function load() {
  const savedState = localStorage.getItem(SAVE_KEY);
  if (!savedState) return null;

  return JSON.parse(savedState);
}

export function applyLoadedState(targetState, loadedState) {
  if (!loadedState) return;

  Object.assign(targetState, loadedState);
}
