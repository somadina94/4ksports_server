import express from "express";
import {
  signUp,
  login,
  protect,
  updatePassword,
} from "../controllers/authController.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.patch("/update-password", protect, updatePassword);
router.use(protect);

router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
