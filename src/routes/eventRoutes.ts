import express from "express";
import { getEventById, getUpcomingEvents } from "../controllers/eventController.js";

const router = express.Router();

router.get("/upcoming", getUpcomingEvents);
router.get("/:id", getEventById);

export default router;
