import express from "express";
import { getActivePlatformWallets, createPlatformWallet, getAdminPlatformWallets, updatePlatformWallet, deletePlatformWallet, } from "../controllers/platformWalletController.js";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router();
const adminRouter = express.Router();
router.get("/", getActivePlatformWallets);
adminRouter.use(protect, restrictTo("admin"));
adminRouter.get("/", getAdminPlatformWallets);
adminRouter.post("/", createPlatformWallet);
adminRouter.patch("/:id", updatePlatformWallet);
adminRouter.delete("/:id", deletePlatformWallet);
export { router as platformWalletRouter, adminRouter as adminPlatformWalletRouter };
//# sourceMappingURL=platformWalletRoutes.js.map