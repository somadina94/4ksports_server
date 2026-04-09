import express from "express";
import {
  getMyBalanceTransactions,
  getMyBalanceWallet,
} from "../controllers/balanceController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);
router.get("/balance-wallet/me", getMyBalanceWallet);
router.get("/balance-transactions/me", getMyBalanceTransactions);

export default router;
