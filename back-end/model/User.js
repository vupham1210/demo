import mongoose from 'mongoose';

export const User = () => {

  const Schema = mongoose.Schema;
  const userSchema = new Schema({
    username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
      },
      address: {
        type: String,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      image: {
        type: String,
      },
    });
    mongoose.model("User", userSchema);
    
} 
