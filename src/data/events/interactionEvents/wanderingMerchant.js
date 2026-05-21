export const wanderingMerchantInteractionEvents = {
  wandering_merchant: {
    id: "wandering_merchant",
    type: "interaction",
    actorType: "npc",
    title: "Wandering Merchant",
    description:
      "A tired merchant leads a small mule through the village square. His eyes measure you before his words do.",
    tags: ["npc", "trade"],
    durationMinutes: 10,
    choices: [
      {
        id: "talk",
        label: "Talk",
        log: "You speak with the wandering merchant and hear rumors about the northern road.",
        effects: {
          focus: -1,
        },
      },
      {
        id: "walk_away",
        label: "Walk away",
        log: "You decide not to deal with the merchant for now.",
        effects: {},
      },
    ],
  },
};
