const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to DB");

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("Connected to DB"))
    .catch((error) => console.log("Error connecting to DB - ", error.message));

const tutorialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    dateCreated: Date,
    creators: [{ type: String }],
    description: String,
    price: Number,
});

module.exports = mongoose.model("Tutorial", tutorialSchema);
