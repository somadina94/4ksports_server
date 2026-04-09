import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";

import type { Request, Response, NextFunction } from "express";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: {
        users,
      },
    });
  },
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: {
        user,
      },
    });
  },
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: {
        user,
      },
    });
  },
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(204).json({
      status: "success",
      message: "User deleted successfully",
    });
  },
);
