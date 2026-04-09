import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Announcement from "../models/announcementModel.js";

import type { Request, Response, NextFunction } from "express";

export const getActiveAnnouncements = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const now = new Date();
    const announcements = await Announcement.find({
      expiresAt: { $gt: now },
      body: { $regex: /\S/ },
    }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: "success", data: { announcements } });
  },
);

export const listAnnouncementsAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: { announcements } });
  },
);

export const deleteAnnouncement = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const deleted = await Announcement.findByIdAndDelete(String(req.params.id));
    if (!deleted) return next(new AppError("Announcement not found", 404));
    res.status(204).send();
  },
);

export const createAnnouncement = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    const { body, expiresAt } = req.body as { body?: string; expiresAt?: string };
    if (!body || typeof body !== "string" || !body.trim()) {
      return next(new AppError("Announcement body is required", 400));
    }
    if (!expiresAt) {
      return next(new AppError("expiresAt is required", 400));
    }
    const expires = new Date(expiresAt);
    if (Number.isNaN(expires.getTime())) {
      return next(new AppError("Invalid expiresAt date", 400));
    }
    if (expires <= new Date()) {
      return next(new AppError("expiresAt must be in the future", 400));
    }
    const announcement = await Announcement.create({
      body: body.trim(),
      expiresAt: expires,
      createdBy: req.user._id as mongoose.Types.ObjectId,
    });
    res.status(201).json({ status: "success", data: { announcement } });
  },
);
