import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
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
  custom_field: {
    type: Array,
    required: false
  },
  thumbnail: {
    type: Object,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['publish', 'pending', 'draft', 'private'], 
    default: 'pending'
  },
  // Booking Post
  location:{
    type: String,
    required: false
  },
  startDate: {
    type: Date,
    required: false,
  },
  startEnd: {
    type: Date,
    required: false,
  },
  time:{
    type: Array,
    required: false,
  },
  author: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
});

export const ServicesBooking = mongoose.model("Services", ServicesSchema);