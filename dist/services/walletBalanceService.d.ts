import mongoose from "mongoose";
export declare const getOrCreateBalanceWallet: (userId: mongoose.Types.ObjectId, session?: mongoose.ClientSession) => Promise<mongoose.Document<unknown, {}, import("../types/betting.js").IBalanceWallet, {}, mongoose.DefaultSchemaOptions> & import("../types/betting.js").IBalanceWallet & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const incrementBalance: (userId: mongoose.Types.ObjectId, amount: number, session?: mongoose.ClientSession) => Promise<{
    wallet: mongoose.Document<unknown, {}, import("../types/betting.js").IBalanceWallet, {}, mongoose.DefaultSchemaOptions> & import("../types/betting.js").IBalanceWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    before: number;
    after: number;
}>;
export declare const decrementBalance: (userId: mongoose.Types.ObjectId, amount: number, session?: mongoose.ClientSession) => Promise<{
    wallet: mongoose.Document<unknown, {}, import("../types/betting.js").IBalanceWallet, {}, mongoose.DefaultSchemaOptions> & import("../types/betting.js").IBalanceWallet & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    before: number;
    after: number;
}>;
//# sourceMappingURL=walletBalanceService.d.ts.map