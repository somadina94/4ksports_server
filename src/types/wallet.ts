import mongoose, { type Document } from "mongoose";

export interface IWallet extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: "usdt";
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
}
