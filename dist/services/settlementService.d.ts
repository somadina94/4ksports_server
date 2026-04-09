import mongoose from "mongoose";
export declare const computeTicketOutcome: (selections: {
    status: string;
    odds: number;
}[], stake: number) => {
    status: "lost";
    payout: number;
    wonCount: number;
    lostCount: number;
    voidCount: number;
} | {
    status: "refunded";
    payout: number;
    wonCount: number;
    lostCount: number;
    voidCount: number;
} | {
    status: "won";
    payout: number;
    wonCount: number;
    lostCount: number;
    voidCount: number;
};
export declare const settleEventSelections: (eventId: mongoose.Types.ObjectId) => Promise<void>;
export declare const settlePendingTickets: () => Promise<void>;
//# sourceMappingURL=settlementService.d.ts.map