import { MarketType, SelectionStatus } from "../constants/enums.js";

type MatchScore = { home: number; away: number };

export const settleSelection = (
  marketType: string,
  pick: string,
  line: number | null | undefined,
  score: MatchScore,
): { status: string; reason: string } => {
  const totalGoals = score.home + score.away;

  if (marketType === MarketType.MATCH_WINNER) {
    if (score.home > score.away) {
      return {
        status: pick === "home" ? SelectionStatus.WON : SelectionStatus.LOST,
        reason: "Match winner settled",
      };
    }
    if (score.home < score.away) {
      return {
        status: pick === "away" ? SelectionStatus.WON : SelectionStatus.LOST,
        reason: "Match winner settled",
      };
    }
    return {
      status: pick === "draw" ? SelectionStatus.WON : SelectionStatus.LOST,
      reason: "Match winner settled",
    };
  }

  if (marketType === MarketType.TOTAL_GOALS) {
    if (!line) return { status: SelectionStatus.VOID, reason: "Missing goal line" };
    if (pick === "over") {
      return {
        status: totalGoals > line ? SelectionStatus.WON : SelectionStatus.LOST,
        reason: "Total goals settled",
      };
    }
    if (pick === "under") {
      return {
        status: totalGoals < line ? SelectionStatus.WON : SelectionStatus.LOST,
        reason: "Total goals settled",
      };
    }
  }

  if (marketType === MarketType.BTTS) {
    const bothScored = score.home > 0 && score.away > 0;
    if (pick === "yes") {
      return {
        status: bothScored ? SelectionStatus.WON : SelectionStatus.LOST,
        reason: "BTTS settled",
      };
    }
    if (pick === "no") {
      return {
        status: !bothScored ? SelectionStatus.WON : SelectionStatus.LOST,
        reason: "BTTS settled",
      };
    }
  }

  return { status: SelectionStatus.VOID, reason: "Unsupported market/pick" };
};
