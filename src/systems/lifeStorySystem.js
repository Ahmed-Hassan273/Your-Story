export function generateLifeSummary(state) {
  const keyEvents = state.eventHistory.slice(-10);
  const finalAge = getFinalAge(state);
  const cause = state.lifecycle.causeOfDeath || "unknown";

  return {
    title: `${state.player.name}'s Story`,
    finalAge,
    causeOfDeath: cause,
    survivedDays: state.time.day,
    keyEvents,
    statsOverview: {
      attributes: state.player.attributes,
      resources: state.player.resources,
      derivedStats: state.player.derivedStats,
    },
    narrative: buildNarrative(state, finalAge, cause, keyEvents),
  };
}

function getFinalAge(state) {
  return state.player.age + Math.floor((state.time.day - 1) / 365);
}

function buildNarrative(state, finalAge, cause, keyEvents) {
  const visitedPlaces = state.world.discoveredPlaces.length;
  const eventCount = state.eventHistory.length;

  return [
    `${state.player.name} began life as an unknown soul in a quiet village.`,
    `They lived for ${finalAge} years and survived ${state.time.day} days of recorded journey.`,
    `Their path touched ${visitedPlaces} known place${visitedPlaces === 1 ? "" : "s"} and ${eventCount} remembered event${eventCount === 1 ? "" : "s"}.`,
    keyEvents.length
      ? `Near the end, their story was shaped by ${keyEvents[keyEvents.length - 1].id}.`
      : "Their legend remained small, but still unfinished in spirit.",
    `Their life ended because of ${cause}.`,
  ].join(" ");
}
