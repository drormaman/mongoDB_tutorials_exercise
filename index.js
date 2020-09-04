require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Tutorial = require("./models/tutorial");

app.use(express.json());

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
