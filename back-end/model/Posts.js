import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  thumbnail: {
    type: String,
    required: false
  },
  gallery: {
    type: [string],
    required: false
  },
  postIn: {
    type: Date,
    required: true,
  },
  status: {
    type: string,
    required: true,
  },
  // Booking Post
  location:{
    type: String,
    required: false
  },
  startDate: {
    type: Date,
    required: true,
  },
  startEnd: {
    type: Date,
    required: true,
  },
  author: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
});

export const ServicesBooking = mongoose.model("Services", ServicesSchema);