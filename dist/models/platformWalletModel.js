import mongoose, { Model } from "mongoose";
import { Currency, Network } from "../constants/enums.js";
const platformWalletSchema = new mongoose.Schema({
    label: { type: String, required: true, trim: true },
    network: { type: String, enum: Object.values(Network), required: true, index: true },
    currency: {
        type: String,
        enum: Object.values(Currency),
        default: Currency.USDT,
        index: true,
    },
    walletAddress: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
}, { timestamps: true });
const PlatformWallet = mongoose.model("PlatformWallet", platformWalletSchema);
export default PlatformWallet;
//# sourceMappingURL=platformWalletModel.js.map