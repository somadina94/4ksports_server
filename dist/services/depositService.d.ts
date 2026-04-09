import mongoose from "mongoose";
export declare const createDepositRequest: (userId: mongoose.Types.ObjectId, input: {
    platformWalletId: string;
    amount: number;
    network: string;
    txHash: string;
    proofImageUrl?: string;
}) => Promise<mongoose.Document<unknown, {}, import("../types/betting.js").IDepositRequest, {}, mongoose.DefaultSchemaOptions> & import("../types/betting.js").IDepositRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const approveDepositRequest: (adminId: mongoose.Types.ObjectId, depositRequestId: string) => Promise<mongoose.Document<unknown, {}, import("../types/betting.js").IDepositRequest, {}, mongoose.DefaultSchemaOptions> & import("../types/betting.js").IDepositRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const rejectDepositRequest: (adminId: mongoose.Types.ObjectId, depositRequestId: string) => Promise<mongoose.Document<unknown, {}, import("../types/betting.js").IDepositRequest, {}, mongoose.DefaultSchemaOptions> & import("../types/betting.js").IDepositRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
//# sourceMappingURL=depositService.d.ts.map