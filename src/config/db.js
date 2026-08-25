// require("dotenv").config();
// const { MongoClient } = require("mongodb");

// let client;
// let db;

// /**
//  * Connects to MongoDB and caches the connection.
//  * If you already have your own MongoDB/mongoose connection elsewhere in
//  * your app, just replace this file with a require of that existing connection.
//  */
// async function connectDB() {
//   if (db) return db;

//   client = new MongoClient(process.env.MONGO_URI);
//   await client.connect();
//   db = client.db(process.env.MONGO_DB_NAME);

//   console.log(`[mongo] connected -> ${process.env.MONGO_DB_NAME}`);
//   return db;
// }

// async function closeDB() {
//   if (client) {
//     await client.close();
//     console.log("[mongo] connection closed");
//   }
// }

// module.exports = { connectDB, closeDB };




require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    // Return native MongoDB database instance
    return mongoose.connection.db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");
  } catch (err) {
    console.error("Error closing MongoDB:", err);
  }
};

module.exports = {
  connectDB,
  closeDB,
};