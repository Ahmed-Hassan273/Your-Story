export const villageNoticeInteractionEvents = {
  village_notice: {
    id: "village_notice",
    type: "interaction",
    actorType: "npc",
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
};
