import mongoose, { Model } from "mongoose";

import type { IWallet } from "../types/wallet.js";

const walletSchema = new mongoose.Schema<IWallet>({
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

const Wallet: Model<IWallet> = mongoose.model<IWallet>("Wallet", walletSchema);
export default Wallet;
