import express from "express";
import { signUp, login, protect } from "../controllers/authController.js";
import { deleteUser, getAllUsers, getUser, updateUser, } from "../controllers/userController.js";
const router = express.Router();
router.post("/signup", signUp);
router.post("/login", login);
router.use(protect);
router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
export default router;
//# sourceMappingURL=userRoutes.js.map