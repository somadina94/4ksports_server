import type { IUser } from "../../src/types/user.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
