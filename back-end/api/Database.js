import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';

import UserRouter from "../routes/userRoutes.js";
import ServicesBookingRouter from "../routes/ServicesBookingRouter.js";
import UploadRouter from "../routes/UploadFilesRouter.js";
import SubdoimainRouter from '../routes/Subdoimain.js';
import bodyParser from "body-parser";
import { __dirname } from "../path.js";
import subdoimain from 'express-subdomain';
import vhost from "vhost";
import http from 'http';

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

app.use(vhost('mail.example.com', function (req, res) {
  console.log('demo')
  // handle req + res belonging to mail.example.com
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello from mail!')
}))

app.use(vhost('api.example.com', function (req, res) {
  // handle req + res belonging to api.example.com
  // pass the request to a standard Node.js HTTP server
  console.log('demo')
  httpServer.emit('request', req, res)
}))

// an external api server in any framework
var httpServer = http.createServer(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.end('hello from the api!')
})

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