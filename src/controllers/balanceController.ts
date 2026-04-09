import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import BalanceTransaction from "../models/balanceTransactionModel.js";
import { getOrCreateBalanceWallet } from "../services/walletBalanceService.js";

import type { Request, Response, NextFunction } from "express";

export const getMyBalanceWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const wallet = await getOrCreateBalanceWallet(
      req.user._id as mongoose.Types.ObjectId,
    );
    res.status(200).json({ status: "success", data: { wallet } });
  },
);

export const getMyBalanceTransactions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const transactions = await BalanceTransaction.find({
      userId: req.user._id as mongoose.Types.ObjectId,
    }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { transactions } });
  },
);
