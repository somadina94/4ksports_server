import mongoose, { Model } from "mongoose";
import { Network } from "../constants/enums.js";
const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["usdt"],
        required: true,
    },
    network: {
        type: String,
        enum: Object.values(Network),
        default: Network.TRC20,
        required: true,
    },
    label: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100,
    },
    walletAddress: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
//# sourceMappingURL=walletModel.js.map