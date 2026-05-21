export const initialPlayerState = {
  name: "Unknown",
  age: 18,

  attributes: {
    body: { strength: 5, agility: 5, endurance: 5 },
    mind: { thinkingInt: 5, practicalInt: 5, socialInt: 5 },
    heart: { willpower: 5 },
  },

  resources: {
    health: 10,
    stamina: 10,
    hunger: 100,
    focus: 100,
    aether: 10,
  },

  statuses: [],
  derivedStats: { physicalResistance: 0, magicalResistance: 0 },
  skills: [],
  traits: [],
  abilities: [],
};
