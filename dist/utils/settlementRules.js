import { MarketType, SelectionStatus } from "../constants/enums.js";
export const settleSelection = (marketType, pick, line, score) => {
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
        if (!line)
            return { status: SelectionStatus.VOID, reason: "Missing goal line" };
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
//# sourceMappingURL=settlementRules.js.map