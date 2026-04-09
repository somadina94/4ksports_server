import express from "express";
import {
  getMyBalanceTransactions,
  getMyBalanceWallet,
} from "../controllers/balanceController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.get("/balance-wallet/me", protect, getMyBalanceWallet);
router.get("/balance-transactions/me", protect, getMyBalanceTransactions);

export default router;
