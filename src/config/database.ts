import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

async function connectToDB() {
  try {
    if (DB_URL) {
      await mongoose.connect(DB_URL);
      console.log("Connected to the database");
    } else {
      throw new Error("DB connection string not found");
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// exporting the connection
export default connectToDB;
