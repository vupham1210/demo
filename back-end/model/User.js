import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstname:{
    type: String,
  },
  lastname:{
    type: String,
  },
  username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: false,
    },
    image: {
      type: String,
    },
    refreshToken:{
      type: String,
    }
  },{
    timestamps: true
  });

export const User = mongoose.model("User", userSchema);
