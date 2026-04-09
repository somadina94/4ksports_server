import mongoose, { Model } from "mongoose";
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
    walletAddress: {
        type: String,
        required: true,
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