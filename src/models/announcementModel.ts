import mongoose, { Model } from "mongoose";
import type { IAnnouncement } from "../types/betting.js";

const announcementSchema = new mongoose.Schema<IAnnouncement>(
  {
    body: { type: String, required: true, trim: true },
    expiresAt: { type: Date, required: true, index: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

announcementSchema.index({ expiresAt: 1, createdAt: -1 });

const Announcement: Model<IAnnouncement> = mongoose.model<IAnnouncement>(
  "Announcement",
  announcementSchema,
);

export default Announcement;
