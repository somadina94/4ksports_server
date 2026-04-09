import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import DepositRequest from "../models/depositRequestModel.js";
import {
  approveDepositRequest,
  createDepositRequest,
  rejectDepositRequest,
} from "../services/depositService.js";

import type { Request, Response, NextFunction } from "express";

export const createMyDepositRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const request = await createDepositRequest(
      req.user._id as mongoose.Types.ObjectId,
      req.body,
    );
    res.status(201).json({ status: "success", data: { request } });
  },
);

export const getMyDepositRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const requests = await DepositRequest.find({
      userId: req.user._id as mongoose.Types.ObjectId,
    }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { requests } });
  },
);

export const getAdminDepositRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requests = await DepositRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { requests } });
  },
);

export const approveAdminDepositRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const request = await approveDepositRequest(
      req.user._id as mongoose.Types.ObjectId,
      String(req.params.id),
    );
    res.status(200).json({ status: "success", data: { request } });
  },
);

export const rejectAdminDepositRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const request = await rejectDepositRequest(
      req.user._id as mongoose.Types.ObjectId,
      String(req.params.id),
    );
    res.status(200).json({ status: "success", data: { request } });
  },
);
