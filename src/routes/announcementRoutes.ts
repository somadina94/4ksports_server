import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  listAnnouncementsAdmin,
} from "../controllers/announcementController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = express.Router();
const adminRouter = express.Router();

router.get("/", getActiveAnnouncements);

adminRouter.use(protect, restrictTo("admin"));
adminRouter.get("/", listAnnouncementsAdmin);
adminRouter.post("/", createAnnouncement);
adminRouter.delete("/:id", deleteAnnouncement);

export { router as announcementRouter, adminRouter as adminAnnouncementRouter };
