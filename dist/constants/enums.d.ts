export declare const EventStatus: {
    readonly NOT_STARTED: "notstarted";
    readonly LIVE: "live";
    readonly FINISHED: "finished";
    readonly CANCELLED: "cancelled";
};
export declare const TicketType: {
    readonly SINGLE: "single";
    readonly ACCUMULATOR: "accumulator";
};
export declare const TicketStatus: {
    readonly PENDING: "pending";
    readonly WON: "won";
    readonly LOST: "lost";
    readonly VOID: "void";
    readonly REFUNDED: "refunded";
    readonly CASHED_OUT: "cashed_out";
};
export declare const SelectionStatus: {
    readonly PENDING: "pending";
    readonly WON: "won";
    readonly LOST: "lost";
    readonly VOID: "void";
};
export declare const MarketType: {
    readonly MATCH_WINNER: "match_winner";
    readonly TOTAL_GOALS: "total_goals";
    readonly BTTS: "btts";
};
export declare const Currency: {
    readonly USDT: "USDT";
};
export declare const DepositRequestStatus: {
    readonly PENDING: "pending";
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
};
export declare const WithdrawalRequestStatus: {
    readonly PENDING: "pending";
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
};
export declare const BalanceTransactionType: {
    readonly DEPOSIT_CREDIT: "deposit_credit";
    readonly FIRST_DEPOSIT_BONUS: "first_deposit_bonus";
    readonly BET_DEBIT: "bet_debit";
    readonly BET_PAYOUT: "bet_payout";
    readonly BET_REFUND: "bet_refund";
    readonly SETTLEMENT_ADJUSTMENT_CREDIT: "settlement_adjustment_credit";
    readonly SETTLEMENT_ADJUSTMENT_DEBIT: "settlement_adjustment_debit";
    readonly WITHDRAWAL_DEBIT: "withdrawal_debit";
};
export declare const Network: {
    readonly TRC20: "TRC20";
    readonly ERC20: "ERC20";
    readonly BEP20: "BEP20";
};
export type EventStatusType = (typeof EventStatus)[keyof typeof EventStatus];
export type TicketTypeType = (typeof TicketType)[keyof typeof TicketType];
export type TicketStatusType = (typeof TicketStatus)[keyof typeof TicketStatus];
export type SelectionStatusType = (typeof SelectionStatus)[keyof typeof SelectionStatus];
export type MarketTypeType = (typeof MarketType)[keyof typeof MarketType];
export type CurrencyType = (typeof Currency)[keyof typeof Currency];
export type DepositRequestStatusType = (typeof DepositRequestStatus)[keyof typeof DepositRequestStatus];
export type WithdrawalRequestStatusType = (typeof WithdrawalRequestStatus)[keyof typeof WithdrawalRequestStatus];
export type BalanceTransactionTypeType = (typeof BalanceTransactionType)[keyof typeof BalanceTransactionType];
export type NetworkType = (typeof Network)[keyof typeof Network];
//# sourceMappingURL=enums.d.ts.map