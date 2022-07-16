import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    idSend: {
        type: String,
        required: true,
    },
    idReceive: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    content: {
        type: Object,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accept', 'reject'], 
        default: 'pending'
    },
    type: {
        type: String,
        required: true,
        enum: ['request', 'reply', 'orther'], 
        default: 'orther'
    }
}, {
    timestamps: true,
});

export const Contact = mongoose.model("contact", ContactSchema);