import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import WithdrawalRequest from "../models/withdrawalRequestModel.js";
import UserSavedWallet from "../models/walletModel.js";
import BalanceTransaction from "../models/balanceTransactionModel.js";
import {
  BalanceTransactionType,
  Network,
  WithdrawalRequestStatus,
} from "../constants/enums.js";
import {
  getOrCreateBalanceWallet,
  decrementBalance,
} from "./walletBalanceService.js";
import { emitSocketEvent } from "../sockets/io.js";
import { assertWithdrawalActivityRules } from "../utils/withdrawalEligibility.js";

async function sumPendingWithdrawals(
  userId: mongoose.Types.ObjectId,
  session?: mongoose.ClientSession | null,
) {
  const q = WithdrawalRequest.find({
    userId,
    status: WithdrawalRequestStatus.PENDING,
  }).select("amount");
  if (session) q.session(session);
  const docs = await q.lean();
  return docs.reduce((sum, d) => sum + d.amount, 0);
}

export const createWithdrawalRequest = async (
  userId: mongoose.Types.ObjectId,
  input: { userWalletId: string; amount: number },
) => {
  if (!input.amount || input.amount < 0.01) {
    throw new AppError("Amount must be at least 0.01", 400);
  }

  await assertWithdrawalActivityRules(userId);

  const userWallet = await UserSavedWallet.findById(input.userWalletId);
  if (!userWallet || String(userWallet.userId) !== String(userId)) {
    throw new AppError("Wallet not found", 404);
  }

  const balanceWallet = await getOrCreateBalanceWallet(userId);
  const pendingTotal = await sumPendingWithdrawals(userId);
  const available = Number(
    (
      balanceWallet.balance -
      balanceWallet.lockedBalance -
      pendingTotal
    ).toFixed(2),
  );

  if (available < input.amount) {
    throw new AppError(
      "Insufficient available balance (account for locked funds and pending withdrawals)",
      400,
    );
  }

  return WithdrawalRequest.create({
    userId,
    balanceWalletId: balanceWallet._id,
    userWalletId: userWallet._id,
    amount: Number(input.amount.toFixed(2)),
    network: userWallet.network ?? Network.TRC20,
    destinationAddress: userWallet.walletAddress.trim(),
    status: WithdrawalRequestStatus.PENDING,
  });
};

export const approveWithdrawalRequest = async (
  adminId: mongoose.Types.ObjectId,
  withdrawalRequestId: string,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const request = await WithdrawalRequest.findById(withdrawalRequestId).session(
      session,
    );
    if (!request) throw new AppError("Withdrawal request not found", 404);
    if (request.status !== WithdrawalRequestStatus.PENDING) {
      throw new AppError("Withdrawal request is not pending", 400);
    }

    const {
      wallet,
      before: beforeDebit,
      after: afterDebit,
    } = await decrementBalance(request.userId, request.amount, session);

    request.status = WithdrawalRequestStatus.APPROVED;
    request.reviewedBy = adminId;
    request.reviewedAt = new Date();
    request.debitedAt = new Date();
    await request.save({ session });

    await BalanceTransaction.create(
      [
        {
          userId: request.userId,
          balanceWalletId: wallet._id,
          type: BalanceTransactionType.WITHDRAWAL_DEBIT,
          amount: request.amount,
          balanceBefore: beforeDebit,
          balanceAfter: afterDebit,
          referenceType: "withdrawal",
          referenceId: request._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    emitSocketEvent("wallet:update", {
      userId: request.userId,
      balance: afterDebit,
    });
    return request;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const rejectWithdrawalRequest = async (
  adminId: mongoose.Types.ObjectId,
  withdrawalRequestId: string,
) => {
  const request = await WithdrawalRequest.findById(withdrawalRequestId);
  if (!request) throw new AppError("Withdrawal request not found", 404);
  if (request.status !== WithdrawalRequestStatus.PENDING) {
    throw new AppError("Withdrawal request is not pending", 400);
  }
  request.status = WithdrawalRequestStatus.REJECTED;
  request.reviewedBy = adminId;
  request.reviewedAt = new Date();
  await request.save();
  return request;
};
