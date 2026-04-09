import express from "express";
import { createWallet, getAllWallets, getWallet, updateWallet, deleteWallet, adminGetAllWallets, } from "../controllers/walletController.js";
import { protect, restrictTo } from "../controllers/authController.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getAllWallets).post(createWallet);
router.route("/:id").get(getWallet).patch(updateWallet).delete(deleteWallet);
router.use(restrictTo("admin"));
router.get("/getAllWallets", adminGetAllWallets);
export default router;
//# sourceMappingURL=walletRoutes.js.map