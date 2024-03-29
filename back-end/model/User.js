import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
      unique: false,
    },
    fullname:{
      type: String,
    },
    birth_day: {
      type: Date,
    },
    personal_id:{
      type: String,
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      default: false,
    },
    typeU: {
      type: String,
    },
    refreshToken:{
      type: String,
    }
  },{
    timestamps: true
  });

export const User = mongoose.model("User", userSchema);
