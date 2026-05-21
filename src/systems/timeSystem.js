export function update(state, deltaMinutes) {
  const scaledMinutes = deltaMinutes * state.time.timeScale;
  advanceTime(state, scaledMinutes);
  return scaledMinutes;
}

export function advanceTime(state, minutes = 1) {
  state.time.minute += minutes;

  while (state.time.minute >= 60) {
    state.time.minute -= 60;
    state.time.hour += 1;
  }

  while (state.time.hour >= 24) {
    state.time.hour -= 24;
    state.time.day += 1;
  }
}

export function getTimeString(state) {
  const hour = String(state.time.hour).padStart(2, "0");
  const minute = String(Math.floor(state.time.minute)).padStart(2, "0");

  return `Day ${state.time.day} - ${hour}:${minute}`;
}

export function setTimeScale(state, timeScale) {
  state.time.timeScale = Math.max(0, timeScale);
}

export function pause(state) {
  setTimeScale(state, 0);
}

export function resume(state) {
  setTimeScale(state, 1);
}

export function fastForward(state, scale = 4) {
  setTimeScale(state, scale);
}
