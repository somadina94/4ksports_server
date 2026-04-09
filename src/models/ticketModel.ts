import mongoose, { Model } from "mongoose";
import { TicketStatus, TicketType } from "../constants/enums.js";
import type { ITicket } from "../types/betting.js";

const ticketSchema = new mongoose.Schema<ITicket>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: Object.values(TicketType), required: true },
    stake: { type: Number, required: true, min: 0.01 },
    totalOdds: { type: Number, required: true, min: 1 },
    potentialPayout: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.PENDING,
      index: true,
    },
    selectionCount: { type: Number, required: true, min: 1 },
    wonSelections: { type: Number, default: 0, min: 0 },
    lostSelections: { type: Number, default: 0, min: 0 },
    voidSelections: { type: Number, default: 0, min: 0 },
    placedAt: { type: Date, default: Date.now, index: true },
    settledAt: { type: Date },
  },
  { timestamps: true },
);

ticketSchema.index({ userId: 1, placedAt: -1 });

const Ticket: Model<ITicket> = mongoose.model<ITicket>("Ticket", ticketSchema);
export default Ticket;
