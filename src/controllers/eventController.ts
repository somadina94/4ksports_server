import catchAsync from "../utils/catchAsync.js";
import Event from "../models/eventModel.js";

import type { Request, Response, NextFunction } from "express";

export const getUpcomingEvents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const events = await Event.find({ status: "notstarted" }).sort({ eventDate: 1 });
    res.status(200).json({
      status: "success",
      data: { events },
    });
  },
);

export const getEventById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { event },
    });
  },
);
