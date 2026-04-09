import Event from "../models/eventModel.js";
import { emitSocketEvent } from "../sockets/io.js";
import { buildProviderEventsUrl, fetchPaginatedProviderResults } from "../utils/providerPolling.js";
import { mapProviderEventToEventDocument } from "../utils/providerEventMapper.js";
const hasChanged = (incoming, existing) => {
    return (incoming.status !== existing.status ||
        incoming.eventDate.getTime() !== new Date(existing.eventDate).getTime() ||
        JSON.stringify(incoming.scores) !== JSON.stringify(existing.scores) ||
        JSON.stringify(incoming.odds) !== JSON.stringify(existing.odds));
};
export const syncUpcomingEvents = async () => {
    const url = buildProviderEventsUrl();
    const providerEvents = await fetchPaginatedProviderResults(url);
    for (const providerEvent of providerEvents) {
        const mapped = mapProviderEventToEventDocument(providerEvent);
        const existing = await Event.findOne({ providerId: mapped.providerId });
        if (!existing) {
            const created = await Event.create(mapped);
            emitSocketEvent("events:update", { eventId: created._id, action: "created" });
            continue;
        }
        if (!hasChanged(mapped, existing))
            continue;
        const oldOdds = existing.odds;
        existing.set(mapped);
        await existing.save();
        emitSocketEvent("events:update", { eventId: existing._id, action: "updated" });
        if (JSON.stringify(oldOdds) !== JSON.stringify(existing.odds)) {
            emitSocketEvent("odds:update", { eventId: existing._id, odds: existing.odds });
        }
    }
};
export const startEventPollingWorker = (intervalMs = 30_000) => {
    const run = async () => {
        try {
            await syncUpcomingEvents();
        }
        catch (error) {
            console.error("Event polling worker error:", error);
        }
    };
    run();
    return setInterval(run, intervalMs);
};
//# sourceMappingURL=eventPollingWorker.js.map