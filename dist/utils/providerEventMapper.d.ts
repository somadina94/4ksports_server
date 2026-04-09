type ProviderEvent = {
    id: number;
    api_id: number;
    league?: {
        id?: number;
        name?: string;
        country?: string;
    };
    home_team?: string;
    away_team?: string;
    event_date: string;
    status: string;
    scores?: {
        home?: number;
        away?: number;
    };
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
export declare const mapProviderEventToEventDocument: (providerEvent: ProviderEvent) => {
    providerId: number;
    apiId: number;
    league: {
        name: string;
        country: string;
        id?: number;
    };
    homeTeam: string;
    awayTeam: string;
    eventDate: Date;
    status: string;
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
};
export {};
//# sourceMappingURL=providerEventMapper.d.ts.map