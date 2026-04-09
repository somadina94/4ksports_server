import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import type { IUser } from "../types/user.js";
import type { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
// A helper function to sign jwt
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "90d",
  });
};

// A function to send reponse with token
const createSendToken = (
  user: IUser,
  statusCode: number,
  req: Request,
  res: Response,
  message: string,
) => {
  const token = signToken(user._id.toString());

  user.password = "";

  res.status(statusCode).json({
    status: "success",
    message: message,
    token,
    data: {
      user,
    },
  });
};

// SIGN UP
export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Create user
    const user: IUser = await User.create({
      username: req.body.username,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // Send response
    const message = `Signed up successfully`;
    createSendToken(user, 201, req, res, message);
  },
);

// LOGIN
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get user email and password
    const { username, password } = req.body;

    // Check if email and password is provided
    if (!username || !password) {
      return next(
        new AppError("Please provide your username and password", 400),
      );
    }

    // Get user by email and select password
    const user = await User.findOne({ username: username }).select("+password");

    // Check is user exists and if password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect username or password", 401));
    }

    // Send response
    const message = "Logged in successfully";
    createSendToken(user, 200, req, res, message);
  },
);

// PROTECT MIDDLEWARE
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Check if token exists and get token
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("Access denied, please login to get access.", 401),
      );
    }

    // 2) Check if token is valid
    let decodedJWT: JwtPayload;

    try {
      decodedJWT = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return next(
        new AppError("Invalid or expired token. Please log in again.", 401),
      );
    }

    const currentUser = await User.findOne({ _id: decodedJWT.id });

    // 3) Check if user still exists
    if (!currentUser) {
      return next(new AppError("User no longer exists", 401));
    }

    // 4) Check if user recently changed password.
    if (decodedJWT.iat && currentUser.changedPasswordAfterJWT(decodedJWT.iat)) {
      return next(
        new AppError("You recently changed password, please login again.", 401),
      );
    }

    // All being set, grant access to protected route.
    req.user = currentUser;
    next();
  },
);

// LOGOUT
export const logout = (req: Request, res: Response) => {
  const token = "loggedout";
  res.status(200).json({
    status: "success",
    message: "Goodbye, see you next time, goodluck",
    token,
  });
};

// RESTRICT PERMISSION
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
};

// UPDATE PASSWORD
export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user from collection
    const user: IUser = await User.findById(req.user?._id).select("+password");

    // 2) Check if posted current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return next(
        new AppError(
          "Your new password and confirm new password are not the same",
          401,
        ),
      );
    }

    // 3) If correct, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) log user in, send jwt
    const message = "Password changed successfully.";
    createSendToken(user, 200, req, res, message);
  },
);
