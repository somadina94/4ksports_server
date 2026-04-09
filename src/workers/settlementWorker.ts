import Event from "../models/eventModel.js";
import { EventStatus } from "../constants/enums.js";
import { settleEventSelections, settlePendingTickets } from "../services/settlementService.js";

export const runSettlementCycle = async () => {
  const finishedEvents = await Event.find({ status: EventStatus.FINISHED }).select("_id");
  for (const event of finishedEvents) {
    await settleEventSelections(event._id);
  }
  await settlePendingTickets();
};

export const startSettlementWorker = (intervalMs = 20_000): NodeJS.Timeout => {
  const run = async () => {
    try {
      await runSettlementCycle();
    } catch (error) {
      console.error("Settlement worker error:", error);
    }
  };
  run();
  return setInterval(run, intervalMs);
};
