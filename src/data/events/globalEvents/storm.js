export const globalEvents = {
  early_storm: {
    id: "early_storm",
    type: "global",
    title: "Gathering Storm",
    description:
      "Dark clouds gather over the region. Roads become harder to cross, and some encounters become more dangerous.",
    startsAt: { day: 1, hour: 9, minute: 0 },
    endsAt: { day: 1, hour: 12, minute: 0 },
    tags: ["weather", "storm"],
    effects: {
      placeTagsAffected: ["road", "wilderness"],
      interactionTagsAffected: ["travel", "combat"],
    },
  },
};
