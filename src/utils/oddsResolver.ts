import { MarketType } from "../constants/enums.js";
import type { IEvent } from "../types/betting.js";

export const resolveSelectionOdds = (
  event: IEvent,
  marketType: string,
  pick: string,
  line?: number | null,
): number => {
  if (marketType === MarketType.MATCH_WINNER) {
    if (pick === "home") return event.odds.odds_home ?? 0;
    if (pick === "draw") return event.odds.odds_draw ?? 0;
    if (pick === "away") return event.odds.odds_away ?? 0;
  }

  if (marketType === MarketType.TOTAL_GOALS) {
    if (!line || ![1.5, 2.5, 3.5].includes(line)) return 0;
    if (pick === "over") return event.odds[`odds_over_${String(line).replace(".", "")}` as keyof IEvent["odds"]] ?? 0;
    if (pick === "under") return event.odds[`odds_under_${String(line).replace(".", "")}` as keyof IEvent["odds"]] ?? 0;
  }

  if (marketType === MarketType.BTTS) {
    if (pick === "yes") return event.odds.odds_btts_yes ?? 0;
    if (pick === "no") return event.odds.odds_btts_no ?? 0;
  }

  return 0;
};
