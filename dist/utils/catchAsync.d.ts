import type { Request, Response, NextFunction } from "express";
declare const catchAsync: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
export default catchAsync;
//# sourceMappingURL=catchAsync.d.ts.map