const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRoutes = require("./routes/api");

const app = express();
const port = process.env.PORT;
const MONGODB_URI = 'mongodb+srv://clarice:root@claricecluster.8hretxk.mongodb.net/donation';

app.use(express.json());
app.use(cors());
// user route
app.use("", require("./routes/userRoutes"));
// donations routes
app.use("/api", apiRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
