export function update(state, deltaMinutes) {
  advanceTime(state, deltaMinutes);
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
