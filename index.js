require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Tutorial = require("./models/tutorial");

app.use(express.json());

// GET - get all tutorials
/*
api/tutorials?title=kw
find all Tutorials which title contains 'kw'
*/
app.get("/api/tutorials", (req, res) => {});

// GET - get tutorial by id
app.get("/api/tutorials/:id", (req, res) => {});

// POST - add new tutorial
app.post("/api/tutorials", (req, res) => {});

// PUT - update tutorial by id
app.put("/api/tutorials/:id", (req, res) => {});

// DELETE - remove tutorial by id
app.delete("/api/tutorials/:id", (req, res) => {});

// DELETE - remove all tutorials
app.delete("/api/tutorials", (req, res) => {});

// GET - find all published Tutorials
app.get("api/tutorials/published", (req, res) => {});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
