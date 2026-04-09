import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import DepositRequest from "../models/depositRequestModel.js";
import { approveDepositRequest, createDepositRequest, rejectDepositRequest, } from "../services/depositService.js";
import { notifyAdminSafe } from "../utils/email.js";
export const createMyDepositRequest = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const request = await createDepositRequest(req.user._id, req.body);
    notifyAdminSafe("newDepositRequest", `[${process.env.COMPANY_NAME ?? "4K Sportsbook"}] Deposit request ${request.amount} USDT`, {
        username: req.user.username,
        amount: request.amount,
        network: request.network,
        txHash: request.txHash,
    });
    res.status(201).json({ status: "success", data: { request } });
});
export const getMyDepositRequests = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const requests = await DepositRequest.find({
        userId: req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { requests } });
});
export const getAdminDepositRequests = catchAsync(async (req, res, next) => {
    const requests = await DepositRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { requests } });
});
export const approveAdminDepositRequest = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const request = await approveDepositRequest(req.user._id, String(req.params.id));
    res.status(200).json({ status: "success", data: { request } });
});
export const rejectAdminDepositRequest = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const request = await rejectDepositRequest(req.user._id, String(req.params.id));
    res.status(200).json({ status: "success", data: { request } });
});
//# sourceMappingURL=depositRequestController.js.map