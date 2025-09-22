// server/config/db.js
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); // .env file ke variables ko load karne ke liye
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb !');
  } catch (err) {
    console.error('connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;