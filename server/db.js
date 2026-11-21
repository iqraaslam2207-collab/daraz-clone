import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export async function connectDB(dbName) {
  const uri = process.env.MONGO_URI || `mongodb://127.0.0.1:27017/${dbName}`;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log(`Using installed MongoDB: ${uri}`);
    return;
  } catch (error) {
    console.log("Installed MongoDB did not answer. Starting a temporary database.");
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log("Temporary MongoDB is running for this project.");
  }
}
