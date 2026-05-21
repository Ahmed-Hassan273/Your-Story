export function update(state) {
  const body = state.player.attributes.body;
  const heart = state.player.attributes.heart;

  state.player.derivedStats.physicalResistance = Math.floor(
    (body.strength + body.endurance) / 2
  );
  state.player.derivedStats.magicalResistance = heart.willpower;
}
