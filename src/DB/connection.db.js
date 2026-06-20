import mongoose from "mongoose";
import { DB_URL } from "../../config/config.service.js";

export const connectDB = async () => {
  try {
    const result = await mongoose.connect(DB_URL);
    await UserModel.syncIndexes();

    console.log("DB connected 🚀");
  } catch (error) {
    console.log("DB failed to connect ❌");
  }
};
