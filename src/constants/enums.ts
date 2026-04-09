export const EventStatus = {
  NOT_STARTED: "notstarted",
  LIVE: "live",
  FINISHED: "finished",
  CANCELLED: "cancelled",
} as const;

export const TicketType = {
  SINGLE: "single",
  ACCUMULATOR: "accumulator",
} as const;

export const TicketStatus = {
  PENDING: "pending",
  WON: "won",
  LOST: "lost",
  VOID: "void",
  REFUNDED: "refunded",
  CASHED_OUT: "cashed_out",
} as const;

export const SelectionStatus = {
  PENDING: "pending",
  WON: "won",
  LOST: "lost",
  VOID: "void",
} as const;

export const MarketType = {
  MATCH_WINNER: "match_winner",
  TOTAL_GOALS: "total_goals",
  BTTS: "btts",
} as const;

export const Currency = {
  USDT: "USDT",
} as const;

export const DepositRequestStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const WithdrawalRequestStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const BalanceTransactionType = {
  DEPOSIT_CREDIT: "deposit_credit",
  FIRST_DEPOSIT_BONUS: "first_deposit_bonus",
  BET_DEBIT: "bet_debit",
  BET_PAYOUT: "bet_payout",
  BET_REFUND: "bet_refund",
  SETTLEMENT_ADJUSTMENT_CREDIT: "settlement_adjustment_credit",
  SETTLEMENT_ADJUSTMENT_DEBIT: "settlement_adjustment_debit",
  WITHDRAWAL_DEBIT: "withdrawal_debit",
} as const;

export const Network = {
  TRC20: "TRC20",
  ERC20: "ERC20",
  BEP20: "BEP20",
} as const;

export type EventStatusType = (typeof EventStatus)[keyof typeof EventStatus];
export type TicketTypeType = (typeof TicketType)[keyof typeof TicketType];
export type TicketStatusType = (typeof TicketStatus)[keyof typeof TicketStatus];
export type SelectionStatusType =
  (typeof SelectionStatus)[keyof typeof SelectionStatus];
export type MarketTypeType = (typeof MarketType)[keyof typeof MarketType];
export type CurrencyType = (typeof Currency)[keyof typeof Currency];
export type DepositRequestStatusType =
  (typeof DepositRequestStatus)[keyof typeof DepositRequestStatus];
export type WithdrawalRequestStatusType =
  (typeof WithdrawalRequestStatus)[keyof typeof WithdrawalRequestStatus];
export type BalanceTransactionTypeType =
  (typeof BalanceTransactionType)[keyof typeof BalanceTransactionType];
export type NetworkType = (typeof Network)[keyof typeof Network];
