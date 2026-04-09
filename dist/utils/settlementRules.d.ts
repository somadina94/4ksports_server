type MatchScore = {
    home: number;
    away: number;
};
export declare const settleSelection: (marketType: string, pick: string, line: number | null | undefined, score: MatchScore) => {
    status: string;
    reason: string;
};
export {};
//# sourceMappingURL=settlementRules.d.ts.map