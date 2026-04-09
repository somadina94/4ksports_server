import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Ticket from "../models/ticketModel.js";
import TicketSelection from "../models/ticketSelectionModel.js";
import { placeTicket } from "../services/ticketService.js";

import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const createTicket = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const ticket = await placeTicket(
      req.user._id as mongoose.Types.ObjectId,
      req.body as {
        type: string;
        stake: number;
        selections: { eventId: string; marketType: string; pick: string; line?: number }[];
      },
    );
    res.status(201).json({ status: "success", data: { ticket } });
  },
);

export const getMyTickets = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const tickets = await Ticket.find({
      userId: req.user._id as mongoose.Types.ObjectId,
    }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { tickets } });
  },
);

export const getTicketById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const ticket = await Ticket.findOne({
      _id: String(req.params.id),
      userId: req.user._id as mongoose.Types.ObjectId,
    });
    if (!ticket) return next(new AppError("Ticket not found", 404));
    const selections = await TicketSelection.find({ ticketId: ticket._id });
    res.status(200).json({ status: "success", data: { ticket, selections } });
  },
);
