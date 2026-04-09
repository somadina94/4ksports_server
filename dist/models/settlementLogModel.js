import mongoose, { Model } from "mongoose";
import { SelectionStatus } from "../constants/enums.js";
const settlementLogSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
        index: true,
    },
    ticketSelectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketSelection",
        required: true,
        unique: true,
        index: true,
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: Object.values(SelectionStatus),
        required: true,
    },
    reason: { type: String, required: true },
    settledAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
const SettlementLog = mongoose.model("SettlementLog", settlementLogSchema);
export default SettlementLog;
//# sourceMappingURL=settlementLogModel.js.map