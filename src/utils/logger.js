export function addLog(state, message, type = "system") {
  const entry = {
    message,
    type,
    time: {
      day: state.time.day,
      hour: state.time.hour,
      minute: Math.floor(state.time.minute),
    },
  };

  state.log.push(entry);

  if (state.log.length > 100) {
    state.log.shift();
  }
}
