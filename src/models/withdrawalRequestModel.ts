import mongoose, { Model } from "mongoose";
import { Network, WithdrawalRequestStatus } from "../constants/enums.js";
import type { IWithdrawalRequest } from "../types/betting.js";

const withdrawalRequestSchema = new mongoose.Schema<IWithdrawalRequest>(
  {
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
    userWalletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    network: { type: String, enum: Object.values(Network), required: true },
    destinationAddress: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(WithdrawalRequestStatus),
      default: WithdrawalRequestStatus.PENDING,
      index: true,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    debitedAt: { type: Date },
  },
  { timestamps: true },
);

withdrawalRequestSchema.index({ userId: 1, createdAt: -1 });

const WithdrawalRequest: Model<IWithdrawalRequest> =
  mongoose.model<IWithdrawalRequest>("WithdrawalRequest", withdrawalRequestSchema);

export default WithdrawalRequest;
