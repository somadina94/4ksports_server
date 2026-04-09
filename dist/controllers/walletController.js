import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Wallet from "../models/walletModel.js";
import { Network } from "../constants/enums.js";
const isOwner = (wallet, userId) => Boolean(userId && String(wallet.userId) === String(userId));
export const createWallet = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const network = req.body.network;
    if (!network || !Object.values(Network).includes(network)) {
        return next(new AppError("Valid network is required (TRC20, ERC20, BEP20)", 400));
    }
    const walletAddress = String(req.body.walletAddress ?? "").trim();
    if (!walletAddress)
        return next(new AppError("Wallet address is required", 400));
    const wallet = await Wallet.create({
        userId: req.user._id,
        type: "usdt",
        network,
        label: String(req.body.label ?? "").trim().slice(0, 100),
        walletAddress,
    });
    res.status(201).json({
        status: "success",
        message: "Wallet created successfully",
        data: {
            wallet,
        },
    });
});
export const getAllWallets = catchAsync(async (req, res, next) => {
    const wallets = await Wallet.find({
        userId: req.user?._id,
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
});
export const adminGetAllWallets = catchAsync(async (req, res, next) => {
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
});
export const getWallet = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet || !isOwner(wallet, req.user._id)) {
        return next(new AppError("Wallet not found", 404));
    }
    res.status(200).json({
        status: "success",
        message: "Wallet fetched successfully",
        data: {
            wallet,
        },
    });
});
export const updateWallet = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const existing = await Wallet.findById(req.params.id);
    if (!existing || !isOwner(existing, req.user._id)) {
        return next(new AppError("Wallet not found", 404));
    }
    const allowed = {};
    if (req.body.walletAddress !== undefined) {
        allowed.walletAddress = String(req.body.walletAddress).trim();
    }
    if (req.body.label !== undefined) {
        allowed.label = String(req.body.label).trim().slice(0, 100);
    }
    if (req.body.network !== undefined) {
        const n = String(req.body.network);
        if (!Object.values(Network).includes(n)) {
            return next(new AppError("Invalid network", 400));
        }
        allowed.network = n;
    }
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, allowed, {
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
});
export const deleteWallet = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(new AppError("Unauthorized", 401));
    const existing = await Wallet.findById(req.params.id);
    if (!existing || !isOwner(existing, req.user._id)) {
        return next(new AppError("Wallet not found", 404));
    }
    const wallet = await Wallet.findByIdAndDelete(req.params.id);
    if (!wallet) {
        return next(new AppError("Wallet not found", 404));
    }
    res.status(204).json({
        status: "success",
        message: "Wallet deleted successfully",
    });
});
//# sourceMappingURL=walletController.js.map