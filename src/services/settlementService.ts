import mongoose from "mongoose";
import Event from "../models/eventModel.js";
import Ticket from "../models/ticketModel.js";
import TicketSelection from "../models/ticketSelectionModel.js";
import SettlementLog from "../models/settlementLogModel.js";
import BalanceTransaction from "../models/balanceTransactionModel.js";
import { BalanceTransactionType, EventStatus, SelectionStatus, TicketStatus } from "../constants/enums.js";
import { settleSelection } from "../utils/settlementRules.js";
import { calculatePayout } from "../utils/ticketMath.js";
import { incrementBalance } from "./walletBalanceService.js";
import { emitSocketEvent } from "../sockets/io.js";

export const computeTicketOutcome = (
  selections: { status: string; odds: number }[],
  stake: number,
) => {
  const lostCount = selections.filter((s) => s.status === SelectionStatus.LOST).length;
  const wonCount = selections.filter((s) => s.status === SelectionStatus.WON).length;
  const voidCount = selections.filter((s) => s.status === SelectionStatus.VOID).length;

  if (lostCount > 0) return { status: TicketStatus.LOST, payout: 0, wonCount, lostCount, voidCount };

  if (wonCount === 0 && voidCount === selections.length) {
    return { status: TicketStatus.REFUNDED, payout: stake, wonCount, lostCount, voidCount };
  }

  const effectiveOdds = selections
    .filter((s) => s.status !== SelectionStatus.VOID)
    .reduce((acc, s) => acc * s.odds, 1);

  return {
    status: TicketStatus.WON,
    payout: calculatePayout(stake, effectiveOdds),
    wonCount,
    lostCount,
    voidCount,
  };
};

export const settleEventSelections = async (eventId: mongoose.Types.ObjectId) => {
  const event = await Event.findById(eventId);
  if (!event || event.status !== EventStatus.FINISHED) return;

  const pendingSelections = await TicketSelection.find({
    eventId,
    status: SelectionStatus.PENDING,
  });

  for (const selection of pendingSelections) {
    const result = settleSelection(
      selection.marketType,
      selection.pick,
      selection.line,
      event.scores,
    );

    selection.status = result.status as typeof selection.status;
    selection.settledAt = new Date();
    await selection.save();

    await SettlementLog.create({
      eventId: event._id,
      ticketSelectionId: selection._id,
      ticketId: selection.ticketId,
      status: selection.status,
      reason: result.reason,
      settledAt: new Date(),
    });

    emitSocketEvent("ticket:selection_settled", {
      selectionId: selection._id,
      ticketId: selection.ticketId,
      status: selection.status,
    });
  }
};

export const settlePendingTickets = async () => {
  const pendingTickets = await Ticket.find({ status: TicketStatus.PENDING });

  for (const ticket of pendingTickets) {
    const selections = await TicketSelection.find({ ticketId: ticket._id });
    if (!selections.length) continue;
    if (selections.some((s) => s.status === SelectionStatus.PENDING)) continue;

    const decision = computeTicketOutcome(selections, ticket.stake);
    if (ticket.settledAt) continue;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      ticket.status = decision.status as typeof ticket.status;
      ticket.wonSelections = decision.wonCount;
      ticket.lostSelections = decision.lostCount;
      ticket.voidSelections = decision.voidCount;
      ticket.settledAt = new Date();
      await ticket.save({ session });

      if (decision.payout > 0) {
        const { wallet, before, after } = await incrementBalance(
          ticket.userId,
          decision.payout,
          session,
        );
        await BalanceTransaction.create(
          [
            {
              userId: ticket.userId,
              balanceWalletId: wallet._id,
              type:
                decision.status === TicketStatus.REFUNDED
                  ? BalanceTransactionType.BET_REFUND
                  : BalanceTransactionType.BET_PAYOUT,
              amount: decision.payout,
              balanceBefore: before,
              balanceAfter: after,
              referenceType: "ticket",
              referenceId: ticket._id,
            },
          ],
          { session },
        );
        emitSocketEvent("wallet:update", { userId: ticket.userId, balance: after });
      }

      await session.commitTransaction();
      emitSocketEvent("ticket:settled", {
        ticketId: ticket._id,
        status: ticket.status,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
};
