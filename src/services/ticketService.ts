import mongoose from "mongoose";
import AppError from "../utils/appError.js";
import Event from "../models/eventModel.js";
import Ticket from "../models/ticketModel.js";
import TicketSelection from "../models/ticketSelectionModel.js";
import BalanceTransaction from "../models/balanceTransactionModel.js";
import { EventStatus, BalanceTransactionType, TicketType } from "../constants/enums.js";
import { resolveSelectionOdds } from "../utils/oddsResolver.js";
import { calculatePayout, calculateTotalOdds } from "../utils/ticketMath.js";
import { decrementBalance } from "./walletBalanceService.js";
import { emitSocketEvent } from "../sockets/io.js";

type IncomingSelection = {
  eventId: string;
  marketType: string;
  pick: string;
  line?: number | null;
};

export const placeTicket = async (
  userId: mongoose.Types.ObjectId,
  input: {
    type: string;
    stake: number;
    selections: IncomingSelection[];
  },
) => {
  if (!(Object.values(TicketType) as string[]).includes(input.type)) {
    throw new AppError("Invalid ticket type", 400);
  }
  if (!input.selections.length) throw new AppError("Selections are required", 400);
  if (input.type === TicketType.SINGLE && input.selections.length !== 1) {
    throw new AppError("Single ticket must have exactly one selection", 400);
  }

  const uniqueEventIds = new Set(input.selections.map((s) => s.eventId));
  if (uniqueEventIds.size !== input.selections.length) {
    throw new AppError("Duplicate selections for same event are not allowed", 400);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const eventIds = [...uniqueEventIds].map((id) => new mongoose.Types.ObjectId(id));
    const events = await Event.find({ _id: { $in: eventIds } }).session(session);
    if (events.length !== input.selections.length) {
      throw new AppError("One or more events not found", 404);
    }

    const eventMap = new Map(events.map((event) => [event.id, event]));
    const now = new Date();
    const frozenSelections = input.selections.map((selection) => {
      const event = eventMap.get(selection.eventId);
      if (!event) throw new AppError("Selection event missing", 400);
      if (event.status !== EventStatus.NOT_STARTED) {
        throw new AppError("Only not started events can be bet", 400);
      }
      if (event.eventDate <= now) {
        throw new AppError("Bet rejected after kickoff", 400);
      }

      const odds = resolveSelectionOdds(
        event,
        selection.marketType,
        selection.pick,
        selection.line,
      );
      if (odds <= 1) {
        throw new AppError("Invalid/unsupported selection odds", 400);
      }

      return {
        event,
        marketType: selection.marketType,
        pick: selection.pick,
        line: selection.line ?? null,
        odds,
      };
    });

    const totalOdds = Number(
      calculateTotalOdds(
        input.type,
        frozenSelections.map((selection) => selection.odds),
      ).toFixed(4),
    );
    const potentialPayout = calculatePayout(input.stake, totalOdds);

    const { wallet, before, after } = await decrementBalance(
      userId,
      input.stake,
      session,
    );

    const ticket = await Ticket.create(
      [
        {
          userId,
          type: input.type,
          stake: input.stake,
          totalOdds,
          potentialPayout,
          selectionCount: frozenSelections.length,
        },
      ],
      { session },
    ).then((docs) => docs[0]!);

    await TicketSelection.insertMany(
      frozenSelections.map((selection) => ({
        ticketId: ticket._id,
        userId,
        eventId: selection.event._id,
        marketType: selection.marketType,
        pick: selection.pick,
        line: selection.line,
        odds: selection.odds,
        snapshot: {
          eventDate: selection.event.eventDate,
          homeTeam: selection.event.homeTeam,
          awayTeam: selection.event.awayTeam,
          marketType: selection.marketType,
          pick: selection.pick,
          line: selection.line,
        },
      })),
      { session },
    );

    await BalanceTransaction.create(
      [
        {
          userId,
          balanceWalletId: wallet._id,
          type: BalanceTransactionType.BET_DEBIT,
          amount: input.stake,
          balanceBefore: before,
          balanceAfter: after,
          referenceType: "ticket",
          referenceId: ticket._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    emitSocketEvent("ticket:placed", { ticketId: ticket._id, userId });
    emitSocketEvent("wallet:update", { userId, balance: after });
    return ticket;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
