import express from "express";
import { createTicket, getMyTickets, getTicketById, } from "../controllers/ticketController.js";
import { protect } from "../controllers/authController.js";
const router = express.Router();
router.use(protect);
router.post("/", createTicket);
router.get("/me", getMyTickets);
router.get("/:id", getTicketById);
export default router;
//# sourceMappingURL=ticketRoutes.js.map