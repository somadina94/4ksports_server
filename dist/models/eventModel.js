import mongoose, { Model } from "mongoose";
import { EventStatus } from "../constants/enums.js";
const eventSchema = new mongoose.Schema({
    providerId: { type: Number, required: true, index: true, unique: true },
    apiId: { type: Number, required: true, index: true },
    league: {
        id: { type: Number },
        name: { type: String, required: true },
        country: { type: String },
    },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    eventDate: { type: Date, required: true, index: true },
    status: {
        type: String,
        enum: Object.values(EventStatus),
        default: EventStatus.NOT_STARTED,
        index: true,
    },
    scores: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 },
    },
    odds: {
        odds_home: { type: Number, default: null },
        odds_draw: { type: Number, default: null },
        odds_away: { type: Number, default: null },
        odds_over_15: { type: Number, default: null },
        odds_over_25: { type: Number, default: null },
        odds_over_35: { type: Number, default: null },
        odds_under_15: { type: Number, default: null },
        odds_under_25: { type: Number, default: null },
        odds_under_35: { type: Number, default: null },
        odds_btts_yes: { type: Number, default: null },
        odds_btts_no: { type: Number, default: null },
    },
    lastSyncedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
eventSchema.index({ status: 1, eventDate: 1 });
const Event = mongoose.model("Event", eventSchema);
export default Event;
//# sourceMappingURL=eventModel.js.map