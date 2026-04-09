import type { Request, Response, NextFunction } from "express";
export declare const signUp: (req: Request, res: Response, next: NextFunction) => void;
export declare const login: (req: Request, res: Response, next: NextFunction) => void;
export declare const protect: (req: Request, res: Response, next: NextFunction) => void;
export declare const logout: (req: Request, res: Response) => void;
export declare const restrictTo: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const updatePassword: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authController.d.ts.map