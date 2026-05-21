export function randomChoice(items) {
  if (!items.length) return null;

  const index = Math.floor(Math.random() * items.length);
  return items[index];
}
