function updateDerivedStats() {
  const body = gameState.player.attributes.body;
  const heart = gameState.player.attributes.heart;

  gameState.player.derivedStats.physicalResistance = Math.floor(
    (body.strength + body.endurance) / 2
  );
  gameState.player.derivedStats.magicalResistance = heart.willpower;
}
