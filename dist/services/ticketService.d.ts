import mongoose from "mongoose";
type IncomingSelection = {
    eventId: string;
    marketType: string;
    pick: string;
    line?: number | null;
};
export declare const placeTicket: (userId: mongoose.Types.ObjectId, input: {
    type: string;
    stake: number;
    selections: IncomingSelection[];
}) => Promise<mongoose.Document<unknown, {}, import("../types/betting.js").ITicket, {}, mongoose.DefaultSchemaOptions> & import("../types/betting.js").ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export {};
//# sourceMappingURL=ticketService.d.ts.map