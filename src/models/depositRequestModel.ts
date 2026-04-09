import mongoose, { Model } from "mongoose";
import { DepositRequestStatus, Network } from "../constants/enums.js";
import type { IDepositRequest } from "../types/betting.js";

const depositRequestSchema = new mongoose.Schema<IDepositRequest>(
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
    platformWalletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlatformWallet",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    network: { type: String, enum: Object.values(Network), required: true },
    txHash: { type: String, required: true, trim: true, unique: true },
    proofImageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(DepositRequestStatus),
      default: DepositRequestStatus.PENDING,
      index: true,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    creditedAt: { type: Date },
  },
  { timestamps: true },
);

depositRequestSchema.index({ userId: 1, createdAt: -1 });

const DepositRequest: Model<IDepositRequest> = mongoose.model<IDepositRequest>(
  "DepositRequest",
  depositRequestSchema,
);

export default DepositRequest;
