import catchAsync from "../utils/catchAsync.js";
import Event from "../models/eventModel.js";
export const getUpcomingEvents = catchAsync(async (req, res, next) => {
    const events = await Event.find({ status: "notstarted" }).sort({ eventDate: 1 });
    res.status(200).json({
        status: "success",
        data: { events },
    });
});
export const getEventById = catchAsync(async (req, res, next) => {
    const event = await Event.findById(req.params.id);
    res.status(200).json({
        status: "success",
        data: { event },
    });
});
//# sourceMappingURL=eventController.js.map