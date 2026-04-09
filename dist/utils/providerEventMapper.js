import { EventStatus } from "../constants/enums.js";
const normalizeStatus = (status) => {
    const normalized = status.toLowerCase().replace(/[-\s]+/g, "_");
    if (normalized === "not_started" || normalized === "notstarted")
        return EventStatus.NOT_STARTED;
    if (normalized === "live" || normalized === "in_play" || normalized === "inplay")
        return EventStatus.LIVE;
    // BSD (and similar feeds) use period codes instead of a single "live" string
    if (normalized === "1st_half" ||
        normalized === "2nd_half" ||
        normalized === "first_half" ||
        normalized === "second_half" ||
        normalized === "halftime" ||
        normalized === "half_time" ||
        normalized === "ht" ||
        normalized === "extra_time" ||
        normalized === "extra_time_1st_half" ||
        normalized === "extra_time_2nd_half" ||
        normalized === "penalties" ||
        normalized === "penalty_shootout") {
        return EventStatus.LIVE;
    }
    if (normalized === "finished" || normalized === "ft" || normalized === "full_time")
        return EventStatus.FINISHED;
    if (normalized === "cancelled" ||
        normalized === "canceled" ||
        normalized === "postponed" ||
        normalized === "abandoned")
        return EventStatus.CANCELLED;
    // Never pass through raw provider strings — schema only allows our enum values
    console.warn(`[providerEventMapper] Unknown event status "${status}" -> live`);
    return EventStatus.LIVE;
};
const asGoalCount = (value) => {
    if (value === null || value === undefined)
        return undefined;
    if (typeof value === "number" && Number.isFinite(value))
        return value;
    return undefined;
};
/** BSD `/api/events/` returns `home_score` / `away_score`, not `scores.home` / `scores.away`. */
const mapProviderScores = (e) => {
    const home = asGoalCount(e.home_score) ?? asGoalCount(e.scores?.home) ?? 0;
    const away = asGoalCount(e.away_score) ?? asGoalCount(e.scores?.away) ?? 0;
    return { home, away };
};
export const mapProviderEventToEventDocument = (providerEvent) => ({
    providerId: providerEvent.id,
    apiId: providerEvent.api_id,
    league: {
        ...(providerEvent.league?.id !== undefined ? { id: providerEvent.league.id } : {}),
        name: providerEvent.league?.name ?? "Unknown League",
        country: providerEvent.league?.country ?? "",
    },
    homeTeam: providerEvent.home_team ?? "Unknown Home",
    awayTeam: providerEvent.away_team ?? "Unknown Away",
    eventDate: new Date(providerEvent.event_date),
    status: normalizeStatus(providerEvent.status),
    scores: mapProviderScores(providerEvent),
    odds: {
        odds_home: providerEvent.odds_home ?? null,
        odds_draw: providerEvent.odds_draw ?? null,
        odds_away: providerEvent.odds_away ?? null,
        odds_over_15: providerEvent.odds_over_15 ?? null,
        odds_over_25: providerEvent.odds_over_25 ?? null,
        odds_over_35: providerEvent.odds_over_35 ?? null,
        odds_under_15: providerEvent.odds_under_15 ?? null,
        odds_under_25: providerEvent.odds_under_25 ?? null,
        odds_under_35: providerEvent.odds_under_35 ?? null,
        odds_btts_yes: providerEvent.odds_btts_yes ?? null,
        odds_btts_no: providerEvent.odds_btts_no ?? null,
    },
    lastSyncedAt: new Date(),
});
//# sourceMappingURL=providerEventMapper.js.map