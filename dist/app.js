import express from "express";
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import userRoutes from "./routes/userRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import balanceRoutes from "./routes/balanceRoutes.js";
import { adminPlatformWalletRouter, platformWalletRouter, } from "./routes/platformWalletRoutes.js";
import { adminDepositRequestRouter, depositRequestRouter, } from "./routes/depositRequestRoutes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/wallets", walletRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1", balanceRoutes);
app.use("/api/v1/platform-wallets", platformWalletRouter);
app.use("/api/v1/deposit-requests", depositRequestRouter);
app.use("/api/v1/admin/platform-wallets", adminPlatformWalletRouter);
app.use("/api/v1/admin/deposit-requests", adminDepositRequestRouter);
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map