import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';

import UserRouter from "../routes/userRoutes.js";
import ServicesBookingRouter from "../routes/ServicesBookingRouter.js";
import UploadRouter from "../routes/UploadFilesRouter.js";
import bodyParser from "body-parser";

import { __dirname } from "../path.js";

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 5000;
// ENV Configure
dotenv.config();

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());

app.use("/users", UserRouter);
app.use("/booking", ServicesBookingRouter);
app.use("/upload", UploadRouter);

// Database information
const MONGODB_USER_NAME = process.env.MONGODB_USER_NAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME
const MONGODB_URL = `mongodb+srv://${MONGODB_USER_NAME}:${MONGODB_PASSWORD}@cluster0.5qwwt.mongodb.net/${MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`

export const database = () => {
  mongoose.connect(MONGODB_URL) 
  .then(() => console.log("Connected To Database"))
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
  return '';
}