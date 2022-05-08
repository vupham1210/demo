const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/userRoutes");
const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/users", router);


const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected To Database"))
  .then(() => {
    app.listen(5000);
    console.log("Connected post 5000");
  })
  .catch((err) => console.log(err));