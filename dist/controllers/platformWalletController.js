import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import PlatformWallet from "../models/platformWalletModel.js";
export const getActivePlatformWallets = catchAsync(async (req, res, next) => {
    const wallets = await PlatformWallet.find({ isActive: true }).sort({
        createdAt: -1,
    });
    res.status(200).json({ status: "success", data: { wallets } });
});
export const createPlatformWallet = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const wallet = await PlatformWallet.create({
        ...req.body,
        createdBy: req.user._id,
    });
    res.status(201).json({ status: "success", data: { wallet } });
});
export const getAdminPlatformWallets = catchAsync(async (req, res, next) => {
    const wallets = await PlatformWallet.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { wallets } });
});
export const updatePlatformWallet = catchAsync(async (req, res, next) => {
    const wallet = await PlatformWallet.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!wallet)
        return next(new AppError("Platform wallet not found", 404));
    res.status(200).json({ status: "success", data: { wallet } });
});
export const deletePlatformWallet = catchAsync(async (req, res, next) => {
    const wallet = await PlatformWallet.findByIdAndDelete(req.params.id);
    if (!wallet)
        return next(new AppError("Platform wallet not found", 404));
    res.status(204).json({ status: "success" });
});
//# sourceMappingURL=platformWalletController.js.map