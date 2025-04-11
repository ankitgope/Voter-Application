const mongoose = require("mongoose");
require("dotenv").config();

// Define the MongoDB connection URL
const mongoURL = process.env.MONGODB_URL_LOCAL; //|| "mongodb://localhost:27017/votingSystem";
// const mongoURL = process.env.MONGODB_URL

//  set up MongoDB connection
mongoose.connect(mongoURL)
  .then(() => console.log("Connected to MongoDB server"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Get the default connection
// Mongoose maintain a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define event listner for database connection

db.on("connected", () => {
  console.log("connection established");
});

db.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
module.exports = db;
