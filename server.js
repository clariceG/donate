const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors package

const app = express();

const port = process.env.PORT;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// user route
app.use("", require("./routes/userRoutes"));

mongoose
  .connect(process.env.STRING)
  .then((result) => {
    console.log("DB Connected!");
    app.listen(process.env.PORT);
    console.log("Server running on port " + process.env.PORT);
  })
  .catch((err) => {
    console.log(err.message);
  });
