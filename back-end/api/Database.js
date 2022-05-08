import express from "express";
import mongoose from "mongoose";
import router from "../routes/userRoutes.js";
import cors from "cors";
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/users", router);



dotenv.config();

const MONGODB_USER_NAME = process.env.MONGODB_USER_NAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME
const MONGODB_URL = `mongodb+srv://${MONGODB_USER_NAME}:${MONGODB_PASSWORD}@cluster0.5qwwt.mongodb.net/${MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`

export const database = () => {
  mongoose.connect(MONGODB_URL) 
  .then(() => console.log("Connected To Database"))
  .then(() => {
    app.listen(PORT);
    console.log(`Connected post ${PORT}`);
  })
  .catch((err) => console.log(err));
  return '';
}