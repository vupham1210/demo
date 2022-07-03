import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    idService: {
        type: String,
        required: true,
    },
    titleService: {
        type: String,
        required: true,
    },
    idAuthor: {
        type: String,
        required: true,
    },
    timePick: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'success', 'fail'], 
        default: 'pending'
    },
    ortherInfo: {
        type: Object,
        required: false,
    }
}, {
    timestamps: true,
});

export const ScheduleBooking = mongoose.model("schedule", ScheduleSchema);