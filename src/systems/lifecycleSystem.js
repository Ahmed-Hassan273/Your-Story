const MAX_AGE = 100;
const DAYS_PER_YEAR = 365;

export function update(state) {
  if (!state.lifecycle.isAlive) {
    return { died: false };
  }

  const causeOfDeath = getCauseOfDeath(state);
  if (!causeOfDeath) {
    return { died: false };
  }

  state.lifecycle.isAlive = false;
  state.lifecycle.causeOfDeath = causeOfDeath;
  state.lifecycle.diedAt = {
    day: state.time.day,
    hour: state.time.hour,
    minute: Math.floor(state.time.minute),
  };

  return { died: true, causeOfDeath };
}

function getCauseOfDeath(state) {
  if (state.player.resources.health <= 0) {
    return "health";
  }

  const ageByTime = state.player.age + Math.floor((state.time.day - 1) / DAYS_PER_YEAR);
  if (ageByTime >= MAX_AGE) {
    return "age";
  }

  return null;
}
