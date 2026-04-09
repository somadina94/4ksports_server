import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import WithdrawalRequest from "../models/withdrawalRequestModel.js";
import {
  approveWithdrawalRequest,
  createWithdrawalRequest,
  rejectWithdrawalRequest,
} from "../services/withdrawalService.js";
import { notifyAdminSafe } from "../utils/email.js";

import type { Request, Response, NextFunction } from "express";

export const createMyWithdrawalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const request = await createWithdrawalRequest(
      req.user._id as mongoose.Types.ObjectId,
      {
        userWalletId: String(req.body.userWalletId ?? ""),
        amount: Number(req.body.amount),
      },
    );
    notifyAdminSafe(
      "newWithdrawalRequest",
      `[${process.env.COMPANY_NAME ?? "4K Sportsbook"}] Withdrawal ${request.amount} USDT`,
      {
        username: req.user.username,
        amount: request.amount,
        network: request.network,
        destinationAddress: request.destinationAddress,
      },
    );
    res.status(201).json({ status: "success", data: { request } });
  },
);

export const getMyWithdrawalRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const requests = await WithdrawalRequest.find({
      userId: req.user._id as mongoose.Types.ObjectId,
    })
      .populate("userWalletId", "label network walletAddress")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { requests } });
  },
);

export const getAdminWithdrawalRequests = catchAsync(
  async (_req: Request, res: Response) => {
    const requests = await WithdrawalRequest.find()
      .populate("userId", "username")
      .populate("userWalletId", "label network walletAddress")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { requests } });
  },
);

export const approveAdminWithdrawalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const request = await approveWithdrawalRequest(
      req.user._id as mongoose.Types.ObjectId,
      String(req.params.id),
    );
    res.status(200).json({ status: "success", data: { request } });
  },
);

export const rejectAdminWithdrawalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const request = await rejectWithdrawalRequest(
      req.user._id as mongoose.Types.ObjectId,
      String(req.params.id),
    );
    res.status(200).json({ status: "success", data: { request } });
  },
);
