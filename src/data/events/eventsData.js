import { globalEvents } from "./globalEvents/storm.js";
import { placeEvents } from "./placeEvents/unknownVillage.js";
import { villageNoticeInteractionEvents } from "./interactionEvents/villageNotice.js";
import { wanderingMerchantInteractionEvents } from "./interactionEvents/wanderingMerchant.js";

const interactionEvents = {
  ...villageNoticeInteractionEvents,
  ...wanderingMerchantInteractionEvents,
};

export const eventDefinitions = {
  globalEvents,
  placeEvents,
  interactionEvents,
};
