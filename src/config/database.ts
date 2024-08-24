const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;

async function main() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// exporting the connection
exports.connectToDB = main;
