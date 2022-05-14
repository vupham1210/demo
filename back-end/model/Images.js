import mongoose from "mongoose";

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  contentType: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
    unique: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  filesize: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: false
  },
}, {
  timestamps: true,
});

export const Images = mongoose.model("images", imageSchema);