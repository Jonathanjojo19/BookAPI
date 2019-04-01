const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas connection with Mongoose
const mongoose = require("mongoose");
const dbConfig = require("./config/database.config");

mongoose.set("useNewUrlParser", true);
mongoose.connect(
    `mongodb+srv://${dbConfig.user}:${dbConfig.password}@${dbConfig.server}/${
        dbConfig.database}`
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.on("open", () => {
    console.log("Connected");
});

// Routes
app.use("/", routes);

const server = app.listen(port, () => {
    console.log("Express running on port", port);
});