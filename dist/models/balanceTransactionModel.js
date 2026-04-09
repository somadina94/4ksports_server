import mongoose, { Model } from "mongoose";
import { BalanceTransactionType } from "../constants/enums.js";
const balanceTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    balanceWalletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BalanceWallet",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(BalanceTransactionType),
        required: true,
        index: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    balanceBefore: { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number, required: true, min: 0 },
    referenceType: {
        type: String,
        enum: ["deposit_request", "ticket", "withdrawal"],
        required: true,
        index: true,
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
}, { timestamps: true });
balanceTransactionSchema.index({ userId: 1, createdAt: -1 });
const BalanceTransaction = mongoose.model("BalanceTransaction", balanceTransactionSchema);
export default BalanceTransaction;
//# sourceMappingURL=balanceTransactionModel.js.map