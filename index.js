const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 3000;

const app = express();

const DBConfig = process.env.DB_HOST;

const authRequest = require("./routes/auth");

app.use(express.json());
app.use(authRequest);

mongoose
  .connect(DBConfig)
  .then(() => {
    console.log("Connect to Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on port ${PORT}`);
});
