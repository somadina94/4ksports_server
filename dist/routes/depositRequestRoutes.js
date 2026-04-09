import express from "express";
import { approveAdminDepositRequest, createMyDepositRequest, getAdminDepositRequests, getMyDepositRequests, rejectAdminDepositRequest, } from "../controllers/depositRequestController.js";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router();
const adminRouter = express.Router();
router.use(protect);
router.post("/", createMyDepositRequest);
router.get("/me", getMyDepositRequests);
adminRouter.use(protect, restrictTo("admin"));
adminRouter.get("/", getAdminDepositRequests);
adminRouter.patch("/:id/approve", approveAdminDepositRequest);
adminRouter.patch("/:id/reject", rejectAdminDepositRequest);
export { router as depositRequestRouter, adminRouter as adminDepositRequestRouter };
//# sourceMappingURL=depositRequestRoutes.js.map