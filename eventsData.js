var eventDefinitions = {
  locationEvents: {
    unknown_village: {
      id: "unknown_village",
      type: "location",
      title: "Unknown Village",
      description:
        "A quiet village at the edge of old roads. Most people here live small lives, but the roads beyond it lead to stranger places.",
      tags: ["village", "safe", "starting_area"],
      possibleInteractions: ["village_notice", "wandering_merchant"],
    },
  },

  interactionEvents: {
    village_notice: {
      id: "village_notice",
      type: "interaction",
      title: "A Notice on the Board",
      description:
        "A worn notice asks for help gathering herbs near the eastern path. The pay is small, but it is honest work.",
      tags: ["quest", "low_risk"],
      durationMinutes: 15,
      choices: [
        {
          id: "accept",
          label: "Accept the task",
          log: "You accept a small herb-gathering task from the village board.",
          effects: {
            stamina: -1,
            focus: -1,
          },
        },
        {
          id: "ignore",
          label: "Ignore it",
          log: "You leave the notice untouched.",
          effects: {},
        },
      ],
    },

    wandering_merchant: {
      id: "wandering_merchant",
      type: "interaction",
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
  },
};
