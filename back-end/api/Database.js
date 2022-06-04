import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';

import UserRouter from "../routes/userRoutes.js";
import ServicesBookingRouter from "../routes/ServicesBookingRouter.js";
import UploadRouter from "../routes/UploadFilesRouter.js";
import bodyParser from "body-parser";
import { __dirname } from "../path.js";
import vhost from "vhost";

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

const name = {
  'demo1' : 'demdodjfkfk',
  'demo2' : 'demfjfkghgghghg'
}

app.get("/" , (req, res) => {
  res.status(200).send("<h1>a;;</h1>")
})

const cats = express();
const dogs = express();

const domain = "localhost";

app.use(vhost(`demo.${domain}`, cats));

// a router for the cats subdomain
cats.get("/", (req, res) => {
  res.send("here is the cats subdomain");
});

// Database information
const MONGODB_USER_NAME = process.env.MONGODB_USER_NAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_DATABASE_NAME = process.env.MONGODB_DATABASE_NAME
const MONGODB_URL = `mongodb+srv://${MONGODB_USER_NAME}:${MONGODB_PASSWORD}@cluster0.5qwwt.mongodb.net/${MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`

export const database = () => {
  mongoose.connect(MONGODB_URL) 
  .then(() => console.log("Connected To Database"))
  .then(() => {
    console.log(`connected with PORT: ${PORT}`)
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
  return '';
}