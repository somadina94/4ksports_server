import Event from "../models/eventModel.js";
import { EventStatus } from "../constants/enums.js";
import { emitSocketEvent } from "../sockets/io.js";
import { buildProviderEventsUrl, fetchPaginatedProviderResults } from "../utils/providerPolling.js";
import { mapProviderEventToEventDocument } from "../utils/providerEventMapper.js";

const hasChanged = (incoming: any, existing: any): boolean => {
  return (
    incoming.status !== existing.status ||
    incoming.eventDate.getTime() !== new Date(existing.eventDate).getTime() ||
    JSON.stringify(incoming.scores) !== JSON.stringify(existing.scores) ||
    JSON.stringify(incoming.odds) !== JSON.stringify(existing.odds)
  );
};

export const syncUpcomingEvents = async (): Promise<void> => {
  const url = buildProviderEventsUrl();
  const providerEvents = await fetchPaginatedProviderResults<any>(url);

  for (const providerEvent of providerEvents) {
    const mapped: any = mapProviderEventToEventDocument(providerEvent);
    const existing = await Event.findOne({ providerId: mapped.providerId });

    if (existing) {
      if (!hasChanged(mapped, existing)) continue;
      const oldOdds = existing.odds;
      existing.set(mapped);
      await existing.save();
      emitSocketEvent("events:update", { eventId: existing._id, action: "updated" });
      if (JSON.stringify(oldOdds) !== JSON.stringify(existing.odds)) {
        emitSocketEvent("odds:update", { eventId: existing._id, odds: existing.odds });
      }
      continue;
    }

    if (mapped.status !== EventStatus.NOT_STARTED) continue;

    const created: any = await Event.create(mapped);
    emitSocketEvent("events:update", { eventId: created._id, action: "created" });
  }
};

export const startEventPollingWorker = (intervalMs = 30_000): NodeJS.Timeout => {
  const run = async () => {
    try {
      await syncUpcomingEvents();
    } catch (error) {
      console.error("Event polling worker error:", error);
    }
  };
  run();
  return setInterval(run, intervalMs);
};
