import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Wallet from "../models/walletModel.js";

import type { Request, Response, NextFunction } from "express";

export const createWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = await Wallet.create({
      userId: req.user?._id as unknown as mongoose.Schema.Types.ObjectId,
      type: req.body.type,
      walletAddress: req.body.walletAddress as string,
    });
    res.status(201).json({
      status: "success",
      message: "Wallet created successfully",
      data: {
        wallet,
      },
    });
  },
);

export const getAllWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallets = await Wallet.find({
      userId: req.user?._id as unknown as mongoose.Schema.Types.ObjectId,
    });
    if (!wallets) {
      return next(new AppError("Wallets not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Wallets fetched successfully",
      data: {
        wallets,
      },
    });
  },
);

export const adminGetAllWallets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallets = await Wallet.find();
    if (!wallets) {
      return next(new AppError("Wallets not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Wallets fetched successfully",
      data: {
        wallets,
      },
    });
  },
);

export const getWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) {
      return next(new AppError("Wallet not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Wallet fetched successfully",
      data: {
        wallet,
      },
    });
  },
);

export const updateWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!wallet) {
      return next(new AppError("Wallet not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Wallet updated successfully",
      data: {
        wallet,
      },
    });
  },
);

export const deleteWallet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const wallet = await Wallet.findByIdAndDelete(req.params.id);
    if (!wallet) {
      return next(new AppError("Wallet not found", 404));
    }
    res.status(204).json({
      status: "success",
      message: "Wallet deleted successfully",
    });
  },
);
