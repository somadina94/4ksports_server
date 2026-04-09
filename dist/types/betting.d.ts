import type { Document, Types } from "mongoose";
import type { CurrencyType, DepositRequestStatusType, EventStatusType, MarketTypeType, NetworkType, SelectionStatusType, TicketStatusType, TicketTypeType, BalanceTransactionTypeType } from "../constants/enums.js";
export interface IEvent extends Document {
    providerId: number;
    apiId: number;
    league: {
        id?: number;
        name: string;
        country?: string;
    };
    homeTeam: string;
    awayTeam: string;
    eventDate: Date;
    status: EventStatusType;
    scores: {
        home: number;
        away: number;
    };
    odds: {
        odds_home: number | null;
        odds_draw: number | null;
        odds_away: number | null;
        odds_over_15: number | null;
        odds_over_25: number | null;
        odds_over_35: number | null;
        odds_under_15: number | null;
        odds_under_25: number | null;
        odds_under_35: number | null;
        odds_btts_yes: number | null;
        odds_btts_no: number | null;
    };
    lastSyncedAt: Date;
}
export interface ITicket extends Document {
    userId: Types.ObjectId;
    type: TicketTypeType;
    stake: number;
    totalOdds: number;
    potentialPayout: number;
    status: TicketStatusType;
    selectionCount: number;
    wonSelections: number;
    lostSelections: number;
    voidSelections: number;
    placedAt: Date;
    settledAt?: Date;
}
export interface ITicketSelection extends Document {
    ticketId: Types.ObjectId;
    userId: Types.ObjectId;
    eventId: Types.ObjectId;
    marketType: MarketTypeType;
    pick: string;
    line?: number | null;
    odds: number;
    status: SelectionStatusType;
    snapshot: {
        eventDate: Date;
        homeTeam: string;
        awayTeam: string;
        marketType: MarketTypeType;
        pick: string;
        line?: number | null;
    };
    settledAt?: Date;
}
export interface IBalanceWallet extends Document {
    userId: Types.ObjectId;
    currency: CurrencyType;
    balance: number;
    lockedBalance: number;
    isActive: boolean;
}
export interface IPlatformWallet extends Document {
    label: string;
    network: NetworkType;
    currency: CurrencyType;
    walletAddress: string;
    isActive: boolean;
    createdBy: Types.ObjectId;
}
export interface IDepositRequest extends Document {
    userId: Types.ObjectId;
    balanceWalletId: Types.ObjectId;
    platformWalletId: Types.ObjectId;
    amount: number;
    network: NetworkType;
    txHash: string;
    proofImageUrl?: string;
    status: DepositRequestStatusType;
    reviewedBy?: Types.ObjectId;
    reviewedAt?: Date;
    creditedAt?: Date;
}
export interface IBalanceTransaction extends Document {
    userId: Types.ObjectId;
    balanceWalletId: Types.ObjectId;
    type: BalanceTransactionTypeType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    referenceType: "deposit_request" | "ticket" | "withdrawal";
    referenceId: Types.ObjectId;
}
export interface ISettlementLog extends Document {
    eventId: Types.ObjectId;
    ticketSelectionId: Types.ObjectId;
    ticketId: Types.ObjectId;
    status: SelectionStatusType;
    reason: string;
    settledAt: Date;
}
//# sourceMappingURL=betting.d.ts.map