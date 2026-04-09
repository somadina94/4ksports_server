import mongoose, { Model } from "mongoose";
import { Currency } from "../constants/enums.js";
import type { IBalanceWallet } from "../types/betting.js";

const balanceWalletSchema = new mongoose.Schema<IBalanceWallet>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.USDT,
    },
    balance: { type: Number, default: 0, min: 0 },
    lockedBalance: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const BalanceWallet: Model<IBalanceWallet> = mongoose.model<IBalanceWallet>(
  "BalanceWallet",
  balanceWalletSchema,
);

export default BalanceWallet;
