import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import BalanceWallet from "../models/balanceWalletModel.js";

export const getOrCreateBalanceWallet = async (
  userId: mongoose.Types.ObjectId,
  session?: mongoose.ClientSession,
) => {
  const wallet = await BalanceWallet.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId, balance: 0, lockedBalance: 0 } },
    { upsert: true, new: true, session: session ?? null },
  );
  if (!wallet) throw new AppError("Failed to create balance wallet", 500);
  return wallet;
};

export const incrementBalance = async (
  userId: mongoose.Types.ObjectId,
  amount: number,
  session?: mongoose.ClientSession,
) => {
  const wallet = await getOrCreateBalanceWallet(userId, session);
  const before = wallet.balance;
  wallet.balance = Number((wallet.balance + amount).toFixed(2));
  await wallet.save({ session: session ?? null });
  return { wallet, before, after: wallet.balance };
};

export const decrementBalance = async (
  userId: mongoose.Types.ObjectId,
  amount: number,
  session?: mongoose.ClientSession,
) => {
  const wallet = await getOrCreateBalanceWallet(userId, session);
  if (wallet.balance < amount) {
    throw new AppError("Insufficient balance", 400);
  }
  const before = wallet.balance;
  wallet.balance = Number((wallet.balance - amount).toFixed(2));
  await wallet.save({ session: session ?? null });
  return { wallet, before, after: wallet.balance };
};
