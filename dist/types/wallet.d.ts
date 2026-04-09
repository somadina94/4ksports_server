import type { Document, Types } from "mongoose";
import type { NetworkType } from "../constants/enums.js";
export interface IWallet extends Document {
    userId: Types.ObjectId;
    type: "usdt";
    network: NetworkType;
    label: string;
    walletAddress: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=wallet.d.ts.map