import mongoose, { Model } from "mongoose";
import { MarketType, SelectionStatus } from "../constants/enums.js";
import type { ITicketSelection } from "../types/betting.js";

const ticketSelectionSchema = new mongoose.Schema<ITicketSelection>(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    marketType: {
      type: String,
      enum: Object.values(MarketType),
      required: true,
    },
    pick: { type: String, required: true },
    line: { type: Number, default: null },
    odds: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: Object.values(SelectionStatus),
      default: SelectionStatus.PENDING,
      index: true,
    },
    snapshot: {
      eventDate: { type: Date, required: true },
      homeTeam: { type: String, required: true },
      awayTeam: { type: String, required: true },
      marketType: { type: String, enum: Object.values(MarketType), required: true },
      pick: { type: String, required: true },
      line: { type: Number, default: null },
    },
    settledAt: { type: Date },
  },
  { timestamps: true },
);

ticketSelectionSchema.index({ ticketId: 1, eventId: 1, marketType: 1, pick: 1, line: 1 });
ticketSelectionSchema.index({ eventId: 1, status: 1 });

const TicketSelection: Model<ITicketSelection> = mongoose.model<ITicketSelection>(
  "TicketSelection",
  ticketSelectionSchema,
);

export default TicketSelection;
