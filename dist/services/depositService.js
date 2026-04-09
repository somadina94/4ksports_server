import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import DepositRequest from "../models/depositRequestModel.js";
import PlatformWallet from "../models/platformWalletModel.js";
import BalanceTransaction from "../models/balanceTransactionModel.js";
import { BalanceTransactionType, DepositRequestStatus } from "../constants/enums.js";
/** Bonus = this multiplier × deposit amount (200% on top = 2× deposit). */
export const FIRST_DEPOSIT_BONUS_MULTIPLIER = 2;
import { getOrCreateBalanceWallet, incrementBalance, } from "./walletBalanceService.js";
import { emitSocketEvent } from "../sockets/io.js";
export const createDepositRequest = async (userId, input) => {
    const platformWallet = await PlatformWallet.findById(input.platformWalletId);
    if (!platformWallet || !platformWallet.isActive) {
        throw new AppError("Platform wallet not found or inactive", 404);
    }
    const balanceWallet = await getOrCreateBalanceWallet(userId);
    return DepositRequest.create({
        userId,
        balanceWalletId: balanceWallet._id,
        platformWalletId: platformWallet._id,
        amount: input.amount,
        network: input.network,
        txHash: input.txHash,
        proofImageUrl: input.proofImageUrl ?? "",
        status: DepositRequestStatus.PENDING,
    });
};
export const approveDepositRequest = async (adminId, depositRequestId) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const request = await DepositRequest.findById(depositRequestId).session(session);
        if (!request)
            throw new AppError("Deposit request not found", 404);
        if (request.status !== DepositRequestStatus.PENDING) {
            throw new AppError("Deposit request is not pending", 400);
        }
        const priorApprovedCount = await DepositRequest.countDocuments({
            userId: request.userId,
            status: DepositRequestStatus.APPROVED,
        }).session(session);
        const isFirstApprovedDeposit = priorApprovedCount === 0;
        const { wallet, before: beforeDeposit, after: afterDeposit, } = await incrementBalance(request.userId, request.amount, session);
        request.status = DepositRequestStatus.APPROVED;
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();
        request.creditedAt = new Date();
        await request.save({ session });
        const txRows = [
            {
                userId: request.userId,
                balanceWalletId: wallet._id,
                type: BalanceTransactionType.DEPOSIT_CREDIT,
                amount: request.amount,
                balanceBefore: beforeDeposit,
                balanceAfter: afterDeposit,
                referenceType: "deposit_request",
                referenceId: request._id,
            },
        ];
        let finalBalance = afterDeposit;
        if (isFirstApprovedDeposit) {
            const bonusAmount = Number((request.amount * FIRST_DEPOSIT_BONUS_MULTIPLIER).toFixed(2));
            if (bonusAmount >= 0.01) {
                const { before: beforeBonus, after: afterBonus } = await incrementBalance(request.userId, bonusAmount, session);
                finalBalance = afterBonus;
                txRows.push({
                    userId: request.userId,
                    balanceWalletId: wallet._id,
                    type: BalanceTransactionType.FIRST_DEPOSIT_BONUS,
                    amount: bonusAmount,
                    balanceBefore: beforeBonus,
                    balanceAfter: afterBonus,
                    referenceType: "deposit_request",
                    referenceId: request._id,
                });
            }
        }
        await BalanceTransaction.create(txRows, { session, ordered: true });
        await session.commitTransaction();
        emitSocketEvent("wallet:update", {
            userId: request.userId,
            balance: finalBalance,
        });
        return request;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
export const rejectDepositRequest = async (adminId, depositRequestId) => {
    const request = await DepositRequest.findById(depositRequestId);
    if (!request)
        throw new AppError("Deposit request not found", 404);
    if (request.status !== DepositRequestStatus.PENDING) {
        throw new AppError("Deposit request is not pending", 400);
    }
    request.status = DepositRequestStatus.REJECTED;
    request.reviewedBy = adminId;
    request.reviewedAt = new Date();
    await request.save();
    return request;
};
//# sourceMappingURL=depositService.js.map