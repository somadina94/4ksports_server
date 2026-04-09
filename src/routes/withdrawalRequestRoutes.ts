import express from "express";
import {
  approveAdminWithdrawalRequest,
  createMyWithdrawalRequest,
  getAdminWithdrawalRequests,
  getMyWithdrawalRequests,
  rejectAdminWithdrawalRequest,
} from "../controllers/withdrawalRequestController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();
const adminRouter = express.Router();

router.use(protect);
router.post("/", createMyWithdrawalRequest);
router.get("/me", getMyWithdrawalRequests);

adminRouter.use(protect, restrictTo("admin"));
adminRouter.get("/", getAdminWithdrawalRequests);
adminRouter.patch("/:id/approve", approveAdminWithdrawalRequest);
adminRouter.patch("/:id/reject", rejectAdminWithdrawalRequest);

export {
  router as withdrawalRequestRouter,
  adminRouter as adminWithdrawalRequestRouter,
};
