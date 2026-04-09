import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import DepositRequest from "../models/depositRequestModel.js";
import Ticket from "../models/ticketModel.js";
import { DepositRequestStatus, TicketStatus } from "../constants/enums.js";
import { FIRST_DEPOSIT_BONUS_MULTIPLIER } from "../constants/depositLimits.js";

/**
 * Withdrawals require: (1) an approved first deposit, (2) total stake strictly greater than
 * first deposit + welcome bonus on that deposit, (3) at least one winning settled ticket.
 */
export async function assertWithdrawalActivityRules(
  userId: mongoose.Types.ObjectId,
): Promise<void> {
  const firstApproved = await DepositRequest.findOne({
    userId,
    status: DepositRequestStatus.APPROVED,
  }).sort({ creditedAt: 1, createdAt: 1 });

  if (!firstApproved) {
    throw new AppError(
      "Withdrawals are available only after your first deposit has been approved by an administrator.",
      403,
    );
  }

  const depositAmt = firstApproved.amount;
  const welcomeBonus = Number((depositAmt * FIRST_DEPOSIT_BONUS_MULTIPLIER).toFixed(2));
  const threshold = Number((depositAmt + welcomeBonus).toFixed(2));

  const stakeAgg = await Ticket.aggregate([
    { $match: { userId } },
    { $group: { _id: null, total: { $sum: "$stake" } } },
  ]);
  const totalStaked = stakeAgg[0]?.total ?? 0;

  if (totalStaked <= threshold) {
    throw new AppError(
      `To request a withdrawal you must place bets totaling more than ${threshold.toFixed(2)} USDT (your first approved deposit plus its welcome bonus). Your total staked so far is ${Number(totalStaked).toFixed(2)} USDT.`,
      403,
    );
  }

  const wonTickets = await Ticket.countDocuments({
    userId,
    status: TicketStatus.WON,
  });
  if (wonTickets === 0) {
    throw new AppError(
      "You must have at least one winning settled bet before you can request a withdrawal.",
      403,
    );
  }
}
