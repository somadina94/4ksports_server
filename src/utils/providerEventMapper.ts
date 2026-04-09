import { EventStatus } from "../constants/enums.js";

type ProviderEvent = {
  id: number;
  api_id: number;
  league?: { id?: number; name?: string; country?: string };
  home_team?: string;
  away_team?: string;
  event_date: string;
  status: string;
  scores?: { home?: number; away?: number };
  odds_home?: number | null;
  odds_draw?: number | null;
  odds_away?: number | null;
  odds_over_15?: number | null;
  odds_over_25?: number | null;
  odds_over_35?: number | null;
  odds_under_15?: number | null;
  odds_under_25?: number | null;
  odds_under_35?: number | null;
  odds_btts_yes?: number | null;
  odds_btts_no?: number | null;
};

const normalizeStatus = (status: string): string => {
  const normalized = status.toLowerCase();
  if (normalized === "not_started") return EventStatus.NOT_STARTED;
  return normalized;
};

export const mapProviderEventToEventDocument = (providerEvent: ProviderEvent) => ({
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
  scores: {
    home: providerEvent.scores?.home ?? 0,
    away: providerEvent.scores?.away ?? 0,
  },
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
